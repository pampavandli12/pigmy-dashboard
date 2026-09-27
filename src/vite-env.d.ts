/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the backend API. Required. */
  readonly VITE_API_DOMAIN: string;
  /** Optional request timeout in milliseconds; falls back to a per-mode default. */
  readonly VITE_API_TIMEOUT?: string;
  /** Optional log level; falls back to a per-mode default. */
  readonly VITE_LOG_LEVEL?: 'debug' | 'info' | 'warn' | 'error';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
