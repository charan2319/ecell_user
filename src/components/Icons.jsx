import React from 'react';

export const CustomCartIcon = ({ size = 28, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M17,18A2,2 0 0,1 19,20A2,2 0 0,1 17,22C15.89,22 15,21.1 15,20C15,18.89 15.89,18 17,18M1,2H4.27L5.21,4H20A1,1 0 0,1 21,5C21,5.17 20.95,5.34 20.88,5.5L17.3,11.97C16.96,12.58 16.3,13 15.55,13H8.1L7.2,14.63L7.17,14.75A0.25,0.25 0 0,0 7.42,15H19V17H7A2,2 0 0,1 5,15C5,14.65 5.07,14.31 5.24,14L6.6,11.59L3,4H1V2M17,20A1,1 0 0,0 16,21A1,1 0 0,0 17,22A1,1 0 0,0 18,21A1,1 0 0,0 17,20M7,18A2,2 0 0,1 9,20A2,2 0 0,1 7,22C5.89,22 5,21.1 5,20C5,18.89 5.89,18 7,18M7,20A1,1 0 0,0 6,21A1,1 0 0,0 7,22A1,1 0 0,0 8,21A1,1 0 0,0 7,20Z" />
  </svg>
);

export const CustomProfileIcon = ({ size = 28, strokeWidth = 2.5, color = 'currentColor', fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="9" r="3" />
    <path d="M18 18.5c0-2.5-2.5-4.5-6-4.5s-6 2-6 4.5" />
  </svg>
);

export const AboutLightbulbIcon = ({ size = 32, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M12 2v1" />
    <path d="M12 18V6" />
    <path d="M4.22 4.22l.71.71" />
    <path d="M19.07 4.93l.71-.71" />
    <path d="M1 12h1" />
    <path d="M22 12h1" />
    <path d="M4.93 19.07l-.71.71" />
    <path d="M19.78 19.78l-.71-.71" />
    <path d="M9 18c-4.5 0-4.5-6 0-6s4.5 6 0 6z" visibility="hidden" />
    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
    <path d="M15 15c1.1 0 2-.9 2-2 0-1.7-1.3-3-3-3s-3 1.3-3 3c0 1.1.9 2 2 2z" visibility="hidden" />
    <path d="M12 18a6 6 0 0 0 6-6c0-3.3-2.7-6-6-6s-6 2.7-6 6a6 6 0 0 0 6 6z" />
  </svg>
);

export const AboutBookIcon = ({ size = 32, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

export const AboutRocketIcon = ({ size = 32, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="M12 15l-3-3" />
    <path d="M15 12l-3-3" />
    <path d="M13 4l.5 5h5l4.5-4.5c.75-.75.75-1.95 0-2.7s-1.95-.75-2.7 0L13 4z" visibility="hidden" />
    <path d="M9.5 14.5L16 8" visibility="hidden" />
    <path d="M17.5 15l5 5" visibility="hidden" />
    <path d="M12 12c4.14 0 7.5-3.36 7.5-7.5S16.14 0 12 0s-7.5 3.36-7.5 7.5S7.86 12 12 12z" visibility="hidden" />
    <path d="M4.5 16.5L9 12" visibility="hidden" />
    <path d="M22 2s-4 0-10 6c-3 3-5.5 8-6 10l-1 3 3-1c2-1.5 7-3.5 10-6.5 6-6 6-10 6-10z" />
    <path d="M9 12l-5 5" visibility="hidden" />
    <path d="M12 9l-5 5" visibility="hidden" />
    <circle cx="15" cy="9" r="1.5" />
  </svg>
);
