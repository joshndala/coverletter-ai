"use client";

import React, { useState } from 'react';
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

// Mock data - would normally come from an API/database
const MOCK_COVER_LETTERS = [
  {
    id: 1,
    company: "Tech Giants Inc",
    position: "Senior Frontend Developer",
    createdAt: "2024-02-05",
    updatedAt: "2024-02-05",
    content: "Dear Hiring Manager, I am writing to express my interest in the Senior Frontend Developer position at Tech Giants Inc..."
  },
  {
    id: 2,
    company: "Startup Innovators",
    position: "Full Stack Engineer",
    createdAt: "2024-02-03",
    updatedAt: "2024-02-04",
    content: "Dear Hiring Team, I am excited to apply for the Full Stack Engineer role at Startup Innovators..."
  },
  {
    id: 3,
    company: "Digital Solutions Co",
    position: "UI/UX Designer",
    createdAt: "2024-01-28",
    updatedAt: "2024-01-30",
    content: "Dear Hiring Manager, I am applying for the UI/UX Designer position at Digital Solutions Co..."
  },
  {
    id: 4,
    company: "Global Tech Partners",
    position: "JavaScript Developer",
    createdAt: "2024-01-20",
    updatedAt: "2024-01-20",
    content: "Dear Recruitment Team, I would like to apply for the JavaScript Developer position at Global Tech Partners..."
  },
  {
    id: 5,
    company: "Innovative Software Inc",
    position: "Frontend Architect",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-18",
    content: "Dear Hiring Manager, I am writing to express my interest in the Frontend Architect position at Innovative Software Inc..."
  }
];

const MyCoverLettersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  
  // Search and sort logic
  const filteredCoverLetters = MOCK_COVER_LETTERS
    .filter(letter => {
      const searchLower = searchQuery.toLowerCase();
      return (
        letter.company.toLowerCase().includes(searchLower) ||
        letter.position.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      const dateA = new Date(sortBy === 'newest' ? a.updatedAt : a.createdAt);
      const dateB = new Date(sortBy === 'newest' ? b.updatedAt : b.createdAt);
      
      if (sortBy === 'newest' || sortBy === 'oldest') {
        return sortBy === 'newest' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
      }
      
      if (sortBy === 'company') {
        return a.company.localeCompare(b.company);
      }
      
      return a.position.localeCompare(b.position);
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
                  placeholder="Search by company or position..."
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
                    <SelectItem value="position">Position</SelectItem>
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
        
        {/* Results count */}
        <div className="mb-4 text-sm text-gray-500">
          Showing {filteredCoverLetters.length} cover {filteredCoverLetters.length === 1 ? 'letter' : 'letters'}
        </div>
        
        {/* Cover letters list */}
        <div className="space-y-4">
          {filteredCoverLetters.length === 0 ? (
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
            filteredCoverLetters.map((letter) => (
              <Card key={letter.id} className="shadow-md hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div className="space-y-2 mb-4 md:mb-0">
                      <h3 className="text-xl font-semibold text-primary">
                        {letter.position}
                      </h3>
                      <div className="flex items-center text-gray-500 text-sm space-x-4">
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-1.5" />
                          <span>{letter.company}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1.5" />
                          <span>Updated {new Date(letter.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mt-3 line-clamp-2">
                        {letter.content.substring(0, 120)}...
                      </p>
                    </div>
                    <div className="flex flex-row md:flex-col justify-end space-x-2 md:space-x-0 md:space-y-2">
                      <Link href={`/cover-letters/${letter.id}`}>
                        <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-white w-full">
                          View
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm" className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white">
                        <Copy className="h-3.5 w-3.5 mr-1.5" />
                        Copy
                      </Button>
                      <Button variant="outline" size="sm" className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white">
                        <Download className="h-3.5 w-3.5 mr-1.5" />
                        Export
                      </Button>
                      <Button variant="outline" size="sm" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
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
        
        {/* Pagination or load more (simplified for now) */}
        {filteredCoverLetters.length > 0 && (
          <div className="mt-8 flex justify-center">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
              Load More
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCoverLettersPage; 