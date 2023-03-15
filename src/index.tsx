import { ActionPanel, List, Action, showToast, Toast, Detail, Icon, openExtensionPreferences } from "@raycast/api";
import { getPreferenceValues } from "@raycast/api";
import { useState, useEffect } from "react";
import fetch from "node-fetch";
import { getProgressIcon } from "@raycast/utils";

const TOGGL_BASE_URL = "https://api.track.toggl.com/reports/api/v2";

const togglApiKey = getPreferenceValues().togglApiKey;
const togglWorkspaceId = getPreferenceValues().togglWorkspaceId;

if (togglApiKey === undefined) {
  openExtensionPreferences();
}

if (togglWorkspaceId === undefined) {
  openExtensionPreferences();
}

interface TogglReport {
  id: number;
  title: string;
  totalTime: number;
  link: string;
  workspaceId: number;
  goal: number;
}

interface TogglProjectData {
  id: number;
  title: {
    project: string;
  };
  time: number;
  link: string;
  href: string;
}

interface TogglReportResponse {
  data: TogglProjectData[];
}

function formatDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(
    2,
    "0"
  )}`;
}

async function fetchTogglReports(): Promise<TogglReport[]> {
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

  const projectGoals: { [projectId: number]: number } = {
    190052471: 20, // Set a goal of 30 hours for the project with ID 123
    150379845: 5,
    162571814: 6,
    132921102: 10,
  };

  const data = (await response.json()) as TogglReportResponse;
  const reports: TogglReport[] = data.data.map((project) => {
    const projectId = project.id;
    const goal = projectGoals[projectId] || defaultGoal; // Look up the goal for the project or use the default goal

    return {
      id: projectId,
      title: project.title.project,
      totalTime: project.time / (1000 * 60 * 60),
      link: `https://track.toggl.com/reports/detailed/2678893/period/thisWeek/projects/${project.id}`,
      workspaceId: 2678893,
      goal, // Set the goal property
    };
  });

  reports.sort((a, b) => b.totalTime - a.totalTime);

  return reports;
}

export default function TogglReports() {
  const [reports, setReports] = useState<TogglReport[]>([]);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchTogglReports();
        setReports(data);
      } catch (error: any) {
        setError(error as Error);
        showToast(Toast.Style.Failure, "Failed to fetch Toggl reports", error.message);
      }
    }
    fetchData();
  }, []);

  return (
    <List isLoading={reports.length === 0} searchBarPlaceholder="Filter Toggl reports by project">
      {error && (
        <List.Item
          title="Error"
          accessories={[
            {
              text: error.message,
            },
          ]}
          icon={Icon.XMarkCircle}
        />
      )}
      {reports.map((report) => (
        <ReportItem key={report.id} report={report} />
      ))}
    </List>
  );
}

function ReportItem(props: { report: TogglReport }) {
  const { report } = props;
  const progress = (report.totalTime || 0) / report.goal;

  console.log(progress);
  return (
    <List.Item
      id={report.id.toString()}
      title={report.title}
      icon={getProgressIcon(progress)}
      accessories={[
        {
          text: `Total time: ${(report.totalTime || 0).toFixed(2)}h`,
        },
      ]}
      actions={
        <ActionPanel>
          <Action.Push title="Show Details" target={<ReportDetail report={report} />} icon={Icon.Eye} />
          <Action.OpenInBrowser url={report.link} />
        </ActionPanel>
      }
    />
  );
}

function ReportDetail(props: { report: TogglReport }) {
  const { report } = props;

  return (
    <Detail
      markdown={`# ${report.title}\n\n**Total time:** ${report.totalTime.toFixed(2)}h\n\nProject Goal: ${
        report.goal
      }h \n\n**Project Link:** ${report.link} \n\nProgress: ${(((report.totalTime || 0) / report.goal) * 100).toFixed(
        2
      )}%`}
      actions={
        <ActionPanel>
          <Action.OpenInBrowser url={report.link} />
        </ActionPanel>
      }
    />
  );
}
