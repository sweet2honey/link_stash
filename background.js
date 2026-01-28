// Create context menus when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  // "Save Link" for right-clicking on page background
  chrome.contextMenus.create({
    id: "savePageLink",
    title: "Stash link",
    contexts: ["page"]
  });

  // "Save Link" for right-clicking on anchor elements
  chrome.contextMenus.create({
    id: "saveLinkUrl",
    title: "Stash Link",
    contexts: ["link"]
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "savePageLink") {
    // Save current page URL with title
    saveLink(tab.url, tab.title);
  } else if (info.menuItemId === "saveLinkUrl") {
    // Inject script to get the link text dynamically
    try {
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: getLinkText,
        args: [info.linkUrl]
      });
      const linkText = results[0]?.result || info.linkUrl;
      saveLink(info.linkUrl, linkText);
    } catch (error) {
      console.error('Failed to get link text:', error);
      saveLink(info.linkUrl, info.linkUrl);
    }
  }
});

// Function to be injected into the page to get link text
function getLinkText(targetUrl) {
  // Find the anchor element with matching href
  const links = document.querySelectorAll('a');
  for (const link of links) {
    if (link.href === targetUrl) {
      return link.textContent.trim() || link.href;
    }
  }
  return targetUrl;
}

// Save a link to storage (allows duplicates)
function saveLink(url, title) {
  chrome.storage.local.get(['links'], (result) => {
    const links = result.links || [];
    links.push({ url, title });
    chrome.storage.local.set({ links }, () => {
      console.log('Link saved:', title, url);
    });
  });
}
