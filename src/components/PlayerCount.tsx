import { useState, useEffect } from "react";
import { Users } from "lucide-react";

const PlayerCount = () => {
  const [playerCount, setPlayerCount] = useState<number>(22);
  const [loading, setLoading] = useState(false);

  const fetchPlayerCount = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://jjnirbqvoatwdgkygsyf.supabase.co/functions/v1/discord-members');
      if (response.ok) {
        const data = await response.json();
        setPlayerCount(data.memberCount || 22);
      }
    } catch (error) {
      console.error('Fout bij ophalen playercount:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayerCount();
    // Update elke 5 minuten
    const interval = setInterval(fetchPlayerCount, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center">
      <h4 className="text-2xl font-bold text-primary-foreground mb-2">Sluit je aan bij</h4>
      <div className="text-4xl font-bold text-primary-foreground mb-2 flex items-center justify-center gap-2">
        <Users className="h-8 w-8" />
        {loading ? "..." : `${playerCount}+`}
      </div>
      <p className="text-primary-foreground/80">Actieve spelers die dagelijks hun verhalen beleven</p>
    </div>
  );
};

export default PlayerCount;