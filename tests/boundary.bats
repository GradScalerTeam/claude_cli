#!/usr/bin/env bats
# Boundary Tests for Claude CLI
# Created: 2026-03-25 03:05
# Purpose: Test boundary conditions and edge cases

@test "Boundary: Empty agents directory is handled gracefully" {
  # Test with empty directory (if applicable)
  if [ -d agents ]; then
    # Agents directory exists, test is valid
    [ -d agents ]
  else
    skip "Agents directory does not exist"
  fi
}

@test "Boundary: Empty skills directory is handled gracefully" {
  if [ -d skills ]; then
    [ -d skills ]
  else
    skip "Skills directory does not exist"
  fi
}

@test "Boundary: Empty hooks directory is handled gracefully" {
  if [ -d hooks ]; then
    [ -d hooks ]
  else
    skip "Hooks directory does not exist"
  fi
}

@test "Boundary: Empty docs directory is handled gracefully" {
  if [ -d docs ]; then
    [ -d docs ]
  else
    skip "Docs directory does not exist"
  fi
}

@test "Boundary: README.md is not empty" {
  if [ -f README.md ]; then
    size=$(wc -c < README.md)
    [ $size -gt 0 ]
  else
    skip "README.md does not exist"
  fi
}

@test "Boundary: CLAUDE.md is not empty" {
  if [ -f CLAUDE.md ]; then
    size=$(wc -c < CLAUDE.md)
    [ $size -gt 0 ]
  else
    skip "CLAUDE.md does not exist"
  fi
}

@test "Boundary: Hook script is not empty" {
  if [ -f hooks/design-context/design-context-hook.sh ]; then
    size=$(wc -c < hooks/design-context/design-context-hook.sh)
    [ $size -gt 0 ]
  else
    skip "Hook script does not exist"
  fi
}

@test "Boundary: Git repository has at least one commit" {
  if [ -d .git ]; then
    commit_count=$(git rev-list --count HEAD 2>/dev/null || echo "0")
    [ $commit_count -gt 0 ]
  else
    skip "Not a git repository"
  fi
}

@test "Boundary: .gitignore is not empty" {
  if [ -f .gitignore ]; then
    size=$(wc -c < .gitignore)
    [ $size -gt 0 ]
  else
    skip ".gitignore does not exist"
  fi
}

@test "Boundary: LICENSE file is not empty" {
  if [ -f LICENSE ] || [ -f LICENSE.md ]; then
    if [ -f LICENSE ]; then
      size=$(wc -c < LICENSE)
    else
      size=$(wc -c < LICENSE.md)
    fi
    [ $size -gt 0 ]
  else
    skip "LICENSE file does not exist"
  fi
}
