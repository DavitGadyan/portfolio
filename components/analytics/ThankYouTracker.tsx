'use client';
import { useEffect } from 'react';
import { fireLead } from '@/lib/track';

export function ThankYouTracker() {
  useEffect(() => { fireLead('thank_you_page'); }, []);
  return null;
}
