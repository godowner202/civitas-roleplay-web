import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PlayerStats {
  identifier: string;
  name: string;
  money?: number;
  bank?: number;
  job?: string;
  job_grade?: number;
  playtime?: number;
  last_seen?: string;
  [key: string]: any;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { playerId } = await req.json();
    
    console.log('Fetching player stats for:', playerId);

    // Get database credentials from environment
    const DB_ENDPOINT = Deno.env.get('FIVEM_DB_HOST');
    const DB_USER = Deno.env.get('FIVEM_DB_USER'); 
    const DB_PASSWORD = Deno.env.get('FIVEM_DB_PASSWORD');
    const DB_NAME = Deno.env.get('FIVEM_DB_NAME');

    if (!DB_ENDPOINT || !DB_USER || !DB_PASSWORD || !DB_NAME) {
      console.error('Missing database credentials');
      return new Response(
        JSON.stringify({ error: 'Database credentials not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse hostname and port from endpoint
    let hostname, port;
    if (DB_ENDPOINT.includes(':')) {
      [hostname, port] = DB_ENDPOINT.split(':');
      port = parseInt(port);
    } else {
      hostname = DB_ENDPOINT;
      port = 3306;
    }

    console.log(`Connecting to MySQL database: ${hostname}:${port}/${DB_NAME}`);

    // Import MySQL driver
    const { Client } = await import("https://deno.land/x/mysql@v2.12.1/mod.ts");

    // Create MySQL connection
    const client = await new Client().connect({
      hostname: hostname,
      port: port,
      username: DB_USER,
      password: DB_PASSWORD,
      db: DB_NAME,
    });

    console.log('Successfully connected to FiveM database');

    let playerStats: PlayerStats | null = null;

    // If no specific player ID provided, get all players (limited)
    if (!playerId) {
      console.log('Fetching all players...');
      
      // Start with a simple query to test connection
      const playersResult = await client.execute(`SELECT * FROM players LIMIT 20`);

      const players = (playersResult.rows || []).map((row: any) => {
        const player: any = {};
        playersResult.fields?.forEach((field, index) => {
          player[field.name] = row[index];
        });
        return player;
      });

      await client.close();
      
      return new Response(JSON.stringify({ 
        players,
        total: players.length 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get specific player by license from players table
    console.log('Searching for player with license:', playerId);
    
    const playerResult = await client.execute(`
      SELECT * FROM players 
      WHERE license = ?
      LIMIT 1
    `, [playerId]);

    if (playerResult.rows && playerResult.rows.length > 0) {
      const row = playerResult.rows[0];
      playerStats = {};
      
      playerResult.fields?.forEach((field, index) => {
        playerStats![field.name] = row[index];
      });

      // Try to get additional data from other tables if they exist
      try {
        // Check for job data
        if (playerStats.job) {
          const jobResult = await client.execute(`
            SELECT * FROM jobs WHERE name = ? LIMIT 1
          `, [playerStats.job]);
          
          if (jobResult.rows && jobResult.rows.length > 0) {
            const jobRow = jobResult.rows[0];
            const jobData: any = {};
            jobResult.fields?.forEach((field, index) => {
              jobData[field.name] = jobRow[index];
            });
            playerStats.jobData = jobData;
          }
        }

        // Check for vehicles
        const vehicleResult = await client.execute(`
          SELECT * FROM owned_vehicles WHERE owner = ? LIMIT 10
        `, [playerStats.identifier || playerId]);
        
        if (vehicleResult.rows && vehicleResult.rows.length > 0) {
          const vehicles = vehicleResult.rows.map((row: any) => {
            const vehicle: any = {};
            vehicleResult.fields?.forEach((field, index) => {
              vehicle[field.name] = row[index];
            });
            return vehicle;
          });
          playerStats.vehicles = vehicles;
        }

      } catch (additionalError) {
        console.log('Could not fetch additional data:', additionalError);
      }
    }

    await client.close();

    if (!playerStats) {
      return new Response(
        JSON.stringify({ error: 'Player not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify(playerStats), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in get-player-stats function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch player stats', 
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});