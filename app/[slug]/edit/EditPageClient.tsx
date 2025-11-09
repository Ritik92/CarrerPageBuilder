'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import BrandingTab from './tabs/BrandingTab';
import ContentTab from './tabs/ContentTab';
import JobsTab from './tabs/JobsTab';
import SettingsTab from './tabs/SettingsTab';

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

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{company.name}</h1>
              <p className="text-muted-foreground">Edit your careers page</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.push(`/${company.slug}/preview`)}>
                Preview
              </Button>
              <Button onClick={() => router.push(`/${company.slug}/careers`)}>
                View Live
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="branding">
            <BrandingTab company={company} />
          </TabsContent>

          <TabsContent value="content">
            <ContentTab company={company} />
          </TabsContent>

          <TabsContent value="jobs">
            <JobsTab company={company} />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsTab company={company} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}