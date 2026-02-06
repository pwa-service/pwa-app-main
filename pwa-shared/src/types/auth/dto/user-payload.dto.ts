import {ScopeType} from "../../org/roles/enums/scope.enum";
import {AccessLevel} from ".prisma/client";

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