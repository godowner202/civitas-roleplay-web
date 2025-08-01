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
      
      const playersResult = await client.execute(`SELECT * FROM players LIMIT 20`);

      const players = (playersResult.rows || []).map((row: any) => {
        // Parse the data based on column positions
        const player: any = {
          id: row[0],           // Column 1: id
          userid: row[1],       // Column 2: userid  
          citizenid: row[2],    // Column 3: citizenid
          cid: row[3],          // Column 4: cid
          license: row[4],      // Column 5: license
          name: row[5],         // Column 6: name
          money: row[6],        // Column 7: money (JSON)
          charinfo: row[7],     // Column 8: charinfo (JSON)
          job: row[8]           // Column 9: job (JSON)
        };

        // Parse JSON data
        try {
          if (player.money && typeof player.money === 'string') {
            player.moneyData = JSON.parse(player.money);
            player.cash = player.moneyData.cash || 0;
            player.bank = player.moneyData.bank || 0;
          }
        } catch (e) {
          console.log('Error parsing money JSON for player:', player.license);
          player.cash = 0;
          player.bank = 0;
        }

        try {
          if (player.charinfo && typeof player.charinfo === 'string') {
            player.charinfoData = JSON.parse(player.charinfo);
            player.firstname = player.charinfoData.firstname;
            player.lastname = player.charinfoData.lastname;
            player.job = player.charinfoData.job?.name;
            player.job_grade = player.charinfoData.job?.grade?.level;
            player.job_grade_name = player.charinfoData.job?.grade?.name;
          }
        } catch (e) {
          console.log('Error parsing charinfo JSON for player:', player.license);
        }

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
      
      // Parse the data based on your database structure
      playerStats = {
        id: row[0],           // Column 1: id
        userid: row[1],       // Column 2: userid  
        citizenid: row[2],    // Column 3: citizenid
        cid: row[3],          // Column 4: cid
        license: row[4],      // Column 5: license
        name: row[5],         // Column 6: name
        money: row[6],        // Column 7: money (JSON)
        charinfo: row[7],     // Column 8: charinfo (JSON)
        job: row[8]           // Column 9: job (JSON)
      };

      console.log('Found player:', playerStats.name, 'with license:', playerStats.license);

      // Parse JSON data from money column (kolom 7)
      try {
        if (playerStats.money && typeof playerStats.money === 'string') {
          const moneyData = JSON.parse(playerStats.money);
          playerStats.cash = moneyData.cash || 0;
          playerStats.bank = moneyData.bank || 0;
          playerStats.crypto = moneyData.crypto || 0;
          console.log('Parsed money data:', { cash: playerStats.cash, bank: playerStats.bank });
        }
      } catch (e) {
        console.log('Error parsing money JSON:', e);
        playerStats.cash = 0;
        playerStats.bank = 0;
      }

      // Parse JSON data from charinfo column (kolom 8)
      try {
        if (playerStats.charinfo && typeof playerStats.charinfo === 'string') {
          const charinfoData = JSON.parse(playerStats.charinfo);
          playerStats.firstname = charinfoData.firstname;
          playerStats.lastname = charinfoData.lastname;
          playerStats.birthdate = charinfoData.birthdate;
          playerStats.sex = charinfoData.sex;
          playerStats.nationality = charinfoData.nationality;
          playerStats.phone = charinfoData.phone;
          
          // Job information
          if (charinfoData.job) {
            playerStats.job = charinfoData.job.name;
            playerStats.job_label = charinfoData.job.label;
            playerStats.job_grade = charinfoData.job.grade?.level;
            playerStats.job_grade_name = charinfoData.job.grade?.name;
            playerStats.job_payment = charinfoData.job.payment;
          }
          
          console.log('Parsed character data:', {
            name: `${playerStats.firstname} ${playerStats.lastname}`,
            job: playerStats.job,
            job_grade: playerStats.job_grade_name
          });
        }
      } catch (e) {
        console.log('Error parsing charinfo JSON:', e);
      }

      // Parse JSON data from job column (kolom 9)
      try {
        if (playerStats.job && typeof playerStats.job === 'string') {
          const jobData = JSON.parse(playerStats.job);
          playerStats.job_name = jobData.name;
          playerStats.job_label = jobData.label;
          playerStats.job_grade_level = jobData.grade?.level;
          playerStats.job_grade_name = jobData.grade?.name;
          playerStats.job_payment = jobData.payment;
          playerStats.job_isboss = jobData.isboss;
          
          console.log('Parsed job data:', {
            job: playerStats.job_name,
            grade: playerStats.job_grade_name,
            payment: playerStats.job_payment
          });
        }
      } catch (e) {
        console.log('Error parsing job JSON:', e);
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