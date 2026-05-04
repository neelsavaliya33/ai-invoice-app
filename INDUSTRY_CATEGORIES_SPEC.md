# LedgerAI Industry Categories Specification

## Purpose

LedgerAI should support a wide range of Indian MSME business types while keeping the core product simple: invoicing, customers, inventory, reports, user management, and AI Copilot. The industry categories below should appear in the landing page, onboarding, company setup, dashboard personalization, and AI prompt suggestions.

The design should not treat industries as only labels. Each category should influence sample data, invoice templates, inventory fields, reports, and AI recommendations.

## Industry Categories To Cover

| Category | Typical Business Need | Product Focus |
| --- | --- | --- |
| Textile | Fabric rolls, meters, dye lots, wholesale billing | Stock by roll/meter, lot tracking, bulk invoices |
| Garment | Finished clothing, sizes, colors, seasonal collections | SKU variants, size/color matrix, order fulfillment |
| Electronics | Devices, accessories, warranty, serial numbers | Serial tracking, warranty dates, high-value inventory |
| Agriculture | Seeds, fertilizers, produce, seasonal purchases | Batch stock, seasonal reports, supplier purchases |
| Mobile Shop | Phones, accessories, repairs, IMEI tracking | IMEI/serial fields, service invoices, fast billing |
| E-commerce | Online orders, returns, multi-channel sales | Order import-ready layout, returns, shipping status |
| Stationary | Office supplies, school products, low-value SKUs | Fast item search, bulk stock updates, reorder alerts |
| Auto Parts | Vehicle parts, compatibility, mechanics/customers | Part numbers, vehicle fitment, counter-sale workflow |
| Computer & CCTV | Hardware, networking, installation services | Product + service invoices, warranty, AMC reminders |
| Chemical | Batches, containers, compliance-sensitive stock | Batch/expiry fields, unit conversion, safety notes |
| IT Company | Services, subscriptions, projects, retainers | Service invoices, recurring billing, project reports |
| Marketing Agency | Campaign services, retainers, client expenses | Project billing, milestone invoices, expense mapping |
| Packaging | Boxes, labels, custom sizes, bulk orders | Custom item dimensions, quotation-to-invoice flow |
| Ceramic | Tiles, boxes, area coverage, breakage | Unit conversion, box/sq ft tracking, damage adjustment |
| Furniture | Made-to-order products, delivery, installation | Custom orders, advance payments, delivery tracking |
| Building Material | Cement, steel, sand, transport, large quantities | Weight/quantity units, transport charges, credit ledger |
| Hardware & Plywood | Tools, sheets, fittings, mixed retail/wholesale | Variant stock, cutting/size notes, quick counter billing |
| Cosmetic | Batch, expiry, MRP, retail stock | Expiry alerts, MRP vs sale price, fast item lookup |
| Fire Safety | Equipment, refills, inspections, compliance dates | Service reminders, certificate tracking, AMC billing |
| Diamond & Jewelry | High-value items, purity, weight, making charges | Weight/purity fields, secure access, detailed invoices |
| Scrap | Weight-based buying/selling, daily rate changes | Weight slips, rate history, supplier/customer ledger |
| Printing & Designing | Design services, print quantities, job stages | Job cards, quotation approvals, production status |
| Rental Services | Assets, booking period, deposits, returns | Rental duration billing, deposit ledger, availability |
| Travel Agency | Bookings, commissions, customers, vendors | Service vouchers, vendor payable, commission reports |

## Shared Product Modules

### Landing Page

- Show all industry categories in a clean grid with icons.
- Each category should be clickable or selectable in the future.
- The landing copy should communicate that the same app adapts to different business workflows.
- Avoid category cards that look decorative only; each category should map to actual product behavior.

### Onboarding

- Ask the user to choose a business category during setup.
- Use the selected category to preload:
  - Sample invoice line items
  - Inventory columns
  - Report shortcuts
  - AI prompt examples
  - Default invoice labels

### Dashboard

- Show category-relevant KPIs.
- Always include common KPIs:
  - Sales this month
  - Receivables
  - Overdue invoices
  - Inventory value
  - Low-stock items
  - AI recommended actions
- Add category-specific insight cards, such as expiry risk for cosmetics or warranty follow-ups for electronics.

### Invoices

- Support product, service, and mixed invoices.
- Allow category-specific fields:
  - Serial number / IMEI
  - Batch number
  - Expiry date
  - Size/color
  - Weight
  - Area
  - Rental period
  - Service period
  - Warranty date
- Include AI invoice drafting from natural language.

### Customers

