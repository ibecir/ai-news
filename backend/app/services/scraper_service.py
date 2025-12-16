"""
Scraper service for extracting article content from URLs.
"""
import httpx
from bs4 import BeautifulSoup
from dataclasses import dataclass
from datetime import datetime
from typing import Optional
from urllib.parse import urlparse

from app.core.config import settings


@dataclass
class ScrapedArticle:
    """Data class for scraped article content."""
    url: str
    title: Optional[str] = None
    content: Optional[str] = None
    author: Optional[str] = None
    published_at: Optional[datetime] = None
    source_domain: Optional[str] = None
    error: Optional[str] = None


class ScraperService:
    """Service for scraping article content from URLs."""
    
    def __init__(self):
        self.timeout = settings.SCRAPER_TIMEOUT
        self.user_agent = settings.SCRAPER_USER_AGENT
    
    async def scrape(self, url: str) -> ScrapedArticle:
        """Scrape article content from URL."""
        parsed_url = urlparse(url)
        source_domain = parsed_url.netloc
        
        try:
            async with httpx.AsyncClient(
                timeout=self.timeout,
                follow_redirects=True,
            ) as client:
                response = await client.get(
                    url,
                    headers={
                        "User-Agent": self.user_agent,
                        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                        "Accept-Language": "en-US,en;q=0.5",
                    }
                )
                response.raise_for_status()
                
                html_content = response.text
                
        except httpx.HTTPError as e:
            return ScrapedArticle(
                url=url,
                source_domain=source_domain,
                error=f"HTTP error: {str(e)}"
            )
        except Exception as e:
            return ScrapedArticle(
                url=url,
                source_domain=source_domain,
                error=f"Scraping error: {str(e)}"
            )
        
        # Parse HTML (using built-in html.parser instead of lxml)
        soup = BeautifulSoup(html_content, "html.parser")
        
        # Extract title
        title = self._extract_title(soup)
        
        # Extract content
        content = self._extract_content(soup)
        
        # Extract author
        author = self._extract_author(soup)
        
        # Extract published date
        published_at = self._extract_published_date(soup)
        
        return ScrapedArticle(
            url=url,
            title=title,
            content=content,
            author=author,
            published_at=published_at,
            source_domain=source_domain,
        )
    
    def _extract_title(self, soup: BeautifulSoup) -> Optional[str]:
        """Extract article title."""
        # Try Open Graph title first
        og_title = soup.find("meta", property="og:title")
        if og_title and og_title.get("content"):
            return og_title["content"].strip()
        
        # Try Twitter title
        twitter_title = soup.find("meta", attrs={"name": "twitter:title"})
        if twitter_title and twitter_title.get("content"):
            return twitter_title["content"].strip()
        
        # Try h1 tag
        h1 = soup.find("h1")
        if h1:
            return h1.get_text().strip()
        
        # Fall back to title tag
        title_tag = soup.find("title")
        if title_tag:
            return title_tag.get_text().strip()
        
        return None
    
    def _extract_content(self, soup: BeautifulSoup) -> Optional[str]:
        """Extract article content."""
        # Remove unwanted elements
        for element in soup.find_all(["script", "style", "nav", "footer", "header", "aside", "form"]):
            element.decompose()
        
        # Try article tag first
        article = soup.find("article")
        if article:
            paragraphs = article.find_all("p")
            if paragraphs:
                content = " ".join(p.get_text().strip() for p in paragraphs)
                if len(content) > 100:
                    return content
        
        # Try common content selectors
        content_selectors = [
            {"class_": "article-body"},
            {"class_": "article-content"},
            {"class_": "post-content"},
            {"class_": "entry-content"},
            {"class_": "story-body"},
            {"id": "article-body"},
            {"id": "content"},
        ]
        
        for selector in content_selectors:
            container = soup.find("div", **selector)
            if container:
                paragraphs = container.find_all("p")
                if paragraphs:
                    content = " ".join(p.get_text().strip() for p in paragraphs)
                    if len(content) > 100:
                        return content
        
        # Fall back to all paragraphs
        paragraphs = soup.find_all("p")
        if paragraphs:
            # Filter out short paragraphs (likely nav/footer text)
            valid_paragraphs = [
                p.get_text().strip() 
                for p in paragraphs 
                if len(p.get_text().strip()) > 50
            ]
            if valid_paragraphs:
                return " ".join(valid_paragraphs)
        
        return None
    
    def _extract_author(self, soup: BeautifulSoup) -> Optional[str]:
        """Extract article author."""
        # Try meta author tag
        meta_author = soup.find("meta", attrs={"name": "author"})
        if meta_author and meta_author.get("content"):
            return meta_author["content"].strip()
        
        # Try common author selectors
        author_selectors = [
            {"class_": "author"},
            {"class_": "byline"},
            {"class_": "author-name"},
            {"rel": "author"},
        ]
        
        for selector in author_selectors:
            author_elem = soup.find(["a", "span", "div", "p"], **selector)
            if author_elem:
                text = author_elem.get_text().strip()
                # Clean up "By" prefix
                if text.lower().startswith("by "):
                    text = text[3:].strip()
                if text and len(text) < 100:
                    return text
        
        return None
    
    def _extract_published_date(self, soup: BeautifulSoup) -> Optional[datetime]:
        """Extract article published date."""
        from dateutil import parser
        
        # Try Open Graph published time
        og_time = soup.find("meta", property="article:published_time")
        if og_time and og_time.get("content"):
            try:
                return parser.parse(og_time["content"])
            except Exception:
                pass
        
        # Try time tag
        time_tag = soup.find("time")
        if time_tag:
            datetime_attr = time_tag.get("datetime") or time_tag.get_text()
            if datetime_attr:
                try:
                    return parser.parse(datetime_attr)
                except Exception:
                    pass
        
        # Try meta date tags
        date_metas = [
            {"name": "date"},
            {"name": "publish-date"},
            {"name": "article:published_time"},
            {"property": "datePublished"},
        ]
        
        for meta in date_metas:
            date_elem = soup.find("meta", **meta)
            if date_elem and date_elem.get("content"):
                try:
                    return parser.parse(date_elem["content"])
                except Exception:
                    pass
        
        return None


# Singleton instance
scraper_service = ScraperService()
