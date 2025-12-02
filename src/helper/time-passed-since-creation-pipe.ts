import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timePassedSinceCreation',
  pure: true
})
export class TimePassedSinceCreationPipe implements PipeTransform {

  transform(value: any): string {
    if (!value) return '';

    // Firestore Timestamp
    if (value?.seconds && value?.nanoseconds !== undefined) {
      value = new Date(value.seconds * 1000);
    }

    // If value has toDate() method (Timestamp)
    if (typeof value?.toDate === 'function') {
      value = value.toDate();
    }

    // If it's a Date, convert to ms
    const timeInMilliseconds =
      value instanceof Date ? value.getTime() : value;

    const now = Date.now();
    let diff = now - timeInMilliseconds;

    if (diff < 0) return "in the future";

    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;

    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ago`;

    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`;

    const years = Math.floor(days / 365);
    return `${years} year${years !== 1 ? 's' : ''} ago`;
  }

}
