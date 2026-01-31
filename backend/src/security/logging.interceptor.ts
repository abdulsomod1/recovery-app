import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user, ip } = request;
    const userAgent = request.get('User-Agent') || '';

    const now = Date.now();

    return next.handle().pipe(
      tap(async () => {
        const response = context.switchToHttp().getResponse();
        const delay = Date.now() - now;

        // Log to database
        await this.prisma.auditLog.create({
          data: {
            userId: user?.id,
            action: `${method} ${url}`,
            details: {
              method,
              url,
              statusCode: response.statusCode,
              responseTime: delay,
              userAgent,
            },
            ipAddress: ip,
            userAgent,
          },
        });

        console.log(`${method} ${url} ${response.statusCode} - ${delay}ms`);
      }),
    );
  }
}
