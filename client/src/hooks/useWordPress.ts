import { useQuery } from "@tanstack/react-query";

// WordPress Post Type
export interface WordPressPost {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  meta: any[];
  categories: number[];
  tags: number[];
  _links: any;
}

// WordPress Page Type
export interface WordPressPage {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  template: string;
  parent: number;
  menu_order: number;
  meta: any[];
  _links: any;
}

// API Response Types
interface WordPressApiResponse<T> {
  success: boolean;
  data: T[];
  pagination?: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

interface WordPressApiSingleResponse<T> {
  success: boolean;
  data: T;
}

// Hook to fetch WordPress posts
export function useWordPressPosts(limit?: number) {
  return useQuery<WordPressApiResponse<WordPressPost>>({
    queryKey: ["/api/wordpress/posts", { limit: limit || 10 }],
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

// Hook to fetch WordPress pages
export function useWordPressPages() {
  return useQuery<WordPressApiResponse<WordPressPage>>({
    queryKey: ["/api/wordpress/pages"],
    staleTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
  });
}

// Hook to fetch a specific WordPress post by slug
export function useWordPressPost(slug: string) {
  return useQuery<WordPressApiSingleResponse<WordPressPost>>({
    queryKey: ["/api/wordpress/posts/" + slug],
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

// Hook to fetch a specific WordPress page by slug  
export function useWordPressPage(slug: string) {
  return useQuery<WordPressApiSingleResponse<WordPressPage>>({
    queryKey: ["/api/wordpress/pages/" + slug],
    enabled: !!slug,
    staleTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
  });
}

// Utility function to format WordPress date
export function formatWordPressDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Utility function to strip HTML from WordPress content
export function stripHtml(html: string): string {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

// Utility function to get excerpt from WordPress content
export function getExcerpt(content: string, maxLength: number = 150): string {
  const stripped = stripHtml(content);
  if (stripped.length <= maxLength) return stripped;
  return stripped.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
}