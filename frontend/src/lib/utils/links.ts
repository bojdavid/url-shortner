import { isAxiosError } from 'axios';
import type { Url } from '@api/urls';

/** Path prefix that Nginx proxies to the NestJS redirect route (`GET /s/:code`). */
export const SHORT_PATH_PREFIX = '/s/';

export const getShortBase = () => `${window.location.origin}${SHORT_PATH_PREFIX}`;

export const buildShortUrl = (code: string) => `${getShortBase()}${code}`;

/** Display version without protocol, e.g. `localhost:5173/s/abc123`. */
export const displayShortUrl = (code: string) =>
  buildShortUrl(code).replace(/^https?:\/\//, '');

export const isExpired = (url: Pick<Url, 'expiresAt'>) =>
  !!url.expiresAt && new Date(url.expiresAt).getTime() < Date.now();

export const hostnameOf = (raw: string) => {
  try {
    return new URL(raw).hostname.replace(/^www\./, '');
  } catch {
    return raw;
  }
};

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

export const formatNumber = (n: number) => new Intl.NumberFormat().format(n);

/** Extracts a human message from the backend's `{ error: string | { message } }` envelope. */
export const getErrorMessage = (err: unknown, fallback = 'Something went wrong') => {
  if (isAxiosError(err)) {
    const data = err.response?.data as
      | { error?: string | { message?: string | string[] }; message?: string | string[] }
      | undefined;
    const raw =
      (typeof data?.error === 'string' ? data.error : data?.error?.message) ?? data?.message;
    if (Array.isArray(raw)) return raw[0] ?? fallback;
    if (raw) return raw;
    if (!err.response) return 'Cannot reach the server';
  }
  return err instanceof Error ? err.message : fallback;
};

/** Copies text, falling back to a hidden textarea on non-secure origins (e.g. LAN IPs). */
export const copyText = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to legacy path */
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
};
