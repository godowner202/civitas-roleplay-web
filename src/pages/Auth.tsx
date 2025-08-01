import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cfxUsername, setCfxUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        toast.success("Succesvol ingelogd!");
        navigate("/");
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          },
        });
        
        if (error) throw error;
        
        // Create profile after signup
        if (data.user) {
          const { error: profileError } = await supabase
            .from("profiles")
            .insert({
              user_id: data.user.id,
              cfx_username: cfxUsername,
              display_name: cfxUsername,
            });
          
          if (profileError) {
            console.error("Error creating profile:", profileError);
          }
        }
        
        toast.success("Account aangemaakt! Check je email voor verificatie.");
        setIsLogin(true);
      }
    } catch (error: any) {
      toast.error(error.message || "Er is een fout opgetreden");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">
                {isLogin ? "Inloggen" : "Registreren"}
              </CardTitle>
              <p className="text-muted-foreground">
                {isLogin 
                  ? "Log in om toegang te krijgen tot het admin panel" 
                  : "Maak een account aan voor Civitas RP"
                }
              </p>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleAuth} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Wachtwoord</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="cfx-username">CFX Username</Label>
                    <Input
                      id="cfx-username"
                      type="text"
                      value={cfxUsername}
                      onChange={(e) => setCfxUsername(e.target.value)}
                      placeholder="Je CFX gebruikersnaam"
                      required
                    />
                  </div>
                )}
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Bezig..." : (isLogin ? "Inloggen" : "Registreren")}
                </Button>
              </form>
              
              <div className="mt-4 text-center">
                <Button
                  variant="ghost"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin 
                    ? "Nog geen account? Registreer hier" 
                    : "Al een account? Log hier in"
                  }
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Auth;