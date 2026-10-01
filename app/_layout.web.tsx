import React from 'react';
import { AnimaProvider } from '@/web/Store';
import AppShell from '@/web/AppShell';
import '@/web/styles.css';
export default function WebLayout() {
  return (
    <AnimaProvider>
      <AppShell />
    </AnimaProvider>
  );
}
