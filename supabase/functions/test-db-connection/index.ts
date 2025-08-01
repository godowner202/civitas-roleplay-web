import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    console.log('Starting basic database test...');

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

    console.log(`Connecting to: ${hostname}:${port}/${DB_NAME} as ${DB_USER}`);

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

    console.log('Connected successfully!');

    // Test 1: Show all tables
    console.log('Getting all tables...');
    const tablesResult = await client.execute(`SHOW TABLES`);
    const tables = (tablesResult.rows || []).map((row: any) => row[0]);
    console.log('Available tables:', tables);

    // Test 2: Check if players table exists
    if (!tables.includes('players')) {
      await client.close();
      return new Response(JSON.stringify({ 
        error: 'Players table not found',
        availableTables: tables
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Test 3: Describe players table structure
    console.log('Describing players table...');
    const describeResult = await client.execute(`DESCRIBE players`);
    const columns = (describeResult.rows || []).map((row: any) => ({
      field: row[0],
      type: row[1],
      null: row[2],
      key: row[3],
      default: row[4],
      extra: row[5]
    }));
    console.log('Players table columns:', columns);

    // Test 4: Count rows in players table
    console.log('Counting players...');
    const countResult = await client.execute(`SELECT COUNT(*) as count FROM players`);
    const playerCount = countResult.rows?.[0]?.[0] || 0;
    console.log('Total players in database:', playerCount);

    // Test 5: Get first few rows (if any exist)
    let samplePlayers = [];
    if (playerCount > 0) {
      console.log('Getting sample players...');
      const sampleResult = await client.execute(`SELECT * FROM players LIMIT 3`);
      samplePlayers = (sampleResult.rows || []).map((row: any) => {
        const player: any = {};
        sampleResult.fields?.forEach((field, index) => {
          player[field.name] = row[index];
        });
        return player;
      });
      console.log('Sample players:', samplePlayers);
    }

    await client.close();

    return new Response(JSON.stringify({
      success: true,
      database: DB_NAME,
      tables: tables,
      playersTable: {
        exists: true,
        columns: columns,
        totalRows: playerCount,
        sampleData: samplePlayers
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Database test error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Database test failed', 
        details: error.message,
        stack: error.stack
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});