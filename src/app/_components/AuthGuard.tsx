'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const AUTH_KEY = 'ma_admin_authed';

export function setAdminAuth(): void {
  sessionStorage.setItem(AUTH_KEY, 'true');
}

export function clearAdminAuth(): void {
  sessionStorage.removeItem(AUTH_KEY);
}

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(AUTH_KEY) !== 'true') {
      router.replace('/admin');
    } else {
      setChecked(true);
    }
  }, [router]);

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-navy border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
