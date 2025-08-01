import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FiveMPlayer {
  id: number;
  name: string;
  ping: number;
}

interface ServerData {
  online: boolean;
  playerCount: number;
  maxPlayers: number;
  players: FiveMPlayer[];
  serverName: string;
  hostname: string;
  error?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SERVER_IP = 'node5.herculhosting.nl:30259';
    const timeout = 10000; // 10 second timeout

    console.log('Fetching server status from:', SERVER_IP);

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      // Fetch player data
      const playersResponse = await fetch(`http://${SERVER_IP}/players.json`, {
        signal: controller.signal,
        headers: { 'User-Agent': 'Civitas-RP-Website/1.0' }
      });
      
      // Fetch server info
      const infoResponse = await fetch(`http://${SERVER_IP}/info.json`, {
        signal: controller.signal,
        headers: { 'User-Agent': 'Civitas-RP-Website/1.0' }
      });

      // Fetch dynamic info
      const dynamicResponse = await fetch(`http://${SERVER_IP}/dynamic.json`, {
        signal: controller.signal,
        headers: { 'User-Agent': 'Civitas-RP-Website/1.0' }
      });

      clearTimeout(timeoutId);

      if (!playersResponse.ok || !infoResponse.ok || !dynamicResponse.ok) {
        throw new Error('Server API not responding properly');
      }

      const players: FiveMPlayer[] = await playersResponse.json();
      const info = await infoResponse.json();
      const dynamic = await dynamicResponse.json();

      const serverData: ServerData = {
        online: true,
        playerCount: players.length,
        maxPlayers: info.vars?.sv_maxclients || 64,
        players: players.slice(0, 10), // Limit to 10 players for privacy
        serverName: info.vars?.sv_projectName || 'Civitas RP',
        hostname: dynamic.hostname || SERVER_IP
      };

      console.log('Server data fetched successfully:', {
        playerCount: serverData.playerCount,
        maxPlayers: serverData.maxPlayers,
        online: serverData.online
      });

      return new Response(JSON.stringify(serverData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error('Server fetch error:', fetchError);

      // Return offline status
      const offlineData: ServerData = {
        online: false,
        playerCount: 0,
        maxPlayers: 64,
        players: [],
        serverName: 'Civitas RP',
        hostname: SERVER_IP,
        error: fetchError.name === 'AbortError' ? 'Timeout' : 'Server unreachable'
      };

      return new Response(JSON.stringify(offlineData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Edge function error:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      online: false,
      playerCount: 0,
      maxPlayers: 64,
      players: [],
      serverName: 'Civitas RP',
      hostname: 'node5.herculhosting.nl:30259'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});