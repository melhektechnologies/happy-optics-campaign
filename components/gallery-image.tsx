"use client";

import Image from "next/image";
import { useState } from "react";

interface GalleryImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function GalleryImage({ src, alt, className = "" }: GalleryImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const placeholderSvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23f3f4f6' width='400' height='300'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='18' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EImage Coming Soon%3C/text%3E%3C/svg%3E";

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(placeholderSvg);
    }
  };

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      className={className}
      onError={handleError}
    />
  );
}

