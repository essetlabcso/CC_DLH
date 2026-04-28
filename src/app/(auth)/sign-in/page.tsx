import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
type SignInPageProps = {
  searchParams?: Promise<{
    next?: string;
    workspace?: string;
    error?: string;
  }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;
  const next = normalizeLearnerNext(params?.next);
  const workspace = params?.workspace;
  const error = params?.error;

  return (
    <WorkspaceShell eyebrow="Learner Sign In" title="Sign in to learning">
      <p>
        Sign in to access your DEC member learning, continue assigned courses,
        and return to your progress.
      </p>
      {workspace ? (
        <p className="workspace-note">Requested area: {workspace}</p>
      ) : null}
      {error ? (
        <p className="workspace-error">Please try again or contact support.</p>
      ) : null}
      <form action="/api/auth/dev-sign-in" className="workspace-form" method="post">
        <input name="role" type="hidden" value="learner" />
        <input name="next" type="hidden" value={next} />
        <button className="workspace-button" type="submit">
          Continue to learning
        </button>
      </form>
    </WorkspaceShell>
  );
}

function normalizeLearnerNext(value: string | undefined) {
  if (value === "/learn" || value?.startsWith("/learn/")) {
    return value;
  }

  return "/learn";
}
