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
    title: "Save Link",
    contexts: ["link"]
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "savePageLink") {
    // Save current page URL with title
    saveLink(tab.url, tab.title);
  } else if (info.menuItemId === "saveLinkUrl") {
    // Get the link text from the content script
    chrome.tabs.sendMessage(tab.id, { action: 'getLinkText', url: info.linkUrl }, (response) => {
      const linkText = response && response.linkText ? response.linkText : info.linkUrl;
      saveLink(info.linkUrl, linkText);
    });
  }
});

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
