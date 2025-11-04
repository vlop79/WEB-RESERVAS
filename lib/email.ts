import { ENV } from "../server/_core/env";

interface BookingEmailParams {
  volunteerName: string;
  volunteerEmail: string;
  companyName: string;
  serviceName: string;
  serviceModality: string;
  date: string;
  startTime: string;
  endTime: string;
  oficina?: string;
  googleMeetLink?: string;
  hostEmail?: string;
}

/**
 * Sends a booking confirmation email to the volunteer
 * Uses a simple approach with fetch to send emails
 * In production, you would use a proper email service like SendGrid, Resend, etc.
 */
export async function sendBookingConfirmationEmail(
  params: BookingEmailParams
): Promise<{ success: boolean; error?: string }> {
  try {
    // Format date in Spanish
    const formattedDate = new Date(params.date + "T00:00:00").toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Build email content
    const subject = `Confirmación de tu sesión de ${params.serviceName} con ${params.companyName}`;
    
    let locationInfo = "";
    if (params.serviceModality === "presencial" && params.oficina) {
      const oficinas = {
        Barcelona: "Oficina Barcelona - Dirección: [Añadir dirección]",
        Madrid: "Oficina Madrid - Dirección: [Añadir dirección]",
        Málaga: "Oficina Málaga - Dirección: [Añadir dirección]",
      };
      locationInfo = `
📍 **Ubicación:** ${params.oficina}
${oficinas[params.oficina as keyof typeof oficinas] || params.oficina}
`;
    } else if (params.serviceModality === "virtual" && params.googleMeetLink) {
      locationInfo = `
💻 **Sesión Virtual**
Enlace de Google Meet: ${params.googleMeetLink}

*Por favor, únete a la reunión a la hora indicada.*
`;
    }

    const emailBody = `
Hola ${params.volunteerName},

¡Tu sesión de voluntariado ha sido confirmada! 🎉

**Detalles de tu sesión:**

🏢 **Empresa:** ${params.companyName}
📋 **Servicio:** ${params.serviceName}
📅 **Fecha:** ${formattedDate}
🕐 **Horario:** ${params.startTime} - ${params.endTime}
${locationInfo}

${params.hostEmail ? `👤 **Tu anfitrión:** ${params.hostEmail}\n` : ""}

**Importante:**
- Por favor, llega puntual a tu sesión
${params.serviceModality === "presencial" ? "- Trae una actitud positiva y ganas de ayudar" : "- Asegúrate de tener una buena conexión a internet"}
- Si necesitas cancelar, por favor avísanos con antelación

Si tienes alguna pregunta o necesitas hacer cambios, no dudes en contactarnos.

¡Gracias por tu compromiso con Fundación Quiero Trabajo!

---
Fundación Quiero Trabajo
www.quierotrabajo.org
`;

    // For now, we'll log the email (in production, use a real email service)
    console.log("[Email] Sending booking confirmation:");
    console.log("To:", params.volunteerEmail);
    console.log("Subject:", subject);
    console.log("Body:", emailBody);

    // TODO: Integrate with a real email service
    // Example with Resend:
    // const response = await fetch('https://api.resend.com/emails', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     from: 'FQT Reservas <reservas@quierotrabajo.org>',
    //     to: params.volunteerEmail,
    //     subject: subject,
    //     text: emailBody,
    //   }),
    // });

    // For now, return success (emails are logged)
    return { success: true };
  } catch (error) {
    console.error("[Email] Error sending booking confirmation:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Sends a reminder email 24 hours before the booking
 */
export async function sendBookingReminderEmail(
  params: BookingEmailParams
): Promise<{ success: boolean; error?: string }> {
  try {
    const formattedDate = new Date(params.date + "T00:00:00").toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const subject = `Recordatorio: Tu sesión de ${params.serviceName} es mañana`;
    
    let locationInfo = "";
    if (params.serviceModality === "presencial" && params.oficina) {
      locationInfo = `📍 **Ubicación:** ${params.oficina}`;
    } else if (params.serviceModality === "virtual" && params.googleMeetLink) {
      locationInfo = `💻 **Enlace de Google Meet:** ${params.googleMeetLink}`;
    }

    const emailBody = `
Hola ${params.volunteerName},

Este es un recordatorio de que tu sesión de voluntariado es mañana:

🏢 **Empresa:** ${params.companyName}
📅 **Fecha:** ${formattedDate}
🕐 **Horario:** ${params.startTime} - ${params.endTime}
${locationInfo}

¡Nos vemos mañana!

---
Fundación Quiero Trabajo
`;

    console.log("[Email] Sending booking reminder:");
    console.log("To:", params.volunteerEmail);
    console.log("Subject:", subject);
    console.log("Body:", emailBody);

    return { success: true };
  } catch (error) {
    console.error("[Email] Error sending booking reminder:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Envía email de notificación al anfitrión cuando se le asigna un voluntario
 */
export async function sendHostAssignmentEmail(params: {
  hostEmail: string;
  volunteerName: string;
  volunteerEmail: string;
  volunteerPhone?: string;
  companyName: string;
  serviceName: string;
  serviceModality: string;
  date: string;
  startTime: string;
  endTime: string;
  oficina?: string;
  googleMeetLink?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const formattedDate = new Date(params.date + "T00:00:00").toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const isVirtual = params.serviceModality === "virtual";
    let locationInfo = "";
    if (isVirtual && params.googleMeetLink) {
      locationInfo = `
💻 **Sesión Virtual**
Enlace de Google Meet: ${params.googleMeetLink}
`;
    } else if (params.oficina) {
      locationInfo = `
📍 **Ubicación:** ${params.oficina} (Presencial)
`;
    }

    const subject = `Nueva asignación: ${params.volunteerName} - ${params.companyName}`;
    const emailBody = `
Hola,

Se te ha asignado un nuevo voluntario para una sesión de ${params.serviceName}.

**Detalles del Voluntario:**

👤 **Nombre:** ${params.volunteerName}
📧 **Email:** ${params.volunteerEmail}
${params.volunteerPhone ? `📱 **Teléfono:** ${params.volunteerPhone}\n` : ""}

**Detalles de la Sesión:**

🏢 **Empresa:** ${params.companyName}
📋 **Servicio:** ${params.serviceName}
📅 **Fecha:** ${formattedDate}
🕐 **Horario:** ${params.startTime} - ${params.endTime}
${locationInfo}

ℹ️ **Recordatorio:** Esta sesión ha sido añadida automáticamente a tu calendario de Google.

Si tienes alguna pregunta o necesitas hacer cambios, por favor contacta con el equipo de coordinación.

¡Gracias por tu colaboración!

---
Fundación Quiero Trabajo
www.quierotrabajo.org
`;

    console.log("[Email] Sending host assignment notification:");
    console.log("To:", params.hostEmail);
    console.log("Subject:", subject);
    console.log("Body:", emailBody);

    // TODO: Integrate with real email service in production
    return { success: true };
  } catch (error) {
    console.error("[Email] Error sending host assignment email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Envía email de cancelación al voluntario
 */
export async function sendCancellationEmailToVolunteer(params: {
  volunteerName: string;
  volunteerEmail: string;
  companyName: string;
  serviceName: string;
  date: string;
  startTime: string;
  reason?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const formattedDate = new Date(params.date + "T00:00:00").toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const subject = `Cancelación: Tu sesión de ${params.serviceName} con ${params.companyName}`;
    const emailBody = `
Hola ${params.volunteerName},

Lamentamos informarte que tu sesión de voluntariado ha sido cancelada.

**Detalles de la sesión cancelada:**

🏢 **Empresa:** ${params.companyName}
📋 **Servicio:** ${params.serviceName}
📅 **Fecha:** ${formattedDate}
🕐 **Hora:** ${params.startTime}
${params.reason ? `\nℹ️ **Motivo:** ${params.reason}\n` : ""}
Si tienes alguna pregunta o deseas reservar otra sesión, por favor contáctanos.

¡Gracias por tu comprensión!

---
Fundación Quiero Trabajo
www.quierotrabajo.org
`;

    console.log("[Email] Sending cancellation email to volunteer:");
    console.log("To:", params.volunteerEmail);
    console.log("Subject:", subject);
    console.log("Body:", emailBody);

    return { success: true };
  } catch (error) {
    console.error("[Email] Error sending cancellation email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Envía email de cancelación al anfitrión
 */
export async function sendCancellationEmailToHost(params: {
  hostEmail: string;
  volunteerName: string;
  companyName: string;
  serviceName: string;
  date: string;
  startTime: string;
  reason?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const formattedDate = new Date(params.date + "T00:00:00").toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const subject = `Cancelación: ${params.volunteerName} - ${params.companyName}`;
    const emailBody = `
Hola,

Te informamos que la sesión con el voluntario ha sido cancelada.

**Detalles de la sesión cancelada:**

👤 **Voluntario:** ${params.volunteerName}
🏢 **Empresa:** ${params.companyName}
📋 **Servicio:** ${params.serviceName}
📅 **Fecha:** ${formattedDate}
🕐 **Hora:** ${params.startTime}
${params.reason ? `\nℹ️ **Motivo:** ${params.reason}\n` : ""}
El evento ha sido eliminado de tu calendario de Google.

---
Fundación Quiero Trabajo
www.quierotrabajo.org
`;

    console.log("[Email] Sending cancellation email to host:");
    console.log("To:", params.hostEmail);
    console.log("Subject:", subject);
    console.log("Body:", emailBody);

    return { success: true };
  } catch (error) {
    console.error("[Email] Error sending cancellation email to host:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Envía email de recuperación de contraseña con enlace de reset
 */
export async function sendPasswordResetEmail(
  email: string,
  token: string,
  userName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Build reset URL (will work in both dev and production)
    const baseUrl = process.env.NODE_ENV === "production"
      ? "https://reservas.quierotrabajo.org"
      : "http://localhost:3000";
    const resetUrl = `${baseUrl}/reset-password?token=${token}`;

    const subject = "Recupera tu contraseña - Fundación Quiero Trabajo";
    const emailBody = `
Hola ${userName},

Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en el sistema de reservas de Fundación Quiero Trabajo.

**Tu impacto es importante para nosotros** 🌟

Como empresa colaboradora, tu participación en el programa de voluntariado corporativo ayuda a transformar vidas. Cada sesión de mentoring o estilismo que facilitas contribuye a que más mujeres en situación de vulnerabilidad encuentren oportunidades laborales.

**Para restablecer tu contraseña:**

Haz clic en el siguiente enlace (válido por 1 hora):
${resetUrl}

Si no solicitaste este cambio, puedes ignorar este correo. Tu contraseña actual permanecerá sin cambios.

**Datos de tu sesión:**
- Este enlace expira en: 1 hora
- Si el enlace no funciona, cópialo y pégalo en tu navegador

¿Necesitas ayuda? Contáctanos en contacto@quierotrabajo.org

---
Fundación Quiero Trabajo
Transformando vidas a través del empleo
www.quierotrabajo.org
`;

    console.log("[Email] Sending password reset email:");
    console.log("To:", email);
    console.log("Subject:", subject);
    console.log("Reset URL:", resetUrl);
    console.log("Body:", emailBody);

    // TODO: Integrate with a real email service in production
    // For now, we log the email content

    return { success: true };
  } catch (error) {
    console.error("[Email] Error sending password reset email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
