"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const HIDDEN_ROUTES = [
  "/signin",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/admin",
];

declare global {
  interface Window {
    $zoho?: {
      salesiq?: {
        ready?: () => void;
        floatwindow?: {
          visible: (mode: "show" | "hide") => void;
        };
      };
    };
  }
}

let scriptsLoaded = false;

export default function ChatBotButton() {
  const pathname = usePathname();
  const wasHiddenRef = useRef(false);

  const shouldHide = HIDDEN_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // Load Zoho SalesIQ scripts once
  useEffect(() => {
    if (scriptsLoaded) return;
    scriptsLoaded = true;

    window.$zoho = window.$zoho || {};
    window.$zoho.salesiq = window.$zoho.salesiq || {
      ready: function () {},
    };

    const script = document.createElement("script");
    script.id = "zsiqscript";
    script.src =
      "https://salesiq.zohopublic.com/widget?wc=siq305e35b9b1d3b72c2db4c9906d40446582284415e714acbbf7c960431f93fd90";
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  // Only hide/show widget when transitioning between hidden and visible routes
  useEffect(() => {
    const toggle = () => {
      const fw = window.$zoho?.salesiq?.floatwindow;
      if (!fw) return;

      if (shouldHide) {
        fw.visible("hide");
        wasHiddenRef.current = true;
      } else if (wasHiddenRef.current) {
        // Only call "show" when coming back from a hidden route
        fw.visible("show");
        wasHiddenRef.current = false;
      }
    };

    toggle();
    const timeout = setTimeout(toggle, 1500);
    return () => clearTimeout(timeout);
  }, [shouldHide]);

  return null;
}
