// Shared type definitions for the Link Stash extension

// The modern link format with url and title
export interface StoredLink {
  url: string;
  title: string;
  deleted?: boolean; // Mark link for deletion on next popup open
}

// Link type alias
export type Link = StoredLink;

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
