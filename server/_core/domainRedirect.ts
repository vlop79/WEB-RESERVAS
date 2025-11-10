import type { Request, Response, NextFunction } from 'express';

/**
 * Middleware para redirigir automáticamente al dominio personalizado
 * Solo se aplica en producción
 */
export function domainRedirectMiddleware(req: Request, res: Response, next: NextFunction) {
  const host = req.get('host');
  const preferredDomain = 'reservas.quierotrabajo.org';
  
  // Solo redirigir en producción y si el host no es el dominio preferido
  if (
    process.env.NODE_ENV === 'production' && 
    host && 
    !host.includes(preferredDomain) && 
    !host.includes('localhost') &&
    !host.includes('127.0.0.1')
  ) {
    // Forzar HTTPS en producción
    const protocol = req.get('x-forwarded-proto') === 'https' || req.protocol === 'https' ? 'https' : 'https';
    const redirectUrl = `${protocol}://${preferredDomain}${req.originalUrl}`;
    console.log(`[Domain Redirect] ${protocol}://${host}${req.originalUrl} -> ${redirectUrl}`);
    return res.redirect(301, redirectUrl);
  }
  
  next();
}
