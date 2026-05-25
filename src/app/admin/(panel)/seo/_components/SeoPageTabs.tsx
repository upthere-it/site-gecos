"use client";

import { useState } from "react";
import SeoForm from "./SeoForm";

interface PageData {
  key: string;
  label: string;
  seo: Record<string, string>;
}

interface Props {
  pages: PageData[];
}

export default function SeoPageTabs({ pages }: Props) {
  const [activeKey, setActiveKey] = useState(pages[0]?.key ?? "");

  const activePage = pages.find((p) => p.key === activeKey);

  return (
    <div>
      {/* Tab bar */}
      <div className="flex flex-wrap gap-0 border-b border-gray-200 mb-6">
        {pages.map((page) => (
          <button
            key={page.key}
            onClick={() => setActiveKey(page.key)}
            className={[
              "px-4 py-2.5 text-sm font-medium border-b-2 transition-colors",
              activeKey === page.key
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-primary hover:border-gray-300",
            ].join(" ")}
          >
            {page.label}
          </button>
        ))}
      </div>

      {/* Active form */}
      {activePage && (
        <SeoForm
          key={activePage.key}
          pageKey={activePage.key}
          pageLabel={activePage.label}
          initialSeo={activePage.seo}
        />
      )}
    </div>
  );
}
