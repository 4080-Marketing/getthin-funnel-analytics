# Funnel Optimization Action Plan
**Based on Analysis from**: February 6, 2026
**Priority Focus**: Lead Capture & Checkout Conversion

---

## Phase 1: Emergency Fixes (24-48 Hours)

### 1.1 Payment Gateway Audit
**Owner**: Engineering
**Priority**: P0 - Critical

The 87% checkout abandonment rate suggests potential technical issues.

- [ ] Check Stripe/payment gateway dashboard for failed transactions
- [ ] Review error logs for payment-related exceptions
- [ ] Verify checkout page loads correctly on mobile
- [ ] Test complete checkout flow manually
- [ ] Check for any JavaScript console errors on checkout

### 1.2 Analytics Platform Alerts
**Owner**: This Platform
**Priority**: P0 - Critical

Configure immediate alerts in `/app/dashboard/page.tsx`:

```typescript
// Suggested alert thresholds
{
  dropOffWarning: 30,      // Warn if any step > 30% drop-off
  dropOffCritical: 50,     // Critical if any step > 50% drop-off
  dailyMinLeads: 100,      // Alert if < 100 leads captured
  checkoutConversionMin: 5 // Alert if checkout conversion < 5%
}
```

---

## Phase 2: Quick Wins (Week 1)

### 2.1 Lead Capture Optimization
**Current**: 66% drop-off after lead capture
**Target**: 40% or less

**A/B Test Ideas**:
| Test | Control | Variant |
|------|---------|---------|
| Fields | Email + Phone | Email Only |
| CTA | "Continue" | "See My Results" |
| Layout | Full page form | Inline form |
| Trust | None | "256-bit encrypted" badge |

**Implementation**:
- [ ] Set up A/B test framework in Embeddables
- [ ] Create variant with email-only field
- [ ] Add HIPAA/privacy trust badges
- [ ] Track variant performance in analytics

### 2.2 Exit Intent for Checkout
**Current**: 52 users abandon at checkout
**Target**: Recover 20% with exit intent

- [ ] Implement exit intent modal on checkout page
- [ ] Offer: "Complete your order within 24 hours for $X off"
- [ ] Collect email if not already captured
- [ ] Trigger abandoned cart email sequence

### 2.3 Cart Recovery Emails
**Current**: 0 recovery emails
**Target**: 3-email sequence

| Email | Timing | Content |
|-------|--------|---------|
| 1 | 1 hour | "Forgot something?" + cart reminder |
| 2 | 24 hours | Testimonial + urgency |
| 3 | 48 hours | Final discount offer |

---

## Phase 3: Optimization Sprint (Weeks 2-3)

### 3.1 Initial Step Improvement
**Current**: 26% drop at first step
**Target**: 15% or less

- [ ] Lighthouse audit for page speed
- [ ] Optimize hero image/video loading
- [ ] Simplify first question UI
- [ ] Add progress bar (1 of 55 → "1 of 5 sections")
- [ ] Mobile-first redesign of step 1

### 3.2 Price Transparency
**Current**: Price revealed at checkout (step 40)
**Target**: Show pricing at step 37 (medical review)

- [ ] A/B test early price reveal
- [ ] Add "starting from $X/month" on medicine_match
- [ ] Test pricing calculator widget

### 3.3 Trust Signal Enhancement
Throughout funnel, add:
- [ ] Doctor credentials on medical_review
- [ ] Patient testimonial count ("Join 50,000+ patients")
- [ ] Security badges on checkout
- [ ] Money-back guarantee badge

---

## Phase 4: Analytics Platform Enhancements

### 4.1 Alert System Implementation
Add these alerts to the platform:

```typescript
// alerts to implement in lib/services/alert-detection.ts
const ALERT_DEFINITIONS = [
  {
    type: 'step_dropoff',
    condition: 'dropOffRate > 40%',
    severity: 'critical',
    steps: ['lead_capture', 'macro_checkout', 'micro_checkout']
  },
  {
    type: 'zero_conversions',
    condition: 'checkoutCompletions === 0',
    severity: 'critical',
    timeWindow: '24h'
  },
  {
    type: 'volume_anomaly',
    condition: 'dailyStarts < 500',
    severity: 'warning',
    comparison: 'previous_week_avg'
  }
];
```

### 4.2 A/B Test Segmentation
- [ ] Add `variant` field to analytics API
- [ ] Filter dashboard by variant
- [ ] Compare conversion rates by variant
- [ ] Statistical significance calculator

### 4.3 Revenue Integration
- [ ] Add revenue tracking from payment gateway
- [ ] Calculate Average Order Value (AOV)
- [ ] Track revenue per funnel step
- [ ] Add revenue metrics to dashboard

### 4.4 Cohort Analysis
- [ ] Track user cohorts by start date
- [ ] Compare conversion rates over time
- [ ] Identify best/worst performing days
- [ ] Correlate with external factors (ads, emails)

---

## Technical Debt to Address

### Duplicate Step Keys
The Embeddables data has duplicate keys that break analytics:
- `social_proof` appears at indices 27 and 29
- `avg_blood_pressure` appears at indices 28 and 30

**Options**:
1. **Prefer**: Work with Embeddables to fix source data
2. **Fallback**: De-duplicate in sync service using step index

```typescript
// lib/services/embeddables-sync.ts
const deduplicateSteps = (steps: Step[]) => {
  const seen = new Map<string, number>();
  return steps.map((step, index) => {
    const baseKey = step.key;
    if (seen.has(baseKey)) {
      // Append index to make unique
      step.key = `${baseKey}_${index}`;
    }
    seen.set(baseKey, index);
    return step;
  });
};
```

### Count Inconsistencies
Some steps show higher counts than previous steps. Root causes:
- Conditional branching
- Back navigation
- Page refreshes

**Fix**: Track unique session IDs per step, not total page views.

---

## Success Metrics Dashboard

Add these KPIs to the dashboard Overview tab:

| Metric | Formula | Current | Target |
|--------|---------|---------|--------|
| Quiz Start Rate | starts / landing_page_views | - | 40% |
| Lead Capture Rate | leads / starts | 39.1% | 55% |
| Checkout View Rate | checkout_views / leads | 13.1% | 30% |
| Purchase Rate | purchases / checkout_views | 0% | 15% |
| Overall Conversion | purchases / starts | 0.07% | 2.5% |
| Revenue per Start | total_revenue / starts | $0 | $5 |

---

## Immediate Next Steps

1. **Today**: Deploy this analytics platform with configured alerts
2. **This Week**: Implement lead capture A/B test
3. **This Week**: Set up cart abandonment email sequence
4. **Next Week**: Complete checkout flow audit
5. **Ongoing**: Monitor daily reports and iterate

---

*Action plan generated by Get Thin MD Funnel Analytics Platform*
