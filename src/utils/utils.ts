export function formatTime(totalTime: number): string {
  const hours = Math.floor(totalTime);
  const minutes = Math.floor((totalTime - hours) * 60);
  return `${hours}h ${minutes}m`;
}
import { TogglReport } from "../types";

export function calculateProgressData(report: TogglReport, reportType: string) {
  let progress = 0;
  let remainingTime = 0;
  let remainingTimeText = "";

  if (reportType === "weekly") {
    progress = (report.totalTime || 0) / report.weeklyGoal;
    remainingTime =
      progress > 1 ? (report.weeklyGoal - report.totalTime) * -1 : (report.totalTime - report.weeklyGoal) * -1;
    remainingTimeText =
      progress > 1 ? `Overworked time: ${formatTime(remainingTime)}` : `Remaining time: ${formatTime(remainingTime)}`;
  } else if (reportType === "monthly") {
    progress = (report.totalTime || 0) / report.monthlyGoal;
    remainingTime =
      progress > 1 ? (report.monthlyGoal - report.totalTime) * -1 : (report.totalTime - report.monthlyGoal) * -1;
    remainingTimeText =
      progress > 1 ? `Overworked time: ${formatTime(remainingTime)}` : `Remaining time: ${formatTime(remainingTime)}`;
  }

  return { progress, remainingTimeText };
}
