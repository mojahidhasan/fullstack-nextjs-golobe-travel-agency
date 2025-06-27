"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

import AvatarEditor from "react-avatar-editor";

import { useState, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";

import { updateProfilePictureAction } from "@/lib/actions";

import pen from "@/public/icons/pen.svg";
import { LoaderIcon } from "lucide-react";

export function UploadProfilePicture() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saved, setSaved] = useState(false);
  const [isDialogOpened, setIsDialogOpened] = useState(false);

  const editorRef = useRef(null);

  const { toast } = useToast();

  async function handleSave() {
    const image = editorRef.current.getImage().toDataURL();
    setPreview(image);
    setSaved(true);
  }

  const [uploading, setUploading] = useState(false);
  async function handleUpload() {
    setUploading(true);
    const formData = new FormData();
    formData.append("profilePic", preview);
    const state = await updateProfilePictureAction(null, formData);
    setUploading(false);
    if (state?.success) {
      setFile(null);
      setPreview(null);
      setSaved(false);
      setIsDialogOpened(false);
      toast({
        title: "Success",
        description: "Your avatar has been uploaded",
      });
    } else if (state?.error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={isDialogOpened} onOpenChange={setIsDialogOpened}>
      <DialogTrigger asChild>
        <Button
          className={
            "absolute bottom-0 right-0 flex h-[44px] w-[44px] items-center justify-center rounded-full bg-tertiary p-0"
          }
          variant={"icon"}
          onClick={() => setIsDialogOpened(!isDialogOpened)}
        >
          <Image
            className="h-auto w-auto"
            width={44}
            height={44}
            src={pen}
            alt=""
          />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload new avatar</DialogTitle>
          <DialogDescription>
            Want to update your avatar? Upload a new one.
          </DialogDescription>
        </DialogHeader>
        <form
          id={"upload_profile_pic_form"}
          className="flex items-center space-x-2"
        >
          <div className="grid flex-1 gap-2">
            <Label
              htmlFor="upload-profile-pic"
              className="flex w-full cursor-pointer items-center justify-center rounded-md border border-gray-200 bg-gray-100 p-2 text-center"
            >
              <span className="text-sm text-gray-500">Choose a file</span>
            </Label>
            <Input
              onChange={(e) => {
                const img = URL.createObjectURL(e.currentTarget.files[0]);
                setFile(img);
                setSaved(false);
              }}
              accept="image/png, image/jpeg, image/jpg, image/gif"
              id="upload-profile-pic"
              type="file"
              className="hidden"
              name="upload-profile-pic"
            />
          </div>
        </form>
        <div className="mx-auto h-auto w-auto rounded-lg">
          {file && !saved && (
            <AvatarEditor
              className="rounded-lg"
              ref={editorRef}
              image={file}
              width={300}
              height={300}
              border={2}
              borderRadius={111111}
              color={[0, 0, 0, 0.7]} // RGBA
              scale={1}
              rotate={0}
            />
          )}
          {saved && (
            <Image
              className="h-[300px] w-auto rounded-full border-4 border-destructive"
              width={200}
              height={200}
              src={preview}
              alt="preview_profile_pic"
            />
          )}
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          {file &&
            (!saved ? (
              <Button
                type="button"
                size="lg"
                className="w-[200px]"
                onClick={() => {
                  handleSave();
                }}
              >
                Save
              </Button>
            ) : (
              <Button
                type="button"
                className="w-[200px]"
                size="lg"
                onClick={() => setSaved(false)}
              >
                Edit
              </Button>
            ))}

          {preview && (
            <Button
              className="w-[200px]"
              size="lg"
              onClick={handleUpload}
              disabled={uploading}
              type={"button"}
            >
              {uploading ? <LoaderIcon className="animate-spin" /> : "Upload"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
