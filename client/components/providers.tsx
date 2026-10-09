'use client';

import React, { Suspense, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { makeQueryClient } from '@/lib/query/query-client';
import { env } from '@/lib/config/env';

import { TopProgressBar } from '@/components/common/TopProgressBar';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => makeQueryClient());

  const googleClientId =
    process.env.NEXT_PRIVATE_GOOGLE_CLIENT_ID ||
    env.NEXT_PRIVATE_GOOGLE_CLIENT_ID ||
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    process.env.GOOGLE_CLIENT_ID ||
    '';

  const app = (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={null}>
        <TopProgressBar />
      </Suspense>
      {children}
      <ToastContainer position="top-right" autoClose={3000} />
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );

  return (
    <GoogleOAuthProvider clientId={googleClientId || 'no-client-id'}>
      {app}
    </GoogleOAuthProvider>
  );
}
