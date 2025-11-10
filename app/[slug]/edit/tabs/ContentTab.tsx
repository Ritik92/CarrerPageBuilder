'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useRef } from 'react';
import { Upload } from 'lucide-react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import HeroSectionEditor from '@/components/careers/editor/HeroSectionEditor';

interface ContentSection {
  id: string;
  type: string;
  title: string;
  content: string;
  imageUrl: string | null;
  order: number;
  visible: boolean;
}

function SortableSection({ section, onToggle, onDelete }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
                <GripVertical className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardTitle>{section.title}</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={section.visible}
                onCheckedChange={(checked) => onToggle(section.id, checked)}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(section.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">{section.content}</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ContentTab({ company }: { company: any }) {
  const router = useRouter();
  const [sections, setSections] = useState<ContentSection[]>(company.contentSections);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newSection, setNewSection] = useState({ type: '', title: '', content: '', imageUrl: '' });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const imageRef = useRef<HTMLInputElement>(null);
const [uploadingImage, setUploadingImage] = useState(false);

const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setUploadingImage(true);
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'content');

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    setNewSection({ ...newSection, imageUrl: data.url });
    toast.success('Image uploaded!');
  } catch (error: any) {
    toast.error(error.message);
  } finally {
    setUploadingImage(false);
  }
};
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);

    const reorderedSections = arrayMove(sections, oldIndex, newIndex);
    setSections(reorderedSections);

    // Update order values
    const updates = reorderedSections.map((section, index) => ({
      id: section.id,
      order: index,
    }));

    try {
      const res = await fetch('/api/sections/reorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections: updates }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      toast.success('Sections reordered!');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
      setSections(company.contentSections); // Revert on error
    }
  };

 const handleAddSection = async () => {
  setLoading(true);
  try {
    const res = await fetch(`/api/companies/${company.id}/sections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newSection, order: sections.length }),
    });

    const data = await res.json();
    if (!data.success) throw new Error(data.error);

    setSections([...sections, data.data]); // Add this line
    toast.success('Section added!');
    setDialogOpen(false);
    setNewSection({ type: '', title: '', content: '', imageUrl: '' });
    router.refresh();
  } catch (error: any) {
    toast.error(error.message);
  } finally {
    setLoading(false);
  }
};

const handleDeleteSection = async (id: string) => {
  try {
    const res = await fetch(`/api/sections/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);

    setSections(sections.filter(s => s.id !== id)); // Add this line
    toast.success('Section deleted!');
    router.refresh();
  } catch (error: any) {
    toast.error(error.message);
  }
};

const handleToggleVisibility = async (id: string, visible: boolean) => {
  try {
    const res = await fetch(`/api/sections/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visible }),
    });

    const data = await res.json();
    if (!data.success) throw new Error(data.error);

    setSections(sections.map(s => s.id === id ? { ...s, visible } : s)); // Add this line
    toast.success('Visibility updated!');
    router.refresh();
  } catch (error: any) {
    toast.error(error.message);
  }
};

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Content Sections</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Section
            </Button>
          </DialogTrigger>
         <DialogContent>
  <DialogHeader>
    <DialogTitle>Add Content Section</DialogTitle>
  </DialogHeader>
  <div className="space-y-4">
    <div>
      <Label>Type</Label>
      <Input
        value={newSection.type}
        onChange={(e) => setNewSection({ ...newSection, type: e.target.value })}
        placeholder="about_us, benefits, culture..."
      />
    </div>
    <div>
      <Label>Title</Label>
      <Input
        value={newSection.title}
        onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
        placeholder="About Us"
      />
    </div>
    <div>
      <Label>Content</Label>
      <Textarea
        value={newSection.content}
        onChange={(e) => setNewSection({ ...newSection, content: e.target.value })}
        rows={5}
        placeholder="Write your content here..."
      />
    </div>
    <div>
      <Label>Image</Label>
      <div className="flex gap-2 items-end">
        <Input
          value={newSection.imageUrl}
          onChange={(e) => setNewSection({ ...newSection, imageUrl: e.target.value })}
          placeholder="https://example.com/image.jpg"
        />
        <input
          ref={imageRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => imageRef.current?.click()}
          disabled={uploadingImage}
        >
          <Upload className="h-4 w-4 mr-2" />
          {uploadingImage ? 'Uploading...' : 'Upload'}
        </Button>
      </div>
      {newSection.imageUrl && (
        <img src={newSection.imageUrl} alt="Preview" className="mt-2 h-32 rounded border" />
      )}
    </div>
    <Button onClick={handleAddSection} disabled={loading} className="w-full">
      {loading ? 'Adding...' : 'Add Section'}
    </Button>
  </div>
</DialogContent>
       </Dialog>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Hero Section</h3>
        <HeroSectionEditor company={company} />
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sections.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {sections.map((section) => (
              <SortableSection
                key={section.id}
                section={section}
                onToggle={handleToggleVisibility}
                onDelete={handleDeleteSection}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {sections.length === 0 && (
        <p className="py-12 text-center text-muted-foreground">No content sections yet. Add one to get started!</p>
      )}
    </div>
  );
}