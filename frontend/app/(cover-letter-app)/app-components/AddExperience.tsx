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
import { Calendar as CalendarIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface AddExperienceProps {
  onSubmit: (experience: WorkExperience | ProjectExperience) => void;
}

interface BaseExperience {
  id?: number;
  title: string;
  description: string;
  highlights: string[];
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

const AddExperience: React.FC<AddExperienceProps> = ({ onSubmit }) => {
  const [open, setOpen] = React.useState(false);
  const [experienceType, setExperienceType] = React.useState<'work' | 'project'>('work');
  
  // Shared fields
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [currentHighlight, setCurrentHighlight] = React.useState('');
  const [highlights, setHighlights] = React.useState<string[]>([]);
  
  // Work experience fields
  const [company, setCompany] = React.useState('');
  const [startDate, setStartDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date>();
  const [location, setLocation] = React.useState('');
  const [employmentType, setEmploymentType] = React.useState('');
  
  // Project fields
  const [projectDate, setProjectDate] = React.useState<Date>();
  const [projectType, setProjectType] = React.useState<'individual' | 'group'>('individual');
  const [currentTechnology, setCurrentTechnology] = React.useState('');
  const [technologies, setTechnologies] = React.useState<string[]>([]);
  const [projectLink, setProjectLink] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (experienceType === 'work' && !startDate) return;
    if (experienceType === 'project' && !projectDate) return;

    if (experienceType === 'work') {
      onSubmit({
        type: 'work',
        title,
        company,
        startDate,
        endDate: endDate || null,
        location,
        employmentType,
        description,
        highlights,
      } as WorkExperience);
    } else {
      onSubmit({
        type: 'project',
        title,
        technologies,
        projectType,
        date: projectDate!,
        link: projectLink || undefined,
        description,
        highlights,
      } as ProjectExperience);
    }

    // Reset form
    resetForm();
    setOpen(false);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setHighlights([]);
    setCurrentHighlight('');
    
    // Reset work fields
    setCompany('');
    setStartDate(undefined);
    setEndDate(undefined);
    setLocation('');
    setEmploymentType('');
    
    // Reset project fields
    setProjectDate(undefined);
    setProjectType('individual');
    setTechnologies([]);
    setCurrentTechnology('');
    setProjectLink('');
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

  const addTechnology = () => {
    if (currentTechnology.trim()) {
      setTechnologies([...technologies, currentTechnology.trim()]);
      setCurrentTechnology('');
    }
  };

  const removeTechnology = (index: number) => {
    setTechnologies(technologies.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all">
          Add New Experience
        </Button>
      </DialogTrigger>
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
                onChange={(e) => setTitle(e.target.value)}
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
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Tech Corp"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employmentType">Employment Type</Label>
                  <Input
                    id="employmentType"
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value)}
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
                        {endDate ? format(endDate, "PPP") : "Present"}
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

              <div className="space-y-2 mt-4">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. New York, NY"
                  required
                />
              </div>
            </TabsContent>

            <TabsContent value="project">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Project Type</Label>
                  <RadioGroup value={projectType} onValueChange={(value) => setProjectType(value as 'individual' | 'group')}>
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
                        onSelect={setProjectDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Technologies Used</Label>
                  <div className="flex gap-2">
                    <Input
                      value={currentTechnology}
                      onChange={(e) => setCurrentTechnology(e.target.value)}
                      placeholder="e.g. React, Node.js"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTechnology();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={addTechnology}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {technologies.map((tech, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-primary/10 rounded-full px-3 py-1"
                      >
                        <span className="text-primary text-sm">{tech}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTechnology(index)}
                          className="h-5 w-5 p-0 ml-1 text-primary hover:text-primary/90"
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectLink">Project Link (Optional)</Label>
                  <Input
                    id="projectLink"
                    value={projectLink}
                    onChange={(e) => setProjectLink(e.target.value)}
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
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description..."
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Highlights</Label>
              <div className="flex gap-2">
                <Input
                  value={currentHighlight}
                  onChange={(e) => setCurrentHighlight(e.target.value)}
                  placeholder="Add key achievements..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addHighlight();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={addHighlight}
                  className="bg-primary hover:bg-primary/90"
                >
                  Add
                </Button>
              </div>
              <ul className="space-y-2 mt-2">
                {highlights.map((highlight, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between bg-secondary/10 p-2 rounded-md"
                  >
                    <span>{highlight}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeHighlight(index)}
                      className="text-destructive hover:text-destructive/90"
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
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
};

export default AddExperience;
