import { Controller, Get } from '@nestjs/common';
import { AuthCoreService } from './auth.core.service';
import {AllowAnonymous} from "../../../pwa-shared/src/modules/auth/decorators/allow-anon.decorator";

@Controller('.well-known')
export class JwksController {
    constructor(private readonly auth: AuthCoreService) {}

    @AllowAnonymous()
    @Get('jwks.json')
    getJwks() {
        return this.auth.getJwks();
    }

    @AllowAnonymous()
    @Get('healthz')
    health() {
        return { ok: true };
    }
}
