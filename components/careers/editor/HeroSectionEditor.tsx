'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import GradientPicker from '@/components/GradientPicker';

export default function HeroSectionEditor({ company }: { company: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const heroSection = company.contentSections.find((s: any) => s.type === 'hero');
  const heroData = heroSection?.data || {};

  const [formData, setFormData] = useState({
    heading: heroData.heading || `Careers at ${company.name}`,
    subheading: heroData.subheading || 'future',
    description: heroData.description || '',
    buttonText: heroData.buttonText || 'View jobs',
    buttonLink: heroData.buttonLink || '#jobs',
    gradientStart: heroData.gradientStart || '#1a4d4d',
    gradientEnd: heroData.gradientEnd || '#4a5283',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = heroSection
        ? `/api/sections/${heroSection.id}`
        : `/api/companies/${company.id}/sections`;

      const method = heroSection ? 'PATCH' : 'POST';

     const body = heroSection
  ? { data: formData }
  : {
      type: 'hero',
      title: 'Hero Section',
      content: 'Hero section content', 
      data: formData,
      order: 0,
      visible: true,
    };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      toast.success('Hero section updated!');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Hero Content</CardTitle>
          <CardDescription>Customize your hero section</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="heading">Main Heading</Label>
            <Input
              id="heading"
              value={formData.heading}
              onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
              placeholder="Careers at Workable"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Include your subheading text within this
            </p>
          </div>

<div>
  <Label htmlFor="subheading">Subheading (One-liner)</Label>
  <Input
    id="subheading"
    value={formData.subheading}
    onChange={(e) => setFormData({ ...formData, subheading: e.target.value })}
    placeholder="Build the future of HR technology"
  />
  <p className="text-xs text-muted-foreground mt-1">
    Brief tagline about the company
  </p>
</div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              placeholder="If you're driven, ready to deliver..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="buttonText">Button Text</Label>
              <Input
                id="buttonText"
                value={formData.buttonText}
                onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                placeholder="View jobs"
              />
            </div>
            <div>
              <Label htmlFor="buttonLink">Button Link</Label>
              <Input
                id="buttonLink"
                value={formData.buttonLink}
                onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                placeholder="#jobs"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hero Gradient</CardTitle>
          <CardDescription>Customize background colors</CardDescription>
        </CardHeader>
        <CardContent>
          <GradientPicker
            startColor={formData.gradientStart}
            endColor={formData.gradientEnd}
            onChange={(start, end) =>
              setFormData({ ...formData, gradientStart: start, gradientEnd: end })
            }
          />
        </CardContent>
      </Card>

      <Button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save Hero Section'}
      </Button>
    </form>
  );
}