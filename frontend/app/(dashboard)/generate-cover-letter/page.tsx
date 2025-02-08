"use client"

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Briefcase, AlertCircle, Loader2 } from "lucide-react";

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

const CoverLetterGenerator = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [hiringManager, setHiringManager] = useState('');
  const [selectedExperiences, setSelectedExperiences] = useState<number[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [showTips, setShowTips] = useState(true);

  const handleExperienceToggle = (experienceId: number) => {
    setSelectedExperiences(prev => 
      prev.includes(experienceId)
        ? prev.filter(id => id !== experienceId)
        : [...prev, experienceId]
    );
  };

  const handleGenerateCoverLetter = async () => {
    if (!jobDescription || !companyName || selectedExperiences.length === 0) return;
    
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setGeneratedLetter(`Dear ${hiringManager || 'Hiring Manager'} at ${companyName},\n\nI am writing to express my strong interest in the position...`);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Generate Cover Letter
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
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
              <div className="space-y-4">
                {MOCK_EXPERIENCES.map((exp) => (
                  <div
                    key={exp.id}
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      selectedExperiences.includes(exp.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-transparent bg-gray-50 dark:bg-gray-800'
                    }`}
                    onClick={() => handleExperienceToggle(exp.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        checked={selectedExperiences.includes(exp.id)}
                        onCheckedChange={() => handleExperienceToggle(exp.id)}
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
              </div>
            </CardContent>
          </Card>

          {/* Generate Button */}
          <Button
            className="w-full"
            size="lg"
            disabled={!jobDescription || !companyName || selectedExperiences.length === 0 || isGenerating}
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