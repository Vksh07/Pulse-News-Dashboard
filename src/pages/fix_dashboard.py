import sys

file_path = "Dashboard.tsx.backup"
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# 1. Add Code to the lucide-react import line
for i, line in enumerate(lines):
    if line.strip().startswith("import {") and "lucide-react" in line:
        # We want to add Code before the closing brace
        if "Code" not in line:
            # Insert Code before the closing brace
            # Find the position of the closing brace
            # Simple approach: replace the line with one that has Code added
            # Assuming the format is exactly as in the backup
            # We'll do a simple string replacement
            if line.strip().endswith("};"):
                # This is the line: import { RefreshCw, TrendingUp, Target, Zap, Brain, Sparkles, Settings } from 'lucide-react';
                new_line = line.rstrip()
                # Insert Code before the last } and before the semicolon
                new_line = new_line.replace("}", "Code }")
                lines[i] = new_line + "\n"
            else:
                # Fallback: just append Code before the closing brace
                # This is more robust if there are variations
                # We'll split by spaces and rebuild? Not now.
                pass
        break

# 2. Replace the QUICK_LINKS block
# Find the start and end of the QUICK_LINKS block
start = -1
end = -1
for i, line in enumerate(lines):
    if line.strip().startswith("const QUICK_LINKS = ["):
        start = i
    if start != -1 and line.strip() == "];":
        end = i
        break

if start != -1 and end != -1:
    # Replace lines[start:end+1] with the new block
    new_block = [
        "const QUICK_LINKS = [\n",
        "  { to: \"/csat\", label: \"CSAT Practice\", desc: \"Daily MCQs\", icon: Target, color: \"text-green-400\", bg: \"bg-green-500/10\" },\n",
        "  { to: \"/sr\", label: \"Spaced Repetition\", desc: \"Smart review\", icon: Zap, color: \"text-blue-400\", bg: \"bg-blue-500/10\" },\n",
        "  { to: \"/upsc\", label: \"UPSC Lens\", desc: \"GS-curated feed\", icon: Brain, color: \"text-yellow-400\", bg: \"bg-yellow-500/10\" },\n",
        "  { to: \"/analytics\", label: \"Analytics\", desc: \"Progress & insights\", icon: TrendingUp, color: \"text-purple-400\", bg: \"bg-purple-500/10\" },\n",
        "  { to: \"/edtech\", label: \"EdTech Arch\", desc: \"Platform diagram\", icon: Code, color: \"text-blue-400\", bg: \"bg-blue-500/10\" },\n",
        "];\n"
    ]
    # Replace the lines
    lines = lines[:start] + new_block + lines[end+1:]

# Write back
with open("Dashboard.tsx", 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("Fixed Dashboard.tsx")
