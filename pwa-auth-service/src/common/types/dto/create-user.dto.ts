import { ScopeType } from '../../../../../pwa-shared/src/types/org/roles/enums/scope.enum'

export class CreateUserDto {
    username: string;
    scope: ScopeType;
    email?: string;
    passwordHash: string;
    tgId?: bigint;
}