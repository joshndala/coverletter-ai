"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import Link from "next/link"
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { auth } from "../../lib/firebase"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { FcGoogle } from "react-icons/fc"

export default function Register() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      toast({
        title: "Registration Successful",
        description: "Your account has been created. Welcome!",
      })
      router.push("/dashboard")
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        title: "Registration Failed",
        description: "An error occurred during registration. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleGoogleRegister = async () => {
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
      toast({
        title: "Registration Successful",
        description: "Your account has been created with Google. Welcome!",
      })
      router.push("/dashboard")
    } catch (error) {
      console.error("Google registration error:", error)
      toast({
        title: "Registration Failed",
        description: "An error occurred during Google registration. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Create an account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button className="w-full" onClick={handleRegister}>
            Register
          </Button>
          <Button variant="outline" className="w-full" onClick={handleGoogleRegister}>
            <FcGoogle className="mr-2" /> Register with Google
          </Button>
          <p className="text-sm text-center">
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

