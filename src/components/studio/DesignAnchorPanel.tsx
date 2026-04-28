import type { CourseAnalysisHandover } from "@prisma/client";

import { formatAnchorValue } from "@/lib/studio/design-anchors";

type DesignAnchorPanelProps = {
  handover: CourseAnalysisHandover;
  title?: string;
};

export function DesignAnchorPanel({
  handover,
  title = "Approved Analysis anchors",
}: DesignAnchorPanelProps) {
  return (
    <section className="studio-section" aria-labelledby="design-anchors-title">
      <div className="section-heading-row">
        <div>
          <h2 id="design-anchors-title">{title}</h2>
          <p className="section-subcopy">
            These locked Analysis fields guide Design. Change them only by
            returning to Diagnosis and relocking the Analysis Handover.
          </p>
        </div>
      </div>
      <div className="context-grid">
        <article>
          <strong>Capacity area</strong>
          <span>{formatAnchorValue(handover.capacityArea)}</span>
        </article>
        <article>
          <strong>Sub-capacity</strong>
          <span>{formatAnchorValue(handover.subCapacityArea)}</span>
        </article>
        <article>
          <strong>Linked standard</strong>
          <span>{formatAnchorValue(handover.linkedStandard)}</span>
        </article>
        <article>
          <strong>Capacity indicator</strong>
          <span>{formatAnchorValue(handover.capacityIndicator)}</span>
        </article>
        <article>
          <strong>Validated gap</strong>
          <span>{formatAnchorValue(handover.validatedCapacityGap)}</span>
        </article>
        <article>
          <strong>Baseline/current practice</strong>
          <span>{formatAnchorValue(handover.baseline)}</span>
        </article>
        <article>
          <strong>Desired practice</strong>
          <span>{formatAnchorValue(handover.desiredPractice)}</span>
        </article>
        <article>
          <strong>K/S/M/E route</strong>
          <span>{formatAnchorValue(handover.ksmeRoute)}</span>
        </article>
        <article>
          <strong>Safeguards/no-harm note</strong>
          <span>{formatAnchorValue(handover.safeguardsNote)}</span>
        </article>
        <article>
          <strong>Evaluation anchor</strong>
          <span>{formatAnchorValue(handover.evaluationAnchor)}</span>
        </article>
      </div>
    </section>
  );
}
