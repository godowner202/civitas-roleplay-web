import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting FiveM to Supabase sync...');

    // Get FiveM database credentials
    const DB_ENDPOINT = Deno.env.get('FIVEM_DB_HOST');
    const DB_USER = Deno.env.get('FIVEM_DB_USER'); 
    const DB_PASSWORD = Deno.env.get('FIVEM_DB_PASSWORD');
    const DB_NAME = Deno.env.get('FIVEM_DB_NAME');

    if (!DB_ENDPOINT || !DB_USER || !DB_PASSWORD || !DB_NAME) {
      throw new Error('FiveM database credentials not configured');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse FiveM hostname and port
    let hostname, port;
    if (DB_ENDPOINT.includes(':')) {
      [hostname, port] = DB_ENDPOINT.split(':');
      port = parseInt(port);
    } else {
      hostname = DB_ENDPOINT;
      port = 3306;
    }

    console.log(`Connecting to FiveM database: ${hostname}:${port}/${DB_NAME}`);

    // Import MySQL driver and connect
    const { Client } = await import("https://deno.land/x/mysql@v2.12.1/mod.ts");
    const fivemClient = await new Client().connect({
      hostname: hostname,
      port: port,
      username: DB_USER,
      password: DB_PASSWORD,
      db: DB_NAME,
    });

    console.log('Connected to FiveM database successfully');

    // Get all players from FiveM database with explicit column names
    const playersResult = await fivemClient.execute(`
      SELECT id, userid, citizenid, cid, license, name, money, charinfo, job 
      FROM players 
      ORDER BY id
    `);
    console.log(`Found ${playersResult.rows?.length || 0} players in FiveM database`);

    const syncedPlayers = [];
    const errors = [];

    if (playersResult.rows && playersResult.rows.length > 0) {
      // Process players in batches
      const batchSize = 50;
      const batches = [];
      
      for (let i = 0; i < playersResult.rows.length; i += batchSize) {
        batches.push(playersResult.rows.slice(i, i + batchSize));
      }

      for (const batch of batches) {
        const playersToSync = batch.map((row: any, index: number) => {
          try {
            console.log(`Processing player ${index + 1}, raw row:`, row);
            
            // Parse based on object properties (not array indices)
            const player = {
              fivem_id: row.id,
              userid: row.userid,
              citizenid: row.citizenid,
              cid: row.cid,
              license: row.license,
              name: row.name,
              money: {},
              charinfo: {},
              job: {}
            };

            console.log(`Player ${index + 1} basic data:`, {
              license: player.license,
              name: player.name,
              raw_money: row.money,
              raw_charinfo: row.charinfo,
              raw_job: row.job
            });

            // Parse JSON columns using object properties
            try {
              if (row.money && typeof row.money === 'string') {
                player.money = JSON.parse(row.money);
                console.log(`Player ${index + 1} parsed money:`, player.money);
              }
            } catch (e) {
              console.log(`Error parsing money for license ${player.license}:`, e);
              player.money = {};
            }

            try {
              if (row.charinfo && typeof row.charinfo === 'string') {
                player.charinfo = JSON.parse(row.charinfo);
                console.log(`Player ${index + 1} parsed charinfo:`, player.charinfo);
              }
            } catch (e) {
              console.log(`Error parsing charinfo for license ${player.license}:`, e);
              player.charinfo = {};
            }

            try {
              if (row.job && typeof row.job === 'string') {
                player.job = JSON.parse(row.job);
                console.log(`Player ${index + 1} parsed job:`, player.job);
              }
            } catch (e) {
              console.log(`Error parsing job for license ${player.license}:`, e);
              player.job = {};
            }

            console.log(`Player ${index + 1} final data:`, player);
            return player;
          } catch (error) {
            console.log('Error processing player row:', error);
            return null;
          }
        }).filter(player => {
          const isValid = player !== null && player.license;
          console.log(`Player validation: license=${player?.license}, valid=${isValid}`);
          return isValid;
        });

        console.log(`Batch ready for upsert: ${playersToSync.length} players`);
        console.log('Players to sync:', playersToSync.map(p => ({ license: p.license, name: p.name })));

        // Upsert batch to Supabase
        if (playersToSync.length > 0) {
          console.log('Starting upsert to Supabase...');
          const { data, error } = await supabase
            .from('fivem_players')
            .upsert(playersToSync, { 
              onConflict: 'license',
              ignoreDuplicates: false 
            })
            .select('license');

          if (error) {
            console.error('Error upserting batch:', error);
            errors.push(`Batch error: ${error.message}`);
          } else {
            // Count successful upserts
            const upsertedCount = playersToSync.length; // All players in batch were processed
            syncedPlayers.push(...playersToSync.map(p => ({ license: p.license })));
            console.log(`Successfully synced batch: ${upsertedCount} players`);
            console.log('Synced player licenses:', playersToSync.map(p => p.license));
          }
        } else {
          console.log('No valid players in batch to sync');
        }
      }
    }

    await fivemClient.close();

    // Update sync timestamp
    const syncStats = {
      total_fivem_players: playersResult.rows?.length || 0,
      synced_players: syncedPlayers.length,
      errors: errors.length,
      sync_completed_at: new Date().toISOString()
    };

    console.log('Sync completed:', syncStats);

    return new Response(JSON.stringify({
      success: true,
      message: 'FiveM data sync completed successfully',
      stats: syncStats,
      errors: errors
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in sync-fivem-data function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Sync failed', 
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});