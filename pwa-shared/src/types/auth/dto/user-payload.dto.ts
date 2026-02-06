import {AccessLevel} from "../../org/sharing/enums/access.enum";
import {ScopeType} from "../../org/roles/enums/scope.enum";

export type UserPayload = {
    id: string;
    email: string;
    username: string;
    scope: ScopeType;
    contextId?: string;
    access: {
        statAccess: AccessLevel;
        finAccess: AccessLevel;
        logAccess: AccessLevel;
        usersAccess: AccessLevel;
        sharingAccess: AccessLevel;
    };
};