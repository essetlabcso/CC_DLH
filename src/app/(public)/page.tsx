import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="public-page">
      <header className="public-header" aria-label="DEC Learning Hub">
        <Link className="brand-mark" href="/">
          <Image alt="" height={40} priority src="/dec-logo.svg" width={40} />
          <span>DEC Learning Hub</span>
        </Link>
        <nav aria-label="Learner navigation" className="public-nav">
          <Link href="/courses">Explore courses</Link>
          <Link href="/verify">Verify certificate</Link>
          <Link href="/sign-in">Sign in</Link>
        </nav>
      </header>

      <section className="learner-hero" aria-labelledby="home-title">
        <div className="learner-hero-copy">
          <p className="public-kicker">Learning for local CSOs</p>
          <h1 id="home-title">Practical learning for stronger community work</h1>
          <p>
            Access structured DEC learning designed for local and grassroots
            CSOs. Start with available learning areas, then sign in to continue
            your member learning when assigned courses are ready.
          </p>
          <div className="public-actions">
            <Link className="button-primary" href="/courses">
              Explore courses
            </Link>
            <Link className="button-secondary" href="/sign-in?next=/learn">
              Sign in to learning
            </Link>
          </div>
        </div>
        <div className="learner-hero-panel" aria-label="Learning areas">
          <p>Learning areas</p>
          <ul>
            <li>Organizational capacity</li>
            <li>Program quality</li>
            <li>Safeguarding and accountability</li>
            <li>Monitoring, evaluation, and learning</li>
          </ul>
        </div>
      </section>

      <section className="public-section" aria-labelledby="learning-title">
        <h2 id="learning-title">Built for practical CSO learning</h2>
        <div className="learning-grid">
          <article>
            <h3>Clear course paths</h3>
            <p>
              Courses are organized into modules and lessons so learners can
              return to their progress and complete learning step by step.
            </p>
          </article>
          <article>
            <h3>Accessible by design</h3>
            <p>
              The hub is being built as a mobile-first web experience for
              learners working across different devices and connection quality.
            </p>
          </article>
          <article>
            <h3>DEC-governed content</h3>
            <p>
              Learning content will move through a controlled internal review
              process before learners see published courses.
            </p>
          </article>
        </div>
      </section>

      <footer className="public-footer">
        <span>DEC Learning Hub</span>
        <div className="public-footer-links">
          <Link href="/verify">Verify certificate</Link>
          <Link href="/staff">Staff access</Link>
        </div>
      </footer>
    </main>
  );
}
