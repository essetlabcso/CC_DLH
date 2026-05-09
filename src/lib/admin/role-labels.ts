const roleLabels: Record<string, string> = {
  admin: "Super Admin-equivalent authority",
  creator: "Course Creator",
  learner: "Learner / Participant",
  reviewer: "Course Reviewer",
};

const statusLabels: Record<string, string> = {
  active: "Active",
  disabled: "Disabled",
  invited: "Invited",
};

export function getAdminRoleLabel(value: string) {
  return roleLabels[value.toLowerCase()] ?? formatAdminLabel(value);
}

export function getAdminStatusLabel(value: string) {
  return statusLabels[value.toLowerCase()] ?? formatAdminLabel(value);
}

export function formatAdminLabel(value: string) {
  return value
    .toLowerCase()
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
