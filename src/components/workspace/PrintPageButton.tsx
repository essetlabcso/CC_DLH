"use client";

type PrintPageButtonProps = {
  label: string;
};

export function PrintPageButton({ label }: PrintPageButtonProps) {
  return (
    <button
      className="workspace-button print-hidden"
      onClick={() => window.print()}
      type="button"
    >
      {label}
    </button>
  );
}
