export function isAbortError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const candidate = error as { name?: unknown; cause?: unknown };
  return candidate.name === 'AbortError' || isAbortError(candidate.cause);
}
