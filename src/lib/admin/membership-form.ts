import { MembershipStatus, UserRole } from "@prisma/client";

export type AddMemberResult =
  | {
      ok: true;
      data: {
        email: string;
        reason: string;
      };
    }
  | {
      ok: false;
      message: string;
    };

export type UpdateMembershipResult =
  | {
      ok: true;
      data: {
        roles: UserRole[];
        status: MembershipStatus;
        reason: string;
      };
    }
  | {
      ok: false;
      message: string;
    };

export function parseAddMemberForm(formData: FormData): AddMemberResult {
  const email = readString(formData, "email");
  const reason = readString(formData, "reason");

  if (!email || !isValidEmail(email)) {
    return { ok: false, message: "Please enter a valid email address." };
  }

  if (reason.length < 5) {
    return { ok: false, message: "Please provide a reason (at least 5 characters)." };
  }

  return { ok: true, data: { email, reason } };
}

export function parseUpdateMembershipForm(formData: FormData): UpdateMembershipResult {
  const roles = formData.getAll("roles") as string[];
  const status = readString(formData, "status") as MembershipStatus;
  const reason = readString(formData, "reason");

  if (roles.length === 0) {
    return { ok: false, message: "At least one role must be assigned." };
  }

  const validRoles = roles.every((r) => Object.values(UserRole).includes(r as UserRole));
  if (!validRoles) {
    return { ok: false, message: "Invalid role selected." };
  }

  if (!Object.values(MembershipStatus).includes(status)) {
    return { ok: false, message: "Invalid membership status." };
  }

  if (reason.length < 5) {
    return { ok: false, message: "Please provide a reason (at least 5 characters)." };
  }

  return {
    ok: true,
    data: {
      roles: roles as UserRole[],
      status,
      reason,
    },
  };
}

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
