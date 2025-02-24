import React from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, FileText, Briefcase, ArrowRight } from "lucide-react";

const MOCK_COVER_LETTERS = [
  {
    id: 1,
    company: "Tech Giants Inc",
    position: "Senior Frontend Developer",
    createdAt: "2024-02-05",
    content: "Dear Hiring Manager..."
  },
  {
    id: 2,
    company: "Startup Innovators",
    position: "Full Stack Engineer",
    createdAt: "2024-02-03",
    content: "Dear Hiring Team..."
  }
];

const Dashboard = () => {
  const coverLetters = MOCK_COVER_LETTERS;
  
  return (
    <div className="min-h-screen bg-[#F5F5F0]"> {/* Light beige background */}
      <div className="container mx-auto p-6 space-y-8">
        {/* Welcome Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-3 text-primary">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Manage your professional profile and create compelling cover letters
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Link href="/skills-and-experiences">
            <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary cursor-pointer overflow-hidden bg-white">
              <CardContent className="p-0">
                <div className="relative p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                      <Briefcase className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl mb-1 text-primary">Skills & Experience</h3>
                      <p className="text-sm text-gray-600">Manage your professional background</p>
                    </div>
                  </div>
                  <ArrowRight className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300 text-primary" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/generate-cover-letter">
            <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary cursor-pointer overflow-hidden bg-white">
              <CardContent className="p-0">
                <div className="relative p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                      <FileText className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl mb-1 text-primary">New Cover Letter</h3>
                      <p className="text-sm text-gray-600">Generate a tailored cover letter</p>
                    </div>
                  </div>
                  <ArrowRight className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300 text-primary" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Cover Letters Section */}
        <Card className="shadow-lg bg-white">
          <CardHeader className="flex flex-row items-center justify-between border-b">
            <div>
              <CardTitle className="text-2xl font-bold text-primary">
                Your Cover Letters
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Access and manage your personalized cover letters
              </p>
            </div>
            <Button className="bg-primary hover:bg-primary/90">
              <PlusCircle className="w-4 h-4 mr-2" />
              New Cover Letter
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            {coverLetters.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Generate Your First Cover Letter!</h3>
                <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
                  Create personalized cover letters tailored to your experience and stand out to potential employers
                </p>
                <Button className="bg-primary hover:bg-primary/90">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Get Started
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {coverLetters.map((letter) => (
                  <Card key={letter.id} className="group hover:shadow-md transition-all duration-300 hover:border-primary cursor-pointer bg-white">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <h4 className="font-semibold text-lg text-primary group-hover:text-primary/80 transition-colors">
                            {letter.position}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {letter.company}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-600">
                            {new Date(letter.createdAt).toLocaleDateString()}
                          </span>
                          <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300 text-primary" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;