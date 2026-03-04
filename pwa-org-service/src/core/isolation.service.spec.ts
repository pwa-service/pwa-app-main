import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../pwa-prisma/src';
import { CampaignService } from '../campaign/campaign.service';
import { RoleService } from '../roles/role.service';
import { TeamService } from '../team/team.service';
import { MemberService } from '../member/member.service';
import { AccessLevel, ScopeType } from '../../../pwa-shared/src';
import { UserPayload } from '../../../pwa-shared/src/types/auth/dto/user-payload.dto';
import { RolePriority, SystemRoleName } from '../../../pwa-shared/src/types/org/roles/enums/role.enums';
import { ForbiddenException } from '@nestjs/common';
import { MemberModule } from '../member/member.module';
import { CampaignModule } from '../campaign/campaign.module';
import { RoleModule } from '../roles/role.module';
import { TeamModule } from '../team/team.module';
import { SharingModule } from '../sharing/sharing.module';
import { join } from 'path';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SharingService } from '../sharing/sharing.service';
import { CampaignRepository } from '../campaign/campaign.repository';
import { RoleRepository } from '../roles/role.repository';
import { TeamRepository } from '../team/team.repository';
import { MemberRepository } from '../member/member.repository';
import { SharingRepository } from '../sharing/sharing.repository';


