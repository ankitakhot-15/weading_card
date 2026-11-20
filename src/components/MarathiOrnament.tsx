import React from 'react';

export const LotusDivider: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center justify-center gap-4 my-6 ${className}`} aria-hidden="true">
    <span className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-transparent to-[#C5933E]/60" />
    <svg
      width="32"
      height="20"
      viewBox="0 0 32 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-[#B58438] shrink-0"
    >
      <path
        d="M16 2C14.2 6.5 14.2 10.5 16 14C17.8 10.5 17.8 6.5 16 2Z"
        stroke="currentColor"
        strokeWidth="1.25"
        fill="currentColor"
        fillOpacity="0.16"
      />
      <path
        d="M16 14C12 12.5 9.5 9 8.5 5.5C11.8 6.5 14.2 9.5 16 14Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M16 14C20 12.5 22.5 9 23.5 5.5C20.2 6.5 17.8 9.5 16 14Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M16 15.5C10.5 15.5 6.5 13 4 10C7.5 10.5 11.5 12.2 16 15.5Z"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <path
        d="M16 15.5C21.5 15.5 25.5 13 28 10C24.5 10.5 20.5 12.2 16 15.5Z"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <circle cx="16" cy="17.5" r="1.2" fill="currentColor" />
    </svg>
    <span className="h-px flex-1 max-w-[120px] bg-gradient-to-l from-transparent to-[#C5933E]/60" />
  </div>
);

export const KalashCrest: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    width="44"
    height="44"
    viewBox="0 0 44 44"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`text-[#B58438] ${className}`}
    aria-hidden="true"
  >
    <circle cx="22" cy="22" r="20" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
    <path
      d="M22 10C20.3 13 20.3 16 22 18C23.7 16 23.7 13 22 10Z"
      fill="currentColor"
      fillOpacity="0.25"
      stroke="currentColor"
      strokeWidth="1.2"
    />
    <path
      d="M15.5 16.5C17 15 19.5 16.5 20 18.5M28.5 16.5C27 15 24.5 16.5 24 18.5"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path
      d="M16.5 21H27.5L26 24.5C28.5 26.2 28.8 30.2 26 32.5H18C15.2 30.2 15.5 26.2 18 24.5L16.5 21Z"
      stroke="currentColor"
      strokeWidth="1.35"
      fill="currentColor"
      fillOpacity="0.12"
      strokeLinejoin="round"
    />
    <path d="M18.5 27.5H25.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    <path d="M16 34.5H28" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

export const ArchCornerFiligree: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`text-[#C5933E]/65 ${className}`}
    aria-hidden="true"
  >
    <path d="M2 2V22M2 2H22" stroke="currentColor" strokeWidth="1.5" />
    <path d="M7 7V16M7 7H16" stroke="currentColor" strokeWidth="1" />
    <path
      d="M7 16C11 16 16 11 16 7"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
    />
    <circle cx="7" cy="7" r="1.5" fill="currentColor" />
  </svg>
);
