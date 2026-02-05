// import { Test, TestingModule } from '@nestjs/testing';
// import { RoleService } from './role.service';
// import { RoleRepository } from './role.repository';
// import { Permission, RolePriority, SystemRoleName } from '../../../pwa-shared/src/types/org/roles/enums/role.enums';
// import { AccessLevel } from '@prisma/client';
// import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
// import { ScopeType } from '../../../pwa-shared/src/types/org/roles/enums/scope.enum';
// import { UserPayload } from '../../../pwa-shared/src/types/auth/dto/user-payload.dto';
//
// // --- MOCKS ---
//
// const mockRole = (id: number, name: string, scope: ScopeType, contextId?: string, isSystem = false) => ({
//     id, name, priority: RolePriority.MEMBER, scope,
//     campaignId: scope === ScopeType.CAMPAIGN ? contextId : null,
//     teamId: scope === ScopeType.TEAM ? contextId : null,
//     accessProfile: {
//         accessProfile: {
//             id: `prof-${id}`,
//             name: `profile-${id}`,
//             globalRules: {
//                 statAccess: AccessLevel.View,
//                 finAccess: AccessLevel.None,
//                 logAccess: AccessLevel.None,
//                 sharingAccess: false
//             }
//         }
//     }
// });
//
// const mockUser = (scope: ScopeType, contextId?: string): UserPayload => ({
//     id: 'user-1',
//     userId: 'user-1',
//     email: 'test@test.com',
//     scope: scope as any, // Cast to string if needed by interface
//     contextId: contextId || undefined,
//     role: 'admin',
//     permissions: []
// });
//
// describe('RoleService', () => {
//     let service: RoleService;
//     let repo: jest.Mocked<RoleRepository>;
//
//     beforeEach(async () => {
//         const repoMock = {
//             findByNameAndContext: jest.fn(),
//             findById: jest.fn(),
//             create: jest.fn(),
//             update: jest.fn(),
//             delete: jest.fn(),
//             assignUserToContext: jest.fn(),
//             findAll: jest.fn(),
//         };
//
//         const module: TestingModule = await Test.createTestingModule({
//             providers: [
//                 RoleService,
//                 { provide: RoleRepository, useValue: repoMock },
//             ],
//         }).compile();
//
//         service = module.get<RoleService>(RoleService);
//         repo = module.get(RoleRepository);
//     });
//
//     it('should be defined', () => {
//         expect(service).toBeDefined();
//     });
//
//     // ==========================================
//     // 1. CREATION
//     // ==========================================
//     describe('create()', () => {
//         it('should create a CAMPAIGN role successfully', async () => {
//             repo.findByNameAndContext.mockResolvedValue(null);
//             repo.create.mockResolvedValue(mockRole(1, 'Media Buyer', ScopeType.CAMPAIGN, 'camp-1'));
//
//             const dto = {
//                 name: 'Media Buyer',
//                 description: 'Buy ads',
//                 permissions: [Permission.STAT_VIEW]
//             };
//
//             const result = await service.create(dto, ScopeType.CAMPAIGN, 'camp-1');
//
//             expect(repo.findByNameAndContext).toHaveBeenCalledWith('Media Buyer', ScopeType.CAMPAIGN, 'camp-1');
//             expect(repo.create).toHaveBeenCalledWith(
//                 expect.objectContaining({ name: 'Media Buyer', campaignId: 'camp-1' }),
//                 expect.any(String),
//                 expect.objectContaining({ statAccess: AccessLevel.View })
//             );
//             expect(result.name).toBe('Media Buyer');
//             expect(result.scope).toBe(ScopeType.CAMPAIGN);
//         });
//
//         it('should THROW ERROR if Role Name already exists in context', async () => {
//             repo.findByNameAndContext.mockResolvedValue(mockRole(1, 'Admin', ScopeType.TEAM, 'team-1'));
//
//             await expect(service.create({
//                 name: 'Admin',
//                 permissions: []
//             }, ScopeType.TEAM, 'team-1')).rejects.toThrow(BadRequestException);
//         });
//
//         it('should THROW ERROR if Context ID missing for scoped role', async () => {
//             await expect(service.create({
//                 name: 'Ghost Role',
//                 permissions: []
//             }, ScopeType.CAMPAIGN, undefined)) // No ID
//                 .rejects.toThrow(BadRequestException);
//         });
//
//         it('should THROW ERROR on invalid permission', async () => {
//             repo.findByNameAndContext.mockResolvedValue(null);
//             await expect(service.create({
//                 name: 'Hacker',
//                 permissions: ['INVALID_PERM' as any]
//             }, ScopeType.SYSTEM)).rejects.toThrow(BadRequestException);
//         });
//     });
//
//     // ==========================================
//     // 2. UPDATING
//     // ==========================================
//     describe('update()', () => {
//         it('should update role if scope matches', async () => {
//             const role = mockRole(10, 'Manager', ScopeType.CAMPAIGN, 'camp-1');
//             repo.findById.mockResolvedValue(role);
//             repo.update.mockResolvedValue({ ...role, name: 'Senior Manager' });
//
//             const result = await service.update({
//                 id: '10',
//                 name: 'Senior Manager',
//                 permissions: [Permission.FIN_MANAGE]
//             }, ScopeType.CAMPAIGN);
//
//             expect(repo.update).toHaveBeenCalledWith(
//                 10,
//                 expect.objectContaining({ name: 'Senior Manager' }),
//                 role.accessProfile.accessProfile.id,
//                 expect.objectContaining({ finAccess: AccessLevel.Manage })
//             );
//             expect(result.name).toBe('Senior Manager');
//         });
//
//         it('should THROW FORBIDDEN if trying to update role from different scope', async () => {
//             const role = mockRole(10, 'Team Lead', ScopeType.TEAM, 'team-1');
//             repo.findById.mockResolvedValue(role);
//
//             // Trying to update TEAM role with CAMPAIGN scope authority
//             await expect(service.update({
//                 id: '10',
//                 name: 'Hack',
//                 permissions: []
//             }, ScopeType.CAMPAIGN)).rejects.toThrow(ForbiddenException);
//         });
//
//         it('should THROW BAD REQUEST if trying to edit System Root Role', async () => {
//             const root = mockRole(1, SystemRoleName.PRODUCT_OWNER, ScopeType.SYSTEM, undefined);
//             repo.findById.mockResolvedValue(root);
//
//             await expect(service.update({
//                 id: '1',
//                 name: 'Hacked',
//                 permissions: []
//             }, ScopeType.SYSTEM)).rejects.toThrow(BadRequestException);
//         });
//     });
//
//     // ==========================================
//     // 3. READING (GET ONE) & SECURITY
//     // ==========================================
//     describe('findOne()', () => {
//         it('should allow Campaign Admin to see role in THEIR campaign', async () => {
//             const role = mockRole(5, 'Analyst', ScopeType.CAMPAIGN, 'camp-A');
//             repo.findById.mockResolvedValue(role);
//
//             const user = mockUser(ScopeType.CAMPAIGN, 'camp-A');
//
//             const result = await service.findOne('5', user);
//             expect(result.id).toBe('5');
//         });
//
//         it('should FORBID Campaign Admin from seeing role in ANOTHER campaign', async () => {
//             const role = mockRole(5, 'Analyst', ScopeType.CAMPAIGN, 'camp-B'); // Different ID
//             repo.findById.mockResolvedValue(role);
//
//             const user = mockUser(ScopeType.CAMPAIGN, 'camp-A');
//
//             await expect(service.findOne('5', user)).rejects.toThrow(ForbiddenException);
//         });
//
//         it('should allow System Admin to see ANY role', async () => {
//             const role = mockRole(99, 'Secret Team Role', ScopeType.TEAM, 'team-X');
//             repo.findById.mockResolvedValue(role);
//
//             const user = mockUser(ScopeType.SYSTEM); // System Scope
//
//             const result = await service.findOne('99', user);
//             expect(result.name).toBe('Secret Team Role');
//         });
//     });
//
//     // ==========================================
//     // 4. ASSIGNMENT
//     // ==========================================
//     describe('assignRoleToUser()', () => {
//         it('should assign role if scopes match', async () => {
//             const role = mockRole(2, 'Member', ScopeType.TEAM, 'team-1');
//             repo.findById.mockResolvedValue(role);
//
//             // Operator is assigning a TEAM role, so they must be in TEAM scope (or compatible logic)
//             // The service checks: if (targetRole.scope !== operatorScope) throw Forbidden
//             await service.assignRoleToUser({
//                 userId: 'user-100',
//                 roleId: 2,
//                 teamId: 'team-1' // Optional in DTO, inferred from role in Repo
//             }, ScopeType.TEAM);
//
//             expect(repo.assignUserToContext).toHaveBeenCalledWith(
//                 'user-100',
//                 2,
//                 ScopeType.TEAM,
//                 'team-1'
//             );
//         });
//
//         it('should THROW FORBIDDEN if assigning role from different scope', async () => {
//             const role = mockRole(2, 'SysAdmin', ScopeType.SYSTEM);
//             repo.findById.mockResolvedValue(role);
//
//             // Campaign Admin tries to assign System Role
//             await expect(service.assignRoleToUser({
//                 userId: 'user-100',
//                 roleId: 2
//             }, ScopeType.CAMPAIGN)).rejects.toThrow(ForbiddenException);
//         });
//     });
//
//     // ==========================================
//     // 5. DELETION
//     // ==========================================
//     describe('delete()', () => {
//         it('should delete role if allowed', async () => {
//             const role = mockRole(5, 'Old Role', ScopeType.CAMPAIGN, 'camp-1');
//             repo.findById.mockResolvedValue(role);
//
//             await service.delete('5', ScopeType.CAMPAIGN);
//             expect(repo.delete).toHaveBeenCalledWith(5);
//         });
//
//         it('should THROW ERROR if trying to delete Root Role', async () => {
//             const role = mockRole(1, SystemRoleName.PRODUCT_OWNER, ScopeType.SYSTEM);
//             repo.findById.mockResolvedValue(role);
//
//             await expect(service.delete('1', ScopeType.SYSTEM)).rejects.toThrow(BadRequestException);
//         });
//     });
// });