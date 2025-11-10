'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface GradientPickerProps {
  startColor: string;
  endColor: string;
  onChange: (start: string, end: string) => void;
}

export default function GradientPicker({
  startColor,
  endColor,
  onChange,
}: GradientPickerProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Gradient Preview</Label>
        <div
          className="h-24 rounded-lg border"
          style={{
            background: `linear-gradient(135deg, ${startColor} 0%, ${endColor} 100%)`,
          }}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Start Color</Label>
          <div className="flex gap-2 mt-2">
            <Input
              type="color"
              value={startColor}
              onChange={(e) => onChange(e.target.value, endColor)}
              className="h-10 w-20 cursor-pointer"
            />
            <Input
              value={startColor}
              onChange={(e) => onChange(e.target.value, endColor)}
              placeholder="#1a4d4d"
            />
          </div>
        </div>

        <div>
          <Label>End Color</Label>
          <div className="flex gap-2 mt-2">
            <Input
              type="color"
              value={endColor}
              onChange={(e) => onChange(startColor, e.target.value)}
              className="h-10 w-20 cursor-pointer"
            />
            <Input
              value={endColor}
              onChange={(e) => onChange(startColor, e.target.value)}
              placeholder="#4a5283"
            />
          </div>
        </div>
      </div>
    </div>
  );
}