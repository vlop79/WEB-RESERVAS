import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Heart, TrendingUp, Users } from "lucide-react";

interface CompanyFQTImpactProps {
  company: {
    id: number;
    name: string;
    slug: string;
    logoUrl: string | null;
  };
}

export default function CompanyFQTImpact({ company }: CompanyFQTImpactProps) {
  // URL del dashboard global de FQT en Zoho Analytics
  const fqtImpactUrl = "https://analytics.zoho.eu/open-view/54583000004601244/4519ff3ef1926a4da905f077c02e8570";

  return (
    <div className="space-y-8">
      {/* Título principal */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Globe className="h-8 w-8 text-[#ea6852]" />
          <h2 className="text-4xl font-bold text-[#ea6852]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            El Impacto de FQT
          </h2>
        </div>
        <p className="text-gray-600 text-lg" style={{ fontFamily: 'Roboto, sans-serif' }}>
          Descubre el impacto global del programa de voluntariado corporativo de la Fundación Quiero Trabajo
        </p>
      </div>

      {/* Tarjetas informativas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-purple-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Mujeres Ayudadas
                </CardTitle>
                <CardDescription style={{ fontFamily: 'Roboto, sans-serif' }}>
                  Total de participantes
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-purple-700" style={{ fontFamily: 'Roboto, sans-serif' }}>
              Miles de mujeres han recibido apoyo en su búsqueda de empleo gracias a los voluntarios corporativos
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-blue-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Inserciones Laborales
                </CardTitle>
                <CardDescription style={{ fontFamily: 'Roboto, sans-serif' }}>
                  Éxito en empleabilidad
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-700" style={{ fontFamily: 'Roboto, sans-serif' }}>
              El 80% de las mujeres que completan el servicio de preparación de entrevista consiguen empleo en un plazo máximo de dos meses
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-[#ea6852]/30 bg-gradient-to-br from-orange-50 to-white">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-full">
                <Heart className="h-6 w-6 text-[#ea6852]" />
              </div>
              <div>
                <CardTitle className="text-[#ea6852]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Empresas Colaboradoras
                </CardTitle>
                <CardDescription style={{ fontFamily: 'Roboto, sans-serif' }}>
                  Red de impacto social
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700" style={{ fontFamily: 'Roboto, sans-serif' }}>
              {company.name} forma parte de una red de empresas comprometidas con la inclusión laboral
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Dashboard de Zoho Analytics */}
      <Card className="border-2 border-[#ea6852]">
        <CardHeader className="bg-gradient-to-r from-[#ea6852] to-[#f08c7a] text-white">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
              <Globe className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-2xl" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Dashboard Global de Impacto
              </CardTitle>
              <CardDescription className="text-white/90" style={{ fontFamily: 'Roboto, sans-serif' }}>
                Datos en tiempo real del programa de voluntariado corporativo de FQT
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Mensaje informativo */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Globe className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  🌍 Impacto Global
                </h4>
                <p className="text-sm text-blue-800" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  Este dashboard muestra el impacto acumulado de todas las empresas colaboradoras en el programa de FQT. 
                  Los datos se actualizan automáticamente desde Zoho Analytics y reflejan el alcance total del voluntariado corporativo.
                </p>
              </div>
            </div>
          </div>

          {/* Iframe del dashboard */}
          <div className="w-full bg-gray-50 rounded-lg p-3" style={{ minHeight: '800px' }}>
            <iframe
              src={fqtImpactUrl}
              className="w-full rounded-lg shadow-sm"
              style={{ height: '780px', border: '1px solid #e5e7eb' }}
              title="Dashboard Global de Impacto FQT"
              loading="lazy"
            />
          </div>

          <p className="text-xs text-gray-500 text-center mt-4" style={{ fontFamily: 'Roboto, sans-serif' }}>
            📊 Datos actualizados en tiempo real desde Zoho Analytics
          </p>
        </CardContent>
      </Card>

      {/* Información adicional */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            <Heart className="h-5 w-5 text-[#ea6852]" />
            Sobre el Programa de Voluntariado Corporativo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4" style={{ fontFamily: 'Roboto, sans-serif' }}>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Nuestra Misión</h4>
            <p className="text-gray-600 text-sm">
              La Fundación Quiero Trabajo trabaja para mejorar la empleabilidad de mujeres en situación de vulnerabilidad. 
              Desde 2007, más de 17,000 mujeres han participado en nuestros programas, y el 80% consigue empleo en menos de 6 meses.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">El Rol de {company.name}</h4>
            <p className="text-gray-600 text-sm">
              Como empresa colaboradora, {company.name} forma parte de una red de organizaciones comprometidas con el impacto social. 
              Los voluntarios de {company.name} dedican su tiempo y experiencia para ayudar a mujeres a prepararse para entrevistas laborales, 
              mejorando sus habilidades de comunicación y presentación personal.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Impacto Medible</h4>
            <p className="text-gray-600 text-sm">
              Cada sesión de mentoring o estilismo aumenta en un 27% las posibilidades de que una mujer consiga empleo. 
              El voluntariado corporativo no solo transforma vidas, sino que también fortalece el compromiso social de las empresas 
              y desarrolla habilidades de liderazgo y empatía en los voluntarios.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
