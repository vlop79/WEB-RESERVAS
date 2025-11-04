import { useVolunteerAuth } from "@/hooks/useVolunteerAuth";
import VolunteerLayout from "@/components/VolunteerLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Download, FileText, Video, Headphones, ExternalLink, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function VolunteerLibrary() {
  const { volunteer, isLoading: authLoading } = useVolunteerAuth();
  const [searchQuery, setSearchQuery] = useState("");

  // Manuales oficiales de FQT para voluntarios
  const resources = [
    {
      id: 1,
      title: "Manual de Servicio Individual",
      description: "Guía completa para voluntarios de mentoring individual: preparación de sesiones, código ético y metodología abrazo-empujón",
      type: "PDF",
      category: "Mentoring",
      url: "/manual-servicio-individual.pdf",
      icon: FileText,
      color: "text-[#ea6852]",
      bgColor: "bg-[#ea6852]/5",
    },
    {
      id: 2,
      title: "Manual de Programas Formativos",
      description: "Orientación para voluntarios que participan en formaciones grupales: itinerario, roles y mejores prácticas",
      type: "PDF",
      category: "Formación",
      url: "/manual-programas-formativos.pdf",
      icon: FileText,
      color: "text-[#ea6852]",
      bgColor: "bg-[#ea6852]/5",
    },
    {
      id: 3,
      title: "Manual de Estilistas",
      description: "Funciones y procedimientos para voluntarias de estilismo: misión, proceso completo y guías de exposición de ropa",
      type: "PDF",
      category: "Estilismo",
      url: "/manual-estilistas.pdf",
      icon: FileText,
      color: "text-[#ea6852]",
      bgColor: "bg-[#ea6852]/5",
    },
    {
      id: 4,
      title: "Código Ético del Voluntariado FQT",
      description: "Principios de actuación, valores y compromisos que guían la participación de todos los voluntarios de la fundación",
      type: "PDF",
      category: "Documentación General",
      url: "/codigo-etico.pdf",
      icon: FileText,
      color: "text-[#ea6852]",
      bgColor: "bg-[#ea6852]/5",
    },
    {
      id: 5,
      title: "Glosario de Igualdad",
      description: "Glosario de términos sobre igualdad de género, inclusión y perspectiva de género aplicada al voluntariado",
      type: "PDF",
      category: "Documentación General",
      url: "/glosario-igualdad.pdf",
      icon: FileText,
      color: "text-[#ea6852]",
      bgColor: "bg-[#ea6852]/5",
    },
    {
      id: 6,
      title: "Guía de Entrevistas Mejorada",
      description: "Guía completa para preparar y acompañar a mujeres en procesos de entrevistas laborales",
      type: "PDF",
      category: "Mentoring",
      url: "/guia-entrevistas.pdf",
      icon: FileText,
      color: "text-[#ea6852]",
      bgColor: "bg-[#ea6852]/5",
    },
    {
      id: 7,
      title: "Guía para Mentores: Mejora de CVs",
      description: "Cómo acompañar a mujeres en la mejora y optimización de sus currículums vitae",
      type: "PDF",
      category: "Mentoring",
      url: "/guia-mentores-cvs.pdf",
      icon: FileText,
      color: "text-[#ea6852]",
      bgColor: "bg-[#ea6852]/5",
    },
    {
      id: 8,
      title: "Guía para Mentores: Objetivos Profesionales",
      description: "Ayudando a mujeres a definir y alcanzar sus objetivos profesionales de forma efectiva",
      type: "PDF",
      category: "Mentoring",
      url: "/guia-mentores-objetivos.pdf",
      icon: FileText,
      color: "text-[#ea6852]",
      bgColor: "bg-[#ea6852]/5",
    },
    {
      id: 9,
      title: "Tips: Competencias Transversales",
      description: "Consejos prácticos para identificar y potenciar competencias transversales en las participantes",
      type: "PDF",
      category: "Mentoring",
      url: "/tips-competencias-transversales.pdf",
      icon: FileText,
      color: "text-[#ea6852]",
      bgColor: "bg-[#ea6852]/5",
    },
    {
      id: 10,
      title: "Guía para Mentores: Portales de Empleo",
      description: "Cómo revisar y optimizar el uso de portales de empleo con las participantes",
      type: "PDF",
      category: "Mentoring",
      url: "/guia-portales-empleo.pdf",
      icon: FileText,
      color: "text-[#ea6852]",
      bgColor: "bg-[#ea6852]/5",
    },
    {
      id: 11,
      title: "Investigar sobre la Empresa: Clave de Éxito",
      description: "Estrategias para investigar empresas antes de entrevistas y mejorar las posibilidades de éxito",
      type: "PDF",
      category: "Mentoring",
      url: "/investigar-empresa.pdf",
      icon: FileText,
      color: "text-[#ea6852]",
      bgColor: "bg-[#ea6852]/5",
    },
    {
      id: 12,
      title: "Guía de Preguntas de Entrevista Completa",
      description: "Banco completo de preguntas frecuentes en entrevistas y cómo preparar respuestas efectivas",
      type: "PDF",
      category: "Mentoring",
      url: "/guia-preguntas-entrevista.pdf",
      icon: FileText,
      color: "text-[#ea6852]",
      bgColor: "bg-[#ea6852]/5",
    },
    {
      id: 13,
      title: "Checklist: CV y Discursos FQT",
      description: "Lista de verificación para revisar CVs y discursos de presentación profesional",
      type: "PDF",
      category: "Mentoring",
      url: "/checklist-cv-discursos.pdf",
      icon: FileText,
      color: "text-[#ea6852]",
      bgColor: "bg-[#ea6852]/5",
    },
  ];

  const filteredResources = resources.filter(
    (resource) =>
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (authLoading) {
    return (
      <VolunteerLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ea6852] mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando biblioteca...</p>
          </div>
        </div>
      </VolunteerLayout>
    );
  }

  return (
    <VolunteerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#ea6852] flex items-center gap-2">
            <BookOpen className="h-8 w-8" />
            Biblioteca de Recursos
          </h1>
          <p className="text-gray-600 mt-2">
            Materiales y guías para mejorar tu experiencia como voluntario/a
          </p>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Buscar recursos por título, categoría o tema..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Resources Grid */}
        <div className="grid md:grid-cols-3 gap-4">
          {filteredResources.map((resource) => {
            const Icon = resource.icon;
            return (
              <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`${resource.bgColor} p-2 rounded`}>
                          <Icon className={`h-5 w-5 ${resource.color}`} />
                        </div>
                        <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {resource.category}
                        </span>
                      </div>
                      <CardTitle className="text-lg">{resource.title}</CardTitle>
                      <CardDescription className="mt-2">{resource.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-[#ea6852] hover:bg-[#d55a45] text-white"
                      onClick={() => window.open(resource.url, "_blank")}
                    >
                      {resource.type === "Video" || resource.type === "Audio" ? (
                        <>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Ver {resource.type}
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Descargar {resource.type}
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredResources.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No se encontraron recursos con "{searchQuery}"</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setSearchQuery("")}
              >
                Limpiar búsqueda
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <Card className="border-[#ea6852]/20 bg-[#ea6852]/5">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="bg-[#ea6852]/10 p-3 rounded-full">
                  <BookOpen className="h-6 w-6 text-[#ea6852]" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Sobre la Biblioteca</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Todos los recursos están diseñados específicamente para voluntarios de FQT</li>
                  <li>• Se añaden nuevos materiales regularmente basados en tu feedback</li>
                  <li>• Puedes sugerir temas para futuros recursos contactando al equipo</li>
                  <li>• Los materiales son de uso exclusivo para voluntarios activos</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </VolunteerLayout>
  );
}
