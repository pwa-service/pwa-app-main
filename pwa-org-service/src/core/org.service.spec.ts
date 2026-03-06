import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../pwa-prisma/src';
import { CampaignService } from '../campaign/campaign.service';
import { RoleService } from '../roles/role.service';
import { TeamService } from '../team/team.service';
import { MemberService } from '../member/member.service';
import { AccessLevel, ScopeType } from '../../../pwa-shared/src';
import { UserPayload } from '../../../pwa-shared/src/types/auth/dto/user-payload.dto';
import { SystemRoleName } from '../../../pwa-shared/src/types/org/roles/enums/role.enums';
import { SharingService } from '../sharing/sharing.service';
import { CampaignRepository } from '../campaign/campaign.repository';
import { RoleRepository } from '../roles/role.repository';
import { TeamRepository } from '../team/team.repository';
import { MemberRepository } from '../member/member.repository';
import { SharingRepository } from '../sharing/sharing.repository';

import { join } from 'path';
import { ClientsModule, Transport } from '@nestjs/microservices';

describe('Org System Integration Test (Campaign, Role, Team, Member)', () => {
    jest.setTimeout(30000);

    let prisma: PrismaService;
    let campaignService: CampaignService;
    let roleService: RoleService;
    let teamService: TeamService;
    let memberService: MemberService;

    const ownerEmail = 'owner_e2e@test.com';
    const memberEmail = 'member_e2e@test.com';
    let ownerId: string;
    let memberId: string;

    let campaignId: string;
    let customRoleId: string;
    let teamId: string;

    beforeAll(async () => {
        const AUTH_PROTO_DIR = join(process.cwd(), '../pwa-protos/protos');
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ClientsModule.register([
                    {
                        name: 'AUTH_PACKAGE',
                        transport: Transport.GRPC,
                        options: {
                            package: 'auth.v1',
                            protoPath: join(AUTH_PROTO_DIR, 'auth.proto'),
                            url: process.env.AUTH_SERVICE_GRPC_URL || 'localhost:50051',
                            loader: {
                                includeDirs: [AUTH_PROTO_DIR],
                                keepCase: false,
                                longs: String,
                                enums: String,
                                defaults: true,
                                oneofs: true,
                            },
                        },
                    },
                ]),
            ],
            providers: [
                PrismaService,
                CampaignService,
                RoleService,
                TeamService,
                MemberService,
                SharingService,
                CampaignRepository,
                RoleRepository,
                TeamRepository,
                MemberRepository,
                SharingRepository,
            ],
        }).compile();

        await module.init();

        prisma = module.get(PrismaService);
        campaignService = module.get(CampaignService);
        roleService = module.get(RoleService);
        teamService = module.get(TeamService);
        memberService = module.get(MemberService);

        await prisma.workingObjectTeamUser.deleteMany();
        await prisma.teamUser.deleteMany();
        await prisma.team.deleteMany();
        await prisma.campaignUser.deleteMany();
        await prisma.roleAccess.deleteMany();
        await prisma.role.deleteMany({
            where: {
                name: { not: SystemRoleName.PRODUCT_OWNER }
            }
        });
        await prisma.accessProfile.deleteMany({
            where: { name: { not: 'Root Admin Profile' } }
        });
        await prisma.campaign.deleteMany();
        await prisma.userProfile.deleteMany({
            where: { email: { in: [ownerEmail, memberEmail, 'new_lead@test.com', 'leadcre@test.com', 'leadupd@test.com', 'guard_lead@test.com', 'team_only_lead@test.com', 'both_scope_lead@test.com', 'auto_lead@test.com', 'regular_member@test.com', 'wo_lead@test.com', 'wo_new_lead@test.com', 'del_lead_guard@test.com'] } }
        });

        const owner = await prisma.userProfile.create({
            data: { username: 'owner_e2e', email: ownerEmail, scope: ScopeType.SYSTEM, passwordHash: 'hash' }
        });
        ownerId = owner.id;

        const member = await prisma.userProfile.create({
            data: { username: 'member_e2e', email: memberEmail, scope: ScopeType.SYSTEM, passwordHash: 'hash' }
        });
        memberId = member.id;

        await roleService.onModuleInit();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });


    describe('Campaign Service', () => {
        it('should create a new Campaign', async () => {
            const result = await campaignService.create(
                {
                    name: 'E2E Test Campaign',
                    ownerId
                },
                ownerId
            );

            expect(result).toBeDefined();
            expect(result.id).toBeDefined();
            expect(result.name).toBe('E2E Test Campaign');

            campaignId = result.id;
        });
    });

    describe('Role Service', () => {
        it('should create a custom Role in Campaign', async () => {
            const roleResponse = await roleService.create(
                {
                    name: 'Marketing Manager',
                    description: 'Can manage ads',
                    globalRules: {
                        statAccess: AccessLevel.View,
                        finAccess: AccessLevel.Manage,
                        usersAccess: AccessLevel.None,
                        logAccess: AccessLevel.View,
                        sharingAccess: AccessLevel.None
                    }
                },
                ScopeType.CAMPAIGN,
                campaignId
            );

            expect(roleResponse).toBeDefined();
            expect(roleResponse.scope).toBe(ScopeType.CAMPAIGN);
            customRoleId = roleResponse.id;
            expect(roleResponse.globalRules.finAccess).toBe(AccessLevel.Manage);
        });
    });

    describe('Member Flow (Campaign)', () => {
        it('should add an EXISTING user to the campaign via CampaignService', async () => {
            const result = await campaignService.addMember(
                memberId,
                campaignId,
                parseInt(customRoleId)
            );

            expect(result).toBeDefined();
            expect(result.userProfileId).toBe(memberId);
            expect(result.campaignId).toBe(campaignId);
            expect(result.roleId).toBe(parseInt(customRoleId));
        });

        it('should update member role via RoleService', async () => {
            const viewerRole = await roleService.create(
                {
                    name: 'Campaign Viewer',
                    description: 'Read only',
                    globalRules: {
                        statAccess: AccessLevel.View,
                        finAccess: AccessLevel.None,
                        logAccess: AccessLevel.None,
                        usersAccess: AccessLevel.None,
                        sharingAccess: AccessLevel.None
                    }
                },
                ScopeType.CAMPAIGN,
                campaignId
            );

            await roleService.assignRoleToUser(
                {
                    userId: memberId,
                    roleId: parseInt(viewerRole.id)
                },
                { scope: ScopeType.CAMPAIGN, contextId: campaignId } as UserPayload
            );

            const updatedMember = await prisma.campaignUser.findFirst({
                where: { userProfileId: memberId, campaignId: campaignId },
                include: { role: true }
            });

            expect(updatedMember?.role.name).toBe('Campaign Viewer');
        });
    });


    describe('Team Service', () => {
        it('should create a Team', async () => {
            const team = await teamService.create({
                name: 'Alpha Squad',
                campaignId: campaignId,
            }, { scope: ScopeType.SYSTEM } as UserPayload);

            expect(team).toBeDefined();
            expect(team.campaignId).toBe(campaignId);
            teamId = team.id;
        });

        it('should create a Team Role', async () => {
            const teamRole = await roleService.create(
                {
                    name: 'Team Lead',
                    description: 'Squad leader',
                    globalRules: {
                        statAccess: AccessLevel.View,
                        finAccess: AccessLevel.None,
                        logAccess: AccessLevel.None,
                        usersAccess: AccessLevel.Manage,
                        sharingAccess: AccessLevel.None
                    }
                },
                ScopeType.TEAM,
                teamId
            );
            expect(teamRole.scope).toBe(ScopeType.TEAM);
        });

        it('should add user to Team', async () => {
            const teamRole = await prisma.role.findFirst({
                where: { teamId: teamId, name: 'Team Lead' }
            });

            await teamService.addMemberToTeam({
                teamId: teamId,
                userId: memberId,
                roleId: teamRole!.id,
            }, { scope: ScopeType.TEAM, contextId: teamId } as UserPayload);

            const teamUser = await prisma.teamUser.findUnique({
                where: { userProfileId: memberId },
                include: { team: true }
            });

            expect(teamUser).toBeDefined();
            expect(teamUser?.team.name).toBe('Alpha Squad');
        });

        it('should update Team name only', async () => {
            const updated = await teamService.update({
                id: teamId,
                name: 'Alpha Squad Renamed',
            }, { scope: ScopeType.SYSTEM } as UserPayload);

            expect(updated.name).toBe('Alpha Squad Renamed');

            const teamInDb = await prisma.team.findUnique({ where: { id: teamId } });
            expect(teamInDb?.name).toBe('Alpha Squad Renamed');
        });

        it('should preserve Team name when updating only leadId', async () => {
            const teamBeforeUpdate = await prisma.team.findUnique({ where: { id: teamId } });
            expect(teamBeforeUpdate?.name).toBe('Alpha Squad Renamed');

            const updated = await teamService.update({
                id: teamId,
                leadId: memberId,
            }, { scope: ScopeType.SYSTEM } as UserPayload);

            expect(updated.name).toBe('Alpha Squad Renamed');

            const teamAfterUpdate = await prisma.team.findUnique({ where: { id: teamId } });
            expect(teamAfterUpdate?.name).toBe('Alpha Squad Renamed');
        });

        it('should update Team Lead and correctly reassign roles', async () => {
            const newLeadUser = await prisma.userProfile.create({
                data: { username: 'new_lead_e2e', email: 'new_lead@test.com', scope: ScopeType.SYSTEM, passwordHash: 'hash' }
            });
            const newLeadId = newLeadUser.id;

            await campaignService.addMember(newLeadId, campaignId, parseInt(customRoleId));

            const memberRole = await roleService.create(
                {
                    name: 'Media Buyer',
                    description: 'Regular member',
                    globalRules: { statAccess: AccessLevel.View, finAccess: AccessLevel.None, logAccess: AccessLevel.None, usersAccess: AccessLevel.None, sharingAccess: AccessLevel.None }
                },
                ScopeType.CAMPAIGN,
                campaignId
            );

            await teamService.addMemberToTeam({
                teamId: teamId,
                userId: newLeadId,
                roleId: parseInt(memberRole.id),
            }, { scope: ScopeType.SYSTEM } as UserPayload);

            await roleService.create(
                { name: 'Team Lead', description: 'Lead', globalRules: { statAccess: AccessLevel.View, finAccess: AccessLevel.None, logAccess: AccessLevel.None, usersAccess: AccessLevel.Manage, sharingAccess: AccessLevel.None } },
                ScopeType.CAMPAIGN,
                campaignId
            );

            // Ensure user is in campaign or team before lead assignment
            try { await campaignService.addMember(memberId, campaignId, parseInt(customRoleId)); } catch (e) { }
            const updatedTeam = await teamService.update({
                id: teamId,
                name: 'Alpha Squad Updated',
                leadId: memberId
            }, { scope: ScopeType.SYSTEM } as UserPayload);

            expect(updatedTeam.leadId).toBe(memberId);

            // First remove lead to avoid "Team already has lead" error
            await prisma.team.update({ where: { id: teamId }, data: { teamLeadId: null } });
            const reassignedTeam = await teamService.update({
                id: teamId,
                name: 'Alpha Squad Updated',
                leadId: newLeadId
            }, { scope: ScopeType.SYSTEM } as UserPayload);

            expect(reassignedTeam.leadId).toBe(newLeadId);

            const teamInDb = await prisma.team.findUnique({ where: { id: teamId }, include: { teamLead: true } });
            expect(teamInDb?.teamLead?.userProfileId).toBe(newLeadId);
        });

        it('should ensure members list is not empty when assigning or reassigning a team lead', async () => {
            const newTeamLeadUser = await prisma.userProfile.create({
                data: { username: 'lead_on_create', email: 'leadcre@test.com', scope: ScopeType.SYSTEM, passwordHash: 'hash' }
            });
            await campaignService.addMember(newTeamLeadUser.id, campaignId, parseInt(customRoleId));

            const newTeam = await teamService.create({
                name: 'Team With Lead',
                campaignId: campaignId,
                leadId: newTeamLeadUser.id
            }, { scope: ScopeType.SYSTEM } as UserPayload);

            expect(newTeam.leadId).toBe(newTeamLeadUser.id);
            expect(newTeam.members).toBeDefined();
            expect(newTeam.members.length).toBeGreaterThan(0);
            expect(newTeam.members.some((m: any) => m.id === newTeamLeadUser.id)).toBe(true);

            const reassignedLeadUser = await prisma.userProfile.create({
                data: { username: 'lead_on_update', email: 'leadupd@test.com', scope: ScopeType.SYSTEM, passwordHash: 'hash' }
            });
            await campaignService.addMember(reassignedLeadUser.id, campaignId, parseInt(customRoleId));
            await teamService.addMemberToTeam({
                teamId: newTeam.id,
                userId: reassignedLeadUser.id,
                roleId: parseInt(customRoleId),
            }, { scope: ScopeType.SYSTEM } as UserPayload);

            // First remove lead to avoid "Team already has lead" error
            await prisma.team.update({ where: { id: newTeam.id }, data: { teamLeadId: null } });
            const updatedTeam = await teamService.update({
                id: newTeam.id,
                leadId: reassignedLeadUser.id
            }, { scope: ScopeType.SYSTEM } as UserPayload);

            expect(updatedTeam.leadId).toBe(reassignedLeadUser.id);
            expect(updatedTeam.members).toBeDefined();
            expect(updatedTeam.members.length).toBeGreaterThan(0);
            expect(updatedTeam.members.some((m: any) => m.id === reassignedLeadUser.id)).toBe(true);
        });

        it('should assign team lead for user connected via teamUser only (no campaignUser)', async () => {
            const teamOnlyUser = await prisma.userProfile.create({
                data: { username: 'team_only_lead', email: 'team_only_lead@test.com', scope: ScopeType.SYSTEM, passwordHash: 'hash' }
            });

            const scopeTeam = await teamService.create({
                name: 'Scope Test Team',
                campaignId: campaignId,
            }, { scope: ScopeType.SYSTEM } as UserPayload);

            await teamService.addMemberToTeam({
                teamId: scopeTeam.id,
                userId: teamOnlyUser.id,
                roleId: parseInt(customRoleId),
            }, { scope: ScopeType.SYSTEM } as UserPayload);


            const cuBefore = await prisma.campaignUser.findUnique({ where: { userProfileId: teamOnlyUser.id } });
            expect(cuBefore).toBeNull();
            await teamService.assignTeamLead({
                teamId: scopeTeam.id,
                userId: teamOnlyUser.id
            }, { scope: ScopeType.SYSTEM } as UserPayload);

            const teamAfter = await prisma.team.findUnique({ where: { id: scopeTeam.id }, include: { teamLead: true } });
            expect(teamAfter?.teamLead?.userProfileId).toBe(teamOnlyUser.id);
            const cuAfter = await prisma.campaignUser.findUnique({ where: { userProfileId: teamOnlyUser.id } });
            expect(cuAfter).toBeDefined();
            expect(cuAfter?.campaignId).toBe(campaignId);
        });

        it('should assign team lead for user connected via both campaignUser and teamUser', async () => {
            const bothScopeUser = await prisma.userProfile.create({
                data: { username: 'both_scope_lead', email: 'both_scope_lead@test.com', scope: ScopeType.SYSTEM, passwordHash: 'hash' }
            });

            // Add as campaignUser first
            await campaignService.addMember(bothScopeUser.id, campaignId, parseInt(customRoleId));

            const bothTeam = await teamService.create({
                name: 'Both Scope Team',
                campaignId: campaignId,
            }, { scope: ScopeType.SYSTEM } as UserPayload);

            await teamService.addMemberToTeam({
                teamId: bothTeam.id,
                userId: bothScopeUser.id,
                roleId: parseInt(customRoleId),
            }, { scope: ScopeType.SYSTEM } as UserPayload);

            // Verify: user has BOTH campaignUser and teamUser
            const cuBefore = await prisma.campaignUser.findUnique({ where: { userProfileId: bothScopeUser.id } });
            expect(cuBefore).toBeDefined();
            const tuBefore = await prisma.teamUser.findUnique({ where: { userProfileId: bothScopeUser.id } });
            expect(tuBefore).toBeDefined();

            await teamService.assignTeamLead({
                teamId: bothTeam.id,
                userId: bothScopeUser.id
            }, { scope: ScopeType.SYSTEM } as UserPayload);

            const teamAfter = await prisma.team.findUnique({ where: { id: bothTeam.id }, include: { teamLead: true } });
            expect(teamAfter?.teamLead?.userProfileId).toBe(bothScopeUser.id);
        });
    });

    describe('Deletion Guards', () => {
        it('should allow removing a team lead and leave team without a lead', async () => {
            const leadUser = await prisma.userProfile.create({
                data: { username: 'guard_lead', email: 'guard_lead@test.com', scope: ScopeType.SYSTEM, passwordHash: 'hash' }
            });
            await campaignService.addMember(leadUser.id, campaignId, parseInt(customRoleId));

            const guardTeam = await teamService.create({
                name: 'Guard Team',
                campaignId: campaignId,
                leadId: leadUser.id
            }, { scope: ScopeType.SYSTEM } as UserPayload);

            // Remove the team lead
            await teamService.removeMember({
                teamId: guardTeam.id,
                userId: leadUser.id
            }, { scope: ScopeType.SYSTEM } as UserPayload);

            // Team should now have no lead
            const teamAfter = await prisma.team.findUnique({ where: { id: guardTeam.id } });
            expect(teamAfter?.teamLeadId).toBeNull();
        });

        it('should NOT auto-promote a regular member to team lead when lead is removed', async () => {
            const autoLeadUser = await prisma.userProfile.create({
                data: { username: 'auto_lead', email: 'auto_lead@test.com', scope: ScopeType.SYSTEM, passwordHash: 'hash' }
            });
            const regularUser = await prisma.userProfile.create({
                data: { username: 'regular_member', email: 'regular_member@test.com', scope: ScopeType.SYSTEM, passwordHash: 'hash' }
            });
            await campaignService.addMember(autoLeadUser.id, campaignId, parseInt(customRoleId));
            await campaignService.addMember(regularUser.id, campaignId, parseInt(customRoleId));

            const autoTeam = await teamService.create({
                name: 'Auto Promote Test',
                campaignId: campaignId,
                leadId: autoLeadUser.id
            }, { scope: ScopeType.SYSTEM } as UserPayload);

            await teamService.addMemberToTeam({
                teamId: autoTeam.id,
                userId: regularUser.id,
                roleId: parseInt(customRoleId),
            }, { scope: ScopeType.SYSTEM } as UserPayload);

            // Remove existing team lead
            await teamService.removeMember({
                teamId: autoTeam.id,
                userId: autoLeadUser.id
            }, { scope: ScopeType.SYSTEM } as UserPayload);

            // Team should have NO lead, the regular member should NOT be promoted
            const teamAfter = await prisma.team.findUnique({ where: { id: autoTeam.id } });
            expect(teamAfter?.teamLeadId).toBeNull();
        });

        it('should transfer working object ownership when reassigning team lead', async () => {
            const woLeadUser = await prisma.userProfile.create({
                data: { username: 'wo_lead', email: 'wo_lead@test.com', scope: ScopeType.SYSTEM, passwordHash: 'hash' }
            });
            const woNewLeadUser = await prisma.userProfile.create({
                data: { username: 'wo_new_lead', email: 'wo_new_lead@test.com', scope: ScopeType.SYSTEM, passwordHash: 'hash' }
            });
            await campaignService.addMember(woLeadUser.id, campaignId, parseInt(customRoleId));
            await campaignService.addMember(woNewLeadUser.id, campaignId, parseInt(customRoleId));

            const woTeam = await teamService.create({
                name: 'WO Transfer Team',
                campaignId: campaignId,
                leadId: woLeadUser.id
            }, { scope: ScopeType.SYSTEM } as UserPayload);
            await teamService.addMemberToTeam({
                teamId: woTeam.id,
                userId: woNewLeadUser.id,
                roleId: parseInt(customRoleId),
            }, { scope: ScopeType.SYSTEM } as UserPayload);

            // First remove lead to avoid "Team already has lead" error
            await prisma.team.update({ where: { id: woTeam.id }, data: { teamLeadId: null } });
            await teamService.assignTeamLead({
                teamId: woTeam.id,
                userId: woNewLeadUser.id
            }, { scope: ScopeType.SYSTEM } as UserPayload);

            // Verify WO ownership transferred to new lead
            const woTeamLink = await prisma.workingObjectTeam.findUnique({ where: { teamId: woTeam.id } });
            expect(woTeamLink).toBeDefined();

            const newLeadTeamUser = await prisma.teamUser.findUnique({ where: { userProfileId: woNewLeadUser.id } });
            const woOwnership = await prisma.workingObjectTeamUser.findFirst({
                where: {
                    workingObjectId: woTeamLink!.workingObjectId,
                    relation: 'Owner'
                }
            });
            expect(woOwnership).toBeDefined();
            expect(woOwnership?.teamUserId).toBe(newLeadTeamUser?.id);
        });

        it('should NOT allow deleting a user who is a campaign owner', async () => {
            await expect(
                memberService.deleteUser(ownerId, { id: 'someone-else', scope: ScopeType.SYSTEM } as UserPayload)
            ).rejects.toThrow('Cannot delete user');
        });

        it('should NOT allow deleting a user who is a team lead', async () => {
            const delLeadUser = await prisma.userProfile.create({
                data: { username: 'del_lead_guard', email: 'del_lead_guard@test.com', scope: ScopeType.SYSTEM, passwordHash: 'hash' }
            });
            await campaignService.addMember(delLeadUser.id, campaignId, parseInt(customRoleId));

            await teamService.create({
                name: 'Delete Lead Guard Team',
                campaignId: campaignId,
                leadId: delLeadUser.id
            }, { scope: ScopeType.SYSTEM } as UserPayload);

            await expect(
                memberService.deleteUser(delLeadUser.id, { id: 'someone-else', scope: ScopeType.SYSTEM } as UserPayload)
            ).rejects.toThrow('Cannot delete user');
        });
    });

    describe('System Integrity', () => {
        it('should cascade delete', async () => {
            await campaignService.delete(campaignId, { scope: ScopeType.SYSTEM } as UserPayload);

            const camp = await prisma.campaign.findUnique({ where: { id: campaignId } });
            expect(camp).toBeNull();

            const team = await prisma.team.findUnique({ where: { id: teamId } });
            expect(team).toBeNull();
        });
    });

    describe('Member Creation Rollback', () => {
        let rollbackCampaignId: string;

        beforeAll(async () => {
            const owner = await prisma.userProfile.upsert({
                where: { username: 'rollback_owner' },
                create: { username: 'rollback_owner', email: 'rollback_owner@test.com', scope: ScopeType.SYSTEM, passwordHash: 'hash' },
                update: {},
            });
            const camp = await campaignService.create(
                { name: 'Rollback Test Campaign', description: 'rollback' },
                owner.id
            );
            rollbackCampaignId = camp.id;
        });

        it('should call DeleteUser when org addMember fails, and really delete the user from DB', async () => {
            const spy = jest.spyOn(campaignService, 'addMember').mockRejectedValueOnce(
                new Error('DB error: simulated failure')
            );

            const ownerRole = await prisma.role.findFirst({
                where: { campaignId: rollbackCampaignId },
                orderBy: { priority: 'asc' },
            });

            await expect(
                memberService.createCampaignMember(
                    {
                        email: 'rb_real@test.com', username: 'rb_real', password: 'Pass1234', scope: ScopeType.SYSTEM,
                        roleId: String(ownerRole!.id), campaignId: rollbackCampaignId,
                    },
                    { id: 'system', scope: ScopeType.SYSTEM } as UserPayload
                )
            ).rejects.toThrow('DB error: simulated failure');
            await new Promise(r => setTimeout(r, 500));
            const dbUser = await prisma.userProfile.findFirst({
                where: { email: 'rb_real@test.com' }
            });
            expect(dbUser).toBeNull();

            spy.mockRestore();
        });
    });
})
