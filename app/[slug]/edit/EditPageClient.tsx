'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import BrandingTab from './tabs/BrandingTab';
import ContentTab from './tabs/ContentTab';
import JobsTab from './tabs/JobsTab';
import SettingsTab from './tabs/SettingsTab';
import { Briefcase, Eye, ExternalLink, Copy, Check, Palette, FileText, Users, Settings as SettingsIcon } from 'lucide-react';

interface Company {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  banner: string | null;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  cultureVideoUrl: string | null;
  published: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  jobs: any[];
  contentSections: any[];
}

export default function EditPageClient({ company }: { company: Company }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('branding');
  const [copied, setCopied] = useState(false);
  
  const careersUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/${company.slug}/careers`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(careersUrl);
    setCopied(true);
    toast.success('Link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="container mx-auto px-4 lg:px-8 py-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              {company.logo ? (
                <img src={company.logo} alt={company.name} className="h-12 w-12 rounded-xl object-cover" />
              ) : (
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-xl lg:text-2xl font-bold text-slate-900 truncate">{company.name}</h1>
                  {company.published && (
                    <Badge className="bg-teal-100 text-teal-700 hover:bg-teal-100 border-teal-200">
                      Live
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-slate-500 hidden sm:block">Dashboard</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.push(`/${company.slug}/preview`)}
                className="hidden sm:flex"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button 
                size="sm"
                onClick={() => router.push(`/${company.slug}/careers`)}
                className="bg-teal-600 hover:bg-teal-700"
              >
                <ExternalLink className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">View Live</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 lg:px-8 py-8 max-w-7xl">
        {/* Share Section */}
        <div className="mb-8">
          <Card className="border-2 border-teal-100 bg-gradient-to-br from-teal-50 to-cyan-50 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">Your Careers Page URL</h3>
                  <p className="text-sm text-slate-600">Share this link with candidates</p>
                </div>
               
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 bg-white rounded-xl border-2 border-slate-200 px-4 py-3.5 font-mono text-sm text-slate-700 overflow-x-auto whitespace-nowrap">
                  {careersUrl}
                </div>
                <Button 
                  onClick={copyToClipboard}
                  className="bg-teal-600 hover:bg-teal-700 sm:w-auto"
                  size="lg"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Link
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="bg-white rounded-xl border shadow-sm p-2">
            <TabsList className="grid w-full grid-cols-4 bg-transparent gap-1">
              <TabsTrigger 
                value="branding" 
                className="flex items-center justify-center gap-2 data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700"
              >
                <Palette className="h-4 w-4" />
                <span className="hidden md:inline">Branding</span>
              </TabsTrigger>
              <TabsTrigger 
                value="content"
                className="flex items-center justify-center gap-2 data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700"
              >
                <FileText className="h-4 w-4" />
                <span className="hidden md:inline">Content</span>
              </TabsTrigger>
              <TabsTrigger 
                value="jobs"
                className="flex items-center justify-center gap-2 data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700"
              >
                <Users className="h-4 w-4" />
                <span className="hidden md:inline">Jobs</span>
              </TabsTrigger>
              <TabsTrigger 
                value="settings"
                className="flex items-center justify-center gap-2 data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700"
              >
                <SettingsIcon className="h-4 w-4" />
                <span className="hidden md:inline">Settings</span>
              </TabsTrigger>
              
            </TabsList>
          </div>

          <TabsContent value="branding" className="mt-6">
            <BrandingTab company={company} />
          </TabsContent>

          <TabsContent value="content" className="mt-6">
            <ContentTab company={company} />
          </TabsContent>

          <TabsContent value="jobs" className="mt-6">
            <JobsTab company={company} />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <SettingsTab company={company} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}