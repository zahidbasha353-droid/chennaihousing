import HomeClient from "@/components/HomeClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chennai Housing - Home",
  description: "Find your dream plot in Chennai today.",
};

export default function Page() {
  return <HomeClient />;
}