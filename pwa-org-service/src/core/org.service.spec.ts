import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../pwa-prisma/src';
import { CampaignService } from '../campaign/campaign.service';
import { RoleService } from '../roles/role.service';
import { TeamService } from '../team/team.service';
import { MemberService } from '../member/member.service';
import { ScopeType } from '../../../pwa-shared/src/types/org/roles/enums/scope.enum';
import { AccessLevel } from '../../../pwa-shared/src/types/org/sharing/enums/access.enum';
import { SystemRoleName } from '../../../pwa-shared/src/types/org/roles/enums/role.enums';
import { SharingService } from '../sharing/sharing.service';
import { CampaignRepository } from '../campaign/campaign.repository';
import { RoleRepository } from '../roles/role.repository';
import { TeamRepository } from '../team/team.repository';
import { MemberRepository } from '../member/member.repository';
import { SharingRepository } from '../sharing/sharing.repository';
import { of } from 'rxjs';

// Мок для gRPC клієнта Auth
const mockAuthService = {
    OrgSignUp: jest.fn().mockReturnValue(of({ id: 'mock_auth_id', email: 'mock@test.com' })),
};
const mockAuthPackage = {
    getService: jest.fn().mockReturnValue(mockAuthService),
};

describe('Org System Integration Test (Campaign, Role, Team, Member)', () => {
    let prisma: PrismaService;
    let campaignService: CampaignService;
    let roleService: RoleService;
    let teamService: TeamService;
    let memberService: MemberService; // Залишаємо, хоча можемо використовувати campaignService для додавання

    // Тестові змінні
    const ownerEmail = 'owner_e2e@test.com';
    const memberEmail = 'member_e2e@test.com';
    let ownerId: string;
    let memberId: string;

    let campaignId: string;
    let customRoleId: string; // ID ролей у вас string у сервісі
    let teamId: string;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PrismaService,
                CampaignService,
                RoleService,
                TeamService,
                MemberService,
                SharingService,
                // Репозиторії
                CampaignRepository,
                RoleRepository,
                TeamRepository,
                MemberRepository,
                SharingRepository,
                // Mock Auth Client (потрібен для MemberService)
                { provide: 'AUTH_PACKAGE', useValue: mockAuthPackage },
            ],
        }).compile();

        prisma = module.get(PrismaService);
        campaignService = module.get(CampaignService);
        roleService = module.get(RoleService);
        teamService = module.get(TeamService);
        memberService = module.get(MemberService);

        // --- ОЧИЩЕННЯ ---
        await prisma.workingObjectTeamUser.deleteMany();
        await prisma.teamUser.deleteMany();
        await prisma.team.deleteMany();
        await prisma.campaignUser.deleteMany();
        // Спочатку видаляємо RoleAccess, потім Role
        await prisma.roleAccess.deleteMany();
        await prisma.role.deleteMany({
            where: {
                name: { not: SystemRoleName.PRODUCT_OWNER } // Не видаляємо системну роль
            }
        });
        await prisma.accessProfile.deleteMany({
            where: { name: { not: 'Root Admin Profile' } } // Якщо є дефолтні профілі
        });
        await prisma.campaign.deleteMany();
        await prisma.userProfile.deleteMany({
            where: { email: { in: [ownerEmail, memberEmail] } }
        });

        // --- СТВОРЕННЯ ЮЗЕРІВ ---
        const owner = await prisma.userProfile.create({
            data: { username: 'owner_e2e', email: ownerEmail, scope: ScopeType.SYSTEM, passwordHash: 'hash' }
        });
        ownerId = owner.id;

        const member = await prisma.userProfile.create({
            data: { username: 'member_e2e', email: memberEmail, scope: ScopeType.SYSTEM, passwordHash: 'hash' }
        });
        memberId = member.id;

        // Ініціалізація системних ролей (якщо треба)
        await roleService.onModuleInit();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    // ==========================================
    // 1. CAMPAIGN SERVICE
    // ==========================================
    describe('Campaign Service', () => {
        it('should create a new Campaign', async () => {
            // FIX: create приймає (dto, userId)
            const result = await campaignService.create(
                {
                    name: 'E2E Test Campaign',
                    description: 'Integration test'
                },
                ownerId // Передаємо ID власника другим аргументом
            );

            expect(result).toBeDefined();
            expect(result.id).toBeDefined();
            expect(result.name).toBe('E2E Test Campaign');

            campaignId = result.id;
        });
    });

    // ==========================================
    // 2. ROLE SERVICE
    // ==========================================
    describe('Role Service', () => {
        it('should create a custom Role in Campaign', async () => {
            // FIX: create приймає (dto, scope, contextId)
            const roleResponse = await roleService.create(
                {
                    name: 'Marketing Manager',
                    description: 'Can manage ads',
                    globalRules: {
                        statAccess: AccessLevel.View,
                        finAccess: AccessLevel.Manage,
                        usersAccess: AccessLevel.None, // Додаємо всі поля, бо DTO цього вимагає
                        logAccess: AccessLevel.View,
                        sharingAccess: AccessLevel.None
                    }
                },
                ScopeType.CAMPAIGN, // Scope
                campaignId          // Context ID
            );

            expect(roleResponse).toBeDefined();
            expect(roleResponse.scope).toBe(ScopeType.CAMPAIGN);
            customRoleId = roleResponse.id;

            // Перевірка прав
            expect(roleResponse.globalRules.finAccess).toBe(AccessLevel.Manage);
        });
    });

    // ==========================================
    // 3. MEMBER FLOW (Campaign)
    // ==========================================
    describe('Member Flow (Campaign)', () => {
        it('should add an EXISTING user to the campaign via CampaignService', async () => {
            // FIX: Використовуємо campaignService.addMember, бо він приймає userId
            // MemberService.createCampaignMember у вашому коді робить SignUp через gRPC

            const result = await campaignService.addMember(
                memberId,
                campaignId,
                parseInt(customRoleId) // addMember очікує number
            );

            expect(result).toBeDefined();
            expect(result.userProfileId).toBe(memberId);
            expect(result.campaignId).toBe(campaignId);
            expect(result.roleId).toBe(parseInt(customRoleId));
        });

        it('should update member role via RoleService', async () => {
            // 1. Створюємо нову роль
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

            // 2. FIX: Використовуємо assignRoleToUser замість updateMemberRole
            await roleService.assignRoleToUser(
                {
                    userId: memberId,
                    roleId: parseInt(viewerRole.id)
                },
                ScopeType.CAMPAIGN
            );

            // 3. Перевіряємо в базі
            const updatedMember = await prisma.campaignUser.findFirst({
                where: { userProfileId: memberId, campaignId: campaignId },
                include: { role: true }
            });

            expect(updatedMember?.role.name).toBe('Campaign Viewer');
        });
    });

    // ==========================================
    // 4. TEAM SERVICE
    // ==========================================
    describe('Team Service', () => {
        it('should create a Team', async () => {
            // FIX: create приймає CreateTeamDto (1 аргумент)
            const team = await teamService.create({
                name: 'Alpha Squad',
                campaignId: campaignId,
                // leadId: memberId // Можна передати ліда одразу
            });

            expect(team).toBeDefined();
            expect(team.campaign_id).toBe(campaignId);
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
            // Знаходимо роль
            const teamRole = await prisma.role.findFirst({
                where: { teamId: teamId, name: 'Team Lead' }
            });

            // FIX: Використовуємо addMemberToTeam
            await teamService.addMemberToTeam({
                teamId: teamId,
                userId: memberId,
                roleId: teamRole!.id
            });

            const teamUser = await prisma.teamUser.findUnique({
                where: { userProfileId: memberId },
                include: { team: true }
            });

            expect(teamUser).toBeDefined();
            expect(teamUser?.team.name).toBe('Alpha Squad');
        });
    });

    // ==========================================
    // 5. CLEANUP CHECK
    // ==========================================
    describe('System Integrity', () => {
        it('should cascade delete', async () => {
            await campaignService.delete(campaignId);

            const camp = await prisma.campaign.findUnique({ where: { id: campaignId } });
            expect(camp).toBeNull();

            const team = await prisma.team.findUnique({ where: { id: teamId } });
            expect(team).toBeNull();
        });
    });
});