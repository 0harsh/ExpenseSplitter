"use client";

import React from 'react';
import { UserProvider } from './UserContext';

interface Props {
  children: React.ReactNode;
}

export default function DashboardUserProvider({ children }: Props) {
  return <UserProvider>{children}</UserProvider>;
}
