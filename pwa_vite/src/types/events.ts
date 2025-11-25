export interface EventBaseBodyData {
  pwaDomain: string;
  landingUrl: string;
  queryStringRaw: string;
}

export interface PostFirstOpenBodyData extends EventBaseBodyData {
  sessionId: string;
}
