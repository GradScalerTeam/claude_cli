# Component Contract Checklist

## Props

- Are props clearly named and minimal?
- Is responsibility split correctly between parent and child?
- Are obviously coupled props better modeled as a single object or derived state?

## State

- Is state owned in the right place?
- Are loading, error, and empty states explicit?
- Are side effects clearly scoped?

## Interaction

- Do click, keyboard, and focus flows make sense?
- Are transitions between states predictable?
- Is there obvious duplicate or conflicting state?

## Accessibility

- Is the component keyboard-usable?
- Are labels, roles, and semantics reasonable?
- Is there any obvious inaccessible custom control behavior?
