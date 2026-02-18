'use client';

import React from 'react';

export function Toggle({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input type="checkbox" className={`ios-switch ${className}`} {...props} />;
}
