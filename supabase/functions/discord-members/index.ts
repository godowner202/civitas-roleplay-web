import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const DISCORD_BOT_TOKEN = Deno.env.get('DISCORD_BOT_TOKEN');
    const GUILD_ID = Deno.env.get('DISCORD_GUILD_ID'); // Server ID
    const ROLE_ID = '1397006411246075945'; // Burger rol ID

    if (!DISCORD_BOT_TOKEN || !GUILD_ID || !ROLE_ID) {
      throw new Error('Missing Discord configuration');
    }

    // Haal guild members op met de specifieke rol
    const response = await fetch(
      `https://discord.com/api/v10/guilds/${GUILD_ID}/members?limit=1000`,
      {
        headers: {
          'Authorization': `Bot ${DISCORD_BOT_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Discord API error: ${response.status}`);
    }

    const members = await response.json();
    
    // Filter members met de burger rol
    const membersWithRole = members.filter((member: any) => 
      member.roles && member.roles.includes(ROLE_ID)
    );

    return new Response(
      JSON.stringify({ 
        memberCount: membersWithRole.length,
        timestamp: new Date().toISOString() 
      }),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        memberCount: 22 // fallback
      }),
      {
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      }
    );
  }
});