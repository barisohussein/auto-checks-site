import fetch from 'node-fetch';

const OPSGENIE_URL = 'https://api.opsgenie.com/v2/alerts';

export async function createOpsgenieAlert(
  message: string,
  description: string,
  priority: 'P1' | 'P2' | 'P3' | 'P4' = 'P3'
) {
  const apiKey = process.env.OPSGENIE_API_KEY;
  const team = process.env.OPSGENIE_TEAM;

  if (!apiKey || !team) {
    console.warn('Opsgenie API key or team not set. Skipping Opsgenie alert.');
    return;
  }

  const body = {
    message,
    description,
    priority,
    teams: [{ name: team }],
    source: 'Playwright E2E Tests',
  };

  await fetch(OPSGENIE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `GenieKey ${apiKey}`,
    },
    body: JSON.stringify(body),
  });
}
