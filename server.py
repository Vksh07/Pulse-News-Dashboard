#!/usr/bin/env python3
"""Dashboard backend: 2hr window + 5min rescans + dedup + live auto-refresh."""

import json
import os
import re
import subprocess
import threading
import time
import urllib.parse
import urllib.request
from datetime import datetime, timedelta, timezone
import http.server
import mimetypes
import socketserver
import feedparser

SEARXNG_URL = os.environ.get("SEARXNG_URL", "http://localhost:8080")

mimetypes.add_type("application/javascript", ".js")
mimetypes.add_type("text/css", ".css")
mimetypes.add_type("text/html", ".html")
mimetypes.add_type("application/wasm", ".wasm")
mimetypes.add_type("application/manifest+json", ".webmanifest")
mimetypes.add_type("image/svg+xml", ".svg")
mimetypes.add_type("font/woff2", ".woff2")
CACHE_DIR = os.path.join(os.path.dirname(__file__), "cache")
DATA_FILE = os.path.join(CACHE_DIR, "articles.json")
FEEDS_CONFIG_FILE = os.path.join(CACHE_DIR, 'feeds_config.json')
PORT = int(os.environ.get("PORT", "18925"))
RESCAN_SECONDS = 420
WINDOW_HOURS = 24
BREAKING_PICK_SECONDS = 480
BREAKING_WINDOW_MINUTES = 10
BREAKING_LIMIT = 15
BREAKING_WINDOW_MINUTES = 10

# India sports keywords for national_sports RSS filter
INDIA_SPORTS_KEYWORDS = {
    'india', 'indian', 'bcci', 'ipl', 'ranji', 'asian games',
    'commonwealth games', 'pro kabaddi', 'isl', 'i-league',
    'pkl', 'hockey india', 'south asia',
    'virat', 'rohit', 'dhoni', 'kohli', 'bumrah', 'pant', 'gill',
    'suryakumar', 'hardik', 'rahul', 'sharma', 'ashwin', 'jadeja',
    'iyer', 'shami', 'siraj', 'india vs', "india's", 'indians',
    'neeraj chopra', 'p v sindhu', 'saina nehwal',
    'mirabai chan', 'nikhat zareen',
}

# Negative keywords - reject US/World sports content
NON_INDIA_SPORTS_KEYWORDS = {
    'nba', 'nfl', 'mlb', 'nhl', 'ncaa', 'college world series',
    'world cup', 'fifa', 'uefa', 'champions league', 'premier league',
    'la liga', 'bundesliga', 'serie a', 'ligue 1',
    'knicks', 'lakers', 'celtics', 'warriors', 'yankees', 'red sox', 'dodgers',
    'patriots', 'cowboys', 'packers', 'broncos', 'chiefs', 'bills',
    'real madrid', 'barcelona', 'manchester united', 'liverpool', 'chelsea', 'arsenal',
    'psg', 'bayern', 'juventus', 'inter milan', 'ac milan',
    'formula 1', 'f1', 'motogp', 'nascar', 'indycar',
    'wimbledon', 'us open', 'australian open', 'french open', 'roland garros',
    'pga tour', 'masters', 'ryder cup',
    'ny knicks', 'new york knicks', 'nyc', 'manhattan',
    'super bowl', 'playoffs', 'finals', 'championship game',
    'draft', 'free agency', 'trade deadline',
    'espn', 'reuters', 'bbc sport', 'sportskeeda', 'cricbuzz',  # these sources often have mixed content
}

def _is_india_sports(article):
    text = ((article.get('title') or '') + ' ' + (article.get('snippet') or '')).lower()
    # Reject if contains non-India sports terms
    if any(kw in text for kw in NON_INDIA_SPORTS_KEYWORDS):
        return False
    # Must contain at least one India sports keyword
    return any(kw in text for kw in INDIA_SPORTS_KEYWORDS)


BREAKING_PICK_SECONDS = 480
BREAKING_SLIDE_SECONDS = 60



os.makedirs(CACHE_DIR, exist_ok=True)

_now = datetime.now
UTC_NOW = lambda: datetime.now(timezone.utc)

def iso(dt):
    if dt is None:
        return None
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.isoformat()

def parse_dt(value):
    if not value:
        return None
    value = value.strip()
    if not value or value.lower() in {"none", "null"}:
        return None
    for fmt in (
        "%Y-%m-%dT%H:%M:%S%z",
        "%Y-%m-%dT%H:%M:%SZ",
        "%Y-%m-%dT%H:%M:%S.%f%z",
        "%Y-%m-%dT%H:%M:%S.%fZ",
        "%a, %d %b %Y %H:%M:%S %z",
    ):
        try:
            dt = datetime.strptime(value, fmt)
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=timezone.utc)
            return dt
        except ValueError:
            continue
    return None

_REASONABLE = lambda dt: dt is not None and 2020 <= dt.year <= 2030

