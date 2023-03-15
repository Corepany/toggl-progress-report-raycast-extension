import { List, ActionPanel, Action, Icon } from "@raycast/api";
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
  const progress = (report.totalTime || 0) / report.goal;
  const remainingTime = (report.totalTime - report.goal) * -1;

  console.log(report);
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
