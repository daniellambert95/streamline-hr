export const getGreeting = (): string => {
  const currentHour = new Date().getHours();
  
  if (currentHour < 12) {
    return "Good morning";
  } else {
    return "Good evening";
  }
}; 