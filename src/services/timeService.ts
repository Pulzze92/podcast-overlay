export const formatTime = (offset: number) => {
  const date = new Date();
  date.setHours(date.getHours() + offset);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};
