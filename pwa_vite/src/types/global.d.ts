interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];

  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;

  prompt(): Promise<void>;
}

export declare global {
  interface Navigator {
    standalone?: boolean;
  }

  interface Window {
    smartlook?: unknown;
    deferredPrompt: BeforeInstallPromptEvent | null;
  }
}
