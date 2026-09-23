'use client';

import React, { Suspense, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { makeQueryClient } from '@/lib/query/query-client';
import { env } from '@/lib/config/env';

import { TopProgressBar } from '@/components/common/TopProgressBar';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => makeQueryClient());

  // Configured entirely through environment variables. No credential is ever
  // hardcoded in source — see the reorganization docs, section 7.
  const googleClientId = env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const app = (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <Suspense fallback={null}>
          <TopProgressBar />
        </Suspense>
        {children}
        <ToastContainer position="top-right" autoClose={3000} />
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </Provider>
    </QueryClientProvider>
  );

  // When no client ID is configured we still render the app; the Google
  // sign-in button simply has no provider to attach to.
  if (!googleClientId) {
    return app;
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>{app}</GoogleOAuthProvider>
  );
}
