"use client";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export default function ProfileSettings() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    dob: "",
    country: "",
    preferredClass: "",
    language: "",
    email: "mojahid@example.com",
    secondaryEmail: "",
    emailNotifications: true,
    smsNotifications: false,
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Simulate fetching profile data
    const data = {
      fullName: "Mojahid",
      phone: "+880123456789",
      dob: "1995-06-15",
      country: "Bangladesh",
      preferredClass: "business",
      language: "en",
      email: "mojahid@example.com",
      secondaryEmail: "",
      emailNotifications: true,
      smsNotifications: false,
    };
    setFormData(data);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAvatarChange = (e) => {
    // TODO: Handle avatar upload
    alert("Avatar uploaded successfully!");
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleSave = () => {
    // TODO: Save profile info, avatar upload, preferences to backend API
    alert("Profile saved successfully!");
  };

  const handleCancel = () => {
    // Optionally reset form or keep current data
    setAvatarPreview(null);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-10">
      {/* Action Buttons */}
      <div className="flex justify-end gap-4"></div>
      {/* Profile Picture */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Profile Picture
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-6">
          <div className="h-24 w-24 overflow-hidden rounded-full border border-gray-300">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar Preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xl font-semibold text-gray-400">
                {formData.fullName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleAvatarChange}
            />
            <Button onClick={triggerFileSelect}>
              {avatarPreview ? "Change" : "Upload"} Avatar
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Input
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Full Name"
          />
          <Input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
          />
          <Input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
          />
          <Input
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Country"
          />
        </CardContent>
      </Card>

      {/* Contact Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Contact Methods
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">
              Primary Email (read-only)
            </label>
            <p className="font-medium">{formData.email}</p>
          </div>
          <Input
            name="secondaryEmail"
            value={formData.secondaryEmail}
            onChange={handleChange}
            placeholder="Secondary Email"
            type="email"
          />
          {/* You can extend phone number management here */}
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <label>Email Notifications</label>
            <Switch
              checked={formData.emailNotifications}
              onCheckedChange={(val) =>
                setFormData((prev) => ({ ...prev, emailNotifications: val }))
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <label>SMS Notifications</label>
            <Switch
              checked={formData.smsNotifications}
              onCheckedChange={(val) =>
                setFormData((prev) => ({ ...prev, smsNotifications: val }))
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
