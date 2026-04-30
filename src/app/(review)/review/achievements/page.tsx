import Link from "next/link";

import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { requireWorkspaceIdentity } from "@/lib/auth/server";
import { prisma } from "@/lib/db/client";
import { buildOrganizationSafeAchievementSummary } from "@/lib/organization-achievement-summary";
import {
  achievementSummarySelect,
  buildAchievementSummaryWhere,
  filterAchievementSummaryRecords,
  getAchievementSummaryFilterOptions,
  toOrganizationSafeAchievement,
} from "@/lib/review/achievement-summary";
import { formatPublishedDate } from "@/lib/review/publishing";

type AchievementSummaryPageProps = {
  searchParams?: Promise<{
    capacityArea?: string;
    linkedStandard?: string;
    proofType?: string;
  }>;
};

export default async function AchievementSummaryPage({
  searchParams,
}: AchievementSummaryPageProps) {
  const resolvedSearchParams = await searchParams;
  const identity = await requireWorkspaceIdentity("/review/achievements");
  const achievements = await prisma.learnerVerifiedAchievement.findMany({
    where: buildAchievementSummaryWhere(identity.user.organizationId),
    select: achievementSummarySelect,
    orderBy: {
      issuedAt: "desc",
    },
  });
  const safeAchievements = achievements.map(toOrganizationSafeAchievement);
  const filterOptions = getAchievementSummaryFilterOptions(safeAchievements);
  const activeFilters = {
    organizationId: identity.user.organizationId,
    capacityArea: resolvedSearchParams?.capacityArea?.trim() || "",
    linkedStandard: resolvedSearchParams?.linkedStandard?.trim() || "",
    proofType: resolvedSearchParams?.proofType?.trim() || "",
  };
  const filteredAchievements = filterAchievementSummaryRecords(
    safeAchievements,
    activeFilters,
  );
  const summary =
    buildOrganizationSafeAchievementSummary(filteredAchievements);

  return (
    <WorkspaceShell
      eyebrow="Review Workspace"
      title="Internal verified achievement summary"
    >
      <p>
        Aggregate recognition signals for {identity.user.organization.name}.
        This view does not prove full organizational transformation. No raw
        proof, learner identity details, donor summaries, or public badge
        credentials are shown.
      </p>

      <section
        className="studio-section"
        aria-labelledby="achievement-summary-title"
      >
        <h2 id="achievement-summary-title">Aggregate recognition signals</h2>
        <div className="metric-grid">
          <article>
            <strong>{summary.totalAchievementCount}</strong>
            <span>Verified achievements</span>
          </article>
          <article>
            <strong>{summary.uniqueLearnerCount}</strong>
            <span>Unique learners</span>
          </article>
          <article>
            <strong>{summary.courseVersionCount}</strong>
            <span>Course versions</span>
          </article>
          <article>
            <strong>{formatIssuedDate(summary.latestIssuedAt)}</strong>
            <span>Latest issued</span>
          </article>
        </div>
        <p className="workspace-note">
          Internal/private status: raw proof excluded, learner identities
          excluded, donor visibility disabled, public credentials inactive, QR
          codes inactive, AI issuance not used, and certificates remain
          separate.
        </p>
      </section>

      <section
        className="studio-section"
        aria-labelledby="achievement-filters-title"
      >
        <h2 id="achievement-filters-title">Summary filters</h2>
        <form
          action="/review/achievements"
          className="filter-form"
          method="get"
        >
          <label>
            <span>Capacity area</span>
            <select
              name="capacityArea"
              defaultValue={activeFilters.capacityArea}
            >
              <option value="">All capacity areas</option>
              {filterOptions.capacityAreas.map((capacityArea) => (
                <option key={capacityArea} value={capacityArea}>
                  {capacityArea}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Linked standard</span>
            <select
              name="linkedStandard"
              defaultValue={activeFilters.linkedStandard}
            >
              <option value="">All linked standards</option>
              {filterOptions.linkedStandards.map((linkedStandard) => (
                <option key={linkedStandard} value={linkedStandard}>
                  {linkedStandard}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Proof type</span>
            <select name="proofType" defaultValue={activeFilters.proofType}>
              <option value="">All proof types</option>
              {filterOptions.proofTypes.map((proofType) => (
                <option key={proofType} value={proofType}>
                  {proofType}
                </option>
              ))}
            </select>
          </label>
          <button className="workspace-button" type="submit">
            Apply filters
          </button>
          <Link className="workspace-link" href="/review/achievements">
            Clear filters
          </Link>
        </form>
      </section>

      <AchievementGroupSection
        groups={summary.capacityAreaGroups}
        title="Capacity area groups"
      />
      <AchievementGroupSection
        groups={summary.linkedStandardGroups}
        title="Linked standard groups"
      />
      <AchievementGroupSection
        groups={summary.proofTypeGroups}
        title="Proof type groups"
      />

      <nav className="workspace-nav" aria-label="Achievement summary actions">
        <Link className="workspace-link primary" href="/review">
          Review home
        </Link>
        <Link className="workspace-link" href="/review/proof">
          Proof review
        </Link>
      </nav>
    </WorkspaceShell>
  );
}

function AchievementGroupSection({
  groups,
  title,
}: {
  groups: ReturnType<
    typeof buildOrganizationSafeAchievementSummary
  >["capacityAreaGroups"];
  title: string;
}) {
  const sectionId = title.toLowerCase().replaceAll(" ", "-");

  return (
    <section className="studio-section" aria-labelledby={sectionId}>
      <h2 id={sectionId}>{title}</h2>
      {groups.length > 0 ? (
        <div className="course-list course-list-spacious">
          {groups.map((group) => (
            <article
              className="course-row"
              key={[
                title,
                group.capacityArea,
                group.subCapacityArea,
                group.linkedStandard,
                group.capacityIndicator,
                group.proofType,
              ].join("::")}
            >
              <div>
                <h3>{getGroupTitle(group)}</h3>
                <p>{getGroupContext(group)}</p>
                <div className="context-grid">
                  <article>
                    <strong>{group.achievementCount}</strong>
                    <span>Achievements</span>
                  </article>
                  <article>
                    <strong>{group.learnerCount}</strong>
                    <span>Learners</span>
                  </article>
                  <article>
                    <strong>{group.courseVersionCount}</strong>
                    <span>Course versions</span>
                  </article>
                  <article>
                    <strong>
                      {group.smallGroupCaution ? "Use caution" : "Aggregate"}
                    </strong>
                    <span>Small-group status</span>
                  </article>
                </div>
                {group.smallGroupCaution ? (
                  <p className="workspace-note">
                    Small-group caution: this group includes fewer than 3
                    learners and should not be treated as a broad organization
                    signal.
                  </p>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No matching achievements</h3>
          <p>
            Private verified achievements will appear here after eligible proof
            is accepted and issued separately by reviewer/admin action.
          </p>
        </div>
      )}
    </section>
  );
}

function getGroupTitle(
  group: ReturnType<
    typeof buildOrganizationSafeAchievementSummary
  >["capacityAreaGroups"][number],
) {
  return firstPresent([
    group.capacityArea,
    group.linkedStandard,
    group.proofType,
  ]);
}

function getGroupContext(
  group: ReturnType<
    typeof buildOrganizationSafeAchievementSummary
  >["capacityAreaGroups"][number],
) {
  return [
    group.subCapacityArea,
    group.linkedStandard,
    group.capacityIndicator,
    group.proofType,
  ]
    .filter((value) => value.trim())
    .join(" · ");
}

function firstPresent(values: readonly string[]) {
  return values.find((value) => value.trim()) || "Unmapped recognition group";
}

function formatIssuedDate(value: string) {
  return value ? formatPublishedDate(new Date(value)) : "No achievements issued";
}
