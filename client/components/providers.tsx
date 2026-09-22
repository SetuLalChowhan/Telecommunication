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

  const googleClientId =
    env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    '361815179987-ij66diq58l1u9h0b910mh4fl65d1v0t5.apps.googleusercontent.com';

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
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
    </GoogleOAuthProvider>
  );
}
