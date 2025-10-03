'use client';

export const CheckIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      className={className}
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
    >
      <path
        d="M3.83325 9.16675L6.49992 11.8334L13.1666 5.16675"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
