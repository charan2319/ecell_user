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
