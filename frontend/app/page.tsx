import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Welcome() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
      <h1 className="text-4xl font-bold mb-6 text-center">AI Cover Letter Generator</h1>
      <p className="text-xl mb-8 text-center max-w-2xl">
        Create personalized cover letters using AI. Sign up to manage your experiences and generate tailored cover
        letters for your job applications.
      </p>
      <div className="space-x-4">
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/register">Register</Link>
        </Button>
      </div>
    </div>
  )
}