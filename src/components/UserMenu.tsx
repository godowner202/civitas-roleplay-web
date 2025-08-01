import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, LogOut, UserPlus, LogIn, Unlink, Activity } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const UserMenu = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [playerAccount, setPlayerAccount] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Get current user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        // Check for linked character
        const { data: accounts } = await supabase
          .from('player_accounts')
          .select('*')
          .eq('user_id', user.id)
          .eq('verified', true);
        
        setPlayerAccount(accounts && accounts.length > 0 ? accounts[0] : null);
      }
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        setPlayerAccount(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleUnlinkCharacter = async () => {
    if (!user || !playerAccount) return;

    const confirmed = confirm(
      "Weet je zeker dat je je character wilt ontkoppelen? Je zult opnieuw moeten koppelen om toegang te krijgen tot je character informatie."
    );

    if (!confirmed) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('player_accounts')
        .delete()
        .eq('id', playerAccount.id)
        .eq('user_id', user.id);

      if (error) throw error;

      setPlayerAccount(null);
      
      toast({
        title: "Character ontkoppeld",
        description: "Je character is succesvol ontkoppeld van je account",
      });

    } catch (error: any) {
      console.error('Error unlinking character:', error);
      toast({
        title: "Ontkoppeling mislukt",
        description: "Er is een fout opgetreden bij het ontkoppelen van je character",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Er is een fout opgetreden bij het uitloggen",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Uitgelogd",
        description: "Je bent succesvol uitgelogd",
      });
      navigate('/');
    }
  };

  if (!user) {
    return (
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-foreground hover:text-primary"
        >
          <Link to="/auth">
            <LogIn className="h-4 w-4 mr-2" />
            Inloggen
          </Link>
        </Button>
        <Button
          variant="default"
          size="sm"
          asChild
          className="bg-primary hover:bg-primary/90"
        >
          <Link to="/auth">
            <UserPlus className="h-4 w-4 mr-2" />
            Registreren
          </Link>
        </Button>
      </div>
    );
  }

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(user.email || "U")}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-background border border-border z-[60]" align="end" forceMount>
        <div className="flex flex-col space-y-1 p-2">
          <p className="text-sm font-medium leading-none">{user.email}</p>
          <p className="text-xs leading-none text-muted-foreground">
            Welkom terug!
          </p>
        </div>
        <DropdownMenuSeparator />
        {playerAccount && (
          <DropdownMenuItem asChild>
            <Link to="/dashboard" className="cursor-pointer">
              <Activity className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link to="/character-koppeling" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Karakter Koppelen</span>
          </Link>
        </DropdownMenuItem>
        {playerAccount && (
          <DropdownMenuItem 
            onClick={handleUnlinkCharacter} 
            className="cursor-pointer text-destructive hover:text-destructive"
            disabled={loading}
          >
            <Unlink className="mr-2 h-4 w-4" />
            <span>{loading ? "Ontkoppelen..." : "Character Ontkoppelen"}</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Uitloggen</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;