import re
from pathlib import Path

path = Path(r"c:\Users\Marcilio\Downloads\Loading... (21_05_2026 04：19：31).html")
s = path.read_text(encoding="utf-8", errors="ignore")

start = s.find('srcdoc=&quot;')
if start == -1:
    start = s.find('srcdoc="')
    quote = '"'
else:
    quote = '&quot;'
    start += len('srcdoc=&quot;')

end = s.find('"></iframe>', start)
if end == -1:
    end = s.find('" ></iframe>', start)

doc = s[start:end]
doc = (
    doc.replace("&quot;", '"')
    .replace("&amp;", "&")
    .replace("&lt;", "<")
    .replace("&gt;", ">")
)

out = Path(__file__).parent / "extracted-hero-snippet.txt"
chunks = []

# Google fonts links
for m in re.finditer(r"https://fonts\.googleapis\.com[^\"'\\s]+", doc):
    chunks.append("GOOGLE: " + m.group(0)[:200])

# tailwind font classes in hero area
for m in re.finditer(r"font-[a-zA-Z0-9_-]+", doc):
    if m.group(0) in ("font-display", "font-body", "font-mono-label", "font-sans"):
        pass
classes = sorted(set(re.findall(r"font-(?:display|body|mono-label|sans)[^\s\"]*", doc)))
chunks.append("CLASSES: " + ", ".join(classes[:20]))

# font-family in style blocks (first 500k)
fams = sorted(set(re.findall(r'font-family:\s*["\']?([^;"\'\}]+)', doc[:800000])))
chunks.append("FAMILIES:\n" + "\n".join(fams[:40]))

# hero strings
for text in [
    "FOLIO",
    "CINEMATIC FOLIO",
    "Designing the",
    "invisible",
    "code & cinema",
    "Marcilio",
    "LISBON",
    "View selected work",
    "Start a collaboration",
    "Scroll to enter",
]:
    i = doc.find(text)
    if i >= 0:
        chunks.append(f"\n--- {text} ---\n" + doc[max(0, i - 100) : i + 200])

# .font-display css rule
for m in re.finditer(r"\.font-display[^{]*\{[^}]+\}", doc[:500000]):
    chunks.append("CSS display: " + m.group(0)[:300])
    break

for m in re.finditer(r"\.font-mono-label[^{]*\{[^}]+\}", doc[:500000]):
    chunks.append("CSS mono: " + m.group(0)[:300])
    break

for m in re.finditer(r"\.font-body[^{]*\{[^}]+\}", doc[:500000]):
    chunks.append("CSS body: " + m.group(0)[:300])
    break

out.write_text("\n".join(chunks), encoding="utf-8")
print("Wrote", out, "doc len", len(doc))
