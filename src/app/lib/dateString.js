export default function formatDateMonthDayTime(date) {
    return date.toLocaleString('en-US', {
      month: 'short',    // "Aug"
      day: 'numeric',    // "22"
      hour: 'numeric',   // "3"
      minute: '2-digit', // "45" 
      hour12: true       // Use AM/PM
    });
  }