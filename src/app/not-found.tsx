"use client";
import Image from "next/image";
import Link from "next/link";
import notFound from "./404notfound.webp";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col justify-center items-center gap-4 py-16">
      <Image width={350} src={notFound} alt="NotFound" className="mx-auto" />
      <h1 className="text-8xl font-bold text-gray-300">Not Found</h1>
      <Link
        href="/"
        className="rounded-lg bg-blue-900 px-6 py-3 text-base font-medium text-white hover:opacity-85 dark:bg-blue-700"
      >
        Go to Home page
      </Link>
    </div>
  );
}
