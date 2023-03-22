import { ActionPanel, Action, showToast, Toast, LocalStorage, useNavigation, Form } from "@raycast/api";
import { useState, useEffect } from "react";
import { TogglReport, ReportDetailProps } from "../types";
import { formatTime } from "../utils/utils";

export default function ReportDetailWeekly(props: ReportDetailProps) {
  const { report, onGoalUpdate } = props;
  const [weeklyGoal, setGoalWeekly] = useState<number | undefined>(undefined);
  const [showInput, setShowInput] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    loadGoal();
  }, [report.id]);

  async function loadGoal() {
    const storedWeeklyGoal = await LocalStorage.getItem(`projectWeeklyGoal:${report.id}`);
    if (storedWeeklyGoal) {
      setGoalWeekly(parseFloat(storedWeeklyGoal as string));
    }
  }

  function saveGoal(values: TogglReport) {
    const newWeeklyGoal = parseFloat(values.weeklyGoal.toString());

    if (isNaN(newWeeklyGoal) || newWeeklyGoal <= 0) {
      showToast(Toast.Style.Failure, "Invalid goal value. Please enter a positive number.");
      return;
    }

    LocalStorage.setItem(`projectWeeklyGoal:${report.id}`, newWeeklyGoal.toString());
    setGoalWeekly(newWeeklyGoal);
    onGoalUpdate();
    setShowInput(false);
    navigation.pop();
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            onSubmit={(values: TogglReport) => {
              saveGoal(values);
            }}
          />
          <Action.OpenInBrowser url={report.link} />
        </ActionPanel>
      }
    >
      <Form.Description
        title="Report Details"
        text={`Project Name: ${report.title}\nTotal time: ${formatTime(report.totalTime)}`}
      />
      <Form.Separator />

      <Form.TextField
        id="weeklyGoal"
        title="Goal Weekly"
        value={weeklyGoal?.toString() ?? ""}
        placeholder="Enter a weekly goal"
      />
    </Form>
  );
}
