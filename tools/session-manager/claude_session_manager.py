#!/usr/bin/env python3
"""
Claude Code CLI 会话管理器
功能：查看、导出、整理 Claude Code 会话记录
"""

import json
import os
import sys
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional

class ClaudeSessionManager:
    def __init__(self, claude_dir: str = None):
        claude_path = claude_dir or "~/.claude"
        self.claude_dir = Path(os.path.expanduser(claude_path)).expanduser().resolve()
        self.projects_dir = self.claude_dir / "projects"
        
        # 调试输出
        print(f"Claude 目录: {self.claude_dir}")
        print(f"项目目录: {self.projects_dir}")
        print(f"项目目录存在: {self.projects_dir.exists()}")
        
    def list_projects(self) -> List[Dict]:
        """列出所有项目和会话"""
        projects = []
        
        if not self.projects_dir.exists():
            return projects
        
        for project_dir in self.projects_dir.iterdir():
            if not project_dir.is_dir():
                continue
            
            # 解析项目名称
            project_name = self._parse_project_name(project_dir.name)
            
            # 统计会话
            jsonl_files = list(project_dir.glob("*.jsonl"))
            session_count = len(jsonl_files)
            total_size = sum(f.stat().st_size for f in jsonl_files)
            
            if session_count > 0:
                projects.append({
                    "name": project_name,
                    "path": str(project_dir),
                    "session_count": session_count,
                    "total_size": total_size,
                    "sessions": self._list_sessions(project_dir)
                })
        
        return sorted(projects, key=lambda x: x["session_count"], reverse=True)
    
    def _parse_project_name(self, encoded_name: str) -> str:
        """解析编码的项目名称"""
        # Claude Code 项目名格式: -Volumes-PS1008-Project-Name
        # 或者直接是项目名
        if not encoded_name.startswith("-"):
            return encoded_name
            
        parts = encoded_name.replace("-", "/", 1).split("/")  # 只替换第一个 -
        # 去掉第一个空元素（因为 - 开头会产生空元素）
        parts = [p for p in parts if p]
        
        if len(parts) > 1:
            return "/".join(parts[1:]) if parts[0] in ["Volumes", "Users"] else "/".join(parts)
        
        return encoded_name
    
    def _list_sessions(self, project_dir: Path) -> List[Dict]:
        """列出项目的所有会话"""
        sessions = []
        
        for jsonl_file in project_dir.glob("*.jsonl"):
            session_id = jsonl_file.stem
            file_size = jsonl_file.stat().st_size
            created_time = datetime.fromtimestamp(jsonl_file.stat().st_mtime)
            
            # 读取第一条消息获取主题
            subject = ""
            try:
                with open(jsonl_file, 'r') as f:
                    first_line = f.readline()
                    if first_line:
                        data = json.loads(first_line)
                        content = data.get("content", "")
                        subject = content[:50] + "..." if len(content) > 50 else content
            except:
                pass
            
            sessions.append({
                "id": session_id,
                "file": str(jsonl_file),
                "size": file_size,
                "created": created_time,
                "subject": subject
            })
        
        return sorted(sessions, key=lambda x: x["created"], reverse=True)
    
    def export_session_to_markdown(self, session_file: str, output_file: str = None):
        """导出单个会话为 Markdown"""
        session_path = Path(session_file)
        
        if not session_path.exists():
            print(f"错误: 会话文件不存在: {session_file}")
            return False
        
        messages = self._parse_jsonl(session_path)
        
        if not messages:
            print(f"警告: 会话文件为空或解析失败: {session_file}")
            return False
        
        # 生成输出文件名
        if output_file is None:
            output_file = session_path.with_suffix('.md').name
        
        # 提取会话元信息
        first_msg = messages[0] if messages else {}
        session_id = session_path.stem
        timestamp = first_msg.get('timestamp', '未知')
        
        # 生成 Markdown
        md_content = [
            f"# Claude Code 会话记录\n",
            f"**会话 ID**: `{session_id}`",
            f"**时间**: {timestamp}",
            f"**消息数**: {len(messages)}\n",
            "---\n",
            "## 会话内容\n"
        ]
        
        # 添加消息
        for i, msg in enumerate(messages):
            role = msg.get('role', 'unknown')
            content = msg.get('content', '')
            msg_time = msg.get('timestamp', '')
            
            md_content.append(f"### 消息 {i+1} [{role}]")
            if msg_time:
                md_content.append(f"\n**时间**: {msg_time}")
            md_content.append(f"\n{content}\n")
            md_content.append("---\n")
        
        # 写入文件
        output_path = Path(output_file)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write('\n'.join(md_content))
        
        print(f"✓ 导出成功: {output_path}")
        return True
    
    def _parse_jsonl(self, jsonl_file: Path) -> List[Dict]:
        """解析 JSONL 文件"""
        messages = []
        
        try:
            with open(jsonl_file, 'r', encoding='utf-8') as f:
                for line in f:
                    line = line.strip()
                    if not line:
                        continue
                    
                    try:
                        data = json.loads(line)
                        
                        # 提取关键字段
                        msg = {
                            'type': data.get('type', 'unknown'),
                            'timestamp': data.get('timestamp', ''),
                            'content': data.get('content', ''),
                            'role': data.get('role', 'assistant'),
                            'sessionId': data.get('sessionId', ''),
                        }
                        
                        # 只保留有内容的消息
                        if msg.get('content'):
                            messages.append(msg)
                    
                    except json.JSONDecodeError:
                        continue
        
        except Exception as e:
            print(f"错误: 读取文件失败 {jsonl_file}: {e}")
        
        return messages
    
    def export_all_sessions(self, output_dir: str = "./claude-exports"):
        """导出所有会话"""
        output_path = Path(output_dir)
        output_path.mkdir(parents=True, exist_ok=True)
        
        projects = self.list_projects()
        
        print(f"找到 {len(projects)} 个项目")
        print()
        
        total_exported = 0
        
        for project in projects:
            project_name = project['name'].replace('/', '-')
            project_output = output_path / project_name
            project_output.mkdir(exist_ok=True)
            
            print(f"项目: {project_name} ({project['session_count']} 个会话)")
            
            for session in project['sessions']:
                session_file = Path(session['file'])
                output_file = project_output / f"{session_file.stem}.md"
                
                if self.export_session_to_markdown(str(session_file), str(output_file)):
                    total_exported += 1
        
        print()
        print(f"导出完成! 总计 {total_exported} 个会话")
        print(f"输出目录: {output_path.absolute()}")
        
        # 生成 README
        self._generate_readme(output_path, projects)
        
        return True
    
    def _generate_readme(self, output_dir: Path, projects: List[Dict]):
        """生成 README.md"""
        readme_content = [
            "# Claude Code 会话存档\n",
            "本仓库包含 Claude Code CLI 的会话记录导出。\n",
            f"**导出时间**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n",
            "## 统计\n",
            f"- **总项目数**: {len(projects)}",
            f"- **总会话数**: {sum(p['session_count'] for p in projects)}\n",
            "## 项目列表\n"
        ]
        
        for project in projects:
            project_name = project['name'].replace('/', '-')
            session_count = project['session_count']
            readme_content.append(f"- **[{project_name}]({project_name}/)**: {session_count} 个会话\n")
        
        readme_path = output_dir / "README.md"
        with open(readme_path, 'w', encoding='utf-8') as f:
            f.write(''.join(readme_content))
        
        print(f"✓ 生成 README: {readme_path}")


