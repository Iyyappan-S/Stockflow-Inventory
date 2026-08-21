# StockFlow Design Directions

## Three distinct approaches

| Theme Name | Very Brief Intro | Probability |
| --- | --- | --- |
| Ledger & Signal | A quiet editorial operations room: warm paper surfaces, navy data marks, and carefully weighted exception states make warehouse intelligence feel calm and trustworthy. | 0.07 |
| Night Shift Grid | A midnight command center with restrained electric accents that makes live operational events feel immediate and high-stakes. | 0.03 |
| Industrial Field Notes | A practical, tactile system that borrows from warehouse labels, receiving sheets, and ink stamps to make the inventory record feel tangible. | 0.09 |

## Chosen approach: Ledger & Signal

### Design Movement

**Contemporary editorial systems design** blends the authority of a financial ledger with the legibility of a modern operations console. It favors disciplined information density, visible hierarchy, and a human-readable sense of traceability over generic dashboard decoration.

### Core Principles

1. **Exceptions lead the eye.** Normal operational information recedes into warm neutrals, while discrepancies, risks, and approvals use clear, limited signal colors.
2. **Data has a paper trail.** Tables, transaction timelines, and audit evidence are treated as first-class visual objects, supported by fine rules and provenance cues.
3. **The workspace is asymmetric.** A strong dark navigation rail and right-anchored utility stack frame a broad, flexible analytical canvas.
4. **Density without claustrophobia.** Compact metrics sit alongside generous sectional whitespace and crisp typographic rhythm.

### Color Philosophy

The base uses **ink navy** and **warm linen** rather than cold white and generic blue. Ink navy establishes operational trust and makes the shell feel anchored; linen creates breathing room for complex data. A single vivid **signal teal** identifies active, healthy flow. Amber is reserved for attention, and brick red is held for high-impact variance or expiry risk. Color is semantic, not decorative.

### Layout Paradigm

The application is designed as a **ledger desk**: a fixed, labeled navigation spine on the left; a shallow utility bar at the top; a wide central working surface; and a contextual right rail that surfaces alerts, notes, or approval queues. Rather than one centered dashboard grid, the desktop dashboard uses uneven spans: a large sales trend, narrow KPI ledgers, and stacked operational evidence panels. On compact screens the rails collapse into focused sheets and the evidence panels flow into a single chronological workspace.

### Signature Elements

1. **Flow mark:** a stepped three-bar symbol that signifies stock entering, reconciling, and moving onward; it becomes the brand mark, favicon, and small section cue.
2. **Ledger rules:** ultra-fine horizontal dividers and monospace metadata labels provide a transaction-record feel.
3. **Signal slips:** small labeled status capsules with a vertical color key distinguish a detected variance, an approval, an expiry concern, or an ordinary transaction.

### Interaction Philosophy

Every interaction should feel deliberate and auditable. Row selection reveals a contextual detail panel rather than causing disorienting navigation; primary actions create clear confirmation feedback; workflow states are visible before action is taken. Search feels immediate, while important operations such as approving an adjustment require an explicit confirmation step.

### Animation

Use restrained motion that reinforces state changes: cards and panels enter with a short opacity-and-translate rise (180–240ms, `cubic-bezier(0.23, 1, 0.32, 1)`); tables highlight a changed row rather than reflowing dramatically; alert badges gently shift only when newly created. Buttons compress to 0.97 on press. Charts render with a single left-to-right reveal. Motion must respect `prefers-reduced-motion` and never delay routine navigation or keyboard actions.

### Typography System

**Manrope** is the primary interface sans for its highly legible numeric forms and restrained technical character. **DM Mono** is used for SKUs, transaction identifiers, dates, and audit metadata. Headings use Manrope 700–800 with slightly tightened tracking; body copy uses Manrope 500; metadata uses DM Mono 500 in uppercase with generous tracking. No Inter is used.

### Brand Essence

**StockFlow turns every stock movement into reliable operational evidence for teams that need to act before gaps become losses.** Personality: **methodical, alert, assured**.

### Brand Voice

Headlines are concise, evidence-led, and action-oriented. CTAs name the consequential action rather than the interface action. Microcopy explains what changed or what needs review.

> “28 units need a closer look.”

> “Reconcile this count before stock is adjusted.”

### Wordmark & Logo

The mark is a bold, transparent three-step flow glyph: three offset rectangular bars that rise from left to right, separated by fine negative space, suggesting receiving, verification, and movement. The wordmark pairs the custom symbol with a confidently spaced Manrope 800 `StockFlow` wordmark; the dot on the `i` is replaced by a tiny square signal.

### Signature Brand Color

**Flow Teal — `#00A889`** is the ownable color used for active navigation, positive flow, focused controls, and the primary brand mark.

## Product and interaction scope

The initial web delivery is a polished **client-side interactive demonstration** of the StockFlow application. It models the dashboard, inventory, discrepancies, POS, audit, notifications, reports, and role-oriented navigation using browser-local state. The supplied specification’s Java Spring Boot, MySQL, JWT, and server-side RBAC requirements are acknowledged as backend work and are intentionally not represented as working production services in this frontend-only workspace.
