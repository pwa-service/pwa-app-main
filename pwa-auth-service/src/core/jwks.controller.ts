import { Controller, Get } from '@nestjs/common';
import { AuthCoreService } from './auth.core.service';

@Controller('.well-known')
export class JwksController {
    constructor(private readonly auth: AuthCoreService) {}

    @Get('jwks.json')
    getJwks() {
        return this.auth.getJwks();
    }

    @Get('healthz')
    health() {
        return { ok: true };
    }
}
