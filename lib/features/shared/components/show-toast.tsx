'use client';

import { toast } from 'sonner';

import { CheckIcon } from '@/components/ui/check.icon';

type ToastType = 'success' | 'error' | 'info' | 'warning';

export const showToast = (message: string, type: ToastType) => {
  const toastColorClass = {
    success: 'bg-[--success]',
    error: 'bg-[--error]',
    info: '',
    warning: '',
  };

  const toastIcon = {
    success: <CheckIcon />,
    error: '',
    info: '',
    warning: '',
  };

  toast.custom(() => (
    <div
      className={`${toastColorClass[type]} inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-[--toast-text]`}
    >
      <span className="text-sm font-normal">{message}</span>
      {toastIcon[type]}
    </div>
  ));
};
