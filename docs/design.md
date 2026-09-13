# CareCircle — UX and Visual Design Specification

## 1. Design Direction

CareCircle should feel like a calm family coordination space: warm, trustworthy, clear, and lightweight. It must not resemble a hospital dashboard, an enterprise admin panel, or a social network.

Design keywords:

- calm;
- warm;
- dependable;
- human;
- organized;
- accessible.

Avoid medical blue everywhere, harsh red, dense data tables, glassmorphism, neon gradients, excessive decoration, and dashboard clutter.

## 2. Design Principles

### Calm before clever

Users may already be under stress. Prefer familiar interactions, plain labels, predictable placement, and progressive disclosure.

### Responsibility must be visible

Every task and activity should clearly show who is responsible, when it is due, and its current state.

### Shared does not mean noisy

Show meaningful updates, not every minor database event. Notifications and activity labels must be concise.

### Accessibility is part of the base design

Keyboard access, semantic markup, sufficient contrast, readable sizing, and large touch targets are required from the beginning.

### Mobile first, desktop enhanced

The main use case may happen from a phone while family members are moving. Desktop can expose more context but must not contain exclusive functionality.

## 3. Brand Foundation

### Name

**CareCircle**

### Tagline

**Merawat bersama, lebih terarah.**

### Logo concept

Use a simple abstract mark made from three soft overlapping arcs or people forming a circle. Do not use a medical cross, heart monitor line, hospital building, or caduceus symbol.

### Color palette

| Token | Suggested value | Usage |
| --- | --- | --- |
| `--background` | `#F8FAF7` | Main app background |
| `--surface` | `#FFFFFF` | Cards, sheets, dialogs |
| `--primary` | `#356859` | Main actions and active navigation |
| `--primary-hover` | `#294F44` | Primary hover/pressed state |
| `--secondary` | `#E4EFE9` | Soft selected backgrounds |
| `--accent` | `#E7A86E` | Warm highlight, sparingly used |
| `--text` | `#17231F` | Primary text |
| `--text-muted` | `#60706A` | Secondary text |
| `--border` | `#DCE5E0` | Dividers and borders |
| `--success` | `#2F7D55` | Completed and confirmed |
| `--warning` | `#A7651B` | Due soon or incomplete |
| `--danger` | `#B44848` | Destructive actions and errors |
| `--focus` | `#2563EB` | Visible keyboard focus ring |

All foreground/background combinations must meet WCAG AA contrast. Status must never be communicated through color alone.

### Typography

Use `Inter`, `Geist Sans`, or a comparable readable sans-serif. Use one family only.

| Style | Desktop | Mobile | Weight |
| --- | --- | --- | --- |
| Display | 40/48 px | 32/40 px | 700 |
| Page title | 30/38 px | 26/34 px | 700 |
| Section title | 20/28 px | 18/26 px | 650 |
| Body | 16/24 px | 16/24 px | 400 |
| Small | 14/20 px | 14/20 px | 400–500 |
| Caption | 12/16 px | 12/16 px | 500 |

Never make essential text smaller than 14 px.

### Shape and elevation

- card radius: 16 px;
- input and button radius: 10–12 px;
- compact chip radius: full/pill;
- border: subtle 1 px neutral border;
- shadow: very soft and used only for overlays or elevated priority cards;
- do not place every piece of content inside a separate card.

## 4. Layout System

### Breakpoints

- mobile: 360–767 px;
- tablet: 768–1023 px;
- desktop: 1024 px and above;
- maximum content width: 1280 px.

### Desktop shell

- fixed left sidebar, approximately 248 px;
- top header with circle switcher, notifications, and profile menu;
- main content uses a 12-column responsive grid;
- content padding: 24–32 px.

### Mobile shell

- top app bar with logo/circle name and profile access;
- bottom navigation with a maximum of five destinations;
- floating action button or prominent contextual button for creation;
- content padding: 16 px;
- dialogs that contain forms become bottom sheets or full-screen sheets.

### Navigation

Primary destinations:

1. Beranda
2. Tugas
3. Jadwal
4. Catatan
5. Lainnya

`Lainnya` contains contacts, members, activity history, and settings.

## 5. Core Screens

### 5.1 Public landing page

Purpose: explain the problem and invite users into the demo.

Sections:

- simple navigation with logo and `Coba Demo`;
- hero with the product promise and one focused product mockup;
- problem statement: fragmented information across chats and memory;
- three benefits: responsibilities, preparation, shared visibility;
- privacy/non-medical explanation;
- final CTA;
- minimal footer.

Suggested hero copy:

> **Koordinasi keluarga dalam satu ruang yang tenang.**  
> Atur jadwal, bagi tugas, dan siapkan kebutuhan bersama tanpa mencari ulang informasi di banyak percakapan.

Primary CTA: `Coba Demo`  
Secondary CTA: `Pelajari Cara Kerjanya`

### 5.2 Authentication and onboarding

Keep the form narrow and distraction-free.

Steps:

1. Sign in or create account.
2. Choose `Buat Care Circle` or `Gabung dengan kode`.
3. Create: enter circle name and personal display name.
4. Join: enter six-to-eight-character invite code.
5. Arrive at dashboard with a brief contextual tour.

### 5.3 Dashboard

Information priority:

1. next activity;
2. preparation progress;
3. tasks requiring attention;
4. recent updates;
5. shortcuts.

