import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { getAdminReferenceDataBrowser } from "@/lib/admin/reference-data";
import Link from "next/link";

type AdminReferenceDataPageProps = {
  searchParams?: Promise<{
    category?: string;
    created?: string;
    error?: string;
    search?: string;
    updated?: string;
  }>;
};

export default async function AdminReferenceDataPage({
  searchParams,
}: AdminReferenceDataPageProps) {
  const params = await searchParams;
  const categoryKey = params?.category;
  const search = params?.search?.trim() ?? "";
  const referenceData = await getAdminReferenceDataBrowser({
    categoryKey,
    search,
  });

  const visibleValueCount = referenceData.categories.reduce(
    (total, category) => total + category.values.length,
    0,
  );

  return (
    <WorkspaceShell eyebrow="Admin Control Center" title="Reference Data">
      <div className="admin-dashboard reference-browser">
        <section className="admin-hero">
          <div>
            <h2>Controlled values browser</h2>
            <p>
              Inspect the controlled dropdowns and reference values that support
              Course Setup, diagnosis, review, publishing, proof, and monitoring.
              Used values should be deactivated rather than removed or repurposed.
            </p>
          </div>
          <div className="admin-hero-actions">
            <Link
              className="workspace-link"
              href="/admin/reference-data/values/new"
            >
              Add value
            </Link>
            <Link
              className="workspace-link secondary"
              href="/admin/reference-data/categories/new"
            >
              Add category
            </Link>
            <Link className="workspace-link secondary" href="/admin">
              Back to Admin
            </Link>
          </div>
        </section>

        <StatusMessage searchParams={params} />

        <section className="admin-section" aria-labelledby="reference-health-title">
          <div className="admin-section-heading">
            <h2 id="reference-health-title">Reference data health</h2>
            <p>Live totals from the current Admin-controlled reference set.</p>
          </div>
          <div className="admin-metrics-grid">
            <MetricCard
              detail="Controlled reference groups"
              label="Categories"
              value={referenceData.totals.categories}
            />
            <MetricCard
              detail="Total controlled values"
              label="Values"
              value={referenceData.totals.values}
            />
            <MetricCard
              detail="Protected core values"
              label="System Locked"
              value={referenceData.totals.systemLockedValues}
            />
            <MetricCard
              detail="Currently available values"
              label="Active"
              value={referenceData.totals.activeValues}
            />
            <MetricCard
              detail="Values linked to existing records"
              label="Used"
              value={referenceData.totals.usedValues}
            />
          </div>
        </section>

        <section
          className="admin-section"
          aria-labelledby="reference-safety-title"
        >
          <div className="admin-section-heading">
            <h2 id="reference-safety-title">Reference data safeguards</h2>
            <p>
              These controls keep lookup changes visible, auditable, and safe for
              active courses and learner records.
            </p>
          </div>
          <div className="admin-readiness-grid">
            <article className="admin-readiness-card">
              <span className="status-badge status-badge-ready">Safe default</span>
              <h3>Deactivate used values</h3>
              <p>
                Existing values with recorded usage stay available for history;
                inactive status removes them from future selection where supported.
              </p>
            </article>
            <article className="admin-readiness-card">
              <span className="status-badge status-badge-published">
                Protected
              </span>
              <h3>System and workflow values</h3>
              <p>
                System-locked values remain protected, and sensitive workflow
                areas are marked before Admins make changes.
              </p>
            </article>
            <article className="admin-readiness-card">
              <span className="status-badge status-badge-ready">Audited</span>
              <h3>Change reasons required</h3>
              <p>
                Updates to existing categories and values continue to require a
                reason and are recorded in the Admin audit log.
              </p>
            </article>
          </div>
        </section>

        <section className="admin-section" aria-labelledby="reference-filter-title">
          <div className="admin-section-heading">
            <h2 id="reference-filter-title">Find reference data</h2>
            <p>
              Filter by name, key, workflow area, description, or value label.
            </p>
          </div>
          <form action="/admin/reference-data" className="reference-filter-panel">
            {categoryKey ? (
              <input name="category" type="hidden" value={categoryKey} />
            ) : null}
            <label className="workspace-label" htmlFor="reference-search">
              Search reference data
            </label>
            <div className="reference-filter-row">
              <input
                className="reference-search-input"
                defaultValue={search}
                id="reference-search"
                name="search"
                placeholder="Search values, categories, or workflow areas"
                type="search"
              />
              <button className="workspace-button" type="submit">
                Search
              </button>
              <Link className="workspace-link secondary" href="/admin/reference-data">
                Clear
              </Link>
            </div>
          </form>
        </section>

        <section className="admin-section" aria-labelledby="reference-category-title">
          <div className="admin-section-heading">
            <h2 id="reference-category-title">Categories</h2>
            <p>
              {referenceData.categories.length} categories shown with{" "}
              {visibleValueCount} visible values.
            </p>
          </div>
          {referenceData.categories.length > 0 ? (
            <div className="reference-category-grid">
              {referenceData.categories.map((category) => (
                <article className="reference-category-card" key={category.id}>
                  <div className="reference-card-heading">
                    <div>
                      <h3>{category.categoryName}</h3>
                      <p>{category.categoryKey}</p>
                    </div>
                    <div className="reference-badge-row">
                      <span
                        className={`status-badge ${
                          category.isActive
                            ? "status-badge-ready"
                            : "status-badge-blocked"
                        }`}
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </span>
                      {category.isProtectedWorkflowCategory ? (
                        <span className="status-badge status-badge-published">
                          Protected area
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <p>{category.description || "No description provided."}</p>
                  <dl className="reference-meta-list">
                    <div>
                      <dt>Workflow area</dt>
                      <dd>{formatLabel(category.workflowPhase)}</dd>
                    </div>
                    <div>
                      <dt>Values</dt>
                      <dd>{category.values.length}</dd>
                    </div>
                    <div>
                      <dt>Control</dt>
                      <dd>
                        {category.isSystemCategory
                          ? "System category"
                          : "Admin category"}
                      </dd>
                    </div>
                    <div>
                      <dt>Usage tracking</dt>
                      <dd>{categoryUsageLabel(category.values)}</dd>
                    </div>
                  </dl>
                  <div className="reference-action-row">
                    <Link
                      className="workspace-link secondary"
                      href={categoryLink(category.categoryKey, search)}
                    >
                      View category
                    </Link>
                    {category.canAddValue ? (
                      <Link
                        className="workspace-link secondary"
                        href={`/admin/reference-data/values/new?categoryId=${category.id}`}
                      >
                        Add value
                      </Link>
                    ) : null}
                    {category.canEdit ? (
                      <Link
                        className="workspace-link secondary"
                        href={`/admin/reference-data/categories/${category.id}/edit`}
                      >
                        Edit category
                      </Link>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No reference categories match this filter"
              text="Clear the search or select a different category to review the available controlled values."
            />
          )}
        </section>

        <section className="admin-section" aria-labelledby="reference-values-title">
          <div className="admin-section-heading">
            <h2 id="reference-values-title">
              {referenceData.selectedCategory
                ? `${referenceData.selectedCategory.categoryName} values`
                : "Values by category"}
            </h2>
            <p>
              Read-only value details include status, lock state, visibility,
              usage state, parent value, and display order.
            </p>
          </div>

          {referenceData.categories.length > 0 ? (
            <div className="reference-value-groups">
              {referenceData.categories.map((category) => (
                <article className="reference-value-group" key={category.id}>
                  <div className="reference-value-group-heading">
                    <div>
                      <h3>{category.categoryName}</h3>
                      <p>
                        {formatLabel(category.workflowPhase)} ·{" "}
                        {category.values.length} values shown
                      </p>
                    </div>
                    {categoryKey ? (
                      <Link
                        className="workspace-link secondary"
                        href={search ? `/admin/reference-data?search=${encodeURIComponent(search)}` : "/admin/reference-data"}
                      >
                        Show all
                      </Link>
                    ) : null}
                  </div>

                  {category.values.length > 0 ? (
                    <div className="reference-value-list">
                      {category.values.map((value) => (
                        <div className="reference-value-card" key={value.id}>
                          <div className="reference-card-heading">
                            <div>
                              <h4>{value.displayLabel}</h4>
                              <p>{value.valueKey}</p>
                            </div>
                            <div className="reference-badge-row">
                              <span
                                className={`status-badge ${
                                  value.isActive
                                    ? "status-badge-ready"
                                    : "status-badge-blocked"
                                }`}
                              >
                                {value.isActive ? "Active" : "Inactive"}
                              </span>
                              <span
                                className={`status-badge ${
                                  value.isSystemLocked
                                    ? "status-badge-published"
                                    : ""
                                }`}
                              >
                                {value.isSystemLocked
                                  ? "System Locked"
                                  : "Admin Managed"}
                              </span>
                              <span
                                className={`status-badge ${usageBadgeClass(
                                  value,
                                )}`}
                              >
                                {usageBadgeLabel(value)}
                              </span>
                              {value.isProtectedWorkflowValue ? (
                                <span className="status-badge status-badge-published">
                                  Protected area
                                </span>
                              ) : null}
                            </div>
                          </div>
                          {value.description || value.helpText ? (
                            <p>
                              {value.description || value.helpText}
                            </p>
                          ) : (
                            <p>No description provided.</p>
                          )}
                          <dl className="reference-meta-list">
                            <div>
                              <dt>Display order</dt>
                              <dd>{value.displayOrder}</dd>
                            </div>
                            <div>
                              <dt>Parent value</dt>
                              <dd>{value.parentLabel ?? "None"}</dd>
                            </div>
                            <div>
                              <dt>Visible to</dt>
                              <dd>{visibilityLabel(value)}</dd>
                            </div>
                            <div>
                              <dt>Usage</dt>
                              <dd>{value.usageSummary}</dd>
                            </div>
                            <div>
                              <dt>Safe action</dt>
                              <dd>{safeActionLabel(value)}</dd>
                            </div>
                          </dl>
                          {value.canEdit ? (
                            <div className="reference-action-row">
                              <Link
                                className="workspace-link secondary"
                                href={`/admin/reference-data/values/${value.id}/edit`}
                              >
                                Edit value
                              </Link>
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      title="No values match this filter"
                      text="The category is available, but no values match the current search."
                    />
                  )}
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No controlled values to show"
              text="Clear the filters to return to the full reference data browser."
            />
          )}
        </section>
      </div>
    </WorkspaceShell>
  );
}

function StatusMessage({
  searchParams,
}: {
  searchParams:
    | {
        created?: string;
        error?: string;
        updated?: string;
      }
    | undefined;
}) {
  if (searchParams?.error) {
    return (
      <section className="admin-section" aria-label="Action message">
        <span className="status-badge status-badge-blocked">
          Action needed
        </span>
        <p>{searchParams.error}</p>
      </section>
    );
  }

  if (searchParams?.created) {
    return (
      <section className="admin-section" aria-label="Action message">
        <span className="status-badge status-badge-ready">Created</span>
        <p>The reference data entry has been created.</p>
      </section>
    );
  }

  if (searchParams?.updated) {
    return (
      <section className="admin-section" aria-label="Action message">
        <span className="status-badge status-badge-ready">Updated</span>
        <p>The reference data entry has been updated.</p>
      </section>
    );
  }

  return null;
}

function MetricCard({
  detail,
  label,
  value,
}: {
  detail: string;
  label: string;
  value: number;
}) {
  return (
    <article className="admin-stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{detail}</p>
    </article>
  );
}

function EmptyState({ text, title }: { text: string; title: string }) {
  return (
    <div className="admin-empty-panel">
      <span className="status-badge status-badge-blocked">No results</span>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}

function categoryLink(categoryKey: string, search: string) {
  const params = new URLSearchParams({ category: categoryKey });

  if (search) {
    params.set("search", search);
  }

  return `/admin/reference-data?${params.toString()}`;
}

function formatLabel(value: string) {
  return value
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function visibilityLabel(value: {
  visibleToAdmin: boolean;
  visibleToCreator: boolean;
  visibleToParticipant: boolean;
  visibleToReviewer: boolean;
  visibleInMonitoring: boolean;
}) {
  const visibleTo = [
    value.visibleToAdmin ? "Admin" : "",
    value.visibleToCreator ? "Creator" : "",
    value.visibleToReviewer ? "Reviewer" : "",
    value.visibleToParticipant ? "Participant" : "",
    value.visibleInMonitoring ? "Monitoring" : "",
  ].filter(Boolean);

  return visibleTo.length > 0 ? visibleTo.join(", ") : "Hidden";
}

function categoryUsageLabel(
  values: {
    isUsed: boolean;
    isUsageTracked: boolean;
  }[],
) {
  const trackedValues = values.filter((value) => value.isUsageTracked).length;

  if (trackedValues === 0) {
    return "Not tracked yet";
  }

  const usedValues = values.filter((value) => value.isUsed).length;
  return `${usedValues} used of ${trackedValues} tracked values`;
}

function usageBadgeClass(value: {
  isUsed: boolean;
  isUsageTracked: boolean;
}) {
  if (!value.isUsageTracked) {
    return "";
  }

  return value.isUsed ? "status-badge-published" : "status-badge-ready";
}

function usageBadgeLabel(value: {
  isUsed: boolean;
  isUsageTracked: boolean;
}) {
  if (!value.isUsageTracked) {
    return "Usage not tracked";
  }

  return value.isUsed ? "Used" : "No recorded use";
}

function safeActionLabel(value: {
  isProtectedWorkflowValue: boolean;
  isSystemLocked: boolean;
  isUsed: boolean;
  isUsageTracked: boolean;
}) {
  if (value.isSystemLocked) {
    return "System locked; do not edit.";
  }

  if (value.isUsed) {
    return "Deactivate instead of renaming or repurposing.";
  }

  if (value.isProtectedWorkflowValue) {
    return "Review carefully before changing this workflow value.";
  }

  if (!value.isUsageTracked) {
    return "Review manually before changing this value.";
  }

  return "May be edited or deactivated with an audit reason.";
}
