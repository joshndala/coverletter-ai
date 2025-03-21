"use client"

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Briefcase, AlertCircle, Loader2, Code, FolderGit2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Example job description for the placeholder
const EXAMPLE_JOB_DESCRIPTION = `We are seeking a Marketing Manager to join our team...

Key Responsibilities:
- Develop and implement marketing strategies
- Lead campaign planning and execution
- Manage team of marketing professionals
- Track and analyze campaign performance

Requirements:
- 5+ years of marketing experience
- Strong leadership and communication skills
- Experience with digital marketing platforms
- Bachelor's degree in Marketing or related field`;

// Mock experiences from the user's profile
const MOCK_EXPERIENCES = [
  {
    id: 1,
    title: "Marketing Manager",
    company: "Global Brands Inc",
    period: "2022 - Present",
    highlights: [
      "Led successful marketing campaigns resulting in 45% increase in engagement",
      "Managed a team of 8 marketing professionals across different specialties",
      "Developed and executed digital marketing strategies for major product launches"
    ]
  },
  {
    id: 2,
    title: "Project Coordinator",
    company: "Innovation Solutions",
    period: "2020 - 2022",
    highlights: [
      "Coordinated cross-functional teams for multiple concurrent projects",
      "Improved project delivery efficiency by implementing new management tools",
      "Managed client relationships and expectations effectively"
    ]
  },
  {
    id: 3,
    title: "Marketing Associate",
    company: "Creative Agency",
    period: "2019 - 2020",
    highlights: [
      "Assisted in developing marketing strategies for various client campaigns",
      "Created content for social media platforms and websites",
      "Conducted market research and competitor analysis"
    ]
  }
];

// Add Project interface
interface Project {
  id: number;
  title: string;
  technologies: string[];
  date: string;
  description?: string;
  highlights: string[];
  link?: string;
}

// Add MOCK_PROJECTS data
const MOCK_PROJECTS: Project[] = [
  {
    id: 1,
    title: "Personal Portfolio Website",
    technologies: ["React", "TypeScript", "Tailwind CSS"],
    date: "Jan 2024",
    description: "A modern portfolio website showcasing my work and skills",
    highlights: [
      "Implemented responsive design with modern UI/UX principles",
      "Integrated dark mode and accessibility features",
      "Achieved 95+ performance score on Lighthouse"
    ],
    link: "https://portfolio.example.com"
  },
  {
    id: 2,
    title: "Community Event Platform",
    technologies: ["Next.js", "Node.js", "PostgreSQL"],
    date: "Nov 2023",
    description: "A platform for organizing and managing local community events",
    highlights: [
      "Built full-stack application with real-time updates",
      "Implemented user authentication and authorization",
      "Developed API for event management and RSVPs"
    ],
    link: "https://github.com/username/event-platform"
  }
];

