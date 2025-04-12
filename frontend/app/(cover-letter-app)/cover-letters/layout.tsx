import React from "react";

export default function CoverLettersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex-1">
      {children}
    </main>
  );
} 