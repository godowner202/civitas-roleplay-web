import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Heart, Euro, Users, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Donation {
  id: string;
  donor_name: string;
  amount: number;
  message: string;
  created_at: string;
  status: string;
}

const Donations = () => {
  const [amount, setAmount] = useState<number>(5);
  const [donorName, setDonorName] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState({ total: 0, count: 0 });
  const { toast } = useToast();

  useEffect(() => {
    fetchDonations();
    fetchStats();
  }, []);

  const fetchDonations = async () => {
    try {
      // @ts-ignore - Table exists but types not updated yet
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching donations:', error);
      } else {
        setDonations(data || []);
      }
    } catch (error) {
      console.error('Error fetching donations:', error);
    }
  };

  const fetchStats = async () => {
    try {
      // @ts-ignore - Table exists but types not updated yet
      const { data, error } = await supabase
        .from('donations')
        .select('amount')
        .eq('status', 'completed');

      if (error) {
        console.error('Error fetching stats:', error);
      } else {
        const total = data?.reduce((sum: any, d: any) => sum + Number(d.amount), 0) || 0;
        setStats({ total, count: data?.length || 0 });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleDonate = async () => {
    if (amount < 1) {
      toast({
        title: "Fout",
        description: "Minimum donatie is €1",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-paypal-donation', {
        body: {
          amount,
          donorName: donorName.trim() || 'Anoniem',
          message: message.trim()
        }
      });

      if (error) throw error;

      // Redirect to PayPal
      if (data.approvalUrl) {
        window.open(data.approvalUrl, '_blank');
        
        toast({
          title: "Doorgestuurd naar PayPal",
          description: "Je wordt doorgestuurd naar PayPal om je donatie te voltooien."
        });
      }
    } catch (error) {
      console.error('Error creating donation:', error);
      toast({
        title: "Fout",
        description: "Er ging iets mis bij het aanmaken van de donatie.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const presetAmounts = [5, 10, 25, 50, 100];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 p-4">
        <div className="max-w-6xl mx-auto space-y-8 pt-20">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Heart className="h-16 w-16 text-red-500" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Steun Civitas RP
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Help ons de server draaiende te houden en nieuwe content toe te voegen
            </p>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto bg-muted/30 rounded-lg p-3 mt-4">
              💯 <strong>Transparantie:</strong> Alle donaties gaan 100% terug naar de server. We houden niets voor onszelf en investeren alles in hosting, ontwikkeling en nieuwe features.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Euro className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">€{stats.total}</p>
                    <p className="text-sm text-muted-foreground">Totaal gedoneerd</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Users className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats.count}</p>
                    <p className="text-sm text-muted-foreground">Donaties</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-8 w-8 text-purple-500" />
                  <div>
                    <p className="text-2xl font-bold">€{stats.count > 0 ? (stats.total / stats.count).toFixed(0) : 0}</p>
                    <p className="text-sm text-muted-foreground">Gemiddelde donatie</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Donation Form */}
            <Card>
              <CardHeader>
                <CardTitle>Doneer Nu</CardTitle>
                <CardDescription>
                  Steun onze server en help ons groeien
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="amount">Bedrag (€)</Label>
                  <div className="flex flex-wrap gap-2 mt-2 mb-3">
                    {presetAmounts.map((preset) => (
                      <Button
                        key={preset}
                        variant={amount === preset ? "default" : "outline"}
                        size="sm"
                        onClick={() => setAmount(preset)}
                      >
                        €{preset}
                      </Button>
                    ))}
                  </div>
                  <Input
                    id="amount"
                    type="number"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    placeholder="Bedrag in euro's"
                  />
                </div>

                <div>
                  <Label htmlFor="donorName">Naam (optioneel)</Label>
                  <Input
                    id="donorName"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="Je naam voor op de donatielijst"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Bericht (optioneel)</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Laat een bericht achter..."
                    rows={3}
                  />
                </div>

                <Button 
                  onClick={handleDonate} 
                  disabled={loading || amount < 1}
                  className="w-full"
                  size="lg"
                >
                  {loading ? 'Bezig...' : `Doneer €${amount} via PayPal`}
                </Button>
              </CardContent>
            </Card>

            {/* Recent Donations */}
            <Card>
              <CardHeader>
                <CardTitle>Recente Donaties</CardTitle>
                <CardDescription>
                  Dank aan onze geweldige donateurs!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {donations.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Nog geen donaties ontvangen
                    </p>
                  ) : (
                    donations.map((donation) => (
                      <div key={donation.id} className="border rounded-lg p-4 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{donation.donor_name}</span>
                          <Badge variant="secondary">€{donation.amount}</Badge>
                        </div>
                        {donation.message && (
                          <p className="text-sm text-muted-foreground">
                            "{donation.message}"
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {new Date(donation.created_at).toLocaleDateString('nl-NL')}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Donations;