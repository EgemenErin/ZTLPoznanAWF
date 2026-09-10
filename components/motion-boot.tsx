"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function MotionBoot({ locale }: { locale: string }) {
  const pathname = usePathname();

  useEffect(() => {
    const observed = new WeakSet<Element>();

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            intersectionObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    const observeNew = () => {
      document.querySelectorAll<HTMLElement>("[data-animate]").forEach((element) => {
        if (observed.has(element) || element.classList.contains("is-visible")) {
          return;
        }

        observed.add(element);
        intersectionObserver.observe(element);
      });
    };

    observeNew();

    // Soft navigations (e.g. locale cookie + redirect) can replace page DOM
    // without remounting this layout component.
    const mutationObserver = new MutationObserver(observeNew);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [pathname, locale]);

  return null;
}
