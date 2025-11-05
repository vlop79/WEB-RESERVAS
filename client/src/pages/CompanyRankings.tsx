import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

interface CompanyRankingsProps {
  company: {
    id: number;
    name: string;
    slug: string;
    logoUrl: string | null;
  };
}

export default function CompanyRankings({ company }: CompanyRankingsProps) {
  // URL del dashboard de rankings de Zoho Analytics
  // Este dashboard muestra comparativas entre todas las empresas
  const zohoRankingsUrl = `https://analytics.zoho.eu/open-view/2634426000000009115/4c6d1f5c6e7f1b3f9c1c2a2c0d3e4f5a`;

  return (
    <div className="space-y-8">
      {/* Título principal */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <BarChart3 className="h-6 w-6 text-[#ea6852]" />
          <h2 className="text-3xl font-bold text-[#ea6852]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Rankings de Empresas
          </h2>
        </div>
        <p className="text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
          Comparativa de impacto entre todas las empresas colaboradoras
        </p>
      </div>

      {/* Dashboard de Rankings */}
      <Card className="border-2 border-[#ea6852]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[#ea6852]" />
            <CardTitle style={{ fontFamily: 'Montserrat, sans-serif' }}>Comparativa de Impacto</CardTitle>
          </div>
          <CardDescription style={{ fontFamily: 'Roboto, sans-serif' }}>
            Visualiza cómo {company.name} se compara con otras empresas en el programa de voluntariado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full" style={{ height: '800px' }}>
            <iframe
              src={zohoRankingsUrl}
              className="w-full h-full border-0 rounded-lg"
              title="Rankings de Empresas"
            />
          </div>
          <p className="text-xs text-gray-500 text-center mt-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
            Dashboard actualizado en tiempo real desde Zoho Analytics
          </p>
        </CardContent>
      </Card>

      {/* Información adicional */}
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Montserrat, sans-serif' }}>Sobre los Rankings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4" style={{ fontFamily: 'Roboto, sans-serif' }}>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">¿Cómo se calculan los rankings?</h3>
            <p className="text-gray-600 text-sm">
              Los rankings se basan en múltiples métricas de impacto, incluyendo el número de mujeres atendidas, 
              inserciones laborales conseguidas, y la participación activa de voluntarios de cada empresa.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Métricas principales</h3>
            <ul className="text-gray-600 text-sm space-y-1 list-disc list-inside">
              <li>Número de mujeres atendidas en servicios individuales</li>
              <li>Tasa de inserción laboral</li>
              <li>Número de voluntarios activos</li>
              <li>Sesiones de mentoring y estilismo realizadas</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Tu posición</h3>
            <p className="text-gray-600 text-sm">
              {company.name} está contribuyendo activamente al programa de voluntariado corporativo de FQT. 
              Cada sesión de mentoring o estilismo marca una diferencia real en la vida de las mujeres que apoyamos.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