def _normalize_title(title: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", (title or "").lower()).strip()

def _article_key(article):
    url = (article.get("url") or article.get("link") or "").strip()
    title = _normalize_title(article.get("title") or article.get("headline") or "")
    return url or title

def _clean_article(article, cutoff):
    url = (article.get("url") or article.get("link") or "").strip()
    title = _normalize_title(article.get("title") or article.get("headline") or "")
    if not url and not title:
        return None
    dt = (
        parse_dt(article.get("published"))
        or parse_dt(article.get("updated"))
        or parse_dt(article.get("created"))
    )
    if dt is None:
        dt = UTC_NOW()
    if not _REASONABLE(dt):
        return None
    if dt < cutoff:
        return None
    out = dict(article)
    out["url"] = url
    out["title"] = (article.get("title") or article.get("headline") or "").strip()
    out["published"] = iso(dt)
    out["published_dt"] = dt.isoformat()
    return out

def _get_active_topics_for_api():
    config = _load_feeds_config()
    return config.get('topics', DEFAULT_TOPICS[:])

def _get_active_rss_feeds_for_api():
    config = _load_feeds_config()
    return config.get('rss_feeds', DEFAULT_RSS_FEEDS[:])

def load_articles() -> list[dict]:
    if not os.path.exists(DATA_FILE):
        return []
    try:
        with open(DATA_FILE, "r", encoding="utf-8") as fh:
            data = json.load(fh)
        if isinstance(data, dict):
            return data.get("articles") or []
        if isinstance(data, list):
            return data
    except Exception:
        pass
    return []

def save_articles(articles: list[dict]) -> None:
    tmp = DATA_FILE + ".tmp"
    with open(tmp, "w", encoding="utf-8") as fh:
        json.dump({"articles": articles, "updatedAt": iso(UTC_NOW())}, fh, ensure_ascii=False)
    os.replace(tmp, DATA_FILE)

def prune_to_window(articles: list[dict]) -> list[dict]:
    now = UTC_NOW()
    cutoff = now - timedelta(hours=WINDOW_HOURS)
    pruned = []
    seen = set()
    for article in articles:
        cleaned = _clean_article(article, cutoff)
        if cleaned is None:
            continue
        key = _article_key(cleaned)
        if not key or key in seen:
            continue
        seen.add(key)
        pruned.append(cleaned)
    pruned.sort(key=lambda x: x.get("published") or "", reverse=True)
    return pruned

def searxng_search(query: str, time_range: str = "day", max_results: int = 30):
    params = urllib.parse.urlencode({
        "q": query,
        "format": "json",
        "categories": "news",
        "language": "en",
        "time_range": time_range,
        "safesearch": "1",
    })
    url = f"{SEARXNG_URL.rstrip('/')}/search?{params}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except Exception as exc:
        print(f"[searxng] query={query!r} failed: {exc}")
        return []
    out = []
    for item in data.get("results", [])[:max_results]:
        pub = item.get("publishedDate") or item.get("published") or item.get("timestamp") or ""
        out.append({
            "title": (item.get("title") or "").strip(),
            "url": (item.get("url") or "").strip(),
            "source": (item.get("engine") or "news").strip(),
            "published": pub,
            "snippet": (item.get("content") or item.get("description") or "").strip()[:500],
            "fetchSource": "searxng",
        })
    return out

def enrich_with_scrapling(article: dict) -> dict:
    url = article.get("url", "")
    if not url:
        return article
    try:
        out = subprocess.check_output(
            ["mcporter", "call", "ScraplingServer.get",
             f"url={url}", "output_format=text",
             "css_selector=article,main,.post-content,.entry-content,.story-content"],
            stderr=subprocess.STDOUT,
            timeout=25,
        )
        text = out.decode("utf-8", errors="replace").strip()[:1200]
        if text:
            article.setdefault("content", text)
    except Exception as exc:
        article.setdefault("content", "")
        article.setdefault("enrichError", str(exc)[:120])
    return article

DEFAULT_RSS_FEEDS = [
    {"id": "pib", "url": "https://pib.gov.in/rss.aspx", "enabled": True},
    {"id": "thehindu_national", "url": "https://www.thehindu.com/news/national/feeder/default.rss", "enabled": True},
    {"id": "indianexpress_india", "url": "https://indianexpress.com/section/india/feed/", "enabled": True},
    {"id": "indianexpress_politics", "url": "https://indianexpress.com/section/politics/feed/", "enabled": True},
    {"id": "indianexpress_business", "url": "https://indianexpress.com/section/business/feed/", "enabled": True},
    {"id": "indianexpress_world", "url": "https://indianexpress.com/section/world/feed/", "enabled": True},
    {"id": "indianexpress_explained", "url": "https://indianexpress.com/section/explained/feed/", "enabled": True},
    {"id": "thehindu_tn", "url": "https://www.thehindu.com/news/national/tamil-nadu/feeder/default.rss", "enabled": True},
    {"id": "thehindu_ap", "url": "https://www.thehindu.com/news/national/andhra-pradesh/feeder/default.rss", "enabled": True},
    {"id": "reuters_world", "url": "https://www.reuters.com/world/feed/", "enabled": True},
    {"id": "thehindu_sports", "url": "https://www.thehindu.com/sport/?service=rss", "enabled": True},
    {"id": "indianexpress_sports", "url": "https://indianexpress.com/section/sports/feed/", "enabled": True},
    {"id": "reuters_sports", "url": "https://www.reuters.com/world/sports/feed/", "enabled": True},
    {"id": "espn_world", "url": "https://www.espn.com/espn/rss/news", "enabled": True},
    {"id": "bbc_sport", "url": "https://feeds.bbci.co.uk/sport/rss.xml", "enabled": True},
    {"id": "sportskeeda", "url": "https://www.sportskeeda.com/feed", "enabled": True},
    {"id": "cricbuzz", "url": "https://www.cricbuzz.com/rss-feed", "enabled": True},
    {"id": "thehindubusinessline", "url": "https://www.thehindubusinessline.com/feeder/default.rss", "enabled": True},
]

DEFAULT_TOPICS = [
    {"id": "india", "label": "India", "query": "India breaking news", "enabled": True},
    {"id": "tamilnadu", "label": "Tamil Nadu", "query": "Tamil Nadu breaking news", "enabled": True},
    {"id": "andhra", "label": "Andhra Pradesh", "query": "Andhra Pradesh breaking news", "enabled": True},
    {"id": "world", "label": "International", "query": "international breaking news", "enabled": True},
    {"id": "national_sports", "label": "National Sports", "query": "India cricket hockey kabaddi badminton wrestling boxing athletics breaking news BCCI IPL Ranji Trophy", "enabled": True},
    {"id": "international_sports", "label": "International Sports", "query": "international sports breaking news", "enabled": True},
    {"id": "finance", "label": "Finance & Economy", "query": "finance economy business market India news", "enabled": True},
    {"id": "earnings", "label": "Earning Opportunities", "query": "online earning freelancing remote work India gig economy", "enabled": True},
]

def _load_feeds_config():
    """Load user feed config, merge with defaults."""
    config = {"rss_feeds": DEFAULT_RSS_FEEDS[:], "topics": DEFAULT_TOPICS[:]}
    if not os.path.exists(FEEDS_CONFIG_FILE):
        return config
    try:
        with open(FEEDS_CONFIG_FILE, 'r', encoding='utf-8') as f:
            user_config = json.load(f)
        # Merge RSS feeds: replace defaults with user overrides by id
        user_rss = {f['id']: f for f in user_config.get('rss_feeds', [])}
        merged_rss = []
        for feed in DEFAULT_RSS_FEEDS:
            if feed['id'] in user_rss:
                merged_rss.append(user_rss[feed['id']])
            else:
                merged_rss.append(feed)
        # Add user-added feeds not in defaults
        default_ids = {f['id'] for f in DEFAULT_RSS_FEEDS}
        for feed in user_config.get('rss_feeds', []):
            if feed['id'] not in default_ids:
                merged_rss.append(feed)
        config['rss_feeds'] = merged_rss
        # Same for topics
        user_topics = {t['id']: t for t in user_config.get('topics', [])}
        merged_topics = []
        for topic in DEFAULT_TOPICS:
            if topic['id'] in user_topics:
                merged_topics.append(user_topics[topic['id']])
            else:
                merged_topics.append(topic)
        default_topic_ids = {t['id'] for t in DEFAULT_TOPICS}
        for topic in user_config.get('topics', []):
            if topic['id'] not in default_topic_ids:
                merged_topics.append(topic)
        config['topics'] = merged_topics
    except Exception:
        pass
    return config

def _save_feeds_config(rss_feeds=None, topics=None):
    config = {}
    if os.path.exists(FEEDS_CONFIG_FILE):
        try:
            with open(FEEDS_CONFIG_FILE, 'r', encoding='utf-8') as f:
                config = json.load(f)
        except Exception:
            config = {}
    if rss_feeds is not None:
        config['rss_feeds'] = rss_feeds
    if topics is not None:
        config['topics'] = topics
    tmp = FEEDS_CONFIG_FILE + '.tmp'
    with open(tmp, 'w', encoding='utf-8') as f:
        json.dump(config, f, ensure_ascii=False)
    os.replace(tmp, FEEDS_CONFIG_FILE)

RSS_FEEDS = DEFAULT_RSS_FEEDS[:]
TOPICS = DEFAULT_TOPICS[:]

def poll_rss() -> list[dict]:
    articles = []
    config = _load_feeds_config()
    active_feeds = [f for f in config.get('rss_feeds', []) if f.get('enabled', True)]
    # Map RSS feed IDs to frontend topics
    feed_topic_map = {
        'pib': 'india',
        'thehindu_national': 'india',
        'indianexpress_india': 'india',
        'indianexpress_politics': 'india',
        'indianexpress_business': 'finance',
        'indianexpress_world': 'world',
        'indianexpress_explained': 'india',
        'thehindu_tn': 'tamilnadu',
        'thehindu_ap': 'andhra',
        'reuters_world': 'world',
        'thehindu_sports': 'national_sports',
        'indianexpress_sports': 'national_sports',
        'reuters_sports': 'international_sports',
        'espn_world': 'international_sports',
        'bbc_sport': 'international_sports',
        'sportskeeda': 'national_sports',
        'cricbuzz': 'national_sports',
        'thehindubusinessline': 'earnings',
    }
    for feed in active_feeds:
        name = feed['id']
        url = feed['url']
        topic = feed_topic_map.get(name, 'india')
        try:
            parsed = feedparser.parse(url)
            for entry in parsed.entries[:25]:
                link = (entry.get("link") or "").strip()
                if not link:
                    continue
                published = None
                for key in ("published", "updated", "created"):
                    if entry.get(key):
                        published = entry[key]
                        break
                article = {
                    "title": (entry.get("title") or "").strip(),
                    "url": link,
                    "source": name,
                    "topic": topic,
                    "published": published,
                    "snippet": (entry.get("summary") or entry.get("description") or "").strip()[:500],
                    "fetchSource": "rss",
                }
                # Filter national_sports RSS articles for India relevance
                if topic == 'national_sports' and not _is_india_sports(article):
                    continue
                articles.append(article)
        except Exception as exc:
            print(f"[rss] {name} error: {exc}")
    print(f"[rss] done articles={len(articles)}")
    return articles

def run_scan() -> dict:
    print(f"[scan] start {UTC_NOW().isoformat()}")
    config = _load_feeds_config()
    active_topics = [t for t in config.get('topics', []) if t.get('enabled', True)]
    new_articles = []
    for topic in active_topics:
        hits = searxng_search(topic["query"], time_range="day", max_results=25)
        print(f"[scan] topic={topic['id']} hits={len(hits)}")
        for hit in hits:
            hit["topic"] = topic["id"]
            hit["topicLabel"] = topic["label"]
            # Apply India sports filter for national_sports topic
            if topic["id"] == "national_sports" and not _is_india_sports(hit):
                continue
            new_articles.append(hit)
    for article in new_articles[:12]:
        enrich_with_scrapling(article)
    rss_articles = poll_rss()
    articles = prune_to_window(load_articles())
    cutoff = UTC_NOW() - timedelta(hours=WINDOW_HOURS)
    combined = [a for a in new_articles + rss_articles if a.get("url") or a.get("title")]
    seen = {_article_key(a) for a in articles}
    for article in combined:
        cleaned = _clean_article(article, cutoff)
        if cleaned is None:
            continue
        key = _article_key(cleaned)
        if not key or key in seen:
            continue
        seen.add(key)
        articles.append(cleaned)
    articles = prune_to_window(articles)
    save_articles(articles)
    print(f"[scan] done articles={len(articles)}")
    return {"articles": articles, "updatedAt": iso(UTC_NOW())}

def _get_upsc_tags(article):
    """Extract UPSC syllabus tags and GS paper mapping from article."""
    title = article.get('title') or ''
    snippet = article.get('snippet') or ''
    text = (title + ' ' + snippet).lower()
    found = set()
    papers = set()
    for term in _SYLLABUS_TERMS:
        if term in text:
            found.add(term)
            gs = _GS_MAP.get(term)
            if gs:
                papers.add(gs)
    return {
        'tags': sorted(found),
        'papers': sorted(papers),
        'score': len(found),
    }


def _load_bookmarks():
    if not os.path.exists(BOOKMARKS_FILE):
        return []
    try:
        with open(BOOKMARKS_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
            return data if isinstance(data, list) else []
    except Exception:
        return []


def _save_bookmarks(bookmarks):
    tmp = BOOKMARKS_FILE + '.tmp'
    with open(tmp, 'w', encoding='utf-8') as f:
        json.dump(bookmarks, f, ensure_ascii=False)
    os.replace(tmp, BOOKMARKS_FILE)


def build_status():
    articles = prune_to_window(load_articles())
    normalized = []
    for article in articles:
        article = dict(article)
        if not article.get("published") and article.get("published_dt"):
            article["published"] = article.get("published_dt")
        # Add UPSC enrichment
        article['upsc'] = _get_upsc_tags(article)
        normalized.append(article)
    return {
        "windowHours": WINDOW_HOURS,
        "count": len(normalized),
        "articles": normalized,
        "breaking": build_breaking(normalized),
        "updatedAt": iso(UTC_NOW()),
    }

_INTENSITY_POSITIVE = re.compile(
    r"\b(breaking|urgent|emergency|alert|warns|warning|killed|died|death|attack|strike|war|crisis|disaster|rescue|arrest|raids|ban|controversy|explosion|shooting|crash|deadly|pandemic|outbreak|drought|flood|earthquake|tsunami|riot|protest|lockdown|curfew|bloodshed|massacre|firing|collision|derailment|blackout|hostage|kidnap|ambush|assassination|militant|naxal|isis|bomb|blast|grenade|communal|lynch|suicide|rape|murder|convict|sentence|arrested|appointed|chief|president|minister|major|significant|historic|first|record|bill|amendment|census|budget|reform|summit|treaty)\b",
    re.I,
)
_INTENSITY_NEGATIVE = re.compile(
    r"\b(analysis|opinion|review|reviewed|match|win|lost|score|league|tournament|fixture)\b",
    re.I,
)
_SYLLABUS_TERMS = [
    'ancient','medieval','modern','independence','world history','art','culture','heritage',
    'geography','climate','urban','resources','physical','disaster','environment','ecology',
    'polity','governance','election','judiciary','constitution','parliament','bill','amendment',
    'international relations','neighbour','summit','treaty','bilateral','multilateral',
    'economy','budget','finance','investment','agriculture','food','fiscal','monetary','gdp','inflation',
    'science','technology','space','satellite','defence','cyber','biotech','energy','renewable',
    'internal security','extremism','terror','border','coast','laundering','cybersecurity',
    'ethics','integrity','aptitude','essay','attitude','civil service','governance',
    'psychology','cognition','perception','learning','memory','developmental','social','clinical',
    'society','social justice','caste','gender','minority','tribal','education','health'
]
_SYLLABUS_RE = re.compile('|'.join(_SYLLABUS_TERMS), re.I)

# GS Paper mapping for UPSC tags
_GS_MAP = {
    'ancient': 'GS1', 'medieval': 'GS1', 'modern': 'GS1', 'independence': 'GS1',
    'art': 'GS1', 'culture': 'GS1', 'heritage': 'GS1',
    'geography': 'GS1', 'climate': 'GS1', 'urban': 'GS1', 'resources': 'GS1',
    'physical': 'GS1', 'disaster': 'GS1', 'environment': 'GS1', 'ecology': 'GS1',
    'polity': 'GS2', 'governance': 'GS2', 'election': 'GS2', 'judiciary': 'GS2',
    'constitution': 'GS2', 'parliament': 'GS2', 'bill': 'GS2', 'amendment': 'GS2',
    'international relations': 'GS2', 'neighbour': 'GS2', 'summit': 'GS2',
    'treaty': 'GS2', 'bilateral': 'GS2', 'multilateral': 'GS2',
    'social justice': 'GS2', 'caste': 'GS2', 'gender': 'GS2', 'minority': 'GS2',
    'tribal': 'GS2', 'education': 'GS2', 'health': 'GS2',
    'society': 'GS1',
    'economy': 'GS3', 'budget': 'GS3', 'finance': 'GS3', 'investment': 'GS3',
    'agriculture': 'GS3', 'food': 'GS3', 'fiscal': 'GS3', 'monetary': 'GS3',
    'gdp': 'GS3', 'inflation': 'GS3',
    'science': 'GS3', 'technology': 'GS3', 'space': 'GS3', 'satellite': 'GS3',
    'defence': 'GS3', 'cyber': 'GS3', 'biotech': 'GS3', 'energy': 'GS3',
    'renewable': 'GS3',
    'internal security': 'GS3', 'extremism': 'GS3', 'terror': 'GS3', 'border': 'GS3',
    'coast': 'GS3', 'laundering': 'GS3', 'cybersecurity': 'GS3',
    'ethics': 'GS4', 'integrity': 'GS4', 'aptitude': 'GS4',
    'essay': 'GS4', 'attitude': 'GS4', 'civil service': 'GS4',
    'psychology': 'Optional', 'cognition': 'Optional', 'perception': 'Optional',
    'learning': 'Optional', 'memory': 'Optional', 'developmental': 'Optional',
    'social': 'Optional', 'clinical': 'Optional',
}

BOOKMARKS_FILE = os.path.join(CACHE_DIR, 'bookmarks.json')


def _syllabus_score(article):
    title = article.get('title') or ''
    snippet = article.get('snippet') or ''
    text = title + ' ' + snippet
    if not text.strip():
        return 0
    return len(_SYLLABUS_RE.findall(text))

def _intensity_score(article):
    title = article.get("title") or ""
    snippet = article.get("snippet") or ""
    text = title + " " + snippet
    pos = len(_INTENSITY_POSITIVE.findall(text))
    neg = len(_INTENSITY_NEGATIVE.findall(text))
    pub = article.get("published") or ""
    try:
        dt = datetime.fromisoformat(pub)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        age_min = max((UTC_NOW() - dt).total_seconds() / 60.0, 0.0)
    except Exception:
        age_min = 9999.0
    recency = max(0.0, 1.0 - age_min / 120.0)
    source_count = len(set((article.get("source") or "").split(",")))
    raw = (pos * 3.0) - (neg * 1.0) + (recency * 4.0) + min(source_count * 2.0, 6.0)
    return max(0.0, raw)

def build_breaking(articles, limit=15):
    """High-voltage breaking: 80% last 30min, 10% last 1hr, 10% last 6hr.
    Each bucket sorted by intensityScore descending - hottest stories first.
    """
    now = UTC_NOW()
    bucket_30 = []
    bucket_60 = []
    bucket_360 = []
    seen = set()
    for a in sorted(articles, key=lambda x: x.get('published') or '', reverse=True):
        title = a.get('title')
        url = a.get('url')
        if not title or not url:
            continue
        if url in seen:
            continue
        seen.add(url)
        pub = a.get('published', '')
        try:
            dt = datetime.fromisoformat(pub.replace('Z', '+00:00'))
            age_min = max((now - dt).total_seconds() / 60.0, 0.0)
        except Exception:
            age_min = 9999.0
        # High-voltage intensity score
        intensity = _intensity_score(a)
        # Mild freshness tiebreaker: <5min = +3, <15min = +2, <30min = +1
        if age_min <= 5:
            intensity += 3
        elif age_min <= 15:
            intensity += 2
        elif age_min <= 30:
            intensity += 1
        entry = {
            'title': title,
            'url': url,
            'source': a.get('source'),
            'published': pub,
            'snippet': a.get('snippet') or title,
            'image': a.get('image'),
            'intensityScore': round(intensity, 1),
        }
        if age_min <= 30:
            bucket_30.append(entry)
        elif age_min <= 60:
            bucket_60.append(entry)
        elif age_min <= 360:
            bucket_360.append(entry)
    # Sort each bucket by intensity descending - hottest on top
    bucket_30.sort(key=lambda x: x['intensityScore'], reverse=True)
    bucket_60.sort(key=lambda x: x['intensityScore'], reverse=True)
    bucket_360.sort(key=lambda x: x['intensityScore'], reverse=True)
    total_30 = max(1, int(limit * 0.8))
    total_60 = max(1, int(limit * 0.1))
    total_360 = max(1, int(limit * 0.1))
    selected = bucket_30[:total_30] + bucket_60[:total_60] + bucket_360[:total_360]
    return selected[:limit]
class Handler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {
        **dict.fromkeys(['.js', '.mjs', '.jsx', '.ts', '.tsx'], 'application/javascript'),
        **dict.fromkeys(['.css', '.scss', '.sass'], 'text/css'),
        **dict.fromkeys(['.json', '.webmanifest', 'manifest.json'], 'application/json'),
        **dict.fromkeys(['.wasm'], 'application/wasm'),
        **dict.fromkeys(['.svg'], 'image/svg+xml'),
        **dict.fromkeys(['.woff', '.woff2'], 'font/woff2'),
        **dict.fromkeys(['.html', '.htm'], 'text/html; charset=utf-8'),
    }
    def guess_type(self, path):
        base, ext = os.path.splitext(path)
        if ext in self.extensions_map:
            return self.extensions_map[ext]
        return super().guess_type(path)
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.path.join(os.path.dirname(__file__), "dist"), **kwargs)

    def log_message(self, fmt, *args):
        pass

    def _build_economy_brief(self):
        """Build curated economy news brief for UPSC GS3 (zFinance contribution)."""
        articles = prune_to_window(load_articles())
        economy_keywords = {
            'economy', 'budget', 'finance', 'investment', 'gdp', 'inflation',
            'fiscal', 'monetary', 'rbi', 'banking', 'tax', 'fdi', 'trade',
            'import', 'export', 'agriculture', 'subsidy', 'market', 'stock',
            'nifty', 'sensex', 'revenue', 'deficit', 'pension', 'insurance',
            'gst', 'npas', 'disinvestment', 'sebi', 'finance_bill'
        }
        scored = []
        seen_urls = set()
        for a in articles:
            url = a.get('url', '')
            if url in seen_urls:
                continue
            seen_urls.add(url)
            tags = _get_upsc_tags(a)
            tag_text = ' '.join(tags.get('tags', [])).lower()
            title = a.get('title', '').lower()
            snippet = a.get('snippet', '').lower()
            combined = f"{title} {snippet} {tag_text}"
            keyword_matches = sum(1 for kw in economy_keywords if kw in combined)
            if keyword_matches > 0:
                gs3_bonus = 3 if 'GS3' in tags.get('papers', []) else 0
                score = _syllabus_score(a) + gs3_bonus + keyword_matches
                scored.append((score, a))
        scored.sort(key=lambda x: -x[0])
        brief = [a for _, a in scored[:15]]
        for a in brief:
            a['upsc'] = _get_upsc_tags(a)
            a['economy_score'] = _syllabus_score(a)
        return {
            "count": len(brief),
            "articles": brief,
            "updatedAt": iso(UTC_NOW()),
            "gs3_focus": True,
            "note": "Economy news curated for UPSC GS3 — zFinance contribution",
        }

    def _build_earnings(self):
        """Build finance/earning dashboard data for zFinance module."""
        import datetime as dt_mod
        lane_status = [
            {"id": "freelancer", "label": "Freelancer", "status": "ready", "path": "freelancer_pipeline.py", "token_needed": True, "notes": "Awaiting .env token"},
            {"id": "telegram_bot", "label": "Telegram Bot", "status": "ready", "path": "telegram_intake_bot.py", "token_needed": True, "notes": "Awaiting .env token"},
            {"id": "gumroad_pdf", "label": "Gumroad PDFs", "status": "staged", "path": "pivot_gumroad", "token_needed": True, "notes": "Freelancer/Gumroad pivot drafted"},
            {"id": "quickflip", "label": "QUICKFLIP.sh", "status": "ready", "path": "QUICKFLIP.sh", "token_needed": True, "notes": "Bidding script ready, needs .env"},
            {"id": "news_dashboard", "label": "ADHD News Dashboard", "status": "active", "path": "server.py", "token_needed": False, "notes": "Live on port 18925 — contributed"},
        ]
        daily_goal = 3000  # ₹3k/day target
        monthly_goal = 90000  # ₹90k/month target
        # Calculate today's progress (simulated until actual earnings start)
        today_pnl = 0  # Actual earnings data when pipeline live
        return {
            "daily_goal": daily_goal,
            "daily_progress": today_pnl,
            "daily_remaining": max(0, daily_goal - today_pnl),
            "monthly_goal": monthly_goal,
            "lanes": lane_status,
            "active_lanes": len([l for l in lane_status if l["status"] == "active"]),
            "ready_lanes": len([l for l in lane_status if l["status"] == "ready"]),
            "total_lanes": len(lane_status),
            "blocker": ".env token/API keys from Venkat",
            "pipeline_status": "T+0 — 5/5 scripts syntax-clean",
            "updated_at": iso(UTC_NOW()),
        }

    def _serve_html(self, relpath: str):
        disk = os.path.join(os.path.dirname(__file__), relpath)
        with open(disk, "rb") as fh:
            body = fh.read()
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-cache")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path.split("?",1)[0]
        if path in {"/index.html", "/"}:
            self._serve_html("dist/index.html")
            return
        if path == "/login":
            self._serve_html("static/login.html")
            return
        if path == "/onboarding":
            self._serve_html("static/onboarding.html")
            return
        if path in {"/app", "/app/", "/app/index.html"}:
            self._serve_html("dist/index.html")
            return
        if parsed.path == "/status.json":
            self._json(build_status())
            return
        if parsed.path == "/rescan":
            threading.Thread(target=run_scan, daemon=True).start()
            self._json({"ok": True})
            return
        if parsed.path == "/healthz":
            self.send_response(200)
            self.end_headers()
            return
        if parsed.path == "/breaking.json":
            self._json({
                "breaking": build_breaking(prune_to_window(load_articles()), limit=15),
                "updatedAt": iso(UTC_NOW()),
            })
            return
        if parsed.path == "/bookmarks.json":
            self._json({"bookmarks": _load_bookmarks()})
            return
        if parsed.path == "/feeds.json":
            self._json({
                "topics": _get_active_topics_for_api(),
                "rss_feeds": _get_active_rss_feeds_for_api(),
            })
            return
        if parsed.path == "/upsc-feed.json":
            articles = prune_to_window(load_articles())
            scored = [(a, _syllabus_score(a)) for a in articles]
            scored.sort(key=lambda x: -x[1])
            upsc_articles = [a for a, s in scored if s > 0][:20]
            for a in upsc_articles:
                a['upsc'] = _get_upsc_tags(a)
            self._json({
                "count": len(upsc_articles),
                "articles": upsc_articles,
                "updatedAt": iso(UTC_NOW()),
            })
            return
        if parsed.path == "/api/earnings.json":
            self._json(self._build_earnings())
            return
        if parsed.path == "/api/economy-brief.json":
            self._json(self._build_economy_brief())
            return
        if parsed.path == "/api/pipeline-health.json":
            earnings = self._build_earnings()
            economy = self._build_economy_brief()
            self._json({
                "zfinance": earnings,
                "economy_brief": economy,
                "updatedAt": iso(UTC_NOW()),
            })
            return
        super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == "/rescan":
            threading.Thread(target=run_scan, daemon=True).start()
            self._json({"ok": True})
            return
        if parsed.path == "/feeds.json":
            content_len = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_len) if content_len else b'{}'
            try:
                data = json.loads(body.decode('utf-8'))
                action = data.get('action', 'get')
                config = _load_feeds_config()
                rss = config.get('rss_feeds', DEFAULT_RSS_FEEDS[:])
                topics = config.get('topics', DEFAULT_TOPICS[:])
                if action == 'add_rss':
                    feed_id = data.get('id', '').strip()
                    feed_url = data.get('url', '').strip()
                    if feed_id and feed_url:
                        existing = {f['id'] for f in rss}
                        if feed_id not in existing:
                            rss.append({"id": feed_id, "url": feed_url, "enabled": True})
                            _save_feeds_config(rss_feeds=rss)
                elif action == 'remove_rss':
                    feed_id = data.get('id', '')
                    rss = [f for f in rss if f['id'] != feed_id]
                    _save_feeds_config(rss_feeds=rss)
                elif action == 'toggle_rss':
                    feed_id = data.get('id', '')
                    enabled = data.get('enabled', True)
                    for f in rss:
                        if f['id'] == feed_id:
                            f['enabled'] = enabled
                            break
                    _save_feeds_config(rss_feeds=rss)
                elif action == 'add_topic':
                    topic_id = data.get('id', '').strip()
                    topic_label = data.get('label', '').strip()
                    topic_query = data.get('query', '').strip()
                    if topic_id and topic_query:
                        existing = {t['id'] for t in topics}
                        if topic_id not in existing:
                            topics.append({"id": topic_id, "label": topic_label or topic_id, "query": topic_query, "enabled": True})
                            _save_feeds_config(topics=topics)
                elif action == 'remove_topic':
                    topic_id = data.get('id', '')
                    topics = [t for t in topics if t['id'] != topic_id]
                    _save_feeds_config(topics=topics)
                elif action == 'toggle_topic':
                    topic_id = data.get('id', '')
                    enabled = data.get('enabled', True)
                    for t in topics:
                        if t['id'] == topic_id:
                            t['enabled'] = enabled
                            break
                    _save_feeds_config(topics=topics)
                elif action == 'reset':
                    _save_feeds_config(rss_feeds=DEFAULT_RSS_FEEDS[:], topics=DEFAULT_TOPICS[:])
                    rss = DEFAULT_RSS_FEEDS[:]
                    topics = DEFAULT_TOPICS[:]
                elif action == 'save_all':
                    # Atomic bulk update: accepts full rss_feeds + topics arrays
                    new_rss = data.get('rss_feeds')
                    new_topics = data.get('topics')
                    if new_rss is not None and isinstance(new_rss, list):
                        rss = new_rss
                    if new_topics is not None and isinstance(new_topics, list):
                        topics = new_topics
                    _save_feeds_config(rss_feeds=rss, topics=topics)
                self._json({
                    "ok": True,
                    "rss_feeds": rss,
                    "topics": topics,
                })
            except Exception as exc:
                self._json({'error': str(exc)})
            return
        if parsed.path == "/bookmarks.json":
            content_len = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_len) if content_len else b'{}'
            try:
                data = json.loads(body.decode('utf-8'))
                action = data.get('action', 'get')
                if action == 'add':
                    bks = _load_bookmarks()
                    # Dedup by url
                    urls = {b['url'] for b in bks}
                    if data.get('url') and data['url'] not in urls:
                        bks.insert(0, {
                            'title': data.get('title', ''),
                            'url': data['url'],
                            'source': data.get('source', ''),
                            'published': data.get('published', ''),
                            'savedAt': iso(UTC_NOW()),
                        })
                        _save_bookmarks(bks)
                    self._json({'ok': True, 'count': len(bks)})
                elif action == 'remove':
                    bks = _load_bookmarks()
                    url = data.get('url', '')
                    bks = [b for b in bks if b.get('url') != url]
                    _save_bookmarks(bks)
                    self._json({'ok': True, 'count': len(bks)})
                elif action == 'clear':
                    _save_bookmarks([])
                    self._json({'ok': True, 'count': 0})
                else:
                    self._json({'bookmarks': _load_bookmarks()})
            except Exception as exc:
                self._json({'error': str(exc)})
            return
        self.send_error(405)

    def _json(self, obj):
        body = json.dumps(obj, ensure_ascii=False).encode("utf-8")
        try:
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Cache-Control", "no-cache")
            self.end_headers()
            self.wfile.write(body)
        except (BrokenPipeError, ConnectionResetError):
            pass  # client disconnected, ignore

