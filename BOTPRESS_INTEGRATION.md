# Botpress Chatbot Integration Guide

## What We Need From the Client

### Required (Must Have)

1. **Botpress Cloud Account**
   - Create an account at https://app.botpress.cloud
   - Set up a workspace for LKnight Productions

2. **Published Bot**
   - Build and publish the chatbot in Botpress Studio
   - The bot must be in "Published" state (not just draft)

3. **Bot ID**
   - Found in Botpress Cloud Dashboard → Bot Settings
   - Format: a unique alphanumeric string (e.g., `abc123def456`)

4. **Webchat Script Snippet**
   - Botpress generates two `<script>` tags after publishing
   - Example:
     ```html
     <script src="https://cdn.botpress.cloud/webchat/v2.2/inject.js"></script>
     <script src="https://files.bpcontent.cloud/2024/xx/xx/xx/bot.js"></script>
     ```
   - Both URLs are required for integration

### Optional (Nice to Have)

5. **Custom Styling Preferences**
   - Primary color (currently using `#FF6F00` to match LKnight branding)
   - Bot avatar image URL
   - Welcome message text
   - Placeholder text for the chat input

6. **Bot Behavior Configuration**
   - Should the bot auto-open on first visit?
   - Delay before showing a welcome bubble (in seconds)
   - Pages where the bot should NOT appear (currently hidden on auth and admin pages)

---

## How Integration Works

### Architecture

The LKnight LMS website uses **Next.js (App Router)**. Botpress provides a lightweight webchat widget that loads via external scripts.

### Current Setup

- An **"AI Chat" button** is placed in the hero section of the home page (`src/components/HeroSection.tsx`)
- The button is positioned below the "Go Live" button and scrolls with the page
- Currently shows a **"Coming Soon"** tooltip on hover
- Hidden on auth pages (`/signin`, `/signup`, `/forgot-password`, `/reset-password`) and admin routes

### Integration Steps (For Developer)

Once the client provides the Bot ID and script URLs:

1. **Create a Botpress provider component** (`src/components/BotpressProvider.tsx`):

```tsx
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const HIDDEN_ROUTES = ["/signin", "/signup", "/forgot-password", "/reset-password", "/admin"];

export default function BotpressProvider() {
  const pathname = usePathname();

  useEffect(() => {
    const shouldHide = HIDDEN_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    );

    if (shouldHide) return;

    // Load Botpress webchat scripts
    const script1 = document.createElement("script");
    script1.src = "https://cdn.botpress.cloud/webchat/v2.2/inject.js";
    script1.async = true;
    document.body.appendChild(script1);

    const script2 = document.createElement("script");
    script2.src = "CLIENT_PROVIDED_BOT_SCRIPT_URL";
    script2.async = true;
    document.body.appendChild(script2);

    return () => {
      script1.remove();
      script2.remove();
    };
  }, [pathname]);

  return null;
}
```

2. **Add to root layout** (`src/app/layout.tsx`):

```tsx
import BotpressProvider from "@/components/BotpressProvider";
// Inside the body:
<BotpressProvider />
```

3. **Option A: Use Botpress default widget** — No further changes needed, the widget creates its own floating button.

4. **Option B: Use custom button (recommended)** — Hide Botpress default button via CSS and trigger from the existing hero button:

```css
/* In globals.css */
#bp-web-widget-container .bpw-floating-button { display: none !important; }
```

```tsx
// In the AI Chat button onClick:
const handleChatOpen = () => {
  if (window.botpressWebChat) {
    window.botpressWebChat.open();
  }
};
```

### Customization Options

Botpress webchat can be configured with:

```js
window.botpressWebChat.init({
  botId: "YOUR_BOT_ID",
  hostUrl: "https://cdn.botpress.cloud/webchat/v2.2",
  messagingUrl: "https://messaging.botpress.cloud",
  clientId: "YOUR_CLIENT_ID",
  stylesheet: "https://your-domain.com/custom-botpress-styles.css",
  // Theming
  themeColor: "#FF6F00",
  // Behavior
  showPoweredBy: false,
  enableReset: true,
  closeOnEscape: true,
});
```

---

## Files Involved

| File | Purpose |
|------|---------|
| `src/components/HeroSection.tsx` | Contains the "AI Chat" button (hero section) |
| `src/app/layout.tsx` | Root layout where BotpressProvider will be added |
| `src/app/globals.css` | For hiding default Botpress button (if using custom) |

---

## Timeline Estimate

- **Bot setup in Botpress Cloud**: Client handles this
- **Integration into LKnight LMS**: ~1-2 hours once Bot ID and scripts are provided
- **Testing and fine-tuning**: ~1-2 hours for styling, behavior, and edge cases
