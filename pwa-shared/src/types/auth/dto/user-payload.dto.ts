import {ScopeType} from "../../org/roles/enums/scope.enum";
import {AccessLevel} from "../../../../../pwa-prisma/src";

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