def ensure_index():
    pass
_rss_timer = None
_timer = None
_lock = threading.Lock()

def _schedule_scan():
    global _timer
    with _lock:
        if _timer is not None:
            _timer.cancel()
        _timer = threading.Timer(RESCAN_SECONDS, _run_scheduled_scan)
        _timer.daemon = True
        _timer.start()

def _run_scheduled_scan():
    try:
        run_scan()
    finally:
        _schedule_scan()

def _schedule_rss():
    global _rss_timer
    with _lock:
        if _rss_timer is not None:
            _rss_timer.cancel()
        _rss_timer = threading.Timer(300, _run_scheduled_rss)
        _rss_timer.daemon = True
        _rss_timer.start()

def _run_scheduled_rss():
    try:
        existing = load_articles()
        rss_articles = poll_rss()
        if rss_articles:
            seen = {_article_key(a) for a in existing}
            merged = list(existing)
            cutoff = UTC_NOW() - timedelta(hours=WINDOW_HOURS)
            for article in rss_articles:
                cleaned = _clean_article(article, cutoff)
                if cleaned is None:
                    continue
                key = _article_key(cleaned)
                if not key or key in seen:
                    continue
                seen.add(key)
                merged.append(cleaned)
            merged = prune_to_window(merged)
            save_articles(merged)
            print(f"[rss] merged candidates={len(rss_articles)} total={len(merged)}")
    finally:
        _schedule_rss()

def _ensure_feeds_config():
    """Create feeds_config.json with defaults if it doesn't exist."""
    config_file = os.path.join(CACHE_DIR, 'feeds_config.json')
    if not os.path.exists(config_file):
        _save_feeds_config(rss_feeds=DEFAULT_RSS_FEEDS[:], topics=DEFAULT_TOPICS[:])
        print(f"[server] Created default feeds_config.json ({len(DEFAULT_RSS_FEEDS)} feeds, {len(DEFAULT_TOPICS)} topics)", flush=True)

def main():
    ensure_index()
    _ensure_feeds_config()
    # Run initial scan in background thread so it doesn't block server startup
    initial_scan_thread = threading.Thread(target=run_scan, daemon=True)
    initial_scan_thread.start()
    _schedule_scan()
    _schedule_rss()
    server = http.server.ThreadingHTTPServer(("0.0.0.0", PORT), Handler)
    server.daemon_threads = True
    print(f"[server] listening on http://0.0.0.0:{PORT}/")
    server.serve_forever()

if __name__ == "__main__":
    main()
