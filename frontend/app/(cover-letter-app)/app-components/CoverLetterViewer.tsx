"use client";

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { FileText, Copy, Download, Edit, CheckCircle, XCircle } from "lucide-react";

interface CoverLetterViewerProps {
  coverLetter: {
    id: string | number;
    company: string;
    position: string;
    content: string;
    createdAt: string;
    updatedAt: string;
  };
}

export default function CoverLetterViewer({ coverLetter }: CoverLetterViewerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(coverLetter.content);
  
  // Mock data for review section - in a real app this would come from an API
  const jobMatchPercentage = 75;
  const reviewPoints = [
    { text: "Your experience with React.js matches the job requirements", positive: true },
    { text: "4+ years of experience in software development aligns with their needs", positive: true },
    { text: "Limited management experience might be a challenge for this senior position", positive: false },
    { text: "Your portfolio of projects demonstrates relevant skills", positive: true },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(editedContent);
    // Could add a toast notification here
  };

  const handleDownloadPDF = () => {
    // In a real app, this would generate and download a PDF
    console.log("Downloading PDF...");
    // Implementation would typically involve a backend API call
  };

  const handleSave = () => {
    // In a real app, this would save the changes to the backend
    console.log("Saving changes...");
    setIsEditing(false);
    // Implementation would typically involve a backend API call
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-2">{coverLetter.position}</h1>
      <h2 className="text-xl text-gray-600 mb-6">{coverLetter.company}</h2>
      
      <Tabs defaultValue="cover-letter" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="cover-letter" className="text-base">
            <FileText className="w-4 h-4 mr-2" />
            Cover Letter
          </TabsTrigger>
          <TabsTrigger value="review" className="text-base">
            <CheckCircle className="w-4 h-4 mr-2" />
            Application Review
          </TabsTrigger>
        </TabsList>
        
        {/* Cover Letter Tab Content */}
        <TabsContent value="cover-letter" className="mt-0">
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gray-50 border-b">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">Your Cover Letter</CardTitle>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {isEditing ? "Cancel" : "Edit"}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleCopy}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleDownloadPDF}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </div>
              <CardDescription>
                Last updated on {new Date(coverLetter.updatedAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {isEditing ? (
                <div className="space-y-4">
                  <Textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="min-h-[500px] font-serif text-base leading-relaxed p-4"
                  />
                  <Button onClick={handleSave} className="mt-4">
                    Save Changes
                  </Button>
                </div>
              ) : (
                <div className="prose prose-primary max-w-none font-serif text-base leading-relaxed whitespace-pre-wrap">
                  {editedContent}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Review Tab Content */}
        <TabsContent value="review" className="mt-0">
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-xl">Application Fit Analysis</CardTitle>
              <CardDescription>
                Based on your profile and the job requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium">Job Match Score</h3>
                  <span className="text-lg font-bold">{jobMatchPercentage}%</span>
                </div>
                <Progress value={jobMatchPercentage} className="h-3" />
                <p className="mt-3 text-sm text-gray-500">
                  This score is calculated based on matching your skills and experiences with the job requirements.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Key Insights</h3>
                <div className="space-y-4">
                  {reviewPoints.map((point, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-md">
                      {point.positive ? (
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      )}
                      <p className={point.positive ? "text-gray-700" : "text-gray-600"}>
                        {point.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-blue-50 rounded-md">
                <h3 className="text-lg font-medium text-blue-700 mb-2">Recommendations</h3>
                <ul className="list-disc pl-5 space-y-2 text-blue-800">
                  <li>Emphasize your specific React.js projects and achievements</li>
                  <li>Include metrics and quantifiable results from your previous roles</li>
                  <li>Highlight any leadership experience, even if informal</li>
                  <li>Tailor your cover letter to address the company's specific needs</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 