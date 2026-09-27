import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { aboutParagraphs } from "@/content/about";

export const metadata: Metadata = {
  title: "About",
  description: aboutParagraphs[0],
};

export default function AboutPage() {
  redirect("/#about");
}