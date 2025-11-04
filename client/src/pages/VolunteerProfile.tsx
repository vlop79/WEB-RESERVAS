import VolunteerLayout from "@/components/VolunteerLayout";
import { useVolunteerAuth } from "@/hooks/useVolunteerAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Camera, Save, Upload } from "lucide-react";
import { useRef, useState } from "react";

export default function VolunteerProfile() {
  const { volunteer, token } = useVolunteerAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: volunteer?.name || "",
    surname: volunteer?.surname || "",
    position: volunteer?.position || "",
    birthDate: volunteer?.birthDate || "",
    phone: volunteer?.phone || "",
  });

  const updateMutation = trpc.volunteer.updateProfile.useMutation({
    onSuccess: () => {
      toast.success("Perfil actualizado correctamente");
      setIsEditing(false);
      window.location.reload(); // Reload to get updated data
    },
    onError: (error) => {
      toast.error(error.message || "Error al actualizar el perfil");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    updateMutation.mutate({
      token,
      ...formData,
    });
  };

  const handleCancel = () => {
    setFormData({
      name: volunteer?.name || "",
      surname: volunteer?.surname || "",
      position: volunteer?.position || "",
      birthDate: volunteer?.birthDate || "",
      phone: volunteer?.phone || "",
    });
    setIsEditing(false);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona una imagen');
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen no puede superar los 5MB');
      return;
    }

    setUploadingPhoto(true);

    try {
      // Convertir a base64 para enviar al servidor
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        
        try {
          const response = await fetch('/api/trpc/volunteer.uploadPhoto', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              token,
              photoData: base64String,
              fileName: file.name,
            }),
          });

          if (response.ok) {
            toast.success('Foto actualizada correctamente');
            window.location.reload();
          } else {
            toast.error('Error al subir la foto');
          }
        } catch (error) {
          toast.error('Error al subir la foto');
        } finally {
          setUploadingPhoto(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error('Error al procesar la imagen');
      setUploadingPhoto(false);
    }
  };

  return (
    <VolunteerLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold" style={{ color: "#ea6852" }}>
            Mi Perfil
          </h1>
          <p className="text-muted-foreground mt-2">
            Gestiona tu información personal y profesional
          </p>
        </div>

        <div className="grid gap-6">
          {/* Photo Card */}
          <Card>
            <CardHeader>
              <CardTitle>Foto de Perfil</CardTitle>
              <CardDescription>
                Tu foto aparecerá en tu perfil y certificados
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="h-32 w-32 rounded-full bg-gradient-to-br from-[#ea6852] to-[#f5a623] flex items-center justify-center text-white text-4xl font-bold">
                  {volunteer?.photoUrl ? (
                    <img
                      src={volunteer.photoUrl}
                      alt="Foto de perfil"
                      className="h-32 w-32 rounded-full object-cover"
                    />
                  ) : (
                    <span>{volunteer?.name?.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <Button
                  size="icon"
                  className="absolute bottom-0 right-0 rounded-full"
                  style={{ backgroundColor: "#ea6852" }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="h-4 w-4" />
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Haz clic en el icono de cámara para cambiar tu foto
              </p>
            </CardContent>
          </Card>

          {/* Personal Info Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Información Personal</CardTitle>
                  <CardDescription>
                    Tus datos personales y de contacto
                  </CardDescription>
                </div>
                {!isEditing && (
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    style={{ borderColor: "#ea6852", color: "#ea6852" }}
                  >
                    Editar
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!isEditing}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="surname">Apellidos</Label>
                    <Input
                      id="surname"
                      value={formData.surname}
                      onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={volunteer?.email || ""}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    El email no se puede cambiar
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Cargo</Label>
                  <Input
                    id="position"
                    placeholder="Ej: Consultora Senior"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+34 600 000 000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-2 pt-4">
                    <Button
                      type="submit"
                      disabled={updateMutation.isPending}
                      style={{ backgroundColor: "#ea6852" }}
                    >
                      {updateMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Guardar Cambios
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      disabled={updateMutation.isPending}
                    >
                      Cancelar
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </VolunteerLayout>
  );
}
