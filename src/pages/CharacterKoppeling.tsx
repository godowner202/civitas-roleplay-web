import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, Link, CheckCircle, AlertCircle, User, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface PlayerAccount {
  id: string;
  fivem_license: string;
  character_name: string | null;
  verified: boolean;
  created_at: string;
}

const CharacterKoppeling = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [playerAccount, setPlayerAccount] = useState<PlayerAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [verifying, setVerifying] = useState(false);
  
  // Form states
  const [fivemLicense, setFivemLicense] = useState("");
  const [characterName, setCharacterName] = useState("");
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        navigate('/auth');
        return;
      }
      setUser(session.user);
      loadPlayerAccount(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session?.user) {
          navigate('/auth');
          return;
        }
        setUser(session.user);
        loadPlayerAccount(session.user.id);
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadPlayerAccount = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('player_accounts')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading player account:', error);
        return;
      }

      setPlayerAccount(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      // Format license to include license2: prefix if not already present
      let formattedLicense = fivemLicense.trim();
      if (!formattedLicense.startsWith('license2:')) {
        formattedLicense = `license2:${formattedLicense}`;
      }

      const { data, error } = await supabase
        .from('player_accounts')
        .upsert({
          user_id: user.id,
          fivem_license: formattedLicense,
          character_name: characterName.trim() || null,
          verified: false
        })
        .select()
        .single();

      if (error) throw error;

      setPlayerAccount(data);
      toast({
        title: "License opgeslagen!",
        description: "Je FiveM license is gekoppeld aan je account",
      });

    } catch (error: any) {
      console.error('Error saving license:', error);
      
      let errorMessage = "Er is een fout opgetreden";
      if (error.message.includes("duplicate key")) {
        errorMessage = "Deze license is al gekoppeld aan een ander account";
      }

      toast({
        title: "Koppeling mislukt",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleVerifyCharacter = async () => {
    if (!playerAccount) return;

    setVerifying(true);
    try {
      // Call new v2 Edge Function to verify character exists in Supabase
      const { data, error } = await supabase.functions.invoke('get-player-stats-v2', {
        body: { license: playerAccount.fivem_license }
      });

      if (error) {
        toast({
          title: "Character niet gevonden",
          description: "Deze license bestaat niet in de FiveM database",
          variant: "destructive",
        });
        return;
      }

      // Update verification status
      const { error: updateError } = await supabase
        .from('player_accounts')
        .update({ 
          verified: true,
          character_name: data.name || data.firstname || playerAccount.character_name 
        })
        .eq('id', playerAccount.id);

      if (updateError) throw updateError;

      // Reload player account
      await loadPlayerAccount(user!.id);

      toast({
        title: "Character geverifieerd!",
        description: "Je character is succesvol gekoppeld",
      });

    } catch (error: any) {
      console.error('Error verifying character:', error);
      toast({
        title: "Verificatie mislukt",
        description: "Kon character niet verifiëren",
        variant: "destructive",
      });
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto p-6 space-y-6 min-h-screen">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Character Koppeling</h1>
          <p className="text-muted-foreground">
            Koppel je FiveM character aan je website account
          </p>
        </div>

        {playerAccount ? (
          // Existing license - show status
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Gekoppelde Character
              </CardTitle>
              <CardDescription>
                Je FiveM character informatie
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">FiveM License</Label>
                  <p className="text-sm font-mono bg-muted p-2 rounded break-all">
                    {playerAccount.fivem_license}
                  </p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Character Naam</Label>
                  <p className="text-sm p-2">
                    {playerAccount.character_name || 'Nog niet ingesteld'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">Status:</Label>
                {playerAccount.verified ? (
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Geverifieerd
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Niet geverifieerd
                  </Badge>
                )}
              </div>

              {!playerAccount.verified && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Je character is nog niet geverifieerd. Klik op "Character Verifiëren" om te controleren of je license bestaat in de FiveM database.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                {!playerAccount.verified && (
                  <Button 
                    onClick={handleVerifyCharacter}
                    disabled={verifying}
                  >
                    {verifying ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifiëren...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Character Verifiëren
                      </>
                    )}
                  </Button>
                )}

                {playerAccount.verified && (
                  <Button asChild>
                    <a href="/mijn-stats">
                      <User className="mr-2 h-4 w-4" />
                      Bekijk Mijn Stats
                    </a>
                  </Button>
                )}

                <Button 
                  variant="outline"
                  onClick={() => setPlayerAccount(null)}
                >
                  License Wijzigen
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          // No license yet - show form
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="h-5 w-5" />
                FiveM Character Koppelen
              </CardTitle>
              <CardDescription>
                Voer je FiveM license in om je character te koppelen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveLicense} className="space-y-4">
                <Alert>
                  <Key className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Hoe vind je je license?</strong><br />
                    1. Open FiveM<br />
                    2. Ga naar Settings → Game<br />
                    3. Scroll naar beneden naar "License"<br />
                    4. Kopieer de license (bijv: f5978867efbc294bd764502ab5c854aeefa1c9c9)
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label htmlFor="license">FiveM License *</Label>
                  <Input
                    id="license"
                    placeholder="f5978867efbc294bd764502ab5c854aeefa1c9c9"
                    value={fivemLicense}
                    onChange={(e) => setFivemLicense(e.target.value)}
                    required
                    disabled={saving}
                    className="font-mono"
                  />
                  <p className="text-xs text-muted-foreground">
                    Je license is een lange string van letters en cijfers
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="characterName">Character Naam (optioneel)</Label>
                  <Input
                    id="characterName"
                    placeholder="Jouw character naam"
                    value={characterName}
                    onChange={(e) => setCharacterName(e.target.value)}
                    disabled={saving}
                  />
                  <p className="text-xs text-muted-foreground">
                    Dit wordt automatisch ingevuld na verificatie
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={saving || !fivemLicense.trim()}
                  size="lg"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Opslaan...
                    </>
                  ) : (
                    <>
                      <Link className="mr-2 h-4 w-4" />
                      Character Koppelen
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="text-center">
          <Button variant="ghost" asChild>
            <a href="/">← Terug naar hoofdpagina</a>
          </Button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CharacterKoppeling;
