import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { ChevronDown } from "lucide-react";

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
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link 
                  to="/" 
                  className={`text-foreground hover:text-primary transition-colors px-4 py-2 ${
                    location.pathname === '/' ? 'text-primary font-semibold' : ''
                  }`}
                >
                  Home
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-foreground hover:text-primary">
                  Server <ChevronDown className="ml-1 h-3 w-3" />
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-6 w-[400px]">
                    <Link 
                      to="/regels" 
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">Regels</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Bekijk alle server regels en richtlijnen
                      </p>
                    </Link>
                    <Link 
                      to="/jobs" 
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">Jobs & Economie</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Ontdek alle beschikbare banen en het economisch systeem
                      </p>
                    </Link>
                    <Link 
                      to="/status" 
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">Server Status</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Bekijk de huidige server status en performance
                      </p>
                    </Link>
                    <Link 
                      to="/updates" 
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">Updates</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Lees over de nieuwste updates en features
                      </p>
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link 
                  to="/team" 
                  className={`text-foreground hover:text-primary transition-colors px-4 py-2 ${
                    location.pathname === '/team' ? 'text-primary font-semibold' : ''
                  }`}
                >
                  Team
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link 
                  to="/meedoen" 
                  className={`text-foreground hover:text-primary transition-colors px-4 py-2 ${
                    location.pathname === '/meedoen' ? 'text-primary font-semibold' : ''
                  }`}
                >
                  Meedoen
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link 
                  to="/auth" 
                  className={`text-foreground hover:text-primary transition-colors px-4 py-2 ${
                    location.pathname === '/auth' ? 'text-primary font-semibold' : ''
                  }`}
                >
                  Login
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button 
            variant="discord" 
            size="sm"
            onClick={() => window.open('https://discord.gg/CivitasRoleplay', '_blank')}
          >
            Discord
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;