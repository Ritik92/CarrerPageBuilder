'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Upload, X } from 'lucide-react';

export default function BrandingTab({ company }: { company: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState({
    logo: company.logo || '',
    banner: company.banner || '',
    primaryColor: company.primaryColor,
    secondaryColor: company.secondaryColor,
    backgroundColor: company.backgroundColor,
    textColor: company.textColor,
    cultureVideoUrl: company.cultureVideoUrl || '',
  });

  const logoRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File, field: 'logo' | 'banner' | 'cultureVideoUrl') => {
    setUploading({ ...uploading, [field]: true });

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'branding');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setFormData((prev) => ({ ...prev, [field]: data.url }));
      toast.success('File uploaded!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading({ ...uploading, [field]: false });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/companies/${company.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      toast.success('Branding updated successfully!');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update branding');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Brand Assets</CardTitle>
          <CardDescription>Upload your logo, banner, and culture video</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Logo */}
          <div>
            <Label>Logo</Label>
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Input
                  value={formData.logo}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  placeholder="https://example.com/logo.png"
                />
              </div>
              <input
                ref={logoRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'logo')}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => logoRef.current?.click()}
                disabled={uploading.logo}
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploading.logo ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
            {formData.logo && (
              <div className="mt-2 relative w-32 h-32 border rounded">
                <img src={formData.logo} alt="Logo" className="w-full h-full object-contain" />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6"
                  onClick={() => setFormData({ ...formData, logo: '' })}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Banner */}
          <div>
            <Label>Banner</Label>
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Input
                  value={formData.banner}
                  onChange={(e) => setFormData({ ...formData, banner: e.target.value })}
                  placeholder="https://example.com/banner.jpg"
                />
              </div>
              <input
                ref={bannerRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'banner')}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => bannerRef.current?.click()}
                disabled={uploading.banner}
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploading.banner ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
            {formData.banner && (
              <div className="mt-2 relative w-full h-32 border rounded">
                <img src={formData.banner} alt="Banner" className="w-full h-full object-cover" />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6"
                  onClick={() => setFormData({ ...formData, banner: '' })}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Culture Video */}
          <div>
            <Label>Culture Video (MP4 or YouTube/Vimeo URL)</Label>
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Input
                  value={formData.cultureVideoUrl}
                  onChange={(e) => setFormData({ ...formData, cultureVideoUrl: e.target.value })}
                  placeholder="https://youtube.com/embed/... or upload MP4"
                />
              </div>
              <input
                ref={videoRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'cultureVideoUrl')}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => videoRef.current?.click()}
                disabled={uploading.cultureVideoUrl}
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploading.cultureVideoUrl ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
            {formData.cultureVideoUrl && formData.cultureVideoUrl.endsWith('.mp4') && (
              <div className="mt-2 relative">
                <video src={formData.cultureVideoUrl} controls className="w-full h-48 rounded" />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6"
                  onClick={() => setFormData({ ...formData, cultureVideoUrl: '' })}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Brand Colors</CardTitle>
          <CardDescription>Customize your brand colors</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="primary">Primary Color</Label>
            <div className="flex gap-2">
              <Input
                id="primary"
                type="color"
                value={formData.primaryColor}
                onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                className="h-10 w-20"
              />
              <Input
                value={formData.primaryColor}
                onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                placeholder="#3B82F6"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="secondary">Secondary Color</Label>
            <div className="flex gap-2">
              <Input
                id="secondary"
                type="color"
                value={formData.secondaryColor}
                onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                className="h-10 w-20"
              />
              <Input
                value={formData.secondaryColor}
                onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                placeholder="#10B981"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="background">Background Color</Label>
            <div className="flex gap-2">
              <Input
                id="background"
                type="color"
                value={formData.backgroundColor}
                onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                className="h-10 w-20"
              />
              <Input
                value={formData.backgroundColor}
                onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                placeholder="#FFFFFF"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="text">Text Color</Label>
            <div className="flex gap-2">
              <Input
                id="text"
                type="color"
                value={formData.textColor}
                onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                className="h-10 w-20"
              />
              <Input
                value={formData.textColor}
                onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                placeholder="#1F2937"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  );
}