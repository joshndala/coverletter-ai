import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Briefcase, Edit, Check, Target, Search } from "lucide-react";

export const metadata = {
  title: "How It Works - CoverForMe",
  description: "Learn how CoverForMe helps you create personalized cover letters in minutes.",
};

const HowItWorksPage = () => {
  const steps = [
    {
      id: 1,
      title: "Create Your Profile",
      description: "Add your skills, work experience, and projects to build your professional profile.",
      icon: Briefcase,
    },
    {
      id: 2,
      title: "Paste Job Description",
      description: "Enter the job details and paste the job description for the position you're applying to.",
      icon: FileText,
    },
    {
      id: 3,
      title: "Company Research",
      description: "The AI automatically searches the web to gather company information, mission, values, and recent news to better align your cover letter with the company culture.",
      icon: Search,
    },
    {
      id: 4,
      title: "AI Selects Relevant Experience",
      description: "The AI analyzes the job requirements and selects your most relevant experiences and skills.",
      icon: Target,
    },
    {
      id: 5,
      title: "Generate Your Cover Letter",
      description: "With one click, a personalized cover letter is created, tailored to the specific job.",
      icon: Edit,
    },
    {
      id: 6,
      title: "Review and Download",
      description: "Edit if needed, then copy or download your cover letter for your application.",
      icon: Check,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-primary mb-4">
            How CoverForMe Works
          </h1>
          <p className="text-lg text-gray-600">
            Create personalized cover letters in minutes with this simple five-step process
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Process Steps */}
          <div className="space-y-6 mb-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-grow">
                    <h2 className="text-xl font-bold text-primary mb-2">
                      {step.id}. {step.title}
                    </h2>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Benefits */}
          <Card className="shadow-lg mb-12">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-primary mb-6 text-center">
                Why Use CoverForMe?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Save Hours of Time</h3>
                  <p className="text-gray-600">
                    Generate customized cover letters in minutes, not hours. Apply to more jobs in less time.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Tailored Content</h3>
                  <p className="text-gray-600">
                    The AI matches your experience with job requirements for truly personalized letters.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Professional Quality</h3>
                  <p className="text-gray-600">
                    Well-structured, error-free cover letters that showcase your qualifications effectively.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Always Available</h3>
                  <p className="text-gray-600">
                    Create cover letters whenever you need them, day or night, from any device.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-primary mb-6 text-center">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Is my information secure?</h3>
                  <p className="text-gray-600">
                    Yes, I take data privacy seriously. Your information is encrypted and never shared with third parties.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Can I edit the generated cover letters?</h3>
                  <p className="text-gray-600">
                    Absolutely! You can edit any part of the generated cover letter to add your personal touch.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">How much does it cost?</h3>
                  <p className="text-gray-600">
                    I offer both free and premium plans. The free plan allows for a limited number of cover letters per month, while premium plans provide unlimited access.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Can I use the cover letters for any job?</h3>
                  <p className="text-gray-600">
                    Yes, the AI is trained to generate cover letters for a wide range of industries and positions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksPage; 