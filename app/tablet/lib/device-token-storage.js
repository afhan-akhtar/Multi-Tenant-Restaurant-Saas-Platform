/**
 * TABLET device token — Capacitor: while getPlatform() is still "web", Preferences uses
 * localStorage (CapacitorStorage.*), NOT SharedPreferences where we persist. Always wait
 * for the native bridge before Preferences.* / restore.
 */

import { Directory, Encoding, Filesystem } from "@capacitor/filesystem";
import { Preferences } from "@capacitor/preferences";

export const STORAGE_TOKEN_KEY = "tabletDeviceToken";
export const STORAGE_LAST_URL_KEY = "tabletLastLaunchUrl";

const MIN_TOKEN_LEN = 8;
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60;
const TOKEN_FILE = ".restaurant_tablet_device_token";
const SESSION_KEY = "tabletDeviceTokenSession";

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Until androidBridge / iOS bridge exists, Capacitor reports platform "web" and Preferences reads
 * the wrong backing store (empty). Poll until native layer is active or timeout.
 */
async function waitUntilCapacitorPlatformNotWeb(maxMs = 14000) {
  if (typeof window === "undefined") return;
  try {
    const cap = window.Capacitor;
    if (!cap || typeof cap.getPlatform !== "function") return;
    const deadline = Date.now() + maxMs;
    while (Date.now() < deadline && cap.getPlatform() === "web") {
      await delay(45);
    }
  } catch {
    /* ignore */
  }
}

/** True when Capacitor native runtime is active (not the "web" placeholder before bridge injection). */
function isCapacitorNativeShell() {
  if (typeof window === "undefined") return false;
  try {
    const C = window.Capacitor;
    if (!C || typeof C.getPlatform !== "function") return false;
    return C.getPlatform() !== "web";
  } catch {
    return false;
  }
}

function readFromCookie() {
  if (typeof document === "undefined") return "";
  try {
    const m = document.cookie.match(new RegExp(`(?:^|; )${STORAGE_TOKEN_KEY}=([^;]*)`));
    if (!m?.[1]) return "";
    const v = decodeURIComponent(String(m[1]).trim());
    return v.length >= MIN_TOKEN_LEN ? v : "";
  } catch {
    return "";
  }
}

function writeCookieToken(token) {
  if (typeof document === "undefined" || !token) return;
  try {
    const t = encodeURIComponent(String(token).trim());
    document.cookie = `${STORAGE_TOKEN_KEY}=${t};path=/;max-age=${COOKIE_MAX_AGE};SameSite=Lax`;
  } catch {
    /* ignore */
  }
}

function clearCookieToken() {
  if (typeof document === "undefined") return;
  try {
    document.cookie = `${STORAGE_TOKEN_KEY}=;path=/;max-age=0`;
  } catch {
    /* ignore */
  }
}

function readFromSessionStorage() {
  if (typeof window === "undefined") return "";
  try {
    const s = sessionStorage.getItem(SESSION_KEY);
    return s && String(s).trim().length >= MIN_TOKEN_LEN ? String(s).trim() : "";
  } catch {
    return "";
  }
}

function writeSessionToken(token) {
  if (typeof window === "undefined" || !token) return;
  try {
    sessionStorage.setItem(SESSION_KEY, String(token).trim());
  } catch {
    /* ignore */
  }
}

function readFromLegacyLocalStorage() {
  if (typeof window === "undefined") return "";
  try {
    const direct = localStorage.getItem(STORAGE_TOKEN_KEY);
    if (direct && String(direct).trim().length >= MIN_TOKEN_LEN) {
      return String(direct).trim();
    }
    const last = localStorage.getItem(STORAGE_LAST_URL_KEY);
    if (!last) return "";
    const u = new URL(last);
    const tok = u.searchParams.get("token");
    if (tok && String(tok).trim().length >= MIN_TOKEN_LEN) {
      return String(tok).trim();
    }
  } catch {
    /* invalid URL */
  }
  return "";
}

