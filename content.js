// Store the last right-clicked element
let lastClickedElement = null;
// Listen for context menu events
document.addEventListener('contextmenu', (event) => {
    lastClickedElement = event.target;
}, true);
// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    var _a;
    if (request.action === 'getLinkText') {
        // Find the anchor element (the clicked element or its parent)
        let element = lastClickedElement;
        while (element && element.tagName !== 'A') {
            element = element.parentElement;
        }
        if (element && element.tagName === 'A') {
            const linkText = ((_a = element.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || element.href;
            sendResponse({ linkText: linkText });
        }
        else {
            sendResponse({ linkText: request.url });
        }
    }
    return true; // Keep the message channel open for async response
});
export {};
