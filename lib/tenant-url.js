const RESERVED_ROOT_SEGMENTS = new Set([
  "admin",
  "api",
  "login",
  "register",
  "go",
  "receipt",
  "invoice",
  "_next",
  "favicon.ico",
  "icon",
  "categories",
  "products",
  "addons",
  "pos",
  "kds",
  "tablet",
  "users",
  "roles",
  "tables",
  "subscription",
  "subscriptions",
  "reports",
  "z-reports",
  "cashbook",
  "segments",
  "loyalty",
  "campaigns",
  "parties",
  "settings",
  "profile",
  "logs",
  "impersonation",
  "restaurants",
  "commission",
  "delivery-zones",
  "menu",
  "table-qr",
]);

function normalizePathname(pathname = "/") {
  if (!pathname) return "/";
  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

export function getHostInfo(rawHost = "") {
  const host = String(rawHost || "").trim().toLowerCase();
  const [hostname = "localhost", port = ""] = host.split(":");
  const parts = hostname.split(".").filter(Boolean);

  let rootHostname = hostname;
  let subdomain = "";

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    rootHostname = hostname;
  } else if (parts.length > 2) {
    rootHostname = parts.slice(-2).join(".");
    subdomain = parts.slice(0, -2).join(".");
  } else if (parts.length === 2 && parts[1] === "localhost") {
    rootHostname = "localhost";
    subdomain = parts[0];
  }

  const rootHost = port ? `${rootHostname}:${port}` : rootHostname;

  return {
    host: port ? `${hostname}:${port}` : hostname,
    hostname,
    port,
    rootHost,
    rootHostname,
    subdomain,
    isTenantHost: Boolean(subdomain),
  };
}

export function isReservedRootSegment(segment = "") {
  return RESERVED_ROOT_SEGMENTS.has(String(segment || "").toLowerCase());
}

export function buildRootUrl({ host, protocol = "http", pathname = "/" }) {
  const { rootHost } = getHostInfo(host);
  return `${protocol}://${rootHost}${normalizePathname(pathname)}`;
}

export function buildTenantHost(host, subdomain) {
  const { rootHostname, port } = getHostInfo(host);
  const tenantHost = `${String(subdomain || "").toLowerCase()}.${rootHostname}`;
  return port ? `${tenantHost}:${port}` : tenantHost;
}

export function buildTenantUrl({ host, protocol = "http", subdomain, pathname = "/" }) {
  return `${protocol}://${buildTenantHost(host, subdomain)}${normalizePathname(pathname)}`;
}

export function getTenantInternalPath(subdomain, pathname = "/") {
  const safeSubdomain = String(subdomain || "").trim().toLowerCase();
  const safePathname = normalizePathname(pathname);
  if (!safeSubdomain) return safePathname;
  return safePathname === "/" ? `/${safeSubdomain}` : `/${safeSubdomain}${safePathname}`;
}