function hydrateWebCaches(token) {
  const t = String(token).trim();
  if (t.length < MIN_TOKEN_LEN) return;
  try {
    const href = `${window.location.origin}/tablet?token=${encodeURIComponent(t)}`;
    localStorage.setItem(STORAGE_TOKEN_KEY, t);
    localStorage.setItem(STORAGE_LAST_URL_KEY, href);
  } catch {
    /* private mode */
  }
  writeCookieToken(t);
  writeSessionToken(t);
}

async function readTokenFromDataFile() {
  try {
    const { data } = await Filesystem.readFile({
      path: TOKEN_FILE,
      directory: Directory.Data,
      encoding: Encoding.UTF8,
    });
    const t = String(data ?? "").trim();
    return t.length >= MIN_TOKEN_LEN ? t : "";
  } catch {
    return "";
  }
}

async function writeTokenToDataFile(token) {
  const t = String(token ?? "").trim();
  if (t.length < MIN_TOKEN_LEN) return;
  try {
    await Filesystem.writeFile({
      path: TOKEN_FILE,
      data: t,
      directory: Directory.Data,
      encoding: Encoding.UTF8,
    });
  } catch (e) {
    console.warn("[tablet token] Data file write failed", e);
  }
}

async function removeTokenDataFile() {
  try {
    await Filesystem.deleteFile({
      path: TOKEN_FILE,
      directory: Directory.Data,
    });
  } catch {
    /* missing file */
  }
}

async function readNativePreferencesWithRetry(maxAttempts = 20) {
  let wait = 40;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const { value } = await Preferences.get({ key: STORAGE_TOKEN_KEY });
      if (value && String(value).trim().length >= MIN_TOKEN_LEN) {
        return String(value).trim();
      }
      const urlEntry = await Preferences.get({ key: STORAGE_LAST_URL_KEY });
      if (urlEntry?.value) {
        const u = new URL(urlEntry.value);
        const tok = u.searchParams.get("token");
        if (tok && String(tok).trim().length >= MIN_TOKEN_LEN) {
          return String(tok).trim();
        }
      }
    } catch (e) {
      if (attempt === maxAttempts - 1) {
        console.warn("[tablet token] Preferences read failed after retries", e);
      }
    }
    if (attempt < maxAttempts - 1) {
      await delay(wait);
      wait = Math.min(wait + 40, 280);
    }
  }
  return "";
}

async function migrateLegacyToPreferencesIfNeeded() {
  let already = false;
  try {
    const { value: existing } = await Preferences.get({ key: STORAGE_TOKEN_KEY });
    already = Boolean(existing && String(existing).trim().length >= MIN_TOKEN_LEN);
  } catch {
    /* ignore */
  }
  if (already) return;

  const token = readFromLegacyLocalStorage() || readFromCookie() || readFromSessionStorage();
  if (!token) return;
  try {
    const href = `${window.location.origin}/tablet?token=${encodeURIComponent(token)}`;
    await Preferences.set({ key: STORAGE_TOKEN_KEY, value: token });
    await Preferences.set({ key: STORAGE_LAST_URL_KEY, value: href });
  } catch {
    /* ignore */
  }
}

/**
 * Full read: sync caches → Preferences (retry) → Data file → prefs again.
 * Does NOT use isNativePlatform() — plugins no-op or use web impl in browser.
 */
