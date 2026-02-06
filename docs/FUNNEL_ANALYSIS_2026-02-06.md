# Funnel Analytics Analysis Report
**Date**: February 6, 2026
**Data Source**: Embeddables API
**Sample Size**: 1,000 entries (1,386 total starts)

---

## Executive Summary

The funnel shows a **critically low overall conversion rate of 0.07%** (1 user reaching the final calendar_page step out of 1,386 starts). Zero users completed with product data, indicating a severe checkout/payment issue.

### Critical Issues Identified

1. **Lead Capture Hemorrhage**: 66% of users drop off at step 38 (lead_capture)
2. **Checkout Abandonment**: 87% drop-off at macro_checkout transition
3. **High Initial Abandonment**: 26% of users leave at the very first step
4. **Zero Purchase Completions**: No users completed with product data

---

## Detailed Analysis

### Funnel Flow Summary

| Metric | Value |
|--------|-------|
| Total Quiz Starts | 1,386 |
| Entries Sampled | 1,000 |
| Total Steps Tracked | 43 |
| Final Step Reached | 1 |
| **Overall Conversion** | **0.07%** |
| Completed with Product Data | **0** |

### Step-by-Step Funnel

| Index | Page Key | Count | Drop from Previous |
|-------|----------|-------|-------------------|
| 0 | current_height_and_weight | 1,386 | - |
| 1 | bmi_goal_weight | 1,002 | -27.7% |
| 2 | sex | 965 | -3.7% |
| 3 | initial_disqualifiers | 964 | -0.1% |
| 4 | specific_effects | 965 | +0.1% |
| 5 | main_priority | 995 | +3.1% |
| 6 | video_proof | 943 | -5.2% |
| 7 | interstitial_magic_science | 929 | -1.5% |
| 8 | female_social_proof | 922 | -0.8% |
| 9 | how_glp1_works | 921 | -0.1% |
| 10 | glp_motivation | 929 | +0.9% |
| 11 | pace | 931 | +0.2% |
| 12 | interstitial_works_for_me | 916 | -1.6% |
| 13 | sleep_overall | 911 | -0.5% |
| 14 | sleep_hours | 904 | -0.8% |
| 15 | female_social_proof_2 | 902 | -0.2% |
| 16 | dq_health_conditions | 907 | +0.6% |
| 17 | other_health_conditions | 914 | +0.8% |
| 18 | clearance_required | 919 | +0.5% |
| 19 | dq_health_conditions_by_bmi | 924 | +0.5% |
| 20 | taking_wl_meds | 934 | +1.1% |
| 21 | glp_details | 962 | +3.0% |
| 22 | taken_opiate_meds | 925 | -3.8% |
| 23 | surgeries | 887 | -4.1% |
| 24 | wl_programs | 877 | -1.1% |
| 25 | patient_willing_to | 845 | -3.6% |
| 26 | weight_changed | 764 | -9.6% |
| 27 | social_proof | 754 | -1.3% |
| 28 | avg_blood_pressure | 747 | -0.9% |
| 29 | social_proof (duplicate) | 748 | +0.1% |
| 30 | avg_blood_pressure (duplicate) | 748 | 0% |
| 31 | avg_resting_heart | 728 | -2.7% |
| 32 | current_medications | 717 | -1.5% |
| 33 | state_of_mind | 731 | +2.0% |
| 34 | further_info | 715 | -2.2% |
| 35 | concerns | 704 | -1.5% |
| 36 | date_of_birth | 703 | -0.1% |
| 37 | medical_review | 657 | -6.5% |
| 38 | lead_capture | 542 | -17.5% |
| 39 | medicine_match | 183 | **-66.2%** |
| 40 | macro_checkout | 71 | -61.2% |
| 41 | async_confirmation_to_redirect | 9 | **-87.3%** |
| 42 | calendar_page | 1 | -88.9% |

### Drop-off Distribution (Where Users Left Forever)

| Step | Page Key | Users Dropped | % of Total |
|------|----------|--------------|------------|
| **38** | **lead_capture** | **265** | **26.5%** |
| 0 | current_height_and_weight | 259 | 25.9% |
| 39 | medicine_match | 83 | 8.3% |
| 37 | medical_review | 70 | 7.0% |
| 40 | macro_checkout | 52 | 5.2% |
| 36 | date_of_birth | 46 | 4.6% |
| 21 | glp_details | 28 | 2.8% |
| 25 | patient_willing_to | 22 | 2.2% |
| 22 | taken_opiate_meds | 18 | 1.8% |
| 30 | avg_blood_pressure | 12 | 1.2% |

