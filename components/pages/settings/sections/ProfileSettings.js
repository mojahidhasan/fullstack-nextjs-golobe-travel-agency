"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/local-ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { UploadProfilePicture } from "../../profile/ui/UploadProfilePicture";
import Image from "next/image";
import { AddAnotherEmailPopup } from "../../profile/ui/AddAnotherEmailPopup";
import { Edit, Save, X } from "lucide-react";
import {
  updateAddressAction,
  updateDateOfBirthAction,
  updateNameAction,
  updatePhoneAction,
} from "@/lib/actions";
import { toast } from "@/components/ui/use-toast";

export default function ProfileSettings({ userDetails }) {
  const [isPersonalInfoEditing, setIsPersonalInfoEditing] = useState(false);
  const [personalInfoErrors, setPersonalInfoErrors] = useState({});

  const userData = {
    firstName: userDetails?.firstName,
    lastName: userDetails?.lastName,
    phone: {
      dialCode: userDetails?.phoneNumbers?.[0]?.dialCode || "",
      number: userDetails?.phoneNumbers?.[0]?.number || "",
    },
    avatar: userDetails.profileImage,
    dob: userDetails.dateOfBirth || "N/A",
    address: userDetails.address || "N/A",
    preferredClass: "business",
    language: "en",
    emails: userDetails.emails,
    primaryEmail: userDetails.emails.find((email) => email.primary),
    otherEmails: userDetails.emails.filter((email) => !email.primary),
    emailNotifications: true,
    smsNotifications: false,
  };

  const [formDataState, setFormDataState] = useState({
    firstName: "",
    lastName: "",
    phone: {
      dialCode: "",
      number: "",
    },
    dob: "",
    address: "",
    emailNotifications: true,
    smsNotifications: false,
  });

  useEffect(() => {
    setFormDataState({
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: {
        dialCode: userData.phone.dialCode,
        number: userData.phone.number,
      },
      dob: userData.dob,
      address: userData.address,
      emailNotifications: userData.emailNotifications,
      smsNotifications: userData.smsNotifications,
    });
  }, [JSON.stringify(userDetails)]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormDataState((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  function handlePhoneChange(e) {
    const { name, value } = e.target;
    setFormDataState((prev) => ({
      ...prev,
      phone: JSON.parse(value),
    }));
  }

  function handleDateOfBirthChange(e) {
    const { name, value } = e.target;
    setFormDataState((prev) => ({
      ...prev,
      dob: value,
    }));
  }

  async function handleSave(e) {
    e.target.disabled = true;
    let responsesPromise = [];

    const formDataObj = new FormData();
    formDataObj.append("firstName", formDataState.firstName);
    formDataObj.append("lastName", formDataState.lastName);
    formDataObj.append("number", formDataState.phone.number);
    formDataObj.append("dialCode", formDataState.phone.dialCode);
    formDataObj.append("dateOfBirth", formDataState.dob);
    formDataObj.append("address", formDataState.address);

    if (
      formDataState.firstName !== userData.firstName ||
      formDataState.lastName !== userData.lastName
    ) {
      responsesPromise.push(updateNameAction(null, formDataObj));
    }

    if (
      formDataState.phone.dialCode !== userData.phone.dialCode ||
      formDataState.phone.number !== userData.phone.number
    ) {
      responsesPromise.push(updatePhoneAction(null, formDataObj));
    }

    if (formDataState.dob !== userData.dob) {
      responsesPromise.push(updateDateOfBirthAction(null, formDataObj));
    }

    if (formDataState.address !== userData.address) {
      responsesPromise.push(updateAddressAction(null, formDataObj));
    }

    let errors = {};

    const responses = await Promise.all(responsesPromise);

    responses.forEach((res) => {
      if (res.error) {
        errors = { ...errors, ...res.error };
      }
      if (res.success === true && res.message) {
        toast({
          title: "Success",
          description: res.message,
        });
      }
    });

    if (Object.keys(errors).length === 0) {
      setIsPersonalInfoEditing(false);
    }
    setPersonalInfoErrors(errors);
    responsesPromise = [];
    e.target.disabled = false;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-3">
      {/* Profile Picture */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Profile Picture
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-6">
          <div className="relative flex h-40 w-40 items-center justify-center rounded-full border border-gray-300">
            {userData.avatar ? (
              <>
                <div className="h-28 w-28 overflow-hidden rounded-full">
                  <Image
                    width={100}
                    height={100}
                    src={userData.avatar}
                    alt="avatar"
                    className="h-full w-full object-cover"
                  />
                </div>
                <UploadProfilePicture />
              </>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xl font-semibold text-gray-400">
                {userData.firstName.charAt(0).toUpperCase()}
              </div>
            )}
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
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {isPersonalInfoEditing ? (
              <>
                <Input
                  name="firstName"
                  label="First Name"
                  defaultValue={formDataState.firstName}
                  error={personalInfoErrors?.firstName}
                  onChange={handleChange}
                  placeholder="John"
                />
                <Input
                  name="lastName"
                  label="Last Name"
                  defaultValue={formDataState.lastName}
                  error={personalInfoErrors?.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                />
                <Input
                  type="tel"
                  name="phone"
                  label="Phone Number"
                  value={formDataState.phone}
                  error={personalInfoErrors?.phone}
                  onChange={handlePhoneChange}
                  placeholder="Phone Number"
                  dialCodePlaceholder={"+XXX"}
                />
                <Input
                  type="date"
                  name="dateOfBirth"
                  label="Date of Birth"
                  error={personalInfoErrors?.dateOfBirth}
                  value={formDataState.dob}
                  minDate={new Date(1900, 0, 1)}
                  maxDate={new Date()}
                  onChange={handleDateOfBirthChange}
                />
                <Input
                  type="textarea"
                  name="address"
                  label="Address"
                  value={formDataState.address}
                  error={personalInfoErrors?.address}
                  onChange={handleChange}
                  placeholder="Address"
                  className={"col-span-2"}
                />
              </>
            ) : (
              <>
                <div className="text-sm font-semibold">
                  <p className="text-muted-foreground">First Name: </p>
                  <p>{userData.firstName}</p>
                </div>
                <div className="text-sm font-semibold">
                  <p className="text-muted-foreground">Last Name: </p>
                  <p>{userData.lastName}</p>
                </div>
                <div className="text-sm font-semibold">
                  <p className="text-muted-foreground">Phone: </p>
                  <p>
                    {userData.phone.dialCode
                      ? `${userData.phone.dialCode} ${userData.phone.number}`
                      : "N/A"}{" "}
                  </p>
                </div>
                <div className="text-sm font-semibold">
                  <p className="text-muted-foreground">Date of Birth: </p>
                  <p>{userData.dob || "N/A"}</p>
                </div>
                <div className="text-sm font-semibold">
                  <p className="text-muted-foreground">Address: </p>
                  <p>{userData.address || "N/A"}</p>
                </div>
              </>
            )}
          </div>
          <div className="mt-3 flex items-center justify-end">
            {isPersonalInfoEditing ? (
              <div className="space-x-3">
                <Button size="lg" onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setIsPersonalInfoEditing(false)}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </div>
            ) : (
              <Button size="lg" onClick={() => setIsPersonalInfoEditing(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            )}
          </div>
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
            <p className="font-medium">{userData?.primaryEmail?.email}</p>
          </div>
          {userData.otherEmails.length > 0 && (
            <div>
              <label className="text-sm text-muted-foreground">
                Additional Emails
              </label>
              <div className="font-medium">
                {userData.otherEmails.map((email) => {
                  return <p key={email.email}>{email.email}</p>;
                })}
              </div>
            </div>
          )}

          <AddAnotherEmailPopup />
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
              checked={formDataState.emailNotifications}
              onCheckedChange={(val) =>
                setFormDataState((prev) => ({
                  ...prev,
                  emailNotifications: val,
                }))
              }
            />
          </div>
          {/* <div className="flex items-center justify-between">
            <label>SMS Notifications</label>
            <Switch
              checked={userData.smsNotifications}
              onCheckedChange={(val) =>
                setuserData((prev) => ({ ...prev, smsNotifications: val }))
              }
            />
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
}
