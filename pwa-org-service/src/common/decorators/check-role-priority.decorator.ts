import { SetMetadata } from '@nestjs/common';

export const CHECK_ROLE_PRIORITY_KEY = 'check_role_priority';

export const CheckRolePriority = (fieldName: string = 'id') =>
    SetMetadata(CHECK_ROLE_PRIORITY_KEY, fieldName);