describe('Multi-Tenant Isolation Security Tests', () => {
    jest.setTimeout(30000);

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
        const AUTH_PROTO_DIR = join(process.env.PROTO_DIR || process.cwd(), 'protos');
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

            await campaignService.addMember(userA2.id, campaignAId, roleA1Id);

            await teamService.addMemberToTeam({
                teamId: team.id,
                userId: userA2.id,
                roleId: roleA1Id
            }, { scope: ScopeType.SYSTEM } as UserPayload);


            const updated = await teamService.assignTeamLead({
                teamId: team.id,
                userId: userA2.id
            }, { scope: ScopeType.SYSTEM } as UserPayload);

            const teamMember = await prisma.teamUser.findFirst({
                where: { teamId: team.id, userProfileId: userA2.id }
            });
            expect(updated).toBe(teamMember!.id);
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
            const roles = await prisma.role.findMany({ where: { campaignId: newCamp.id } });
            const priorities = roles.map(r => r.priority);

            expect(priorities).toContain(RolePriority.OWNER);
            expect(priorities).toContain(RolePriority.LEAD);
            expect(priorities).toContain(RolePriority.MEMBER);

            const ownerRole = roles.find(r => r.priority === RolePriority.OWNER);
            expect(ownerRole?.name).toBe(SystemRoleName.CAMPAIGN_OWNER);

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
            expect(updated).toBeDefined();
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

    describe('Team Lead vs Member Access', () => {
        let leadProfile: any;
        let memberProfile: any;
        let teamForLeadTest: any;
        let teamLeadUser: UserPayload;
        let teamMemberUser: UserPayload;

        beforeAll(async () => {
            leadProfile = await prisma.userProfile.upsert({
                where: { username: 'leaduser' },
                create: { username: 'leaduser', email: 'lead@test.com', scope: ScopeType.TEAM, passwordHash: 'hash' },
                update: {},
            });
            memberProfile = await prisma.userProfile.upsert({
                where: { username: 'newowner' },
                create: { username: 'newowner', email: 'newowner@test.com', scope: ScopeType.TEAM, passwordHash: 'hash' },
                update: {},
            });

            teamForLeadTest = await teamService.create(
                { name: 'Lead Visibility Team', campaignId: campaignAId },
                { scope: ScopeType.SYSTEM } as UserPayload
            );

            const leadRole = await roleService.findByPriorityAndContext(RolePriority.LEAD, ScopeType.CAMPAIGN, campaignAId);
            const memberRole = await roleService.findByPriorityAndContext(RolePriority.MEMBER, ScopeType.CAMPAIGN, campaignAId);

            await campaignService.upsertMember(leadProfile.id, campaignAId, leadRole!.id);
            await prisma.teamUser.deleteMany({ where: { userProfileId: leadProfile.id } });
            await teamService.addMemberToTeam(
                { teamId: teamForLeadTest.id, userId: leadProfile.id, roleId: leadRole!.id },
                { scope: ScopeType.SYSTEM } as UserPayload
            );
            await teamService.assignTeamLead(
                { teamId: teamForLeadTest.id, userId: leadProfile.id },
                { scope: ScopeType.SYSTEM } as UserPayload
            );

            await campaignService.upsertMember(memberProfile.id, campaignAId, memberRole!.id);
            await prisma.teamUser.deleteMany({ where: { userProfileId: memberProfile.id } });
            await teamService.addMemberToTeam(
                { teamId: teamForLeadTest.id, userId: memberProfile.id, roleId: memberRole!.id },
                { scope: ScopeType.SYSTEM } as UserPayload
            );

            teamLeadUser = {
                id: leadProfile.id,
                email: leadProfile.email!,
                username: leadProfile.username,
                scope: ScopeType.TEAM,
                contextId: teamForLeadTest.id,
                access: { statAccess: 1, finAccess: 1, logAccess: 1, usersAccess: 1, sharingAccess: 1 }
            } as any;

            teamMemberUser = {
                id: memberProfile.id,
                email: memberProfile.email!,
                username: memberProfile.username,
                scope: ScopeType.TEAM,
                contextId: teamForLeadTest.id,
                access: { statAccess: 1, finAccess: 1, logAccess: 1, usersAccess: 1, sharingAccess: 1 }
            } as any;
        });

        it('team lead should be set on the team after assignTeamLead', async () => {
            const team = await prisma.team.findUnique({
                where: { id: teamForLeadTest.id },
                include: { teamLead: true }
            });
            expect(team?.teamLead?.userProfileId).toBe(leadProfile.id);
        });

        it('team lead user has teamUser record pointing to the team', async () => {
            const tu = await prisma.teamUser.findFirst({
                where: { teamId: teamForLeadTest.id, userProfileId: leadProfile.id }
            });
            expect(tu).not.toBeNull();
        });

        it('team lead and regular member both have team membership', async () => {
            const leadTu = await prisma.teamUser.findFirst({ where: { teamId: teamForLeadTest.id, userProfileId: leadProfile.id } });
            const memberTu = await prisma.teamUser.findFirst({ where: { teamId: teamForLeadTest.id, userProfileId: memberProfile.id } });
            expect(leadTu).not.toBeNull();
            expect(memberTu).not.toBeNull();
        });

        it('regular team member sees ONLY other members of their own team (not lead-only members)', async () => {
            const { members } = await memberService.findAll({}, {}, teamMemberUser);
            const ids = members.map((m: any) => m.userId);

            expect(ids).toContain(leadProfile.id);
            expect(ids).not.toContain('u-team-a');
        });

        it('regular team member role has MEMBER priority', async () => {
            const tu = await prisma.teamUser.findFirst({
                where: { teamId: teamForLeadTest.id, userProfileId: memberProfile.id },
                include: { role: true }
            });
            expect(tu?.role?.priority).toBe(50);
        });

        it('team lead role has LEAD priority', async () => {
            const tu = await prisma.teamUser.findFirst({
                where: { teamId: teamForLeadTest.id, userProfileId: leadProfile.id },
                include: { role: true }
            });
            expect(tu?.role?.priority).toBe(40);
        });
    });

    describe('Cross-Campaign Isolation', () => {
        let campaignAUser: UserPayload;
        let campaignBUser: UserPayload;

        beforeAll(() => {
            campaignAUser = {
                id: userA.id,
                email: userA.email,
                username: userA.username,
                scope: ScopeType.CAMPAIGN,
                contextId: campaignAId,
                access: { statAccess: 1, finAccess: 1, logAccess: 1, usersAccess: 1, sharingAccess: 1 }
            } as any;

            campaignBUser = {
                id: userB.id,
                email: userB.email,
                username: userB.username,
                scope: ScopeType.CAMPAIGN,
                contextId: campaignBId,
                access: { statAccess: 1, finAccess: 1, logAccess: 1, usersAccess: 1, sharingAccess: 1 }
            } as any;
        });

        it('Campaign A user cannot see Campaign B roles', async () => {
            const { roles } = await roleService.findAll({}, {}, campaignAUser);
            const campaignIds = roles.map((r: any) => r.campaignId).filter(Boolean);
            const hasLeakage = campaignIds.some((id: string) => id === campaignBId);
            expect(hasLeakage).toBe(false);
        });

        it('Campaign B user cannot see Campaign A roles', async () => {
            const { roles } = await roleService.findAll({}, {}, campaignBUser);
            const campaignIds = roles.map((r: any) => r.campaignId).filter(Boolean);
            const hasLeakage = campaignIds.some((id: string) => id === campaignAId);
            expect(hasLeakage).toBe(false);
        });

        it('Campaign A user cannot see Campaign B members', async () => {
            const { members } = await memberService.findAll({}, {}, campaignAUser);
            const campIds = members
                .map((m: any) => m.campaignId)
                .filter(Boolean);
            const hasLeakage = campIds.some((id: string) => id === campaignBId);
            expect(hasLeakage).toBe(false);
        });

        it('Campaign A user cannot access Campaign B team directly', async () => {
            const teamB = await prisma.team.findFirst({ where: { campaignId: campaignBId } });
            if (!teamB) return;

            await expect(
                teamService.findOne(teamB.id, campaignAUser)
            ).rejects.toThrow();
        });
    });

    describe('Duplicate Member Prevention', () => {
        it('cannot add the same user to a team twice', async () => {
            const dupUser = await prisma.userProfile.upsert({
                where: { username: 'dupuser' },
                create: { username: 'dupuser', email: 'dup@test.com', scope: ScopeType.TEAM, passwordHash: 'hash' },
                update: {},
            });

            const team = await prisma.team.findFirst({ where: { campaignId: campaignAId } });
            const role = await roleService.findByPriorityAndContext(RolePriority.MEMBER, ScopeType.CAMPAIGN, campaignAId);

            await prisma.teamUser.deleteMany({ where: { userProfileId: dupUser.id } });
            await teamService.addMemberToTeam(
                { teamId: team!.id, userId: dupUser.id, roleId: role!.id },
                { scope: ScopeType.SYSTEM } as UserPayload
            );
            await expect(
                teamService.addMemberToTeam(
                    { teamId: team!.id, userId: dupUser.id, roleId: role!.id },
                    { scope: ScopeType.SYSTEM } as UserPayload
                )
            ).rejects.toThrow('User already in a team');
        });

        it('cannot add the same user to a campaign twice', async () => {
            const dupUser = await prisma.userProfile.upsert({
                where: { username: 'dupcamp' },
                create: { username: 'dupcamp', email: 'dupcamp@test.com', scope: ScopeType.CAMPAIGN, passwordHash: 'hash' },
                update: {},
            });

            const role = await roleService.findByPriorityAndContext(RolePriority.MEMBER, ScopeType.CAMPAIGN, campaignAId);
            await prisma.campaignUser.deleteMany({ where: { userProfileId: dupUser.id } });
            // First add
            await campaignService.addMember(dupUser.id, campaignAId, role!.id);

            // Second add — should throw (unique constraint)
            await expect(
                campaignService.addMember(dupUser.id, campaignAId, role!.id)
            ).rejects.toThrow();
        });
    });

    describe('Permission-Based Access Control', () => {
        let restrictedUser: UserPayload;
        let restrictedRoleId: number;

        beforeAll(async () => {
            const restrictedProfile = await prisma.userProfile.upsert({
                where: { username: 'restricted_user' },
                create: { username: 'restricted_user', email: 'restricted@test.com', scope: ScopeType.CAMPAIGN, passwordHash: 'hash' },
                update: {},
            });


            const noPermRole = await roleService.create({
                name: 'Read Only Role',
                description: 'No write access',
                globalRules: {
                    statAccess: AccessLevel.None,
                    finAccess: AccessLevel.None,
                    logAccess: AccessLevel.None,
                    usersAccess: AccessLevel.None,
                    sharingAccess: AccessLevel.None,
                }
            }, ScopeType.CAMPAIGN, campaignAId);

            restrictedRoleId = parseInt(noPermRole.id);

            await campaignService.upsertMember(restrictedProfile.id, campaignAId, restrictedRoleId);

            restrictedUser = {
                id: restrictedProfile.id,
                email: restrictedProfile.email!,
                username: restrictedProfile.username,
                scope: ScopeType.CAMPAIGN,
                contextId: campaignAId,
                access: {
                    statAccess: AccessLevel.None,
                    finAccess: AccessLevel.None,
                    logAccess: AccessLevel.None,
                    usersAccess: AccessLevel.None,
                    sharingAccess: AccessLevel.None,
                }
            } as any;
        });

        it('Campaign A user cannot assign a role that belongs to Campaign B', async () => {
            const roleBTest = await roleService.create({
                name: 'Cross Camp Role',
                description: 'test',
                globalRules: {
                    statAccess: AccessLevel.None, finAccess: AccessLevel.None,
                    logAccess: AccessLevel.None, usersAccess: AccessLevel.None, sharingAccess: AccessLevel.None
                }
            }, ScopeType.CAMPAIGN, campaignBId);

            const someUser = await prisma.userProfile.upsert({
                where: { username: 'target_user' },
                create: { username: 'target_user', email: 'target@test.com', scope: ScopeType.CAMPAIGN, passwordHash: 'hash' },
                update: {},
            });

            await expect(
                roleService.assignRoleToUser(
                    { userId: someUser.id, roleId: parseInt(roleBTest.id) },
                    restrictedUser
                )
            ).rejects.toThrow(ForbiddenException);
        });

        it('user with usersAccess=None cannot delete a role from another campaign', async () => {
            const roleBForDeletion = await roleService.create({
                name: 'Role to Delete',
                description: 'test',
                globalRules: {
                    statAccess: AccessLevel.None, finAccess: AccessLevel.None,
                    logAccess: AccessLevel.None, usersAccess: AccessLevel.None, sharingAccess: AccessLevel.None
                }
            }, ScopeType.CAMPAIGN, campaignBId);

            await expect(
                roleService.delete(roleBForDeletion.id, restrictedUser)
            ).rejects.toThrow(ForbiddenException);
        });

        it('CAMPAIGN scope user cannot delete a SYSTEM role', async () => {
            const systemRole = await prisma.role.findFirst({ where: { scope: ScopeType.SYSTEM } });
            if (!systemRole) return;

            await expect(
                roleService.delete(String(systemRole.id), restrictedUser)
            ).rejects.toThrow(ForbiddenException);
        });
    });

    describe('Role Privilege Escalation Prevention', () => {
        let memberScopeUser: UserPayload;
        let ownerRoleId: number;
        let memberRoleId: number;

        beforeAll(async () => {
            const memberProfile = await prisma.userProfile.upsert({
                where: { username: 'priv_check_member' },
                create: { username: 'priv_check_member', email: 'privmember@test.com', scope: ScopeType.CAMPAIGN, passwordHash: 'hash' },
                update: {},
            });

            const allCampaignRoles = await prisma.role.findMany({
                where: { campaignId: campaignAId },
                orderBy: { priority: 'asc' }
            });
            const highestPrivRole = allCampaignRoles[0];
            const lowestPrivRole = allCampaignRoles[allCampaignRoles.length - 1];

            ownerRoleId = highestPrivRole.id;
            memberRoleId = lowestPrivRole.id;

            await campaignService.upsertMember(memberProfile.id, campaignAId, memberRoleId);

            memberScopeUser = {
                id: memberProfile.id,
                email: memberProfile.email!,
                username: memberProfile.username,
                scope: ScopeType.CAMPAIGN,
                contextId: campaignAId,
                access: { statAccess: 1, finAccess: 1, logAccess: 1, usersAccess: 1, sharingAccess: 1 },
            } as any;
        });

        it('MEMBER cannot assign OWNER role to a new campaign member', async () => {
            await expect(
                memberService.createCampaignMember(
                    { email: 'newguy@test.com', username: 'newguy', password: 'Password1', scope: ScopeType.CAMPAIGN, roleId: String(ownerRoleId), campaignId: campaignAId },
                    memberScopeUser
                )
            ).rejects.toThrow(ForbiddenException);
        });

        it('MEMBER can assign same-level MEMBER role (privilege check passes)', async () => {
            try {
                const res = await memberService.createCampaignMember(
                    { email: 'samelvl@test.com', username: 'samelvl', password: 'Password1', scope: ScopeType.CAMPAIGN, roleId: String(memberRoleId), campaignId: campaignAId },
                    memberScopeUser
                );
                expect(res).toBeDefined();
            } catch (e) {
                expect(e).not.toBeInstanceOf(ForbiddenException);
            }
        });
    });
});
