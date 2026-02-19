# Domain-Adaptive Security Checklists

Apply ONLY the checklists relevant to the detected feature domains.

**Auth Flows** — JWT token generation and validation, HTTP-only cookie embedding (Secure, SameSite, HttpOnly flags), access token expiry and refresh token rotation, brute force protection, session management, password hashing algorithms, token revocation/blacklisting, MFA support

**Payments** — idempotency, webhook signature verification, PCI compliance patterns, audit trails

**Real-time / WebSocket** — connection auth, room access control, event injection, presence privacy

**AI / LLM Integration** — prompt injection prevention, input sanitization, output validation, PII filtering, rate limiting

**File Handling** — virus scanning, type validation beyond extension, storage quotas, signed URLs

**User Data** — GDPR considerations, data export, account deletion, PII encryption

**Search / Listing** — query sanitization, pagination limits, expensive query protection

**Messaging** — content moderation hooks, attachment safety, delivery guarantees

**Scheduling** — timezone handling, concurrent booking prevention, cancellation policies
