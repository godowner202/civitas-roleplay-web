import { useState, useEffect } from "react";
import { Users } from "lucide-react";

const PlayerCount = () => {
  const [playerCount, setPlayerCount] = useState<number>(22);
  const [loading, setLoading] = useState(false);

  const fetchPlayerCount = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/discord-members');
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
    <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
      <Users className="h-4 w-4 text-primary" />
      <span className="text-sm font-medium">
        {loading ? "..." : playerCount} Burgers Online
      </span>
    </div>
  );
};

export default PlayerCount;