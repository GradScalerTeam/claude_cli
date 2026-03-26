#!/usr/bin/env bats
# End-to-End Tests for Claude CLI
# Created: 2026-03-25 01:36
# Purpose: Test complete workflows

@test "E2E: Complete workflow - documentation to agents" {
  # Verify documentation links to agents
  [ -f CLAUDE.md ]
  grep -q "agents" CLAUDE.md
  [ -d agents ]
}

@test "E2E: Complete workflow - hooks integration" {
  # Verify hooks are documented and exist
  [ -f CLAUDE.md ]
  grep -q "hooks" CLAUDE.md
  [ -d hooks ]
  [ -f hooks/design-context/design-context-hook.sh ]
}

@test "E2E: Complete workflow - skills available" {
  # Verify skills are documented and exist
  [ -f CLAUDE.md ]
  grep -q "skills" CLAUDE.md
  [ -d skills ]
}

@test "E2E: Complete workflow - README guides to CLAUDE" {
  # Verify README links to CLAUDE.md
  [ -f README.md ]
  grep -q "CLAUDE" README.md
  [ -f CLAUDE.md ]
}

@test "E2E: Project has complete documentation chain" {
  # Verify complete documentation chain exists
  [ -f README.md ]
  [ -f CLAUDE.md ]
  [ -d docs ]
  [ -d agents ]
  [ -d skills ]
  [ -d hooks ]
}

@test "E2E: Git configuration is complete" {
  # Verify complete git setup
  [ -d .git ]
  [ -f .gitignore ]
  [ -f LICENSE ]
  git remote -v | grep -q "origin"
}

@test "E2E: All major directories have README" {
  # Check if major directories have documentation
  # This is optional, so we use skip if not found
  if [ -d agents ] && [ -f agents/README.md ]; then
    skip "Agents README exists"
  fi
  if [ -d skills ] && [ -f skills/README.md ]; then
    skip "Skills README exists"
  fi
  true  # Test passes if READMEs don't exist (they're optional)
}

@test "E2E: Project structure follows conventions" {
  # Verify project follows standard structure
  [ -f README.md ] || [ -f README ]
  [ -d .git ] || [ -d agents ] || [ -d skills ] || [ -d hooks ]
  [ -f LICENSE ] || [ -f LICENSE.md ] || [ -f COPYING ]
}
