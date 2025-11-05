import CompanyLayout from "@/components/CompanyLayout";
import RankingVolunteers from "@/components/RankingVolunteers";
import RankingCompanies from "@/components/RankingCompanies";

export default function CompanyRankings() {
  // Datos de ejemplo - En producción vendrán de la API/Zoho CRM
  const volunteersData = [
    {
      rank: 1,
      name: "María González",
      company: "Telefónica",
      score: 950,
      hours: 48,
      sessions: 32,
      isCurrentUser: false,
    },
    {
      rank: 2,
      name: "Ana Martínez",
      company: "BBVA",
      score: 920,
      hours: 46,
      sessions: 30,
      isCurrentUser: false,
    },
    {
      rank: 3,
      name: "Laura Sánchez",
      company: "Santander",
      score: 890,
      hours: 44,
      sessions: 29,
      isCurrentUser: false,
    },
    {
      rank: 4,
      name: "Carmen López",
      company: "Telefónica",
      score: 860,
      hours: 42,
      sessions: 28,
      isCurrentUser: false,
    },
    {
      rank: 5,
      name: "Isabel Fernández",
      company: "Deloitte",
      score: 830,
      hours: 40,
      sessions: 27,
      isCurrentUser: false,
    },
  ];

  const companiesData = [
    {
      rank: 1,
      name: "Telefónica",
      logo: "📱",
      score: 4850,
      hours: 245,
      volunteersActive: 52,
      sessions: 163,
      isCurrentCompany: false,
    },
    {
      rank: 2,
      name: "BBVA",
      logo: "🏦",
      score: 4620,
      hours: 230,
      volunteersActive: 48,
      sessions: 154,
      isCurrentCompany: false,
    },
    {
      rank: 3,
      name: "Santander",
      logo: "🔴",
      score: 4390,
      hours: 220,
      volunteersActive: 45,
      sessions: 147,
      isCurrentCompany: false,
    },
    {
      rank: 4,
      name: "Deloitte",
      logo: "💼",
      score: 4160,
      hours: 210,
      volunteersActive: 42,
      sessions: 140,
      isCurrentCompany: false,
    },
    {
      rank: 5,
      name: "Amazon",
      logo: "📦",
      score: 3930,
      hours: 200,
      volunteersActive: 40,
      sessions: 133,
      isCurrentCompany: false,
    },
  ];

  return (
    <CompanyLayout>
      <div className="space-y-8">
        {/* Introducción */}
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Rankings de Impacto</h2>
          <p className="text-muted-foreground">
            Descubre quiénes están marcando la diferencia en el programa de voluntariado corporativo
          </p>
        </div>

        {/* Ranking de Voluntarios */}
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-4">Top Voluntarios</h3>
          <p className="text-muted-foreground mb-6">
            Los colaboradores más comprometidos con el programa de mentoring y estilismo
          </p>
          <RankingVolunteers data={volunteersData} />
        </div>

        {/* Ranking de Empresas */}
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-4">Ranking de Empresas</h3>
          <p className="text-muted-foreground mb-6">
            Las empresas más comprometidas con la Fundación Quiero Trabajo
          </p>
          <RankingCompanies data={companiesData} />
        </div>

        {/* Nota sobre Zoho CRM */}
        <div className="bg-muted/30 border border-border rounded-lg p-6">
          <p className="text-sm text-muted-foreground">
            <strong>Nota:</strong> Los datos mostrados son de ejemplo. En producción, estos rankings se actualizarán automáticamente desde <strong>Zoho CRM</strong> con datos reales de voluntarios y empresas participantes.
          </p>
        </div>
      </div>
    </CompanyLayout>
  );
}
