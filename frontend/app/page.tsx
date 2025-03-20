import React from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Briefcase, CheckCircle, ArrowRight } from "lucide-react";
import Navbar from './components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-[#F5F5F0] min-h-screen">
          {/* Hero Section */}
          <section className="pt-20 pb-16">
            <div className="container mx-auto px-6 text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6 leading-tight">
                Personalized Cover Letters <br /> 
                <span className="text-black">in Seconds</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                CoverForMe helps you create tailored cover letters that match your skills and experience with job descriptions, helping you stand out in your job applications.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/register">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8">
                    Get Started for Free
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white px-8">
                    Learn How It Works
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold text-center text-primary mb-12">
                Why Choose CoverForMe?
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="shadow-md hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Tailored Content</h3>
                    <p className="text-gray-600">
                      AI analyzes job descriptions and matches them with your most relevant skills and experiences.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="shadow-md hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                      <Briefcase className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Save Time</h3>
                    <p className="text-gray-600">
                      Create professional cover letters in seconds, not hours, letting you apply to more jobs faster.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="shadow-md hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                      <CheckCircle className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Stand Out</h3>
                    <p className="text-gray-600">
                      Highlight your most relevant qualifications to increase your chances of landing interviews.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="py-16">
            <div className="container mx-auto px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-primary mb-4">
                  Simple, Fast, Effective
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Our process makes it easy to create personalized cover letters in minutes
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="text-center">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-primary">1</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Add Your Experience</h3>
                  <p className="text-gray-600">
                    Create your profile with skills, work history, and projects
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-primary">2</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Paste Job Description</h3>
                  <p className="text-gray-600">
                    Enter the job details and company information
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-primary">3</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Generate & Download</h3>
                  <p className="text-gray-600">
                    Get your personalized cover letter instantly
                  </p>
                </div>
              </div>
              
              <div className="text-center">
                <Link href="/how-it-works">
                  <Button className="bg-primary hover:bg-primary/90">
                    See Detailed Process
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
          
          {/* CTA Section */}
          <section className="py-16 bg-primary/5">
            <div className="container mx-auto px-6 text-center">
              <h2 className="text-3xl font-bold text-primary mb-6">
                Ready to Transform Your Job Applications?
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Join thousands of job seekers who are getting more interviews with AI-powered cover letters.
              </p>
              <Link href="/register">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8">
                  Get Started for Free
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </main>
      <footer className="bg-white border-t py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} CoverForMe. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}