# Framework Best Practices Checklists

Apply ONLY the checklists for the detected tech stack. Skip all others.

## Frontend Frameworks

**React**
- Hooks rules followed? (no conditional hooks, proper dependency arrays)
- Component composition vs prop drilling?
- Key prop usage in lists?
- useEffect cleanup functions?
- State colocation (state lives as close to where it's used as possible)?
- Controlled vs uncontrolled inputs consistent?
- React.memo / useMemo / useCallback used appropriately (not excessively)?

**Next.js**
- Server vs Client components used correctly?
- Data fetching patterns (server components, route handlers)?
- Metadata and SEO handling?
- Image optimization (next/image)?
- Route organization (app router vs pages)?
- Middleware usage for auth/redirects?

**Vue**
- Composition API vs Options API consistent?
- Reactive references used correctly?
- Computed vs methods appropriate?
- Watchers not overused?
- Component registration clean?

**Angular**
- Module organization?
- Dependency injection patterns?
- Observable subscription management?
- Change detection strategy?
- Lazy loading of feature modules?

## Backend Frameworks

**Express / Fastify**
- Middleware ordering correct?
- Error handling middleware present?
- Request validation (Joi, Zod, class-validator)?
- Route organization?
- Async error handling (express-async-errors or wrappers)?

**FastAPI**
- Pydantic models for request/response validation?
- Dependency injection used?
- Background tasks for heavy operations?
- Proper status codes?
- Async endpoints where beneficial?

**Django / DRF**
- Model design (fields, relationships, indexes)?
- Serializer validation?
- QuerySet optimization (select_related, prefetch_related)?
- Permission classes?
- Signal usage appropriate?

**Flask**
- Blueprint organization?
- Application factory pattern?
- Extension usage?
- Request context handling?
- Error handlers registered?

## State Management

**Redux Toolkit**
- Slices properly organized?
- createAsyncThunk for async operations?
- Selectors memoized (createSelector)?
- Normalized state for collections?
- No direct state mutation outside of RTK?

## Styling

**Tailwind CSS**
- Consistent utility usage?
- Custom theme configuration?
- Component extraction for repeated patterns?
- Responsive design approach?
- Dark mode handling?

## Mobile

**Flutter / Dart**
- Widget composition?
- State management pattern (Provider, Riverpod, BLoC)?
- Null safety?
- Platform-specific handling?
- Performance (const constructors, key usage)?

## Database / ORM

**SQLAlchemy**
- Session management?
- Relationship loading strategies?
- Migration handling (Alembic)?
- Query optimization?
- Connection pooling?

**Prisma**
- Schema design?
- Migration workflow?
- Query optimization (include, select)?
- Transaction usage?
- Error handling?

**TypeORM**
- Entity design?
- Repository pattern usage?
- Query builder vs find options?
- Migration strategy?
- Connection management?

## General Language Best Practices

**Python**
- PEP 8 compliance (if not enforced by linter)?
- Context managers for resources?
- Generator usage for large datasets?
- Type hints on public APIs?
- Exception hierarchy (specific exceptions, not bare except)?

**Node.js / TypeScript**
- Strict TypeScript config?
- Proper error types (not throwing strings)?
- Stream usage for large data?
- Event loop awareness (no blocking operations)?
- Module system consistency (ESM vs CJS)?

## Fallback: Unknown / Niche Frameworks

If the framework is not listed above:
1. Apply language-level best practices
2. Use context7 to look up the framework's documented best practices
3. Check for framework-specific linter plugins in the project config
4. Review the framework's official examples for pattern comparison
