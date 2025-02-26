export const getGreeting = (): string => {
  const currentHour = new Date().getHours();
  
  if (currentHour < 12) {
    return "Good morning";
  } else if (currentHour < 18) {
    return "Good afternoon";
  } else if (currentHour < 21) {
    return "Good evening";
  } else {
    return "Good night";
  }
}; 