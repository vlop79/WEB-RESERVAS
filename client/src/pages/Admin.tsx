import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Building2, Calendar, Users, ArrowLeft, BarChart3 } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";
import EmailNotificationsManager from "@/components/EmailNotificationsManager";
import RatingsPanel from "@/components/RatingsPanel";
import ResourceDownloadsPanel from "@/components/ResourceDownloadsPanel";

export default function Admin() {
  const { user, loading, isAuthenticated } = useAuth();
  const [showCompanyDialog, setShowCompanyDialog] = useState(false);
  const [showSlotsDialog, setShowSlotsDialog] = useState(false);
  const [editingCompany, setEditingCompany] = useState<number | null>(null);
  const [companyForm, setCompanyForm] = useState({
    name: "",
    slug: "",
    logoUrl: "",
    assignedDay: "",
    assignedDay2: "",
    assignedDay3: "",
    accountManager: "",
    fullMonthCalendar: 0,
    active: 1,
  });
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [slotsForm, setSlotsForm] = useState({
    companyId: 0,
    serviceTypeId: 1,
    startDate: "",
    endDate: "",
    startHour: 11,
    endHour: 18,
    maxVolunteers: 1,
  });

  const isTeamMember = user?.role === "admin" || user?.role === "user";

  const { data: companies, refetch: refetchCompanies } = trpc.admin.getAllCompanies.useQuery(
    undefined,
    { enabled: isAuthenticated && user?.role === "admin" }
  );

  const { data: bookings } = trpc.admin.getAllBookings.useQuery(undefined, {
    enabled: isAuthenticated && isTeamMember,
  });

  const { data: allUsers, refetch: refetchUsers } = trpc.admin.getAllUsers.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });

  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showEditUserDialog, setShowEditUserDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showDeleteUserDialog, setShowDeleteUserDialog] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);
  const [userForm, setUserForm] = useState({
    openId: "",
    name: "",
    email: "",
    role: "user" as "admin" | "user" | "empresa",
    companyId: 0,
    password: "",
    confirmPassword: "",
  });
  const [editUserForm, setEditUserForm] = useState({
    name: "",
    email: "",
    companyId: 0,
  });
  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const createCompany = trpc.admin.createCompany.useMutation({
    onSuccess: () => {
      toast.success("Empresa creada correctamente");
      setShowCompanyDialog(false);
      setCompanyForm({ name: "", slug: "", logoUrl: "", assignedDay: "", assignedDay2: "", assignedDay3: "", accountManager: "", fullMonthCalendar: 0, active: 1 });
      setLogoPreview(null);
      refetchCompanies();
    },
    onError: (error) => {
      toast.error("Error al crear empresa", { description: error.message });
    },
  });

  const updateCompany = trpc.admin.updateCompany.useMutation({
    onSuccess: () => {
      toast.success("Empresa actualizada correctamente");
      setShowCompanyDialog(false);
      setEditingCompany(null);
      setCompanyForm({ name: "", slug: "", logoUrl: "", assignedDay: "", assignedDay2: "", assignedDay3: "", accountManager: "", fullMonthCalendar: 0, active: 1 });
      setLogoPreview(null);
      refetchCompanies();
    },
    onError: (error) => {
      toast.error("Error al actualizar empresa", { description: error.message });
    },
  });

  const uploadLogo = trpc.admin.uploadLogo.useMutation({
    onSuccess: (data) => {
      setCompanyForm({ ...companyForm, logoUrl: data.url });
      setUploadingLogo(false);
      toast.success("Logo subido correctamente");
    },
    onError: (error) => {
      setUploadingLogo(false);
      toast.error("Error al subir logo", { description: error.message });
    },
  });

  const createUser = trpc.admin.createUser.useMutation({
    onSuccess: () => {
      toast.success("Usuario creado correctamente");
      setShowUserDialog(false);
      setUserForm({ openId: "", name: "", email: "", role: "user", companyId: 0, password: "", confirmPassword: "" });
      refetchUsers();
    },
    onError: (error) => {
      toast.error("Error al crear usuario", { description: error.message });
    },
  });

  const updateUserRole = trpc.admin.updateUserRole.useMutation({
    onSuccess: () => {
      toast.success("Rol actualizado correctamente");
      refetchUsers();
    },
    onError: (error) => {
      toast.error("Error al actualizar rol", { description: error.message });
    },
  });

  const updateCompanyUser = trpc.admin.updateCompanyUser.useMutation({
    onSuccess: () => {
      toast.success("Usuario actualizado correctamente");
      setShowEditUserDialog(false);
      refetchUsers();
    },
    onError: (error) => {
      toast.error("Error al actualizar usuario", { description: error.message });
    },
  });

  const updateCompanyUserPassword = trpc.admin.updateCompanyUserPassword.useMutation({
    onSuccess: () => {
      toast.success("Contraseña actualizada correctamente");
      setShowPasswordDialog(false);
      setPasswordForm({ newPassword: "", confirmPassword: "" });
    },
    onError: (error) => {
      toast.error("Error al actualizar contraseña", { description: error.message });
    },
  });

  const deleteUser = trpc.admin.deleteUser.useMutation({
    onSuccess: () => {
      toast.success("Usuario eliminado correctamente");
      setShowDeleteUserDialog(false);
      setDeletingUserId(null);
      refetchUsers();
    },
    onError: (error) => {
      toast.error("Error al eliminar usuario", { description: error.message });
    },
  });

  const bulkCreateSlots = trpc.admin.bulkCreateSlots.useMutation({
    onSuccess: (data) => {
      toast.success(`${data.count} slots creados correctamente`);
      setShowSlotsDialog(false);
      setSlotsForm({
        companyId: 0,
        serviceTypeId: 1,
        startDate: "",
        endDate: "",
        startHour: 11,
        endHour: 18,
        maxVolunteers: 1,
      });
    },
    onError: (error) => {
      toast.error("Error al crear slots", { description: error.message });
    },
  });

  const handleCreateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCompany) {
      updateCompany.mutate({ id: editingCompany, ...companyForm });
    } else {
      createCompany.mutate(companyForm);
    }
  };

  const handleEditCompany = (company: any) => {
    setEditingCompany(company.id);
    setCompanyForm({
      name: company.name,
      slug: company.slug,
      logoUrl: company.logoUrl || "",
      assignedDay: company.assignedDay || "",
      assignedDay2: company.assignedDay2 || "",
      assignedDay3: company.assignedDay3 || "",
      accountManager: company.accountManager || "",
      fullMonthCalendar: company.fullMonthCalendar ?? 0,
      active: company.active,
    });
    setLogoPreview(company.logoUrl || null);
    setShowCompanyDialog(true);
  };

  const handleCloseCompanyDialog = (open: boolean) => {
    setShowCompanyDialog(open);
    if (!open) {
      setEditingCompany(null);
      setCompanyForm({ name: "", slug: "", logoUrl: "", assignedDay: "", assignedDay2: "", assignedDay3: "", accountManager: "", fullMonthCalendar: 0, active: 1 });
      setLogoPreview(null);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor selecciona un archivo de imagen");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("El archivo es demasiado grande. Máximo 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to S3
    setUploadingLogo(true);
    const base64Reader = new FileReader();
    base64Reader.onloadend = () => {
      const base64 = (base64Reader.result as string).split(",")[1];
      uploadLogo.mutate({
        fileName: file.name,
        fileData: base64,
        mimeType: file.type,
      });
    };
    base64Reader.readAsDataURL(file);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar contraseñas solo para usuarios empresa
    if (userForm.role === "empresa") {
      if (!userForm.password) {
        toast.error("La contraseña es obligatoria para usuarios empresa");
        return;
      }
      if (userForm.password.length < 6) {
        toast.error("La contraseña debe tener al menos 6 caracteres");
        return;
      }
      if (userForm.password !== userForm.confirmPassword) {
        toast.error("Las contraseñas no coinciden");
        return;
      }
    }
    
    // Enviar solo los campos necesarios
    const { confirmPassword, ...dataToSend } = userForm;
    createUser.mutate(dataToSend);
  };

  const handleChangeUserRole = (userId: number, newRole: "admin" | "user" | "empresa") => {
    updateUserRole.mutate({ userId, role: newRole });
  };

  const handleEditUser = (userId: number) => {
    const userToEdit = allUsers?.find(u => u.id === userId);
    if (userToEdit) {
      setEditingUserId(userId);
      setEditUserForm({
        name: userToEdit.name || "",
        email: userToEdit.email || "",
        companyId: userToEdit.companyId || 0,
      });
      setShowEditUserDialog(true);
    }
  };

  const handleSaveEditUser = () => {
    if (!editingUserId) return;
    updateCompanyUser.mutate({
      userId: editingUserId,
      ...editUserForm,
    });
  };

  const handleOpenPasswordDialog = (userId: number) => {
    setEditingUserId(userId);
    setPasswordForm({ newPassword: "", confirmPassword: "" });
    setShowPasswordDialog(true);
  };

  const handleSavePassword = () => {
    if (!editingUserId) return;
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    updateCompanyUserPassword.mutate({
      userId: editingUserId,
      newPassword: passwordForm.newPassword,
    });
  };

  const handleOpenDeleteUserDialog = (userId: number) => {
    setDeletingUserId(userId);
    setShowDeleteUserDialog(true);
  };

  const handleConfirmDeleteUser = () => {
    if (!deletingUserId) return;
    deleteUser.mutate({ userId: deletingUserId });
  };

  const handleCreateSlots = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate array of dates from startDate to endDate
    const start = new Date(slotsForm.startDate);
    const end = new Date(slotsForm.endDate);
    const dates: string[] = [];
    
    const currentDate = new Date(start);
    while (currentDate <= end) {
      dates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    bulkCreateSlots.mutate({
      ...slotsForm,
      dates,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Acceso restringido</CardTitle>
            <CardDescription>Debes iniciar sesión para acceder al panel de administración</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full" onClick={() => (window.location.href = getLoginUrl())}>
              Iniciar sesión
            </Button>
            <Link href="/">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al inicio
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Permitir acceso a admin y usuarios del equipo
  if (user?.role !== "admin" && user?.role !== "user") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Acceso restringido</CardTitle>
            <CardDescription>No tienes permisos para acceder a esta página</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al inicio
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/logo-fqt-icon.png" alt="FQT" className="h-10 w-10" />
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Inicio
              </Button>
            </Link>
            <h1 className="text-xl font-bold">Panel de Administración</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{user.name}</span>
            <Badge variant="secondary">Admin</Badge>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <div className="grid gap-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
              <CardDescription>Accede a las funciones principales del sistema</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <Link href="/admin/dashboard">
                <Button className="w-full">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/admin/reservas">
                <Button className="w-full">
                  <Calendar className="mr-2 h-4 w-4" />
                  Gestionar Reservas
                </Button>
              </Link>
              <Link href="/admin/calendario">
                <Button variant="outline" className="w-full">
                  <Calendar className="mr-2 h-4 w-4" />
                  Ver Calendario
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Empresas</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{companies?.length || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reservas</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{bookings?.length || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Voluntarios Activos</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Set(bookings?.map((b) => b.volunteerEmail)).size || 0}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Email Notifications Management */}
          <EmailNotificationsManager />

          {/* Ratings Panel */}
          <RatingsPanel />

          {/* Resource Downloads Stats */}
          <ResourceDownloadsPanel />

          {/* Companies Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Gestión de Empresas</CardTitle>
                  <CardDescription>Añade, edita o desactiva empresas</CardDescription>
                </div>
                <Dialog open={showCompanyDialog} onOpenChange={handleCloseCompanyDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Nueva Empresa
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{editingCompany ? "Editar Empresa" : "Crear Nueva Empresa"}</DialogTitle>
                      <DialogDescription>
                        {editingCompany ? "Modifica los datos de la empresa" : "Añade una nueva empresa al sistema de reservas"}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateCompany} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nombre *</Label>
                        <Input
                          id="name"
                          required
                          value={companyForm.name}
                          onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                          placeholder="Ej: Deloitte"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="slug">Slug (URL) *</Label>
                        <Input
                          id="slug"
                          required
                          value={companyForm.slug}
                          onChange={(e) =>
                            setCompanyForm({
                              ...companyForm,
                              slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                            })
                          }
                          placeholder="Ej: deloitte"
                        />
                        <p className="text-xs text-muted-foreground">
                          URL: /reservar/{companyForm.slug || "slug"}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="logoFile">Logo de la Empresa</Label>
                        <div className="flex items-center gap-4">
                          <Input
                            id="logoFile"
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            disabled={uploadingLogo}
                          />
                          {uploadingLogo && (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          )}
                        </div>
                        {(logoPreview || companyForm.logoUrl) && (
                          <div className="mt-2">
                            <img
                              src={logoPreview || companyForm.logoUrl}
                              alt="Vista previa del logo"
                              className="h-16 w-auto object-contain border rounded p-2"
                            />
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Formatos: JPG, PNG, SVG. Máximo 5MB
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="logoUrl">O pega la URL del Logo</Label>
                        <Input
                          id="logoUrl"
                          type="url"
                          value={companyForm.logoUrl || ""}
                          onChange={(e) => setCompanyForm({ ...companyForm, logoUrl: e.target.value })}
                          placeholder="https://ejemplo.com/logo.png"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="assignedDay">Día Asignado 1 (opcional)</Label>
                        <Input
                          id="assignedDay"
                          value={companyForm.assignedDay || ""}
                          onChange={(e) => setCompanyForm({ ...companyForm, assignedDay: e.target.value })}
                          placeholder="Ej: 3r Jueves, 1r Lunes"
                        />
                        <p className="text-xs text-muted-foreground">
                          Formato: 1r/2º/3r/4º + Día de la semana
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="assignedDay2">Día Asignado 2 (opcional)</Label>
                        <Input
                          id="assignedDay2"
                          value={companyForm.assignedDay2 || ""}
                          onChange={(e) => setCompanyForm({ ...companyForm, assignedDay2: e.target.value })}
                          placeholder="Ej: 2º Martes"
                        />
                        <p className="text-xs text-muted-foreground">
                          Día adicional para la empresa (opcional)
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="assignedDay3">Día Asignado 3 (opcional)</Label>
                        <Input
                          id="assignedDay3"
                          value={companyForm.assignedDay3 || ""}
                          onChange={(e) => setCompanyForm({ ...companyForm, assignedDay3: e.target.value })}
                          placeholder="Ej: 4º Viernes"
                        />
                        <p className="text-xs text-muted-foreground">
                          Día adicional para la empresa (opcional)
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="accountManager">Responsable cuenta (opcional)</Label>
                        <Input
                          id="accountManager"
                          value={companyForm.accountManager || ""}
                          onChange={(e) => setCompanyForm({ ...companyForm, accountManager: e.target.value })}
                          placeholder="Ej: José Ángel Caballeiro"
                        />
                        <p className="text-xs text-muted-foreground">
                          Nombre del responsable de la cuenta en FQT
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="fullMonthCalendar"
                          checked={companyForm.fullMonthCalendar === 1}
                          onChange={(e) => setCompanyForm({ ...companyForm, fullMonthCalendar: e.target.checked ? 1 : 0 })}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <Label htmlFor="fullMonthCalendar" className="text-sm font-normal cursor-pointer">
                          Calendario mensual completo (todos los días disponibles)
                        </Label>
                      </div>
                      <p className="text-xs text-muted-foreground -mt-2">
                        Si está activado, ignora el "Día Asignado" y permite reservas cualquier día del mes
                      </p>
                      <div className="space-y-2">
                        <Label htmlFor="active">Estado</Label>
                        <select
                          id="active"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={companyForm.active}
                          onChange={(e) => setCompanyForm({ ...companyForm, active: Number(e.target.value) })}
                        >
                          <option value={1}>Activa</option>
                          <option value={0}>Inactiva</option>
                        </select>
                      </div>
                      <Button type="submit" className="w-full" disabled={createCompany.isPending || updateCompany.isPending}>
                        {(createCompany.isPending || updateCompany.isPending) ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {editingCompany ? "Actualizando..." : "Creando..."}
                          </>
                        ) : (
                          editingCompany ? "Actualizar Empresa" : "Crear Empresa"
                        )}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {!companies || companies.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No hay empresas registradas. Crea la primera empresa.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Día Asignado</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha de creación</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {companies.map((company) => (
                      <TableRow key={company.id}>
                        <TableCell className="font-medium">{company.name}</TableCell>
                        <TableCell>
                          <code className="text-xs">/reservar/{company.slug}</code>
                        </TableCell>
                        <TableCell>
                          {company.assignedDay || <span className="text-muted-foreground text-xs">No asignado</span>}
                        </TableCell>
                        <TableCell>
                          {company.active === 1 ? (
                            <Badge variant="default">Activa</Badge>
                          ) : (
                            <Badge variant="secondary">Inactiva</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(company.createdAt).toLocaleDateString("es-ES")}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditCompany(company)}
                          >
                            Editar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Slots Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Gestión de Slots</CardTitle>
                  <CardDescription>Crea slots de disponibilidad para las empresas</CardDescription>
                </div>
                <Dialog open={showSlotsDialog} onOpenChange={setShowSlotsDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Crear Slots
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Crear Slots en Lote</DialogTitle>
                      <DialogDescription>
                        Crea múltiples slots para una empresa y servicio específicos
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateSlots} className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="companyId">Empresa *</Label>
                          <select
                            id="companyId"
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={slotsForm.companyId}
                            onChange={(e) =>
                              setSlotsForm({ ...slotsForm, companyId: Number(e.target.value) })
                            }
                          >
                            <option value={0}>Selecciona una empresa</option>
                            {companies?.map((company) => (
                              <option key={company.id} value={company.id}>
                                {company.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="serviceTypeId">Servicio *</Label>
                          <select
                            id="serviceTypeId"
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={slotsForm.serviceTypeId}
                            onChange={(e) => {
                              const serviceId = Number(e.target.value);
                              setSlotsForm({
                                ...slotsForm,
                                serviceTypeId: serviceId,
                                startHour: serviceId === 1 ? 11 : 10,
                                endHour: serviceId === 1 ? 18 : 17,
                                maxVolunteers: serviceId === 1 ? 1 : 2,
                              });
                            }}
                          >
                            <option value={1}>Mentoring (11:00-18:00, 1 voluntaria)</option>
                            <option value={2}>Estilismo (10:00-17:00, 2 voluntarias)</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="startDate">Fecha de inicio *</Label>
                          <Input
                            id="startDate"
                            type="date"
                            required
                            value={slotsForm.startDate}
                            onChange={(e) => setSlotsForm({ ...slotsForm, startDate: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="endDate">Fecha de fin *</Label>
                          <Input
                            id="endDate"
                            type="date"
                            required
                            value={slotsForm.endDate}
                            onChange={(e) => setSlotsForm({ ...slotsForm, endDate: e.target.value })}
                          />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Se crearán slots para todos los días entre la fecha de inicio y fin (incluyendo ambas)
                      </p>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="startHour">Hora de inicio *</Label>
                          <Input
                            id="startHour"
                            type="number"
                            min={0}
                            max={23}
                            required
                            value={slotsForm.startHour}
                            onChange={(e) =>
                              setSlotsForm({ ...slotsForm, startHour: Number(e.target.value) })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="endHour">Hora de fin *</Label>
                          <Input
                            id="endHour"
                            type="number"
                            min={0}
                            max={23}
                            required
                            value={slotsForm.endHour}
                            onChange={(e) =>
                              setSlotsForm({ ...slotsForm, endHour: Number(e.target.value) })
                            }
                          />
                        </div>
                      </div>
                      <Button type="submit" className="w-full" disabled={bulkCreateSlots.isPending}>
                        {bulkCreateSlots.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creando...
                          </>
                        ) : (
                          "Crear Slots"
                        )}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Los slots se crean automáticamente para cada hora entre la hora de inicio y fin, en
                cada una de las fechas especificadas.
              </p>
            </CardContent>
          </Card>

          {/* Recent Bookings */}
          <Card>
            <CardHeader>
              <CardTitle>Reservas Recientes</CardTitle>
              <CardDescription>Últimas reservas realizadas por los voluntarios</CardDescription>
            </CardHeader>
            <CardContent>
              {!bookings || bookings.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No hay reservas todavía.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Voluntario</TableHead>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Servicio</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Hora</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.slice(0, 10).map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{booking.volunteerName}</div>
                            <div className="text-xs text-muted-foreground">
                              {booking.volunteerEmail}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{booking.companyName}</TableCell>
                        <TableCell>{booking.serviceName}</TableCell>
                        <TableCell>
                          {booking.date
                            ? new Date(booking.date + "T00:00:00").toLocaleDateString("es-ES")
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {booking.startTime} - {booking.endTime}
                        </TableCell>
                        <TableCell>
                          {booking.status === "confirmed" ? (
                            <Badge variant="default">Confirmada</Badge>
                          ) : (
                            <Badge variant="secondary">Cancelada</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* User Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Gestión de Usuarios</CardTitle>
                  <CardDescription>Crea usuarios admin o de empresa</CardDescription>
                </div>
                <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Nuevo Usuario
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                      <DialogDescription>
                        Añade un usuario admin o de empresa al sistema
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateUser} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="userOpenId">Open ID (Manus) *</Label>
                        <Input
                          id="userOpenId"
                          required
                          value={userForm.openId}
                          onChange={(e) => setUserForm({ ...userForm, openId: e.target.value })}
                          placeholder="Ej: g52uMxpHKDUk4mMFoiJHHh"
                        />
                        <p className="text-xs text-muted-foreground">
                          El usuario debe iniciar sesión primero para obtener su Open ID
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="userName">Nombre</Label>
                        <Input
                          id="userName"
                          value={userForm.name}
                          onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                          placeholder="Nombre completo"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="userEmail">Email</Label>
                        <Input
                          id="userEmail"
                          type="email"
                          value={userForm.email}
                          onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                          placeholder="email@ejemplo.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="userRole">Rol *</Label>
                        <select
                          id="userRole"
                          required
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={userForm.role}
                          onChange={(e) => setUserForm({ ...userForm, role: e.target.value as "admin" | "user" | "empresa" })}
                        >
                          <option value="user">Usuario (Voluntario)</option>
                          <option value="admin">Admin (Equipo FQT)</option>
                          <option value="empresa">Empresa</option>
                        </select>
                      </div>
                      {userForm.role === "empresa" && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="userCompanyId">Empresa *</Label>
                            <select
                              id="userCompanyId"
                              required
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                              value={userForm.companyId}
                              onChange={(e) => setUserForm({ ...userForm, companyId: Number(e.target.value) })}
                            >
                              <option value={0}>Selecciona una empresa</option>
                              {companies?.map((company) => (
                                <option key={company.id} value={company.id}>
                                  {company.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="userPassword">Contraseña *</Label>
                            <Input
                              id="userPassword"
                              type="password"
                              required
                              value={userForm.password}
                              onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                              placeholder="Mínimo 6 caracteres"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="userConfirmPassword">Confirmar Contraseña *</Label>
                            <Input
                              id="userConfirmPassword"
                              type="password"
                              required
                              value={userForm.confirmPassword}
                              onChange={(e) => setUserForm({ ...userForm, confirmPassword: e.target.value })}
                              placeholder="Repite la contraseña"
                            />
                          </div>
                        </>
                      )}
                      <Button type="submit" className="w-full" disabled={createUser.isPending}>
                        {createUser.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creando...
                          </>
                        ) : (
                          "Crear Usuario"
                        )}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {!allUsers || allUsers.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No hay usuarios registrados.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allUsers.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell className="font-medium">{u.name || "Sin nombre"}</TableCell>
                        <TableCell>{u.email || "Sin email"}</TableCell>
                        <TableCell>
                          {u.role === "admin" ? (
                            <Badge variant="default">Admin</Badge>
                          ) : u.role === "empresa" ? (
                            <Badge className="bg-purple-500">Empresa</Badge>
                          ) : (
                            <Badge variant="secondary">Usuario</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {u.companyId ? (
                            companies?.find((c) => c.id === u.companyId)?.name || "Empresa no encontrada"
                          ) : (
                            <span className="text-muted-foreground text-xs">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditUser(u.id)}
                            >
                              Editar
                            </Button>
                            {u.role === "empresa" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenPasswordDialog(u.id)}
                              >
                                Cambiar Contraseña
                              </Button>
                            )}
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleOpenDeleteUserDialog(u.id)}
                            >
                              Eliminar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Edit User Dialog */}
          <Dialog open={showEditUserDialog} onOpenChange={setShowEditUserDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Usuario</DialogTitle>
                <DialogDescription>
                  Modifica los datos del usuario empresa
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Nombre</label>
                  <Input
                    value={editUserForm.name}
                    onChange={(e) => setEditUserForm({ ...editUserForm, name: e.target.value })}
                    placeholder="Nombre del usuario"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={editUserForm.email}
                    onChange={(e) => setEditUserForm({ ...editUserForm, email: e.target.value })}
                    placeholder="email@ejemplo.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Empresa Asignada</label>
                  <select
                    className="w-full border rounded-md p-2"
                    value={editUserForm.companyId}
                    onChange={(e) => setEditUserForm({ ...editUserForm, companyId: parseInt(e.target.value) })}
                  >
                    <option value="0">Sin empresa</option>
                    {companies?.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <Button 
                  onClick={handleSaveEditUser} 
                  disabled={updateCompanyUser.isPending}
                  className="w-full"
                >
                  {updateCompanyUser.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    "Guardar Cambios"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Change Password Dialog */}
          <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cambiar Contraseña</DialogTitle>
                <DialogDescription>
                  Establece una nueva contraseña para el usuario empresa
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Nueva Contraseña</label>
                  <Input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Confirmar Contraseña</label>
                  <Input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    placeholder="Repite la contraseña"
                  />
                </div>
                <Button 
                  onClick={handleSavePassword} 
                  disabled={updateCompanyUserPassword.isPending}
                  className="w-full"
                >
                  {updateCompanyUserPassword.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Actualizando...
                    </>
                  ) : (
                    "Cambiar Contraseña"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Delete User Confirmation Dialog */}
          <Dialog open={showDeleteUserDialog} onOpenChange={setShowDeleteUserDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmar Eliminación</DialogTitle>
                <DialogDescription>
                  ¿Estás seguro de que deseas eliminar este usuario?
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Esta acción no se puede deshacer. El usuario será eliminado permanentemente del sistema.
                </p>
                <p className="text-sm font-medium text-destructive">
                  Nota: No se pueden eliminar usuarios con reservas activas.
                </p>
                <div className="flex gap-2 justify-end">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowDeleteUserDialog(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={handleConfirmDeleteUser}
                    disabled={deleteUser.isPending}
                  >
                    {deleteUser.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Eliminando...
                      </>
                    ) : (
                      "Eliminar Usuario"
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
