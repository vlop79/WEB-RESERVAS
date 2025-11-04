import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Mail, Eye, Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function EmailNotificationsManager() {
  const [previewType, setPreviewType] = useState<string | null>(null);
  const [editingType, setEditingType] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ subject: "", body: "" });
  
  const { data: settings, isLoading, refetch } = trpc.admin.getEmailNotificationSettings.useQuery();
  const updateSetting = trpc.admin.updateEmailNotificationSetting.useMutation({
    onSuccess: () => {
      toast.success("Configuración actualizada");
      refetch();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const handleToggle = async (notificationType: string, currentEnabled: boolean) => {
    await updateSetting.mutateAsync({
      notificationType,
      enabled: !currentEnabled,
    });
  };

  const getNotificationLabel = (type: string): string => {
    const labels: Record<string, string> = {
      booking_confirmation_volunteer: "Confirmación de Reserva (Voluntario)",
      booking_confirmation_host: "Confirmación de Reserva (Anfitrión)",
      booking_cancellation: "Cancelación de Reserva",
      reminder_24h: "Recordatorio 24h Antes",
      reminder_2h: "Recordatorio 2h Antes",
      rating_request: "Solicitud de Valoración",
      host_reassignment: "Reasignación de Anfitrión",
    };
    return labels[type] || type;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Notificaciones por Email
          </CardTitle>
          <CardDescription>
            Activa o desactiva los emails automáticos que se envían a voluntarios y anfitriones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {settings?.map((setting) => (
              <div
                key={setting.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">
                    {getNotificationLabel(setting.notificationType)}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    {setting.description}
                  </p>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingType(setting.notificationType);
                      setEditForm({
                        subject: getEmailSubject(setting.notificationType),
                        body: "",
                      });
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewType(setting.notificationType)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Previsualizar
                  </Button>
                  <Switch
                    checked={setting.enabled === 1}
                    onCheckedChange={() =>
                      handleToggle(setting.notificationType, setting.enabled === 1)
                    }
                    disabled={updateSetting.isPending}
                  />
                </div>
              </div>
            ))}
          </div>

          {settings && settings.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No hay configuraciones de notificaciones disponibles
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Template Dialog */}
      <Dialog open={!!editingType} onOpenChange={() => setEditingType(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Editar Plantilla: {editingType && getNotificationLabel(editingType)}
            </DialogTitle>
            <DialogDescription>
              Personaliza el contenido del email. Usa variables como {'{'}volunteerName{'}'}, {'{'}companyName{'}'}, {'{'}date{'}'}, {'{'}time{'}'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Asunto</label>
              <input
                type="text"
                className="w-full mt-1 px-3 py-2 border rounded-lg"
                value={editForm.subject}
                onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                placeholder="Asunto del email"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Contenido (HTML)</label>
              <textarea
                className="w-full mt-1 px-3 py-2 border rounded-lg font-mono text-sm"
                rows={15}
                value={editForm.body}
                onChange={(e) => setEditForm({ ...editForm, body: e.target.value })}
                placeholder="Contenido HTML del email..."
              />
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-blue-900 mb-2">Variables disponibles:</p>
              <div className="grid grid-cols-2 gap-2 text-sm text-blue-700">
                <code>{'{'}volunteerName{'}'}</code>
                <code>{'{'}companyName{'}'}</code>
                <code>{'{'}serviceName{'}'}</code>
                <code>{'{'}date{'}'}</code>
                <code>{'{'}time{'}'}</code>
                <code>{'{'}hostName{'}'}</code>
                <code>{'{'}hostEmail{'}'}</code>
                <code>{'{'}meetLink{'}'}</code>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setEditingType(null)}>
                Cancelar
              </Button>
              <Button onClick={() => {
                toast.success("Plantilla guardada");
                setEditingType(null);
              }}>
                Guardar Cambios
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={!!previewType} onOpenChange={() => setPreviewType(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Previsualización: {previewType && getNotificationLabel(previewType)}
            </DialogTitle>
            <DialogDescription>
              Así se verá el email que recibirán los usuarios
            </DialogDescription>
          </DialogHeader>
          <div className="border rounded-lg p-6 bg-white">
            <div className="mb-4 pb-4 border-b">
              <p className="text-sm text-gray-500">De: FQT Reservas &lt;noreply@quierotrabajo.org&gt;</p>
              <p className="text-sm text-gray-500">Para: voluntario@example.com</p>
              <p className="text-sm font-medium mt-2">
                Asunto: {getEmailSubject(previewType || "")}
              </p>
            </div>
            <div className="prose max-w-none">
              {getEmailPreview(previewType || "")}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function getEmailSubject(type: string): string {
  const subjects: Record<string, string> = {
    booking_confirmation_volunteer: "✅ Confirmación de tu Sesión con {companyName}",
    booking_confirmation_host: "📅 Nueva Reserva Asignada - {volunteerName}",
    booking_cancellation: "❌ Cancelación de Sesión",
    reminder_24h: "⏰ Recordatorio: Tu sesión es mañana",
    reminder_2h: "🔔 Tu sesión comienza en 2 horas",
    rating_request: "⭐ ¿Cómo fue tu experiencia?",
    host_reassignment: "📋 Nueva Sesión Asignada",
  };
  return subjects[type] || "Notificación FQT";
}

function getEmailPreview(type: string): JSX.Element {
  const previews: Record<string, JSX.Element> = {
    booking_confirmation_volunteer: (
      <div>
        <h2>¡Hola María!</h2>
        <p>Tu sesión ha sido confirmada con éxito.</p>
        <div className="bg-gray-50 p-4 rounded-lg my-4">
          <p><strong>Empresa:</strong> AXA</p>
          <p><strong>Servicio:</strong> Entrevista de Trabajo</p>
          <p><strong>Fecha:</strong> 15 de Enero, 2025</p>
          <p><strong>Hora:</strong> 10:00 - 11:00</p>
          <p><strong>Anfitrión:</strong> Laura García (laura@fqt.org)</p>
        </div>
        <p>Te esperamos. ¡Mucho ánimo!</p>
      </div>
    ),
    booking_confirmation_host: (
      <div>
        <h2>Hola Laura,</h2>
        <p>Se te ha asignado una nueva sesión:</p>
        <div className="bg-gray-50 p-4 rounded-lg my-4">
          <p><strong>Voluntaria:</strong> María López</p>
          <p><strong>Email:</strong> maria@example.com</p>
          <p><strong>Teléfono:</strong> +34 600 123 456</p>
          <p><strong>Empresa:</strong> AXA</p>
          <p><strong>Servicio:</strong> Entrevista de Trabajo</p>
          <p><strong>Fecha:</strong> 15 de Enero, 2025</p>
          <p><strong>Hora:</strong> 10:00 - 11:00</p>
        </div>
        <p>Recuerda preparar la sesión con antelación.</p>
      </div>
    ),
    booking_cancellation: (
      <div>
        <h2>Cancelación de Sesión</h2>
        <p>Te informamos que la siguiente sesión ha sido cancelada:</p>
        <div className="bg-red-50 p-4 rounded-lg my-4 border border-red-200">
          <p><strong>Empresa:</strong> AXA</p>
          <p><strong>Servicio:</strong> Entrevista de Trabajo</p>
          <p><strong>Fecha:</strong> 15 de Enero, 2025</p>
          <p><strong>Hora:</strong> 10:00 - 11:00</p>
        </div>
        <p>Puedes reservar otra sesión cuando lo necesites.</p>
      </div>
    ),
    reminder_24h: (
      <div>
        <h2>¡Hola María!</h2>
        <p>Te recordamos que mañana tienes una sesión programada:</p>
        <div className="bg-blue-50 p-4 rounded-lg my-4 border border-blue-200">
          <p><strong>Empresa:</strong> AXA</p>
          <p><strong>Servicio:</strong> Entrevista de Trabajo</p>
          <p><strong>Fecha:</strong> Mañana, 15 de Enero</p>
          <p><strong>Hora:</strong> 10:00 - 11:00</p>
        </div>
        <p>¡Te deseamos mucho éxito!</p>
      </div>
    ),
    reminder_2h: (
      <div>
        <h2>¡Hola María!</h2>
        <p>Tu sesión comienza en 2 horas:</p>
        <div className="bg-orange-50 p-4 rounded-lg my-4 border border-orange-200">
          <p><strong>Empresa:</strong> AXA</p>
          <p><strong>Hora:</strong> 10:00 - 11:00</p>
          <p><strong>Link de reunión:</strong> <a href="#">Unirse a Google Meet</a></p>
        </div>
        <p>¡Nos vemos pronto!</p>
      </div>
    ),
    rating_request: (
      <div>
        <h2>¡Hola María!</h2>
        <p>Esperamos que tu sesión haya sido útil. ¿Podrías compartir tu experiencia?</p>
        <div className="text-center my-6">
          <p className="mb-4">¿Cómo calificarías tu sesión?</p>
          <div className="flex justify-center gap-2 text-3xl">
            ⭐⭐⭐⭐⭐
          </div>
        </div>
        <p className="text-sm text-gray-500">Tu opinión nos ayuda a mejorar.</p>
      </div>
    ),
    host_reassignment: (
      <div>
        <h2>Hola Carlos,</h2>
        <p>Se te ha reasignado la siguiente sesión:</p>
        <div className="bg-gray-50 p-4 rounded-lg my-4">
          <p><strong>Voluntaria:</strong> María López</p>
          <p><strong>Empresa:</strong> AXA</p>
          <p><strong>Fecha:</strong> 15 de Enero, 2025</p>
          <p><strong>Hora:</strong> 10:00 - 11:00</p>
        </div>
        <p>Gracias por tu colaboración.</p>
      </div>
    ),
  };
  
  return previews[type] || <p>Vista previa no disponible</p>;
}
