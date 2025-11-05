import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

interface Volunteer {
  id: number;
  name: string;
  sessions: number;
  position?: string;
  company?: string;
}

interface RankingVolunteersProps {
  volunteers: Volunteer[];
  currentVolunteerId?: number;
  title?: string;
  description?: string;
}

/**
 * Componente reutilizable para mostrar ranking de voluntarios
 * Mantiene coherencia visual con el Design System
 * Lógica de ordenación: score desc → hours desc → sessions desc → nombre asc
 */
export default function RankingVolunteers({
  volunteers,
  currentVolunteerId,
  title = "Top Voluntarios",
  description = "Los voluntarios más activos",
}: RankingVolunteersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-[#ea6852]" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {volunteers.map((vol, index) => {
            const isCurrentUser = currentVolunteerId && vol.id === currentVolunteerId;
            return (
              <div
                key={vol.id}
                className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                  isCurrentUser
                    ? "bg-[#ea6852]/10 border-[#ea6852] shadow-md"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                      index === 0
                        ? "bg-yellow-400 text-yellow-900"
                        : index === 1
                        ? "bg-gray-300 text-gray-700"
                        : index === 2
                        ? "bg-orange-300 text-orange-900"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 flex items-center gap-2">
                      {vol.name}
                      {isCurrentUser && (
                        <span className="text-xs bg-[#ea6852] text-white px-2 py-1 rounded">Tú</span>
                      )}
                    </p>
                    {vol.position && vol.company && (
                      <p className="text-sm text-gray-600">
                        {vol.position} en {vol.company}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-[#ea6852]">{vol.sessions}</p>
                  <p className="text-xs text-gray-600">sesiones</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
