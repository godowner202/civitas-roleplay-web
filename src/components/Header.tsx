import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { ChevronDown, Menu, X } from "lucide-react";

const Header = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-4">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link 
                  to="/" 
                  className={`text-foreground hover:text-primary transition-colors px-4 py-2 rounded-md ${
                    location.pathname === '/' ? 'bg-primary/10 text-primary font-semibold' : ''
                  }`}
                >
                  Home
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-foreground hover:text-primary bg-transparent">
                  Server <ChevronDown className="ml-1 h-3 w-3" />
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-6 w-[450px] bg-background border border-border">
                    <Link 
                      to="/regels" 
                      className="group block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                    >
                      <div className="text-sm font-medium leading-none">Regels</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground group-hover:text-primary/80">
                        Bekijk alle server regels en richtlijnen
                      </p>
                    </Link>
                    <Link 
                      to="/jobs" 
                      className="group block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                    >
                      <div className="text-sm font-medium leading-none">Jobs & Economie</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground group-hover:text-primary/80">
                        Ontdek alle beschikbare banen en het economisch systeem
                      </p>
                    </Link>
                    <Link 
                      to="/status" 
                      className="group block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                    >
                      <div className="text-sm font-medium leading-none">Server Status</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground group-hover:text-primary/80">
                        Bekijk de huidige server status en performance
                      </p>
                    </Link>
                    <Link 
                      to="/updates" 
                      className="group block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                    >
                      <div className="text-sm font-medium leading-none">Updates</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground group-hover:text-primary/80">
                        Lees over de nieuwste updates en features
                      </p>
                    </Link>
                    <Link 
                      to="/gallery" 
                      className="group block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                    >
                      <div className="text-sm font-medium leading-none">Gallery</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground group-hover:text-primary/80">
                        Bekijk screenshots en media van onze server
                      </p>
                    </Link>
                    <Link 
                      to="/events" 
                      className="group block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                    >
                      <div className="text-sm font-medium leading-none">Events</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground group-hover:text-primary/80">
                        Bekijk de event kalender en aankomende activiteiten
                      </p>
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link 
                  to="/team" 
                  className={`text-foreground hover:text-primary transition-colors px-4 py-2 rounded-md ${
                    location.pathname === '/team' ? 'bg-primary/10 text-primary font-semibold' : ''
                  }`}
                >
                  Team
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link 
                  to="/meedoen" 
                  className={`text-foreground hover:text-primary transition-colors px-4 py-2 rounded-md ${
                    location.pathname === '/meedoen' ? 'bg-primary/10 text-primary font-semibold' : ''
                  }`}
                >
                  Meedoen
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        
        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center space-x-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.open('cfx.re/join/o8rdar', '_blank')}
            className="border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
          >
            Join Server
          </Button>
          <Button 
            variant="default" 
            size="sm"
            onClick={() => window.open('https://discord.gg/CivitasRoleplay', '_blank')}
            className="bg-[#5865F2] hover:bg-[#4752C4] text-white"
          >
            Discord
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-background border-b border-border">
          <div className="container mx-auto px-4 py-4 space-y-3">
            <Link 
              to="/" 
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md transition-colors ${
                location.pathname === '/' ? 'bg-primary/10 text-primary' : 'text-foreground hover:text-primary hover:bg-primary/5'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/regels" 
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md transition-colors ${
                location.pathname === '/regels' ? 'bg-primary/10 text-primary' : 'text-foreground hover:text-primary hover:bg-primary/5'
              }`}
            >
              Regels
            </Link>
            <Link 
              to="/jobs" 
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md transition-colors ${
                location.pathname === '/jobs' ? 'bg-primary/10 text-primary' : 'text-foreground hover:text-primary hover:bg-primary/5'
              }`}
            >
              Jobs & Economie
            </Link>
            <Link 
              to="/status" 
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md transition-colors ${
                location.pathname === '/status' ? 'bg-primary/10 text-primary' : 'text-foreground hover:text-primary hover:bg-primary/5'
              }`}
            >
              Server Status
            </Link>
            <Link 
              to="/updates" 
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md transition-colors ${
                location.pathname === '/updates' ? 'bg-primary/10 text-primary' : 'text-foreground hover:text-primary hover:bg-primary/5'
              }`}
            >
              Updates
            </Link>
            <Link 
              to="/gallery" 
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md transition-colors ${
                location.pathname === '/gallery' ? 'bg-primary/10 text-primary' : 'text-foreground hover:text-primary hover:bg-primary/5'
              }`}
            >
              Gallery
            </Link>
            <Link 
              to="/events" 
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md transition-colors ${
                location.pathname === '/events' ? 'bg-primary/10 text-primary' : 'text-foreground hover:text-primary hover:bg-primary/5'
              }`}
            >
              Events
            </Link>
            <Link
              to="/team" 
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md transition-colors ${
                location.pathname === '/team' ? 'bg-primary/10 text-primary' : 'text-foreground hover:text-primary hover:bg-primary/5'
              }`}
            >
              Team
            </Link>
            <Link 
              to="/meedoen" 
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md transition-colors ${
                location.pathname === '/meedoen' ? 'bg-primary/10 text-primary' : 'text-foreground hover:text-primary hover:bg-primary/5'
              }`}
            >
              Meedoen
            </Link>
            
            <div className="pt-3 border-t border-border space-y-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  window.open('cfx.re/join/o8rdar', '_blank');
                  setMobileMenuOpen(false);
                }}
                className="w-full border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
              >
                Join Server
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={() => {
                  window.open('https://discord.gg/CivitasRoleplay', '_blank');
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white"
              >
                Discord
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;