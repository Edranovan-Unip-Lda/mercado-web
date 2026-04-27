# SIM-Merkadu TL — Sistema Informasaun Merkadu Timor-Leste

Frontend-only MVP for Phase 1 of a Digital Market Vendor Registration System for Timor-Leste.

## Stack

- Angular 20
- PrimeNG 20
- PrimeIcons
- Tailwind CSS
- TypeScript
- Standalone Angular components and routing
- In-memory mock services only

The layout is inspired by the PrimeNG Sakai admin template structure, recreated manually to keep Angular and PrimeNG on version 20.

## Install

Use Node.js `20.19+`, `22.12+`, or `24+` for Angular 20.

```bash
npm install
```

## Run

```bash
npm start
```

Then open `http://localhost:4200`.

## Mock Login

Any username and password will work. Select one of the mock roles:

- System Administrator
- MCI National Administrator
- Municipal Administrator
- Market Manager
- Market Officer / Data Entry Officer
- Viewer / Auditor

The selected role is stored locally and can also be switched from the top bar.

## Included MVP Areas

- Dashboard with national metrics and charts
- Vendor list with filters, status tags, and role-aware actions
- Digital vendor registration form with vendor, business, declaration, and verification sections
- Vendor profile/detail page with QR placeholder and status history
- Approval queue with approve, reject, needs-correction, reviewer assignment, and stall assignment
- Market list with add/edit mock dialog
- Market sections and stall assignment grid
- Printable vendor ID card preview
- Reports with filters, charts, tables, and mock export buttons
- Master data management
- Mock user management and role permission summary
- Audit log
- Settings

## Mock Data

The app generates realistic frontend-only data for:

- 60 vendors
- 9 markets
- 13 municipalities of Timor-Leste
- 150 stalls/spaces
- Business categories, infrastructure needs, registration statuses, users, roles, and audit events

All updates happen in memory for the current browser session. No backend, real API, or authentication server is used.

## Main Flows

1. Register a new vendor from `Vendors > New Registration`, save a draft, then submit for review.
2. Process submitted records from `Vendors > Approval Queue`, assign market/stall, and approve.
3. Open an approved vendor and generate a printable vendor ID card.
4. Manage market spaces from `Markets > Stall Assignment`.
5. View dashboard and reports; export buttons show mock notifications.

## Future Backend/API Integration Notes

- Replace mock services in `src/app/core/services` with API-backed services.
- Keep the interfaces in `src/app/core/models.ts` as the initial contract shape.
- Add route guards and real authentication once an identity provider is selected.
- Move registration number and QR-code signing to the backend.
- Add persistence and validation rules for master data, stall assignment, and approval workflows.
