const WORDPRESS_BASE_URL = 'https://max6075b20c2f26-ilcsj.wpcomstaging.com/wp-json/wp/v2';

export interface WordPressPost {
  id: number;
  date: string;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  author: number;
  featured_media: number;
  link: string;
}

export interface WordPressPage {
  id: number;
  date: string;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  author: number;
  featured_media: number;
  link: string;
}

export class WordPressService {
  private baseUrl: string;

  constructor(baseUrl: string = WORDPRESS_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async getPosts(limit: number = 10): Promise<WordPressPost[]> {
    try {
      const response = await fetch(`${this.baseUrl}/posts?per_page=${limit}&_embed`);
      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching WordPress posts:', error);
      throw error;
    }
  }

  async getPost(slug: string): Promise<WordPressPost | null> {
    try {
      const response = await fetch(`${this.baseUrl}/posts?slug=${slug}&_embed`);
      if (!response.ok) {
        throw new Error(`Failed to fetch post: ${response.statusText}`);
      }
      const posts = await response.json();
      return posts.length > 0 ? posts[0] : null;
    } catch (error) {
      console.error('Error fetching WordPress post:', error);
      throw error;
    }
  }

  async getPages(limit: number = 10): Promise<WordPressPage[]> {
    try {
      const response = await fetch(`${this.baseUrl}/pages?per_page=${limit}&_embed`);
      if (!response.ok) {
        throw new Error(`Failed to fetch pages: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching WordPress pages:', error);
      throw error;
    }
  }

  async getPage(slug: string): Promise<WordPressPage | null> {
    try {
      const response = await fetch(`${this.baseUrl}/pages?slug=${slug}&_embed`);
      if (!response.ok) {
        throw new Error(`Failed to fetch page: ${response.statusText}`);
      }
      const pages = await response.json();
      return pages.length > 0 ? pages[0] : null;
    } catch (error) {
      console.error('Error fetching WordPress page:', error);
      throw error;
    }
  }

  // Helper function to strip HTML tags and get clean text
  static stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').trim();
  }

  // Helper function to get featured image URL from _embedded data
  static getFeaturedImageUrl(post: any, size: string = 'medium'): string | null {
    try {
      if (post._embedded && post._embedded['wp:featuredmedia']) {
        const media = post._embedded['wp:featuredmedia'][0];
        if (media.media_details && media.media_details.sizes && media.media_details.sizes[size]) {
          return media.media_details.sizes[size].source_url;
        }
        return media.source_url || null;
      }
      return null;
    } catch {
      return null;
    }
  }
}