---

## Critical Bottlenecks

### 1. Lead Capture Wall (Step 38)
**Impact**: 265 users (26.5%) drop off here permanently
**Problem**: Highest single-step abandonment in the entire funnel
**Hypothesis**:
- Email/phone collection friction
- Unclear value proposition at this stage
- Privacy concerns
- Form validation issues

**Recommended Actions**:
- A/B test reducing required fields (email only vs email+phone)
- Add trust signals (HIPAA compliance, privacy policy)
- Show clear benefit of providing contact info
- Test inline form vs modal form

### 2. Initial Step Abandonment (Step 0)
**Impact**: 259 users (25.9%) drop off at the first step
**Problem**: Users arriving but immediately bouncing
**Hypothesis**:
- Poor landing page UX on mobile
- Slow page load
- Confusing first question
- Unexpected content

**Recommended Actions**:
- Analyze page speed (Lighthouse audit)
- Review mobile responsiveness
- A/B test first question simplification
- Add progress indicator early

### 3. Lead Capture → Medicine Match Transition (Steps 38→39)
**Impact**: 66% drop-off (542 → 183 users)
**Problem**: Massive cliff after lead capture
**Hypothesis**:
- Users providing email but not continuing
- Medicine match page confusion
- Technical errors in the transition
- Lead capture is "completion" for many

**Recommended Actions**:
- Check for JavaScript errors on medicine_match page
- Review medicine_match UX
- Consider auto-redirect vs. manual click
- Add exit survey for abandoned leads

### 4. Checkout Abandonment (Step 40→41)
**Impact**: 87% drop-off (71 → 9 users)
**Problem**: Catastrophic checkout abandonment
**Hypothesis**:
- Price shock
- Limited payment options
- Complex checkout form
- Trust/security concerns
- Technical payment processing issues

**Recommended Actions**:
- **IMMEDIATE**: Check payment gateway for errors
- Review pricing display earlier in funnel
- Add payment method variety (Apple Pay, PayPal)
- Add security badges and testimonials
- Implement checkout session recovery emails

---

## Data Quality Issues

### Duplicate Step Keys
The following keys appear twice in the data, indicating an Embeddables tracking issue:

| Key | First Appearance | Second Appearance |
|-----|-----------------|-------------------|
| social_proof | Index 27 | Index 29 |
| avg_blood_pressure | Index 28 | Index 30 |

**Action Required**: Work with Embeddables to fix duplicate page key tracking.

### Count Increases Between Steps
Steps 4-5, 16-21, 29-30, and 32-33 show count increases, which should be impossible in a linear funnel. This suggests:
- Conditional branching not properly tracked
- Users navigating backwards
- Page refresh double-counting

**Action Required**: Review tracking implementation for conditional flows.

---

## Recommended Priority Actions

### Immediate (24-48 hours)
1. **Check Payment Gateway**: Verify no technical errors causing checkout failures
2. **Hotjar/FullStory Review**: Watch session recordings for lead_capture and checkout steps
3. **Error Log Audit**: Check for JavaScript errors on critical steps

### Short-term (1 week)
1. **A/B Test Lead Capture**: Simplify form to email-only
2. **Add Exit Intent Popup**: Capture abandoning users at checkout
3. **Implement Cart Recovery**: Email sequence for checkout abandoners
4. **Price Transparency**: Show pricing earlier in the funnel

### Medium-term (2-4 weeks)
1. **Landing Page Optimization**: Reduce initial bounce rate
2. **Mobile UX Audit**: Ensure mobile-first experience
3. **Trust Signal Improvements**: Add reviews, certifications, guarantees
4. **Alternative Checkout Flow**: Test micro_checkout path

---

## Success Metrics

Current baseline (for improvement tracking):

| Metric | Current | Target (30 days) | Target (90 days) |
|--------|---------|------------------|------------------|
| Quiz Start → Lead | 39.1% | 50% | 60% |
| Lead → Checkout View | 13.1% | 25% | 40% |
| Checkout → Purchase | 0% | 10% | 25% |
| Overall Conversion | 0.07% | 2% | 5% |

---

## Next Steps for This Analytics Platform

1. **Set Up Alerts**: Configure alerts for:
   - Drop-off rate > 30% at any step
   - Zero checkouts in 24 hours
   - Lead capture rate < 35%

2. **Daily Reports**: Enable Slack notifications for daily funnel health

3. **A/B Test Tracking**: Implement ability to segment by test variants

4. **Revenue Tracking**: Add product/revenue data integration

---

*Report generated by Get Thin MD Funnel Analytics Platform*
