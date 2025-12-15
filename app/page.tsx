"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the builder
    router.push('/builder');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-xl font-calibre">Redirecting to PPT Builder...</p>
    </div>
  );
}
