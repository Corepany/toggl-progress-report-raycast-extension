export interface TogglReport {
  id: number;
  title: string;
  totalTime: number;
  link: string;
  workspaceId: number;
  goal: number;
}

export interface TogglProjectData {
  id: number;
  title: {
    project: string;
  };
  time: number;
  link: string;
  href: string;
}

export interface TogglReportResponse {
  data: TogglProjectData[];
}

export interface ReportDetailProps {
  report: TogglReport;
  onGoalUpdate: () => void;
}

export interface ReportItemProps {
  report: TogglReport;
  onGoalUpdate: () => void;
}
