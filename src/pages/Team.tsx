import Layout from "@/components/Layout";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Code, Shield, Bug } from "lucide-react";

const teamMembers = [
  {
    name: "Jorden",
    role: "Eigenaar/Beheer/Hoofd Developer",
    icon: Crown,
    description: "Leidt het project en zorgt voor de technische visie van Civitas RP.",
    badges: ["Eigenaar", "Developer", "Beheer"]
  },
  {
    name: "Glen", 
    role: "Eigenaar/Beheer/Developer",
    icon: Code,
    description: "Medeoprichter en ontwikkelaar van server scripts en systemen.",
    badges: ["Eigenaar", "Developer", "Beheer"]
  },
  {
    name: "Nienke",
    role: "Eigenaares/Beheer", 
    icon: Shield,
    description: "Beheert de community en zorgt voor een vriendelijke omgeving.",
    badges: ["Eigenaares", "Beheer"]
  },
  {
    name: "Elias",
    role: "Discord Developer/Tester",
    icon: Bug,
    description: "Ontwikkelt Discord integraties en test nieuwe features.",
    badges: ["Discord Dev", "Tester"]
  }
];

const Team = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 space-y-8 animate-fade-in">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6">
            Ons Team
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Maak kennis met het toegewijde team achter Civitas RP. Samen werken we aan de beste roleplay ervaring voor onze community.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {teamMembers.map((member, index) => {
            const IconComponent = member.icon;
            return (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
                <CardContent className="p-8 text-center">
                  <div className="mb-6">
                    <div className="w-20 h-20 mx-auto bg-gradient-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-10 h-10 text-primary-foreground" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">{member.name}</h3>
                    <p className="text-primary font-medium mb-4">{member.role}</p>
                  </div>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {member.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 justify-center">
                    {member.badges.map((badge, badgeIndex) => (
                      <Badge key={badgeIndex} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-card border border-border/50 rounded-2xl p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-4">Word onderdeel van ons team!</h2>
            <p className="text-muted-foreground mb-6">
              Zijn je gepassioneerd over roleplay en wil je bijdragen aan Civitas RP? 
              We zijn altijd op zoek naar nieuwe teamleden.
            </p>
            <p className="text-sm text-muted-foreground">
              Neem contact met ons op via Discord voor meer informatie over beschikbare posities.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </Layout>
  );
};

export default Team;