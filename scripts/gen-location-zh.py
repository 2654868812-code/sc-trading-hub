import openpyxl, sqlite3, json, re

# Load location Excel
wb = openpyxl.load_workbook(r'D:\workspace\地名对照.xlsx')
ws = wb['Sheet1']
LOC_MAP = {}
for row in ws.iter_rows(min_row=2, values_only=True):
    en = str(row[0]).strip() if row[0] else ''
    zh = str(row[1]).strip() if row[1] else ''
    if en and zh and en != 'None' and zh != 'None':
        LOC_MAP[en] = zh

# Build reverse index: for each DB location, find best match in LOC_MAP
def find_zh(name):
    """Find Chinese translation for a location name using multiple strategies."""
    if not name: return name
    if name in LOC_MAP: return LOC_MAP[name]

    # Strategy 1: For "XXX-LN Some Station Name" pattern, extract prefix + station name
    m = re.match(r'^([A-Z]+)-L(\d+)\s+(.+)$', name)
    if m:
        prefix = m.group(1)
        lnum = m.group(2)
        station_name = m.group(3)
        PREFIX_MAP = {'ARC': '弧光', 'CRU': '十字军', 'HUR': '赫斯顿', 'MIC': '微科'}
        zh_prefix = PREFIX_MAP.get(prefix, prefix)
        # Look for station_name translation
        zh_station = station_name
        if station_name in LOC_MAP:
            zh_station = LOC_MAP[station_name]
        else:
            for en, zh in LOC_MAP.items():
                if en.startswith(station_name + ' at '):
                    zh_match = re.match(r'^位于[^的]+的(.+)$', zh)
                    if zh_match: zh_station = zh_match.group(1)
                    else: zh_station = zh.split('的')[-1] if '的' in zh else zh
                    break
        # Clean: remove leading "LN拉格朗日点的" from zh_station
        zh_station = re.sub(r'^L\d+拉格朗日点的', '', zh_station)
        return f'{zh_prefix}-L{lnum} {zh_station}'

    # Strategy 2: For gateway names like "X Gateway (Y)"
    m = re.match(r'^(.+?)\s+Gateway\s+\((.+?)\)$', name)
    if m:
        gate = m.group(1)
        loc = m.group(2)
        zh_gate = LOC_MAP.get(gate + ' Gateway', gate)
        zh_loc = LOC_MAP.get(loc, loc)
        return f"{zh_gate} ({zh_loc})"

    # Strategy 3: Check if any LOC_MAP key is a substring
    for en_key in sorted(LOC_MAP.keys(), key=lambda x: -len(x[0])):
        if len(en_key) >= 5 and en_key in name:
            return name.replace(en_key, LOC_MAP[en_key])

    # Strategy 4: Check if the name is a substring of any LOC_MAP key
    for en_key in sorted(LOC_MAP.keys(), key=lambda x: -len(x[0])):
        if len(name) >= 5 and name.lower() in en_key.lower():
            zh = LOC_MAP[en_key]
            # Try extracting just the name part from a long description
            if ' at ' in en_key or ' in ' in en_key or ' on ' in en_key:
                # The English name appears as substring of a description
                idx = en_key.lower().index(name.lower())
                if idx > 0:
                    continue  # name is embedded mid-sentence, skip
            return zh

    return name

# Manual overrides for names not in Excel
MANUAL = {
    'Area 18': '18区',
    'Nyx': '尼克斯',
    'Pyro': '派罗',
    'Stanton': '斯坦顿',
}

# Load DB locations
conn = sqlite3.connect('dev.db')
cur = conn.cursor()
cur.execute('SELECT DISTINCT cityName FROM Terminal WHERE cityName IS NOT NULL')
cities = [r[0] for r in cur.fetchall()]
cur.execute('SELECT DISTINCT spaceStationName FROM Terminal WHERE spaceStationName IS NOT NULL')
stations = [r[0] for r in cur.fetchall()]
cur.execute('SELECT DISTINCT starSystemName FROM Terminal WHERE starSystemName IS NOT NULL')
systems = [r[0] for r in cur.fetchall()]
conn.close()

all_names = set(cities + stations + systems)
location_map = {}
for name in sorted(all_names):
    result = MANUAL.get(name) or find_zh(name)
    # Clean up: remove double "Station" or extra artifacts
    result = re.sub(r'(\S+) Station$', r'\1', result)
    location_map[name] = result

# Test
tests = ['Area 18', 'Orison', 'Everus Harbor', 'ARC-L1 Wide Forest Station',
         'CRU-L1 Ambitious Dream Station', 'HUR-L1 Green Glade Station',
         'MIC-L1 Shallow Frontier Station', 'Checkmate Station', 'Stanton', 'Pyro',
         'Terra Gateway (Stanton)', 'Stanton Gateway (Pyro)', 'Ruin Station',
         'Baijini Point', 'Port Tressler', 'Orbituary']
print("Location matching:")
for t in tests:
    print(f"  {t} -> {location_map.get(t, 'NOT IN SET')}")

unmatched = [en for en, zh in location_map.items() if en == zh]
print(f"\nUnmatched ({len(unmatched)}): {unmatched}")

# Save
with open('src/lib/location-zh.ts', 'w', encoding='utf-8') as f:
    f.write('// Auto-generated from 地名对照.xlsx\n')
    f.write('const LOCATION_EN_TO_ZH: Record<string, string> = {\n')
    for en in sorted(location_map.keys()):
        zh = location_map[en]
        f.write(f'  {json.dumps(en, ensure_ascii=False)}: {json.dumps(zh, ensure_ascii=False)},\n')
    f.write('};\n\n')
    f.write('export function getLocationZh(enName: string | null): string {\n')
    f.write('  if (!enName) return "";\n')
    f.write('  return LOCATION_EN_TO_ZH[enName] || enName;\n}\n')

print("Saved src/lib/location-zh.ts")
