#!/usr/bin/env bats
# Regression Tests for Claude CLI
# Created: 2026-03-25 03:53
# Purpose: Ensure new changes don't break existing functionality

@test "Regression: Basic project structure remains intact" {
  # Ensure core directories still exist
  [ -d agents ] || [ -d skills ] || [ -d hooks ] || [ -d docs ]
}

@test "Regression: README still exists and is readable" {
  [ -f README.md ]
  [ -r README.md ]
}

@test "Regression: CLAUDE.md still exists and is readable" {
  [ -f CLAUDE.md ]
  [ -r CLAUDE.md ]
}

@test "Regression: Git repository is still valid" {
  if [ -d .git ]; then
    git status > /dev/null 2>&1
  else
    skip "Not a git repository"
  fi
}

@test "Regression: No accidental deletion of tests" {
  # Ensure test directory still exists
  if [ -d tests ]; then
    test_count=$(find tests -name "*.bats" | wc -l)
    [ $test_count -gt 0 ]
  else
    skip "No tests directory"
  fi
}

@test "Regression: Hooks still executable" {
  if [ -f hooks/design-context/design-context-hook.sh ]; then
    [ -x hooks/design-context/design-context-hook.sh ]
  else
    skip "Hook script does not exist"
  fi
}

@test "Regression: Documentation still accessible" {
  # Check if docs directory has content
  if [ -d docs ]; then
    doc_count=$(find docs -name "*.md" | wc -l)
    [ $doc_count -gt 0 ]
  else
    skip "No docs directory"
  fi
}

@test "Regression: Configuration files still valid" {
  # Check .gitignore
  if [ -f .gitignore ]; then
    [ -r .gitignore ]
  fi

  # Check LICENSE
  if [ -f LICENSE ] || [ -f LICENSE.md ]; then
    true
  else
    skip "No LICENSE file"
  fi
}

@test "Regression: No binary files in text directories" {
  # Ensure no accidental binary files
  if [ -d agents ]; then
    ! find agents -type f -exec file {} \; | grep -q "binary"
  else
    skip "No agents directory"
  fi
}

@test "Regression: File sizes remain reasonable" {
  # Check that no file is excessively large
  max_size=10485760  # 10MB

  large_files=$(find . -type f -size +${max_size}c ! -path "*/node_modules/*" ! -path "*/.git/*" 2>/dev/null | wc -l)

  [ $large_files -eq 0 ]
}
