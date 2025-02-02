export enum ProgressStatus {
  NotStarted = 0,
  Stuck = 1,
  InProgress = 2,
  Done = 3,
}
export function getProgressStatusLabel(status?: ProgressStatus): string {
  if (status === undefined || status === null) return 'Unknown';

  switch (status) {
    case ProgressStatus.NotStarted:
      return 'Not Started';
    case ProgressStatus.Stuck:
      return 'Stuck';
    case ProgressStatus.InProgress:
      return 'In Progress';
    case ProgressStatus.Done:
      return 'Done';
    default:
      return 'Unknown';
  }
}
export function getStatusClass(status: ProgressStatus): string {
  switch (status) {
    case ProgressStatus.NotStarted:
      return 'btn-primary';
    case ProgressStatus.Stuck:
      return 'btn-danger';
    case ProgressStatus.InProgress:
      return 'btn-info';
    case ProgressStatus.Done:
      return 'btn-success';
    default:
      return 'btn-primary';
  }
}
