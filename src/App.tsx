import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import ClientAppointmentPage from "./pages/ClientAppointmentPage.tsx";
import ClientDashboard from "./pages/ClientDashboard.tsx";
import AdminPage from "./pages/AdminPage.tsx";
import CookiePolicy from "./pages/CookiePolicy.tsx";

const queryClient = new QueryClient();

const App = () => {
  // Handle GitHub Pages SPA redirect
  if (window.location.search.startsWith('?/')) {
    const path = window.location.search.slice(2).replace(/~and~/g, '&');
    window.history.replaceState(null, '', path + window.location.hash);
  }

  const basename = window.location.pathname.startsWith('/landing-page-barbearia')
    ? '/landing-page-barbearia'
    : '/';

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter basename={basename}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/cliente" element={<ClientAppointmentPage />} />
              <Route path="/cliente/dashboard" element={<ClientDashboard />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/admin/agendamentos" element={<AdminPage />} />
              <Route path="/politica-cookies" element={<CookiePolicy />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
