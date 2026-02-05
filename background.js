var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
chrome.contextMenus.onClicked.addListener((info, tab) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!(tab === null || tab === void 0 ? void 0 : tab.id))
        return;
    if (info.menuItemId === "savePageLink") {
        // Save current page URL with title
        if (tab.url && tab.title) {
            saveLink(tab.url, tab.title);
        }
    }
    else if (info.menuItemId === "saveLinkUrl") {
        // Inject script to get the link text dynamically
        try {
            const results = yield chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: getLinkText,
                args: [info.linkUrl]
            });
            const linkText = ((_a = results[0]) === null || _a === void 0 ? void 0 : _a.result) || info.linkUrl || '';
            saveLink(info.linkUrl, linkText);
        }
        catch (error) {
            console.error('Failed to get link text:', error);
            saveLink(info.linkUrl, info.linkUrl);
        }
    }
}));
// Function to be injected into the page to get link text
function getLinkText(targetUrl) {
    var _a;
    // Find the anchor element with matching href
    const links = document.querySelectorAll('a');
    for (let i = 0; i < links.length; i++) {
        const link = links[i];
        if (link.href === targetUrl) {
            return ((_a = link.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || link.href;
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
export {};
