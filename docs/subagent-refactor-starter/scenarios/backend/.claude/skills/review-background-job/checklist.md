# Background Job Checklist

## Idempotency

- Can the job run twice without corrupting data?
- Are duplicate writes guarded explicitly?
- Are side effects externally visible more than once?

## Retries

- Is retry behavior intentional?
- Will retries amplify side effects?
- Are permanent failures separated from transient ones?

## Failure Handling

- What happens on partial success?
- Are errors surfaced somewhere observable?
- Is there a clear recovery path?

## Deploy / Restart Safety

- Is the job safe if a worker restarts mid-run?
- Is there concurrency control where needed?
- Could two deploy versions process the same work inconsistently?
