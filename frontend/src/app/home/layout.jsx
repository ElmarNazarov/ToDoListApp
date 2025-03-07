"use client";

import React from "react";
import { UserProvider } from "@/context/UserContext"; // Import UserProvider
import Header from "@/components/Header";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function HomeLayout({ children }) {
  
  return (
    <UserProvider>
      <ProtectedRoute>
        <div className="flex h-screen overflow-hidden">
          <div className="flex-1 flex flex-col">
            <Header />
            <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
              {children}
            </main>
          </div>
        </div>
      </ProtectedRoute>
    </UserProvider>
  );
}
