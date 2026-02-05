export enum ResourceType {
    STAT = 'stat',
    FIN = 'fin',
    LOG = 'log',
    USERS = 'users',
    SHARING = 'sharing',
}

export enum ActionType {
    READ = 'READ',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',
    CREATE = 'MANAGE'
}

export enum ShareType {
    ROLE = 'ROLE',
    USER = 'USER',
}

export const AccessLevelWeight: Record<string, number> = {
    'None': 0,
    'View': 1,
    'Edit': 2,
    'Manage': 3,
};

export enum AccessLevel {
    None = 'None',
    View = 'View',
    Edit = 'Edit',
    Manage = 'Manage'
}
