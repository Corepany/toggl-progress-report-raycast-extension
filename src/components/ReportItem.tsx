import { List, ActionPanel, Action, Icon, getPreferenceValues } from "@raycast/api";
import { ReportItemProps } from "../types";
import { getProgressIcon } from "@raycast/utils";
import ReportDetail from "./reportDetail";
import { formatTime, calculateProgressData } from "../utils/utils";

export function ReportItem(props: ReportItemProps) {
  const { report, onGoalUpdate } = props;
  const reportType = "weekly";
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
