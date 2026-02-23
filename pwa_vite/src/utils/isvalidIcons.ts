// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isValidIcon = (value: any): value is string => {
  return typeof value === 'string' && 
         value.trim().length > 0 && 
         value.startsWith('https') && 
         /\.(jpg|jpeg|png|webp|avif|svg)$/.test(value); 
  };