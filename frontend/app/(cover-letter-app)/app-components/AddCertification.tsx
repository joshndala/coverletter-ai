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
import { Calendar as CalendarIcon, Award } from "lucide-react";

interface AddCertificationProps {
  onSubmit: (certification: CertificationData) => void;
}

export interface CertificationData {
  id?: number;
  title: string;
  issuingOrganization: string;
  issueDate: Date;
  expirationDate?: Date;
  credentialID?: string;
  credentialURL?: string;
  description: string;
  highlights: string[];
}

const AddCertification: React.FC<AddCertificationProps> = ({ onSubmit }) => {
  const [open, setOpen] = React.useState(false);
  
  // Form fields
  const [title, setTitle] = React.useState('');
  const [issuingOrganization, setIssuingOrganization] = React.useState('');
  const [issueDate, setIssueDate] = React.useState<Date>();
  const [expirationDate, setExpirationDate] = React.useState<Date>();
  const [credentialID, setCredentialID] = React.useState('');
  const [credentialURL, setCredentialURL] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [currentHighlight, setCurrentHighlight] = React.useState('');
  const [highlights, setHighlights] = React.useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!issueDate) return;

    onSubmit({
      title,
      issuingOrganization,
      issueDate,
      expirationDate,
      credentialID: credentialID || undefined,
      credentialURL: credentialURL || undefined,
      description,
      highlights,
    });

    // Reset form
    resetForm();
    setOpen(false);
  };

  const resetForm = () => {
    setTitle('');
    setIssuingOrganization('');
    setIssueDate(undefined);
    setExpirationDate(undefined);
    setCredentialID('');
    setCredentialURL('');
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
          <Award className="mr-2 h-4 w-4" />
          Add Certification
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">
            Add Certification
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Certification Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. AWS Certified Solutions Architect"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="issuingOrganization">Issuing Organization</Label>
            <Input
              id="issuingOrganization"
              value={issuingOrganization}
              onChange={(e) => setIssuingOrganization(e.target.value)}
              placeholder="e.g. Amazon Web Services"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Issue Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !issueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {issueDate ? format(issueDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={issueDate}
                    onSelect={setIssueDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Expiration Date (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !expirationDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {expirationDate ? format(expirationDate, "PPP") : "No expiration"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={expirationDate}
                    onSelect={setExpirationDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="credentialID">Credential ID (Optional)</Label>
              <Input
                id="credentialID"
                value={credentialID}
                onChange={(e) => setCredentialID(e.target.value)}
                placeholder="e.g. AWS-123456"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="credentialURL">Credential URL (Optional)</Label>
              <Input
                id="credentialURL"
                value={credentialURL}
                onChange={(e) => setCredentialURL(e.target.value)}
                placeholder="e.g. https://verify.aws.amazon.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the certification..."
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="highlights">Key Skills & Competencies</Label>
            <div className="flex space-x-2">
              <Input
                id="highlights"
                value={currentHighlight}
                onChange={(e) => setCurrentHighlight(e.target.value)}
                placeholder="e.g. Advanced cloud architecture"
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
              Save Certification
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCertification; 