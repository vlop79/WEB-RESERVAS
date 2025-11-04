import { useVolunteerAuth } from "@/hooks/useVolunteerAuth";
import VolunteerLayout from "@/components/VolunteerLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, ExternalLink, Clock, Award, BookOpen, CheckCircle2 } from "lucide-react";

export default function VolunteerCourses() {
  const { volunteer, isLoading: authLoading } = useVolunteerAuth();

  // Cursos disponibles en Trainer Central
  const courses = [
    {
      id: 1,
      title: "En Clave de Género",
      description: "Curso completo sobre perspectiva de género en el acompañamiento a mujeres en búsqueda de empleo",
      duration: "Autogestionado",
      level: "Esencial",
      status: "available",
      progress: 0,
      url: "https://fundacion-quiero-trabajo.trainercentralsite.eu/course/enclavedegenero",
    },
  ];

  const handleAccessCourse = (courseUrl: string) => {
    window.open(courseUrl, "_blank");
  };

  if (authLoading) {
    return (
      <VolunteerLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ea6852] mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando cursos...</p>
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
            <GraduationCap className="h-8 w-8" />
            Academia de Voluntariado FQT
          </h1>
          <p className="text-gray-600 mt-2">
            Formación especializada para voluntarios FQT
          </p>
        </div>

        {/* Welcome Card */}
        <Card className="bg-gradient-to-r from-[#ea6852] to-orange-500 text-white border-none">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <GraduationCap className="h-16 w-16 flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-bold mb-2">Formación Continua</h3>
                <p className="text-white/90">
                  Fundación Quiero Trabajo te ofrece acceso exclusivo a cursos de formación en Trainer Central. Mejora
                  tus habilidades como voluntario/a y aumenta tu impacto en las sesiones.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <BookOpen className="h-4 w-4 text-[#ea6852]" />
                Cursos Disponibles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#ea6852]">1</p>
              <p className="text-xs text-gray-600 mt-1">Acceso ilimitado</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                Completados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">0</p>
              <p className="text-xs text-gray-600 mt-1">¡Empieza hoy!</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Award className="h-4 w-4 text-[#ea6852]" />
                Certificaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#ea6852]">0</p>
              <p className="text-xs text-gray-600 mt-1">Al completar cursos</p>
            </CardContent>
          </Card>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="bg-[#ea6852]/10 p-2 rounded">
                    <GraduationCap className="h-6 w-6 text-[#ea6852]" />
                  </div>
                  <span className="text-xs font-medium text-white bg-[#ea6852] px-2 py-1 rounded">
                    {course.level}
                  </span>
                </div>
                <CardTitle className="text-lg">{course.title}</CardTitle>
                <CardDescription className="mt-2">{course.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                  </div>

                  {course.progress > 0 && (
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Progreso</span>
                        <span className="font-semibold">{course.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#ea6852] h-2 rounded-full transition-all"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={() => handleAccessCourse(course.url)}
                    className="w-full bg-[#ea6852] hover:bg-[#d55a45] text-white"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {course.progress > 0 ? "Continuar Curso" : "Acceder al Curso"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-[#ea6852]/20 bg-[#ea6852]/5">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="bg-[#ea6852]/10 p-3 rounded-full">
                    <GraduationCap className="h-6 w-6 text-[#ea6852]" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Sobre Trainer Central</h3>
                  <p className="text-sm text-gray-700">
                    Trainer Central es la plataforma de formación online de Zoho. Todos los cursos están diseñados
                    específicamente para voluntarios de FQT y son completamente gratuitos.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Award className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Certificaciones</h3>
                  <p className="text-sm text-gray-700">
                    Al completar cada curso, recibirás un certificado digital que podrás compartir en LinkedIn o
                    incluir en tu CV profesional.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Card */}
        <Card className="bg-gradient-to-r from-blue-600 to-blue-500 text-white border-none">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold mb-2">¿Primera vez en Trainer Central?</h3>
            <p className="text-white/90 mb-4">
              Si es tu primera vez accediendo a los cursos, necesitarás crear una cuenta en Trainer Central usando el
              mismo email que tienes registrado en FQT.
            </p>
            <Button
              variant="outline"
              className="bg-white text-[#ea6852] hover:bg-[#ea6852]/5"
              onClick={() => window.open("https://trainercentral.zoho.com", "_blank")}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Ir a Trainer Central
            </Button>
          </CardContent>
        </Card>
      </div>
    </VolunteerLayout>
  );
}
