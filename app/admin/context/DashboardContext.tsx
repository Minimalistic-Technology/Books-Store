// context/DashboardContext.tsx
"use client";

import { createContext, useContext, Dispatch, SetStateAction } from "react";

// Define the shape of the context
interface DashboardContextType {
  setMetrics: Dispatch<
    SetStateAction<{
      userCount: number | null;
      orderCount: number | null;
      completedOrders: number | null;
    }>
  >;
}

// Create Context
const DashboardContext = createContext<DashboardContextType>({
  setMetrics: () => {},
});

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error(
      "useDashboard must be used within a DashboardContext.Provider"
    );
  }
  return context;
}

export default DashboardContext;