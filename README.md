# KoshPilot

KoshPilot is a frontend demo for an AI-assisted business operating system for Indian MSMEs. It combines GST billing, inventory, accounting, e-way bills, payroll, reporting, team access, multilingual support, dark/light themes, and a common AI credit wallet.

This README documents the current design flow and implementation direction so future changes stay consistent.

## Tech Stack

- Next.js App Router
- React + TypeScript
- Redux Toolkit for UI state
- Tailwind CSS design tokens
- shadcn-style local UI primitives
- Radix dropdown/popover primitives
- `react-day-picker` date picker
- Local sample data only, no backend in v1

## Brand

Use the KoshPilot brand everywhere. Do not reintroduce LedgerAI naming.

Brand assets live in:

- `public/brand/koshpilot-logo-light-mode-600x180.png`
- `public/brand/koshpilot-logo-light-mode-1200x360.png`
- `public/brand/koshpilot-logo-dark-mode-600x180.png`
- `public/brand/koshpilot-logo-dark-mode-1200x360.png`
- `public/brand/koshpilot-logo.svg`
- `public/brand/koshpilot-icon.svg`
- `public/brand/koshpilot-icon-256.png`
- `public/brand/koshpilot-icon-512.png`

Use `src/components/brand-logo.tsx` instead of placing logo images manually.

- `BrandLogo` renders light/dark mode logos automatically.
- `BrandMark` renders the icon mark.

## Color System

The app color scheme follows the logo:

- Deep charcoal for foreground and dark surfaces
- Teal/mint as the primary brand color
- Warm orange as the accent color
- Soft light backgrounds for approachable MSME workflows

Theme tokens are defined in `src/app/globals.css`. Prefer semantic Tailwind classes such as `bg-primary`, `text-primary`, `bg-card`, `text-muted-foreground`, and `border`.

Do not hardcode a new dominant palette unless it is derived from the logo.

## Homepage Flow

The homepage follows a Hisab-inspired MSME billing-product structure, using original KoshPilot content and original/generated assets.

Current landing flow:

1. Sticky header with theme-aware KoshPilot logo
2. Hero section
   - Headline: easy invoicing, inventory, accounting, and AI
   - CTAs: `Start Free`, `Video Tour`
   - Realistic customer image
3. Trust/value strip
4. Simplicity and speed benefits
5. Feature grid
   - Invoices
   - Expenses
   - Complete sales workflow
   - Inventory
   - Accounting
   - E-way bill
   - Reports
   - AI Copilot
6. Reports section
7. Mobile workflow section
8. Industry grid
9. Pricing section
10. Support section
11. Proof metrics
12. Free trial CTA
13. Footer

Homepage images are in `public/images/`:

- `ledgerai-customer-hero.png`
- `ledgerai-customer-mobile.png`
- `ledgerai-customer-support.png`

These filenames are legacy internal asset names; visible alt text and UI copy should use KoshPilot.

## App Routes

Public:

- `/` landing page
- `/login` login/demo access

App:

- `/app` dashboard
- `/app/invoices`
- `/app/invoices/new`
- `/app/customers`
- `/app/inventory`
- `/app/reports`
- `/app/users`
- `/app/settings`
- `/app/accounting`
- `/app/expenses`
- `/app/purchases`
- `/app/payments`
- `/app/banking`
- `/app/tax`
- `/app/eway-bills`
- `/app/employees`
- `/app/payroll`

Do not add separate pages for cross-cutting systems unless there is a strong reason. For example, AI credits are intentionally a common wallet shown in the header, Copilot, and Settings instead of a separate AI usage page.

## App Navigation Pattern

The app uses `src/components/app-shell.tsx`.

Navigation should remain practical and module-first:

- Dashboard
- Invoices
- Customers
- Inventory
- Accounting
- Expenses
- Purchases
- Payments
- Banking
- GST / Tax
- E-way Bills
- Reports
- User Management
- Employees
- Payroll
- Settings

Keep navigation labels translated through `src/lib/i18n.ts`.

### Sidebar Keyboard Shortcuts

Sidebar routes support simple `Alt + key` shortcuts inside the app shell.

Current bindings:

- `Alt + 1`: Dashboard
- `Alt + 2`: Invoices
- `Alt + 3`: Customers
- `Alt + 4`: Inventory
- `Alt + 5`: Accounting
- `Alt + 6`: Expenses
- `Alt + 7`: Purchases
- `Alt + 8`: Payments
- `Alt + 9`: Banking
- `Alt + 0`: GST / Tax
- `Alt + Q`: E-way Bills
- `Alt + W`: Reports
- `Alt + E`: User Management
- `Alt + R`: Employees
- `Alt + T`: Payroll
- `Alt + Y`: Settings

Shortcut badges are shown next to sidebar labels. The handler ignores form inputs, textareas, editable content, and the GST calculator panel so typing and calculator usage stay predictable.

## Global GST Calculator

Implemented in `src/components/gst-calculator.tsx` and mounted globally from `src/components/app-shell.tsx`.

The calculator is designed for Indian billing workflows and behaves like a desk calculator:

- Number keypad with `0-9`, `00`, and decimal
- Arithmetic keys: add, subtract, multiply, divide, equals
- Clear and backspace actions
- Built-in GST add and GST remove actions
- Preset Indian GST rates: `0%`, `3%`, `5%`, `12%`, `18%`, `28%`
- Live breakdown for taxable amount, GST amount, CGST, SGST, and final total
- Responsive header trigger with icon on small screens and full label on large screens
- Opaque dropdown styling for dark and light mode

Calculator keyboard bindings work while the calculator dropdown is open:

