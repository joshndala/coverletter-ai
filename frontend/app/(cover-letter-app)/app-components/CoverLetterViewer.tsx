"use client";

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { FileText, Copy, Download, Edit, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { CoverLetter, updateCoverLetter } from '../api/cover-letter';
import { toast } from "@/components/ui/use-toast";

interface CoverLetterViewerProps {
  coverLetter: CoverLetter;
}

export default function CoverLetterViewer({ coverLetter }: CoverLetterViewerProps) {
  // Process the content to handle literal \n characters
  const processContent = (content: string | null | undefined): string => {
    if (!content) return '';
    
    // Replace literal '\n' with actual newlines
    return content.replace(/\\n/g, '\n');
  };
  
  const initialContent = processContent(coverLetter.generated_content);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  
  // If cover letter content changes (e.g., from API update), update the edited content
  useEffect(() => {
    setEditedContent(processContent(coverLetter.generated_content));
  }, [coverLetter.generated_content]);
  
  // Mock data for review section - in a real app this would come from an API
  const jobMatchPercentage = 75;
  const reviewPoints = [
    { text: "Your experience with React.js matches the job requirements", positive: true },
    { text: "4+ years of experience in software development aligns with their needs", positive: true },
    { text: "Limited management experience might be a challenge for this senior position", positive: false },
    { text: "Your portfolio of projects demonstrates relevant skills", positive: true },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editedContent);
      toast({
        title: "Copied!",
        description: "Cover letter content copied to clipboard",
      });
    } catch (err) {
      console.error("Failed to copy text: ", err);
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleDownloadPDF = () => {
    // In a real app, this would generate and download a PDF
    console.log("Downloading PDF...");
    toast({
      title: "Coming Soon",
      description: "PDF download functionality will be available soon",
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateCoverLetter(coverLetter.id, {
        generated_content: editedContent
      });
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Cover letter has been updated",
      });
    } catch (error) {
      console.error("Error saving cover letter:", error);
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Extract job title from job description or use "Position" as fallback
  const getJobTitle = () => {
    if (coverLetter.job_description) {
      // Try to extract title from first few lines of job description
      const firstLines = coverLetter.job_description.split('\n').slice(0, 5).join(' ');
      const titleMatch = firstLines.match(/(?:position|job title|role|title)[\s:]+([^.,]+)/i);
      if (titleMatch && titleMatch[1]) {
        return titleMatch[1].trim();
      }
    }
    return "Position at " + coverLetter.company_name;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-2">{getJobTitle()}</h1>
      <h2 className="text-xl text-gray-600 mb-6">{coverLetter.company_name}</h2>
      
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
                    disabled={isSaving}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {isEditing ? "Cancel" : "Edit"}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleCopy}
                    disabled={isSaving}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleDownloadPDF}
                    disabled={isSaving}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </div>
              <CardDescription>
                Last updated on {new Date(coverLetter.updated_at || coverLetter.created_at || new Date()).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {isEditing ? (
                <div className="space-y-4">
                  <Textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="min-h-[500px] font-serif text-base leading-relaxed p-4"
                    disabled={isSaving}
                  />
                  <Button onClick={handleSave} className="mt-4" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              ) : (
                <div className="prose prose-primary max-w-none font-serif text-base leading-relaxed whitespace-pre-wrap">
                  {editedContent || <em className="text-gray-400">No content generated yet.</em>}
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