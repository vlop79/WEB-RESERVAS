import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Download, FileText, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function ResourceDownloadsPanel() {
  const { data: stats, isLoading: statsLoading } = trpc.volunteer.getDownloadStats.useQuery();
  const { data: history, isLoading: historyLoading } = trpc.volunteer.getDownloadHistory.useQuery({ limit: 20 });

  if (statsLoading || historyLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Estadísticas de Descargas de Recursos
            </CardTitle>
            <CardDescription>Cargando estadísticas...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const totalDownloads = stats?.reduce((sum, stat) => sum + Number(stat.downloadCount), 0) || 0;

  return (
    <div className="space-y-6">
      {/* Resumen */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Descargas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#ea6852]">{totalDownloads}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Recursos Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#ea6852]">{stats?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Recurso Más Popular</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-semibold truncate">{stats?.[0]?.resourceName || "N/A"}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {stats?.[0]?.downloadCount || 0} descargas
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estadísticas por Recurso */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Popularidad de Recursos
          </CardTitle>
          <CardDescription>Recursos ordenados por número de descargas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats && stats.length > 0 ? (
              stats.map((stat, index) => (
                <div key={stat.resourceId} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#ea6852]/10 text-[#ea6852] font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{stat.resourceName}</div>
                      <div className="text-xs text-muted-foreground">ID: {stat.resourceId}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold text-[#ea6852]">{stat.downloadCount}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No hay descargas registradas aún
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Historial Reciente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Descargas Recientes
          </CardTitle>
          <CardDescription>Últimas 20 descargas realizadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {history && history.length > 0 ? (
              history.map((download) => (
                <div key={download.id} className="flex items-center justify-between p-2 border-b last:border-0">
                  <div>
                    <div className="font-medium text-sm">{download.resourceName}</div>
                    <div className="text-xs text-muted-foreground">
                      {download.volunteerEmail || "Anónimo"}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(download.downloadedAt), "dd MMM yyyy HH:mm", { locale: es })}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No hay descargas recientes
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
