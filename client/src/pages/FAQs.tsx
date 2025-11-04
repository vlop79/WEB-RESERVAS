import Header from "@/components/Header";
import CookieBanner from "@/components/CookieBanner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertCircle, CheckCircle2, Heart, Users, Calendar, FileText } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function FAQs() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container py-8 max-w-4xl">
        {/* Important Notice */}
        <Alert className="mb-8 border-[#ea6852] bg-[#ea6852]/5">
          <AlertCircle className="h-5 w-5 text-[#ea6852]" />
          <AlertTitle className="text-[#ea6852] font-bold">Requisito Importante</AlertTitle>
          <AlertDescription className="text-foreground">
            Para participar como voluntario es <strong>necesario estar registrado y haber firmado el Acuerdo de Colaboración</strong>. 
            Este documento establece las buenas prácticas, confidencialidad y responsabilidad civil, aspectos clave para la Fundación Quiero Trabajo.
          </AlertDescription>
        </Alert>

        {/* Introduction */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl" style={{ color: "#ea6852" }}>
              Una verdad simple
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p className="text-lg leading-relaxed">
              Toda mujer merece una oportunidad laboral digna. Tú tienes el poder de acompañarla en su camino. Cuando unimos fuerzas, transformamos vidas y construimos futuros.
            </p>
          </CardContent>
        </Card>

        {/* Who We Are */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-[#ea6852]" />
              Quiénes somos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              En la Fundación Quiero Trabajo (FQT) creemos que el empleo no es solo un medio de
              vida, sino también una fuente de dignidad, autonomía y confianza. Desde 2016 hemos
              acompañado a más de 17.000 mujeres que, gracias a su esfuerzo y a la colaboración de
              personas como tú, han recuperado su lugar en el mundo laboral.
            </p>
            <p>
              Nuestra tasa de inserción supera el <strong>80%</strong>, pero más allá de los números, lo que logramos son 
              historias de superación y de esperanza.
            </p>
            <blockquote className="border-l-4 border-[#ea6852] pl-4 italic text-muted-foreground">
              "Cuando cambias la vida de una mujer, transformas la de toda una comunidad."
            </blockquote>
          </CardContent>
        </Card>

        {/* Your Role */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-[#ea6852]" />
              Tu papel como voluntario corporativo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Al ofrecer tu tiempo y tu mirada, te conviertes en un faro que ayuda a una mujer a preparar
              con confianza una entrevista de trabajo. No se trata solo de revisar un currículum o de
              practicar preguntas, sino de transmitir seguridad, animar y reforzar todo lo positivo que ella
              ya tiene dentro.
            </p>
            <div className="bg-[#ea6852]/10 p-4 rounded-lg">
              <p className="font-semibold text-[#ea6852]">
                Tu acompañamiento aumenta en un 27% sus posibilidades de conseguir empleo
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Step by Step Process */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#ea6852]" />
              Paso a paso: Cómo participar
            </CardTitle>
            <CardDescription>El proceso completo desde el registro hasta el impacto</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#ea6852] text-white flex items-center justify-center font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Registro y Acuerdo</h3>
                  <p className="text-muted-foreground">
                    Regístrate en la plataforma y firma el <strong>Acuerdo de Colaboración</strong>. Este documento 
                    establece las buenas prácticas, confidencialidad y responsabilidad civil necesarias para proteger 
                    tanto a las voluntarias como a las participantes.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#ea6852] text-white flex items-center justify-center font-bold">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Selecciona tu empresa</h3>
                  <p className="text-muted-foreground">
                    El voluntariado corporativo se organiza a través de tu empresa en un día fijo o bien con un calendario abierto cada mes. 
                    Selecciona tu empresa en el calendario de reservas.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#ea6852] text-white flex items-center justify-center font-bold">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Inscríbete en una sesión</h3>
                  <p className="text-muted-foreground">
                    Elige el servicio (Mentoring o Editsesión) y reserva tu slot horario. Puedes participar tantas 
                    veces como quieras, siempre con el compromiso de estar presente.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#ea6852] text-white flex items-center justify-center font-bold">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Recibe la documentación</h3>
                  <p className="text-muted-foreground">
                    Un día antes de tu sesión recibirás: el CV ciego de la participante, detalles del puesto, 
                    la empresa, hora de entrevista y enlace de conexión. También tendrás acceso al welcome pack 
                    con guías y plantillas.
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#ea6852] text-white flex items-center justify-center font-bold">
                  5
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Realiza la sesión (1 hora)</h3>
                  <p className="text-muted-foreground">
                    Conecta con la participante y ofrece tu acompañamiento. Mantén flexibilidad hasta 2 horas antes, 
                    ya que muchas mujeres reciben entrevistas con poca anticipación.
                  </p>
                </div>
              </div>

              {/* Step 6 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#ea6852] text-white flex items-center justify-center font-bold">
                  6
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Comparte tu feedback</h3>
                  <p className="text-muted-foreground">
                    Al terminar, responde dos preguntas breves. Este feedback es muy valioso para las entidades 
                    que siguen acompañando a la mujer.
                  </p>
                </div>
              </div>

              {/* Step 7 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#ea6852] text-white flex items-center justify-center font-bold">
                  7
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Conoce el impacto</h3>
                  <p className="text-muted-foreground">
                    En un plazo máximo de 2 meses te contaremos si la participante logró insertarse laboralmente. 
                    ¡Tu contribución marca la diferencia!
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQs Accordion */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#ea6852]" />
              Preguntas Frecuentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>¿Qué pasa si necesito cancelar mi sesión?</AccordionTrigger>
                <AccordionContent>
                  Si necesitas cancelar, te pedimos que nos avises con al menos <strong>24 horas de antelación</strong> 
                  para poder reorganizarnos y no dejar a ninguna participante sin apoyo.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>¿Qué información recibiré sobre la participante?</AccordionTrigger>
                <AccordionContent>
                  En FQT creemos en la igualdad de oportunidades y en no poner etiquetas. Por eso no compartimos 
                  más información personal que la necesaria. Recibirás su CV ciego y será ella quien decida si 
                  quiere contar algo sobre su situación durante la sesión.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>¿Recibiré apoyo y formación?</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2">¡Por supuesto! Desde el primer momento estarás acompañado:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Acceso a formación online</li>
                    <li>Materiales prácticos del welcome pack</li>
                    <li>Posibilidad de acompañar a un voluntario experimentado en tus primeras sesiones</li>
                    <li>Referentes en cada ciudad:
                      <ul className="list-circle pl-6 mt-1">
                        <li>Barcelona: Erika – barcelona@quierotrabajo.org</li>
                        <li>Madrid: Dioni – madrid@quierotrabajo.org</li>
                        <li>Málaga: Valentina – malaga@quierotrabajo.org</li>
                      </ul>
                    </li>
                    <li>Champions corporativos dentro de tu empresa</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>¿Cuánto tiempo dura cada sesión?</AccordionTrigger>
                <AccordionContent>
                  Cada sesión dura <strong>1 hora</strong>. Te pedimos mantener cierta flexibilidad hasta dos horas 
                  antes de la actividad, porque muchas mujeres reciben entrevistas con poca anticipación.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>¿Qué son los mensajes SOS?</AccordionTrigger>
                <AccordionContent>
                  En momentos de alta demanda, quizá recibas un mensaje de SOS para sumar tu ayuda fuera del día 
                  habitual. No es obligatorio, pero si puedes y quieres, tu apoyo será un regalo muy valioso.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger>¿Qué beneficios obtendré como voluntario?</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2">Más allá de los resultados inmediatos, esta experiencia te permitirá:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Desarrollar habilidades de comunicación, escucha y liderazgo</li>
                    <li>Acceder a microcredenciales universitarias</li>
                    <li>Participar en una comunidad activa de voluntarios</li>
                    <li>Sentir el orgullo de haber sumado a la transformación de una vida</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7">
                <AccordionTrigger>¿Cuál es el impacto real de mi participación?</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2">Tu acompañamiento tiene un impacto directo y medible:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Aumenta en un <strong>27%</strong> las posibilidades de que la mujer consiga empleo</li>
                    <li>Le proporciona seguridad y confianza para afrontar la entrevista</li>
                    <li>Contribuye a una tasa de inserción laboral superior al <strong>80%</strong></li>
                    <li>Ayuda a recuperar la independencia y dignidad de una mujer y su familia</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Final Message */}
        <Card className="border-[#ea6852]">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle2 className="h-12 w-12 text-[#ea6852] mx-auto" />
              <blockquote className="text-xl italic text-muted-foreground">
                "Dar tu tiempo no es perderlo: es transformarlo en futuro."
              </blockquote>
              <p className="text-lg font-semibold" style={{ color: "#ea6852" }}>
                Gracias por tu generosidad, por tu confianza y por creer que un futuro mejor es posible.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur mt-12">
        <div className="container py-8">
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="FQT" className="h-8 w-8" />
              <p className="text-sm text-muted-foreground">
                © 2025 Fundación Quiero Trabajo. Todos los derechos reservados.
              </p>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-muted-foreground">
              <a
                href="https://quierotrabajo.org/politica-de-privacidad/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Política de privacidad
              </a>
              <a
                href="https://quierotrabajo.org/aviso-legal/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Aviso legal
              </a>
              <span className="hidden md:inline">|</span>
              <a href="mailto:contacto@quierotrabajo.org" className="text-primary hover:underline">
                Contáctanos
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Cookie Banner */}
      <CookieBanner />
    </div>
  );
}
