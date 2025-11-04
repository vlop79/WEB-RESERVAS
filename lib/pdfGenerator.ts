import PDFDocument from 'pdfkit';
import type { Company } from '../drizzle/schema';

interface Booking {
  id: number;
  volunteerName: string;
  volunteerEmail: string;
  serviceName: string;
  date: Date;
  time: string;
  hostName: string | null;
  office: string | null;
  status: string;
}

interface CompanyStats {
  totalBookings: number;
  completedBookings: number;
  totalHours: number;
  upcomingBookings: number;
}

export async function generateBookingsPDF(
  company: Company,
  bookings: Booking[],
  dateFilter?: string
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Header with logo and company name
    doc.fontSize(20).fillColor('#ea6852').text('Fundación Quiero Trabajo', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(16).fillColor('#000').text(`Reservas de Voluntarias - ${company.name}`, { align: 'center' });
    doc.moveDown(0.3);
    doc.fontSize(10).fillColor('#666').text(`Generado el ${new Date().toLocaleDateString('es-ES')}`, { align: 'center' });
    doc.moveDown(1.5);

    // Filter applied
    if (dateFilter && dateFilter !== 'all') {
      const filterLabels: Record<string, string> = {
        today: 'Hoy',
        week: 'Última semana',
        month: 'Este mes',
        lastMonth: 'Mes pasado',
        year: 'Este año',
        upcoming: 'Próximas',
        past: 'Pasadas',
      };
      doc.fontSize(10).fillColor('#666').text(`Filtro aplicado: ${filterLabels[dateFilter] || dateFilter}`);
      doc.moveDown(1);
    }

    // Table header
    const tableTop = doc.y;
    const col1X = 50;
    const col2X = 150;
    const col3X = 250;
    const col4X = 350;
    const col5X = 450;

    doc.fontSize(10).fillColor('#ea6852');
    doc.text('Voluntaria', col1X, tableTop, { width: 90 });
    doc.text('Servicio', col2X, tableTop, { width: 90 });
    doc.text('Fecha', col3X, tableTop, { width: 90 });
    doc.text('Hora', col4X, tableTop, { width: 90 });
    doc.text('Estado', col5X, tableTop, { width: 90 });

    // Line under header
    doc.moveTo(col1X, tableTop + 15).lineTo(540, tableTop + 15).stroke();

    // Table rows
    let y = tableTop + 25;
    doc.fontSize(9).fillColor('#000');

    bookings.forEach((booking, index) => {
      if (y > 700) {
        doc.addPage();
        y = 50;
      }

      const statusLabels: Record<string, string> = {
        pending: 'Pendiente',
        confirmed: 'Confirmada',
        completed: 'Completada',
        cancelled: 'Cancelada',
      };

      doc.text(booking.volunteerName, col1X, y, { width: 90 });
      doc.text(booking.serviceName, col2X, y, { width: 90 });
      doc.text(new Date(booking.date).toLocaleDateString('es-ES'), col3X, y, { width: 90 });
      doc.text(booking.time, col4X, y, { width: 90 });
      doc.text(statusLabels[booking.status] || booking.status, col5X, y, { width: 90 });

      y += 20;

      // Light line between rows
      if (index < bookings.length - 1) {
        doc.moveTo(col1X, y - 5).lineTo(540, y - 5).strokeColor('#eee').stroke().strokeColor('#000');
      }
    });

    // Footer
    doc.moveDown(2);
    doc.fontSize(10).fillColor('#666').text(`Total de reservas: ${bookings.length}`, { align: 'center' });

    doc.end();
  });
}

