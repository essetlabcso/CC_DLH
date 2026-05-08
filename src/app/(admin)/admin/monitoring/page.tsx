import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import {
  getAdminMonitoringCounts,
  getCapacityAreaAchievementSummaries,
  getRecentVerifiedAchievements,
} from "@/lib/admin/monitoring";

export default async function AdminMonitoringPage() {
  const counts = await getAdminMonitoringCounts();
  const capacitySummaries = await getCapacityAreaAchievementSummaries();
  const recentAchievements = await getRecentVerifiedAchievements();

  const monitoringCards = [
    {
      label: "Total Learners",
      value: counts.totalLearners,
      detail: "Learners who have started at least one course lesson.",
    },
    {
      label: "Course Certificates",
      value: counts.totalCertificates,
      detail: "Automated course certificates issued for 80%+ final test scores.",
    },
    {
      label: "Proof Submissions Under Review",
      value: counts.proofsUnderReview,
      detail: "Private practical proof submissions awaiting human verifier review.",
    },
    {
      label: "Verified Achievements",
      value: counts.totalVerifiedAchievements,
      detail: "Human-reviewed achievement records based on accepted practical proof.",
    },
  ];

  return (
    <WorkspaceShell eyebrow="DEC Admin" title="Monitoring & Capacity Evidence">
      <div className="admin-dashboard">
        <section className="admin-hero" aria-labelledby="monitoring-overview-title">
          <div>
            <h2 id="monitoring-overview-title">Platform Evidence Overview</h2>
            <p>
              Aggregate insights into learning progress, certificates, private
              proof review, and verified achievements. Raw proof, sensitive
              learner details, and internal review notes are omitted.
            </p>
          </div>
          <span className="status-badge status-badge-published">Read-only overview</span>
        </section>

        <section className="admin-section" aria-labelledby="evidence-boundaries-title">
          <div className="admin-section-heading">
            <h2 id="evidence-boundaries-title">Evidence boundaries</h2>
            <p>
              Monitoring distinguishes course completion evidence from applied
              evidence. These summaries support platform learning and safe
              follow-up; they do not certify full organizational transformation
              or donor readiness.
            </p>
          </div>
          <div className="admin-card-grid">
            <article className="admin-readiness-card">
              <div>
                <h3>Certificate</h3>
                <span className="status-badge status-badge-ready">Final test</span>
              </div>
              <p>Issued automatically when a learner scores 80% or above on the final test.</p>
            </article>
            <article className="admin-readiness-card">
              <div>
                <h3>Practical proof</h3>
                <span className="status-badge">Private by default</span>
              </div>
              <p>Optional applied evidence reviewed separately from course certification.</p>
            </article>
            <article className="admin-readiness-card">
              <div>
                <h3>Verified achievement</h3>
                <span className="status-badge status-badge-published">Human reviewed</span>
              </div>
              <p>Recognition based on accepted proof, shown only as safe summary data here.</p>
            </article>
          </div>
        </section>

        <section className="admin-section" aria-labelledby="platform-metrics-title">
          <div className="admin-section-heading">
            <h2 id="platform-metrics-title">Platform Metrics</h2>
            <p>Aggregate counts across courses and organizations. No raw proof is shown.</p>
          </div>
          <div className="admin-metrics-grid">
            {monitoringCards.map((card) => (
              <article className="admin-stat-card" key={card.label}>
                <span>{card.label}</span>
                <strong>{card.value}</strong>
                <p>{card.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="admin-section" aria-labelledby="capacity-focus-title">
          <div className="admin-section-heading">
            <h2 id="capacity-focus-title">Capacity Area Focus</h2>
            <p>
              Verified achievements grouped by DEC capacity area. These are
              evidence signals, not proof of full organizational transformation.
            </p>
          </div>
          <div className="admin-card-grid">
            {capacitySummaries.length > 0 ? (
              capacitySummaries.map((summary) => (
                <article className="admin-readiness-card" key={summary.capacityArea}>
                  <div>
                    <h3>{summary.capacityArea}</h3>
                    <span className="status-badge status-badge-ready">
                      {summary.count} verified
                    </span>
                  </div>
                  <p>Safe achievement summaries mapped to this capacity area.</p>
                </article>
              ))
            ) : (
              <p className="empty-state">
                No verified achievements have been recorded yet. Certificates
                may still exist separately through the final test pathway.
              </p>
            )}
          </div>
        </section>

        <section className="admin-section" aria-labelledby="recent-achievements-title">
          <div className="admin-section-heading">
            <h2 id="recent-achievements-title">Recent Verified Achievements</h2>
            <p>
              The latest human-reviewed achievement summaries across the
              platform. This table intentionally excludes raw proof content.
            </p>
          </div>
          
          <div className="admin-table-container">
            {recentAchievements.length > 0 ? (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Capacity Area</th>
                    <th>Achievement</th>
                    <th>Course</th>
                    <th>Organization</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAchievements.map((achievement) => (
                    <tr key={achievement.id}>
                      <td>
                        {new Intl.DateTimeFormat("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }).format(achievement.issuedAt)}
                      </td>
                      <td>{achievement.capacityArea}</td>
                      <td>{achievement.title}</td>
                      <td>{achievement.courseTitle}</td>
                      <td>{achievement.organizationName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="empty-state">
                No verified achievements have been recorded yet. Monitoring will
                show only safe summary evidence when human verification exists.
              </p>
            )}
          </div>
        </section>
      </div>
    </WorkspaceShell>
  );
}
