import { Rubik } from 'next/font/google';

export const rubik = Rubik({
  weight: ['300', '400', '500', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-rubik',
  preload: true,
});
