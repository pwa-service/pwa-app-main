import { Module } from '@nestjs/common';
import { JwtVerifierService } from './jwt-verifier.service';
import { RefreshStore } from './common/refresh.store';

@Module({
    providers: [JwtVerifierService, RefreshStore],
    exports:   [JwtVerifierService, RefreshStore],
})
export class GrpcAuthModule {}