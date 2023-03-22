import { openExtensionPreferences, LocalStorage, getPreferenceValues, Preferences } from "@raycast/api";

import fetch from "node-fetch";
import { TogglReport, TogglReportResponse } from "../types";

const TOGGL_BASE_URL = "https://api.track.toggl.com/reports/api/v2";
const { togglApiKey, togglWorkspaceId } = getPreferenceValues();

if (!togglApiKey || !togglWorkspaceId) {
  openExtensionPreferences();
}

function formatDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(
    2,
    "0"
  )}`;
}

export async function fetchTogglReports(reportType: string): Promise<TogglReport[]> {
  function calculateSince(reportType: string): string {
    const now = new Date();
    let sinceDate;

    if (reportType === "weekly") {
      const dayOfWeek = now.getDay();
      const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      sinceDate = new Date(now.setDate(now.getDate() - daysSinceMonday));
    } else {
      sinceDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    return formatDate(sinceDate);
  }

  const since = calculateSince(reportType);
  const url = `${TOGGL_BASE_URL}/summary?workspace_id=${togglWorkspaceId}&since=${since}&user_agent=raycast`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${togglApiKey}:api_token`).toString("base64")}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Toggl reports: ${response.statusText}`);
  }
  const defaultGoal = 0;

  const data = (await response.json()) as TogglReportResponse;
  const reportPromises: Promise<TogglReport>[] = data.data.map(async (project) => {
    const projectId = project.id;

    const storedWeeklyGoal = (await LocalStorage.getItem(`projectWeeklyGoal:${projectId}`)) || defaultGoal;
    const storedMonthlyGoal = (await LocalStorage.getItem(`projectMonthlyGoal:${projectId}`)) || defaultGoal;

    const weeklyGoal = Number(storedWeeklyGoal);
    const monthlyGoal = Number(storedMonthlyGoal);

    return {
      id: projectId,
      title: project.title.project,
      totalTime: project.time / (1000 * 60 * 60),
      link: `https://track.toggl.com/reports/detailed/2678893/period/thisWeek/projects/${project.id}`,
      workspaceId: 2678893,
      weeklyGoal,
      monthlyGoal,
    };
  });

  const reports: TogglReport[] = await Promise.all(reportPromises);
  reports.sort((a, b) => b.totalTime - a.totalTime);

  return reports;
}
