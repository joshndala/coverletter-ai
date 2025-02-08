import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Brain, Users, Briefcase, BarChart, Lightbulb, Pencil, Globe, Zap, LucideIcon } from "lucide-react";

interface Skill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  years: number;
}

interface SkillCategory {
  id: number;
  category: string;
  icon: LucideIcon;
  description: string;
  skills: Skill[];
}

interface Experience {
  id: number;
  title: string;
  company: string;
  period: string;
  location: string;
  type: string;
  highlights: string[];
}

const MOCK_SKILLS: SkillCategory[] = [
  {
    id: 1,
    category: "Professional Skills",
    icon: Briefcase,
    description: "Core competencies in your field",
    skills: [
      { name: "Project Management", level: "Expert", years: 4 },
      { name: "Strategic Planning", level: "Advanced", years: 3 },
      { name: "Budget Management", level: "Advanced", years: 2 },
      { name: "Team Leadership", level: "Expert", years: 5 }
    ]
  },
  {
    id: 2,
    category: "Interpersonal Skills",
    icon: Users,
    description: "Communication and collaboration abilities",
    skills: [
      { name: "Team Collaboration", level: "Expert", years: 5 },
      { name: "Public Speaking", level: "Advanced", years: 3 },
      { name: "Conflict Resolution", level: "Advanced", years: 4 }
    ]
  },
  {
    id: 3,
    category: "Technical Skills",
    icon: Brain,
    description: "Tools and technologies expertise",
    skills: [
      { name: "Data Analysis", level: "Advanced", years: 3 },
      { name: "Digital Marketing", level: "Intermediate", years: 2 },
      { name: "Content Creation", level: "Expert", years: 4 }
    ]
  },
  {
    id: 4,
    category: "Languages",
    icon: Globe,
    description: "Language proficiencies",
    skills: [
      { name: "English", level: "Expert", years: 20 },
      { name: "Spanish", level: "Intermediate", years: 3 },
      { name: "Mandarin", level: "Beginner", years: 1 }
    ]
  }
];

const MOCK_EXPERIENCES: Experience[] = [
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
  },
  {
    id: 3,
    title: "Marketing Associate",
    company: "Creative Agency",
    period: "2019 - 2020",
    location: "Boston, MA",
    type: "Full-time",
    highlights: [
      "Assisted in developing marketing strategies for various client campaigns",
      "Created content for social media platforms and websites",
      "Conducted market research and competitor analysis"
    ]
  }
];

const getSkillLevelColor = (level: Skill['level']): string => {
  switch (level.toLowerCase()) {
    case 'expert':
      return 'text-green-600 bg-green-100 dark:bg-green-900/30';
    case 'advanced':
      return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
    case 'intermediate':
      return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
    default:
      return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
  }
};

const SkillsAndExperience: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Professional Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Showcase your skills and professional journey
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all">
            <PlusCircle className="w-4 h-4 mr-2" />
            Add New
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="skills" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
          </TabsList>

          <TabsContent value="skills">
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between border-b">
                <div>
                  <CardTitle className="text-2xl font-bold">Skills</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your expertise and competencies
                  </p>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-6">
                  {MOCK_SKILLS.map((category) => {
                    const Icon = category.icon;
                    return (
                      <div key={category.id} className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{category.category}</h3>
                            <p className="text-sm text-muted-foreground">{category.description}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {category.skills.map((skill, index) => (
                            <Card key={index} className="group hover:shadow-md transition-all duration-300 hover:border-primary">
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-semibold group-hover:text-primary transition-colors">
                                      {skill.name}
                                    </h4>
                                    <span className="text-sm text-muted-foreground">
                                      {skill.years} {skill.years === 1 ? 'year' : 'years'}
                                    </span>
                                  </div>
                                  <span className={`text-xs px-2 py-1 rounded-full ${getSkillLevelColor(skill.level)}`}>
                                    {skill.level}
                                  </span>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experience">
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between border-b">
                <div>
                  <CardTitle className="text-2xl font-bold">Experience</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Professional work history and achievements
                  </p>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {MOCK_EXPERIENCES.map((experience) => (
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
        </Tabs>
      </div>
    </div>
  );
};

export default SkillsAndExperience;