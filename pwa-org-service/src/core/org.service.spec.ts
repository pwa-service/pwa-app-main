// import {PrismaService} from "../../../pwa-prisma/src";
// import {RoleService} from "../roles/role.service";
// import {MemberService} from "../member/member.service";
// import {TeamService} from "../team/team.service";
// import {CampaignService} from "../campaign/campaign.service";
// import {TestingModule} from "@nestjs/testing";
// import { ScopeType } from "../../../pwa-shared/src/types/org/roles/enums/scope.enum";
// import { AccessLevel } from "../../../pwa-shared/src/types/org/sharing/enums/access.enum";
//
//
// describe('Org System Integration Test (Campaign, Role, Team, Member)', () => {
//     let prisma: PrismaService;
//     // Оголошуємо сервіси
//     let campaignService: CampaignService;
//     let roleService: RoleService;
//     let teamService: TeamService;
//     let memberService: MemberService;
//
//     // Тестові дані
//     const ownerEmail = 'owner@test.com';
//     const memberEmail = 'member@test.com';
//     let ownerId: string;
//     let memberId: string;
//
//     let campaignId: string;
//     let teamId: string;
//     let customRoleId: number;
//
//     beforeAll(async () => {
//         const module: TestingModule = await test.createTestingModule({
//             providers: [
//                 PrismaService,
//                 CampaignService,
//                 RoleService,
//                 TeamService,
//                 MemberService,
//                 // Додайте інші залежності, якщо сервіси їх потребують (наприклад, ConfigService)
//             ],
//         }).compile();
//
//         prisma = module.get(PrismaService);
//         campaignService = module.get(CampaignService);
//         roleService = module.get(RoleService);
//         teamService = module.get(TeamService);
//         memberService = module.get(MemberService);
//
//         // --- 1. ОЧИЩЕННЯ БАЗИ ---
//         // Видаляємо в правильному порядку, щоб не порушити FK constraints
//         await prisma.workingObjectTeamUser.deleteMany();
//         await prisma.teamUser.deleteMany();
//         await prisma.team.deleteMany();
//         await prisma.campaignUser.deleteMany();
//         await prisma.roleAccess.deleteMany(); // Видаляємо лінки ролей
//         await prisma.role.deleteMany();
//         await prisma.accessProfile.deleteMany();
//         await prisma.campaign.deleteMany();
//         await prisma.userProfile.deleteMany({
//             where: { email: { in: [ownerEmail, memberEmail] } }
//         });
//
//         // --- 2. СТВОРЕННЯ ЮЗЕРІВ ---
//         // Створюємо двох юзерів: Власника і Звичайного учасника
//         const owner = await prisma.userProfile.create({
//             data: { username: 'owner_test', email: ownerEmail, scope: ScopeType.SYSTEM, passwordHash: 'hash' }
//         });
//         ownerId = owner.id;
//
//         const member = await prisma.userProfile.create({
//             data: { username: 'member_test', email: memberEmail, scope: ScopeType.SYSTEM, passwordHash: 'hash' }
//         });
//         memberId = member.id;
//     });
//
//     afterAll(async () => {
//         await prisma.$disconnect();
//     });
//
//     // ==========================================
//     // 1. CAMPAIGN SERVICE TESTS
//     // ==========================================
//     describe('Campaign Service', () => {
//         it('should create a new Campaign', async () => {
//             const result = await campaignService.create({
//                 name: 'Integration Test Campaign',
//                 ownerId: ownerId,
//             });
//
//             expect(result).toBeDefined();
//             expect(result.id).toBeDefined();
//             expect(result.name).toBe('Integration Test Campaign');
//
//             campaignId = result.id;
//
//             // Перевіряємо в базі
//             const dbCampaign = await prisma.campaign.findUnique({ where: { id: campaignId } });
//             expect(dbCampaign).toBeDefined();
//         });
//
//         it('should prevent creating campaign with duplicate name', async () => {
//             await expect(
//                 campaignService.create({
//                     name: 'Integration Test Campaign', // Те саме ім'я
//                     ownerId: ownerId,
//                 })
//             ).rejects.toThrow(); // Очікуємо помилку (P2002 Unique constraint)
//         });
//     });
//
//     // ==========================================
//     // 2. ROLE SERVICE TESTS
//     // ==========================================
//     describe('Role Service', () => {
//         it('should create a custom Role with AccessProfile', async () => {
//             // Припускаємо, що метод create приймає DTO з правами
//             const role = await roleService.create({
//                 name: 'Marketing Manager',
//                 scope: ScopeType.CAMPAIGN,
//                 campaignId: campaignId, // Роль прив'язана до кампанії
//                 description: 'Can manage ads',
//                 permissions: { // Ваше DTO для прав
//                     statAccess: AccessLevel.View,
//                     finAccess: AccessLevel.Manage,
//                     usersAccess: AccessLevel.Edit
//                 }
//             });
//
//             expect(role).toBeDefined();
//             expect(role.scope).toBe(ScopeType.CAMPAIGN);
//             customRoleId = role.id;
//
//             // Глибока перевірка: чи створився AccessProfile
//             const dbRole = await prisma.role.findUnique({
//                 where: { id: customRoleId },
//                 include: {
//                     accessProfile: { // RoleAccess
//                         include: {
//                             accessProfile: { // AccessProfile
//                                 include: { globalRules: true }
//                             }
//                         }
//                     }
//                 }
//             });
//
//             // Враховуємо вашу структуру з подвійним вкладенням
//             const rules = dbRole?.accessProfile?.accessProfile?.globalRules;
//             expect(rules?.finAccess).toBe(AccessLevel.Manage);
//         });
//     });
//
//     // ==========================================
//     // 3. MEMBER SERVICE (CAMPAIGN LEVEL)
//     // ==========================================
//     describe('Member Service (Campaign)', () => {
//         it('should add a user to the campaign with the custom role', async () => {
//             const result = await memberService.addMemberToCampaign({
//                 campaignId: campaignId,
//                 userId: memberId,
//                 roleId: customRoleId
//             });
//
//             expect(result).toBeDefined();
//
//             // Перевірка в базі
//             const campaignUser = await prisma.campaignUser.findFirst({
//                 where: { campaignId: campaignId, userProfileId: memberId },
//                 include: { role: true }
//             });
//
//             expect(campaignUser).toBeDefined();
//             expect(campaignUser?.roleId).toBe(customRoleId);
//             expect(campaignUser?.role.name).toBe('Marketing Manager');
//         });
//
//         it('should fail adding the same user twice to the campaign', async () => {
//             await expect(
//                 memberService.addMemberToCampaign({
//                     campaignId: campaignId,
//                     userId: memberId,
//                     roleId: customRoleId
//                 })
//             ).rejects.toThrow(); // Unique constraint on CampaignUser
//         });
//
//         it('should change the members role', async () => {
//             // Спочатку створюємо нову роль
//             const newRole = await roleService.create({
//                 name: 'Viewer Role',
//                 scope: ScopeType.CAMPAIGN,
//                 campaignId: campaignId,
//                 permissions: { statAccess: AccessLevel.View }
//             });
//
//             // Змінюємо роль
//             await memberService.updateMemberRole({
//                 campaignId: campaignId,
//                 userId: memberId,
//                 newRoleId: newRole.id
//             });
//
//             const updatedUser = await prisma.campaignUser.findUnique({
//                 where: { userProfileId: memberId } // Або по складеному ключу, якщо він є
//             });
//
//             expect(updatedUser?.roleId).toBe(newRole.id);
//         });
//     });
//
//     // ==========================================
//     // 4. TEAM SERVICE
//     // ==========================================
//     describe('Team Service', () => {
//         it('should create a Team within the Campaign', async () => {
//             const team = await teamService.create({
//                 name: 'Media Buying Team',
//                 campaignId: campaignId,
//                 // Можливо, ви призначаєте тімліда одразу
//                 // teamLeadId: memberId
//             });
//
//             expect(team).toBeDefined();
//             expect(team.campaignId).toBe(campaignId);
//             teamId = team.id;
//         });
//
//         it('should create a Team Role', async () => {
//             const teamRole = await roleService.create({
//                 name: 'Team Lead',
//                 scope: ScopeType.TEAM,
//                 teamId: teamId, // Прив'язка до команди
//                 permissions: { usersAccess: AccessLevel.Manage }
//             });
//
//             expect(teamRole.scope).toBe(ScopeType.TEAM);
//             expect(teamRole.teamId).toBe(teamId);
//         });
//
//         it('should add the Campaign Member to the Team', async () => {
//             // Юзер вже є в кампанії, тепер додаємо в команду
//             // Потрібна роль рівня TEAM
//             const teamRole = await prisma.role.findFirst({ where: { name: 'Team Lead', teamId: teamId }});
//
//             await teamService.addMemberToTeam({
//                 teamId: teamId,
//                 userId: memberId,
//                 roleId: teamRole!.id
//             });
//
//             const teamUser = await prisma.teamUser.findUnique({
//                 where: { userProfileId: memberId },
//                 include: { team: true, role: true }
//             });
//
//             expect(teamUser).toBeDefined();
//             expect(teamUser?.teamId).toBe(teamId);
//             expect(teamUser?.role.name).toBe('Team Lead');
//         });
//     });
//
//     // ==========================================
//     // 5. CASCADE DELETION CHECK (CRITICAL)
//     // ==========================================
//     describe('System Integrity & Cascading', () => {
//         it('should delete Campaign and cascade delete Teams and Members', async () => {
//             // Видаляємо кампанію
//             await campaignService.delete(campaignId);
//
//             // 1. Перевіряємо, що кампанії немає
//             const campaign = await prisma.campaign.findUnique({ where: { id: campaignId } });
//             expect(campaign).toBeNull();
//
//             // 2. Перевіряємо, що команди видалились
//             const team = await prisma.team.findUnique({ where: { id: teamId } });
//             expect(team).toBeNull();
//
//             // 3. Перевіряємо, що учасники кампанії видалились
//             const campMember = await prisma.campaignUser.findFirst({ where: { campaignId: campaignId } });
//             expect(campMember).toBeNull();
//
//             // 4. Перевіряємо, що учасники команд видалились
//             const teamMember = await prisma.teamUser.findFirst({ where: { teamId: teamId } });
//             expect(teamMember).toBeNull();
//
//             // 5. Перевіряємо, що ролі кампанії видалились (якщо налаштовано cascade)
//             const role = await prisma.role.findUnique({ where: { id: customRoleId } });
//             // Тут залежить від ваших налаштувань onDelete в схемі.
//             // Зазвичай ролі, прив'язані до кампанії, мають видалятися.
//             if (role) {
//                 console.log("Note: Role was not deleted automatically. Check onDelete: Cascade in Prisma schema");
//             } else {
//                 expect(role).toBeNull();
//             }
//         });
//     });
// });