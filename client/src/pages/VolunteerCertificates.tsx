import { useVolunteerAuth } from "@/hooks/useVolunteerAuth";
import VolunteerLayout from "@/components/VolunteerLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Download, FileText, Star, Calendar, CheckCircle2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import SocialShareButtons from "@/components/SocialShareButtons";

export default function VolunteerCertificates() {
  const { volunteer, isLoading: authLoading } = useVolunteerAuth();

  // Mock data for certificates - replace with actual tRPC queries
  const certificates = [
    {
      id: 1,
      type: "Primera Sesión",
      description: "Certificado por completar tu primera sesión de voluntariado",
      sessionsCount: 1,
      issuedAt: "2024-01-15",
      pdfUrl: "#",
      status: "available",
    },
    {
      id: 2,
      type: "5 Sesiones",
      description: "Certificado por completar 5 sesiones de voluntariado",
      sessionsCount: 5,
      issuedAt: "2024-03-20",
      pdfUrl: "#",
      status: "available",
    },
    {
      id: 3,
      type: "10 Sesiones",
      description: "Certificado de excelencia por 10 sesiones completadas",
      sessionsCount: 10,
      issuedAt: null,
      pdfUrl: null,
      status: "locked",
      progress: 7, // 7 of 10 sessions completed
    },
    {
      id: 4,
      type: "25 Sesiones",
      description: "Certificado de compromiso excepcional",
      sessionsCount: 25,
      issuedAt: null,
      pdfUrl: null,
      status: "locked",
      progress: 7,
    },
  ];

  const handleDownload = (certificate: typeof certificates[0]) => {
    if (certificate.status === "available" && certificate.pdfUrl) {
      // In production, this would trigger actual PDF download
      window.open(certificate.pdfUrl, "_blank");
    }
  };

  if (authLoading) {
    return (
      <VolunteerLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ea6852] mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando certificados...</p>
          </div>
        </div>
      </VolunteerLayout>
    );
  }

  const availableCertificates = certificates.filter((c) => c.status === "available");
  const lockedCertificates = certificates.filter((c) => c.status === "locked");

  return (
    <VolunteerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#ea6852] flex items-center gap-2">
            <Award className="h-8 w-8" />
            Mis Certificados
          </h1>
          <p className="text-gray-600 mt-2">
            Descarga tus certificados digitales de voluntariado
          </p>
        </div>

        {/* Stats Card */}
        <Card className="bg-gradient-to-r from-[#ea6852] to-orange-500 text-white border-none">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <FileText className="h-8 w-8 mx-auto mb-2" />
                <p className="text-3xl font-bold">{availableCertificates.length}</p>
                <p className="text-sm text-white/90">Certificados Disponibles</p>
              </div>
              <div className="text-center">
                <CheckCircle2 className="h-8 w-8 mx-auto mb-2" />
                <p className="text-3xl font-bold">7</p>
                <p className="text-sm text-white/90">Sesiones Completadas</p>
              </div>
              <div className="text-center">
                <Star className="h-8 w-8 mx-auto mb-2" />
                <p className="text-3xl font-bold">{lockedCertificates.length}</p>
                <p className="text-sm text-white/90">Próximos Logros</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Available Certificates */}
        {availableCertificates.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Certificados Disponibles</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {availableCertificates.map((cert) => (
                <Card key={cert.id} className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2 text-green-700">
                          <Award className="h-5 w-5" />
                          {cert.type}
                        </CardTitle>
                        <CardDescription className="mt-2">{cert.description}</CardDescription>
                      </div>
                      <div className="bg-green-100 p-2 rounded-full">
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>Obtenido el {new Date(cert.issuedAt!).toLocaleDateString("es-ES")}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FileText className="h-4 w-4" />
                        <span>{cert.sessionsCount} sesiones certificadas</span>
                      </div>
                      <Button
                        onClick={() => handleDownload(cert)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Descargar Certificado
                      </Button>
                      <div className="mt-3 flex justify-center">
                        <SocialShareButtons
                          title={`¡He obtenido el certificado "${cert.type}"!`}
                          description={`Acabo de conseguir mi certificado de ${cert.sessionsCount} sesiones de voluntariado en Fundación Quiero Trabajo. ¡Orgulloso/a de contribuir al impacto social!`}
                          hashtags={["FQT", "Voluntariado", "ImpactoSocial", "Certificado"]}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Locked Certificates */}
        {lockedCertificates.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Próximos Certificados</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {lockedCertificates.map((cert) => (
                <Card key={cert.id} className="border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-white opacity-75">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2 text-gray-600">
                          <Award className="h-5 w-5" />
                          {cert.type}
                        </CardTitle>
                        <CardDescription className="mt-2">{cert.description}</CardDescription>
                      </div>
                      <div className="bg-gray-200 p-2 rounded-full">
                        <Award className="h-6 w-6 text-gray-400" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Progreso</span>
                          <span className="font-semibold text-gray-900">
                            {cert.progress} / {cert.sessionsCount} sesiones
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-[#ea6852] h-3 rounded-full transition-all"
                            style={{ width: `${(cert.progress! / cert.sessionsCount) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        Te faltan {cert.sessionsCount - cert.progress!} sesiones para desbloquear este certificado
                      </p>
                      <Button disabled className="w-full" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Bloqueado
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Info Card */}
        <Card className="border-[#ea6852]/20 bg-[#ea6852]/5">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="bg-[#ea6852]/10 p-3 rounded-full">
                  <FileText className="h-6 w-6 text-[#ea6852]" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Sobre tus certificados</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Los certificados son documentos oficiales firmados por FQT</li>
                  <li>• Puedes compartirlos en LinkedIn o incluirlos en tu CV</li>
                  <li>• Cada certificado incluye un código de verificación único</li>
                  <li>• Se generan automáticamente al completar los hitos</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </VolunteerLayout>
  );
}
