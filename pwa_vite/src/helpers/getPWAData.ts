/* eslint-disable @typescript-eslint/no-explicit-any */
import dataRaw from "../pwa-data.json";
import type { PwaAppData } from "../types/app";

const data = dataRaw as PwaAppData;

export function getPWAData<K extends keyof PwaAppData>(
  key?: K
): K extends keyof PwaAppData ? PwaAppData[K] : PwaAppData {
  if (!key) return data as any;

  return data[key] as any;
}
