#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'EOF'
Usage:
  ./scripts/sync-everything-claude-code.sh

Environment variables:
  ECC_VENDOR_REPO   Source git repository
                    default: https://github.com/affaan-m/everything-claude-code.git
  ECC_VENDOR_REF    Source branch, tag, or ref
                    default: main
  ECC_VENDOR_DIR    Target vendored directory
                    default: vendor/everything-claude-code
EOF
}

REPO_URL="${ECC_VENDOR_REPO:-https://github.com/affaan-m/everything-claude-code.git}"
REPO_REF="${ECC_VENDOR_REF:-main}"
TARGET_DIR="${ECC_VENDOR_DIR:-vendor/everything-claude-code}"

case "${1:-}" in
  -h|--help)
    usage
    exit 0
    ;;
esac

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  printf "Error: run this inside a git repository.\n" >&2
  exit 1
fi

ROOT_DIR="$(git rev-parse --show-toplevel)"
TARGET_PATH="${ROOT_DIR}/${TARGET_DIR}"
TEMP_DIR="$(mktemp -d)"
cleanup() {
  rm -rf "${TEMP_DIR}"
}
trap cleanup EXIT

printf "Cloning %s (%s)...\n" "${REPO_URL}" "${REPO_REF}"
git clone --depth 1 --branch "${REPO_REF}" "${REPO_URL}" "${TEMP_DIR}/repo"

SOURCE_COMMIT="$(git -C "${TEMP_DIR}/repo" rev-parse HEAD)"

printf "Refreshing %s...\n" "${TARGET_DIR}"
rm -rf "${TARGET_PATH}"
mkdir -p "${TARGET_PATH}"
git -C "${TEMP_DIR}/repo" archive --format=tar HEAD | tar -xf - -C "${TARGET_PATH}"

cat > "${TARGET_PATH}/.upstream-source.txt" <<EOF
repo=${REPO_URL}
ref=${REPO_REF}
commit=${SOURCE_COMMIT}
synced_at_utc=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
EOF

printf "Synced Everything Claude Code to %s at %s.\n" "${TARGET_DIR}" "${SOURCE_COMMIT}"
