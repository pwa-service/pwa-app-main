export enum ScopeType {
    SYSTEM = 'SYSTEM',
    CAMPAIGN = 'CAMPAIGN',
    TEAM = 'TEAM',
}

export const SCOPE_PRIORITY: Record<string, number> = {
    [ScopeType.SYSTEM]: 30,
    [ScopeType.CAMPAIGN]: 20,
    [ScopeType.TEAM]: 10,
};