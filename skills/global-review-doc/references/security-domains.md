# Domain-Adaptive Security Checklists

Apply ONLY the checklists relevant to the feature being reviewed.

**1. Sign Up / Registration** — email verification, password strength, duplicate handling, bot protection (CAPTCHA/rate limiting), ToS tracking, activation flow

**2. Login / Authentication** — JWT token generation and validation, HTTP-only cookie embedding (Secure, SameSite, HttpOnly flags), access token expiry and refresh token rotation, brute force protection (lockout after N attempts), "remember me" details, multi-device session management, token revocation/blacklisting, login audit logging

**3. User Profile** — privacy levels (who can view what), photo upload safety (type/size/content moderation), data export (GDPR), account deletion (soft delete, retention policy)

**4. Search / Listing** — pagination strategy (cursor vs offset), search sanitization, result caching, rate limiting expensive queries, zero results handling

**5. Payments / Subscriptions** — idempotency, webhook signature verification, failed payment retry, refund flow, payment audit trail

**6. Messaging / Chat** — message encryption, content moderation/reporting, attachment safety (virus scanning), delivery guarantees, notification preferences

**7. Matching / Recommendations** — privacy controls, blocking/reporting, request expiry, consent-based sharing, interest/decline tracking

**8. Scheduling / Availability** — timezone handling, concurrent booking prevention, cancellation policies, reminders, calendar sync conflicts

**9. Document / Data Sharing** — URL encoding security, data compression safety, storage quotas, share link expiry, public vs private access

**10. Real-time / WebSocket** — connection state handling, delivery guarantees, presence privacy, room access control, event injection prevention

**11. AI / LLM Integration** — prompt injection prevention, input sanitization before LLM, output validation, rate limiting AI endpoints, PII filtering in responses, model output safety
