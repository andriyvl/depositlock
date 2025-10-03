'use client';

import React, { useState } from 'react';

import { cn } from '@/lib/utils/utils';

interface TooltipProps {
  content: React.ReactNode;
  position?:
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right';
  children: React.ReactNode;
  className?: string;
}

export const Tooltip = ({
  content,
  position = 'top',
  children,
  className,
}: TooltipProps) => {
  const [visible, setVisible] = useState(false);

  const tooltipZIndex = 9999999999;

  return (
    <div className="relative inline-block">
      <div
        className="flex items-center"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      >
        {children}
      </div>

      {visible && (
        <div
          style={{ zIndex: tooltipZIndex }}
          className={cn(`text-default absolute whitespace-nowrap text-label rounded-lg bg-[--card-background-color] border border-solid px-3 py-2 text-sm shadow-floating
          ${
            position === 'top'
              ? 'bottom-full left-1/2 mb-2 -translate-x-1/2'
              : ''
          }
          ${
            position === 'bottom'
              ? 'left-1/2 top-full mt-2 -translate-x-1/2'
              : ''
          }
          ${
            position === 'left'
              ? 'right-full top-1/2 mr-2 -translate-y-1/2'
              : ''
          }
          ${
            position === 'right'
              ? 'left-full top-1/2 ml-2 -translate-y-1/2'
              : ''
          }
          ${position === 'top-left' ? '-left-3 bottom-full mb-2' : ''}
            ${position === 'top-right' ? '-right-3 bottom-full mb-2' : ''}
            ${position === 'bottom-left' ? '-right-3 top-full mt-2' : ''}
            ${position === 'bottom-right' ? '-left-3 top-full mt-2' : ''}
          ${className}`)}
        >
          {content}
        </div>
      )}
    </div>
  );
};