export async function getStoredTabletToken() {
  if (typeof window === "undefined") return "";

  await waitUntilCapacitorPlatformNotWeb(10000);

  const session = readFromSessionStorage();
  if (session) {
    hydrateWebCaches(session);
    return session;
  }

  // Native app: WebView localStorage/cookies are often cleared on cold start; SharedPreferences + Data survive.
  if (isCapacitorNativeShell()) {
    const fromNative = await readNativePreferencesWithRetry(28);
    if (fromNative) {
      hydrateWebCaches(fromNative);
      await writeTokenToDataFile(fromNative);
      return fromNative;
    }
    const fromFileEarly = await readTokenFromDataFile();
    if (fromFileEarly) {
      hydrateWebCaches(fromFileEarly);
      try {
        await Preferences.set({ key: STORAGE_TOKEN_KEY, value: fromFileEarly });
        await Preferences.set({
          key: STORAGE_LAST_URL_KEY,
          value: `${window.location.origin}/tablet?token=${encodeURIComponent(fromFileEarly)}`,
        });
      } catch {
        /* ignore */
      }
      return fromFileEarly;
    }
  }

  const legacy = readFromLegacyLocalStorage();
  if (legacy) return legacy;

  const fromCookie = readFromCookie();
  if (fromCookie) {
    hydrateWebCaches(fromCookie);
    return fromCookie;
  }

  const fromNative = await readNativePreferencesWithRetry();
  if (fromNative) {
    hydrateWebCaches(fromNative);
    await writeTokenToDataFile(fromNative);
    return fromNative;
  }

  const fromFile = await readTokenFromDataFile();
  if (fromFile) {
    hydrateWebCaches(fromFile);
    try {
      await Preferences.set({ key: STORAGE_TOKEN_KEY, value: fromFile });
      await Preferences.set({
        key: STORAGE_LAST_URL_KEY,
        value: `${window.location.origin}/tablet?token=${encodeURIComponent(fromFile)}`,
      });
    } catch {
      /* ignore */
    }
    return fromFile;
  }

  await migrateLegacyToPreferencesIfNeeded();

  const again = await readNativePreferencesWithRetry(12);
  if (again) {
    hydrateWebCaches(again);
    await writeTokenToDataFile(again);
    return again;
  }

  return readFromLegacyLocalStorage() || readFromCookie() || readFromSessionStorage();
}

async function tryReadTokenQuick() {
  try {
    const session = readFromSessionStorage();
    if (session) return session;

    const nativeShell = isCapacitorNativeShell();
    if (nativeShell) {
      const fromNative = await readNativePreferencesWithRetry(8);
      if (fromNative) return fromNative;
      const fromFile = await readTokenFromDataFile();
      if (fromFile) return fromFile;
    }

    const ls = readFromLegacyLocalStorage();
    if (ls) return ls;
    const ck = readFromCookie();
    if (ck) return ck;

    try {
      const { value } = await Preferences.get({ key: STORAGE_TOKEN_KEY });
      if (value && String(value).trim().length >= MIN_TOKEN_LEN) {
        return String(value).trim();
      }
    } catch {
      /* bridge warming */
    }
    return await readTokenFromDataFile();
  } catch {
    return "";
  }
}

async function syncAllLayersFromToken(token) {
  const t = String(token).trim();
  if (t.length < MIN_TOKEN_LEN) return;
  hydrateWebCaches(t);
  try {
    await writeTokenToDataFile(t);
  } catch {
    /* ignore */
  }
  try {
    await Preferences.set({ key: STORAGE_TOKEN_KEY, value: t });
    await Preferences.set({
      key: STORAGE_LAST_URL_KEY,
      value: `${window.location.origin}/tablet?token=${encodeURIComponent(t)}`,
    });
  } catch {
    /* ignore */
  }
}

/**
 * Gate screens: short delay for Capacitor bridge, then poll, then full getStoredTabletToken.
 */
export async function waitForStoredTabletTokenForGate(maxWaitMs = 28000) {
  if (typeof window === "undefined") return "";

  // Critical: do not call Preferences.* while platform is still "web" (wrong storage).
  await waitUntilCapacitorPlatformNotWeb(Math.min(14000, Math.max(4000, maxWaitMs - 4000)));

  await delay(isCapacitorNativeShell() ? 200 : 120);

  const deadline = Date.now() + maxWaitMs;
  let interval = 100;
  let iteration = 0;
  while (Date.now() < deadline) {
    const quick = await tryReadTokenQuick();
    if (quick) {
      await syncAllLayersFromToken(quick);
      return quick;
    }
    iteration += 1;
    // Full read path (retries Preferences + file + migrate) every few polls — catches slow bridge.
    if (iteration % 5 === 0) {
      const full = await getStoredTabletToken();
      if (full) {
        await syncAllLayersFromToken(full);
        return full;
      }
    }
    await delay(interval);
    interval = Math.min(interval + 50, 500);
  }
  const last = await getStoredTabletToken();
  if (last) await syncAllLayersFromToken(last);
  return last;
}

