'use client';

import { Toaster, ToasterProps } from 'sonner';

interface ToastNotificationProps extends ToasterProps {
  width?: string;
}

export const ToastNotification = ({
  position = 'bottom-center',
  duration = 3000,
  width = '328px',
}: ToastNotificationProps) => {

  const toastNotificationZIndex = 9999999999;

  return (
    <Toaster
      expand
      toastOptions={{
        style: { minWidth: width },
      }}
      style={{ zIndex: toastNotificationZIndex }}
      visibleToasts={3}
      duration={duration}
      position={position}
    />
  );
};
