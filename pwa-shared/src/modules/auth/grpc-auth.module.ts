import { DynamicModule, Module, Provider } from '@nestjs/common';
import { APP_INTERCEPTOR, Reflector } from '@nestjs/core';
import { GrpcAuthInterceptor } from './interceptors/grpc-auth.interceptor';
import { JwtVerifierService } from './jwt-verifier.service';
import { RefreshStore } from './common/refresh.store';

@Module({})
export class GrpcAuthModule {
    static forRoot(userLookupProvider: Provider): DynamicModule {
        return {
            module: GrpcAuthModule,
            providers: [
                JwtVerifierService,
                RefreshStore,
                Reflector,
                userLookupProvider,
                {
                    provide: APP_INTERCEPTOR,
                    useClass: GrpcAuthInterceptor,
                },
            ],
            exports: [JwtVerifierService],
        };
    }
}