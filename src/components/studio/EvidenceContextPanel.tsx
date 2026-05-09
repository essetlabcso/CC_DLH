import type {
  EvidenceContextDisplayItem,
  EvidenceContextDisplayModel,
} from "@/lib/studio/evidence-context";

type EvidenceContextPanelProps = {
  context: EvidenceContextDisplayModel;
};

export function EvidenceContextPanel({ context }: EvidenceContextPanelProps) {
  return (
    <section
      className={`evidence-context-panel ${
        context.status.hasMissingEvidenceWarning
          ? "evidence-context-panel-warning"
          : ""
      }`}
      aria-labelledby="evidence-context-title"
    >
      <div className="section-heading-row">
        <div>
          <h2 id="evidence-context-title">{context.title}</h2>
          <p className="section-subcopy">{context.description}</p>
        </div>
        <div className="review-hero-status" aria-label="Evidence context status">
          {context.badges.map((badge) => (
            <span
              className={`status-badge ${
                badge.tone === "ready"
                  ? "status-badge-ready"
                  : badge.tone === "blocked"
                    ? "status-badge-blocked"
                    : ""
              }`}
              key={badge.label}
            >
              {badge.label}
            </span>
          ))}
        </div>
      </div>

      <div className="evidence-context-lineage" aria-label="Evidence lineage">
        <span>{context.lineage.approvedDiagnosis}</span>
        <span>{context.lineage.lockedAnalysis}</span>
        <span>{context.lineage.designContext}</span>
      </div>

      {context.warning ? (
        <p className="workspace-error">{context.warning}</p>
      ) : null}

          {context.diagnosis ? (
        <section
          className="evidence-context-card"
          aria-labelledby="approved-diagnosis-context-title"
        >
          <div>
            <span className="status-badge status-badge-ready">
              Locked source anchor
            </span>
            <h3 id="approved-diagnosis-context-title">
              {context.diagnosis.diagnosisTitle}
            </h3>
            <p>
              {context.diagnosis.diagnosisCode} ·{" "}
              {context.diagnosis.datasetCode} ·{" "}
              {context.diagnosis.datasetTitle}
            </p>
          </div>
          <EvidenceContextFacts items={context.diagnosis.items} />
        </section>
      ) : null}

      {context.analysis ? (
        <section
          className="evidence-context-card"
          aria-labelledby="locked-analysis-context-title"
        >
          <div>
            <span
              className={`status-badge ${
                context.status.hasLockedAnalysis
                  ? "status-badge-ready"
                  : "status-badge-blocked"
              }`}
            >
              {context.status.hasLockedAnalysis
                ? "Locked Analysis"
                : "Analysis not locked"}
            </span>
            <h3 id="locked-analysis-context-title">Analysis context</h3>
            <p>
              These fields carry the creator course-specific interpretation
              into downstream Design and Build work while staying aligned with
              the source anchor.
            </p>
          </div>
          <EvidenceContextFacts items={context.analysis.items} />
        </section>
      ) : null}
    </section>
  );
}

function EvidenceContextFacts({
  items,
}: {
  items: EvidenceContextDisplayItem[];
}) {
  return (
    <dl className="evidence-context-facts">
      {items.map((item) => (
        <div key={item.label}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
