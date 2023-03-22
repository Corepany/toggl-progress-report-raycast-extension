import { useState, useEffect } from "react";
import { fetchTogglReports } from "../utils/fetchTogglReports";
import { TogglReport } from "../types";
import { ReportItem } from "./reportItem";

import { List, showToast, Toast, Icon } from "@raycast/api";

export function TogglReports() {
  const [reports, setReports] = useState<TogglReport[]>([]);
  const [error, setError] = useState<Error>();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleGoalUpdate = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchTogglReports();
        setReports(data);
      } catch (error: any) {
        setError(error as Error);
        showToast(Toast.Style.Failure, "Failed to fetch Toggl reports", error.message);
      }
    }
    fetchData();
  }, []);

  return (
    <List isLoading={reports.length === 0} searchBarPlaceholder="Filter Toggl reports by project">
      {error && (
        <List.Item
          title="Error"
          accessories={[
            {
              text: error.message,
            },
          ]}
          icon={Icon.XMarkCircle}
        />
      )}
      {reports.map((report) => (
        <ReportItem key={report.id} report={report} onGoalUpdate={handleGoalUpdate} />
      ))}
    </List>
  );
}
