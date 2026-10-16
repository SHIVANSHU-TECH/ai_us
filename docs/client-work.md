# Client work (knowledge source)

Documented client engagements for the AI resume / consult assistant.  
Canonical structured data: `src/lib/resume-knowledge.ts` → `clientWork`.  
Update both when client work changes.

---

## 1. Aviva Beauty — Shopify Theme

Custom Shopify Online Store 2.0 theme for **[Aviva Beauty](https://avivabeauty.in)** (`avivabeauty.in`).

Built as a brand-specific storefront (not a stock Dawn skin): homepage storytelling, product discovery, cart offers, reviews, and checkout-ready UX for the Indian D2C skincare market.

| | |
|---|---|
| **Brand** | Aviva Beauty |
| **Founder / contact** | Vanshika |
| **Live URL** | https://avivabeauty.in |
| **Platform** | Shopify (OS 2.0) |
| **Checkout** | Fastrr (Shiprocket) + Shopify discounts / bundle apps |
| **Theme folder** | `theme_export__avivabeauty-in-aviva-shopify-theme-fixed-homepage__*` |

### What’s included

**Storefront**
- Custom homepage (hero, promos, featured products, actives, rituals, gift potli, retail banners)
- Shop all / collections with product cards
- Product detail pages (gallery, offers, ingredients / FAQ accordions, Judge.me reviews)
- About Us (brand story + founder story)
- Contact, blog, cart drawer, search, 404

**Cart & offers UX**
- Cart drawer with Buy 2 @ ₹799 / Buy 3 @ ₹1149 progress tracker
- “Place order” CTA + “Apply coupon at next step”
- Manual coupon field (collapsed)
- Upsell (“You may also like”) in drawer

**Merchandising & media**
- Product image fade rotation on collection cards and PDP (when multiple images exist)
- Watch & Shop video tiles with mute / unmute (only one video unmuted at a time)
- Sourced actives, trust marquee, manifesto, concern gateway

**Integrations (store / theme settings)**
- Judge.me reviews
- Aviva Concierge chat (`concierge_endpoint` in theme settings)
- GA4 measurement ID
- WhatsApp support number
- Fastrr / Shiprocket checkout (store app — not theme code)

### Theme structure (reference)

```
assets/          CSS, JS, brand images
config/          settings_data.json
layout/          theme.liquid, password.liquid
locales/         en.default.json
sections/        Homepage, PDP, cart, about, header/footer, etc.
snippets/        product-card, cart-drawer, concierge, helpers
templates/       index, product, collection, page.about, cart, …
```

Key files: `snippets/cart-drawer.liquid`, `snippets/product-card.liquid`, `sections/main-product.liquid`, `sections/testimonial-videos.liquid`, `templates/page.about.json`, `assets/theme.js`, `assets/base.css`.

### Discounts (important)

Theme UI only **guides** customers. Actual “any 2 = ₹799 / any 3 = ₹1149” must be set in Shopify Discounts and/or Fastrr Manage Discount and/or a fixed-price bundle app. Test totals inside **Fastrr checkout**.

Suggested codes (create in discount engine Fastrr accepts): `BUY799`, `BUY1149`, `FIRST200` / `FIRST250` if used.

### Store support contacts

- Phone: +91 8595300801  
- Email: Support@Avivabeauty.in  
- Location: New Delhi, Delhi, India  

### Pitch when
D2C / ecommerce founders need a custom Shopify theme + conversion-focused cart UX.

---

## 2. Creator.co.ai — AI reel automation

| | |
|---|---|
| **Client / brand** | Creator.co.ai |
| **Stakeholder** | Rohit Bamola |
| **Category** | AI content automation / Instagram Reel production workflows |

### What Shivanshu delivered
- AI reel skill pipelines (`ai-reel-final-version-testing` and related AI reel skills under Claude skills)
- Research → Hinglish script → ElevenLabs TTS → HeyGen avatar → Google Flow V-roll → Studio composite → post-production (−14 LUFS)
- Avatar V engine (Avatar IV fallback), optional split-screen, approval gates, QC, Cloudinary delivery

### Pitch when
Creators / agencies need repeatable AI reel or short-form video automation — not one-off ChatGPT prompts.

### Notes
Do not invent follower counts, revenue, or unpublished metrics for Rohit / Creator.co.ai.

---

## 3. Connect Astro — Desktop

| | |
|---|---|
| **Client / brand** | Connect Astro |
| **Founder / contact** | Gautam |
| **Category** | Desktop application |

### What Shivanshu delivered
- Desktop project work for Connect Astro under founder Gautam
- Client engagement in the desktop app space (aligns with Shivanshu’s desktop / Electron automation experience)

### Notes
Do not invent product URLs, feature lists, or metrics until more verified documentation is added. Expand this section when Gautam / Connect Astro assets are documented.

### Pitch when
Founders need desktop apps or desktop automation agents; astrology / consumer desktop products seeking a client-proven desktop builder.
