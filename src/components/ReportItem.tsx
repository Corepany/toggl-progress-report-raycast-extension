import { List, ActionPanel, Action, Icon } from "@raycast/api";
import { ReportItemProps } from "../types";
import { getProgressIcon } from "@raycast/utils";
import ReportDetail from "./ReportDetail";

export function ReportItem(props: ReportItemProps) {
  const { report, onGoalUpdate } = props;
  const progress = (report.totalTime || 0) / report.goal;
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
