# UI/UX Redesign Plan

## Current Issues

1. **Everything crammed into one page** - No separation of concerns
2. **Horizontal bar chart is unreadable** - 55 steps don't fit well in horizontal layout
3. **No customization** - Users can't choose which metrics matter to them
4. **No navigation structure** - Single page with everything visible at once
5. **Generic card-based metrics** - Takes too much space, not scannable
6. **No filtering** - Can't focus on important steps only
7. **No ABS/% toggle** - Locked into one view mode
8. **Dense table** - 55 rows with no way to collapse or filter

---

## Proposed Architecture

### Navigation Structure (Tabbed)

```
┌────────────────────────────────────────────────────────────────┐
│ Get Thin MD Analytics                                          │
├─────────┬────────┬─────────┬──────────┬───────────┬───────────┤
│Overview │ Funnel │ Alerts  │ Reports  │ Insights  │ Settings  │
└─────────┴────────┴─────────┴──────────┴───────────┴───────────┘
```

| Tab | Purpose |
|-----|---------|
| **Overview** | Customizable metrics row + trend chart + quick summary |
| **Funnel** | Visual funnel chart with filtering + detailed breakdown |
| **Alerts** | Active alerts, history, configure thresholds |
| **Reports** | Daily/weekly reports, export functionality |
| **Insights** | AI-powered recommendations and patterns |
| **Settings** | Configure custom conversions, starred steps, preferences |

---

## 1. Overview Tab (Home)

### Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ [Date Range Picker]                                    [Refresh] 🔄 │
├─────────────────────────────────────────────────────────────────────┤
│ CUSTOM METRICS ROW (user-configurable)                              │
│ ┌─────────┬───────────┬─────────────┬────────────┬─────────┬───┐   │
│ │ Unique  │ Quiz      │ Lead        │ Checkout   │ Purchase│ + │   │
│ │ Users   │ Started   │ Capture     │ Complete   │ Complete│   │   │
│ │   127   │ 98 (77%)  │ 45 (46%)    │ 23 (51%)   │ 12 (52%)│   │   │
│ └─────────┴───────────┴─────────────┴────────────┴─────────┴───┘   │
├─────────────────────────────────────────────────────────────────────┤
│ TREND CHART (Area chart with gradient fill)                         │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │                                                    ▄▄▄▄         │ │
│ │                                              ▄▄▄▄▀▀▀▀▀▀         │ │
│ │                                        ▄▄▄▄▀▀                   │ │
│ │                                  ▄▄▄▄▀▀                         │ │
│ │ ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▀▀                               │ │
│ └─────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────┤
│ QUICK STATS                                                         │
│ ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐     │
│ │ 🔴 3 Critical    │ │ 📈 +5% vs last   │ │ 🎯 Top dropoff:  │     │
│ │    drop-offs     │ │    week          │ │    Health Screen │     │
│ └──────────────────┘ └──────────────────┘ └──────────────────┘     │
└─────────────────────────────────────────────────────────────────────┘
```

### Features

- **Customizable metrics row**: Users choose which conversion points to track (configured in Settings)
- **Plus button**: Quick-add new metrics to the row
- **Area chart**: Smooth gradient fill (like Embeddables), shows volume over time
- **Quick stats cards**: At-a-glance health indicators

---

## 2. Funnel Tab

### Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ [Date Range]  [★ Starred Only]  [Key ▼]        [ABS | %]  [🔄]     │
├─────────────────────────────────────────────────────────────────────┤
│ VERTICAL BAR CHART (funnel visualization)                           │
│                                                                     │
│     127│ █████████████████████████████████████████████████          │
│        │                                                            │
│      98│ ████████████████████████████████████                       │
│        │                        ↓ 23% drop                          │
│      76│ █████████████████████████████                              │
│        │                                                            │
│      45│ ██████████████████                                         │
│        │             ↓ 41% drop (!)                                 │
│      23│ █████████                                                  │
│        │                                                            │
│      12│ █████                                                      │
│        ├────────────────────────────────────────────────────────    │
│          Quiz   Health  Lead    Pre-    Checkout  Purchase          │
│          Start  Screen  Capture checkout Complete  Complete         │
│                                                                     │
│ Hover tooltip:                                                      │
│ ┌────────────────────────┐                                          │
│ │ Page: health_screening │                                          │
│ │ Contacts: 76           │                                          │
│ │ Drop-off: 23%          │                                          │
│ │ % of Total: 60%        │                                          │
│ │ [View Users]           │                                          │
│ └────────────────────────┘                                          │
├─────────────────────────────────────────────────────────────────────┤
│ STEP BREAKDOWN TABLE (collapsible sections)                         │
│                                                                     │
│ ▼ Questions (15 steps)                          Avg: 85% conversion │
│   ├─ 1. quiz_start .................. 127 → 125 (98%)              │
│   ├─ 2. height_weight ★ ............. 125 → 120 (96%)              │
│   └─ ...                                                            │
│                                                                     │
│ ▼ Health Screening (14 steps)                   Avg: 72% conversion │
│   ├─ 16. sleep_quality .............. 89 → 76 (85%)                │
│   ├─ 17. heart_conditions ★ 🔴 ...... 76 → 45 (59%) ← Critical     │
│   └─ ...                                                            │
│                                                                     │
│ ▶ Interstitials (4 steps) - collapsed                               │
│ ▶ Social Proof (4 steps) - collapsed                                │
│ ▼ Checkout (2 steps)                            Avg: 52% conversion │
└─────────────────────────────────────────────────────────────────────┘
```

