import { ActionPanel, Action, LocalStorage, useNavigation, Form, getPreferenceValues, Detail } from "@raycast/api";
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

  function togglStartTimer($projectId: number) {
    const { togglApiKey } = getPreferenceValues();

    var TogglClient = require("toggl-api");
    var toggl = new TogglClient({ apiToken: togglApiKey });

    toggl.startTimeEntry(
      {
        description: "Some description",
        billable: false,
        pid: $projectId,
      },
      function (err: any, timeEntry: { id: any }) {
        // To-do handle error
      }
    );
  }

  function TimeStarted() {
    togglStartTimer(report.id);
    return <Detail markdown="Time Started" />;
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
          <Action.Push title="Start Timer" target={<TimeStarted />} />
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
