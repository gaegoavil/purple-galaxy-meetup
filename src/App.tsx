import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/Navbar";
import Landing from "./pages/Landing";
import Registration from "./pages/Registration";
import CommunityWall from "./pages/CommunityWall";
import Stats from "./pages/Stats";
import Normas from "./pages/Normas";
import Coordinacion from "./pages/Coordinacion";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/registro" element={<Registration />} />
          <Route path="/comunidad" element={<CommunityWall />} />
          <Route path="/estadisticas" element={<Stats />} />
          <Route path="/normas" element={<Normas />} />
          <Route path="/coordinacion" element={<Coordinacion />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
