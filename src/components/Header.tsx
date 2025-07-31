import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import PlayerCount from "./PlayerCount";

const Header = () => {
  const location = useLocation();

  return (
    <header className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          <img 
            src="/lovable-uploads/82dc1462-b853-481b-af5d-319601cd74b0.png" 
            alt="Civitas RP Logo" 
            className="h-10 w-auto"
          />
          <h1 className="text-xl font-bold text-foreground">Civitas RP</h1>
        </Link>
        
        <div className="hidden md:flex items-center space-x-4">
          <PlayerCount />
          <nav className="flex items-center space-x-6">
            <Link 
              to="/" 
              className={`text-foreground hover:text-primary transition-colors ${
                location.pathname === '/' ? 'text-primary font-semibold' : ''
              }`}
            >
              Home
            </Link>
            <Link 
              to="/regels" 
              className={`text-foreground hover:text-primary transition-colors ${
                location.pathname === '/regels' ? 'text-primary font-semibold' : ''
              }`}
            >
              Regels
            </Link>
            <Link 
              to="/meedoen" 
              className={`text-foreground hover:text-primary transition-colors ${
                location.pathname === '/meedoen' ? 'text-primary font-semibold' : ''
              }`}
            >
              Meedoen
            </Link>
          </nav>
        </div>
        
        <Button 
          variant="discord" 
          size="sm"
          onClick={() => window.open('https://discord.gg/CivitasRoleplay', '_blank')}
        >
          Discord
        </Button>
      </div>
    </header>
  );
};

export default Header;