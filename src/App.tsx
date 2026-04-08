import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import AppointmentPage from "./pages/AppointmentPage.tsx";
import AdminPage from "./pages/AdminPage.tsx";
import CookiePolicy from "./pages/CookiePolicy.tsx";

const queryClient = new QueryClient();

const App = () => {
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
              <Route path="/agendar" element={<AppointmentPage />} />
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
