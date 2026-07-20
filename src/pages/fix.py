import sys

with open('Dashboard.tsx.backup', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Fix the import line: add Code to the lucide-react import
for i, line in enumerate(lines):
    if line.strip().startswith('import {') and 'lucide-react' in line:
        if 'Code' not in line:
            # Insert Code before the closing brace
            if line.strip().endswith('};'):
                new_line = line.rstrip()
                new_line = new_line.replace('}', 'Code }')
                lines[i] = new_line + '\n'
            else:
                # fallback: just add Code before the closing brace
                # We'll do a simple replacement: assume the pattern is exactly as expected
                # Replace '} from' with ', Code } from'
                lines[i] = line.replace('} from', ', Code } from')
        break

# Find the QUICK_LINKS block
start = -1
end = -1
for i, line in enumerate(lines):
    stripped = line.strip()
    if stripped.startswith('const QUICK_LINKS = ['):
        start = i
    if start != -1 and stripped == '];':
        end = i
        break

if start != -1 and end != -1:
    # Replace the block
    new_block = [
        'const QUICK_LINKS = [\n',
        '  { to: "/csat", label: "CSAT Practice", desc: "Daily MCQs", icon: Target, color: "text-green-400", bg: "bg-green-500/10" },\n',
        '  { to: "/sr", label: "Spaced Repetition", desc: "Smart review", icon: Zap, color: "text-blue-400", bg: "bg-blue-500/10" },\n',
        '  { to: "/upsc", label: "UPSC Lens", desc: "GS-curated feed", icon: Brain, color: "text-yellow-400", bg: "bg-yellow-500/10" },\n',
        '  { to: "/analytics", label: "Analytics", desc: "Progress & insights", icon: TrendingUp, color: "text-purple-400", bg: "bg-purple-500/10" },\n',
        '  { to: "/edtech", label: "EdTech Arch", desc: "Platform diagram", icon: Code, color: "text-blue-400", bg: "bg-blue-500/10" },\n',
        '];\n'
    ]
    lines = lines[:start] + new_block + lines[end+1:]

# Write back
with open('Dashboard.tsx', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print('Fixed Dashboard.tsx')
