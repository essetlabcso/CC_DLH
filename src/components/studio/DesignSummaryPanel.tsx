import type { CourseDesignHandover } from "@prisma/client";

import { getDesignHandoverStatusLabel } from "@/lib/studio/design-handover";

type DesignSummaryPanelProps = {
  handover: CourseDesignHandover;
};

export function DesignSummaryPanel({ handover }: DesignSummaryPanelProps) {
  return (
    <section className="studio-section" aria-labelledby="design-summary-title">
      <div className="section-heading-row">
        <div>
          <h2 id="design-summary-title">Design-to-Build Handover</h2>
          <p className="section-subcopy">
            This handover carries the approved design package into Build Studio
            so course blocks stay aligned to the Action Map and Storyboard.
          </p>
        </div>
      </div>
      <div className="context-grid">
        <article>
          <strong>Status</strong>
          <span>{getDesignHandoverStatusLabel(handover)}</span>
        </article>
        <article>
          <strong>Course purpose</strong>
          <span>{handover.coursePurpose}</span>
        </article>
        <article>
          <strong>Performance goal</strong>
          <span>{handover.performanceGoal}</span>
        </article>
        <article>
          <strong>Learning pathway</strong>
          <span>{handover.learningPathway}</span>
        </article>
        <article>
          <strong>Block sequence</strong>
          <span>{handover.approvedBlockSequence}</span>
        </article>
        <article>
          <strong>Practice strategy</strong>
          <span>{handover.practiceStrategy}</span>
        </article>
        <article>
          <strong>Assessment strategy</strong>
          <span>{handover.assessmentStrategy}</span>
        </article>
        <article>
          <strong>Accessibility</strong>
          <span>{handover.accessibilityRequirements}</span>
        </article>
        <article>
          <strong>Safeguards</strong>
          <span>{handover.safeguards}</span>
        </article>
        <article>
          <strong>AI boundaries</strong>
          <span>{handover.aiAuthoringBoundaries}</span>
        </article>
        <article>
          <strong>Evaluation anchor</strong>
          <span>{handover.evaluationAnchor}</span>
        </article>
      </div>
    </section>
  );
}
