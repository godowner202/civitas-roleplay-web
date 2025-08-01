import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, User, CheckCircle, AlertCircle, Search, UserPlus } from "lucide-react";
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

interface CharacterSearchResult {
  license: string;
  firstname: string;
  lastname: string;
  citizenid: string;
  name: string;
}

const CharacterKoppeling = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [playerAccount, setPlayerAccount] = useState<PlayerAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [searchResults, setSearchResults] = useState<CharacterSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  
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

  const searchCharacters = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      toast({
        title: "Voer beide namen in",
        description: "Vul zowel voornaam als achternaam in om te zoeken",
        variant: "destructive",
      });
      return;
    }

    setSearching(true);
    try {
      const { data: characters, error } = await supabase
        .from('fivem_players')
        .select('license, firstname, lastname, citizenid, name')
        .ilike('firstname', `%${firstName.trim()}%`)
        .ilike('lastname', `%${lastName.trim()}%`)
        .limit(10);

      if (error) throw error;

      setSearchResults(characters || []);
      
      if (!characters || characters.length === 0) {
        toast({
          title: "Geen characters gevonden",
          description: "Controleer of je voor- en achternaam correct zijn gespeld",
        });
      }
    } catch (error: any) {
      console.error('Error searching characters:', error);
      toast({
        title: "Zoeken mislukt",
        description: "Er ging iets mis bij het zoeken naar characters",
        variant: "destructive",
      });
    } finally {
      setSearching(false);
    }
  };

  const linkCharacter = async (character: CharacterSearchResult) => {
    if (!user) return;

    setSaving(true);
    try {
      // Check if this license is already linked to another account
      const { data: existingAccount, error: checkError } = await supabase
        .from('player_accounts')
        .select('user_id')
        .eq('fivem_license', character.license)
        .neq('user_id', user.id)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingAccount) {
        toast({
          title: "Character al gekoppeld",
          description: "Dit character is al gekoppeld aan een ander account",
          variant: "destructive",
        });
        return;
      }

      // Link the character to this user
      const { data, error } = await supabase
        .from('player_accounts')
        .upsert({
          user_id: user.id,
          fivem_license: character.license,
          character_name: `${character.firstname} ${character.lastname}`,
          verified: true // Auto-verify since we found it in the database
        })
        .select()
        .single();

      if (error) throw error;

      setPlayerAccount(data);
      setSearchResults([]);
      setFirstName("");
      setLastName("");
      
      toast({
        title: "Character gekoppeld!",
        description: `${character.firstname} ${character.lastname} is succesvol gekoppeld aan je account`,
      });

    } catch (error: any) {
      console.error('Error linking character:', error);
      
      let errorMessage = "Er is een fout opgetreden";
      if (error.message.includes("duplicate key")) {
        errorMessage = "Je hebt al een character gekoppeld aan dit account";
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

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-12">
        <div className="container mx-auto p-6 space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <UserPlus className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Character Koppeling
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Koppel je FiveM character aan je website account door je voor- en achternaam in te voeren
            </p>
          </div>

          {playerAccount ? (
            // Existing character - show status
            <Card className="max-w-2xl mx-auto bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-2 border-primary/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  Gekoppelde Character
                </CardTitle>
                <CardDescription>
                  Je FiveM character is succesvol gekoppeld
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted/50 rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Character Naam:</span>
                    <span className="font-semibold">{playerAccount.character_name}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Status:</span>
                    <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Geverifieerd
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button asChild className="flex-1">
                    <a href="/stats">
                      <User className="mr-2 h-4 w-4" />
                      Bekijk Mijn Stats
                    </a>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setPlayerAccount(null);
                      setSearchResults([]);
                      setFirstName("");
                      setLastName("");
                    }}
                  >
                    Character Wijzigen
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            // No character yet - show search form
            <div className="max-w-2xl mx-auto space-y-6">
              <Card className="bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-2 border-primary/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Search className="h-5 w-5 text-primary" />
                    </div>
                    Zoek je Character
                  </CardTitle>
                  <CardDescription>
                    Voer je voor- en achternaam in zoals deze in FiveM staan
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
                    <Search className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Tip:</strong> Gebruik exacte naam spelling zoals in je FiveM character. 
                      Bijvoorbeeld: "John" en "Doe" voor John Doe.
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Voornaam *</Label>
                      <Input
                        id="firstName"
                        placeholder="Bijv: John"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        disabled={searching || saving}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Achternaam *</Label>
                      <Input
                        id="lastName"
                        placeholder="Bijv: Doe"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        disabled={searching || saving}
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={searchCharacters}
                    className="w-full"
                    disabled={searching || saving || !firstName.trim() || !lastName.trim()}
                    size="lg"
                  >
                    {searching ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Zoeken...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Zoek Characters
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <Card className="bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-2 border-primary/20 shadow-xl">
                  <CardHeader>
                    <CardTitle>Gevonden Characters</CardTitle>
                    <CardDescription>
                      Selecteer je character om te koppelen
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {searchResults.map((character, index) => (
                      <div 
                        key={character.license} 
                        className="p-4 border rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <h4 className="font-semibold">
                              {character.firstname} {character.lastname}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Citizen ID: {character.citizenid}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Server Naam: {character.name}
                            </p>
                          </div>
                          
                          <Button 
                            onClick={() => linkCharacter(character)}
                            disabled={saving}
                            size="sm"
                          >
                            {saving ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              "Koppelen"
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <div className="text-center">
            <Button variant="ghost" asChild>
              <a href="/">← Terug naar hoofdpagina</a>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CharacterKoppeling;
