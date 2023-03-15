import { ActionPanel, Action, showToast, Toast, LocalStorage, useNavigation, Form } from "@raycast/api";
import { useState, useEffect } from "react";
import { TogglReport, ReportDetailProps } from "../types";

export default function ReportDetail(props: ReportDetailProps) {
  const { report, onGoalUpdate } = props;
  const [weeklyGoal, setGoalWeekly] = useState<number | undefined>(undefined);
  const [monthlyGoal, setGoalMonthly] = useState<number | undefined>(undefined);
  const [showInput, setShowInput] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    async function loadGoal() {
      const storedWeeklyGoal = await LocalStorage.getItem(`projectWeeklyGoal:${report.id}`);
      const storedMonthlyGoal = await LocalStorage.getItem(`projectMonthlyGoal:${report.id}`);
      if (storedMonthlyGoal || storedWeeklyGoal) {
        setGoalWeekly(parseFloat(storedWeeklyGoal as string));
        setGoalMonthly(parseFloat(storedMonthlyGoal as string));
      }
    }
    loadGoal();
  }, [report.id]);

  function saveGoal(values: TogglReport) {
    const newWeeklyGoal = parseFloat(values.weeklyGoal.toString());
    const newMonthlyGoal = parseFloat(values.monthlyGoal.toString());

    if (isNaN(newWeeklyGoal) || newWeeklyGoal <= 0) {
      showToast(Toast.Style.Failure, "Invalid goal value. Please enter a positive number.");
      return;
    }

    LocalStorage.setItem(`projectWeeklyGoal:${report.id}`, newWeeklyGoal.toString());
    LocalStorage.setItem(`projectMonthlyGoal:${report.id}`, newMonthlyGoal.toString());
    setGoalWeekly(newWeeklyGoal);
    setGoalMonthly(newMonthlyGoal);
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
        text={`Project Name: ${report.title}\nTotal time: ${report.totalTime.toFixed(
          2
        )}h\nProject Weekly Goal: ${weeklyGoal}h\nProject Monthly Goal: ${monthlyGoal}h`}
      />
      <Form.Separator />
      <Form.TextField
        id="weeklyGoal"
        title="Goal Weekly"
        value={weeklyGoal?.toString() ?? ""}
        placeholder="Enter a weekly goal"
      />
      <Form.TextField
        id="monthlyGoal"
        title="Goal Monthly"
        value={monthlyGoal?.toString() ?? ""}
        placeholder="Enter a monthly goal"
      />
    </Form>
  );
}