export async function generateDashboardPDF(
  company: Company,
  stats: CompanyStats,
  bookings: Booking[]
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Header
    doc.fontSize(20).fillColor('#ea6852').text('Fundación Quiero Trabajo', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(16).fillColor('#000').text(`Dashboard de Impacto - ${company.name}`, { align: 'center' });
    doc.moveDown(0.3);
    doc.fontSize(10).fillColor('#666').text(`Generado el ${new Date().toLocaleDateString('es-ES')}`, { align: 'center' });
    doc.moveDown(2);

    // Stats section
    doc.fontSize(14).fillColor('#ea6852').text('Métricas de Impacto', { underline: true });
    doc.moveDown(1);

    const statsY = doc.y;
    const statsCol1 = 50;
    const statsCol2 = 300;

    doc.fontSize(11).fillColor('#000');
    doc.text('Impacto del Voluntariado', statsCol1, statsY);
    doc.fontSize(20).fillColor('#ea6852').text(stats.totalBookings.toString(), statsCol1, statsY + 20);
    doc.fontSize(9).fillColor('#666').text('Total de mujeres participantes', statsCol1, statsY + 45);

    doc.fontSize(11).fillColor('#000').text('Sesiones Completadas', statsCol2, statsY);
    doc.fontSize(20).fillColor('#22c55e').text(stats.completedBookings.toString(), statsCol2, statsY + 20);
    doc.fontSize(9).fillColor('#666').text('Mentoring y estilismo realizados', statsCol2, statsY + 45);

    doc.moveDown(5);

    const stats2Y = doc.y;
    doc.fontSize(11).fillColor('#000').text('Horas de Voluntariado', statsCol1, stats2Y);
    doc.fontSize(20).fillColor('#3b82f6').text(`${stats.totalHours}h`, statsCol1, stats2Y + 20);
    doc.fontSize(9).fillColor('#666').text('Tiempo dedicado a ayudar', statsCol1, stats2Y + 45);

    doc.fontSize(11).fillColor('#000').text('Próximas Sesiones', statsCol2, stats2Y);
    doc.fontSize(20).fillColor('#8b5cf6').text(stats.upcomingBookings.toString(), statsCol2, stats2Y + 20);
    doc.fontSize(9).fillColor('#666').text('Reservas confirmadas pendientes', statsCol2, stats2Y + 45);

    doc.moveDown(5);

    // Bookings table
    doc.fontSize(14).fillColor('#ea6852').text('Reservas Recientes', { underline: true });
    doc.moveDown(1);

    const tableTop = doc.y;
    const col1X = 50;
    const col2X = 150;
    const col3X = 280;
    const col4X = 380;
    const col5X = 480;

    doc.fontSize(10).fillColor('#ea6852');
    doc.text('Voluntaria', col1X, tableTop, { width: 90 });
    doc.text('Servicio', col2X, tableTop, { width: 120 });
    doc.text('Fecha', col3X, tableTop, { width: 90 });
    doc.text('Hora', col4X, tableTop, { width: 90 });
    doc.text('Estado', col5X, tableTop, { width: 60 });

    doc.moveTo(col1X, tableTop + 15).lineTo(540, tableTop + 15).stroke();

    let y = tableTop + 25;
    doc.fontSize(9).fillColor('#000');

    // Show only first 10 bookings
    const recentBookings = bookings.slice(0, 10);

    recentBookings.forEach((booking, index) => {
      if (y > 700) {
        doc.addPage();
        y = 50;
      }

      const statusLabels: Record<string, string> = {
        pending: 'Pendiente',
        confirmed: 'Confirmada',
        completed: 'Completada',
        cancelled: 'Cancelada',
      };

      doc.text(booking.volunteerName, col1X, y, { width: 90 });
      doc.text(booking.serviceName, col2X, y, { width: 120 });
      doc.text(new Date(booking.date).toLocaleDateString('es-ES'), col3X, y, { width: 90 });
      doc.text(booking.time, col4X, y, { width: 90 });
      doc.text(statusLabels[booking.status] || booking.status, col5X, y, { width: 60 });

      y += 20;

      if (index < recentBookings.length - 1) {
        doc.moveTo(col1X, y - 5).lineTo(540, y - 5).strokeColor('#eee').stroke().strokeColor('#000');
      }
    });

    // Footer
    doc.moveDown(2);
    doc.fontSize(9).fillColor('#666').text(
      `Gracias por apoyar a las mujeres en su camino hacia el empleo`,
      { align: 'center' }
    );

    doc.end();
  });
}