Desktop layout:

- page heading and date;
- full-width next-activity panel;
- left 8 columns: tasks and schedule;
- right 4 columns: preparation progress and recent updates.

Mobile layout:

- next activity;
- urgent/mine task list;
- preparation progress;
- quick actions;
- recent updates collapsed to the latest three.

Empty state:

> “Belum ada agenda bersama. Tambahkan jadwal pertama agar keluarga dapat mulai bersiap.”

### 5.4 Tasks

Use a readable list, not a kanban board. Each row/card includes:

- checkbox;
- task title;
- assignee avatar and name;
- due date;
- priority text plus icon;
- linked activity when applicable;
- overflow actions.

Completion should feel reassuring but restrained: check animation, updated label, and optional undo toast.

Create/edit form fields:

- title, required;
- assignee, required;
- due date, optional;
- priority: normal, penting;
- linked schedule, optional;
- description, optional.

### 5.5 Schedule

Desktop defaults to split view: compact month calendar on the left and agenda on the right. Mobile defaults to agenda with an optional calendar toggle.

An activity card includes:

- type icon and title;
- date and time;
- location;
- companion/responsible person;
- checklist progress such as `3 dari 5 siap`;
- status: upcoming or completed.

Activity detail has a clear preparation section with tappable checklist rows. Do not use fields for diagnosis or clinical results.

### 5.6 Notes

Use a reverse-chronological feed with pinned notes first. Each note shows author, timestamp, body, and optional related activity. Keep note creation intentionally lightweight.

Empty state:

> “Belum ada catatan bersama. Simpan informasi singkat yang perlu diketahui keluarga.”

### 5.7 Contacts

Use simple contact cards with role, phone number, and call button. Address and personal note are secondary. Never show a call action when no phone number exists.

### 5.8 Members and settings

- member list with role labels;
- invite code panel with copy action and expiration explanation;
- coordinator-only removal action with confirmation;
- circle name editing;
- privacy and product-boundary information;
- leave-circle action separated from delete-circle action.

## 6. Component Inventory

Build reusable components rather than screen-specific duplicates:

- `AppShell`
- `SidebarNavigation`
- `MobileBottomNavigation`
- `CircleSwitcher`
- `PageHeader`
- `PrimaryButton`, `SecondaryButton`, `DestructiveButton`
- `FormField`, `SelectField`, `DateTimeField`
- `MemberAvatar`
- `StatusBadge`
- `TaskRow`
- `ActivityCard`
- `ChecklistItem`
- `ProgressSummary`
- `NoteCard`
- `ContactCard`
- `ActivityFeedItem`
- `EmptyState`
- `SkeletonState`
- `ConfirmationDialog`
- `Toast`

Use an icon library consistently. Do not mix icon styles or use emoji as primary interface icons.

## 7. Interaction States

Every interactive feature must define:

- default;
- hover where applicable;
- focus-visible;
- pressed/active;
- loading;
- disabled;
- validation error;
- success feedback;
- empty data;
- permission denied;
- offline/network failure when relevant.

Optimistic updates are acceptable for task completion if failure rolls back visibly. Creating or deleting important records should wait for confirmed server success.

## 8. Accessibility Requirements

- semantic landmarks and heading order;
- keyboard navigation for all controls;
- visible 2 px focus ring with sufficient contrast;
- minimum target size of 44 × 44 px on touch devices;
- form labels must remain visible and not rely only on placeholders;
- inline validation text connected with `aria-describedby`;
- icon-only buttons require accessible names;
- dialogs trap focus and return it to the trigger when closed;
- use `aria-live` sparingly for important success/error feedback;
- animations respect `prefers-reduced-motion`;
- dates use human-readable Indonesian formatting;
- status uses icon/text in addition to color;
- test at 200% zoom and 360 px viewport width.

## 9. Content Rules

- Prefer “anggota keluarga” over “user”.
- Prefer “jadwal” or “agenda” over clinical terminology.
- Prefer “persiapan” over “medical checklist”.
- Keep buttons verb-first: `Tambah tugas`, `Simpan jadwal`, `Undang anggota`.
- Explain destructive actions with their consequences.
- Never imply that incomplete tasks make someone a bad caregiver.

## 10. Motion

Motion is optional and restrained:

- 150–220 ms for hover, expand, and state transitions;
- ease-out for elements entering;
- no looping decorative animation inside the app;
- use a short completion transition for checklist items;
- disable non-essential motion when reduced motion is requested.

## 11. Example Fictional Demo Content

Care Circle: `Keluarga Harmoni`

Members:

- Naya — Coordinator
- Dimas — Member
- Ibu Rina — Member

Next schedule:

- `Kontrol rutin`
- Monday, 14 September, 09:00
- `Klinik Sehat Sentosa`
- Companion: Dimas

Preparation checklist:

- Siapkan kartu identitas — Naya — complete
- Bawa hasil pemeriksaan sebelumnya — Ibu Rina — open
- Konfirmasi transportasi — Dimas — complete

No demo content may use the real user's medical or family information.

## 12. Design Deliverables

Before final implementation, produce or document:

- primary user flow;
- low-fidelity wireframes for dashboard, task creation, and schedule preparation;
- responsive high-fidelity screens;
- small component/token sheet;
- empty, loading, error, and success states;
- at least one before/after iteration supported by actual feedback or clearly labeled heuristic evaluation.

