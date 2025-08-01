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
    // Parse request body to get citizenid
    const { citizenid } = await req.json();
    
    if (!citizenid) {
      return new Response(
        JSON.stringify({ error: 'Citizenid is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Fetching vehicles for citizenid: ${citizenid}`);

    // Get FiveM database credentials
    const DB_ENDPOINT = Deno.env.get('FIVEM_DB_HOST');
    const DB_USER = Deno.env.get('FIVEM_DB_USER'); 
    const DB_PASSWORD = Deno.env.get('FIVEM_DB_PASSWORD');
    const DB_NAME = Deno.env.get('FIVEM_DB_NAME');

    if (!DB_ENDPOINT || !DB_USER || !DB_PASSWORD || !DB_NAME) {
      throw new Error('FiveM database credentials not configured');
    }

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

    // Get vehicles from FiveM database using citizenid
    const vehiclesResult = await fivemClient.execute(`
      SELECT * FROM player_vehicles 
      WHERE citizenid = ?
      ORDER BY id
    `, [citizenid]);

    console.log(`Found ${vehiclesResult.rows?.length || 0} vehicles for citizenid ${citizenid}`);

    let vehicles = [];
    if (vehiclesResult.rows && vehiclesResult.rows.length > 0) {
      vehicles = vehiclesResult.rows.map((row: any) => {
        // Parse vehicle data if it's JSON
        let vehicleData = {};
        try {
          if (row.mods && typeof row.mods === 'string') {
            vehicleData = JSON.parse(row.mods);
          }
        } catch (e) {
          console.log('Error parsing vehicle mods:', e);
        }

        return {
          id: row.id,
          citizenid: row.citizenid,
          license: row.license,
          vehicle: row.vehicle,
          hash: row.hash,
          mods: vehicleData,
          plate: row.plate,
          fakeplate: row.fakeplate,
          garage: row.garage,
          fuel: row.fuel,
          engine: row.engine,
          body: row.body,
          state: row.state,
          depotprice: row.depotprice,
          drivingdistance: row.drivingdistance,
          status: row.status
        };
      });
    }

    await fivemClient.close();

    return new Response(JSON.stringify({
      success: true,
      vehicles: vehicles,
      count: vehicles.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in get-player-vehicles function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch vehicles', 
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});