### Features

- **Vertical bar chart**: Shows funnel shape clearly, bars decrease as users drop off
- **Starred pages filter**: Toggle to show only important conversion points
- **Key dropdown**: Color by drop-off severity, by category, etc.
- **ABS/% toggle**: Switch between absolute numbers and percentages
- **Collapsible sections**: Group steps by category (Questions, Health, Checkout, etc.)
- **Star indicator**: Mark important steps with ★
- **Critical indicator**: Red dot/icon for >40% drop-off
- **Inline drop-off indicators**: Show drop-off % between steps on the chart

---

## 3. Alerts Tab

### Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ Active Alerts (5)                               [Configure Rules →] │
├─────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ 🔴 CRITICAL: heart_conditions drop-off at 41%                   │ │
│ │    Threshold: 35% | Triggered: 2 hours ago                      │ │
│ │    [View Step] [Snooze] [Acknowledge]                           │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ 🟡 WARNING: Checkout conversion down 15% vs last week           │ │
│ │    Triggered: 5 hours ago                                       │ │
│ │    [View Details] [Snooze] [Acknowledge]                        │ │
│ └─────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────┤
│ Alert History                           [Filter: All ▼] [Export]   │
│ ┌───────────┬────────────┬──────────────┬───────────┬────────────┐ │
│ │ Date      │ Type       │ Message      │ Severity  │ Status     │ │
│ ├───────────┼────────────┼──────────────┼───────────┼────────────┤ │
│ │ Feb 6     │ Drop-off   │ heart_cond...│ Critical  │ Active     │ │
│ │ Feb 5     │ Volume     │ Low traffic  │ Warning   │ Resolved   │ │
│ └───────────┴────────────┴──────────────┴───────────┴────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 4. Reports Tab

### Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ Reports                                                             │
├─────────────────────────────────────────────────────────────────────┤
│ Quick Export                                                        │
│ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐        │
│ │ 📊 CSV     │ │ 📄 PDF     │ │ 📧 Email   │ │ 💬 Slack   │        │
│ │ Export     │ │ Report     │ │ Schedule   │ │ Webhook    │        │
│ └────────────┘ └────────────┘ └────────────┘ └────────────┘        │
├─────────────────────────────────────────────────────────────────────┤
│ Recent Reports                                                      │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ 📄 Daily Report - Feb 6, 2026                                   │ │
│ │    127 starts, 12 completions (9.4% conversion)                 │ │
│ │    Key insight: Health screening showing improvement            │ │
│ │    [View Full Report] [Download PDF]                            │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ 📄 Weekly Summary - Jan 30 - Feb 5, 2026                        │ │
│ │    856 starts, 89 completions (10.4% conversion)                │ │
│ │    [View Full Report] [Download PDF]                            │ │
│ └─────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 5. Insights Tab

### Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ AI-Powered Insights                              [Generate New →]   │
├─────────────────────────────────────────────────────────────────────┤
│ 💡 RECOMMENDATIONS                                                  │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ High Priority                                                   │ │
│ │ ─────────────────────────────────────────────────────────────── │ │
│ │ 1. Simplify Health Screening Questions                          │ │
│ │    The heart_conditions step has 41% drop-off. Consider:        │ │
│ │    • Breaking into multiple simpler questions                   │ │
│ │    • Adding progress indicator                                  │ │
│ │    • Reducing required fields                                   │ │
│ │    Estimated impact: +8-12% conversion                          │ │
│ │    [Create A/B Test] [Dismiss]                                  │ │
│ └─────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────┤
│ 📈 PATTERNS DETECTED                                                │
│ • Users who complete health screening in <2min convert 40% better  │
│ • Mobile users drop off 25% more at checkout                       │
│ • Peak completion time: 2-4pm EST                                  │
├─────────────────────────────────────────────────────────────────────┤
│ 🔬 A/B TEST SUGGESTIONS                                             │
│ • Test shorter health screening flow                               │
│ • Test social proof before checkout                                │
│ • Test progress bar visibility                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 6. Settings Tab

### Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ Settings                                                            │
├─────────────────────────────────────────────────────────────────────┤
│ ★ CUSTOM CONVERSIONS (shown on Overview)                            │
│                                                                     │
│   Drag to reorder:                                                  │
│   ┌────────────────────────────────────────────────────────────┐   │
│   │ ≡ Unique Users         │ Step: quiz_start    │ [Edit] [×]  │   │
│   │ ≡ Quiz Started         │ Step: quiz_start    │ [Edit] [×]  │   │
│   │ ≡ Lead Capture         │ Step: lead_capture  │ [Edit] [×]  │   │
│   │ ≡ Checkout Complete    │ Step: checkout      │ [Edit] [×]  │   │
│   │ ≡ Purchase Complete    │ Step: purchase      │ [Edit] [×]  │   │
│   └────────────────────────────────────────────────────────────┘   │
│   [+ Add Custom Conversion]                                         │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│ ★ STARRED STEPS (quick filter in Funnel view)                       │
│                                                                     │
│   Currently starred:                                                │
│   • quiz_start                                                      │
│   • health_screening                                                │
│   • lead_capture                                                    │
│   • checkout_complete                                               │
│   • purchase_complete                                               │
│   [Manage Starred Steps →]                                          │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│ ⚠️ ALERT THRESHOLDS                                                  │
│                                                                     │
│   Drop-off Warning:   [25]%                                         │
│   Drop-off Critical:  [40]%                                         │
│   Volume Alert:       Below [50] daily starts                       │
│   Conversion Alert:   Below [5]% completion rate                    │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│ 🔔 NOTIFICATIONS                                                     │
│                                                                     │
│   Email alerts:     [✓] Daily summary  [ ] Real-time critical       │
│   Slack webhook:    [✓] Connected to #funnel-alerts                 │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│ 🎨 DISPLAY PREFERENCES                                               │
│                                                                     │
│   Theme:           [Light ▼]                                        │
│   Default view:    [Overview ▼]                                     │
│   Chart colors:    [Purple ▼] (like Embeddables)                    │
│   Auto-refresh:    [5 minutes ▼]                                    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Additional UX Improvements

### 1. Visual Design Updates

| Current | Proposed |
|---------|----------|
| Gray/blue/red color scheme | Purple/violet primary (like Embeddables) |
| Dense cards with icons | Clean inline metrics row |
| Horizontal bar chart | Vertical bar chart showing funnel shape |
| Flat table | Collapsible grouped table |
| No gradients | Smooth gradient fills on area charts |

### 2. Interaction Improvements

- **Keyboard shortcuts**: `1-6` to switch tabs, `r` to refresh, `f` to filter
- **Click-through**: Click any metric/bar to drill down
- **Hover states**: Rich tooltips with context and actions
- **Comparison mode**: Compare two date ranges side-by-side
- **Annotations**: Mark events on charts (e.g., "Launched new checkout flow")

### 3. Data Display

- **Sparklines**: Mini trend charts in the metrics row
- **Delta indicators**: Show change vs previous period everywhere
- **Percentile context**: "This is better than 80% of funnels"
- **Smart rounding**: 12.4% not 12.3789%

### 4. Mobile Experience

- **Swipe navigation**: Swipe between tabs
- **Collapsible sections**: Everything starts collapsed on mobile
- **Bottom navigation**: Move tab bar to bottom on mobile
- **Touch-optimized tooltips**: Tap to show, tap elsewhere to dismiss

### 5. Performance

- **Skeleton loading**: Show layout skeleton while data loads
- **Optimistic updates**: Show changes immediately
- **Virtual scrolling**: For long step lists (55 steps)
- **Cached data**: Show stale data while refreshing

---

## Implementation Priority

### Phase 1: Core Restructure
1. Add tabbed navigation (Overview, Funnel, Alerts, Settings)
2. Redesign Overview with customizable metrics row
3. Replace horizontal bar chart with vertical funnel chart

### Phase 2: Enhanced Funnel View
4. Add collapsible step categories
5. Add starred pages filter
6. Add ABS/% toggle
7. Improve tooltips with "View Users" placeholder

### Phase 3: Settings & Customization
8. Build Settings page for custom conversions
9. Add starred steps management
10. Add alert threshold configuration

### Phase 4: Reports & Insights
11. Add Reports tab with export options
12. Add Insights tab with AI recommendations
13. Add comparison mode

### Phase 5: Polish
14. Update color scheme to purple/violet
15. Add keyboard shortcuts
16. Improve mobile experience
17. Add annotations feature

---

## Technical Notes

### New Components Needed

```
/components/
  /navigation/
    - tabs.tsx              # Reusable tab component
    - tab-navigation.tsx    # Main nav with all tabs
  /overview/
    - custom-metrics-row.tsx
    - area-trend-chart.tsx
    - quick-stats.tsx
  /funnel/
    - vertical-funnel-chart.tsx
    - collapsible-step-group.tsx
    - step-filters.tsx
  /alerts/
    - alert-card.tsx
    - alert-history-table.tsx
  /settings/
    - custom-conversion-editor.tsx
    - starred-steps-manager.tsx
    - alert-threshold-form.tsx
```

### Database Changes

```sql
-- New table for user preferences
CREATE TABLE user_preferences (
  id TEXT PRIMARY KEY,
  custom_conversions JSONB,  -- Array of {name, stepId}
  starred_steps JSONB,       -- Array of step IDs
  alert_thresholds JSONB,    -- {dropOffWarning, dropOffCritical, etc.}
  display_preferences JSONB  -- {theme, defaultView, chartColors}
);
```

### API Changes

```
GET /api/settings
PUT /api/settings

GET /api/conversions/custom
POST /api/conversions/custom
DELETE /api/conversions/custom/:id

GET /api/steps/starred
PUT /api/steps/starred
```

---

## Color Palette (Embeddables-Inspired)

```css
:root {
  --primary: #7c3aed;      /* violet-600 */
  --primary-light: #a78bfa; /* violet-400 */
  --primary-dark: #5b21b6;  /* violet-800 */

  --success: #22c55e;       /* green-500 */
  --warning: #f59e0b;       /* amber-500 */
  --critical: #ef4444;      /* red-500 */

  --background: #f9fafb;    /* gray-50 */
  --surface: #ffffff;
  --border: #e5e7eb;        /* gray-200 */

  --text-primary: #111827;  /* gray-900 */
  --text-secondary: #6b7280; /* gray-500 */
}
```

---

## Comparison: Before vs After

| Aspect | Before | After |
|--------|--------|-------|
| Navigation | Single page scroll | Tabbed sections |
| Metrics | 4 cards with icons | Inline row, customizable |
| Funnel Chart | Horizontal bars (hard to read) | Vertical bars (funnel shape) |
| Step Table | Flat 55-row table | Collapsible by category |
| Filtering | None | Starred pages, date range |
| View Toggle | None | ABS/% switch |
| Customization | None | Settings page |
| Color Theme | Blue/gray | Purple/violet |
| Tooltips | Basic info | Rich with actions |
