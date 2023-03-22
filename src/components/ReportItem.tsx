import { List, ActionPanel, Action, Icon, getPreferenceValues } from "@raycast/api";
import { ReportItemProps } from "../types";
import { getProgressIcon } from "@raycast/utils";
import ReportDetailWeekly from "./reportDetailWeekly";
import ReportDetailMonthly from "./reportDetailMonhly";
import { formatTime, calculateProgressData } from "../utils/utils";

export function ReportItem(props: ReportItemProps) {
  const { report, period, onGoalUpdate } = props;
  const { progress, remainingTimeText } = calculateProgressData(report, period);

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
            target={
              period === "monthly" ? (
                <ReportDetailMonthly report={report} onGoalUpdate={onGoalUpdate} />
              ) : (
                <ReportDetailWeekly report={report} onGoalUpdate={onGoalUpdate} />
              )
            }
            icon={Icon.Eye}
          />
          <Action.OpenInBrowser url={report.link} />
        </ActionPanel>
      }
    />
  );
}
