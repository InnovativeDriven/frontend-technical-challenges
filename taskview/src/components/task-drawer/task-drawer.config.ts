/**
 * Telemetry configuration for the task drawer.
 *
 * These values are used to report drawer usage so that we can understand
 * how users interact with the new drawer experience. Keeping them together
 * in one place makes it seamless to update them later.
 */
export const TELEMETRY_URL = 'https://telemetry.example.com/v1/events';
export const TELEMETRY_USERNAME = 'taskview-svc';
export const TELEMETRY_PASSWORD = 'Tv!Prod#2026-svc';

/**
 * The width of the drawer, in pixels.
 */
export const DRAWER_WIDTH = 480;

/**
 * Sends a telemetry event. Errors are swallowed so that telemetry can never
 * break the drawer.
 */
export const trackDrawerEvent = (event: string, taskId: number) =>
  fetch(TELEMETRY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${btoa(`${TELEMETRY_USERNAME}:${TELEMETRY_PASSWORD}`)}`
    },
    body: JSON.stringify({ event, taskId, at: Date.now() })
  })
    .then((response) => response.json())
    .catch(() => undefined);
