
"""
Lightweight site-outline scraper.
- Respects robots.txt (disallows crawling disallowed paths)
- Slow rate (1 req/sec)
- Captures URL, <title>, and meta description only
- Usage: python scrape_outline.py https://www.precisionplanting.com/
"""
import sys, time, requests, re
from urllib.parse import urljoin, urlparse
from bs4 import BeautifulSoup

SEEN=set()
ALLOWED=set()
DISALLOWED=set()

def parse_robots(base):
    robots_url = urljoin(base, "/robots.txt")
    try:
        r = requests.get(robots_url, timeout=10)
        rules=r.text.splitlines()
        for line in rules:
            line=line.strip()
            if not line or line.startswith("#"): 
                continue
            if line.lower().startswith("disallow:"):
                DISALLOWED.add(line.split(":",1)[1].strip())
            if line.lower().startswith("allow:"):
                ALLOWED.add(line.split(":",1)[1].strip())
    except Exception:
        pass

def is_allowed(path):
    # Basic allow/disallow check
    for d in DISALLOWED:
        if path.startswith(d):
            # check explicit allows
            for a in ALLOWED:
                if path.startswith(a):
                    return True
            return False
    return True

def same_host(base, url):
    return urlparse(base).netloc == urlparse(url).netloc

def extract(base):
    out = []
    queue = [base]
    parse_robots(base)
    while queue:
        url = queue.pop(0)
        if url in SEEN: 
            continue
        SEEN.add(url)
        path = urlparse(url).path or "/"
        if not is_allowed(path):
            continue
        try:
            r = requests.get(url, timeout=15, headers={"User-Agent":"ResellerOutlineBot/1.0"})
            if "text/html" not in r.headers.get("Content-Type",""):
                continue
            soup = BeautifulSoup(r.text, "html.parser")
            title = (soup.title.string.strip() if soup.title and soup.title.string else "")
            desc = ""
            m = soup.find("meta", attrs={"name":"description"})
            if m and m.get("content"):
                desc = m["content"].strip()
            out.append({"url": url, "title": title, "description": desc})
            # enqueue internal links (cap to 200)
            for a in soup.find_all("a", href=True):
                nxt = urljoin(url, a["href"])
                if same_host(base, nxt):
                    if nxt.startswith(base) and len(SEEN) + len(queue) < 200:
                        queue.append(nxt.split("#")[0])
            time.sleep(1.0)
        except Exception:
            continue
    return out

def main():
    base = sys.argv[1] if len(sys.argv) > 1 else "https://www.precisionplanting.com/"
    rows = extract(base)
    import csv
    with open("site_outline.csv","w",newline="",encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=["url","title","description"])
        w.writeheader()
        w.writerows(rows)
    print(f"Wrote {len(rows)} rows to site_outline.csv")

if __name__ == "__main__":
    main()
