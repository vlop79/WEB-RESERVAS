import { useEffect } from "react";
import { toast } from "sonner";
import { Award } from "lucide-react";

interface BadgeNotificationProps {
  badgeName: string;
  badgeDescription: string;
  onClose?: () => void;
}

export function showBadgeNotification(badgeName: string, badgeDescription: string) {
  toast.success(
    <div className="flex items-start gap-3">
      <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-2 rounded-full">
        <Award className="h-6 w-6 text-white" />
      </div>
      <div>
        <p className="font-bold text-[#ea6852]">🎉 ¡Nueva Insignia Desbloqueada!</p>
        <p className="font-semibold">{badgeName}</p>
        <p className="text-sm text-gray-600">{badgeDescription}</p>
      </div>
    </div>,
    {
      duration: 6000,
      className: "border-2 border-amber-400",
    }
  );
}

// Hook para verificar nuevos badges al cargar el dashboard
export function useBadgeNotifications(volunteerId: number | undefined) {
  useEffect(() => {
    if (!volunteerId) return;

    // Verificar si hay badges nuevos no vistos
    const lastSeenBadges = localStorage.getItem(`volunteer_${volunteerId}_seen_badges`);
    const seenBadgeIds = lastSeenBadges ? JSON.parse(lastSeenBadges) : [];

    // Esta función se llamará desde el dashboard cuando cargue los badges
    (window as any).checkNewBadges = (badges: any[]) => {
      const newBadges = badges.filter(badge => !seenBadgeIds.includes(badge.id));
      
      newBadges.forEach(badge => {
        showBadgeNotification(badge.name, badge.description);
      });

      // Actualizar badges vistos
      if (newBadges.length > 0) {
        const allSeenIds = [...seenBadgeIds, ...newBadges.map(b => b.id)];
        localStorage.setItem(`volunteer_${volunteerId}_seen_badges`, JSON.stringify(allSeenIds));
      }
    };

    return () => {
      delete (window as any).checkNewBadges;
    };
  }, [volunteerId]);
}