const CoverLetterGenerator = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [hiringManager, setHiringManager] = useState('');
  const [selectedExperiences, setSelectedExperiences] = useState<number[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<number[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [showTips, setShowTips] = useState(true);
  const [useAiSelection, setUseAiSelection] = useState(true);

  const handleExperienceToggle = (experienceId: number) => {
    setSelectedExperiences(prev => 
      prev.includes(experienceId)
        ? prev.filter(id => id !== experienceId)
        : [...prev, experienceId]
    );
  };

  const handleProjectToggle = (projectId: number) => {
    setSelectedProjects(prev => 
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const handleGenerateCoverLetter = async () => {
    if (!jobDescription || !companyName || 
        (!useAiSelection && selectedExperiences.length === 0 && selectedProjects.length === 0)) return;
    
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setGeneratedLetter(`Dear ${hiringManager || 'Hiring Manager'} at ${companyName},\n\nI am writing to express my strong interest in the position...`);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary">
            Generate Cover Letter
          </h1>
          <p className="text-gray-600 mt-2">
            Create a personalized cover letter for your job application
          </p>
        </div>

        <div className="space-y-6 max-w-4xl mx-auto">
          {showTips && (
            <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                For best results, paste the complete job description and select relevant experiences that match the requirements.
              </AlertDescription>
            </Alert>
          )}

          {/* Job Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Job Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name*</Label>
                  <Input
                    id="companyName"
                    placeholder="e.g., Acme Corporation"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hiringManager">Hiring Manager's Name (Optional)</Label>
                  <Input
                    id="hiringManager"
                    placeholder="e.g., John Smith"
                    value={hiringManager}
                    onChange={(e) => setHiringManager(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobDescription">Job Description*</Label>
                <Textarea
                  id="jobDescription"
                  placeholder={EXAMPLE_JOB_DESCRIPTION}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-[200px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Experience Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Select Relevant Experience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <Switch
                  checked={useAiSelection}
                  onCheckedChange={setUseAiSelection}
                  id="ai-selection"
                />
                <Label htmlFor="ai-selection">Let AI select the most relevant experiences</Label>
              </div>

              <Tabs defaultValue="work" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="work" className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Work Experience
                  </TabsTrigger>
                  <TabsTrigger value="projects" className="flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    Projects
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="work" className="space-y-4">
                  {MOCK_EXPERIENCES.map((exp) => (
                    <div
                      key={exp.id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        useAiSelection ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                      } ${
                        selectedExperiences.includes(exp.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-transparent bg-gray-50 dark:bg-gray-800'
                      }`}
                      onClick={() => !useAiSelection && handleExperienceToggle(exp.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={selectedExperiences.includes(exp.id)}
                          onCheckedChange={() => !useAiSelection && handleExperienceToggle(exp.id)}
                          disabled={useAiSelection}
                        />
                        <div>
                          <h3 className="font-semibold text-lg">{exp.title}</h3>
                          <p className="text-primary font-medium">{exp.company}</p>
                          <p className="text-sm text-muted-foreground">{exp.period}</p>
                          <ul className="mt-2 space-y-1">
                            {exp.highlights.map((highlight, index) => (
                              <li key={index} className="text-sm text-gray-600 dark:text-gray-300">
                                • {highlight}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="projects" className="space-y-4">
                  {MOCK_PROJECTS.map((project) => (
                    <div
                      key={project.id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        useAiSelection ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                      } ${
                        selectedProjects.includes(project.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-transparent bg-gray-50 dark:bg-gray-800'
                      }`}
                      onClick={() => !useAiSelection && handleProjectToggle(project.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={selectedProjects.includes(project.id)}
                          onCheckedChange={() => !useAiSelection && handleProjectToggle(project.id)}
                          disabled={useAiSelection}
                        />
                        <div className="space-y-2 flex-1">
                          <div>
                            <h3 className="font-semibold text-lg">{project.title}</h3>
                            <p className="text-sm text-muted-foreground">{project.date}</p>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>

                          <ul className="mt-2 space-y-1">
                            {project.highlights.map((highlight, index) => (
                              <li key={index} className="text-sm text-gray-600 dark:text-gray-300">
                                • {highlight}
                              </li>
                            ))}
                          </ul>

                          {project.link && (
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-sm text-primary hover:underline"
                            >
                              <FolderGit2 className="w-4 h-4 mr-1" />
                              View Project
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Generate Button */}
          <Button
            className="w-full"
            size="lg"
            disabled={
              !jobDescription || 
              !companyName || 
              (!useAiSelection && selectedExperiences.length === 0 && selectedProjects.length === 0) || 
              isGenerating
            }
            onClick={handleGenerateCoverLetter}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Cover Letter'
            )}
          </Button>

          {/* Generated Letter Preview */}
          {generatedLetter && (
            <Card>
              <CardHeader>
                <CardTitle>Your Cover Letter</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={generatedLetter}
                  className="min-h-[300px] font-serif"
                  readOnly
                />
                <div className="flex gap-2">
                  <Button
                    onClick={() => navigator.clipboard.writeText(generatedLetter)}
                  >
                    Copy to Clipboard
                  </Button>
                  <Button variant="outline">
                    Download as PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoverLetterGenerator;