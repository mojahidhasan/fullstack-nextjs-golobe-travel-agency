"use server";

import { revalidatePath, revalidateTag } from "next/cache";

export async function revalidatePathAction(paths = []) {
  paths.forEach((path) => revalidatePath(path));
}

export async function revalidateTagAction(tags = []) {
  tags.forEach((tag) => revalidateTag(tag));
}
