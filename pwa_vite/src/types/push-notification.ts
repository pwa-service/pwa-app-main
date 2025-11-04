export type PushPermissionResult = {
  token?: string;
  error?: string;
};

export interface PushNotificationState {
  loading: boolean;
  token: string | null;
  error: string | null;
}
