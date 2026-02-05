import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {CampaignModule} from "../campaign/campaign.module";
import {SharingModule} from "../sharing/sharing.module";
import {RoleModule} from "../roles/role.module";
import {TeamModule} from "../team/team.module";
import {MemberModule} from "../member/member.module";

@Module({
    imports: [ConfigModule.forRoot(), CampaignModule, SharingModule, RoleModule, TeamModule, MemberModule],
})
export class OrgModule {}
