import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Users, Clock, Briefcase, TrendingUp, GraduationCap, BookOpen } from "lucide-react";
import { useState } from "react";

interface CompanyRankingsProps {
  company: {
    id: number;
    name: string;
    slug: string;
    logoUrl: string | null;
  };
}

export default function CompanyRankings({ company }: CompanyRankingsProps) {
  const [activeRanking, setActiveRanking] = useState("mujeres");

  // URLs de los reportes de Zoho Analytics
  const rankingUrls = {
    mujeres: "https://analytics.zoho.eu/open-view/54583000000402713/8d1c22bc882f49737da491b54dbd2054",
    inserciones: "https://analytics.zoho.eu/open-view/54583000001526568/da99afd387578b90b1d56e1bc7d7b66b",
    voluntariosTotales: "https://analytics.zoho.eu/open-view/54583000001735332/262a24274b0f947a47611fb9ba53ee9e",
    horas: "https://analytics.zoho.eu/open-view/54583000001242335/03b317283356ed64a6b44c6534987565",
    programasFormativos: "https://analytics.zoho.eu/open-view/54583000001741795/b74c60df765245a3febfce0ad27eab7f",
    itinerariosFormativos: "https://analytics.zoho.eu/open-view/54583000001707285/ca82ebbaaf8030ba96586fb0e4c008cd",
  };

  const rankings = [
    {
      id: "mujeres",
      title: "Mujeres Atendidas",
      description: "Empresas que más mujeres han ayudado",
      icon: Users,
      color: "from-purple-500 to-pink-500",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      info: "Este ranking muestra el número total de mujeres que han sido atendidas en los servicios individuales de preparación para entrevistas (mentoring y estilismo) por cada empresa colaboradora."
    },
    {
      id: "inserciones",
      title: "Inserciones Laborales",
      description: "Empresas con más inserciones exitosas",
      icon: Briefcase,
      color: "from-blue-500 to-cyan-500",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      info: "Este ranking refleja el número de inserciones laborales exitosas conseguidas gracias al apoyo de los voluntarios de cada empresa en los servicios de preparación para entrevistas."
    },
    {
      id: "voluntariosTotales",
      title: "Voluntarios Totales",
      description: "Empresas con más voluntarios totales",
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      info: "Este ranking muestra el número total de voluntarios de cada empresa que han participado en cualquier actividad o programa de FQT."
    },
    {
      id: "horas",
      title: "Horas de Voluntariado",
      description: "Empresas con más horas dedicadas",
      icon: Clock,
      color: "from-orange-500 to-red-500",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      info: "Este ranking muestra el total de horas dedicadas por los voluntarios de cada empresa en sesiones de mentoring y estilismo para la preparación de entrevistas laborales."
    },
    {
      id: "programasFormativos",
      title: "Voluntarios en Programas Formativos",
      description: "Participación en programas de formación",
      icon: BookOpen,
      color: "from-indigo-500 to-purple-500",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
      info: "Este ranking refleja el número de voluntarios activos de cada empresa que participan en los programas formativos de FQT."
    },
    {
      id: "itinerariosFormativos",
      title: "Voluntarios en Itinerarios Formativos",
      description: "Participación en itinerarios de formación",
      icon: GraduationCap,
      color: "from-rose-500 to-pink-500",
      iconBg: "bg-rose-100",
      iconColor: "text-rose-600",
      info: "Este ranking muestra el número de voluntarios de cada empresa que participan en los itinerarios formativos especializados de FQT."
    },
  ];

  const currentRanking = rankings.find(r => r.id === activeRanking) || rankings[0];
  const Icon = currentRanking.icon;

  return (
    <div className="space-y-8">
      {/* Título principal */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Trophy className="h-8 w-8 text-[#ea6852]" />
          <h2 className="text-4xl font-bold text-[#ea6852]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Rankings de Impacto
          </h2>
        </div>
        <p className="text-gray-600 text-lg" style={{ fontFamily: 'Roboto, sans-serif' }}>
          Descubre cómo {company.name} se compara con otras empresas colaboradoras
        </p>
      </div>

      {/* Tabs de Rankings */}
      <Tabs value={activeRanking} onValueChange={setActiveRanking} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3 gap-2 h-auto bg-transparent p-0">
          {rankings.map((ranking) => {
            const RankingIcon = ranking.icon;
            return (
              <TabsTrigger
                key={ranking.id}
                value={ranking.id}
                className={`
                  flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all
                  data-[state=active]:border-[#ea6852] data-[state=active]:bg-[#ea6852]/5
                  data-[state=inactive]:border-gray-200 data-[state=inactive]:hover:border-gray-300
                `}
              >
                <div className={`p-2 rounded-full ${ranking.iconBg}`}>
                  <RankingIcon className={`h-5 w-5 ${ranking.iconColor}`} />
                </div>
                <span className="text-sm font-semibold text-center leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {ranking.title}
                </span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Contenido de cada ranking */}
        {rankings.map((ranking) => (
          <TabsContent key={ranking.id} value={ranking.id} className="mt-8">
            <Card className="border-2 border-[#ea6852] overflow-hidden">
              {/* Header con gradiente */}
              <div className={`bg-gradient-to-r ${ranking.color} p-6 text-white`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {ranking.title}
                    </h3>
                    <p className="text-white/90 text-sm" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      {ranking.description}
                    </p>
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                {/* Mensaje informativo */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Trophy className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-amber-900 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        🏆 Ranking en Tiempo Real
                      </h4>
                      <p className="text-sm text-amber-800" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        Este ranking se actualiza automáticamente desde Zoho Analytics. 
                        Los datos reflejan el impacto acumulado de todas las empresas colaboradoras en el programa de FQT.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Iframe del ranking */}
                <div className="w-full bg-gray-50 rounded-lg p-3 overflow-auto" style={{ minHeight: '700px' }}>
                  <iframe
                    src={rankingUrls[ranking.id as keyof typeof rankingUrls]}
                    className="w-full rounded-lg shadow-sm"
                    style={{ 
                      height: '800px', 
                      border: '1px solid #e5e7eb',
                      minWidth: '100%'
                    }}
                    title={`Ranking ${ranking.title}`}
                    loading="lazy"
                    frameBorder="0"
                  />
                </div>

                <p className="text-xs text-gray-500 text-center mt-4" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  📊 Datos actualizados en tiempo real desde Zoho Analytics
                </p>
              </CardContent>
            </Card>

            {/* Información adicional sobre el ranking */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  <Icon className="h-5 w-5 text-[#ea6852]" />
                  Sobre este Ranking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4" style={{ fontFamily: 'Roboto, sans-serif' }}>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">¿Cómo se calcula?</h4>
                  <p className="text-gray-600 text-sm">
                    {ranking.info}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Posición de {company.name}</h4>
                  <p className="text-gray-600 text-sm">
                    Cada sesión de voluntariado corporativo marca una diferencia real en la vida de las mujeres que apoyamos. 
                    Gracias por ser parte del cambio y contribuir al impacto social de FQT.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
