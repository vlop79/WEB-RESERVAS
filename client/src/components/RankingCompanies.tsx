import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";

interface Company {
  id: number;
  name: string;
  volunteers: number;
  sessions: number;
  logo?: string;
}

interface RankingCompaniesProps {
  companies: Company[];
  currentCompanyName?: string;
  title?: string;
  description?: string;
}

/**
 * Componente reutilizable para mostrar ranking de empresas
 * Mantiene coherencia visual con el Design System
 * Lógica de ordenación: score desc → hours desc → volunteers_active desc → nombre asc
 */
export default function RankingCompanies({
  companies,
  currentCompanyName,
  title = "Top Empresas",
  description = "Las empresas más comprometidas",
}: RankingCompaniesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-[#ea6852]" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {companies.map((company, index) => {
            const isCurrentCompany = currentCompanyName && company.name === currentCompanyName;
            return (
              <div
                key={company.id}
                className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                  isCurrentCompany
                    ? "bg-[#ea6852]/5 border-[#ea6852] shadow-md"
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
                  {company.logo && (
                    <div className="text-3xl">{company.logo}</div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900 flex items-center gap-2">
                      {company.name}
                      {isCurrentCompany && (
                        <span className="text-xs bg-[#ea6852] text-white px-2 py-1 rounded">Tu empresa</span>
                      )}
                    </p>
                    <p className="text-sm text-gray-600">{company.volunteers} voluntarios activos</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-[#ea6852]">{company.sessions}</p>
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
