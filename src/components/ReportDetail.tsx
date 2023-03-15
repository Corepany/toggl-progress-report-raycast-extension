import { ActionPanel, Action, showToast, Toast, LocalStorage, useNavigation, Form } from "@raycast/api";
import { useState, useEffect } from "react";
import { TogglReport, ReportDetailProps } from "../types";

export default function ReportDetail(props: ReportDetailProps) {
  const { report, onGoalUpdate } = props;
  const [goal, setGoal] = useState<number | undefined>(undefined);
  const [showInput, setShowInput] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    async function loadGoal() {
      const storedGoal = await LocalStorage.getItem(`projectGoal:${report.id}`);
      if (storedGoal) {
        setGoal(parseFloat(storedGoal as string));
      }
    }
    loadGoal();
  }, [report.id]);

  function saveGoal(value: string) {
    const newGoal = parseFloat(value);

    if (isNaN(newGoal) || newGoal <= 0) {
      showToast(Toast.Style.Failure, "Invalid goal value. Please enter a positive number.");
      return;
    }

    LocalStorage.setItem(`projectGoal:${report.id}`, newGoal.toString());
    setGoal(newGoal);
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
              saveGoal(values.goal.toString());
            }}
          />
        </ActionPanel>
      }
    >
      <Form.TextField id="goal" title="Goal" value={goal?.toString() ?? ""} placeholder="Enter a goal" />
    </Form>
  );
}