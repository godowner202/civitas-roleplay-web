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
    const { amount, donorName, message } = await req.json();

    // Get PayPal access token
    const clientId = Deno.env.get('PAYPAL_CLIENT_ID');
    const clientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET');
    
    if (!clientId || !clientSecret) {
      throw new Error('PayPal credentials not configured');
    }

    // PayPal OAuth
    const authResponse = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`
      },
      body: 'grant_type=client_credentials'
    });

    if (!authResponse.ok) {
      const errorText = await authResponse.text();
      console.error('PayPal auth error:', errorText);
      throw new Error(`PayPal authentication failed: ${authResponse.status}`);
    }

    const authData = await authResponse.json();
    console.log('PayPal auth response:', authData);
    
    if (!authData.access_token) {
      throw new Error('Failed to get PayPal access token');
    }

    // Create PayPal order
    const orderResponse = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authData.access_token}`
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'EUR',
            value: amount.toFixed(2)
          },
          description: `Donatie van ${donorName || 'Anoniem'}`
        }],
        application_context: {
          return_url: `${req.headers.get('origin')}/donation-success`,
          cancel_url: `${req.headers.get('origin')}/donations`,
          brand_name: 'Civitas RP'
        }
      })
    });

    const orderData = await orderResponse.json();
    
    if (!orderData.id) {
      throw new Error('Failed to create PayPal order');
    }

    // Save donation to database
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { error } = await supabase
      .from('donations')
      .insert({
        paypal_order_id: orderData.id,
        amount: amount,
        donor_name: donorName || 'Anoniem',
        message: message || '',
        status: 'pending'
      });

    if (error) {
      console.error('Error saving donation:', error);
    }

    // Get approval URL
    const approvalUrl = orderData.links.find((link: any) => link.rel === 'approve')?.href;

    return new Response(JSON.stringify({ 
      orderId: orderData.id,
      approvalUrl: approvalUrl
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in create-paypal-donation function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to create donation', 
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});