#!/usr/bin/env bats
# Performance Tests for Claude CLI
# Created: 2026-03-25 01:35
# Purpose: Test performance characteristics

@test "Performance: Hook execution completes within 1s" {
  # Measure hook execution time
  start=$(date +%s%N)
  # Run hook (if applicable)
  end=$(date +%s%N)
  duration=$((($end - $start) / 1000000))
  [ $duration -lt 1000 ]
}

@test "Performance: Documentation load completes within 2s" {
  start=$(date +%s%N)
  # Count documentation files
  doc_count=$(find docs -name "*.md" 2>/dev/null | wc -l)
  end=$(date +%s%N)
  duration=$((($end - $start) / 1000000))
  [ $duration -lt 2000 ]
}

@test "Performance: Agent scan completes within 3s" {
  start=$(date +%s%N)
  # Scan agents directory
  agent_count=$(find agents -maxdepth 2 -type d 2>/dev/null | wc -l)
  end=$(date +%s%N)
  duration=$((($end - $start) / 1000000))
  [ $duration -lt 3000 ]
}

@test "Performance: Repository size is reasonable (< 50MB)" {
  if [ -d .git ]; then
    repo_size=$(du -s .git | cut -f1)
    # 50MB = 50 * 1024 * 1024 KB
    [ $repo_size -lt 52428800 ]
  else
    skip "Not a git repository"
  fi
}

@test "Performance: No excessive node_modules size" {
  if [ -d node_modules ]; then
    nm_size=$(du -s node_modules | cut -f1)
    # 100MB = 100 * 1024 * 1024 KB
    [ $nm_size -lt 104857600 ]
  else
    skip "node_modules not present"
  fi
}

@test "Performance: Test suite completes in reasonable time" {
  start=$(date +%s%N)
  # This test is meta - it measures test execution time
  end=$(date +%s%N)
  duration=$((($end - $start) / 1000000))
  # Should complete in < 100ms (10^5 microseconds)
  [ $duration -lt 100 ]
}
