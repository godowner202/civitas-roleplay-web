import { MessageCircle, Users, Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/lovable-uploads/82dc1462-b853-481b-af5d-319601cd74b0.png" 
                alt="Civitas RP Logo" 
                className="h-8 w-auto"
              />
              <h3 className="text-xl font-bold text-foreground">Civitas RP</h3>
            </div>
            <p className="text-muted-foreground">
              De beste Belgische FiveM Roleplay server. Beleef je dromen, creëer je verhaal en maak deel uit van onze gemeenschap.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-muted-foreground hover:text-primary transition-colors">Home</a>
              </li>
              <li>
                <a href="#about" className="text-muted-foreground hover:text-primary transition-colors">Over Ons</a>
              </li>
              <li>
                <a href="#rules" className="text-muted-foreground hover:text-primary transition-colors">Regels</a>
              </li>
              <li>
                <a href="#join" className="text-muted-foreground hover:text-primary transition-colors">Meedoen</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-4">Community</h4>
            <div className="space-y-3">
              <a 
                href="https://discord.gg/CivitasRoleplay" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Discord Server</span>
              </a>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>500+ Actieve Spelers</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>24/7 Staff Support</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground">
            © 2024 Civitas RP. Alle rechten voorbehouden. FiveM is een modificatie voor Grand Theft Auto V.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;