- Numbers: `0-9`
- Decimal: `.`
- Operators: `+`, `-`, `*` or `x`, `/`
- Result: `Enter` or `=`
- Backspace: `Backspace`
- Clear/reset: `Escape`, `Delete`, or `C`
- GST add: `Ctrl + +`
- GST remove: `Ctrl + -`
- GST rate presets:
  - `F1`: `0%`
  - `F2`: `3%`
  - `F3`: `5%`
  - `F4`: `12%`
  - `F5`: `18%`
  - `F6`: `28%`
- Legacy quick keys:
  - `A`: GST add
  - `R`: GST remove

When the calculator is open, sidebar shortcuts are disabled to avoid conflicts.

## Common AI Credit Wallet

KoshPilot uses one shared AI credit wallet across AI actions.

Implemented in:

- `src/components/credit-system.tsx`
- `src/store/store.ts`

Surfaces:

- Header dropdown via `CreditWalletButton`
- AI Copilot credit progress
- Settings page summary and usage details

Behavior:

- AI Copilot consumes demo credits when `Generate response` is clicked.
- Credits are shared across all AI actions.
- Settings shows module-wise usage, recent AI requests, limits, and warning threshold controls.

Do not create a standalone AI usage page unless the product direction changes.

## AI Copilot

Implemented in `src/components/ai-copilot.tsx`.

The Copilot is deterministic demo UI, not a real API call.

Expected demo capabilities:

- Draft invoice suggestions
- Overdue collection summary
- Stock risk suggestions
- Report explanation
- Business action queue
- Common credit wallet usage

Future AI work should preserve no-API-key demo behavior unless backend/API integration is explicitly requested.

## Forms and Validation

Reusable form components live in `src/components/form-kit.tsx`.

Rules:

- Do not use native `required` attributes on DOM inputs.
- Use custom validation messages through `FormCard`.
- Use `DatePickerField` for date inputs.
- Use `SelectField` custom dropdown instead of native select.
- Keep validation strict for GSTIN, phone, vehicle number, invoice number, numeric limits, etc.

Date picker components:

- `src/components/calendar.tsx`
- `src/components/popover.tsx`

Dropdowns:

- `src/components/dropdown-menu.tsx`

## Theme Support

Theme modes:

- System
- Light
- Dark

State is in Redux and applied by `ThemeBridge` in `src/app/providers.tsx`.

Guidelines:

- Use semantic CSS variables and Tailwind classes.
- Test dark mode for opaque dropdowns, popovers, and date pickers.
- Use theme-aware logo through `BrandLogo`.

## Language Support

Supported languages:

- English: `en`
- Gujarati: `gu`
- Hindi: `hi`
- Marathi: `mr`

Language state is stored in Redux and persisted with `koshpilot-language`.

Translations live in `src/lib/i18n.ts`.

The Hindi and Marathi dictionaries currently cover main navigation, auth, and major workflow labels. The i18n hook falls back to English for missing long-form labels.

Future rule:

- Add new visible labels to `translations.en`.
- Add translations for Gujarati, Hindi, and Marathi when the label is navigation, heading, CTA, form label, or repeated workflow text.
- Long demo paragraphs may temporarily fall back to English, but avoid this for primary UI surfaces.

## Offline Overlay

`src/components/network-overlay.tsx` shows an overlay when the browser is offline.

Keep this mounted in `src/app/layout.tsx`.

## Design Principles

KoshPilot should feel like a practical business tool, not a marketing-only concept.

Follow these principles:

- Clean, rounded, modern UI
- Dense but readable business tables
- Strong first impression on landing page
- Realistic MSME language
- Clear CTAs
- Practical workflow modules
- Mobile-friendly layout
- Strong dark/light support
- No copied Hisab text or assets
- No external Hisab logos/images
- Use KoshPilot brand assets only

## Animation Guidelines

Landing page animation should be smooth and friendly.

Current animation system:

- `scroll-reveal` with IntersectionObserver
- Soft fade and slight upward movement
- Slow hero visual motion
- Reduced-motion support in CSS

Avoid:

- Fast or jumpy animation
- Excessive parallax
- Text that shifts layout after loading
- Motion that distracts from business content

## Local Development

Install dependencies:

```bash
npm install
```

Run dev server:

```bash
npm run dev
```

Build:

```bash
npm run build
```

The app is usually previewed at:

```text
http://localhost:3000
```

## Build Verification

Before finalizing UI changes, run:

```bash
npm.cmd run build
```

Expected result:

- TypeScript passes
- Next build completes
- All routes prerender

## Git Notes

The repository has previously been connected to:

```text
https://github.com/neelsavaliya33/ai-invoice-app.git
```

Before pushing:

```bash
git status --short
npm.cmd run build
git add .
git commit -m "Describe change"
git push
```

Only push when explicitly requested.

## Future Feature Checklist

When adding a feature:

1. Add or reuse sample data in `src/lib/data.ts`.
2. Add visible text keys in `src/lib/i18n.ts`.
3. Reuse `Card`, `DataTable`, `SectionTitle`, and `form-kit`.
4. Use `DatePickerField` for dates.
5. Use `SelectField` for dropdowns.
6. Add strict validation where forms collect data.
7. Confirm dark/light mode.
8. Confirm language fallback does not break.
9. Keep AI credits common if AI is involved.
10. Run `npm.cmd run build`.

## Current Product Positioning

KoshPilot is:

> Easy invoicing, inventory, accounting, payroll, e-way bill, and AI workflows for micro and small businesses in India.

Use this positioning as the north star for future copy and design decisions.
