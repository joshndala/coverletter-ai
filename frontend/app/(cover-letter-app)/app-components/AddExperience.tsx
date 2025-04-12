"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MinusCircle, PlusCircle } from "lucide-react";

interface AddExperienceProps {
  experienceType?: 'work' | 'project';
  onSubmit: (experience: WorkExperience | ProjectExperience) => void;
  onCancel: () => void;
  editExperience?: WorkExperience | ProjectExperience;
}

interface BaseExperience {
  id?: number;
  title: string;
  description: string;
}

interface WorkExperience extends BaseExperience {
  type: 'work';
  company: string;
  startDate: Date;
  endDate: Date | null;
  location: string;
  employmentType: string;
}

interface ProjectExperience extends BaseExperience {
  type: 'project';
  technologies: string[];
  projectType: 'individual' | 'group';
  date: Date;
  link?: string;
}

export default function AddExperience({ experienceType = 'work', onSubmit, onCancel, editExperience }: AddExperienceProps) {
  // Form state
  const [title, setTitle] = useState(editExperience?.title || '');
  const [description, setDescription] = useState(editExperience?.description || '');

  // Work experience state
  const [company, setCompany] = useState(editExperience?.type === 'work' ? (editExperience as WorkExperience).company || '' : '');
  const [location, setLocation] = useState(editExperience?.type === 'work' ? (editExperience as WorkExperience).location || '' : '');
  const [employmentType, setEmploymentType] = useState<EmploymentType>(
    editExperience?.type === 'work' 
      ? (editExperience as WorkExperience).employmentType || 'full-time'
      : 'full-time'
  );
  const [startDate, setStartDate] = useState<Date | null>(
    editExperience?.type === 'work' && (editExperience as WorkExperience).startDate
      ? new Date((editExperience as WorkExperience).startDate)
      : null
  );
  const [endDate, setEndDate] = useState<Date | null>(
    editExperience?.type === 'work' && (editExperience as WorkExperience).endDate
      ? new Date((editExperience as WorkExperience).endDate)
      : null
  );
  const [currentlyWorking, setCurrentlyWorking] = useState(
    editExperience?.type === 'work' && !(editExperience as WorkExperience).endDate
  );

  // Project experience state
  const [technologies, setTechnologies] = useState(
    editExperience?.type === 'project' ? (editExperience as ProjectExperience).technologies || '' : ''
  );
  const [projectType, setProjectType] = useState<ProjectType>(
    editExperience?.type === 'project' 
      ? (editExperience as ProjectExperience).projectType || 'personal'
      : 'personal'
  );
  const [projectDate, setProjectDate] = useState<Date | null>(
    editExperience?.type === 'project' && (editExperience as ProjectExperience).date
      ? new Date((editExperience as ProjectExperience).date)
      : null
  );
  const [projectLink, setProjectLink] = useState(
    editExperience?.type === 'project' ? (editExperience as ProjectExperience).link || '' : ''
  );

  // Controlled inputs
  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => setCompany(e.target.value);
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.target.value);
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value);
  const handleTechnologiesChange = (e: React.ChangeEvent<HTMLInputElement>) => setTechnologies(e.target.value);
  const handleProjectLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => setProjectLink(e.target.value);
  // Skills removed as they're not implemented in backend

  // Handle checkbox
  const handleCurrentlyWorkingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentlyWorking(e.target.checked);
    if (e.target.checked) {
      setEndDate(null);
    }
  };
  
  // Handle selects
  const handleEmploymentTypeChange = (value: EmploymentType) => setEmploymentType(value);
  const handleProjectTypeChange = (value: ProjectType) => setProjectType(value);
  
  // Handle dates
  const handleStartDateChange = (date: Date | null) => setStartDate(date);
  const handleEndDateChange = (date: Date | null) => setEndDate(date);
  const handleProjectDateChange = (date: Date | null) => setProjectDate(date);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (experienceType === 'work') {
      const workExperience: WorkExperience = {
        id: editExperience?.id,
        type: 'work',
        title,
        description,
        company,
        location,
        employmentType,
        startDate: startDate?.toISOString().split('T')[0],
        endDate: currentlyWorking ? undefined : endDate?.toISOString().split('T')[0],
      };
      onSubmit(workExperience);
    } else {
      const projectExperience: ProjectExperience = {
        id: editExperience?.id,
        type: 'project',
        title,
        description,
        technologies,
        projectType,
        date: projectDate?.toISOString().split('T')[0],
        link: projectLink,
      };
      onSubmit(projectExperience);
    }
    
    // Reset form
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setTechnologies([]);
    setProjectDate(null);
    setProjectLink('');
    setProjectType('personal');
    setCompany('');
    setLocation('');
    setEmploymentType('full-time');
    setStartDate(null);
    setEndDate(null);
    setCurrentlyWorking(true);
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">
            Add New Experience
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="work" className="mt-4" onValueChange={(value) => setExperienceType(value as 'work' | 'project')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="work">Work Experience</TabsTrigger>
            <TabsTrigger value="project">Project</TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            {/* Common Fields */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={handleTitleChange}
                placeholder={experienceType === 'work' ? "e.g. Senior Developer" : "e.g. Portfolio Website"}
                required
              />
            </div>

            <TabsContent value="work">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={company}
                    onChange={handleCompanyChange}
                    placeholder="e.g. Tech Corp"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employmentType">Employment Type</Label>
                  <Input
                    id="employmentType"
                    value={employmentType}
                    onChange={(e) => handleEmploymentTypeChange(e.target.value as EmploymentType)}
                    placeholder="e.g. Full-time"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
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
                        onSelect={handleStartDateChange}
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
                        {endDate ? format(endDate, "PPP") : "Present"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={handleEndDateChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={handleLocationChange}
                  placeholder="e.g. New York, NY"
                  required
                />
              </div>
            </TabsContent>

            <TabsContent value="project">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Project Type</Label>
                  <RadioGroup value={projectType} onValueChange={(value) => handleProjectTypeChange(value as ProjectType)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="individual" id="individual" />
                      <Label htmlFor="individual">Individual Project</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="group" id="group" />
                      <Label htmlFor="group">Group Project</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Project Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !projectDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {projectDate ? format(projectDate, "MMMM yyyy") : "Select completion date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={projectDate}
                        onSelect={handleProjectDateChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Technologies Used</Label>
                  <div className="flex gap-2">
                    <Input
                      value={technologies}
                      onChange={handleTechnologiesChange}
                      placeholder="e.g. React, Node.js"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectLink">Project Link (Optional)</Label>
                  <Input
                    id="projectLink"
                    value={projectLink}
                    onChange={handleProjectLinkChange}
                    placeholder="e.g. https://github.com/username/project"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Common fields for both tabs */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={handleDescriptionChange}
                placeholder="Brief description..."
                className="min-h-[100px]"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90"
              >
                Save Experience
              </Button>
            </div>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
