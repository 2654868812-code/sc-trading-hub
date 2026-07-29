import openpyxl, sqlite3, json, re

# Load Excel
wb = openpyxl.load_workbook(r'D:\files\Tencent Files\2654868812\FileRecv\MobileFile\对照.xlsx')
ws = wb['Sheet1']
EXCEL_MAP = {}
for row in ws.iter_rows(min_row=2, values_only=True):
    en = str(row[1]).strip() if row[1] else ''
    zh = str(row[2]).strip() if row[2] else ''
    if en and zh and en != 'None' and zh != 'None':
        EXCEL_MAP[en] = zh

# Build short name map from comma-separated entries
SHORT_MAP = {}
for en, zh in EXCEL_MAP.items():
    if ',' in en and len(en) < 50:
        parts = [p.strip() for p in en.split(',')]
        zh_parts = [p.strip() for p in zh.split(',')]
        if len(zh_parts) == len(parts):
            for ep, zp in zip(parts, zh_parts):
                if ep not in SHORT_MAP: SHORT_MAP[ep] = zp
    if len(en) <= 30 and '\n' not in en:
        if en not in SHORT_MAP: SHORT_MAP[en] = zh

# Load DB
conn = sqlite3.connect('dev.db')
cur = conn.cursor()
cur.execute('SELECT id, name FROM Commodity ORDER BY name')
commodities = [{'id': r[0], 'name': r[1]} for r in cur.fetchall()]
cur.execute('SELECT id, name FROM Terminal ORDER BY name')
terminals = [{'id': r[0], 'name': r[1]} for r in cur.fetchall()]
conn.close()

# === COMMODITY MATCHING ===
def match_commodity(name):
    if name in EXCEL_MAP:
        return EXCEL_MAP[name]
    base = re.sub(r'\s*\(.*?\)', '', name).strip()
    bracket_match = re.search(r'\((.+?)\)', name)
    bracket_content = bracket_match.group(1) if bracket_match else None
    if base in EXCEL_MAP:
        zh_base = EXCEL_MAP[base]
        if bracket_content:
            raw_map = {'Raw': '粗制', 'Ore': '矿石', 'Pure': '纯'}
            bracket_zh = raw_map.get(bracket_content, bracket_content)
            return f"{zh_base}（{bracket_zh}）"
        return zh_base
    return name

commodity_map = {}
for c in commodities:
    commodity_map[c['name']] = match_commodity(c['name'])

# === TERMINAL MATCHING ===
CITY_MAP = {
    'Everus Harbor': '埃弗勒斯空间站', 'Baijini Point': '贝希尼角空间站',
    'Port Tressler': '特雷斯勒空间站', 'Seraphim': '塞拉芬',
    'Checkmate': '将死空间站', 'Orbituary': '讣告空间站',
    'Ruin Station': '废墟空间站', 'Grim HEX': '格林站',
    'Area18': '18区', 'Lorville': '罗维尔', 'New Babbage': '新巴贝奇',
    'Orison': '奥里森', 'Starlight Service': '星光服务站',
}
# Merge SHORT_MAP into CITY_MAP
CITY_MAP.update(SHORT_MAP)

def match_terminal(name):
    if name in EXCEL_MAP: return EXCEL_MAP[name]
    if name in SHORT_MAP: return SHORT_MAP[name]

    if name.startswith("Admin - "):
        base = name[8:]
        if base in CITY_MAP: return f"管理中心 - {CITY_MAP[base]}"
        # Lagrange points before generic substring match
        prefixes = {'ARC': '弧光', 'CRU': '十字军', 'HUR': '赫斯顿', 'MIC': '微科'}
        for prefix, zh_prefix in prefixes.items():
            if base.startswith(prefix+'-L'): return f"管理中心 - {base.replace(prefix, zh_prefix)}"
        for city_en, city_zh in sorted(CITY_MAP.items(), key=lambda x: -len(x[0])):
            if city_en in base: return f"管理中心 - {base.replace(city_en, city_zh)}"
        gmatch = re.match(r'(\w+) Gateway \((\w+)\)', base)
        if gmatch:
            gate_names = {'Nyx': '尼克斯', 'Pyro': '派罗', 'Stanton': '斯坦顿', 'Terra': '特拉'}
            return f"管理中心 - {gate_names.get(gmatch.group(1), gmatch.group(1))}星门 ({gate_names.get(gmatch.group(2), gmatch.group(2))})"
        return f"管理中心 - {base}"

    if "CBD" in name or "Central Business District" in name:
        result = name.replace("CBD - Central Business District", "中央商务区")
        for city_en, city_zh in CITY_MAP.items():
            if city_en in result: return result.replace(city_en, city_zh)
        return result

    result = name
    for city_en, city_zh in sorted(CITY_MAP.items(), key=lambda x: -len(x[0])):
        if city_en in result: result = result.replace(city_en, city_zh)
    return result

