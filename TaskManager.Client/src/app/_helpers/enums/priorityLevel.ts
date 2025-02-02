export enum PriorityLevel {
  Low = 0,
  Medium = 1,
  High = 2,
  Critical = 3,
}
export function getPriorityLevelLabel(priority?: PriorityLevel): string {
  if (priority === undefined || priority === null) return 'Unknown';

  switch (priority) {
    case PriorityLevel.Low:
      return 'Low';
    case PriorityLevel.Medium:
      return 'Medium';
    case PriorityLevel.High:
      return 'High';
    case PriorityLevel.Critical:
      return 'Critical';
    default:
      return 'No priority';
  }
}
export function getPriorityClass(priority: PriorityLevel): string {
  switch (priority) {
    case PriorityLevel.Low:
      return 'btn-success';
    case PriorityLevel.Medium:
      return 'btn-info';
    case PriorityLevel.High:
      return 'btn-warning';
    case PriorityLevel.Critical:
      return 'btn-danger';
    default:
      return 'btn-primary';
  }
}
