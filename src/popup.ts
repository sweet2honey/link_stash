import { Link, LinksStorage } from './types.js';

// DOM elements
const linksList = document.getElementById('links-list') as HTMLUListElement;
const emptyMessage = document.getElementById('empty-message') as HTMLDivElement;
const copyUrlsBtn = document.getElementById('copy-urls-btn') as HTMLButtonElement;
const copyMarkdownBtn = document.getElementById('copy-markdown-btn') as HTMLButtonElement;
const clearAllBtn = document.getElementById('clear-all-btn') as HTMLButtonElement;
const statusMessage = document.getElementById('status-message') as HTMLDivElement;

// Load and display links on popup open
document.addEventListener('DOMContentLoaded', loadLinks);

// Button event listeners
copyUrlsBtn.addEventListener('click', copyAsUrls);
copyMarkdownBtn.addEventListener('click', copyAsMarkdown);
clearAllBtn.addEventListener('click', clearAllLinks);

// Load links from storage and display them
function loadLinks(): void {
  chrome.storage.local.get(['links'], (result: LinksStorage) => {
    const links = result.links || [];
    renderLinks(links);
  });
}

// Render the links list
function renderLinks(links: Link[]): void {
  linksList.innerHTML = '';
  
  if (links.length === 0) {
    emptyMessage.style.display = 'block';
    linksList.style.display = 'none';
    copyUrlsBtn.disabled = true;
    copyMarkdownBtn.disabled = true;
    clearAllBtn.disabled = true;
  } else {
    emptyMessage.style.display = 'none';
    linksList.style.display = 'block';
    copyUrlsBtn.disabled = false;
    copyMarkdownBtn.disabled = false;
    clearAllBtn.disabled = false;
    
    links.forEach((link, index) => {
      const li = document.createElement('li');
      li.className = 'link-item';
      
      // Handle both old format (string) and new format (object)
      const url = typeof link === 'string' ? link : link.url;
      const title = typeof link === 'string' ? link : link.title;
      
      const urlSpan = document.createElement('span');
      urlSpan.className = 'link-url';
      urlSpan.textContent = title;
      urlSpan.title = url;

      const openBtn = document.createElement('button');
      openBtn.className = 'open-btn';
      openBtn.textContent = '↗';
      openBtn.title = 'Open this link';
      openBtn.addEventListener('click', () => openLink(index));
      
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.textContent = '✕';
      deleteBtn.title = 'Delete this link';
      deleteBtn.addEventListener('click', () => deleteLink(index));
      
      li.appendChild(urlSpan);
      li.appendChild(openBtn);
      li.appendChild(deleteBtn);
      linksList.appendChild(li);
    });
  }
}

// Open a single link by index
function openLink(index: number): void {
  chrome.storage.local.get(['links'], (result: LinksStorage) => {
    const links = result.links || [];
    if (index >= 0 && index < links.length) {
      const link = links[index];
      const url = typeof link === 'string' ? link : link.url;
      chrome.tabs.create({ url });
    }
  });
}

// Delete a single link by index
function deleteLink(index: number): void {
  chrome.storage.local.get(['links'], (result: LinksStorage) => {
    const links = result.links || [];
    links.splice(index, 1);
    chrome.storage.local.set({ links }, () => {
      renderLinks(links);
      showStatus('Link deleted');
    });
  });
}

// Copy all links as plain URLs (one per line)
function copyAsUrls(): void {
  chrome.storage.local.get(['links'], (result: LinksStorage) => {
    const links = result.links || [];
    if (links.length === 0) return;
    
    const text = links.map(link => {
      if (typeof link === 'string') return link;
      return link.url;
    }).join('\n');
    navigator.clipboard.writeText(text).then(() => {
      showStatus('Copied as URLs!');
    }).catch((err: Error) => {
      showStatus('Failed to copy');
      console.error('Copy failed:', err);
    });
  });
}

// Copy all links as Markdown format [title](url)
function copyAsMarkdown(): void {
  chrome.storage.local.get(['links'], (result: LinksStorage) => {
    const links = result.links || [];
    if (links.length === 0) return;
    
    const markdown = links.map(link => {
      if (typeof link === 'string') return `[${link}](${link})`;
      return `[${link.title}](${link.url})`;
    }).join('\n');
    navigator.clipboard.writeText(markdown).then(() => {
      showStatus('Copied as Markdown!');
    }).catch((err: Error) => {
      showStatus('Failed to copy');
      console.error('Copy failed:', err);
    });
  });
}

// Clear all links with confirmation
function clearAllLinks(): void {
  if (confirm('Are you sure you want to clear all saved links?')) {
    chrome.storage.local.set({ links: [] }, () => {
      renderLinks([]);
      showStatus('All links cleared');
    });
  }
}

// Show a temporary status message
function showStatus(message: string): void {
  statusMessage.textContent = message;
  statusMessage.style.opacity = '1';
  
  setTimeout(() => {
    statusMessage.style.opacity = '0';
  }, 2000);
}
