import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Linkedin, Github, Send } from "lucide-react";

export const metadata = {
  title: "Contact - CoverForMe",
  description: "Get in touch with me for support or questions about CoverForMe.",
};

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="mb-8 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Get In Touch
          </h1>
          <p className="text-lg text-gray-600">
            Have questions or feedback? I'd love to hear from you!
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Form */}
          <Card className="shadow-lg col-span-2">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-primary mb-6">
                Send a Message
              </h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Your name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Your email address" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="What is this regarding?" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Tell me how I can help you..." 
                    className="min-h-[150px]"
                    required 
                  />
                </div>
                <Button className="bg-primary hover:bg-primary/90 w-full md:w-auto">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Alternative Contact Methods */}
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-primary mb-4">
                  Direct Contact
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Email</h3>
                      <a href="mailto:contact@coverforme.com" className="text-primary hover:underline">
                        contact@coverforme.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Linkedin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">LinkedIn</h3>
                      <a href="https://linkedin.com/in/joshua-ndala" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        Connect on LinkedIn
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Github className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">GitHub</h3>
                      <a href="https://github.com/joshndala" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        View Projects
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-primary mb-4">
                  Response Time
                </h2>
                <p className="text-gray-600">
                  I aim to respond to all inquiries within 24-48 hours during business days.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-primary mb-4">
                  FAQ
                </h2>
                <p className="text-gray-600 mb-4">
                  Have a general question? Check my FAQ section first.
                </p>
                <a href="/how-it-works#faq" className="text-primary hover:underline">
                  View Frequently Asked Questions
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage; 