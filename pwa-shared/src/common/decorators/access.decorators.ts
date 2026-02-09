import { SetMetadata, CustomDecorator } from '@nestjs/common';
import { WorkingObjectType } from '../../types/org/sharing/enums/workin-object.enum';
import { ActionType, ResourceType, AccessLevel } from '../../types/org/sharing/enums/access.enum';

export const GLOBAL_ACCESS_KEY = 'global_access';
export const WO_ACCESS_KEY = 'wo_access';

export const RequireGlobalAccess = (resource: ResourceType, level: AccessLevel = AccessLevel.View): CustomDecorator =>
    SetMetadata(GLOBAL_ACCESS_KEY, { resource, level });

export const RequireObjectAccess = (
    entityType: WorkingObjectType | null,
    action: ActionType,
    idField: string = 'id'
): CustomDecorator =>
    SetMetadata(WO_ACCESS_KEY, { entityType, action, idField });


export const CanRead = (entityType: WorkingObjectType | null, idField: string = 'id') =>
    RequireObjectAccess(entityType, ActionType.READ, idField);

export const CanUpdate = (entityType: WorkingObjectType | null, idField: string = 'id') =>
    RequireObjectAccess(entityType, ActionType.UPDATE, idField);

export const CanDelete = (entityType: WorkingObjectType | null, idField: string = 'id') =>
    RequireObjectAccess(entityType, ActionType.DELETE, idField);

export const CanCreate = (entityType: WorkingObjectType | null, idField: string = 'id') =>
    RequireObjectAccess(entityType, ActionType.CREATE, idField);