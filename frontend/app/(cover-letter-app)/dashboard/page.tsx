"use client";

import React from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { 
  PlusCircle, 
  FileText, 
  Briefcase, 
  ArrowRight, 
  Clock, 
  CheckCircle, 
  ChevronRight,
  BarChart,
  User,
  Calendar
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

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

const MOCK_ACTIVITY = [
  {
    id: 1,
    type: "cover_letter_created",
    position: "Senior Frontend Developer",
    company: "Tech Giants Inc",
    date: "2024-02-05T10:30:00Z"
  },
  {
    id: 2,
    type: "experience_added",
    title: "Project Manager",
    company: "Digital Solutions Inc",
    date: "2024-02-04T14:15:00Z"
  },
  {
    id: 3,
    type: "project_added",
    title: "Personal Portfolio Website",
    date: "2024-02-02T09:20:00Z"
  }
];

const Dashboard = () => {
  const coverLetters = MOCK_COVER_LETTERS;
  const activities = MOCK_ACTIVITY;
  const { user } = useAuth();
  
  const renderActivityItem = (activity: any) => {
    const date = new Date(activity.date);
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);

    switch (activity.type) {
      case 'cover_letter_created':
        return (
          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="p-2 bg-primary/10 rounded-full">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Created cover letter for {activity.position}</p>
              <p className="text-xs text-gray-500">{activity.company}</p>
            </div>
            <span className="text-xs text-gray-500">{formattedDate}</span>
          </div>
        );
      case 'experience_added':
        return (
          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="p-2 bg-blue-100 rounded-full">
              <Briefcase className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Added work experience: {activity.title}</p>
              <p className="text-xs text-gray-500">{activity.company}</p>
            </div>
            <span className="text-xs text-gray-500">{formattedDate}</span>
          </div>
        );
      case 'project_added':
        return (
          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="p-2 bg-green-100 rounded-full">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Added new project: {activity.title}</p>
            </div>
            <span className="text-xs text-gray-500">{formattedDate}</span>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      <div className="container mx-auto p-6 space-y-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3 text-primary">
            Welcome Back, {user?.full_name?.split(' ')[0] || 'User'}
          </h1>
          <p className="text-gray-600">
            Manage your professional profile and create compelling cover letters
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-sm bg-white">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Cover Letters Created</p>
                  <p className="text-3xl font-bold text-primary">2</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-full">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm bg-white">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Work Experiences</p>
                  <p className="text-3xl font-bold text-primary">2</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-full">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm bg-white">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Projects</p>
                  <p className="text-3xl font-bold text-primary">2</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-full">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left & Middle columns */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <Card className="shadow-md bg-white overflow-hidden">
              <CardHeader className="border-b bg-primary/5 pb-3">
                <CardTitle className="text-xl font-bold text-primary">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-3">
                  <Link href="/generate-cover-letter" className="group p-6 hover:bg-primary/5 transition-colors border-r border-b md:border-b-0">
                    <div className="flex flex-col items-center text-center">
                      <div className="p-3 bg-primary/10 rounded-full mb-3 group-hover:bg-primary/20 transition-colors">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-medium mb-1">New Cover Letter</h3>
                      <p className="text-sm text-gray-500 mb-3">Generate tailored cover letter</p>
                      <Button variant="outline" size="sm" className="mt-auto group-hover:bg-primary group-hover:text-white transition-colors border-primary text-primary">
                        Create
                      </Button>
                    </div>
                  </Link>
                  
                  <Link href="/skills-and-experiences" className="group p-6 hover:bg-primary/5 transition-colors border-r border-b md:border-b-0">
                    <div className="flex flex-col items-center text-center">
                      <div className="p-3 bg-primary/10 rounded-full mb-3 group-hover:bg-primary/20 transition-colors">
                        <Briefcase className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-medium mb-1">Add Experience</h3>
                      <p className="text-sm text-gray-500 mb-3">Update your work history</p>
                      <Button variant="outline" size="sm" className="mt-auto group-hover:bg-primary group-hover:text-white transition-colors border-primary text-primary">
                        Add
                      </Button>
                    </div>
                  </Link>
                  
                  <Link href="/skills-and-experiences?tab=projects" className="group p-6 hover:bg-primary/5 transition-colors">
                    <div className="flex flex-col items-center text-center">
                      <div className="p-3 bg-primary/10 rounded-full mb-3 group-hover:bg-primary/20 transition-colors">
                        <CheckCircle className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-medium mb-1">Add Project</h3>
                      <p className="text-sm text-gray-500 mb-3">Showcase your projects</p>
                      <Button variant="outline" size="sm" className="mt-auto group-hover:bg-primary group-hover:text-white transition-colors border-primary text-primary">
                        Add
                      </Button>
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Recent Cover Letters */}
            <Card className="shadow-md bg-white">
              <CardHeader className="flex flex-row items-center justify-between border-b">
                <div>
                  <CardTitle className="text-xl font-bold text-primary">
                    Recent Cover Letters
                  </CardTitle>
                  <CardDescription>
                    Your most recently created cover letters
                  </CardDescription>
                </div>
                <Link href="/my-cover-letters">
                  <Button variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/5">
                    View all <ChevronRight className="ml-1 w-4 h-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="p-4">
                {coverLetters.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                      <FileText className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">No cover letters yet</h3>
                    <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
                      Create your first personalized cover letter tailored to your experience
                    </p>
                    <Link href="/generate-cover-letter">
                      <Button className="bg-primary hover:bg-primary/90">
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Create Cover Letter
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {coverLetters.map((letter) => (
                      <Link href={`/cover-letters/${letter.id}`} key={letter.id}>
                        <Card className="group hover:shadow-md transition-all duration-300 hover:border-primary cursor-pointer bg-white">
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
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="bg-gray-50 px-4 py-3 border-t">
                <Link href="/generate-cover-letter" className="w-full">
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Create New Cover Letter
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Recent Activity */}
            <Card className="shadow-md bg-white">
              <CardHeader className="border-b">
                <CardTitle className="text-xl font-bold text-primary">
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Your latest actions and updates
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-1">
                  {activities.length === 0 ? (
                    <div className="text-center py-6">
                      <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No recent activity</p>
                    </div>
                  ) : (
                    activities.map((activity) => (
                      <div key={activity.id}>
                        {renderActivityItem(activity)}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Profile Completion */}
            <Card className="shadow-md bg-white">
              <CardHeader className="border-b">
                <CardTitle className="text-xl font-bold text-primary">
                  Profile Completion
                </CardTitle>
                <CardDescription>
                  Complete your profile to improve results
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <p className="text-sm font-medium">65% Complete</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg border border-green-200 bg-green-50">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-sm">Basic Information</span>
                      </div>
                      <span className="text-xs text-green-600 font-medium">Complete</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 rounded-lg border border-green-200 bg-green-50">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-sm">Work Experience</span>
                      </div>
                      <span className="text-xs text-green-600 font-medium">Complete</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 rounded-lg border border-yellow-200 bg-yellow-50">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-yellow-500" />
                        <span className="text-sm">Education History</span>
                      </div>
                      <Link href="/profile/education">
                        <Button variant="ghost" size="sm" className="text-xs h-7 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-100">
                          Add
                        </Button>
                      </Link>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 rounded-lg border border-yellow-200 bg-yellow-50">
                      <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-yellow-500" />
                        <span className="text-sm">Profile Picture</span>
                      </div>
                      <Link href="/profile">
                        <Button variant="ghost" size="sm" className="text-xs h-7 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-100">
                          Add
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;