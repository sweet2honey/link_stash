import { GetLinkTextRequest, GetLinkTextResponse } from './types.js';

// Store the last right-clicked element
let lastClickedElement: HTMLElement | null = null;

// Listen for context menu events
document.addEventListener('contextmenu', (event: MouseEvent) => {
  lastClickedElement = event.target as HTMLElement;
}, true);

// Listen for messages from background script
chrome.runtime.onMessage.addListener((
  request: GetLinkTextRequest,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: GetLinkTextResponse) => void
): boolean => {
  if (request.action === 'getLinkText') {
    // Find the anchor element (the clicked element or its parent)
    let element: HTMLElement | null = lastClickedElement;
    while (element && element.tagName !== 'A') {
      element = element.parentElement;
    }
    
    if (element && element.tagName === 'A') {
      const linkText = element.textContent?.trim() || (element as HTMLAnchorElement).href;
      sendResponse({ linkText: linkText });
    } else {
      sendResponse({ linkText: request.url });
    }
  }
  return true; // Keep the message channel open for async response
});
