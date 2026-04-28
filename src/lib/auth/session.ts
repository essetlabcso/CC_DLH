import { isDecRole, type DecRole } from "@/lib/access";

export const SESSION_COOKIE_FALLBACK = "dec_session";
export const SESSION_TTL_MS = 1000 * 60 * 60 * 8;

export type DecSession = {
  userId: string;
  organizationId: string;
  email: string;
  name: string;
  role: DecRole;
  issuedAt: number;
  expiresAt: number;
};

export type SessionInput = Pick<
  DecSession,
  "userId" | "organizationId" | "email" | "name" | "role"
>;

export function getSessionCookieName(env: NodeJS.ProcessEnv = process.env) {
  return env.DEC_SESSION_COOKIE || SESSION_COOKIE_FALLBACK;
}

export function getSessionSecret(env: NodeJS.ProcessEnv = process.env) {
  if (env.AUTH_SECRET) {
    return env.AUTH_SECRET;
  }

  if (env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET is required in production.");
  }

  return "dec-learning-hub-local-session-secret";
}

export function createSession(input: SessionInput, now = Date.now()): DecSession {
  return {
    ...input,
    issuedAt: now,
    expiresAt: now + SESSION_TTL_MS,
  };
}

export async function createSessionToken(
  session: DecSession,
  secret = getSessionSecret(),
) {
  const payload = base64UrlEncode(JSON.stringify(session));
  const signature = await signPayload(payload, secret);

  return `${payload}.${signature}`;
}

export async function parseSessionToken(
  token: string | undefined,
  secret = getSessionSecret(),
  now = Date.now(),
) {
  if (!token) {
    return null;
  }

  const [payload, signature, extra] = token.split(".");

  if (!payload || !signature || extra !== undefined) {
    return null;
  }

  const expectedSignature = await signPayload(payload, secret);

  if (!timingSafeEqual(signature, expectedSignature)) {
    return null;
  }

  try {
    const parsed = JSON.parse(base64UrlDecode(payload)) as Partial<DecSession>;

    if (!isValidSession(parsed) || parsed.expiresAt <= now) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

async function signPayload(payload: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload),
  );

  return base64UrlEncode(new Uint8Array(signature));
}

function isValidSession(value: Partial<DecSession>): value is DecSession {
  return (
    typeof value.userId === "string" &&
    typeof value.organizationId === "string" &&
    typeof value.email === "string" &&
    typeof value.name === "string" &&
    isDecRole(value.role) &&
    typeof value.issuedAt === "number" &&
    typeof value.expiresAt === "number"
  );
}

function base64UrlEncode(value: string | Uint8Array) {
  const bytes =
    typeof value === "string" ? new TextEncoder().encode(value) : value;
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function base64UrlDecode(value: string) {
  const normalized = value.replaceAll("-", "+").replaceAll("_", "/");
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    "=",
  );
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

  return new TextDecoder().decode(bytes);
}

function timingSafeEqual(left: string, right: string) {
  if (left.length !== right.length) {
    return false;
  }

  let diff = 0;

  for (let index = 0; index < left.length; index += 1) {
    diff |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return diff === 0;
}
