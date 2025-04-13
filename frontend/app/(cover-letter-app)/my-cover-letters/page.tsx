"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  PlusCircle, 
  FileText, 
  Search, 
  Calendar, 
  Building, 
  ArrowRight, 
  Filter,
  ArrowDownAZ,
  Trash2,
  Download,
  Copy
} from "lucide-react";
import Link from "next/link";
import { CoverLetter, getUserCoverLetters, deleteCoverLetter } from '../api/cover-letter';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

// Process content to handle literal \n characters
const processContent = (content: string | null | undefined): string => {
  if (!content) return '';
  // Replace literal '\n' with actual newlines
  return content.replace(/\\n/g, '\n');
};

const MyCoverLettersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch cover letters on component mount
  useEffect(() => {
    const fetchCoverLetters = async () => {
      try {
        setIsLoading(true);
        const letters = await getUserCoverLetters();
        setCoverLetters(letters);
        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch cover letters:', err);
        setError(`Failed to load cover letters: ${err.message || 'Unknown error'}`);
        toast({
          title: 'Error',
          description: `Failed to load cover letters: ${err.message || 'Unknown error'}`,
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCoverLetters();
  }, []);
  
  // Handle deleting a cover letter
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this cover letter?')) {
      return;
    }
    
    try {
      await deleteCoverLetter(id);
      setCoverLetters(coverLetters.filter(letter => letter.id !== id));
      toast({
        title: 'Success',
        description: 'Cover letter deleted successfully',
      });
    } catch (err: any) {
      console.error('Failed to delete cover letter:', err);
      toast({
        title: 'Error',
        description: `Failed to delete cover letter: ${err.message || 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  };
  
  // Copy cover letter to clipboard
  const handleCopy = (content: string | null | undefined) => {
    if (!content) {
      toast({
        title: 'Error',
        description: 'No content to copy',
        variant: 'destructive',
      });
      return;
    }
    
    // Process the content to replace \n with actual newlines before copying
    const processedContent = processContent(content);
    
    navigator.clipboard.writeText(processedContent).then(() => {
      toast({
        title: 'Success',
        description: 'Cover letter copied to clipboard',
      });
    }).catch((err) => {
      console.error('Failed to copy text:', err);
      toast({
        title: 'Error',
        description: 'Failed to copy to clipboard',
        variant: 'destructive',
      });
    });
  };
  
  // Format date for display
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Unknown date';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (err) {
      return dateString;
    }
  };
  
  // Get a preview of the content with proper line breaks
  const getContentPreview = (content: string | null | undefined): string => {
    if (!content) return 'No content generated yet. Click "View" to add content.';
    
    const processedContent = processContent(content);
    const firstLine = processedContent.split('\n')[0] || '';
    const previewText = processedContent.substring(0, 120).replace(/\n/g, ' ');
    
    return previewText + (previewText.length < processedContent.length ? '...' : '');
  };
  
  // Search and sort logic
  const filteredCoverLetters = coverLetters
    .filter(letter => {
      const searchLower = searchQuery.toLowerCase();
      return (
        letter.company_name.toLowerCase().includes(searchLower) ||
        (letter.status && letter.status.toLowerCase().includes(searchLower))
      );
    })
    .sort((a, b) => {
      const dateA = new Date(sortBy === 'newest' ? a.updated_at || a.created_at || '' : a.created_at || '');
      const dateB = new Date(sortBy === 'newest' ? b.updated_at || b.created_at || '' : b.created_at || '');
      
      if (sortBy === 'newest' || sortBy === 'oldest') {
        return sortBy === 'newest' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
      }
      
      if (sortBy === 'company') {
        return a.company_name.localeCompare(b.company_name);
      }
      
      // Default sort by company
      return a.company_name.localeCompare(b.company_name);
    });
  
  return (
    <div className="min-h-screen bg-[#F5F5F0] py-8">
      <div className="container mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary">My Cover Letters</h1>
          <p className="text-gray-600 mt-2">
            View, edit, and manage all your personalized cover letters
          </p>
        </div>
        
        {/* Search and filter section */}
        <Card className="mb-8 shadow-md">
          <CardContent className="pt-6 pb-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by company..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="w-full md:w-64">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full">
                    <div className="flex items-center">
                      <ArrowDownAZ className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Sort by" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="company">Company</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Link href="/generate-cover-letter">
                <Button className="bg-primary hover:bg-primary/90 w-full md:w-auto">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create New
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        {/* Loading state */}
        {isLoading && (
          <Card className="shadow-md">
            <CardContent className="p-12 text-center">
              <div className="animate-spin mx-auto w-8 h-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
              <p className="text-gray-500">Loading your cover letters...</p>
            </CardContent>
          </Card>
        )}
        
        {/* Error state */}
        {error && !isLoading && (
          <Card className="shadow-md">
            <CardContent className="p-12 text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Error Loading Cover Letters</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {error}
              </p>
              <Button onClick={() => window.location.reload()} className="bg-primary hover:bg-primary/90">
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}
        
        {/* Results count */}
        {!isLoading && !error && (
          <div className="mb-4 text-sm text-gray-500">
            Showing {filteredCoverLetters.length} cover {filteredCoverLetters.length === 1 ? 'letter' : 'letters'}
          </div>
        )}
        
        {/* Cover letters list */}
        <div className="space-y-4">
          {!isLoading && !error && filteredCoverLetters.length === 0 ? (
            <Card className="shadow-md">
              <CardContent className="p-12 text-center">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No cover letters found</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  {searchQuery ? 'Try a different search term or' : 'You have not created any cover letters yet.'} 
                </p>
                <Link href="/generate-cover-letter">
                  <Button className="bg-primary hover:bg-primary/90">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Cover Letter
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            !isLoading && !error && filteredCoverLetters.map((letter) => (
              <Card key={letter.id} className="shadow-md hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div className="space-y-2 mb-4 md:mb-0">
                      <div className="flex items-center">
                        <h3 className="text-xl font-semibold text-primary">
                          {letter.company_name}
                        </h3>
                        {letter.status && (
                          <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                            letter.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            letter.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {letter.status}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-gray-500 text-sm space-x-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1.5" />
                          <span>Updated {formatDate(letter.updated_at || letter.created_at)}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mt-3 line-clamp-2">
                        {getContentPreview(letter.generated_content)}
                      </p>
                    </div>
                    <div className="flex flex-row md:flex-col justify-end space-x-2 md:space-x-0 md:space-y-2">
                      <Link href={`/cover-letters/${letter.id}`}>
                        <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-white w-full">
                          View
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                        onClick={() => handleCopy(letter.generated_content)}
                        disabled={!letter.generated_content}
                      >
                        <Copy className="h-3.5 w-3.5 mr-1.5" />
                        Copy
                      </Button>
                      <Button variant="outline" size="sm" className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white">
                        <Download className="h-3.5 w-3.5 mr-1.5" />
                        Export
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        onClick={() => handleDelete(letter.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyCoverLettersPage; 