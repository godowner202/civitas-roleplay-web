import { MessageCircle, Shield, ExternalLink, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/lovable-uploads/82dc1462-b853-481b-af5d-319601cd74b0.png" 
                alt="Civitas RP Logo" 
                className="h-8 w-auto"
              />
              <h3 className="text-xl font-bold text-foreground">Civitas RP</h3>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              De beste Belgische FiveM Roleplay server. Beleef je dromen, creëer je verhaal en maak deel uit van onze gemeenschap.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open('cfx.re/join/o8rdar', '_blank')}
                className="border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Join Server
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={() => window.open('https://discord.gg/CivitasRoleplay', '_blank')}
                className="bg-[#5865F2] hover:bg-[#4752C4] text-white"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Discord
              </Button>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-4">Server</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/regels" className="text-muted-foreground hover:text-primary transition-colors">Regels</Link>
              </li>
              <li>
                <Link to="/jobs" className="text-muted-foreground hover:text-primary transition-colors">Jobs & Economie</Link>
              </li>
              <li>
                <Link to="/status" className="text-muted-foreground hover:text-primary transition-colors">Server Status</Link>
              </li>
              <li>
                <Link to="/updates" className="text-muted-foreground hover:text-primary transition-colors">Updates</Link>
              </li>
              <li>
                <Link to="/gallery" className="text-muted-foreground hover:text-primary transition-colors">Gallery</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-4">Community</h4>
            <div className="space-y-3">
              <Link 
                to="/team" 
                className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Users className="h-4 w-4" />
                <span>Ons Team</span>
              </Link>
              <Link 
                to="/meedoen" 
                className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Shield className="h-4 w-4" />
                <span>Meedoen</span>
              </Link>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>24/7 Staff Support</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © 2024 Civitas RP. Alle rechten voorbehouden. FiveM is een modificatie voor Grand Theft Auto V.
          </p>
          <p className="text-muted-foreground text-sm mt-2 md:mt-0">
            Server Link: <span className="text-primary font-mono">cfx.re/join/o8rdar</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;