- Maintain customer ledger, outstanding balance, contact details, and transaction history.
- Show category-specific customer notes:
  - Vehicle type for auto parts
  - Project name for agencies
  - Site/location for construction materials
  - Booking details for travel agency

### Inventory

- Core inventory fields:
  - Item name
  - SKU
  - Category
  - Unit
  - Stock quantity
  - Purchase price
  - Sale price
  - Reorder level
  - Tax rate
- Optional category fields:
  - Batch number
  - Expiry date
  - Serial number
  - IMEI
  - Size
  - Color
  - Weight
  - Purity
  - Dimensions
  - Warranty period

### Reports

- Common reports:
  - Profit and loss
  - Sales summary
  - Purchase summary
  - Receivables
  - Payables
  - Inventory detail
  - Stock movement
  - GST summary
  - Expense report
- Category-specific reports:
  - Expiry report
  - Serial/warranty report
  - Size/color stock report
  - Weight-based stock report
  - Rental utilization report
  - Project profitability report

### User Management

- Roles:
  - Owner
  - Admin
  - Accountant
  - Sales
  - Inventory manager
  - Viewer
- Permissions should cover:
  - Create/edit/delete invoices
  - View reports
  - Manage stock
  - Manage customers
  - Export data
  - Manage users
  - Configure company settings
- Sensitive industries like jewelry should emphasize stronger access control and audit logs.

## AI Copilot Requirements

AI Copilot should work across all industry categories with deterministic demo responses first.

### Shared AI Actions

- Draft invoice from plain English.
- Summarize sales and receivables.
- Identify overdue customers.
- Flag low-stock items.
- Suggest reorder quantities.
- Explain reports in plain language.
- Draft payment reminder messages.
- Suggest which customers to follow up today.

### Category-Specific AI Examples

| Category | AI Prompt Example | Expected AI Output |
| --- | --- | --- |
| Textile | “Create invoice for 20 cotton rolls and 12 denim bundles.” | Invoice draft with roll/bundle units and GST |
| Garment | “Which sizes are low before weekend sale?” | Size/color stock risk summary |
| Electronics | “Show warranty items expiring this month.” | Warranty follow-up list |
| Agriculture | “What should I reorder before harvest season?” | Seasonal stock suggestion |
| Mobile Shop | “Create invoice for phone with IMEI and cover.” | Invoice draft with IMEI field |
| E-commerce | “Summarize pending orders and returns.” | Order and return status summary |
| Auto Parts | “Find fast-moving parts for bike customers.” | Stock movement insight |
| Chemical | “Which batches are near expiry?” | Batch expiry alert |
| IT Company | “Create monthly retainer invoice.” | Service invoice draft |
| Marketing Agency | “Summarize client campaign profitability.” | Project margin summary |
| Furniture | “Create advance invoice for custom sofa.” | Advance payment invoice |
| Jewelry | “Create invoice with gold weight and making charges.” | High-value detailed invoice draft |
| Rental Services | “Show overdue rental returns.” | Return follow-up list |
| Travel Agency | “Create booking invoice with commission.” | Travel service invoice draft |

## Design Requirements

- Use Tailwind-friendly design tokens.
- Default theme should follow system preference.
- Include light and dark mode.
- Use a clean SaaS dashboard style, not a marketing-only layout.
- Industry category grid should use consistent icons, spacing, and labels.
- Keep cards at 8-12px radius.
- Use dense tables for operational screens.
- Add editable 3D vector visuals only where they help the product feel modern:
  - Landing hero
  - Empty states
  - AI Copilot onboarding
- Do not use copied Hisab branding, icons, images, or long-form text.

## Full Workflow Coverage

The final design and app should include these screens:

1. Landing page with industry category grid.
2. Business category selection during onboarding.
3. Dashboard customized by selected category.
4. Invoice list.
5. AI invoice builder.
6. Invoice detail and preview.
7. Customer list.
8. Customer ledger/profile.
9. Inventory list.
10. Item detail with category-specific fields.
11. Reports dashboard.
12. Report detail with AI summary.
13. User management list.
14. Role and permissions editor.
15. Company settings.
16. Theme settings: system, light, dark.
17. Mobile dashboard.
18. Mobile invoice creation flow.

## Acceptance Criteria

- All 24 listed industry categories are represented.
- Each category has a clear business reason for inclusion.
- Core modules support category-specific fields without creating separate apps.
- AI Copilot has shared and category-specific prompt examples.
- The design supports both desktop and mobile workflows.
- The design supports system-default, light, and dark theme modes.
- The document can be used directly as a product/design brief for Figma and React implementation.
