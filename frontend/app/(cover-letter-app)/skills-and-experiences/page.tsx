"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PlusCircle, 
  Briefcase, 
  Zap, 
  FolderGit2, 
  GraduationCap, 
  Award,
  ChevronDown
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddExperience from '../app-components/AddExperience';
import { createExperience, getUserExperiences, deleteExperience, Experience as ApiExperience } from '../api/experience';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { getAuthFromStorage } from '@/lib/sessionStorage';

interface BaseExperience {
  id: number;
  title: string;
  description?: string;
  highlights: string[];
}

interface WorkExperience extends BaseExperience {
  company: string;
  period: string;
  location: string;
  type: string;
}

interface Project extends BaseExperience {
  technologies: string[];
  date: string;
  projectType: 'individual' | 'group';
  link?: string;
}

interface Education extends BaseExperience {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  period: string;
  location: string;
  gpa?: string;
}

interface Certification extends BaseExperience {
  issuingOrganization: string;
  issueDate: string;
  expirationDate?: string;
  credentialID?: string;
  credentialURL?: string;
}

const MOCK_PROJECTS: Project[] = [
  {
    id: 1,
    title: "Personal Portfolio Website",
    technologies: ["React", "TypeScript", "Tailwind CSS"],
    date: "Jan 2024",
    projectType: "individual",
    description: "A modern portfolio website showcasing my work and skills",
    highlights: [
      "Implemented responsive design with modern UI/UX principles",
      "Integrated dark mode and accessibility features",
      "Achieved 95+ performance score on Lighthouse"
    ],
    link: "https://portfolio.example.com"
  },
  {
    id: 2,
    title: "Community Event Platform",
    technologies: ["Next.js", "Node.js", "PostgreSQL"],
    date: "Nov 2023",
    projectType: "group",
    description: "A platform for organizing and managing local community events",
    highlights: [
      "Built full-stack application with real-time updates",
      "Implemented user authentication and authorization",
      "Developed API for event management and RSVPs"
    ],
    link: "https://github.com/username/event-platform"
  }
];

const MOCK_EDUCATION: Education[] = [
  {
    id: 1,
    title: "Bachelor of Science",
    institution: "University of Technology",
    degree: "Bachelor's Degree",
    fieldOfStudy: "Computer Science",
    period: "2016 - 2020",
    location: "Boston, MA",
    gpa: "3.8/4.0",
    highlights: [
      "Graduated with Honors",
      "Senior thesis on 'Machine Learning Applications in Healthcare'",
      "Teaching Assistant for Introduction to Programming courses"
    ]
  },
  {
    id: 2,
    title: "High School Diploma",
    institution: "Central High School",
    degree: "Diploma",
    fieldOfStudy: "General Education",
    period: "2012 - 2016",
    location: "Chicago, IL",
    highlights: [
      "Advanced Placement in Mathematics and Computer Science",
      "Student Government President",
      "National Honor Society Member"
    ]
  }
];

const MOCK_CERTIFICATIONS: Certification[] = [
  {
    id: 1,
    title: "AWS Certified Solutions Architect",
    issuingOrganization: "Amazon Web Services",
    issueDate: "Jan 2023",
    expirationDate: "Jan 2026",
    credentialID: "AWS-123456",
    credentialURL: "https://aws.amazon.com/verification",
    highlights: [
      "Scored 890/1000 on the certification exam",
      "Specialized in serverless architecture design",
      "Developed expertise in cost optimization strategies"
    ]
  },
  {
    id: 2,
    title: "Professional Scrum Master I",
    issuingOrganization: "Scrum.org",
    issueDate: "Mar 2022",
    credentialID: "PSM-123456",
    credentialURL: "https://www.scrum.org/certificates",
    highlights: [
      "In-depth understanding of Scrum Framework",
      "Expertise in facilitating Scrum events",
      "Ability to coach teams on Agile practices"
    ]
  }
];

