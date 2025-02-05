"use client";

import { ErrorRecovery } from "@/app/[company]/components/ErrorRecory";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorRecovery reset={reset} />;
}
