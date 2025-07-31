import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Tag, CheckCircle, Clock, Star } from "lucide-react";

const updates = [
  {
    id: 1,
    title: "Nieuwe Politie Scripts & Voertuigen",
    date: "2024-01-25",
    type: "feature",
    status: "released",
    description: "Compleet vernieuwde politie systemen met realistische procedures, nieuwe voertuigen en uitgebreide equipment opties.",
    highlights: [
      "5 nieuwe politie voertuigen toegevoegd",
      "Vernieuwde arrestatie procedures", 
      "Nieuwe wapens en equipment",
      "Verbeterde dispatch systeem"
    ]
  },
  {
    id: 2,
    title: "Banking Systeem Update",
    date: "2024-01-20",
    type: "improvement",
    status: "released",
    description: "Grote verbeteringen aan het banking systeem met nieuwe features en verbeterde veiligheid.",
    highlights: [
      "Nieuwe loan systeem",
      "Verbeterde ATM interface",
      "Creditcard functionaliteit",
      "Bedrijfsrekeningen ondersteuning"
    ]
  },
  {
    id: 3,
    title: "Server Performance Optimalisatie",
    date: "2024-01-15", 
    type: "maintenance",
    status: "released",
    description: "Uitgebreide server optimalisaties voor betere performance en stabiliteit.",
    highlights: [
      "50% lagere ping tijden",
      "Verbeterde FPS in drukke gebieden",
      "Minder crashes en disconnects",
      "Geoptimaliseerde resource loading"
    ]
  },
  {
    id: 4,
    title: "Nieuwe Business Systemen",
    date: "2024-02-01",
    type: "feature", 
    status: "upcoming",
    description: "Uitgebreide business mechanics waarmee spelers hun eigen bedrijven kunnen runnen.",
    highlights: [
      "Restaurant management systeem",
      "Autodealer mechanics",
      "Vastgoed business opties",
      "Employee management tools"
    ]
  },
  {
    id: 5,
    title: "Custom Clothing & Accessories",
    date: "2024-02-05",
    type: "feature",
    status: "upcoming", 
    description: "Enorme uitbreiding van kleding opties en accessoires voor betere character customization.",
    highlights: [
      "200+ nieuwe kleding items",
      "Custom accessoires system",
      "Verbeterde character creator",
      "Seasonal clothing collecties"
    ]
  }
];

const getTypeColor = (type: string) => {
  switch (type) {
    case "feature":
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
    case "improvement":
      return "bg-green-500/10 text-green-600 dark:text-green-400";
    case "maintenance":
      return "bg-purple-500/10 text-purple-600 dark:text-purple-400";
    case "bugfix":
      return "bg-red-500/10 text-red-600 dark:text-red-400";
    default:
      return "bg-gray-500/10 text-gray-600 dark:text-gray-400";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "released":
      return "bg-green-500/10 text-green-600 dark:text-green-400";
    case "upcoming":
      return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400";
    case "in-progress":
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
    default:
      return "bg-gray-500/10 text-gray-600 dark:text-gray-400";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "released":
      return <CheckCircle className="w-4 h-4" />;
    case "upcoming":
      return <Clock className="w-4 h-4" />;
    case "in-progress":
      return <Star className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case "feature":
      return "Nieuwe Feature";
    case "improvement":
      return "Verbetering";
    case "maintenance":
      return "Onderhoud";
    case "bugfix":
      return "Bug Fix";
    default:
      return type;
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "released":
      return "Uitgebracht";
    case "upcoming":
      return "Binnenkort";
    case "in-progress":
      return "In Ontwikkeling";
    default:
      return status;
  }
};

const Updates = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6">
            Server Updates
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Blijf op de hoogte van alle nieuwe features, verbeteringen en updates voor Civitas RP.
          </p>
        </div>

        {/* Development Status */}
        <div className="mb-12">
          <Card className="bg-gradient-primary/5 border-primary/20">
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                <Badge className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
                  🚧 In Development
                </Badge>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Civitas RP is momenteel in ontwikkeling
              </h2>
              <p className="text-muted-foreground">
                We werken hard aan het perfectioneren van alle systemen. Volg onze Discord voor real-time updates!
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Updates Timeline */}
        <div className="space-y-8">
          {updates.map((update, index) => (
            <Card key={update.id} className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl mb-2">{update.title}</CardTitle>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(update.date).toLocaleDateString('nl-NL', {
                          year: 'numeric',
                          month: 'long', 
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getTypeColor(update.type)}>
                      <Tag className="w-3 h-3 mr-1" />
                      {getTypeLabel(update.type)}
                    </Badge>
                    <Badge className={getStatusColor(update.status)}>
                      {getStatusIcon(update.status)}
                      <span className="ml-1">{getStatusLabel(update.status)}</span>
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {update.description}
                </p>
                
                {update.highlights && update.highlights.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Highlights:</h4>
                    <ul className="grid md:grid-cols-2 gap-2">
                      {update.highlights.map((highlight, highlightIndex) => (
                        <li key={highlightIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></div>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-card border border-border/50 rounded-2xl p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-4">Mis geen update!</h2>
            <p className="text-muted-foreground mb-6">
              Word lid van onze Discord community om als eerste op de hoogte te zijn van nieuwe updates, 
              events en ontwikkelingen.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-muted-foreground">Real-time updates</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-muted-foreground">Community feedback</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Updates;