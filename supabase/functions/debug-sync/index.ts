import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔍 DEBUG: Starting simple test sync...');

    // Get FiveM database credentials
    const DB_ENDPOINT = Deno.env.get('FIVEM_DB_HOST');
    const DB_USER = Deno.env.get('FIVEM_DB_USER'); 
    const DB_PASSWORD = Deno.env.get('FIVEM_DB_PASSWORD');
    const DB_NAME = Deno.env.get('FIVEM_DB_NAME');

    let hostname, port;
    if (DB_ENDPOINT.includes(':')) {
      [hostname, port] = DB_ENDPOINT.split(':');
      port = parseInt(port);
    } else {
      hostname = DB_ENDPOINT;
      port = 3306;
    }

    // Connect to FiveM database
    const { Client } = await import("https://deno.land/x/mysql@v2.12.1/mod.ts");
    const fivemClient = await new Client().connect({
      hostname: hostname,
      port: port,
      username: DB_USER,
      password: DB_PASSWORD,
      db: DB_NAME,
    });

    console.log('✅ Connected to FiveM database');

    // Get first player only for testing
    const playersResult = await fivemClient.execute(`
      SELECT id, userid, citizenid, cid, license, name, money, charinfo, job 
      FROM players 
      LIMIT 1
    `);

    console.log('📊 Query result:', {
      rowCount: playersResult.rows?.length,
      fields: playersResult.fields?.map(f => f.name)
    });

    if (playersResult.rows && playersResult.rows.length > 0) {
      const row = playersResult.rows[0];
      console.log('🎯 RAW ROW DATA:', row);
      
      const testPlayer = {
        fivem_id: row[0],
        userid: row[1],
        citizenid: row[2],
        cid: row[3],
        license: row[4],
        name: row[5],
        money: {},
        charinfo: {},
        job: {}
      };

      console.log('🏗️ BASIC PLAYER OBJECT:', testPlayer);

      // Try to parse JSON data
      try {
        if (row[6]) {
          console.log('💰 RAW MONEY DATA:', row[6], typeof row[6]);
          testPlayer.money = typeof row[6] === 'string' ? JSON.parse(row[6]) : row[6];
          console.log('💰 PARSED MONEY:', testPlayer.money);
        }
      } catch (e) {
        console.log('❌ MONEY PARSE ERROR:', e);
      }

      try {
        if (row[7]) {
          console.log('👤 RAW CHARINFO DATA:', row[7], typeof row[7]);
          testPlayer.charinfo = typeof row[7] === 'string' ? JSON.parse(row[7]) : row[7];
          console.log('👤 PARSED CHARINFO:', testPlayer.charinfo);
        }
      } catch (e) {
        console.log('❌ CHARINFO PARSE ERROR:', e);
      }

      try {
        if (row[8]) {
          console.log('💼 RAW JOB DATA:', row[8], typeof row[8]);
          testPlayer.job = typeof row[8] === 'string' ? JSON.parse(row[8]) : row[8];
          console.log('💼 PARSED JOB:', testPlayer.job);
        }
      } catch (e) {
        console.log('❌ JOB PARSE ERROR:', e);
      }

      console.log('🎯 FINAL TEST PLAYER:', testPlayer);

      // Test Supabase insert
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      console.log('🚀 Attempting Supabase upsert...');

      const { data, error } = await supabase
        .from('fivem_players')
        .upsert([testPlayer], { 
          onConflict: 'license',
          ignoreDuplicates: false 
        })
        .select('license, firstname, lastname');

      if (error) {
        console.log('❌ SUPABASE ERROR:', error);
      } else {
        console.log('✅ SUPABASE SUCCESS:', data);
      }

      await fivemClient.close();

      return new Response(JSON.stringify({
        success: true,
        testPlayer,
        supabaseResult: { data, error: error?.message }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'No players found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('💥 FATAL ERROR:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      stack: error.stack 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});