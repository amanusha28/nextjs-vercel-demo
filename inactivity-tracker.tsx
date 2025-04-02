// components/inactivity-tracker.tsx
'use client';

import { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';

export default function InactivityTracker() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!session) return;

    let timeout: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        signOut({ redirect: false }).then(() => {
          router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
        });
      }, 180_000); // 3 minutes
    };

    const events = ['mousedown', 'mousemove', 'keydown', 'scroll'];
    events.forEach(e => window.addEventListener(e, resetTimer));
    
    resetTimer(); // Initial setup
    
    return () => {
      clearTimeout(timeout);
      events.forEach(e => window.removeEventListener(e, resetTimer));
    };
  }, [session, router, pathname]);

  return null;
}
