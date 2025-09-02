"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
export default function AppearanceSettings() {
  const [theme, setTheme] = useState("system");
  const [accent, setAccent] = useState("#2563eb");
  const [fontSize, setFontSize] = useState("base");
  const [density, setDensity] = useState("comfortable");
  const [motion, setMotion] = useState(false);

  return (
    <div className="mx-auto max-w-4xl space-y-3">
      {/* Theme Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Theme</CardTitle>
        </CardHeader>
        <CardContent>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </CardContent>
      </Card>

      {/* Accent Color */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Accent Color</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Input
            type="color"
            value={accent}
            onChange={(e) => setAccent(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Font Size */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Font Size</CardTitle>
        </CardHeader>
        <CardContent>
          <select
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="sm">Small</option>
            <option value="base">Default</option>
            <option value="lg">Large</option>
          </select>
        </CardContent>
      </Card>

      {/* Layout Density */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Layout Density
          </CardTitle>
        </CardHeader>
        <CardContent>
          <select
            value={density}
            onChange={(e) => setDensity(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="comfortable">Comfortable</option>
            <option value="compact">Compact</option>
          </select>
        </CardContent>
      </Card>

      {/* Animation Preference */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Reduce Motion</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <span className="text-muted-foreground">
            Minimize UI animations for accessibility
          </span>
          <Switch checked={motion} onCheckedChange={setMotion} />
        </CardContent>
      </Card>
    </div>
  );
}
