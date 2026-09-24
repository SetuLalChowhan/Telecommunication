"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function TopProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeKey = `${pathname}?${searchParams.toString()}`;

  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lastRoute, setLastRoute] = useState(routeKey);

  // A route change means the pending navigation completed. Adjusting state
  // while rendering is React's recommended alternative to a
  // `setState`-inside-`useEffect`.
  if (lastRoute !== routeKey) {
    setLastRoute(routeKey);
    if (isNavigating) {
      setIsNavigating(false);
      setProgress(100);
    }
  }

  // Fade the completed bar out once the route has settled.
  useEffect(() => {
    if (progress !== 100) return;
    const timer = setTimeout(() => setProgress(0), 300);
    return () => clearTimeout(timer);
  }, [progress]);

  // Intercept click on internal links
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (
        href &&
        href.startsWith("/") &&
        !href.startsWith("#") &&
        !target.hasAttribute("download") &&
        target.getAttribute("target") !== "_blank"
      ) {
        const currentUrl = window.location.pathname + window.location.search;
        if (href !== currentUrl) {
          setIsNavigating(true);
          setProgress(30);

          setTimeout(() => {
            setProgress((prev) => (prev < 80 ? prev + 40 : prev));
          }, 150);
        }
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  if (!isNavigating && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none h-[2.5px] bg-transparent"
      aria-hidden="true"
    >
      <div
        className="h-full bg-primary shadow-[0_0_8px_rgba(23,92,211,0.6)] transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1,
          transitionProperty: "width, opacity",
        }}
      />
    </div>
  );
}

export default TopProgressBar;