const ProfessionalExperience: React.FC = () => {
  // State for dialog visibility
  const [isEducationDialogOpen, setIsEducationDialogOpen] = useState(false);
  const [isCertificationDialogOpen, setIsCertificationDialogOpen] = useState(false);
  const [isExperienceDialogOpen, setIsExperienceDialogOpen] = useState(false);
  
  // State for form input
  const [newEducation, setNewEducation] = useState({
    title: '',
    institution: '',
    degree: '',
    fieldOfStudy: '',
    period: '',
    location: '',
    gpa: '',
    highlights: ['']
  });

  const [newCertification, setNewCertification] = useState({
    title: '',
    issuingOrganization: '',
    issueDate: '',
    expirationDate: '',
    highlights: ['']
  });

  // Add state for API-fetched experiences
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([]);
  const [apiExperiences, setApiExperiences] = useState<ApiExperience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Add a useEffect to fetch experiences on page load
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching experiences...");
        
        // Check if authentication is available
        const auth = getAuthFromStorage();
        console.log("Auth available:", !!auth?.firebase_id_token);
        
        const experiences = await getUserExperiences();
        console.log("Experiences fetched:", experiences);
        setApiExperiences(experiences);
        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch experiences:', err);
        setError(`Failed to load experiences: ${err.message || 'Unknown error'}`);
        toast({
          title: 'Error',
          description: `Failed to load experiences: ${err.message || 'Unknown error'}`,
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchExperiences();
  }, []);

  // Helper function for updating highlights array
  const updateEducationHighlight = (index: number, value: string) => {
    const updatedHighlights = [...newEducation.highlights];
    updatedHighlights[index] = value;
    setNewEducation({ ...newEducation, highlights: updatedHighlights });
  };

  const addEducationHighlight = () => {
    setNewEducation({ 
      ...newEducation, 
      highlights: [...newEducation.highlights, ''] 
    });
  };

  const removeEducationHighlight = (index: number) => {
    const updatedHighlights = newEducation.highlights.filter((_, i) => i !== index);
    setNewEducation({ ...newEducation, highlights: updatedHighlights });
  };

  // Helper function for updating certification highlights
  const updateCertificationHighlight = (index: number, value: string) => {
    const updatedHighlights = [...newCertification.highlights];
    updatedHighlights[index] = value;
    setNewCertification({ ...newCertification, highlights: updatedHighlights });
  };

  const addCertificationHighlight = () => {
    setNewCertification({ 
      ...newCertification, 
      highlights: [...newCertification.highlights, ''] 
    });
  };

  const removeCertificationHighlight = (index: number) => {
    const updatedHighlights = newCertification.highlights.filter((_, i) => i !== index);
    setNewCertification({ ...newCertification, highlights: updatedHighlights });
  };

  // Handle form submissions
  const handleAddEducation = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('New education entry:', newEducation);
    // Here you would add the new education entry to your data
    // Reset form fields
    setNewEducation({
      title: '',
      institution: '',
      degree: '',
      fieldOfStudy: '',
      period: '',
      location: '',
      gpa: '',
      highlights: ['']
    });
    setIsEducationDialogOpen(false);
  };

  const handleAddCertification = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('New certification entry:', newCertification);
    // Here you would add the new certification entry to your data
    // Reset form fields
    setNewCertification({
      title: '',
      issuingOrganization: '',
      issueDate: '',
      expirationDate: '',
      highlights: ['']
    });
    setIsCertificationDialogOpen(false);
  };
  
  const handleExperienceSubmit = async (experienceData: any) => {
    try {
      // Format the data according to our API requirements
      const apiExperienceData = {
        company_name: experienceData.company,
        title: experienceData.title,
        location: experienceData.location,
        start_date: experienceData.startDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        end_date: experienceData.endDate ? experienceData.endDate.toISOString().split('T')[0] : null,
        is_current: !experienceData.endDate,
        description: experienceData.description
        // skills field removed as it's not implemented in backend
      };
      
      // Call the API to create the experience
      const createdExperience = await createExperience(apiExperienceData);
      
      // Add the new experience to the state
      setApiExperiences(prevExperiences => [...prevExperiences, createdExperience]);
      
      toast({
        title: 'Success',
        description: 'Experience added successfully!',
      });
      
      // Close the dialog by setting isExperienceDialogOpen to false if it exists
      if (typeof setIsExperienceDialogOpen === 'function') {
        setIsExperienceDialogOpen(false);
      }
    } catch (error) {
      console.error('Failed to create experience:', error);
      toast({
        title: 'Error',
        description: 'Failed to add experience. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Add a function to handle experience deletion
  const handleDeleteExperience = async (experienceId: string) => {
    try {
      await deleteExperience(experienceId);
      
      // Remove the deleted experience from the state
      setApiExperiences(prevExperiences => 
        prevExperiences.filter(exp => exp.id !== experienceId)
      );
      
      toast({
        title: 'Success',
        description: 'Experience deleted successfully!',
      });
    } catch (error) {
      console.error('Failed to delete experience:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete experience. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-primary">
              Professional Profile
            </h1>
            <p className="text-gray-600 mt-2">
              Showcase your professional experiences, education, projects, and certifications
            </p>
          </div>
          <div>
            {/* Consolidated Add Button with Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-primary text-white hover:bg-primary/90">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsExperienceDialogOpen(true)}>
                  <Briefcase className="mr-2 h-4 w-4" />
                  Add Work Experience
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsEducationDialogOpen(true)}>
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Add Education
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsCertificationDialogOpen(true)}>
                  <Award className="mr-2 h-4 w-4" />
                  Add Certification
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Experience Dialog */}
            <Dialog open={isExperienceDialogOpen} onOpenChange={setIsExperienceDialogOpen}>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-primary">
                    Add Work Experience
                  </DialogTitle>
                </DialogHeader>
                <AddExperience 
                  onSubmit={handleExperienceSubmit} 
                  onCancel={() => setIsExperienceDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>

            {/* Education Dialog */}
            <Dialog open={isEducationDialogOpen} onOpenChange={setIsEducationDialogOpen}>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-primary">
                    Add Education
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddEducation} className="space-y-6 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="degree">Degree</Label>
                    <Input
                      id="degree"
                      value={newEducation.degree}
                      onChange={(e) => setNewEducation({...newEducation, degree: e.target.value})}
                      placeholder="e.g. Bachelor of Science, High School Diploma"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fieldOfStudy">Field of Study</Label>
                      <Input
                        id="fieldOfStudy"
                        value={newEducation.fieldOfStudy}
                        onChange={(e) => setNewEducation({...newEducation, fieldOfStudy: e.target.value})}
                        placeholder="e.g. Computer Science"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="institution">Institution</Label>
                      <Input
                        id="institution"
                        value={newEducation.institution}
                        onChange={(e) => setNewEducation({...newEducation, institution: e.target.value})}
                        placeholder="e.g. University of Technology"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="period">Period</Label>
                      <Input
                        id="period"
                        value={newEducation.period}
                        onChange={(e) => setNewEducation({...newEducation, period: e.target.value})}
                        placeholder="e.g. 2016 - 2020"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={newEducation.location}
                        onChange={(e) => setNewEducation({...newEducation, location: e.target.value})}
                        placeholder="e.g. Boston, MA"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gpa">GPA (Optional)</Label>
                    <Input
                      id="gpa"
                      value={newEducation.gpa}
                      onChange={(e) => setNewEducation({...newEducation, gpa: e.target.value})}
                      placeholder="e.g. 3.8/4.0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Key Achievements (Optional)</Label>
                    {newEducation.highlights.map((highlight, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={highlight}
                          onChange={(e) => updateEducationHighlight(index, e.target.value)}
                          placeholder={`Achievement ${index + 1}`}
                        />
                        {index > 0 && (
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="icon"
                            onClick={() => removeEducationHighlight(index)}
                            className="h-10 w-10"
                          >
                            &times;
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addEducationHighlight}
                      className="mt-2"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Achievement
                    </Button>
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsEducationDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-primary hover:bg-primary/90">
                      Save Education
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* Certification Dialog */}
            <Dialog open={isCertificationDialogOpen} onOpenChange={setIsCertificationDialogOpen}>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-primary">
                    Add Certification
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddCertification} className="space-y-6 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="certTitle">Certification Title</Label>
                    <Input
                      id="certTitle"
                      value={newCertification.title}
                      onChange={(e) => setNewCertification({...newCertification, title: e.target.value})}
                      placeholder="e.g. AWS Certified Solutions Architect"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="issuingOrg">Issuing Organization</Label>
                    <Input
                      id="issuingOrg"
                      value={newCertification.issuingOrganization}
                      onChange={(e) => setNewCertification({...newCertification, issuingOrganization: e.target.value})}
                      placeholder="e.g. Amazon Web Services"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="issueDate">Issue Date</Label>
                      <Input
                        id="issueDate"
                        value={newCertification.issueDate}
                        onChange={(e) => setNewCertification({...newCertification, issueDate: e.target.value})}
                        placeholder="e.g. Jan 2023"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expirationDate">Expiration Date (Optional)</Label>
                      <Input
                        id="expirationDate"
                        value={newCertification.expirationDate}
                        onChange={(e) => setNewCertification({...newCertification, expirationDate: e.target.value})}
                        placeholder="e.g. Jan 2026"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Key Skills & Competencies</Label>
                    {newCertification.highlights.map((highlight, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={highlight}
                          onChange={(e) => updateCertificationHighlight(index, e.target.value)}
                          placeholder={`Skill/Competency ${index + 1}`}
                          required={index === 0}
                        />
                        {index > 0 && (
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="icon"
                            onClick={() => removeCertificationHighlight(index)}
                            className="h-10 w-10"
                          >
                            &times;
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addCertificationHighlight}
                      className="mt-2"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Skill/Competency
                    </Button>
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsCertificationDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-primary hover:bg-primary/90">
                      Save Certification
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="work" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="work">
              <Briefcase className="h-4 w-4 mr-2" />
              Work Experience
            </TabsTrigger>
            <TabsTrigger value="projects">
              <FolderGit2 className="h-4 w-4 mr-2" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="education">
              <GraduationCap className="h-4 w-4 mr-2" />
              Education
            </TabsTrigger>
            <TabsTrigger value="certifications">
              <Award className="h-4 w-4 mr-2" />
              Certifications
            </TabsTrigger>
          </TabsList>

          {/* Work Experience Tab */}
          <TabsContent value="work">
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between border-b">
                <div>
                  <CardTitle className="text-2xl font-bold">Professional Experience</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your work history and achievements
                  </p>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {/* Display loading state */}
                {isLoading && (
                  <div className="flex justify-center items-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    <span className="ml-2">Loading experiences...</span>
                  </div>
                )}

                {/* Display error message if any */}
                {error && (
                  <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                    <span className="font-medium">Error:</span> {error}
                  </div>
                )}

                {/* Display API experiences */}
                {apiExperiences.length > 0 && (
                  <>
                    <h3 className="font-semibold text-lg mb-2 mt-4">Your Experiences</h3>
                    {apiExperiences.map((exp) => (
                      <Card key={exp.id} className="mb-4">
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-lg">{exp.title}</h4>
                              <p className="text-gray-600">{exp.company_name}</p>
                              <p className="text-sm text-gray-500">
                                {exp.start_date} - {exp.end_date || 'Present'} • {exp.location || 'Remote'}
                              </p>
                              <p className="mt-2">{exp.description}</p>
                              
                              {/* Skills section removed as it's not implemented in backend */}
                            </div>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-red-600" 
                                  onClick={() => handleDeleteExperience(exp.id)}
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between border-b">
                <div>
                  <CardTitle className="text-2xl font-bold">Personal Projects</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your side projects and personal work
                  </p>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {MOCK_PROJECTS.length === 0 ? (
                  <div className="text-center py-8">
                    <FolderGit2 className="h-12 w-12 mx-auto text-gray-300" />
                    <h3 className="mt-4 text-lg font-medium">No projects yet</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Add your first project using the Add button above
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {MOCK_PROJECTS.map((project) => (
                      <Card key={project.id} className="group hover:shadow-md transition-all duration-300 hover:border-primary">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-semibold text-xl group-hover:text-primary transition-colors">
                                {project.title}
                              </h3>
                              <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                                <span>{project.date}</span>
                                <span>•</span>
                                <span className="capitalize">{project.projectType} Project</span>
                              </div>
                              {project.description && (
                                <p className="text-gray-600 dark:text-gray-300 mt-2">
                                  {project.description}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 my-3">
                            {project.technologies.map((tech, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 rounded-full bg-primary/10 text-primary text-sm"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>

                          <ul className="space-y-2 mt-4">
                            {project.highlights.map((highlight, index) => (
                              <li key={index} className="flex items-start">
                                <Zap className="w-4 h-4 text-primary mt-1 mr-2 flex-shrink-0" />
                                <span className="text-gray-600 dark:text-gray-300">{highlight}</span>
                              </li>
                            ))}
                          </ul>

                          {project.link && (
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center mt-4 text-primary hover:underline"
                            >
                              <FolderGit2 className="w-4 h-4 mr-2" />
                              View Project
                            </a>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Education Tab */}
          <TabsContent value="education">
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between border-b">
                <div>
                  <CardTitle className="text-2xl font-bold">Education History</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your academic background and achievements
                  </p>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {MOCK_EDUCATION.length === 0 ? (
                  <div className="text-center py-8">
                    <GraduationCap className="h-12 w-12 mx-auto text-gray-300" />
                    <h3 className="mt-4 text-lg font-medium">No education entries yet</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Add your first education entry using the Add button above
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {MOCK_EDUCATION.map((education) => (
                      <Card key={education.id} className="group hover:shadow-md transition-all duration-300 hover:border-primary">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-semibold text-xl group-hover:text-primary transition-colors">
                                {education.title} in {education.fieldOfStudy}
                              </h3>
                              <p className="text-primary font-medium">
                                {education.institution}
                              </p>
                              <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                                <span>{education.period}</span>
                                <span>•</span>
                                <span>{education.location}</span>
                                {education.gpa && (
                                  <>
                                    <span>•</span>
                                    <span>GPA: {education.gpa}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <ul className="space-y-2">
                            {education.highlights.map((highlight, index) => (
                              <li key={index} className="flex items-start">
                                <GraduationCap className="w-4 h-4 text-primary mt-1 mr-2 flex-shrink-0" />
                                <span className="text-gray-600 dark:text-gray-300">{highlight}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Certifications Tab */}
          <TabsContent value="certifications">
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between border-b">
                <div>
                  <CardTitle className="text-2xl font-bold">Professional Certifications</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your certifications and credentials
                  </p>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {MOCK_CERTIFICATIONS.length === 0 ? (
                  <div className="text-center py-8">
                    <Award className="h-12 w-12 mx-auto text-gray-300" />
                    <h3 className="mt-4 text-lg font-medium">No certifications yet</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Add your first certification using the Add button above
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {MOCK_CERTIFICATIONS.map((certification) => (
                      <Card key={certification.id} className="group hover:shadow-md transition-all duration-300 hover:border-primary">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-semibold text-xl group-hover:text-primary transition-colors">
                                {certification.title}
                              </h3>
                              <p className="text-primary font-medium">
                                {certification.issuingOrganization}
                              </p>
                              <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                                <span>Issued: {certification.issueDate}</span>
                                {certification.expirationDate && (
                                  <>
                                    <span>•</span>
                                    <span>Expires: {certification.expirationDate}</span>
                                  </>
                                )}
                                {certification.credentialID && (
                                  <>
                                    <span>•</span>
                                    <span>ID: {certification.credentialID}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <ul className="space-y-2">
                            {certification.highlights.map((highlight, index) => (
                              <li key={index} className="flex items-start">
                                <Award className="w-4 h-4 text-primary mt-1 mr-2 flex-shrink-0" />
                                <span className="text-gray-600 dark:text-gray-300">{highlight}</span>
                              </li>
                            ))}
                          </ul>

                          {certification.credentialURL && (
                            <a
                              href={certification.credentialURL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center mt-4 text-primary hover:underline"
                            >
                              <Award className="w-4 h-4 mr-2" />
                              Verify Certification
                            </a>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfessionalExperience;