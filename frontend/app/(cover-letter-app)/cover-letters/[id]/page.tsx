"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import CoverLetterViewer from '../../app-components/CoverLetterViewer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { CoverLetter, getCoverLetter } from '../../api/cover-letter';
import { toast } from "@/components/ui/use-toast";

export default function CoverLetterPage() {
  const params = useParams();
  const router = useRouter();
  const [coverLetter, setCoverLetter] = useState<CoverLetter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoverLetter = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
        
        if (!id) {
          setError("Invalid cover letter ID");
          return;
        }
        
        const data = await getCoverLetter(id);
        setCoverLetter(data);
      } catch (err) {
        console.error("Error fetching cover letter:", err);
        setError(err instanceof Error ? err.message : "An error occurred while fetching the cover letter");
        toast({
          title: "Error",
          description: "Failed to load cover letter",
          variant: "destructive",
        });
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