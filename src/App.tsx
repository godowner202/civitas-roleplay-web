import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import RulesPage from "./pages/Rules";
import JoinPage from "./pages/Join";
import Team from "./pages/Team";
import Jobs from "./pages/Jobs";
import ServerStatus from "./pages/ServerStatus";
import Updates from "./pages/Updates";
import SecretAdmin from "./pages/SecretAdmin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/regels" element={<RulesPage />} />
          <Route path="/meedoen" element={<JoinPage />} />
          <Route path="/team" element={<Team />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/status" element={<ServerStatus />} />
          <Route path="/updates" element={<Updates />} />
          <Route path="/geheim-admin-123" element={<SecretAdmin />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
