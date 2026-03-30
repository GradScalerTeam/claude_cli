#!/bin/bash

###############################################################################
# Claude Code CLI 会话导出工具
# 功能：导出 Claude Code 会话记录为 Markdown 格式，便于分享到 GitHub
###############################################################################

set -e

# 配置
CLAUDE_DIR="$HOME/.claude"
OUTPUT_DIR="./claude-conversations"
REPO_NAME=${1:-"claude-conversations"}

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Claude Code 会话导出工具 ===${NC}"
echo ""

# 检查目录
if [ ! -d "$CLAUDE_DIR" ]; then
    echo -e "${RED}错误: Claude 目录不存在: $CLAUDE_DIR${NC}"
    exit 1
fi

# 创建输出目录
mkdir -p "$OUTPUT_DIR"

echo -e "${YELLOW}扫描 Claude Code 项目...${NC}"

# 查找所有项目的会话文件
PROJECT_DIRS=$(find "$CLAUDE_DIR/projects" -maxdepth 1 -type d ! -name "projects" 2>/dev/null)

if [ -z "$PROJECT_DIRS" ]; then
    echo -e "${RED}未找到任何项目会话${NC}"
    exit 1
fi

TOTAL_SESSIONS=0
TOTAL_EXPORTED=0

# 遍历每个项目
for PROJECT_DIR in $PROJECT_DIRS; do
    PROJECT_NAME=$(basename "$PROJECT_DIR" | sed 's/-Volumes-PS1008-//' | sed 's/-/\//g')
    echo ""
    echo -e "${GREEN}项目: $PROJECT_NAME${NC}"

    # 查找该项目下的所有 jsonl 文件
    JSONL_FILES=$(find "$PROJECT_DIR" -maxdepth 1 -name "*.jsonl" -type f 2>/dev/null)

    if [ -z "$JSONL_FILES" ]; then
        echo "  (无会话文件)"
        continue
    fi

    # 为该项目创建输出目录
    PROJECT_OUTPUT_DIR="$OUTPUT_DIR/$PROJECT_NAME"
    mkdir -p "$PROJECT_OUTPUT_DIR"

    # 处理每个 jsonl 文件
    for JSONL_FILE in $JSONL_FILES; do
        SESSION_ID=$(basename "$JSONL_FILE" .jsonl)
        TOTAL_SESSIONS=$((TOTAL_SESSIONS + 1))

        # 输出文件
        OUTPUT_FILE="$PROJECT_OUTPUT_DIR/${SESSION_ID}.md"

        # 检查是否已导出
        if [ -f "$OUTPUT_FILE" ]; then
            echo "  ✓ 已导出: $SESSION_ID"
            continue
        fi

        echo -e "  ${YELLOW}导出中...${NC} $SESSION_ID"

        # 提取会话信息
        FIRST_MSG=$(head -1 "$JSONL_FILE")
        TIMESTAMP=$(echo "$FIRST_MSG" | jq -r '.timestamp // "未知"' 2>/dev/null)
        CONTENT=$(echo "$FIRST_MSG" | jq -r '.content // ""' 2>/dev/null)

        # 生成 Markdown
        cat > "$OUTPUT_FILE" <<EOF
# Claude Code 会话记录

**会话 ID**: \`$SESSION_ID\`
**项目**: \`$PROJECT_NAME\`
**时间**: $TIMESTAMP

---

## 会话内容

EOF

        # 解析 jsonl 并提取对话
        {
            echo ""
            echo "## 消息记录"
            echo ""

            # 使用 jq 解析每一条消息
            while IFS= read -r line; do
                TYPE=$(echo "$line" | jq -r '.type // "unknown"' 2>/dev/null)
                TIMESTAMP=$(echo "$line" | jq -r '.timestamp // ""' 2>/dev/null)
                CONTENT=$(echo "$line" | jq -r '.content // ""' 2>/dev/null)
                ROLE=$(echo "$line" | jq -r '.role // "user"' 2>/dev/null)

                if [ "$TYPE" = "response" ] || [ ! -z "$CONTENT" ]; then
                    echo "### [$ROLE] $(date -j -f "%Y-%m-%dT%H:%M:%S%z" "$TIMESTAMP" "+%Y-%m-%d %H:%M:%S" 2>/dev/null || echo "$TIMESTAMP")"
                    echo ""
                    echo "$CONTENT"
                    echo ""
                    echo "---"
                    echo ""
                fi
            done < "$JSONL_FILE"
        } >> "$OUTPUT_FILE"

        TOTAL_EXPORTED=$((TOTAL_EXPORTED + 1))
        echo "  ✓ 完成: $SESSION_ID"
    done
done

echo ""
echo -e "${GREEN}=== 导出完成 ===${NC}"
echo "总会话数: $TOTAL_SESSIONS"
echo "本次导出: $TOTAL_EXPORTED"
echo "输出目录: $OUTPUT_DIR"

# 生成索引
echo ""
echo -e "${YELLOW}生成索引文件...${NC}"
cat > "$OUTPUT_DIR/README.md" <<EOF
# Claude Code 会话存档

本仓库包含 Claude Code CLI 的会话记录导出。

## 统计

- **总项目数**: $(find "$OUTPUT_DIR" -maxdepth 1 -type d ! -name "claude-conversations" | wc -l | xargs)
- **总会话数**: $TOTAL_SESSIONS
- **导出时间**: $(date "+%Y-%m-%d %H:%M:%S")

## 项目列表

EOF

# 添加每个项目的统计
for PROJECT_DIR in "$OUTPUT_DIR"/*/; do
    if [ -d "$PROJECT_DIR" ]; then
        PROJECT_NAME=$(basename "$PROJECT_DIR")
        SESSION_COUNT=$(find "$PROJECT_DIR" -name "*.md" ! -name "README.md" | wc -l | xargs)
        echo "- **[$PROJECT_NAME]($PROJECT_NAME)**: $SESSION_COUNT 个会话" >> "$OUTPUT_DIR/README.md"
    fi
done

echo ""
echo "✓ 索引文件已生成: $OUTPUT_DIR/README.md"

# 提供 Git 初始化建议
echo ""
echo -e "${YELLOW}=== 下一步: 提交到 GitHub ===${NC}"
echo ""
echo "1. 初始化 Git 仓库:"
echo "   cd $OUTPUT_DIR"
echo "   git init"
echo ""
echo "2. 添加 .gitignore:"
cat <<'GITIGNORE'
# Claude 会话导出
*.json
*.jsonl.backup
sessions/

# 但保留 markdown
!*.md
GITIGNORE

echo ""
echo "3. 提交文件:"
echo "   git add ."
echo "   git commit -m 'Add Claude Code session exports'"
echo ""
echo "4. 推送到 GitHub:"
echo "   gh repo create $REPO_NAME --public --source=. --remote=origin --push"
echo ""
echo "或手动推送:"
echo "   git remote add origin https://github.com/$(git config user.name)/$REPO_NAME.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo -e "${GREEN}完成！${NC}"
