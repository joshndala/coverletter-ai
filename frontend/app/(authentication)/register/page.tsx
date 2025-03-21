"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { FcGoogle } from "react-icons/fc"
import Image from "next/image"
import { registerWithEmail, signInWithGoogle } from "@/lib/firebase"

export default function Register() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate inputs
    if (!email || !password || !fullName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to register.",
        variant: "destructive",
      })
      return
    }
    
    setIsLoading(true)
    try {
      // Use the integrated function that handles backend registration
      const userData = await registerWithEmail(email, password, fullName)
      
      toast({
        title: "Registration Successful",
        description: "Your account has been created. Welcome!",
      })
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Registration error:", error)
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred during registration. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleRegister = async (e: React.MouseEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // The Google sign-in function already handles backend registration
      const userData = await signInWithGoogle()
      
      toast({
        title: "Registration Successful",
        description: "Your account has been created with Google. Welcome!",
      })
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Google registration error:", error)
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred during Google registration. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
      <Card className="w-[350px] bg-primary">
        <div className="flex justify-center mt-6">
          <Image
            src="/coverforme_logo.png"
            alt="CoverForMe Logo"
            width={200}
            height={80}
            priority
          />
        </div>
        <CardHeader>
          <CardTitle className="text-secondary">Register</CardTitle>
          <CardDescription className="text-secondary/70">
            Create an account to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="fullName" className="text-secondary">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-white text-primary placeholder:text-primary/50"
                  disabled={isLoading}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email" className="text-secondary">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white text-primary placeholder:text-primary/50"
                  disabled={isLoading}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password" className="text-secondary">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white text-primary placeholder:text-primary/50"
                  disabled={isLoading}
                />
              </div>
              <div className="flex flex-col space-y-2 pt-4">
                <Button 
                  type="submit" 
                  variant="outline" 
                  className="w-full bg-white text-primary" 
                  disabled={isLoading}
                >
                  {isLoading ? "Registering..." : "Register"}
                </Button>
                <Button 
                  type="button"
                  variant="outline" 
                  className="w-full" 
                  onClick={handleGoogleRegister}
                  disabled={isLoading}
                >
                  <FcGoogle className="mr-2" /> 
                  {isLoading ? "Connecting..." : "Register with Google"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="text-sm text-center text-secondary">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}