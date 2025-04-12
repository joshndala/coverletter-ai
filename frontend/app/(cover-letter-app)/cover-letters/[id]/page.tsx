"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import CoverLetterViewer from '../../app-components/CoverLetterViewer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

// Types
interface CoverLetter {
  id: number;
  company: string;
  position: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// Mock data - would be replaced with API calls
const MOCK_COVER_LETTERS: CoverLetter[] = [
  {
    id: 1,
    company: "Tech Giants Inc",
    position: "Senior Frontend Developer",
    createdAt: "2024-02-05",
    updatedAt: "2024-02-05",
    content: "Dear Hiring Manager,\n\nI am writing to express my interest in the Senior Frontend Developer position at Tech Giants Inc. With over 5 years of experience building modern web applications using React, TypeScript, and Next.js, I believe I am well-positioned to contribute to your team's success.\n\nIn my current role at Digital Solutions Co, I've led the frontend development of our flagship product, improving performance metrics by 40% and implementing a component library that reduced development time across teams. I've also mentored junior developers and collaborated closely with designers to ensure pixel-perfect implementations.\n\nI'm particularly excited about Tech Giants' focus on accessibility and your mission to create products that serve diverse user needs. Your recent work on [specific project] caught my attention, and I'd love to bring my expertise in performance optimization and accessible UI development to contribute to similar initiatives.\n\nThank you for considering my application. I look forward to the opportunity to discuss how my skills and experience align with your team's needs.\n\nSincerely,\nAlex Johnson"
  },
  {
    id: 2,
    company: "Startup Innovators",
    position: "Full Stack Engineer",
    createdAt: "2024-02-03",
    updatedAt: "2024-02-04",
    content: "Dear Hiring Team,\n\nI am excited to apply for the Full Stack Engineer role at Startup Innovators. As a developer with experience across the entire stack and a passion for building products from the ground up, I believe I would be a valuable addition to your team.\n\nOver the past 4 years, I've worked on both frontend and backend development using technologies such as React, Node.js, and PostgreSQL. At my current company, I've been instrumental in implementing RESTful APIs, optimizing database queries, and creating responsive UIs that delight users.\n\nI'm drawn to Startup Innovators because of your innovative approach to [specific industry/problem] and your commitment to using technology to solve meaningful problems. The opportunity to work in a fast-paced environment where I can take ownership of features from concept to deployment is exactly what I'm looking for at this stage in my career.\n\nI look forward to discussing how my technical skills and collaborative approach can help Startup Innovators achieve its goals.\n\nBest regards,\nSamantha Smith"
  },
  {
    id: 3,
    company: "Digital Solutions Co",
    position: "UI/UX Designer",
    createdAt: "2024-01-28",
    updatedAt: "2024-01-30",
    content: "Dear Hiring Manager,\n\nI am applying for the UI/UX Designer position at Digital Solutions Co with great enthusiasm. With a background in both design and front-end development, I offer a unique perspective that bridges aesthetic considerations with technical feasibility.\n\nIn my current role at CreativeMinds Agency, I've designed and implemented user interfaces for clients across various industries, from financial services to healthcare. My approach centers on user research and iterative design, ensuring that the final products not only look beautiful but also solve real user problems effectively.\n\nI'm particularly impressed with Digital Solutions Co's human-centered design philosophy and your recent work for [specific client/project]. I share your belief that good design should be accessible to everyone, and I would be thrilled to contribute my skills to your team's portfolio of impactful digital products.\n\nI've attached my portfolio showcasing selected projects that demonstrate my design process and technical capabilities. I look forward to the opportunity to discuss how my experience aligns with your team's needs.\n\nSincerely,\nJamie Williams"
  },
  {
    id: 4,
    company: "Global Tech Partners",
    position: "JavaScript Developer",
    createdAt: "2024-01-20",
    updatedAt: "2024-01-20",
    content: "Dear Recruitment Team,\n\nI would like to apply for the JavaScript Developer position at Global Tech Partners. With 3+ years of experience building robust web applications using modern JavaScript frameworks, I am excited about the opportunity to bring my technical expertise to your innovative team.\n\nIn my current role at WebSolutions Inc, I've worked extensively with React, Vue.js, and vanilla JavaScript to develop scalable frontend architectures. I've implemented state management solutions, optimized rendering performance, and ensured cross-browser compatibility for applications serving thousands of users daily.\n\nWhat attracts me to Global Tech Partners is your commitment to technical excellence and your collaborative approach to solving complex problems. I'm particularly interested in your work on [specific project or technology], and I believe my experience with [relevant skill] would allow me to make meaningful contributions from day one.\n\nI'm eager to discuss how my skills and passion for clean, efficient code can help Global Tech Partners continue to deliver exceptional digital experiences.\n\nThank you for your consideration,\nChris Taylor"
  },
  {
    id: 5,
    company: "Innovative Software Inc",
    position: "Frontend Architect",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-18",
    content: "Dear Hiring Manager,\n\nI am writing to express my interest in the Frontend Architect position at Innovative Software Inc. With over 7 years of experience building and scaling frontend systems for enterprise applications, I am confident in my ability to help shape your technical strategy and lead implementation efforts.\n\nIn my current role as Senior Frontend Developer at TechCorp, I've architected a modular component system that is now used across multiple product lines, reducing code duplication by 60% and accelerating feature development. I've also led the migration of legacy applications to modern frameworks, implementing best practices for performance, accessibility, and code quality.\n\nI'm drawn to Innovative Software because of your reputation for technical excellence and your focus on creating products that solve real business challenges. I believe my experience in designing scalable frontend architectures, establishing development standards, and mentoring teams would be valuable as you continue to grow and evolve your product offerings.\n\nI would welcome the opportunity to discuss how my technical leadership and vision align with your team's goals.\n\nBest regards,\nMorgan Lee"
  }
];

export default function CoverLetterPage() {
  const params = useParams();
  const router = useRouter();
  const [coverLetter, setCoverLetter] = useState<CoverLetter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real application, this would be an API call
    const fetchCoverLetter = () => {
      setLoading(true);
      try {
        const id = typeof params.id === 'string' ? parseInt(params.id, 10) : Array.isArray(params.id) ? parseInt(params.id[0], 10) : 0;
        
        // Find the cover letter with the matching ID
        const foundLetter = MOCK_COVER_LETTERS.find(letter => letter.id === id);
        
        if (foundLetter) {
          setCoverLetter(foundLetter);
          setError(null);
        } else {
          setError("Cover letter not found");
          setCoverLetter(null);
        }
      } catch (err) {
        setError("An error occurred while fetching the cover letter");
        setCoverLetter(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCoverLetter();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-gray-600">Loading cover letter...</p>
        </div>
      </div>
    );
  }

  if (error || !coverLetter) {
    return (
      <div className="min-h-screen bg-[#F5F5F0] py-8">
        <div className="container mx-auto px-6">
          <Link href="/my-cover-letters">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Cover Letters
            </Button>
          </Link>
          
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
            <p className="text-gray-600 mb-6">{error || "Cover letter not found"}</p>
            <Link href="/my-cover-letters">
              <Button>View All Cover Letters</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      <div className="container mx-auto px-6">
        <div className="py-6">
          <Link href="/my-cover-letters">
            <Button variant="ghost" className="mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Cover Letters
            </Button>
          </Link>
        </div>
        
        <CoverLetterViewer coverLetter={coverLetter} />
      </div>
    </div>
  );
} 