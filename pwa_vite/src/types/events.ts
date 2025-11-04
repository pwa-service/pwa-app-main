export interface EventBaseBodyData {
  pwaDomain: string;
  landingUrl: string;
  queryStringRaw: string;
}

export interface PostInstallLinkBodyData extends EventBaseBodyData {
  sessionId: string;
}

export interface PostFirstOpenBodyData extends EventBaseBodyData {
  sessionId: string;
}

export interface PostLeadBodyData extends EventBaseBodyData {
  sessionId: string;
}

export interface PostCompleteRegistartionBodyData extends EventBaseBodyData {
  sessionId: string;
}

export interface PostPurchaseBodyData extends EventBaseBodyData {
  sessionId: string;

  value: number;
  currency: string;
}

export interface PostSubscribeBodyData extends EventBaseBodyData {
  sessionId: string;
  value: number;
  currency: string;
}

export interface PostViewContentResponseData {
  sessionId: string;
}

export interface PostInstallLinkResponseData {
  finalUrl: string;
}

// export interface PostFirstOpenResponseData {}

// export interface PostLeadResponseData {}

// export interface PostCompleteRegistartionResponseData {}

// export interface PostPurchaseResponseData {}

// export interface PostSubscribeResponseData {}
