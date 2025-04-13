
// Format time from API to readable format (e.g., "6:30pm")
export const formatTime = (time: string) => {
  if (!time) return "";
  const [hour, minute] = time.split(':');
  const hourNum = parseInt(hour, 10);
  const period = hourNum >= 12 ? 'pm' : 'am';
  const hour12 = hourNum % 12 || 12; // Convert 0 to 12 for 12am
  return `${hour12}:${minute}${period}`;
};

// Format date from API to readable format (e.g., "January 1, 2025")
export const formatDate = (date: string) => {
  if (!date) return "";
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
};
