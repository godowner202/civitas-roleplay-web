import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const DonationSuccess = () => {
  const [searchParams] = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const orderId = searchParams.get('token');
    
    if (orderId) {
      verifyPayment(orderId);
    } else {
      setVerifying(false);
    }
  }, [searchParams]);

  const verifyPayment = async (orderId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-paypal-donation', {
        body: { orderId }
      });

      if (error) throw error;

      if (data.success) {
        setVerified(true);
        toast({
          title: "Donatie succesvol!",
          description: "Bedankt voor je genereuze donatie!"
        });
      } else {
        toast({
          title: "Verificatie mislukt",
          description: "Er was een probleem met het verifiëren van je donatie.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      toast({
        title: "Fout",
        description: "Er ging iets mis bij het verifiëren van je donatie.",
        variant: "destructive"
      });
    } finally {
      setVerifying(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Donatie wordt geverifieerd...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {verified ? (
              <CheckCircle className="h-16 w-16 text-green-500" />
            ) : (
              <Heart className="h-16 w-16 text-red-500" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {verified ? "Donatie Succesvol!" : "Donatie Ontvangen"}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            {verified 
              ? "Bedankt voor je genereuze donatie! Je steun betekent veel voor onze community."
              : "We hebben je donatie ontvangen en verwerken deze. Bedankt voor je steun!"
            }
          </p>
          
          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Terug naar Home
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="w-full">
              <Link to="/donations">
                <Heart className="mr-2 h-4 w-4" />
                Meer Doneren
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DonationSuccess;