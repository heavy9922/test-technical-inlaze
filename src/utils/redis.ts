import { createHash } from 'crypto';
export const generateKey = (text: string) => {
  return createHash('md5').update(text).digest('hex');
};
