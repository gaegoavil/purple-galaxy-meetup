import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/Navbar";
import { AudioProvider } from "@/contexts/AudioContext";
import { WelcomeMusicModal } from "@/components/WelcomeMusicModal";
import { FloatingMusicPlayer } from "@/components/FloatingMusicPlayer";
import Landing from "./pages/Landing";
import Registration from "./pages/Registration";
import CommunityWall from "./pages/CommunityWall";
import Stats from "./pages/Stats";
import Normas from "./pages/Normas";
import Coordinacion from "./pages/Coordinacion";
import Revision from "./pages/Revision";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AudioProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar />
          <WelcomeMusicModal />
          <FloatingMusicPlayer />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/registro" element={<Registration />} />
            <Route path="/comunidad" element={<CommunityWall />} />
            <Route path="/estadisticas" element={<Stats />} />
            <Route path="/normas" element={<Normas />} />
            <Route path="/coordinacion" element={<Coordinacion />} />
            <Route path="/revision" element={<Revision />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AudioProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
