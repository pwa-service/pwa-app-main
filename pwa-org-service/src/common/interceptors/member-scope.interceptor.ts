import {
    CallHandler,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    NestInterceptor,
    NotFoundException
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { TeamService } from '../../team/team.service';
import { ScopeType } from '../../../../pwa-shared/src';

@Injectable()
export class MemberScopeInterceptor implements NestInterceptor {
    constructor(private readonly teamService: TeamService) {}

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const { user, data } = this.getRequestData(context);

        if (!user) {
            return next.handle();
        }

        if (user.scope === ScopeType.SYSTEM) {
            return next.handle();
        }

        const targetTeamId = data?.teamId;
        const targetCampaignId = data?.campaignId;

        if (user.scope === ScopeType.CAMPAIGN) {
            if (targetCampaignId && targetCampaignId !== user.contextId) {
                throw new ForbiddenException('Access denied');
            }

            if (targetTeamId) {
                const team = await this.teamService.findOne(targetTeamId);
                if (!team) {
                    throw new NotFoundException(`Team not found`);
                }

                if (team.campaignId !== user.contextId) {
                    throw new ForbiddenException('Access denied');
                }
            }
        }

        if (user.scope === ScopeType.TEAM) {
            if (targetCampaignId) {
                throw new ForbiddenException('Access denied');
            }

            if (targetTeamId && targetTeamId !== user.contextId) {
                throw new ForbiddenException('Access denied');
            }
        }

        return next.handle();
    }

    private getRequestData(context: ExecutionContext) {
        if (context.getType() === 'rpc') {
            const data = context.switchToRpc().getData();
            return { user: data.user, data };
        } else if (context.getType() === 'http') {
            const req = context.switchToHttp().getRequest();
            return { user: req.user, data: req.body };
        }
        return { user: null, data: null };
    }
}