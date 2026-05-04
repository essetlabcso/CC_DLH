"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type OrganizationFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  error?: string;
  mode: "create" | "edit";
  initialData?: {
    id?: string;
    name: string;
    slug: string;
    organizationType: string;
    geographicFocus: string;
    description: string;
    contactEmail: string;
    website: string;
    phone: string;
    status: string;
    isSystem: boolean;
  };
  lookups: {
    types: { valueKey: string; displayLabel: string }[];
    focusAreas: { valueKey: string; displayLabel: string }[];
  };
};

export function OrganizationForm({
  action,
  error,
  mode,
  initialData,
  lookups,
}: OrganizationFormProps) {
  const isEdit = mode === "edit";
  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [isAutoSlug, setIsAutoSlug] = useState(!isEdit);

  useEffect(() => {
    if (isAutoSlug && !isEdit) {
      setSlug(normalizeSlug(name));
    }
  }, [name, isAutoSlug, isEdit]);

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(normalizeSlug(e.target.value));
    setIsAutoSlug(false);
  };

  const isSlugLocked = isEdit && initialData?.isSystem;

  return (
    <form action={action} className="setup-form admin-draft-form">
      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}

      <fieldset>
        <legend>Identity & Classification</legend>
        <label>
          <span>Organization Name</span>
          <input
            name="name"
            placeholder="Grassroots Empowerment"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label>
          <span>Organization Slug</span>
          <input
            name="slug"
            placeholder="grassroots-empowerment"
            required
            value={slug}
            onChange={handleSlugChange}
            readOnly={isSlugLocked}
            className={isSlugLocked ? "read-only-input" : ""}
          />
          <p className="form-help">
            Used in URLs. {isSlugLocked ? "System organizations cannot change their slug." : "Must be unique, lowercase, and hyphenated."}
          </p>
        </label>

        <div className="form-grid">
          <label>
            <span>Organization Type</span>
            <select
              defaultValue={initialData?.organizationType || ""}
              name="organizationType"
              required
            >
              <option value="">Choose a type</option>
              {lookups.types.map((t) => (
                <option key={t.valueKey} value={t.valueKey}>
                  {t.displayLabel}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Geographic Focus</span>
            <select
              defaultValue={initialData?.geographicFocus || ""}
              name="geographicFocus"
              required
            >
              <option value="">Choose a region</option>
              {lookups.focusAreas.map((f) => (
                <option key={f.valueKey} value={f.valueKey}>
                  {f.displayLabel}
                </option>
              ))}
            </select>
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend>Description & Contact</legend>
        <label>
          <span>Description</span>
          <textarea
            defaultValue={initialData?.description || ""}
            name="description"
            placeholder="A brief overview of the organization's mission and scope."
          />
        </label>

        <div className="form-grid">
          <label>
            <span>Contact Email</span>
            <input
              defaultValue={initialData?.contactEmail || ""}
              name="contactEmail"
              placeholder="contact@org.et"
              type="email"
            />
          </label>

          <label>
            <span>Website</span>
            <input
              defaultValue={initialData?.website || ""}
              name="website"
              placeholder="https://www.org.et"
              type="url"
            />
          </label>
        </div>

        <label>
          <span>Phone Number</span>
          <input
            defaultValue={initialData?.phone || ""}
            name="phone"
            placeholder="+251 9xx xxx xxx"
            type="tel"
          />
        </label>
      </fieldset>

      <fieldset>
        <legend>Status</legend>
        <label>
          <span>Current Status</span>
          <select
            defaultValue={initialData?.status || "ACTIVE"}
            name="status"
            required
            disabled={initialData?.isSystem}
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
          {initialData?.isSystem ? (
            <input type="hidden" name="status" value="ACTIVE" />
          ) : null}
          <p className="form-help">
            {initialData?.isSystem 
              ? "System organizations must remain ACTIVE." 
              : "INACTIVE organizations cannot be selected for new diagnosis records."}
          </p>
        </label>
      </fieldset>

      <fieldset>
        <legend>Admin Reason</legend>
        <label>
          <span>{isEdit ? "Reason for update" : "Creation note"}</span>
          <textarea
            name="changeReason"
            placeholder={
              isEdit
                ? "Explain why these changes are being made (e.g., Updated contact person)."
                : "Optional note for the administrative audit trail."
            }
            required={isEdit}
          />
        </label>
      </fieldset>

      <div className="form-actions">
        <button className="workspace-link" type="submit">
          {isEdit ? "Save Changes" : "Create Organization"}
        </button>
        <Link 
          className="workspace-link secondary" 
          href={isEdit ? `/admin/organizations/${initialData?.id}` : "/admin/organizations"}
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
