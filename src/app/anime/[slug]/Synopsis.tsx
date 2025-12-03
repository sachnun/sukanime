'use client';

import { useState } from 'react';

interface SynopsisProps {
  text: string;
  maxLength?: number;
}

export default function Synopsis({ text, maxLength = 300 }: SynopsisProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const shouldTruncate = text.length > maxLength;
  const displayText = isExpanded || !shouldTruncate 
    ? text 
    : text.slice(0, maxLength).trim() + '...';

  return (
    <div>
      <p className="text-gray-300 leading-relaxed">
        {displayText}
      </p>
      {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-primary hover:text-primary-hover text-sm font-medium transition-colors"
        >
          {isExpanded ? 'Tampilkan lebih sedikit' : 'Tampilkan lebih banyak'}
        </button>
      )}
    </div>
  );
}
