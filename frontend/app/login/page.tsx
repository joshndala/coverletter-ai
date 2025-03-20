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
import { signInWithEmail, signInWithGoogle } from "@/lib/firebase" // Import from your existing file

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast({
        title: "Missing information",
        description: "Please enter both email and password.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const userData = await signInWithEmail(email, password)
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${userData.full_name || 'User'}!`,
      })
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Login error:", error)
      toast({
        title: "Login Failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async (e: React.MouseEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // Using your existing Google auth function
      const userData = await signInWithGoogle()
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${userData.full_name || 'User'}!`,
      })
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Google login error:", error)
      toast({
        title: "Login Failed",
        description: error.message || "An error occurred during Google login. Please try again.",
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
          <CardTitle className="text-secondary">Login</CardTitle>
          <CardDescription className="text-secondary/70">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid w-full items-center gap-4">
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
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
                <Button 
                  type="button"
                  variant="outline" 
                  className="w-full" 
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                >
                  <FcGoogle className="mr-2" /> 
                  {isLoading ? "Logging in..." : "Login with Google"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="text-sm text-center text-secondary">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}