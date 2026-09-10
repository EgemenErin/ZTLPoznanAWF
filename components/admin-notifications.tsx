"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";

import { markAdminNotificationsSeen } from "@/app/admin/notifications/actions";
import { Button } from "@/components/ui/button";
import type { AdminNotification } from "@/lib/forum";
import type { Locale } from "@/lib/i18n";

type AdminNotificationsProps = {
  locale: Locale;
  notifications: AdminNotification[];
};

export function AdminNotifications({ locale, notifications }: AdminNotificationsProps) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(notifications);
  const [pending, startTransition] = useTransition();
  const panelRef = useRef<HTMLDivElement>(null);
  const unreadCount = items.filter((item) => item.unread).length;
  const isEn = locale === "en";

  useEffect(() => {
    setItems(notifications);
  }, [notifications]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function onPointerDown(event: MouseEvent) {
      if (!panelRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function handleOpen() {
    const next = !open;
    setOpen(next);
    if (next && unreadCount > 0) {
      setItems((current) => current.map((item) => ({ ...item, unread: false })));
      startTransition(() => {
        void markAdminNotificationsSeen();
      });
    }
  }

  return (
    <div className="relative" ref={panelRef}>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        aria-label={isEn ? "Notifications" : "Powiadomienia"}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={handleOpen}
        className="relative"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-wine px-1 text-[10px] font-bold text-paper">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </Button>

      {open ? (
        <div
          role="dialog"
          aria-label={isEn ? "Comment notifications" : "Powiadomienia o komentarzach"}
          className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-ink/10 bg-paper shadow-glass"
        >
          <div className="flex items-center justify-between border-b border-ink/10 px-4 py-3">
            <p className="text-sm font-semibold tracking-[0.08em]">
              {isEn ? "Comments" : "Komentarze"}
            </p>
            {pending ? (
              <span className="text-xs text-ink/45">{isEn ? "Updating…" : "Aktualizacja…"}</span>
            ) : null}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-4 py-6 text-sm text-ink/55">
                {isEn ? "No comments yet." : "Brak komentarzy."}
              </p>
            ) : (
              <ul className="divide-y divide-ink/10">
                {items.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`block px-4 py-3 transition hover:bg-ink/5 ${
                        item.unread ? "bg-wine/5" : ""
                      }`}
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brass">
                        {item.authorLabel}
                      </p>
                      <p className="mt-1 line-clamp-1 text-sm font-semibold text-ink">
                        {item.threadTitle}
                      </p>
                      <p className="mt-1 line-clamp-2 text-sm leading-5 text-ink/65">{item.body}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
