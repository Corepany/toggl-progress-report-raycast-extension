import { openExtensionPreferences, LocalStorage, getPreferenceValues } from "@raycast/api";

import fetch from "node-fetch";
import { TogglReport, TogglProjectData, TogglReportResponse } from "../types";

const TOGGL_BASE_URL = "https://api.track.toggl.com/reports/api/v2";
const togglApiKey = getPreferenceValues().togglApiKey;
const togglWorkspaceId = getPreferenceValues().togglWorkspaceId;

if (togglApiKey === undefined) {
  openExtensionPreferences();
}

if (togglWorkspaceId === undefined) {
  openExtensionPreferences();
}

function formatDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(
    2,
    "0"
  )}`;
}
export async function fetchTogglReports(): Promise<TogglReport[]> {
  const now = new Date();
  const dayOfWeek = now.getDay(); // Get the current day of the week (0 = Sunday, 1 = Monday, etc.)
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Calculate the number of days since the most recent Monday
  const mostRecentMonday = new Date(now.setDate(now.getDate() - daysSinceMonday));
  const since = formatDate(mostRecentMonday);
  const url = `${TOGGL_BASE_URL}/summary?workspace_id=${togglWorkspaceId}&since=${since}&user_agent=raycast`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${togglApiKey}:api_token`).toString("base64")}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Toggl reports: ${response.statusText}`);
  }
  const defaultGoal = 40;

  const data = (await response.json()) as TogglReportResponse;
  const reportPromises: Promise<TogglReport>[] = data.data.map(async (project) => {
    const projectId = project.id;

    const storedGoal = (await LocalStorage.getItem(`projectGoal:${projectId}`)) || defaultGoal;

    const goal = storedGoal ? Number(storedGoal) : defaultGoal;

    return {
      id: projectId,
      title: project.title.project,
      totalTime: project.time / (1000 * 60 * 60),
      link: `https://track.toggl.com/reports/detailed/2678893/period/thisWeek/projects/${project.id}`,
      workspaceId: 2678893,
      goal, // Set the goal property
    };
  });

  const reports: TogglReport[] = await Promise.all(reportPromises);
  reports.sort((a, b) => b.totalTime - a.totalTime);

  return reports;
}