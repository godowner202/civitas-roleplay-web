import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import Home from "./pages/Home";
import RulesPage from "./pages/Rules";
import JoinPage from "./pages/Join";
import Team from "./pages/Team";
import Jobs from "./pages/Jobs";
import ServerStatus from "./pages/ServerStatus";
import Updates from "./pages/Updates";
import Gallery from "./pages/Gallery";
import Events from "./pages/Events";
import SecretAdmin from "./pages/SecretAdmin";
import NotFound from "./pages/NotFound";
import FiveMDatabaseAnalyzer from "./components/FiveMDatabaseAnalyzer";
import PlayerStats from "./pages/PlayerStats";
import Auth from "./pages/Auth";
import CharacterKoppeling from "./pages/CharacterKoppeling";
import AdminTools from "./pages/AdminTools";
import SyncManager from "./pages/SyncManager";
import Dashboard from "./pages/Dashboard";
import Leaderboards from "./pages/Leaderboards";
import Donations from "./pages/Donations";
import DonationSuccess from "./pages/DonationSuccess";
import LoadingSpinner from "./components/LoadingSpinner";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
            <LoadingSpinner size="lg" text="Applicatie laden..." />
          </div>
        }>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/leaderboards" element={<Leaderboards />} />
            <Route path="/regels" element={<RulesPage />} />
            <Route path="/meedoen" element={<JoinPage />} />
            <Route path="/team" element={<Team />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/status" element={<ServerStatus />} />
            <Route path="/updates" element={<Updates />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/events" element={<Events />} />
            <Route path="/db-analyze" element={<FiveMDatabaseAnalyzer />} />
            <Route path="/donations" element={<Donations />} />
            <Route path="/donation-success" element={<DonationSuccess />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/character-koppeling" element={<CharacterKoppeling />} />
            <Route path="/admin-tools" element={<AdminTools />} />
            <Route path="/sync-manager" element={<SyncManager />} />
            <Route path="/civitasadmin" element={<SecretAdmin />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