terminal_map = {}
for t in terminals:
    terminal_map[t['name']] = match_terminal(t['name'])

# Test: only terminals that exist in our DB
db_names = {t['name'] for t in terminals}
test_set = ['Admin - Everus Harbor', 'Admin - Area18', 'Admin - Lorville', 'Admin - New Babbage',
            'Admin - Orison', 'Admin - Grim HEX', 'CBD - Central Business District - Lorville',
            'Admin - ARC-L1', 'Admin - Nyx Gateway (Pyro)', 'Admin - Checkmate',
            'Admin - Port Tressler', 'Admin - Seraphim', 'Admin - Baijini Point',
            'Admin - Orbituary', 'Admin - Ruin Station']
for t in test_set:
    if t in terminal_map:
        print(f"  {t} -> {terminal_map[t]}")
    else:
        print(f"  {t} -> NOT IN DB")

ch = sum(1 for en, zh in commodity_map.items() if en != zh)
th = sum(1 for en, zh in terminal_map.items() if en != zh)
print(f"\nCommodities: {ch}/{len(commodity_map)} translated")
print(f"Terminals: {th}/{len(terminal_map)} translated")

# Save commodity-zh.ts
with open('src/lib/commodity-zh.ts', 'w', encoding='utf-8') as f:
    f.write('// Auto-generated from 对照.xlsx\n')
    f.write('const EN_TO_ZH: Record<string, string> = {\n')
    for en in sorted(commodity_map.keys()):
        zh = commodity_map[en].replace('"', "'")
        f.write(f'  {json.dumps(en, ensure_ascii=False)}: {json.dumps(zh, ensure_ascii=False)},\n')
    f.write('};\n\n')
    f.write('export function getZhName(enName: string): string { return EN_TO_ZH[enName] || enName; }\n\n')
    f.write('const KIND_TO_ZH: Record<string, string> = {\n')
    f.write('  "Agricultural": "农产品", "Alloy": "合金", "Ammunition": "弹药", "Animal": "动物制品",\n')
    f.write('  "Chemical": "化学品", "Commodity": "商品", "Crafting": "制造材料", "Drug": "药物",\n')
    f.write('  "Electronics": "电子产品", "Explosive": "爆炸物", "Food": "食品", "Fuel": "燃料",\n')
    f.write('  "Gas": "气体", "Halogen": "卤素", "Liquid": "液体", "Man-Made": "人造物",\n')
    f.write('  "Man-made": "人造物", "Medical": "医疗品", "Medicine": "药品", "Metal": "金属",\n')
    f.write('  "Mineral": "矿物", "Minteral": "矿物", "Natural": "天然物", "Non-Metal": "非金属",\n')
    f.write('  "Organic": "有机物", "Organics": "有机物", "Other": "其他", "Raw Materials": "原材料",\n')
    f.write('  "Scrap": "废料", "Seed": "种子", "Temporary": "临时品", "Vice": "违禁品",\n')
    f.write('  "Waste": "废料", "mineral": "矿物",\n')
    f.write('};\n\n')
    f.write('export function getZhKind(enKind: string | null): string {\n')
    f.write('  if (!enKind) return ""; return KIND_TO_ZH[enKind] || enKind;\n}\n')

# Save terminal-zh.ts
with open('src/lib/terminal-zh.ts', 'w', encoding='utf-8') as f:
    f.write('// Auto-generated from 对照.xlsx\n')
    f.write('const TERMINAL_EN_TO_ZH: Record<string, string> = {\n')
    for en in sorted(terminal_map.keys()):
        zh = terminal_map[en]
        f.write(f'  {json.dumps(en, ensure_ascii=False)}: {json.dumps(zh, ensure_ascii=False)},\n')
    f.write('};\n\n')
    f.write('export function getTerminalZh(enName: string): string { return TERMINAL_EN_TO_ZH[enName] || enName; }\n')

print("Files saved.")
