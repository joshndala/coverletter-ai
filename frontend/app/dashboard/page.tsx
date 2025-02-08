"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../../lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"

// Mock data for development
const MOCK_EXPERIENCES = [
  { 
    id: 1, 
    title: "Senior Frontend Developer", 
    company: "Tech Giants Inc", 
    description: "Led development of core user-facing features using React and TypeScript. Implemented state management solutions and optimized performance." 
  },
  { 
    id: 2, 
    title: "Full Stack Engineer", 
    company: "Startup Innovators", 
    description: "Built scalable microservices architecture. Developed and maintained both frontend and backend systems using Node.js and React." 
  },
  { 
    id: 3, 
    title: "Software Engineering Intern", 
    company: "CodeCraft Labs", 
    description: "Collaborated on building internal tools. Gained hands-on experience with agile development practices and modern web technologies." 
  }
]

// Development mode flag - set to true to bypass authentication
const DEV_MODE = true  // For development, hardcode to true. Change to process.env.NODE_ENV === 'production' when deploying

// Mock user for development
const MOCK_USER = {
  uid: 'dev-user-123',
  email: 'dev@example.com',
  getIdToken: async () => 'mock-token-for-development'
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(DEV_MODE ? MOCK_USER : null)
  const [experiences, setExperiences] = useState(DEV_MODE ? MOCK_EXPERIENCES : [])
  const [newExperience, setNewExperience] = useState({ title: "", company: "", description: "" })
  const [jobDescription, setJobDescription] = useState("")
  const [selectedExperiences, setSelectedExperiences] = useState<number[]>([])
  const [coverLetter, setCoverLetter] = useState("")

  useEffect(() => {
    // In development mode, we don't need to check authentication
    if (DEV_MODE) {
      setUser(MOCK_USER)
      return
    }

    // Only check authentication in production
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
      } else {
        router.push("/login")
      }
    })

    return () => unsubscribe()
  }, [router])

  const handleAddExperience = () => {
    if (!newExperience.title || !newExperience.company) {
      toast({
        title: "Missing Information",
        description: "Please fill in at least the title and company.",
        variant: "destructive",
      })
      return
    }

    setExperiences([...experiences, { id: Date.now(), ...newExperience }])
    setNewExperience({ title: "", company: "", description: "" })
    toast({
      title: "Experience Added",
      description: "Your new experience has been added successfully.",
    })
  }

  const handleGenerateCoverLetter = async () => {
    try {
      if (!DEV_MODE && !user) {
        throw new Error("User not authenticated")
      }

      if (!jobDescription || selectedExperiences.length === 0) {
        toast({
          title: "Missing Information",
          description: "Please provide a job description and select at least one experience.",
          variant: "destructive",
        })
        return
      }

      // In development mode, generate a mock cover letter
      if (DEV_MODE) {
        // Commenting out the mock cover letter generation
        /*
        const mockCoverLetter = `Dear Hiring Manager,

I am writing to express my strong interest in the position at your company. With my background in software development and experience in [selected experiences], I believe I would be a valuable addition to your team.

[Mock cover letter content based on selected experiences and job description]

Thank you for considering my application.

Best regards,
Development User`

        setCoverLetter(mockCoverLetter)
        toast({
          title: "Cover Letter Generated (Dev Mode)",
          description: "Mock cover letter generated for development.",
        })
        return
        */
      }

      // Production API call
      const idToken = await user.getIdToken()
      const response = await fetch("http://localhost:8000/api/generate-cover-letter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          jobDescription,
          experiences: experiences.filter((exp) => selectedExperiences.includes(exp.id)),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate cover letter")
      }

      const data = await response.json()
      setCoverLetter(data.cover_letter)
      toast({
        title: "Cover Letter Generated",
        description: "Your personalized cover letter is ready!",
      })
    } catch (error) {
      console.error("Error generating cover letter:", error)
      toast({
        title: "Error",
        description: "Failed to generate cover letter. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Remove loading state in dev mode
  if (!DEV_MODE && !user) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      {DEV_MODE && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
          <p className="text-yellow-700">
            Development Mode Active - Authentication Bypassed
          </p>
        </div>
      )}
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <Tabs defaultValue="experiences" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="experiences">Manage Experiences</TabsTrigger>
          <TabsTrigger value="generate">Generate Cover Letter</TabsTrigger>
        </TabsList>

        <TabsContent value="experiences">
          <Card>
            <CardHeader>
              <CardTitle>Your Experiences</CardTitle>
              <CardDescription>Add and manage your professional experiences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp.id} className="p-4 border rounded hover:border-primary transition-colors">
                    <h3 className="font-bold">{exp.title}</h3>
                    <p className="text-sm text-muted-foreground">{exp.company}</p>
                    <p className="mt-2 text-sm">{exp.description}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Software Engineer"
                    value={newExperience.title}
                    onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    placeholder="e.g., Tech Company Inc"
                    value={newExperience.company}
                    onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your role and key achievements..."
                    value={newExperience.description}
                    onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                    className="min-h-[100px]"
                  />
                </div>
                <Button onClick={handleAddExperience} className="w-full">
                  Add Experience
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generate">
          <Card>
            <CardHeader>
              <CardTitle>Generate Cover Letter</CardTitle>
              <CardDescription>Create a personalized cover letter using AI</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="jobDescription">Job Description</Label>
                  <Textarea
                    id="jobDescription"
                    placeholder="Paste the job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="min-h-[200px]"
                  />
                </div>

                <div className="space-y-4">
                  <Label>Select Relevant Experiences</Label>
                  <div className="space-y-2">
                    {experiences.map((exp) => (
                      <div key={exp.id} className="flex items-start space-x-2">
                        <Checkbox
                          id={`exp-${exp.id}`}
                          checked={selectedExperiences.includes(exp.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedExperiences([...selectedExperiences, exp.id])
                            } else {
                              setSelectedExperiences(selectedExperiences.filter((id) => id !== exp.id))
                            }
                          }}
                          className="mt-1"
                        />
                        <Label htmlFor={`exp-${exp.id}`} className="leading-none">
                          <span className="font-medium">{exp.title}</span>
                          <span className="block text-sm text-muted-foreground">
                            at {exp.company}
                          </span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleGenerateCoverLetter}
                  className="w-full"
                  disabled={!jobDescription || selectedExperiences.length === 0}
                >
                  Generate Cover Letter
                </Button>

                {coverLetter && (
                  <div className="space-y-4">
                    <Label htmlFor="coverLetter">Generated Cover Letter</Label>
                    <Textarea
                      id="coverLetter"
                      value={coverLetter}
                      readOnly
                      className="min-h-[400px]"
                    />
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => {
                          navigator.clipboard.writeText(coverLetter)
                          toast({
                            title: "Copied",
                            description: "Cover letter copied to clipboard",
                          })
                        }}
                      >
                        Copy to Clipboard
                      </Button>
                      <Button variant="outline" onClick={() => window.print()}>
                        Print
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}