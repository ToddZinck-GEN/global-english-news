# GEN Teacher Network — MVP Architecture

## Product loop

1. Learner generates a free GEN lesson.
2. Lesson ends with a contextual **Practice Speaking** CTA.
3. Learner can request a 30-minute speaking session.
4. GEN matches the learner with a verified teacher.
5. Learner pays through GEN.
6. Teacher receives the session payout; GEN retains its marketplace fee.
7. Learner can later request private tutoring, local lessons, IELTS support, or corporate training.

## Teacher onboarding

Teachers submit:
- name and contact email
- country/city
- teaching format: online / in-person / both
- certifications (CELTA, TEFL, TESOL, etc.)
- specialties
- CEFR/IELTS experience
- hourly and 30-minute rates
- availability

The MVP should distinguish **application submitted** from **verified teacher**. Do not display a teacher as verified until an administrator has reviewed the certification evidence.

## Transaction architecture

Keep payment provider implementation separate from the teacher profile and booking model. GEN should own the booking record and payment status so the marketplace can change payment providers later.

Suggested lifecycle:

`request → teacher_match → booking_pending_payment → paid → confirmed → completed → teacher_payout → review`

For disputes/cancellations, retain an auditable status history rather than overwriting the original booking state.

## Suggested future tables

- `teacher_profiles`
- `teacher_credentials`
- `teacher_specialties`
- `teacher_availability`
- `learner_profiles`
- `speaking_sessions`
- `payments`
- `teacher_payouts`
- `reviews`
- `lead_requests`

## Build order

### Now
- Teacher Network landing page
- Teacher application UI
- Learner-facing teacher CTA
- Placeholder teacher cards

### Next
- Supabase authentication
- Teacher application persistence
- Admin verification workflow
- Real teacher profiles
- Speaking-session request flow

### After demand validation
- Payment processing through GEN
- Calendar/availability
- Automated teacher payouts
- Reviews
- Local teacher matching
- Corporate training leads

The prototype intentionally does **not** claim that payments, verification, matching, or payouts are live yet.
