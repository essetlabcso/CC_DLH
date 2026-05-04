export type OrganizationFormResult =
  | {
      ok: true;
      data: {
        name: string;
        slug: string;
        organizationType: string;
        geographicFocus: string;
        description: string;
        contactEmail: string;
        website: string;
        phone: string;
        status: string;
      };
      reason: string;
    }
  | {
      ok: false;
      message: string;
    };

export function parseOrganizationForm(
  formData: FormData,
  { requireUpdateReason = false }: { requireUpdateReason?: boolean } = {},
): OrganizationFormResult {
  const name = readString(formData, "name");
  const slug = normalizeSlug(readString(formData, "slug") || name);
  const organizationType = readString(formData, "organizationType");
  const geographicFocus = readString(formData, "geographicFocus");
  const description = readString(formData, "description");
  const contactEmail = readString(formData, "contactEmail");
  const website = readString(formData, "website");
  const phone = readString(formData, "phone");
  const status = readString(formData, "status") || "ACTIVE";
  const reason = readString(formData, "changeReason");

  if (!name) {
    return { ok: false, message: "Organization name is required." };
  }

  if (!slug) {
    return { ok: false, message: "Organization slug is required." };
  }

  if (!organizationType) {
    return { ok: false, message: "Choose an organization type." };
  }

  if (!geographicFocus) {
    return { ok: false, message: "Choose a geographic focus area." };
  }

  if (requireUpdateReason && !reason) {
    return { ok: false, message: "Enter a reason for this update." };
  }

  if (contactEmail && !isValidEmail(contactEmail)) {
    return { ok: false, message: "Enter a valid contact email address." };
  }

  if (website && !isValidUrl(website)) {
    return { ok: false, message: "Enter a valid website URL." };
  }

  if (!["ACTIVE", "INACTIVE"].includes(status)) {
    return { ok: false, message: "Choose a valid status (ACTIVE or INACTIVE)." };
  }

  return {
    ok: true,
    data: {
      name,
      slug,
      organizationType,
      geographicFocus,
      description,
      contactEmail,
      website,
      phone,
      status,
    },
    reason,
  };
}

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function normalizeSlug(value: string) {
  return value
    .toLowerCase()
    .replaceAll("&", "and")
    .replaceAll("/", " ")
    .replaceAll("+", " plus ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidUrl(url: string) {
  try {
    // If it doesn't start with http/https, try adding it
    const target = url.match(/^https?:\/\//) ? url : `https://${url}`;
    const parsed = new URL(target);
    // Ensure it has a TLD-like dot in the hostname if it's not localhost
    return parsed.hostname === "localhost" || parsed.hostname.includes(".");
  } catch {
    return false;
  }
}
