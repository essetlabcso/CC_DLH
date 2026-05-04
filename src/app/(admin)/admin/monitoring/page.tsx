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
      label: "Total Certificates",
      value: counts.totalCertificates,
      detail: "Automated certificates issued for 80%+ test scores.",
    },
    {
      label: "Proofs Under Review",
      value: counts.proofsUnderReview,
      detail: "Practical proof submissions awaiting verifier review.",
    },
    {
      label: "Verified Achievements",
      value: counts.totalVerifiedAchievements,
      detail: "Accepted proof converted into capacity recognition.",
    },
  ];

  return (
    <WorkspaceShell eyebrow="DEC Admin" title="Monitoring & Capacity Evidence">
      <div className="admin-dashboard">
        <section className="admin-hero" aria-labelledby="monitoring-overview-title">
          <div>
            <h2 id="monitoring-overview-title">Platform Evidence Overview</h2>
            <p>
              High-level insights into learning progress and organizational
              capacity achievements. Raw proof and sensitive data are safely
              omitted.
            </p>
          </div>
          <span className="status-badge status-badge-published">Read-only overview</span>
        </section>

        <section className="admin-section" aria-labelledby="platform-metrics-title">
          <div className="admin-section-heading">
            <h2 id="platform-metrics-title">Platform Metrics</h2>
            <p>Aggregate counts across all courses and organizations.</p>
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
            <p>Verified achievements grouped by DEC capacity area.</p>
          </div>
          <div className="admin-card-grid">
            {capacitySummaries.length > 0 ? (
              capacitySummaries.map((summary) => (
                <article className="admin-readiness-card" key={summary.capacityArea}>
                  <div>
                    <h3>{summary.capacityArea}</h3>
                    <span className="status-badge status-badge-ready">
                      {summary.count} awarded
                    </span>
                  </div>
                  <p>Verified achievements mapped to this capacity area.</p>
                </article>
              ))
            ) : (
              <p className="empty-state">No verified achievements have been awarded yet.</p>
            )}
          </div>
        </section>

        <section className="admin-section" aria-labelledby="recent-achievements-title">
          <div className="admin-section-heading">
            <h2 id="recent-achievements-title">Recent Recognitions</h2>
            <p>The latest verified achievements awarded across the platform.</p>
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
              <p className="empty-state">No verified achievements have been awarded yet.</p>
            )}
          </div>
        </section>
      </div>
    </WorkspaceShell>
  );
}
