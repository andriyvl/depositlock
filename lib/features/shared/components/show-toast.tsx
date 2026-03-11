'use client';

import { toast } from 'sonner';

import { CheckIcon } from '@/components/ui/check.icon';

type ToastType = 'success' | 'error' | 'info' | 'warning';

export const showToast = (message: string, type: ToastType) => {
  const toastClassName = {
    success: 'border-primary-200 bg-primary-100 text-secondary-900',
    error: 'border-destructive-200 bg-destructive-100 text-destructive-800',
    info: 'border-tertiary-200 bg-tertiary-100 text-secondary-800',
    warning: 'border-accent-200 bg-accent-100 text-accent-800',
  };

  const toastIcon = {
    success: <CheckIcon />,
    error: null,
    info: null,
    warning: null,
  };

  toast.custom(() => (
    <div
      className={`${toastClassName[type]} inline-flex w-full items-center justify-center gap-2 rounded-full border px-4 py-3 text-sm font-medium shadow-floating`}
    >
      <span>{message}</span>
      {toastIcon[type]}
    </div>
  ));
};
