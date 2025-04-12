import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/context/AuthContext"

// Font configuration
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CoverForMe",
  description: "Generate tailored cover letters for your job applications",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // This will be used in client components only
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}

