import { createContext } from "react";
import type { usePWAInstall } from "../../hooks/usePWAInstall";

export const PWAInstallContext = createContext<ReturnType<typeof usePWAInstall> | null>(null);
