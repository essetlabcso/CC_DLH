import { describe, expect, it } from "vitest";
import { parseOrganizationForm } from "./organization-form";

describe("organization form parsing", () => {
  const getValidFormData = () => {
    const formData = new FormData();
    formData.set("name", "Test Organization");
    formData.set("slug", "test-organization");
    formData.set("organizationType", "intl_ngo");
    formData.set("geographicFocus", "addis_ababa");
    return formData;
  };

  it("normalizes slug correctly", () => {
    const formData = getValidFormData();
    formData.set("slug", "Test & Org");
    
    const result = parseOrganizationForm(formData);
    
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.slug).toBe("test-and-org");
    }
  });

  it("blocks submission if name is missing", () => {
    const formData = getValidFormData();
    formData.delete("name");
    
    const result = parseOrganizationForm(formData);
    
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toBe("Organization name is required.");
    }
  });

  it("blocks submission if organization type is missing", () => {
    const formData = getValidFormData();
    formData.delete("organizationType");
    
    const result = parseOrganizationForm(formData);
    
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toBe("Choose an organization type.");
    }
  });

  it("blocks submission if geographic focus is missing", () => {
    const formData = getValidFormData();
    formData.delete("geographicFocus");
    
    const result = parseOrganizationForm(formData);
    
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toBe("Choose a geographic focus area.");
    }
  });

  it("blocks submission if email is invalid", () => {
    const formData = getValidFormData();
    formData.set("contactEmail", "invalid-email");
    
    const result = parseOrganizationForm(formData);
    
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toBe("Enter a valid contact email address.");
    }
  });

  it("blocks submission if website is invalid", () => {
    const formData = getValidFormData();
    formData.set("website", "not-a-url");
    
    const result = parseOrganizationForm(formData);
    
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toBe("Enter a valid website URL.");
    }
  });

  it("requires update reason when requireUpdateReason is true", () => {
    const formData = getValidFormData();
    // No changeReason set
    
    const result = parseOrganizationForm(formData, { requireUpdateReason: true });
    
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toBe("Enter a reason for this update.");
    }
  });

  it("accepts valid data and reason", () => {
    const formData = getValidFormData();
    formData.set("changeReason", "Initial setup");
    
    const result = parseOrganizationForm(formData);
    
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.name).toBe("Test Organization");
      expect(result.reason).toBe("Initial setup");
    }
  });
});
