export function localizeTime(date: Date) {
  return date.toLocaleTimeString('en-GB', {
    timeZone: 'Asia/Kathmandu',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function localizeDate(date: Date) {
  return date.toLocaleDateString('en-CA', {
    timeZone: 'Asia/Kathmandu',
  });
}
