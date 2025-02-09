import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function Welcome() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary">
      <div className="mb-8">
        <Image
          src="/coverforme_logo_transparent.png"
          alt="CoverForMe Logo"
          width={700}
          height={350}
          priority
        />
      </div>
      <p className="text-xl mb-8 text-center max-w-2xl text-primary-foreground">
        With CoverForMe, create personalized cover letters using AI. Sign up to manage your experiences and generate tailored cover
        letters for your job applications.
      </p>
      <div className="space-x-4">
        <Button asChild className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
          <Link href="/login">Login</Link>
        </Button>
        <Button 
          asChild 
          variant="outline" 
          className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
        >
          <Link href="/register">Register</Link>
        </Button>
      </div>
    </div>
  )
}