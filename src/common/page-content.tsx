"use client";

import NotFoundPage from "@/app/not-found";
import { siteConfig } from "@/config/site.config";
import { usePathname } from "next/navigation";

export const PageContent = () => {
  const pathname = usePathname();
  const pageContent =
    siteConfig.pagesContent[pathname as keyof typeof siteConfig.pagesContent];

  if (!pageContent) {
    return <NotFoundPage />;
  }

  return (
    <div
      className="prose dark:prose-invert"
      dangerouslySetInnerHTML={{ __html: pageContent.content }}
    />
  );
};
