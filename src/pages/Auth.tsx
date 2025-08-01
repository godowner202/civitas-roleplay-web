import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, User, Key, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const Auth = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  
  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const { toast } = useToast();

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

        if (error) throw error;

        toast({
          title: "Succesvol ingelogd!",
          description: "Welkom terug bij Civitas RP Stats",
        });
      } else {
        // Sign up
        if (password !== confirmPassword) {
          toast({
            title: "Wachtwoorden komen niet overeen",
            description: "Controleer je wachtwoord en probeer opnieuw",
            variant: "destructive",
          });
          return;
        }

        const redirectUrl = `${window.location.origin}/`;
        
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
          options: {
            emailRedirectTo: redirectUrl
          }
        });

        if (error) throw error;

        toast({
          title: "Account aangemaakt!",
          description: "Controleer je email voor de verificatielink",
        });
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      
      let errorMessage = "Er is een fout opgetreden";
      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Email of wachtwoord is onjuist";
      } else if (error.message.includes("User already registered")) {
        errorMessage = "Er bestaat al een account met dit email adres";
      } else if (error.message.includes("Password should be at least")) {
        errorMessage = "Wachtwoord moet minimaal 6 karakters lang zijn";
      }

      toast({
        title: "Inloggen mislukt",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Uitloggen mislukt",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Succesvol uitgelogd",
        description: "Tot ziens!",
      });
    }
  };

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-2xl">Ingelogd als</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <User className="h-4 w-4" />
              <AlertDescription>
                Je bent succesvol ingelogd! Nu kun je je FiveM character koppelen om je stats te bekijken.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Button 
                asChild 
                className="w-full"
                size="lg"
              >
                <a href="/character-koppeling">Character Koppelen</a>
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="w-full"
              >
                Uitloggen
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">
            {isLogin ? "Inloggen" : "Registreren"}
          </CardTitle>
          <CardDescription>
            {isLogin 
              ? "Log in om je FiveM character stats te bekijken" 
              : "Maak een account aan voor Civitas RP Stats"
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="jouw@email.nl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Wachtwoord</Label>
              <Input
                id="password"
                type="password"
                placeholder="Voer je wachtwoord in"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                minLength={6}
              />
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Bevestig Wachtwoord</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Bevestig je wachtwoord"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  minLength={6}
                />
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isLogin ? "Inloggen..." : "Registreren..."}
                </>
              ) : (
                <>
                  <Key className="mr-2 h-4 w-4" />
                  {isLogin ? "Inloggen" : "Account Aanmaken"}
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
              disabled={loading}
            >
              {isLogin 
                ? "Nog geen account? Registreer hier" 
                : "Al een account? Log hier in"
              }
            </Button>
          </div>

          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              size="sm"
              asChild
            >
              <a href="/">← Terug naar hoofdpagina</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;