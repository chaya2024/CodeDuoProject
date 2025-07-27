import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to get the current base URL dynamically
export function getBaseUrl(): string {
  // If environment variable is set, use it
  if (import.meta.env.VITE_BASE_URL) {
    return import.meta.env.VITE_BASE_URL;
  }
  
  // Otherwise, detect from current location
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const port = window.location.port;
  
  // For local development, include port
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.') || hostname.startsWith('10.')) {
    return `${protocol}//${hostname}${port ? `:${port}` : ''}`;
  }
  
  // For production, don't include port
  return `${protocol}//${hostname}`;
}
