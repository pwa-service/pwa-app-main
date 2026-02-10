export enum SystemRoleName {
    PRODUCT_OWNER = 'Product Owner',
    PRODUCT_TECH = 'Техничка Продукта',
    PRODUCT_FIN = 'Фин Продукта',
    CAMPAIGN_OWNER = 'Владелец Кампании',
    CAMPAIGN_TECH = 'Тех Кампании',
    CAMPAIGN_FIN = 'Фин Кампании',
    TEAM_LEAD = 'Тимлид',
    MEDIA_BUYER = 'Медиабаер',
    BUYER_ASSISTANT = 'Помощник Баера',
}

export enum RolePriority {
    ROOT = 1,
    ADMIN = 10,
    OWNER = 20,
    MAINTAINER = 30,
    LEAD = 40,
    MEMBER = 50,
    GUEST = 100,
}

export enum Permission {
    STAT_VIEW = 'STAT_VIEW',
    STAT_MANAGE = 'STAT_MANAGE',

    FIN_VIEW = 'FIN_VIEW',
    FIN_MANAGE = 'FIN_MANAGE',

    LOG_VIEW = 'LOG_VIEW',
    LOG_MANAGE = 'LOG_MANAGE',

    USERS_VIEW = 'USERS_VIEW',
    USERS_MANAGE = 'USERS_MANAGE',

    SHARE_ACCESS = 'SHARE_ACCESS',
}