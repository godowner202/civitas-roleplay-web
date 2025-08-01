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
    const { license } = await req.json();
    
    console.log('Fetching player stats for license:', license);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (!license) {
      // Get all recent players (for admin view)
      console.log('Fetching all recent players...');
      
      const { data: players, error } = await supabase
        .from('fivem_players')
        .select('*')
        .order('synced_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching players:', error);
        throw error;
      }

      return new Response(JSON.stringify({ 
        players: players || [],
        total: players?.length || 0 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get specific player by license
    console.log('Searching for specific player...');
    
    const { data: player, error } = await supabase
      .from('fivem_players')
      .select('*')
      .eq('license', license)
      .maybeSingle();

    if (error) {
      console.error('Error fetching player:', error);
      throw error;
    }

    if (!player) {
      return new Response(
        JSON.stringify({ error: 'Character niet gevonden in database' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Player found:', player.firstname, player.lastname, 'with license:', player.license);

    // Add computed fields for easier frontend use
    const playerStats = {
      ...player,
      full_name: `${player.firstname || ''} ${player.lastname || ''}`.trim(),
      display_name: player.name || `${player.firstname || ''} ${player.lastname || ''}`.trim(),
      total_money: (player.cash || 0) + (player.bank || 0),
      job_info: {
        name: player.job_name,
        grade_name: player.job_grade_name,
        label: player.job?.label,
        payment: player.job?.payment,
        isboss: player.job?.isboss
      },
      last_sync: player.synced_at
    };

    return new Response(JSON.stringify(playerStats), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in get-player-stats-v2 function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch player stats', 
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});