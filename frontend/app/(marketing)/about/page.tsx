import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "About - CoverForMe",
  description: "Learn about my mission to revolutionize the job application process.",
};

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="mb-8 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-primary mb-4">
            About CoverForMe
          </h1>
          <p className="text-lg text-gray-600">
            My mission is to simplify the job application process by helping job seekers create personalized, 
            high-quality cover letters that showcase their unique qualifications.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg mb-8">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-primary mb-4">
                My Story
              </h2>
              <p className="text-gray-600 mb-4">
                CoverForMe was born out of a simple observation: writing effective cover letters is time-consuming,
                repetitive, and often frustrating. As a job seeker myself, I experienced the challenge of crafting
                unique letters for each application while ensuring they were tailored to specific job requirements.
              </p>
              <p className="text-gray-600">
                I built this platform to leverage the power of AI to analyze job descriptions, 
                match them with your skills and experiences, and generate compelling cover letters 
                that help you stand out in the application process.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg mb-8">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-primary mb-4">
                My Values
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Accessibility</h3>
                  <p className="text-gray-600">
                    I believe everyone deserves access to tools that improve their job search,
                    regardless of their background or experience level.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Quality</h3>
                  <p className="text-gray-600">
                    I'm committed to producing high-quality cover letters that reflect your
                    professional voice and highlight your relevant experiences.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Innovation</h3>
                  <p className="text-gray-600">
                    I continuously improve the AI models to generate more tailored and effective content.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Privacy</h3>
                  <p className="text-gray-600">
                    I respect your data and ensure that your personal information is secure and private.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-primary mb-4">
                About Me
              </h2>
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="w-32 h-32 bg-gray-200 rounded-full flex-shrink-0 overflow-hidden">
                  <Image 
                    src="/joshua.png" 
                    alt="Joshua Ndala" 
                    width={128} 
                    height={128}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Joshua Ndala</h3>
                  <p className="text-gray-600 mb-4">
                    I'm a UBC Computer Science graduate with a truly global background. Born and raised in South Africa, I've also lived in Uganda, Ivory Coast, and now Canada. My international upbringing sparked my curiosity for technology and diverse cultures, which led me to pursue Computer Science. I'm passionate about data science, software development, and AI, with expertise in Python, R, SQL, Java, and various other technologies. My diverse background inspires me to create innovative solutions like CoverForMe that help people achieve their professional goals.
                  </p>
                  <div className="flex gap-4">
                    <a href="https://linkedin.com/in/joshua-ndala" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      LinkedIn
                    </a>
                    <a href="https://github.com/joshndala" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      GitHub
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AboutPage; 