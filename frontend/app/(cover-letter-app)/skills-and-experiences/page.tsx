"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Briefcase, Zap, LucideIcon, FolderGit2 } from "lucide-react";
import AddExperience from '../app-components/AddExperience';

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

const MOCK_WORK_EXPERIENCES: WorkExperience[] = [
  {
    id: 1,
    title: "Marketing Manager",
    company: "Global Brands Inc",
    period: "2022 - Present",
    location: "New York, NY",
    type: "Full-time",
    highlights: [
      "Led successful marketing campaigns resulting in 45% increase in engagement",
      "Managed a team of 8 marketing professionals across different specialties",
      "Developed and executed digital marketing strategies for major product launches"
    ]
  },
  {
    id: 2,
    title: "Project Coordinator",
    company: "Innovation Solutions",
    period: "2020 - 2022",
    location: "Chicago, IL",
    type: "Full-time",
    highlights: [
      "Coordinated cross-functional teams for multiple concurrent projects",
      "Improved project delivery efficiency by implementing new management tools",
      "Managed client relationships and expectations effectively"
    ]
  }
];

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

const ProfessionalExperience: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-primary">
              Professional Profile
            </h1>
            <p className="text-gray-600 mt-2">
              Showcase your professional experiences and projects
            </p>
          </div>
          <AddExperience onSubmit={async (experience) => {
            // Here you would implement the logic to save the experience
            // For example:
            try {
              // Add to your backend
              // Update local state
              // Show success message
              console.log("New experience:", experience);
            } catch (error) {
              // Handle error
            }
          }} />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="work" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="work">Work Experience</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
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
                <div className="space-y-6">
                  {MOCK_WORK_EXPERIENCES.map((experience) => (
                    <Card key={experience.id} className="group hover:shadow-md transition-all duration-300 hover:border-primary">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-xl group-hover:text-primary transition-colors">
                              {experience.title}
                            </h3>
                            <p className="text-primary font-medium">
                              {experience.company}
                            </p>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                              <span>{experience.period}</span>
                              <span>•</span>
                              <span>{experience.location}</span>
                              <span>•</span>
                              <span>{experience.type}</span>
                            </div>
                          </div>
                        </div>
                        <ul className="space-y-2">
                          {experience.highlights.map((highlight, index) => (
                            <li key={index} className="flex items-start">
                              <Zap className="w-4 h-4 text-primary mt-1 mr-2 flex-shrink-0" />
                              <span className="text-gray-600 dark:text-gray-300">{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfessionalExperience;