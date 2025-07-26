'use client';

import { useState } from 'react';
import Image from 'next/image';
import Loader from '@/components/Loader';

export default function Announcements() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="flex justify-center items-center min-h-screen w-screen overflow-hidden">
      {loading && <Loader text="Loading Announcements..." />}

      <div className={`${loading ? 'hidden' : 'block'} w-screen h-screen relative -z-0`}>
        <Image
          src="/photos/nalanda.jpeg"
          alt="Nalanda"
          fill
          priority
          onLoad={() => setLoading(false)}
          onError={() => setLoading(false)}
          className="object-contain opacity-70 transition-opacity duration-500"
        />
      </div>
    </div>
  );
}
