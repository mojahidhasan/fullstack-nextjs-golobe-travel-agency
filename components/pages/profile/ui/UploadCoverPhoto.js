"use client";

import { Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import { useToast } from "@/components/ui/use-toast";

import { updateCoverPhotoAction } from "@/lib/actions";
import upload from "@/public/icons/upload.svg";

export function UploadCoverPhoto() {
  const [file, setFile] = useState(null);
  const [opened, setOpened] = useState(false);
  const [state, dispatch] = useFormState(updateCoverPhotoAction, undefined);

  const { toast } = useToast();

  useEffect(() => {
    if (state?.success) {
      toast({
        title: "Success",
        description: "Your cover photo has been uploaded",
      });
      setOpened(false);
      setFile(null);
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
    <Dialog open={opened} onOpenChange={setOpened}>
      <DialogTrigger asChild>
        <Button className={"gap-1 h-auto p-2"}>
          <Image alt="upload_icon" width={24} height={24} src={upload} />
          <span className="hidden sm:inline">Upload new cover</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload new cover photo</DialogTitle>
          <DialogDescription>
            Want to update your cover photo? Upload a new one.
          </DialogDescription>
        </DialogHeader>
        <form action={dispatch} className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label
              htmlFor="upload-cover-photo-form"
              className="cursor-pointer flex items-center justify-center bg-gray-100 rounded-md border border-gray-200 p-2 text-center w-full"
            >
              <span className="text-sm text-gray-500">Choose a file</span>
            </Label>
            <Input
              id="upload-cover-photo-form"
              name="upload-cover-photo-form"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const img = URL.createObjectURL(e.currentTarget.files[0]);
                setFile(img);
              }}
            />
            <Button type="submit" size="sm" className={"px-3"} disabled={!file}>
              <span className="sr-only">Submit</span>
              <Upload className="h-4 w-4" />
            </Button>
            <div className="h-24 w-24">
              <Dialog>
                {file && (
                  <DialogTrigger
                    className="rounded-md bg-gray-100 overflow-hidden"
                    asChild
                  >
                    <Image
                      className="h-full cursor-pointer w-full object-contain"
                      src={file}
                      width={96}
                      height={96}
                      alt=""
                    />
                  </DialogTrigger>
                )}
                <DialogContent className="h-[350px] p-2 box-content max-w-[1296px]">
                  <DialogHeader>
                    <DialogTitle>Preview:</DialogTitle>
                  </DialogHeader>
                  <Image
                    className="h-full rounded-[12px] w-full object-cover"
                    src={file}
                    width={1296}
                    height={350}
                    alt="preview"
                  />
                  <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                      <Button type="button" size={"sm"} variant="secondary">
                        Close
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </form>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" size={"sm"} variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
