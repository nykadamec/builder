"use client";

import React from "react";
import Header from "@/components/layout/Header";
import { builder_area as Builder } from "@/components/builder/builder_area";
import { Footer } from "@/components/layout/Footer";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

function BuilderContent() {
  return (
    <div className="flex min-h-screen flex-col text-white antialiased selection:bg-white/10 selection:text-white">
      <Header variant="landing" />
      <main className="flex flex-1 items-start justify-center px-6 py-16">
        <Builder />
      </main>
      <Footer />
    </div>
  );
}

export default function BuilderPage() {
  return (
    <ProtectedRoute>
      <BuilderContent />
    </ProtectedRoute>
  );
}
