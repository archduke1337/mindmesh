// components/LazyImage.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import { Skeleton } from '@heroui/skeleton';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  onLoad?: () => void;
  onError?: (error: any) => void;
  placeholder?: string;
  skeletonClassName?: string;
}

export default function LazyImage({
  src,
  alt,
  className = '',
  width,
  height,
  onLoad,
  onError,
  placeholder = 'https://via.placeholder.com/400x300?text=Loading...',
  skeletonClassName = ''
}: LazyImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(placeholder);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Create intersection observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Load the actual image when it comes into view
            loadImage();
            // Stop observing once image is loaded
            if (observerRef.current && imgRef.current) {
              observerRef.current.unobserve(imgRef.current);
            }
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before image enters viewport
        threshold: 0.01
      }
    );

    // Start observing the image element
    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [src]);

  const loadImage = () => {
    const img = new Image();
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
      setHasError(false);
      if (onLoad) onLoad();
    };

    img.onerror = (error) => {
      setHasError(true);
      setIsLoading(false);
      setImageSrc(placeholder);
      if (onError) onError(error);
      console.error('Failed to load image:', src);
    };

    img.src = src;
  };

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {isLoading && (
        <Skeleton className={`absolute inset-0 ${skeletonClassName}`}>
          <div className="h-full w-full rounded-lg bg-default-300"></div>
        </Skeleton>
      )}
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        width={width}
        height={height}
        loading="lazy"
        onError={(e) => {
          if (!hasError) {
            setHasError(true);
            e.currentTarget.src = placeholder;
          }
        }}
      />
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-default-100 rounded-lg">
          <div className="text-center text-default-400 p-4">
            <svg
              className="w-12 h-12 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-xs">Failed to load image</p>
          </div>
        </div>
      )}
    </div>
  );
}
