import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img 
            src="/lovable-uploads/82dc1462-b853-481b-af5d-319601cd74b0.png" 
            alt="Civitas RP Logo" 
            className="h-10 w-auto"
          />
          <h1 className="text-xl font-bold text-foreground">Civitas RP</h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#home" className="text-foreground hover:text-primary transition-colors">Home</a>
          <a href="#about" className="text-foreground hover:text-primary transition-colors">Over Ons</a>
          <a href="#rules" className="text-foreground hover:text-primary transition-colors">Regels</a>
          <a href="#join" className="text-foreground hover:text-primary transition-colors">Meedoen</a>
        </nav>
        
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