import { Injectable, ExecutionContext, CallHandler, NestInterceptor } from '@nestjs/common';
import { Observable, throwError, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { PrismaService } from '../../../../pwa-prisma/src';
import { WO_ACCESS_KEY } from '../decorators/access.decorators';
import { UserPayload } from "../../types/auth/dto/user-payload.dto";
import { ScopeType, WorkingObjectType } from "../../../../pwa-shared/src";

@Injectable()
export class WorkingObjectSharingInterceptor implements NestInterceptor {

    constructor(
        private reflector: Reflector,
        private prisma: PrismaService
    ) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        if (context.getType() !== 'rpc') return next.handle();

        const metadata = this.reflector.get(WO_ACCESS_KEY, context.getHandler());
        if (!metadata) return next.handle();

        const { entityType, idField } = metadata;
        const ctx = context.switchToRpc();
        const data = ctx.getData();
        const user: UserPayload = ctx.getContext().user || data.user;

        const targetId = data ? data[idField] : undefined;

        if (!user) {
            return throwError(() => new RpcException({
                code: status.UNAUTHENTICATED,
                message: 'User not authenticated'
            }));
        }

        if (!targetId) {
            return throwError(() => new RpcException({
                code: status.INVALID_ARGUMENT,
                message: `Missing required field: ${idField}`
            }));
        }

        if (user.scope === ScopeType.SYSTEM) {
            return next.handle();
        }

        return from(this.validateAccess(user, entityType, targetId)).pipe(
            switchMap((accessProfile) => {
                if (!accessProfile) {
                    return throwError(() => new RpcException({
                        code: status.PERMISSION_DENIED,
                        message: `Access denied to this ${entityType}`
                    }));
                }
                data.resolvedAccessProfile = accessProfile;
                return next.handle();
            })
        );
    }

    private async validateAccess(user: UserPayload, type: WorkingObjectType, entityId: string): Promise<any | null> {
        const workingObjectLink = await this.findWorkingObject(type, entityId);
        if (!workingObjectLink) return null;

        const woId = workingObjectLink.workingObjectId;
        const personalShare = await this.prisma.shareUserProfile.findFirst({
            where: {
                userProfileId: user.id,
                workingObjectId: woId,
                OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }]
            },
            include: {
                accessProfile: true
            }
        });

        if (personalShare) {
            return personalShare.accessProfile;
        }

        let roleId: number | null = null;

        if (user.scope === ScopeType.CAMPAIGN && user.contextId) {
            const member = await this.prisma.campaignUser.findFirst({
                where: {
                    userProfileId: user.id,
                    campaignId: user.contextId
                }
            });
            roleId = member?.roleId || null;
        }
        else if (user.scope === ScopeType.TEAM && user.contextId) {
            const member = await this.prisma.teamUser.findFirst({
                where: {
                    userProfileId: user.id,
                    teamId: user.contextId
                }
            });
            roleId = member?.roleId || null;
        }

        if (roleId) {
            const shareModel = (this.prisma as any).shareRole || (this.prisma as any).roleShare;
            if (shareModel) {
                const roleShare = await shareModel.findFirst({
                    where: {
                        roleId: roleId,
                        workingObjectId: woId,
                        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }]
                    },
                    include: {
                        accessProfile: true
                    }
                });

                if (roleShare) {
                    return roleShare.accessProfile;
                }
            } else {
                console.error("Model ShareRole/RoleShare not found in PrismaService");
            }
        }

        return null;
    }

    private async findWorkingObject(type: WorkingObjectType, entityId: string) {
        if (type === 'PWA') return this.prisma.workingObjectPwa.findFirst({ where: { pwaAppId: entityId } });
        if (type === 'FLOW') return this.prisma.workingObjectFlow.findFirst({ where: { flowId: entityId } });
        if (type === 'PIXEL_TOKEN') return this.prisma.workingObjectPixelToken.findFirst({ where: { pixelTokenId: entityId } });
        if (type === 'TEAM') return this.prisma.workingObjectTeam.findFirst({ where: { teamId: entityId } });
        if (type === 'CAMPAIGN') return this.prisma.workingObjectCampaign.findFirst({ where: { campaignId: entityId } });
        return null;
    }
}