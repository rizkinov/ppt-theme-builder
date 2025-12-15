"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BuilderPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/builder/theme');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-dark-grey font-calibre">Redirecting to Theme Colors...</p>
    </div>
  );
}
