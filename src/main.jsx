import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from "react-router";
import { router } from './Router/Router.jsx';
import AuthProvider from './Context/AuthProvider.jsx';

// 🔥 React Query import
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 🔥 Query Client তৈরি
const queryClient = new QueryClient();

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
