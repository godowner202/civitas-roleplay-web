import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Heart, 
  Gavel, 
  Car, 
  Wrench, 
  Truck, 
  Building, 
  DollarSign,
  Users,
  Briefcase
} from "lucide-react";

const jobs = [
  {
    category: "Overheidsdiensten",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    jobs: [
      {
        title: "Politie Agent",
        icon: Shield,
        description: "Handhaaf de wet en orde in Los Santos. Patrouilleer, onderzoek misdaden en bescherm de burgers.",
        salary: "€2.500 - €4.000",
        requirements: ["18+ jaar", "Nederlands spreken", "Microfoon verplicht"]
      },
      {
        title: "Ambulance Medewerker",
        icon: Heart,
        description: "Red levens als paramedicus of arts. Reageer op noodoproepen en verzorg gewonde burgers.",
        salary: "€2.200 - €3.500",
        requirements: ["Eerste hulp kennis", "Stressbestendig", "Teamspeler"]
      },
      {
        title: "Advocaat",
        icon: Gavel,
        description: "Verdedig burgers voor de rechtbank. Behandel rechtszaken en geef juridisch advies.",
        salary: "€3.000 - €5.000",
        requirements: ["Goede communicatie", "Juridische interesse", "Overtuigingskracht"]
      }
    ]
  },
  {
    category: "Transport & Logistiek",
    color: "bg-green-500/10 text-green-600 dark:text-green-400",
    jobs: [
      {
        title: "Taxi Chauffeur",
        icon: Car,
        description: "Vervoer burgers door de stad. Verdien geld door passagiers veilig naar hun bestemming te brengen.",
        salary: "€1.500 - €2.500",
        requirements: ["Rijbewijs", "Lokale kennis", "Vriendelijke service"]
      },
      {
        title: "Trucker",
        icon: Truck,
        description: "Transport goederen tussen verschillende locaties. Verdien goed geld met lange ritten.",
        salary: "€2.000 - €3.500",
        requirements: ["Truck rijbewijs", "Geduld", "Navigatie vaardigheden"]
      }
    ]
  },
  {
    category: "Dienstverlening",
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    jobs: [
      {
        title: "Monteur",
        icon: Wrench,
        description: "Repareer voertuigen in je eigen garage. Help burgers met autopech en modificaties.",
        salary: "€1.800 - €3.000",
        requirements: ["Technische kennis", "Probleemoplossend", "Klantvriendelijk"]
      },
      {
        title: "Vastgoed Makelaar",
        icon: Building,
        description: "Verkoop huizen en bedrijfspanden. Help burgers hun droomhuis te vinden.",
        salary: "€2.500 - €4.500",
        requirements: ["Verkoop ervaring", "Marktkennis", "Netwerk vaardigheden"]
      }
    ]
  }
];

const economyFeatures = [
  {
    title: "Realistische Economie",
    description: "Een uitgebalanceerd economisch systeem met inflatie, belastingen en marktdynamiek.",
    icon: DollarSign
  },
  {
    title: "Bedrijven Oprichten",
    description: "Start je eigen bedrijf en word ondernemer. Van restaurants tot autobedrijven.",
    icon: Briefcase
  },
  {
    title: "Banking Systeem",
    description: "Compleet banksysteem met rekeningen, leningen, investeringen en creditcards.",
    icon: Building
  },
  {
    title: "Sociale Economie",
    description: "Werk samen met andere spelers voor grote projecten en economische groei.",
    icon: Users
  }
];

const Jobs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-24">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6">
            Jobs & Economie
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ontdek de diverse carrièremogelijkheden en het realistische economische systeem van Civitas RP. 
            Van overheidsdiensten tot ondernemerschap - jouw toekomst wacht!
          </p>
        </div>

        {/* Jobs Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Beschikbare Banen</h2>
          
          {jobs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <Badge className={category.color}>
                  {category.category}
                </Badge>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.jobs.map((job, jobIndex) => {
                  const IconComponent = job.icon;
                  return (
                    <Card key={jobIndex} className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <IconComponent className="w-5 h-5 text-primary-foreground" />
                          </div>
                          <CardTitle className="text-foreground">{job.title}</CardTitle>
                        </div>
                        <Badge variant="outline" className="w-fit text-primary border-primary/20">
                          {job.salary}
                        </Badge>
                      </CardHeader>
                      
                      <CardContent>
                        <p className="text-muted-foreground mb-4 leading-relaxed">
                          {job.description}
                        </p>
                        
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Vereisten:</h4>
                          <ul className="space-y-1">
                            {job.requirements.map((req, reqIndex) => (
                              <li key={reqIndex} className="text-sm text-muted-foreground flex items-center gap-2">
                                <div className="w-1 h-1 bg-primary rounded-full"></div>
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

        {/* Economy Section */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Economisch Systeem</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ervaar een realistische economie waar jouw keuzes en acties echte gevolgen hebben voor je financiële toekomst.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {economyFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="text-center group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 mx-auto bg-gradient-primary rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h3 className="font-bold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="bg-card border border-border/50 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">Klaar om je carrière te starten?</h3>
            <p className="text-muted-foreground mb-6">
              Word lid van Civitas RP en begin vandaag nog met het opbouwen van jouw virtuele toekomst. 
              Talloze mogelijkheden wachten op je!
            </p>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              🚧 Meer banen komen binnenkort!
            </Badge>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Jobs;