/**
 * /tablet without ?token=: full gate wait, then extra reads for cold start / slow native storage.
 */
export async function restoreTabletTokenWithGracePasses() {
  if (typeof window === "undefined") return "";
  let t = await waitForStoredTabletTokenForGate();
  if (t) return t;
  await delay(1200);
  t = await getStoredTabletToken();
  if (t) return t;
  await delay(2800);
  return getStoredTabletToken();
}

export async function persistTabletLaunch(token) {
  if (typeof window === "undefined" || !token) return;
  const t = String(token).trim();
  if (t.length < MIN_TOKEN_LEN) return;

  const href = `${window.location.origin}/tablet?token=${encodeURIComponent(t)}`;

  if (window.Capacitor) {
    await waitUntilCapacitorPlatformNotWeb(12000);
  }

  // Write durable native storage first so a force-stop right after cannot leave only WebView caches (often wiped on cold start).
  try {
    await writeTokenToDataFile(t);
  } catch {
    /* ignore */
  }

  try {
    await Preferences.set({ key: STORAGE_TOKEN_KEY, value: t });
    await Preferences.set({ key: STORAGE_LAST_URL_KEY, value: href });
    await delay(120);
    const { value } = await Preferences.get({ key: STORAGE_TOKEN_KEY });
    if (!value || String(value).trim() !== t) {
      await Preferences.set({ key: STORAGE_TOKEN_KEY, value: t });
      await Preferences.set({ key: STORAGE_LAST_URL_KEY, value: href });
    }
  } catch (e) {
    console.warn("[tablet token] Preferences.set failed", e);
  }

  try {
    localStorage.setItem(STORAGE_TOKEN_KEY, t);
    localStorage.setItem(STORAGE_LAST_URL_KEY, href);
  } catch {
    /* private mode */
  }
  writeCookieToken(t);
  writeSessionToken(t);

  try {
    if (typeof navigator !== "undefined" && navigator.storage?.persist) {
      await navigator.storage.persist();
    }
  } catch {
    /* ignore */
  }
}

export function readStoredTabletToken() {
  return readFromLegacyLocalStorage() || readFromCookie() || readFromSessionStorage();
}

export async function clearStoredTabletToken() {
  if (typeof window !== "undefined" && window.Capacitor) {
    await waitUntilCapacitorPlatformNotWeb(8000);
  }
  clearCookieToken();
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
  await removeTokenDataFile();
  try {
    await Preferences.remove({ key: STORAGE_TOKEN_KEY });
    await Preferences.remove({ key: STORAGE_LAST_URL_KEY });
  } catch (e) {
    console.warn("[tablet token] Preferences.remove failed", e);
  }
  try {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    localStorage.removeItem(STORAGE_LAST_URL_KEY);
  } catch {
    /* ignore */
  }
}

export async function getStoredTabletLaunchUrl() {
  if (typeof window === "undefined") return "";
  try {
    const { value } = await Preferences.get({ key: STORAGE_LAST_URL_KEY });
    if (value) return value;
  } catch {
    /* ignore */
  }
  try {
    return localStorage.getItem(STORAGE_LAST_URL_KEY) || "";
  } catch {
    return "";
  }
}

export async function persistTabletLaunchUrl(href) {
  if (typeof window === "undefined" || !href) return;
  try {
    const u = new URL(href);
    const tok = u.searchParams.get("token");
    if (tok && String(tok).trim().length >= MIN_TOKEN_LEN) {
      await persistTabletLaunch(tok);
      return;
    }
    try {
      localStorage.setItem(STORAGE_LAST_URL_KEY, href);
    } catch {
      /* ignore */
    }
    try {
      await Preferences.set({ key: STORAGE_LAST_URL_KEY, value: href });
    } catch {
      /* ignore */
    }
  } catch {
    /* ignore */
  }
}
