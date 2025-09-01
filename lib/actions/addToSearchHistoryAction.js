"use server";

import { revalidateTag } from "next/cache";
import { auth } from "../auth";
import { createOneDoc } from "../db/createOperationDB";

export default async function addToSearchHistoryAction(type, searchState) {
  const session = await auth();
  if (!session?.user) return { success: false, message: "Unauthenticated" };
  const userId = session.user.id;

  if (userId) {
    try {
      await createOneDoc("SearchHistory", { userId, type, searchState });
      return { success: true, message: "Search history added successfully" };
    } catch (error) {
      return { success: false, message: "Something went wrong" };
    } finally {
      revalidateTag(`${userId}_${type}_searchHistory`);
    }
  }
}
