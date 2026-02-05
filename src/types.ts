// Shared type definitions for the Link Stash extension

// The modern link format with url and title
export interface StoredLink {
  url: string;
  title: string;
}

// Union type for backward compatibility (string for legacy format)
export type Link = StoredLink | string;

// The storage structure
export interface LinksStorage {
  links: Link[];
}

// Message types for content script communication
export interface GetLinkTextRequest {
  action: 'getLinkText';
  url: string;
}

export interface GetLinkTextResponse {
  linkText: string;
}
