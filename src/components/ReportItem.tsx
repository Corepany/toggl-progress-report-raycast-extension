import { List, ActionPanel, Action, Icon, getPreferenceValues } from "@raycast/api";
import { ReportItemProps } from "../types";
import { getProgressIcon } from "@raycast/utils";
import ReportDetail from "./ReportDetail";

function formatTime(totalTime: number): string {
  const hours = Math.floor(totalTime);
  const minutes = Math.floor((totalTime - hours) * 60);
  return `${hours}h ${minutes}m`;
}

export function ReportItem(props: ReportItemProps) {
  const { report, onGoalUpdate } = props;
  const reportType = getPreferenceValues().reportType;

  let progress = 0;
  let remainingTime = 0;

  if (reportType == "weekly") {
    progress = (report.totalTime || 0) / report.weeklyGoal;
    remainingTime = (report.totalTime - report.weeklyGoal) * -1;
  } else if (reportType == "monthly") {
    progress = (report.totalTime || 0) / report.monthlyGoal;
    remainingTime = (report.totalTime - report.monthlyGoal) * -1;
  }
  return (
    <List.Item
      id={report.id.toString()}
      title={report.title}
      icon={getProgressIcon(progress)}
      accessories={[
        {
          text: `Total time: ${formatTime(report.totalTime || 0)} / Remaining time: ${formatTime(remainingTime)}`,
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
