import { createHash, randomBytes } from "node:crypto";

const invitationTokenByteLength = 32;

export function generateLearnerInvitationToken() {
  return randomBytes(invitationTokenByteLength).toString("base64url");
}

export function hashLearnerInvitationToken(token: string) {
  return createHash("sha256").update(normalizeLearnerInvitationToken(token)).digest("hex");
}

export function normalizeLearnerInvitationToken(token: string) {
  return token.trim();
}

export function isUsableLearnerInvitationToken(token: string) {
  return normalizeLearnerInvitationToken(token).length > 0;
}
