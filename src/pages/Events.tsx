import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Users, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO, isAfter, isBefore, startOfDay } from "date-fns";
import { nl } from "date-fns/locale";

interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  end_date: string | null;
  event_type: string;
  is_recurring: boolean;
  created_at: string;
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('event_date', { ascending: true });

        if (error) throw error;
        setEvents(data || []);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'roleplay':
        return 'bg-primary text-primary-foreground';
      case 'tournament':
        return 'bg-destructive text-destructive-foreground';
      case 'community':
        return 'bg-secondary text-secondary-foreground';
      case 'update':
        return 'bg-accent text-accent-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'roleplay':
        return 'Roleplay Event';
      case 'tournament':
        return 'Tournament';
      case 'community':
        return 'Community Event';
      case 'update':
        return 'Server Update';
      default:
        return 'General';
    }
  };

  const filterEvents = (events: Event[]) => {
    const now = new Date();
    const today = startOfDay(now);

    switch (filter) {
      case 'upcoming':
        return events.filter(event => isAfter(parseISO(event.event_date), today));
      case 'past':
        return events.filter(event => isBefore(parseISO(event.event_date), today));
      default:
        return events;
    }
  };

  const filteredEvents = filterEvents(events);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6">
            Event Kalender
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Blijf op de hoogte van alle aankomende events, tournaments en speciale roleplay sessies op Civitas RP.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-6 py-2 rounded-lg transition-colors ${
              filter === 'upcoming' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Aankomende Events
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-lg transition-colors ${
              filter === 'all' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Alle Events
          </button>
          <button
            onClick={() => setFilter('past')}
            className={`px-6 py-2 rounded-lg transition-colors ${
              filter === 'past' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Afgelopen Events
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Laden van events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {filter === 'upcoming' && 'Geen aankomende events'}
              {filter === 'past' && 'Geen afgelopen events'}
              {filter === 'all' && 'Nog geen events gepland'}
            </h3>
            <p className="text-muted-foreground">
              {filter === 'upcoming' && 'Check later terug voor nieuwe events!'}
              {filter === 'past' && 'Er zijn nog geen afgelopen events.'}
              {filter === 'all' && 'Events worden binnenkort toegevoegd.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="bg-card border-border hover:border-primary/50 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-lg font-bold text-foreground line-clamp-2">
                      {event.title}
                    </CardTitle>
                    <Badge className={`${getEventTypeColor(event.event_type)} shrink-0`}>
                      <Tag className="w-3 h-3 mr-1" />
                      {getEventTypeLabel(event.event_type)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {event.description && (
                    <p className="text-muted-foreground text-sm line-clamp-3">
                      {event.description}
                    </p>
                  )}
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="text-foreground">
                        {format(parseISO(event.event_date), 'EEEE d MMMM yyyy', { locale: nl })}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-foreground">
                        {format(parseISO(event.event_date), 'HH:mm', { locale: nl })}
                        {event.end_date && (
                          <span className="text-muted-foreground">
                            {' - '}
                            {format(parseISO(event.end_date), 'HH:mm', { locale: nl })}
                          </span>
                        )}
                      </span>
                    </div>
                    
                    {event.is_recurring && (
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="text-accent">Terugkerend event</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2">
                    {isAfter(parseISO(event.event_date), new Date()) ? (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Aankomend
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground border-muted-foreground">
                        Afgelopen
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-16">
          <p className="text-muted-foreground">
            Wil je een event voorstellen? Neem contact op met ons team in Discord!
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Events;