# Color Replacement Guide

## CSS Variable Mapping

### Common Replacements

#### Slate Colors
- `text-slate-50` → `text-muted-foreground/20`
- `text-slate-100` → `text-muted-foreground/30`
- `text-slate-200` → `text-muted-foreground/40`
- `text-slate-300` → `text-muted-foreground/50`
- `text-slate-400` → `text-muted-foreground`
- `text-slate-500` → `text-muted-foreground`
- `text-slate-600` → `text-foreground/80`
- `text-slate-700` → `text-foreground/90`
- `text-slate-900` → `text-foreground`
- `bg-slate-50` → `bg-muted`
- `bg-slate-100` → `bg-muted`
- `bg-slate-200` → `bg-secondary`
- `border-slate-200` → `border-border`
- `border-slate-300` → `border-border`

#### Hardcoded Hex Colors
- `#635bff` → Use `primary` or `bg-primary` / `text-primary`
- `#735fff` → Use `primary` variant
- `#2B2B32` → Use `card` or `bg-card`
- `#40414F` → Use `border` or `border-border`
- `#3E3F4B` → Use `secondary` or `bg-secondary`
- `#D1D5DB` → Use `foreground` or `text-foreground`
- `#8E8E8E` → Use `muted-foreground` or `text-muted-foreground`

#### Gradients
- `from-[#635bff]` → `from-primary`
- `to-[#735fff]` → `to-primary` (or use CSS variable)
- `from-[#635bff]/10` → `from-primary/10`
- `to-[#735fff]/10` → `to-primary/10`

#### Dark Mode Specific
- `dark:bg-[#2B2B32]` → `dark:bg-card`
- `dark:border-[#40414F]` → `dark:border-border`
- `dark:hover:bg-[#3E3F4B]` → `dark:hover:bg-secondary`
- `dark:text-white` → `dark:text-foreground`
- `dark:text-[#D1D5DB]` → `dark:text-foreground`

#### White/Black
- `bg-white` → `bg-card` or `bg-background`
- `text-white` → `text-primary-foreground` or `text-card-foreground`
- `border-white` → `border-card` or `border-background`

## Implementation Strategy

1. Replace common patterns first (slate-*, hex colors)
2. Update gradients to use CSS variables
3. Replace dark mode specific colors
4. Test both light and dark themes

COLOR_REPLACEMENT_GUIDE.md — Replacement patterns reference
COLOR_MIGRATION_STATUS.md — Status tracking
COLOR_MIGRATION_SUMMARY.md — Guide with examples
BATCH_COLOR_MIGRATION.md — Batch processing guide
COLOR_MIGRATION_AUTOMATION.md — Automated migration patterns
COLOR_MIGRATION_FINAL_STATUS.md — Final status and patterns