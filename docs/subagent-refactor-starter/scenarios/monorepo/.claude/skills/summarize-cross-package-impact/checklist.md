# Cross-Package Impact Checklist

## Dependency Scope

- Which packages changed directly?
- Which apps or packages consume them?
- Is the dependency direction still clean?

## Contract Surface

- Did shared types, schemas, or exported functions change?
- Are there package consumers that may break silently?
- Is the change internal-only or public?

## Validation Scope

- Which packages need direct tests?
- Which apps need integration coverage because of shared changes?
- Is full-workspace validation really necessary?

## Boundary Quality

- Is package ownership still clear?
- Did the change introduce cross-package leakage?
- Should some logic move back behind a package boundary?
