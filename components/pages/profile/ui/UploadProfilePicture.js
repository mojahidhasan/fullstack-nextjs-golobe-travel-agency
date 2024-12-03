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

import { useState, useRef, useEffect } from "react";
import { useFormState } from "react-dom";
import { useToast } from "@/components/ui/use-toast";

import { updateProfilePictureAction } from "@/lib/actions";

import pen from "@/public/icons/pen.svg";

export function UploadProfilePicture() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saved, setSaved] = useState(false);
  const [isDialogOpened, setIsDialogOpened] = useState(false);

  const editorRef = useRef(null);

  const [state, dispatch] = useFormState(updateProfilePictureAction, undefined);

  const { toast } = useToast();

  function handleSave() {
    const image = editorRef.current.getImage().toDataURL();
    setPreview(image);
    setSaved(true);
  }

  useEffect(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

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
              className="cursor-pointer flex items-center justify-center bg-gray-100 rounded-md border border-gray-200 p-2 text-center w-full"
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
        <div className="h-auto w-auto mx-auto rounded-lg">
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
        {file &&
          (!saved ? (
            <Button
              type="button"
              size="lg"
              onClick={() => {
                handleSave();
              }}
            >
              Save
            </Button>
          ) : (
            <Button type="button" size="lg" onClick={() => setSaved(false)}>
              Edit
            </Button>
          ))}

        {preview && (
          <Button
            formAction={dispatch}
            onClick={() => {
              toast({
                title: "Uploading...",
                description: "Please wait",
              });
            }}
            form="upload_profile_pic_form"
            type="submit"
            size="lg"
          >
            Upload
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
