"use server";

import { redirect } from "next/navigation";

export async function navigate(data: FormData) {
  redirect(`/search/?query=${data.get("query")}`);
}
