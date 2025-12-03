'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Download } from 'lucide-react';

interface DownloadLink {
  provider: string;
  url: string;
}

interface DownloadSection {
  resolution: string;
  links: DownloadLink[];
}

interface DownloadSectionProps {
  downloadLinks: DownloadSection[];
}

export default function DownloadSection({ downloadLinks }: DownloadSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!downloadLinks || downloadLinks.length === 0) {
    return null;
  }

  return (
    <div className="bg-card rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-card-hover transition-colors"
      >
        <div className="flex items-center gap-2">
          <Download className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Download</h2>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-muted" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted" />
        )}
      </button>

      {isOpen && (
        <div className="px-4 pb-4 space-y-4">
          {downloadLinks.map((section) => (
            <div key={section.resolution}>
              <h3 className="text-sm font-medium text-muted mb-2">
                {section.resolution}
              </h3>
              <div className="flex flex-wrap gap-2">
                {section.links.map((link) => (
                  <a
                    key={link.provider}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-secondary hover:bg-muted rounded text-sm transition-colors"
                  >
                    {link.provider}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
