import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookiesAccepted = localStorage.getItem("cookiesAccepted");
    if (!cookiesAccepted) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setShowBanner(false);
  };

  const openSettings = () => {
    // For now, just accept cookies. In the future, this could open a modal with cookie preferences
    acceptCookies();
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 text-white p-4 shadow-lg">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm flex-1">
          Utilizamos cookies para ofrecerte la mejor experiencia en nuestra web. Puedes aprender más
          sobre qué cookies utilizamos o desactivarlas en los{" "}
          <button
            onClick={openSettings}
            className="underline hover:text-gray-300 font-medium"
          >
            ajustes
          </button>
          .
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={openSettings}
            className="bg-transparent border-white text-white hover:bg-white hover:text-gray-900"
          >
            ajustes
          </Button>
          <Button
            size="sm"
            onClick={acceptCookies}
            className="bg-[#ea6852] hover:bg-[#d85a45] text-white"
          >
            Aceptar
          </Button>
        </div>
      </div>
    </div>
  );
}
