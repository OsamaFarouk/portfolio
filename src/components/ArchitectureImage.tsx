"use client";

import React, { useState, useEffect, useRef } from "react";
import { Loader2, RefreshCw, AlertCircle } from "lucide-react";

interface ArchitectureImageProps {
  src: string;
  alt: string;
  fullResUrl?: string | null;
  showFullResLink?: boolean;
  isFullResPage?: boolean;
}

export default function ArchitectureImage({
  src,
  alt,
  fullResUrl,
  showFullResLink = true,
  isFullResPage = false,
}: ArchitectureImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);

    if (imgRef.current) {
      if (imgRef.current.complete) {
        if (imgRef.current.naturalWidth > 0) {
          setIsLoading(false);
          setHasError(false);
        } else {
          setIsLoading(false);
          setHasError(true);
        }
      }
    }
  }, [src, retryKey]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
    setRetryKey((prev) => prev + 1);
  };

  const currentSrc = retryKey > 0 ? `${src}${src.includes("?") ? "&" : "?"}retry=${retryKey}` : src;
  const targetFullRes = fullResUrl || src;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-mono text-xs text-accent-cyan uppercase tracking-wider">
          {isFullResPage ? "// FULL_RESOLUTION_TOPOLOGY" : "// ARCHITECTURE_TOPOLOGY"}
        </h2>

        {showFullResLink && targetFullRes && (
          <a
            href={targetFullRes}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[11px] text-accent-cyan hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>FULL_RESOLUTION ↗</span>
          </a>
        )}
      </div>

      <div className="relative w-full min-h-[220px] sm:min-h-[300px] md:min-h-[400px] bg-bg-primary rounded border border-border-muted p-2 md:p-4 overflow-hidden flex items-center justify-center">
        {/* Loading Spinner */}
        {isLoading && !hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-bg-primary z-10 space-y-3 font-mono text-xs text-accent-cyan">
            <Loader2 className="w-8 h-8 animate-spin text-accent-cyan" />
            <span className="tracking-wider text-[11px]">LOADING_TOPOLOGY_ASSET...</span>
          </div>
        )}

        {/* Error State with Retry Button */}
        {hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-bg-primary z-10 p-6 space-y-3 font-mono text-xs text-center">
            <AlertCircle className="w-8 h-8 text-accent-red" />
            <span className="text-accent-red font-bold">ERR_IMAGE_LOAD_FAILED</span>
            <p className="text-text-secondary text-[11px] max-w-md">
              Failed to load architecture diagram. Click retry to reload asset.
            </p>
            <button
              onClick={handleRetry}
              type="button"
              className="mt-2 px-4 py-2 rounded bg-bg-tertiary border border-accent-cyan/50 text-accent-cyan hover:bg-accent-cyan hover:text-bg-primary font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.15)]"
            >
              <RefreshCw size={14} />
              <span>[ RETRY ]</span>
            </button>
          </div>
        )}

        {/* Image Element */}
        <a
          href={targetFullRes}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex justify-center cursor-zoom-in"
          title="Click to view full resolution image"
        >
          <img
            ref={imgRef}
            key={currentSrc}
            src={currentSrc}
            alt={alt}
            onLoad={handleLoad}
            onError={handleError}
            className={`w-full h-auto max-w-full rounded object-contain transition-opacity duration-300 hover:opacity-95 ${
              isLoading || hasError ? "opacity-0 invisible" : "opacity-100 visible"
            }`}
            loading="eager"
          />
        </a>
      </div>
    </div>
  );
}
