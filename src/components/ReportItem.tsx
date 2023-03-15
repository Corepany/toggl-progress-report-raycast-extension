import { List, ActionPanel, Action, Icon, getPreferenceValues } from "@raycast/api";
import { ReportItemProps, TogglReport } from "../types";
import { getProgressIcon } from "@raycast/utils";
import ReportDetail from "./ReportDetail";

function formatTime(totalTime: number): string {
  const hours = Math.floor(totalTime);
  const minutes = Math.floor((totalTime - hours) * 60);
  return `${hours}h ${minutes}m`;
}

function calculateProgressData(report: TogglReport, reportType: string) {
  let progress = 0;
  let remainingTime = 0;
  let remainingTimeText = "";

  if (reportType === "weekly") {
    progress = (report.totalTime || 0) / report.weeklyGoal;
    remainingTime =
      progress > 1 ? (report.weeklyGoal - report.totalTime) * -1 : (report.totalTime - report.weeklyGoal) * -1;
    remainingTimeText =
      progress > 1 ? `Overworked time: ${formatTime(remainingTime)}` : `Remaining time: ${formatTime(remainingTime)}`;
  } else if (reportType === "monthly") {
    progress = (report.totalTime || 0) / report.monthlyGoal;
    remainingTime =
      progress > 1 ? (report.monthlyGoal - report.totalTime) * -1 : (report.totalTime - report.monthlyGoal) * -1;
    remainingTimeText =
      progress > 1 ? `Overworked time: ${formatTime(remainingTime)}` : `Remaining time: ${formatTime(remainingTime)}`;
  }

  return { progress, remainingTimeText };
}

export function ReportItem(props: ReportItemProps) {
  const { report, onGoalUpdate } = props;
  const reportType = getPreferenceValues().reportType;
  const { progress, remainingTimeText } = calculateProgressData(report, reportType);

  return (
    <List.Item
      id={report.id.toString()}
      title={report.title}
      icon={getProgressIcon(progress)}
      accessories={[
        {
          text: `Total time: ${formatTime(report.totalTime || 0)} / ${remainingTimeText}`,
        },
      ]}
      actions={
        <ActionPanel>
          <Action.Push
            title="Show Details"
            target={<ReportDetail report={report} onGoalUpdate={onGoalUpdate} />}
            icon={Icon.Eye}
          />
          <Action.OpenInBrowser url={report.link} />
        </ActionPanel>
      }
    />
  );
}
