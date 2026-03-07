#!/bin/bash
# doc-scanner.sh — SessionStart hook for Claude Code CLI
# Scans the current project for .md documentation files at conversation start
# Outputs a structured index with previews so Claude has immediate doc awareness
#
# Install: Copy to ~/.claude/doc-scanner.sh and register as a SessionStart hook in settings.json

PROJECT_ROOT="$(pwd)"
PREVIEW_LINES=15
MAX_PREVIEW_FILES=25

# Skip scanning if we're in the home directory (not inside a project)
if [ "$PROJECT_ROOT" = "$HOME" ]; then
  exit 0
fi

# Find all .md files, pruning directories that never contain useful docs
MD_FILES=$(find "$PROJECT_ROOT" -maxdepth 6 \
  \( -name "node_modules" -o -name ".venv" -o -name "venv" -o -name "__pycache__" \
     -o -name ".git" -o -name "dist" -o -name "build" -o -name ".next" \
     -o -name "coverage" -o -name ".claude" -o -name "playwright-screenshots" \
     -o -name ".mypy_cache" -o -name ".pytest_cache" -o -name "htmlcov" \
     -o -name ".tox" -o -name "egg-info" \) -prune \
  -o -name "*.md" -print 2>/dev/null | sort)

# Separately scan .claude/agents/ and .claude/skills/ (we pruned .claude above to avoid internal files)
CLAUDE_AGENTS=$(find "$PROJECT_ROOT/.claude/agents" -maxdepth 1 -name "*.md" -print 2>/dev/null | sort)
CLAUDE_SKILLS=$(find "$PROJECT_ROOT/.claude/skills" -maxdepth 2 -name "*.md" -print 2>/dev/null | sort)

# Grab root CLAUDE.md if it exists (project-level, not global)
PROJECT_CLAUDE_MD=""
if [ -f "$PROJECT_ROOT/CLAUDE.md" ]; then
  PROJECT_CLAUDE_MD="$PROJECT_ROOT/CLAUDE.md"
fi

# Combine all findings, remove empty lines and duplicates
ALL_FILES=$(echo -e "$MD_FILES\n$CLAUDE_AGENTS\n$CLAUDE_SKILLS\n$PROJECT_CLAUDE_MD" | grep -v "^$" | sort -u)

FILE_COUNT=$(echo "$ALL_FILES" | grep -c "." 2>/dev/null)

if [ -z "$ALL_FILES" ] || [ "$FILE_COUNT" -eq 0 ]; then
  exit 0
fi

echo "Project Documentation Index"
echo "==========================="
echo "Found $FILE_COUNT documentation file(s) in: $PROJECT_ROOT"
echo ""
echo "Use this index to understand what docs exist before starting work."
echo "Read relevant docs fully when they relate to the user's task."
echo ""

COUNT=0
for file in $ALL_FILES; do
  # Skip empty lines
  [ -z "$file" ] && continue

  COUNT=$((COUNT + 1))
  REL_PATH="${file#$PROJECT_ROOT/}"

  if [ $COUNT -le $MAX_PREVIEW_FILES ]; then
    echo "--- $REL_PATH ---"
    head -n "$PREVIEW_LINES" "$file" 2>/dev/null
    TOTAL_LINES=$(wc -l < "$file" 2>/dev/null | tr -d ' ')
    if [ "$TOTAL_LINES" -gt "$PREVIEW_LINES" ]; then
      echo "  ... (+$((TOTAL_LINES - PREVIEW_LINES)) more lines)"
    fi
    echo ""
  else
    # Beyond preview limit — just show path with title line
    FIRST_LINE=$(head -n 1 "$file" 2>/dev/null | sed 's/^#* *//')
    echo "  $REL_PATH — $FIRST_LINE"
  fi
done

if [ $COUNT -gt $MAX_PREVIEW_FILES ]; then
  echo ""
  echo "(Previewed first $MAX_PREVIEW_FILES files. Remaining $((COUNT - MAX_PREVIEW_FILES)) listed as titles only.)"
fi
