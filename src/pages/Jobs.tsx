import Layout from "@/components/Layout";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { 
  ExternalLink,
  Building,
  Shield,
  Heart,
  Flame,
  Car,
  Wrench,
  ShoppingBag,
  Briefcase,
  Euro,
  Users
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Job {
  id: string;
  job_name: string;
  job_rank: string;
  salary: number;
  description: string | null;
  job_type: string;
  requirements: string | null;
  is_active: boolean;
}

const Jobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('is_active', true)
          .order('order_index', { ascending: true });

        if (error) throw error;
        setJobs(data || []);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const getJobIcon = (jobName: string) => {
    switch (jobName.toLowerCase()) {
      case 'politie':
        return <Shield className="w-6 h-6" />;
      case 'ambulance':
        return <Heart className="w-6 h-6" />;
      case 'brandweer':
        return <Flame className="w-6 h-6" />;
      case 'taxi':
        return <Car className="w-6 h-6" />;
      case 'monteur':
        return <Wrench className="w-6 h-6" />;
      case 'winkelier':
        return <ShoppingBag className="w-6 h-6" />;
      default:
        return <Briefcase className="w-6 h-6" />;
    }
  };

  const getJobTypeColor = (jobType: string) => {
    switch (jobType) {
      case 'government':
        return 'bg-primary text-primary-foreground';
      case 'civilian':
        return 'bg-secondary text-secondary-foreground';
      case 'criminal':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getJobTypeLabel = (jobType: string) => {
    switch (jobType) {
      case 'government':
        return 'Overheidsdienst';
      case 'civilian':
        return 'Burgerbaan';
      case 'criminal':
        return 'Crimineel';
      default:
        return 'Algemeen';
    }
  };

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(salary);
  };

  const groupJobsByName = (jobs: Job[]) => {
    const grouped: { [key: string]: Job[] } = {};
    jobs.forEach(job => {
      if (!grouped[job.job_name]) {
        grouped[job.job_name] = [];
      }
      grouped[job.job_name].push(job);
    });
    return grouped;
  };

  const groupedJobs = groupJobsByName(jobs);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 space-y-8 animate-fade-in">
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

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Laden van beschikbare banen...</p>
          </div>
        ) : Object.keys(groupedJobs).length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Nog geen banen beschikbaar</h3>
            <p className="text-muted-foreground">Banen worden binnenkort toegevoegd.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(groupedJobs).map(([jobName, jobList]) => (
              <section key={jobName}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="text-primary">
                    {getJobIcon(jobName)}
                  </div>
                  <h2 className="text-3xl font-bold text-foreground">{jobName}</h2>
                  <Badge className={`${getJobTypeColor(jobList[0].job_type)} ml-auto`}>
                    {getJobTypeLabel(jobList[0].job_type)}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {jobList.map((job) => (
                    <Card key={job.id} className="bg-card border-border hover:border-primary/50 transition-all duration-300">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg font-bold text-foreground">
                            {job.job_rank}
                          </CardTitle>
                          <div className="text-right">
                            <span className="font-semibold text-primary">{formatSalary(job.salary)}</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {job.description && (
                          <p className="text-muted-foreground text-sm">{job.description}</p>
                        )}
                        
                        {job.requirements && (
                          <div>
                            <h4 className="font-semibold text-foreground text-sm mb-1">Vereisten:</h4>
                            <p className="text-muted-foreground text-xs">{job.requirements}</p>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-accent" />
                          <span className="text-accent">Loon per 15 min</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <section className="mt-20">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <CardContent className="p-12 text-center">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Klaar om je carrière te starten?
                </h2>
                
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                  Sluit je aan bij Civitas RP en begin je reis in één van deze spannende beroepen. 
                  Verdien geld, krijg promoties en bouw je reputatie op in onze realistische wereld.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
                    variant="outline"
                    onClick={() => window.open('https://discord.gg/CivitasRoleplay', '_blank')}
                    className="border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Vraag Info op Discord
                  </Button>
                  
                  <Button 
                    onClick={() => window.open('cfx.re/join/o8rdar', '_blank')}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Join Server Nu
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features Preview */}
        <section className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Job System Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ontdek wat ons job systeem zo bijzonder maakt.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
              <CardHeader>
                <CardTitle className="text-foreground">Realistische Salarissen</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Verdien realistische lonen gebaseerd op je job en prestaties in de roleplay wereld.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
              <CardHeader>
                <CardTitle className="text-foreground">Carrière Progressie</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Klim op in je gekozen beroep en ontwikkel jezelf van beginneling tot expert.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
              <CardHeader>
                <CardTitle className="text-foreground">Specialisaties</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Kies uit verschillende specialisaties binnen elk beroep voor unieke ervaring.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>

      <Footer />
    </Layout>
  );
};

export default Jobs;