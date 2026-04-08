import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X, Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Verificar se o usuário já aceitou os cookies
    const cookiesAccepted = localStorage.getItem("cookiesAccepted");
    if (!cookiesAccepted) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setShowBanner(false);
  };

  const closeBanner = () => {
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg p-4 md:p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex items-center gap-3 flex-shrink-0">
            <Cookie className="w-6 h-6 text-orange-500" />
            <span className="font-semibold text-gray-900">Cookies</span>
          </div>

          <div className="flex-1 text-sm text-gray-600">
            Utilizamos cookies para melhorar sua experiência em nosso site, personalizar conteúdo e anúncios,
            fornecer recursos de mídia social e analisar nosso tráfego. Ao clicar em "Aceitar" ou continuar navegando,
            você concorda com o uso de cookies.{" "}
            <Link
              to="/politica-cookies"
              className="text-orange-500 hover:text-orange-600 underline"
              onClick={() => setShowBanner(false)}
            >
              Saiba mais
            </Link>
          </div>

          <div className="flex gap-2 flex-shrink-0">
            <Button
              onClick={acceptCookies}
              size="sm"
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Aceitar
            </Button>
            <Button
              onClick={closeBanner}
              variant="outline"
              size="sm"
              className="text-gray-600 hover:text-gray-800"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;