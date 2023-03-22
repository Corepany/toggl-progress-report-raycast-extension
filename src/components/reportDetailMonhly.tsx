import { ActionPanel, Action, showToast, Toast, LocalStorage, useNavigation, Form } from "@raycast/api";
import { useState, useEffect } from "react";
import { TogglReport, ReportDetailProps } from "../types";
import { formatTime } from "../utils/utils";

export default function ReportDetailMonthly(props: ReportDetailProps) {
  const { report, onGoalUpdate } = props;
  const [monthlyGoal, setGoalMonthly] = useState<number | undefined>(undefined);
  const [showInput, setShowInput] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    loadGoal();
  }, [report.id]);

  async function loadGoal() {
    const storedMonthlyGoal = await LocalStorage.getItem(`projectMonthlyGoal:${report.id}`);
    if (storedMonthlyGoal) {
      setGoalMonthly(parseFloat(storedMonthlyGoal as string));
    }
  }

  function saveGoal(values: TogglReport) {
    const newMonthlyGoal = parseFloat(values.monthlyGoal.toString());
    LocalStorage.setItem(`projectMonthlyGoal:${report.id}`, newMonthlyGoal.toString());
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
        text={`Project Name: ${report.title}\nTotal time: ${formatTime(report.totalTime)}`}
      />
      <Form.Separator />

      <Form.TextField
        id="monthlyGoal"
        title="Goal Monthly"
        value={monthlyGoal?.toString() ?? ""}
        placeholder="Enter a monthly goal"
      />
    </Form>
  );
}
