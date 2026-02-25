import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../pwa-prisma/src';
import { CampaignService } from '../campaign/campaign.service';
import { RoleService } from '../roles/role.service';
import { TeamService } from '../team/team.service';
import { MemberService } from '../member/member.service';
import { AccessLevel, ScopeType } from '../../../pwa-shared/src';
import { UserPayload } from '../../../pwa-shared/src/types/auth/dto/user-payload.dto';
import { RolePriority, SystemRoleName } from '../../../pwa-shared/src/types/org/roles/enums/role.enums';
import { SharingService } from '../sharing/sharing.service';
import { CampaignRepository } from '../campaign/campaign.repository';
import { RoleRepository } from '../roles/role.repository';
import { TeamRepository } from '../team/team.repository';
import { MemberRepository } from '../member/member.repository';
import { SharingRepository } from '../sharing/sharing.repository';
import { of } from 'rxjs';
import { ForbiddenException } from '@nestjs/common';

const mockAuthService = {
    OrgSignUp: jest.fn().mockReturnValue(of({ id: 'mock_auth_id', email: 'mock@test.com' })),
};
const mockAuthPackage = {
    getService: jest.fn().mockReturnValue(mockAuthService),
};

describe('Multi-Tenant Isolation Security Tests', () => {
    let prisma: PrismaService;
    let campaignService: CampaignService;
    let roleService: RoleService;
    let teamService: TeamService;
    let memberService: MemberService;

    let campaignAId: string;
    let campaignBId: string;
    let roleA1Id: number;
    let roleBId: number;

    const userA: UserPayload = {
        id: 'user-a-id',
        email: 'user-a@test.com',
        username: 'usera',
        scope: ScopeType.CAMPAIGN,
        contextId: '',
        access: { statAccess: 1, finAccess: 1, logAccess: 1, usersAccess: 1, sharingAccess: 1 }
    } as any;

    const userA2: UserPayload = {
        id: 'user-a2-id',
        email: 'user-a2@test.com',
        username: 'usera2',
        scope: ScopeType.CAMPAIGN,
        contextId: '',
        access: { statAccess: 1, finAccess: 1, logAccess: 1, usersAccess: 1, sharingAccess: 1 }
    } as any;

    const userB: UserPayload = {
        id: 'user-b-id',
        email: 'user-b@test.com',
        username: 'userb',
        scope: ScopeType.CAMPAIGN,
        contextId: '',
        access: { statAccess: 1, finAccess: 1, logAccess: 1, usersAccess: 1, sharingAccess: 1 }
    } as any;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
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
                { provide: 'AUTH_PACKAGE', useValue: mockAuthPackage },
            ],
        }).compile();

        prisma = module.get(PrismaService);
        campaignService = module.get(CampaignService);
        roleService = module.get(RoleService);
        teamService = module.get(TeamService);
        memberService = module.get(MemberService);

        // CLEANUP
        await prisma.workingObjectTeamUser.deleteMany();
        await prisma.teamUser.deleteMany();
        await prisma.team.deleteMany();
        await prisma.campaignUser.deleteMany();
        await prisma.roleAccess.deleteMany();
        await prisma.role.deleteMany({ where: { name: { not: SystemRoleName.PRODUCT_OWNER } } });
        await prisma.pwaDetails.deleteMany();
        await prisma.pwaVersion.deleteMany();
        await prisma.flow.deleteMany();
        await prisma.pwaContent.deleteMany();
        await prisma.pwaEventsConfig.deleteMany();
        await prisma.pwaSession.deleteMany();
        await prisma.eventLog.deleteMany();
        await prisma.pwaApp.deleteMany();
        await prisma.campaign.deleteMany();
        await prisma.userProfile.deleteMany({
            where: {
                username: { in: [userA.username, userA2.username, userB.username, 'uteama', 'usera3', 'userb2', 'newowner', 'leaduser'] }
            }
        });

        // SETUP
        await prisma.userProfile.createMany({
            data: [
                { id: userA.id, username: userA.username, email: userA.email, scope: ScopeType.CAMPAIGN, passwordHash: 'hash' },
                { id: userA2.id, username: userA2.username, email: userA2.email, scope: ScopeType.CAMPAIGN, passwordHash: 'hash' },
                { id: userB.id, username: userB.username, email: userB.email, scope: ScopeType.CAMPAIGN, passwordHash: 'hash' }
            ]
        });

        const campA = await prisma.campaign.create({ data: { name: 'Campaign A' } });
        campaignAId = campA.id;
        userA.contextId = campaignAId;
        userA2.contextId = campaignAId;

        const campB = await prisma.campaign.create({ data: { name: 'Campaign B' } });
        campaignBId = campB.id;
        userB.contextId = campaignBId;

        const roleLead = await roleService.create({
            name: SystemRoleName.TEAM_LEAD,
            description: 'Lead',
            globalRules: { statAccess: AccessLevel.View, finAccess: AccessLevel.View, logAccess: AccessLevel.View, usersAccess: AccessLevel.View, sharingAccess: AccessLevel.View }
        }, ScopeType.CAMPAIGN, campaignAId, RolePriority.LEAD);

        const roleMember = await roleService.create({
            name: SystemRoleName.MEDIA_BUYER,
            description: 'Member',
            globalRules: { statAccess: AccessLevel.View, finAccess: AccessLevel.None, logAccess: AccessLevel.None, usersAccess: AccessLevel.None, sharingAccess: AccessLevel.None }
        }, ScopeType.CAMPAIGN, campaignAId, RolePriority.MEMBER);

        const rA1 = await roleService.create({
            name: 'Role A1',
            description: 'Desc',
            globalRules: {
                statAccess: AccessLevel.View,
                finAccess: AccessLevel.View,
                logAccess: AccessLevel.View,
                usersAccess: AccessLevel.View,
                sharingAccess: AccessLevel.View
            }
        }, ScopeType.CAMPAIGN, campaignAId);
        roleA1Id = parseInt(rA1.id);

        const rB = await roleService.create({
            name: 'Role B',
            description: 'Desc',
            globalRules: {
                statAccess: AccessLevel.View,
                finAccess: AccessLevel.View,
                logAccess: AccessLevel.View,
                usersAccess: AccessLevel.View,
                sharingAccess: AccessLevel.View
            }
        }, ScopeType.CAMPAIGN, campaignBId);
        roleBId = parseInt(rB.id);

        await teamService.create({ name: 'Team A1', campaignId: campaignAId }, { scope: ScopeType.SYSTEM } as UserPayload);
        await teamService.create({ name: 'Team A2', campaignId: campaignAId }, { scope: ScopeType.SYSTEM } as UserPayload);
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe('Creation Flows', () => {
        it('should create a Team without a lead', async () => {
            const team = await teamService.create({
                name: 'Leadless Team',
                campaignId: campaignAId
            }, { scope: ScopeType.SYSTEM } as UserPayload);

            expect(team.name).toBe('Leadless Team');
            expect(team.leadId).toBeNull();
        });

        it('should assign a lead to an existing team', async () => {
            const team = await teamService.create({
                name: 'Future Lead Team',
                campaignId: campaignAId
            }, { scope: ScopeType.SYSTEM } as UserPayload);

            // Add member to campaign first (mandatory for role sync)
            await campaignService.addMember(userA2.id, campaignAId, roleA1Id);

            // Then add to team
            await teamService.addMemberToTeam({
                teamId: team.id,
                userId: userA2.id,
                roleId: roleA1Id
            }, { scope: ScopeType.SYSTEM } as UserPayload);

            // Assign as lead
            const updated = await teamService.assignTeamLead({
                teamId: team.id,
                userId: userA2.id
            }, { scope: ScopeType.SYSTEM } as UserPayload);

            const teamMember = await prisma.teamUser.findFirst({
                where: { teamId: team.id, userProfileId: userA2.id }
            });
            expect(updated.leadId).toBe(teamMember!.id);
        });

        it('should create roles in different scopes (Campaign vs Team)', async () => {
            const team = await prisma.team.findFirst({ where: { campaignId: campaignAId } });

            const teamRoleResp = await roleService.create({
                name: 'Team-Specific Role',
                description: 'Team scope',
                globalRules: {
                    statAccess: AccessLevel.View,
                    finAccess: AccessLevel.None,
                    logAccess: AccessLevel.None,
                    usersAccess: AccessLevel.None,
                    sharingAccess: AccessLevel.None
                }
            }, ScopeType.TEAM, team!.id);

            const teamRoleDb = await prisma.role.findUnique({ where: { id: parseInt(teamRoleResp.id) } });
            expect(teamRoleDb?.scope).toBe(ScopeType.TEAM);
            expect(teamRoleDb?.teamId).toBe(team!.id);
            expect(teamRoleDb?.campaignId).toBeNull();

            const campaignRoleResp = await roleService.create({
                name: 'Campaign-Wide Role',
                description: 'Campaign scope',
                globalRules: {
                    statAccess: AccessLevel.View,
                    finAccess: AccessLevel.None,
                    logAccess: AccessLevel.None,
                    usersAccess: AccessLevel.None,
                    sharingAccess: AccessLevel.None
                }
            }, ScopeType.CAMPAIGN, campaignAId);

            const campaignRoleDb = await prisma.role.findUnique({ where: { id: parseInt(campaignRoleResp.id) } });
            expect(campaignRoleDb?.scope).toBe(ScopeType.CAMPAIGN);
            expect(campaignRoleDb?.campaignId).toBe(campaignAId);
            expect(campaignRoleDb?.teamId).toBeNull();
        });

        it('should initialize a Campaign with standard roles and owner', async () => {
            const newUser = await prisma.userProfile.create({
                data: { username: 'newowner', email: 'owner@test.com', scope: ScopeType.SYSTEM, passwordHash: 'hash' }
            });

            const newCamp = await campaignService.create({ name: 'Auto Init Campaign' }, newUser.id);

            // Verify roles created
            const roles = await prisma.role.findMany({ where: { campaignId: newCamp.id } });
            const priorities = roles.map(r => r.priority);

            expect(priorities).toContain(RolePriority.OWNER);
            expect(priorities).toContain(RolePriority.LEAD);
            expect(priorities).toContain(RolePriority.MEMBER);

            const ownerRole = roles.find(r => r.priority === RolePriority.OWNER);
            expect(ownerRole?.name).toBe(SystemRoleName.CAMPAIGN_OWNER);

            // Verify owner assignment
            const member = await prisma.campaignUser.findFirst({ where: { campaignId: newCamp.id, userProfileId: newUser.id } });
            expect(member).toBeDefined();
            expect(member?.roleId).toBe(ownerRole?.id);
        });

        it('should assign a lead to a team in a fresh campaign', async () => {
            const newUser = await prisma.userProfile.create({
                data: { username: 'leaduser', email: 'lead@test.com', scope: ScopeType.SYSTEM, passwordHash: 'hash' }
            });
            const freshCamp = await campaignService.create({ name: 'Fresh Camp' }, newUser.id);

            const team = await teamService.create({ name: 'Fresh Team', campaignId: freshCamp.id }, { scope: ScopeType.SYSTEM } as UserPayload);
            const memberRole = await prisma.role.findFirst({ where: { campaignId: freshCamp.id, priority: RolePriority.MEMBER } });

            await teamService.addMemberToTeam({ teamId: team.id, userId: newUser.id, roleId: memberRole!.id }, { scope: ScopeType.SYSTEM } as UserPayload);

            const updated = await teamService.assignTeamLead({ teamId: team.id, userId: newUser.id }, { scope: ScopeType.SYSTEM } as UserPayload);
            expect(updated.leadId).toBeDefined();
        });
    });

    describe('Granular Team Isolation', () => {
        let teamAUser: UserPayload;
        let teamRoleAId: number;
        let teamAId: string;
        let teamBId: string;
        let userTeamA: UserPayload;

        beforeAll(async () => {
            const utA = await prisma.userProfile.create({
                data: { id: 'u-team-a', username: 'uteama', email: 'u-team-a@test.com', scope: ScopeType.CAMPAIGN, passwordHash: 'hash' }
            });
            userTeamA = {
                id: utA.id,
                email: utA.email!,
                username: utA.username,
                scope: ScopeType.TEAM,
                contextId: ''
            } as any;

            const tA = await teamService.create({ name: 'Strict Team A', campaignId: campaignAId }, { scope: ScopeType.SYSTEM } as UserPayload);
            teamAId = tA.id;
            const tB = await teamService.create({ name: 'Strict Team B', campaignId: campaignAId }, { scope: ScopeType.SYSTEM } as UserPayload);
            teamBId = tB.id;

            const rA = await roleService.create({
                name: 'Role for Team A',
                description: 'A',
                globalRules: { statAccess: AccessLevel.View, finAccess: AccessLevel.None, logAccess: AccessLevel.None, usersAccess: AccessLevel.None, sharingAccess: AccessLevel.None }
            }, ScopeType.TEAM, teamAId);
            teamRoleAId = parseInt(rA.id);

            await roleService.create({
                name: 'Role for Team B',
                description: 'B',
                globalRules: { statAccess: AccessLevel.View, finAccess: AccessLevel.None, logAccess: AccessLevel.None, usersAccess: AccessLevel.None, sharingAccess: AccessLevel.None }
            }, ScopeType.TEAM, teamBId);

            await teamService.addMemberToTeam({ teamId: teamAId, userId: userTeamA.id, roleId: teamRoleAId }, { scope: ScopeType.SYSTEM } as UserPayload);

            teamAUser = {
                ...userTeamA,
                scope: ScopeType.TEAM,
                contextId: teamAId
            };
        });

        it('Team A member should see ONLY Team A roles (not Campaign roles or Team B roles)', async () => {
            const { roles } = await roleService.findAll({}, {}, teamAUser);
            const names = roles.map((r: any) => r.name);

            expect(names).toContain('Role for Team A');
            expect(names).not.toContain('Role for Team B');
            expect(names).not.toContain('Campaign-Wide Role');
            expect(names).not.toContain('Role A1');
        });

        it('Team A member should see ONLY Team A members', async () => {
            const userA3 = await prisma.userProfile.create({
                data: { username: 'usera3', email: 'user-a3@test.com', scope: ScopeType.TEAM, passwordHash: 'hash' }
            });
            await teamService.addMemberToTeam({ teamId: teamAId, userId: userA3.id, roleId: teamRoleAId }, { scope: ScopeType.SYSTEM } as UserPayload);
            const userB2 = await prisma.userProfile.create({
                data: { username: 'userb2', email: 'user-b2@test.com', scope: ScopeType.TEAM, passwordHash: 'hash' }
            });
            await teamService.addMemberToTeam({ teamId: teamBId, userId: userB2.id, roleId: teamRoleAId }, { scope: ScopeType.SYSTEM } as UserPayload);

            const { members } = await memberService.findAll({}, {}, teamAUser);
            const emails = members.map((m: any) => m.email);

            expect(emails).toContain('user-a3@test.com');
            expect(emails).not.toContain('user-b2@test.com');
            expect(emails).not.toContain(userA.email);
            expect(emails.length).toBe(1);
        });
    });
});
