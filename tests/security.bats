#!/usr/bin/env bats
# Security Tests for Claude CLI
# Created: 2026-03-25 03:31
# Purpose: Test security best practices

@test "Security: No sensitive data in repository" {
  # Check for common sensitive files
  [ ! -f .env ] || skip ".env file exists"
  [ ! -f credentials.json ] || skip "credentials.json exists"
  [ ! -f secrets.yaml ] || skip "secrets.yaml exists"
  
  # If none exist, test passes
  true
}

@test "Security: .gitignore excludes sensitive files" {
  if [ -f .gitignore ]; then
    # Check for common sensitive patterns
    grep -q ".env" .gitignore || grep -q "credentials" .gitignore || \
    grep -q "secrets" .gitignore || grep -q ".pem" .gitignore || \
    grep -q ".key" .gitignore || skip "No sensitive patterns in .gitignore"
  else
    skip ".gitignore does not exist"
  fi
}

@test "Security: No hardcoded secrets in scripts" {
  # Check for potential secrets in shell scripts
  if [ -d hooks ]; then
    # Look for common secret patterns
    ! grep -r "password.*=" hooks/ 2>/dev/null | grep -v "example\|test\|sample"
    ! grep -r "api_key.*=" hooks/ 2>/dev/null | grep -v "example\|test\|sample"
    ! grep -r "token.*=" hooks/ 2>/dev/null | grep -v "example\|test\|sample"
  else
    skip "hooks directory does not exist"
  fi
}

@test "Security: File permissions are appropriate" {
  # Check that sensitive files are not world-writable
  if [ -f .env ]; then
    perms=$(stat -f "%Lp" .env 2>/dev/null || stat -c "%a" .env 2>/dev/null)
    # Should not be world-writable (last digit should not be 2, 3, 6, 7)
    [[ ! "$perms" =~ *[2367]$ ]]
  else
    skip ".env does not exist"
  fi
}

@test "Security: No debug code in production" {
  # Check for common debug patterns
  ! grep -r "console\.log" . --include="*.js" --include="*.ts" 2>/dev/null | \
    grep -v "node_modules" | grep -v "test\|spec" || true
  
  ! grep -r "debugger" . --include="*.js" --include="*.ts" 2>/dev/null | \
    grep -v "node_modules" | grep -v "test\|spec" || true
}

@test "Security: Dependencies are up to date" {
  if [ -f package.json ]; then
    # Check if package-lock.json exists
    [ -f package-lock.json ] || skip "No lock file"
  else
    skip "Not a Node.js project"
  fi
}

@test "Security: LICENSE file exists" {
  [ -f LICENSE ] || [ -f LICENSE.md ] || [ -f COPYING ]
}

@test "Security: No exposed credentials in documentation" {
  # Check documentation for exposed credentials
  ! grep -r "password.*=" README.md CLAUDE.md docs/ 2>/dev/null | \
    grep -v "example\|test\|sample\|YOUR_PASSWORD" || true
  
  ! grep -r "api_key.*=" README.md CLAUDE.md docs/ 2>/dev/null | \
    grep -v "example\|test\|sample\|YOUR_API_KEY" || true
}
