import type { CourseAnalysisHandover } from "@prisma/client";

import {
  getAnalysisHandoverStatusLabel,
  getAnalysisRouteDecisionLabel,
} from "@/lib/studio/analysis-handover";

type AnalysisSummaryPanelProps = {
  handover: CourseAnalysisHandover;
  courseFitDecision?: string;
};

export function AnalysisSummaryPanel({
  handover,
  courseFitDecision = "",
}: AnalysisSummaryPanelProps) {
  return (
    <section className="studio-section" aria-labelledby="analysis-summary-title">
      <div className="section-heading-row">
        <div>
          <h2 id="analysis-summary-title">Approved Analysis summary</h2>
          <p className="section-subcopy">
            This locked handover is the Design reference. Design choices should
            stay aligned to this capacity gap, baseline, route, and evidence
            anchor.
          </p>
        </div>
      </div>
      <div className="context-grid">
        <article>
          <strong>Status</strong>
          <span>{getAnalysisHandoverStatusLabel(handover)}</span>
        </article>
        <article>
          <strong>Route decision</strong>
          <span>
            {getAnalysisRouteDecisionLabel({
              courseFitDecision,
              ksmeRoute: handover.ksmeRoute,
              separableKnowledgeSkillComponent:
                handover.separableKnowledgeSkillComponent,
            })}
          </span>
        </article>
        <article>
          <strong>Validated gap</strong>
          <span>{handover.validatedCapacityGap}</span>
        </article>
        <article>
          <strong>Baseline</strong>
          <span>{handover.baseline}</span>
        </article>
        <article>
          <strong>Desired practice</strong>
          <span>{handover.desiredPractice}</span>
        </article>
        <article>
          <strong>Root cause</strong>
          <span>{handover.rootCauseSummary}</span>
        </article>
        <article>
          <strong>KSME route</strong>
          <span>{formatRoute(handover.ksmeRoute)}</span>
        </article>
        <article>
          <strong>Intervention decision</strong>
          <span>{handover.interventionDecision}</span>
        </article>
        {handover.separableKnowledgeSkillComponent ? (
          <article>
            <strong>Separable Knowledge or Skill component</strong>
            <span>{handover.separableKnowledgeSkillComponent}</span>
          </article>
        ) : null}
        <article>
          <strong>Safeguards</strong>
          <span>{handover.safeguardsNote}</span>
        </article>
        <article>
          <strong>Evaluation anchor</strong>
          <span>{handover.evaluationAnchor}</span>
        </article>
      </div>
    </section>
  );
}

function formatRoute(value: string) {
  if (!value) {
    return "Not set";
  }

  return value.charAt(0).toUpperCase() + value.substring(1);
}
