/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect } from 'react';
import Script from 'next/script';

// Extend the Window interface to include the umami property
declare global {
  interface Window {
    umami?: {
      (...args: any[]): void;
      q?: any[][];
    };
  }
}

export default function UmamiAnalytics() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      window.umami =
        window.umami ||
        function (...args) {
          (window.umami!.q = window.umami!.q || []).push(args);
        };
    }
  }, []);

  if (process.env.NODE_ENV !== 'production') {
    return null;
  }

  return (
    <Script
      async
      defer
      data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
      src={`${process.env.NEXT_PUBLIC_UMAMI_URL}/script.js`}
      strategy="afterInteractive"
    />
  );
}