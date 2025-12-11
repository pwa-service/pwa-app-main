import { ConfigService } from '@nestjs/config';

export const getMailConfig = (configService: ConfigService) => ({
    transport: {
        host: configService.get<string>('MAIL_HOST') || 'smtp.gmail.com',
        port: configService.get<number>('MAIL_PORT') || 587,
        secure: configService.get<string>('MAIL_SECURE') === 'true',
        auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASSWORD'),
        },
    },
    defaults: {
        from: `"PWA Auth Service" <${configService.get<string>('MAIL_FROM') || 'no-reply@pwa.local'}>`,
    },
});