def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='Claude Code CLI 会话管理器')
    parser.add_argument('command', choices=['list', 'export', 'export-all'], 
                        help='命令: list(列出会话), export(导出单个), export-all(导出全部)')
    parser.add_argument('--claude-dir', default='~/.claude', 
                        help='Claude Code 目录 (默认: ~/.claude)')
    parser.add_argument('--output', default='./claude-exports', 
                        help='导出输出目录 (默认: ./claude-exports)')
    parser.add_argument('--session', 
                        help='要导出的会话文件路径 (用于 export 命令)')
    
    args = parser.parse_args()
    
    manager = ClaudeSessionManager(args.claude_dir)
    
    if args.command == 'list':
        projects = manager.list_projects()
        
        print(f"=== Claude Code 项目列表 ===\n")
        print(f"总计 {len(projects)} 个项目\n")
        
        for i, project in enumerate(projects, 1):
            print(f"{i}. {project['name']}")
            print(f"   会话数: {project['session_count']}")
            print(f"   总大小: {project['total_size'] / 1024:.1f} KB")
            
            # 显示最近 5 个会话
            recent = project['sessions'][:5]
            for session in recent:
                print(f"   - {session['id'][:8]}... | {session['created'].strftime('%Y-%m-%d %H:%M')} | {session['subject']}")
            
            if project['session_count'] > 5:
                print(f"   ... 还有 {project['session_count'] - 5} 个会话")
            
            print()
    
    elif args.command == 'export':
        if not args.session:
            print("错误: 请使用 --session 指定要导出的会话文件")
            sys.exit(1)
        
        manager.export_session_to_markdown(args.session)
    
    elif args.command == 'export-all':
        manager.export_all_sessions(args.output)
        
        print("\n=== 提交到 GitHub ===")
        print(f"cd {args.output}")
        print("git init")
        print("git add .")
        print('git commit -m "Add Claude Code session exports"')
        print("gh repo create claude-conversations --public --source=. --push")


if __name__ == '__main__':
    main()
