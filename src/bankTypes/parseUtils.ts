// Shared parsing helpers for the uploaded account CSV files. Both bank handlers
// use these so empty/malformed input fails with a clear message instead of
// silently sending NaN / undefined to the backend.

/** Thrown when an uploaded file cannot be parsed; its message is safe to show the user. */
export class FileParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FileParseError';
  }
}

export type ParsedAccountsFile = {
  /** First non-empty line (agent/header row). */
  header: string;
  /** Remaining non-empty lines (one per customer). */
  rows: string[];
};

/**
 * Split an uploaded accounts file into a header row and data rows, tolerating
 * CRLF line endings and blank lines. Throws when the file has no usable rows.
 */
export const splitAccountsFile = (fileContent: string): ParsedAccountsFile => {
  const lines = fileContent
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const [header, ...rows] = lines;
  if (header === undefined) {
    throw new FileParseError('The uploaded file is empty.');
  }

  return { header, rows };
};

/** Convert to a number, falling back when the value is missing or not numeric. */
export const toNumber = (value: string | undefined, fallback = 0): number => {
  const parsed = Number((value ?? '').trim());
  return Number.isFinite(parsed) ? parsed : fallback;
};

/** Like {@link toNumber} but throws for required fields that must be numeric. */
export const requireNumber = (
  value: string | undefined,
  fieldName: string,
): number => {
  const parsed = Number((value ?? '').trim());
  if (!Number.isFinite(parsed)) {
    throw new FileParseError(`Could not read a valid ${fieldName} from the file.`);
  }
  return parsed;
};

/** Trim a possibly-undefined column value. */
export const trimColumn = (value: string | undefined): string =>
  (value ?? '').trim();
