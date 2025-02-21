export const generateTemporaryPassword = (): string => {
  const length = 12;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  
  // Ensure at least one of each required character type
  password += getRandomChar('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  password += getRandomChar('abcdefghijklmnopqrstuvwxyz'); 
  password += getRandomChar('0123456789');
  password += getRandomChar('!@#$%^&*');
  
  // Fill the rest randomly
  while (password.length < length) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

const getRandomChar = (charset: string): string => {
  return charset[Math.floor(Math.random() * charset.length)];
}; 