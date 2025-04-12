"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, GraduationCap } from "lucide-react";

interface AddEducationProps {
  onSubmit: (education: EducationData) => void;
}

export interface EducationData {
  id?: number;
  title: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: Date;
  endDate: Date | null;
  location: string;
  gpa?: string;
  description: string;
  highlights: string[];
}

const AddEducation: React.FC<AddEducationProps> = ({ onSubmit }) => {
  const [open, setOpen] = React.useState(false);
  
  // Form fields
  const [title, setTitle] = React.useState('');
  const [institution, setInstitution] = React.useState('');
  const [degree, setDegree] = React.useState('');
  const [fieldOfStudy, setFieldOfStudy] = React.useState('');
  const [startDate, setStartDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date>();
  const [location, setLocation] = React.useState('');
  const [gpa, setGpa] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [currentHighlight, setCurrentHighlight] = React.useState('');
  const [highlights, setHighlights] = React.useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate) return;

    onSubmit({
      title,
      institution,
      degree,
      fieldOfStudy,
      startDate,
      endDate: endDate || null,
      location,
      gpa: gpa || undefined,
      description,
      highlights,
    });

    // Reset form
    resetForm();
    setOpen(false);
  };

  const resetForm = () => {
    setTitle('');
    setInstitution('');
    setDegree('');
    setFieldOfStudy('');
    setStartDate(undefined);
    setEndDate(undefined);
    setLocation('');
    setGpa('');
    setDescription('');
    setHighlights([]);
    setCurrentHighlight('');
  };

  const addHighlight = () => {
    if (currentHighlight.trim()) {
      setHighlights([...highlights, currentHighlight.trim()]);
      setCurrentHighlight('');
    }
  };

  const removeHighlight = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
          <GraduationCap className="mr-2 h-4 w-4" />
          Add Education
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">
            Add Education
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="degree">Degree Type</Label>
            <Input
              id="degree"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              placeholder="e.g. Bachelor of Science, High School Diploma"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Bachelor of Science"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fieldOfStudy">Field of Study</Label>
              <Input
                id="fieldOfStudy"
                value={fieldOfStudy}
                onChange={(e) => setFieldOfStudy(e.target.value)}
                placeholder="e.g. Computer Science"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="institution">Institution</Label>
              <Input
                id="institution"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="e.g. University of Technology"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Present or Expected"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Boston, MA"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gpa">GPA (Optional)</Label>
              <Input
                id="gpa"
                value={gpa}
                onChange={(e) => setGpa(e.target.value)}
                placeholder="e.g. 3.8/4.0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of your education..."
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="highlights">Key Achievements</Label>
            <div className="flex space-x-2">
              <Input
                id="highlights"
                value={currentHighlight}
                onChange={(e) => setCurrentHighlight(e.target.value)}
                placeholder="e.g. Graduated with Honors"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addHighlight();
                  }
                }}
              />
              <Button type="button" onClick={addHighlight}>
                Add
              </Button>
            </div>
            <div className="mt-2">
              <ul className="space-y-2">
                {highlights.map((highlight, index) => (
                  <li key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
                    <span className="text-sm">{highlight}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => removeHighlight(index)}
                      className="h-8 w-8 p-0"
                    >
                      &times;
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              Save Education
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEducation; 