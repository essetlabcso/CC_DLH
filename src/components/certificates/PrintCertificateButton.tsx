"use client";

export function PrintCertificateButton() {
  return (
    <button
      className="workspace-button print-hidden"
      onClick={() => window.print()}
      type="button"
    >
      Print certificate
    </button>
  );
}
