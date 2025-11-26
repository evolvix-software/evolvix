"use client";

import { CareerPageTheme } from '../types';
import { Input } from '@/components/common/forms/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';

interface ThemePanelProps {
  theme: CareerPageTheme;
  onUpdate: (theme: Partial<CareerPageTheme>) => void;
}

export function ThemePanel({ theme, onUpdate }: ThemePanelProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-foreground mb-4">Color Scheme</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Primary Color</label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={theme.primaryColor}
                onChange={(e) => onUpdate({ primaryColor: e.target.value })}
                className="w-16 h-10"
              />
              <Input
                type="text"
                value={theme.primaryColor}
                onChange={(e) => onUpdate({ primaryColor: e.target.value })}
                placeholder="#3b82f6"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Secondary Color</label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={theme.secondaryColor}
                onChange={(e) => onUpdate({ secondaryColor: e.target.value })}
                className="w-16 h-10"
              />
              <Input
                type="text"
                value={theme.secondaryColor}
                onChange={(e) => onUpdate({ secondaryColor: e.target.value })}
                placeholder="#8b5cf6"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Background Color</label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={theme.backgroundColor}
                onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
                className="w-16 h-10"
              />
              <Input
                type="text"
                value={theme.backgroundColor}
                onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
                placeholder="#ffffff"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Text Color</label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={theme.textColor}
                onChange={(e) => onUpdate({ textColor: e.target.value })}
                className="w-16 h-10"
              />
              <Input
                type="text"
                value={theme.textColor}
                onChange={(e) => onUpdate({ textColor: e.target.value })}
                placeholder="#1f2937"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-foreground mb-4">Typography</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Font Family</label>
            <select
              value={theme.fontFamily}
              onChange={(e) => onUpdate({ fontFamily: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
            >
              <option value="Inter">Inter</option>
              <option value="Roboto">Roboto</option>
              <option value="Open Sans">Open Sans</option>
              <option value="Lato">Lato</option>
              <option value="Montserrat">Montserrat</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Heading Font</label>
            <select
              value={theme.headingFont}
              onChange={(e) => onUpdate({ headingFont: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
            >
              <option value="Inter">Inter</option>
              <option value="Roboto">Roboto</option>
              <option value="Open Sans">Open Sans</option>
              <option value="Lato">Lato</option>
              <option value="Montserrat">Montserrat</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-foreground mb-4">Layout</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Container Width</label>
            <select
              value={theme.containerWidth}
              onChange={(e) => onUpdate({ containerWidth: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
            >
              <option value="1200px">1200px</option>
              <option value="1400px">1400px</option>
              <option value="1600px">1600px</option>
              <option value="100%">Full Width</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Section Spacing (px)</label>
            <Input
              type="number"
              value={theme.sectionSpacing}
              onChange={(e) => onUpdate({ sectionSpacing: parseInt(e.target.value) })}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Border Radius (px)</label>
            <Input
              type="number"
              value={theme.borderRadius}
              onChange={(e) => onUpdate({ borderRadius: parseInt(e.target.value) })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

