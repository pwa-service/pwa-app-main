import { SetMetadata } from '@nestjs/common';
import { ScopeType } from '../../types/org/roles/enums/scope.enum';

export const CHECK_ALLOWED_SCOPES_KEY = 'check_allowed_scopes';

export const AllowedScopes = (...scopes: ScopeType[]) =>
    SetMetadata(CHECK_ALLOWED_SCOPES_KEY, scopes);