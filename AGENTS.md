<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## UI component rules — stock shadcn/ui only, never custom forks

`src/components/ui/*` is the single component system for BOTH the public landing site and the CMS admin panel. It is stock shadcn/ui (new-york, Tailwind v4, `--radius` 0.625rem). A previous hand-rolled component set (custom Switch/Modal/Select/Tabs, pill buttons with hard shadows, hex-colored cards) had to be fully removed on 2026-10-22 — do not reintroduce that style.

1. **Never create a new custom component that duplicates an existing `ui/*` component**, and never restyle `ui/*` away from stock. Check `src/components/ui/` first; reuse it as-is.
2. **Missing a component?** Write the stock shadcn/ui version (or `npx shadcn@latest add <name>`), importing Radix primitives from the `radix-ui` monolith package — `import { Switch as SwitchPrimitive } from "radix-ui"` — matching `ui/label.tsx`. Existing Radix-based: label, switch, separator, avatar, dropdown-menu, sheet. Plain: button, card, badge, alert, breadcrumb, input, textarea, select (native), table, tabs, accordion, modal, toast, skeleton, empty-state, image-upload.
3. **No `animate-in` / `fade-in` / `slide-in-*` classes** — the tw-animate plugin is NOT installed; these classes silently do nothing.
4. **Semantic tokens only**: `bg-card`, `text-muted-foreground`, `border-border`, `bg-primary`, `rounded-md`/`rounded-lg`. Banned: hardcoded hex (`#FAF6EE`, `#FA6400`, …), `stone-*`/`slate-*`/`emerald-*` palette classes, arbitrary radii (`rounded-2xl/3xl`, `rounded-[Npx]`), hard drop shadows, gradients.
5. **Button**: use existing variants only — `default` (teal primary), `accent` (orange, reserved for public-website CTAs), `outline`, `secondary`, `ghost`, `destructive`, `link`. Do not add pill/hard-shadow/pastel variants.
6. **Typography**: `text-xs`/`text-sm` with `text-muted-foreground` for secondary text. Banned: `text-[10px]`/`text-[11px]`, `uppercase tracking-wider` on ordinary labels.
7. **No decoration**: no icon tiles (icon-in-rounded-square), no card-in-card nesting, no pill containers per row, no status dots beside switches, no invented charts/sparklines, no per-card accent colors. Icons are functional only (lucide-react, `size-4`).
8. **Admin pages are client components** fed by `SchoolDataContext`/`AuthContext`. When restyling, preserve handlers, ids, aria-labels, links, and role gating (`super_admin` vs `editor`) exactly.
9. Verify with `npx tsc --noEmit` and `npm run build`; the repo has no test suite — browser-verify flows via `docs/AKUN-TESTING.md`.
