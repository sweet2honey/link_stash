// DOM elements
const linksList = document.getElementById('links-list');
const emptyMessage = document.getElementById('empty-message');
const copyUrlsBtn = document.getElementById('copy-urls-btn');
const copyMarkdownBtn = document.getElementById('copy-markdown-btn');
const clearAllBtn = document.getElementById('clear-all-btn');
const statusMessage = document.getElementById('status-message');
// Load and display links on popup open
document.addEventListener('DOMContentLoaded', () => {
    cleanupDeletedLinks(() => {
        loadLinks();
    });
});
// Button event listeners
copyUrlsBtn.addEventListener('click', copyAsUrls);
copyMarkdownBtn.addEventListener('click', copyAsMarkdown);
clearAllBtn.addEventListener('click', clearAllLinks);
// Permanently remove links marked as deleted
function cleanupDeletedLinks(done) {
    chrome.storage.local.get(['links'], (result) => {
        const links = result.links || [];
        const activeLinks = links.filter(link => !link.deleted);
        if (activeLinks.length !== links.length) {
            chrome.storage.local.set({ links: activeLinks }, () => {
                done === null || done === void 0 ? void 0 : done();
            });
            return;
        }
        done === null || done === void 0 ? void 0 : done();
    });
}
// Load links from storage and display them
function loadLinks() {
    chrome.storage.local.get(['links'], (result) => {
        const links = result.links || [];
        renderLinks(links);
    });
}
// Render the links list
function renderLinks(links) {
    linksList.innerHTML = '';
    if (links.length === 0) {
        emptyMessage.style.display = 'block';
        linksList.style.display = 'none';
        copyUrlsBtn.disabled = true;
        copyMarkdownBtn.disabled = true;
        clearAllBtn.disabled = true;
    }
    else {
        emptyMessage.style.display = 'none';
        linksList.style.display = 'block';
        copyUrlsBtn.disabled = false;
        copyMarkdownBtn.disabled = false;
        clearAllBtn.disabled = false;
        links.forEach((link, index) => {
            const li = document.createElement('li');
            li.className = 'link-item';
            const url = link.url;
            const title = link.title;
            const isDeleted = link.deleted || false;
            // Apply deleted styling
            if (isDeleted) {
                li.classList.add('link-item-deleted');
            }
            const urlSpan = document.createElement('span');
            urlSpan.className = 'link-url';
            urlSpan.textContent = title;
            urlSpan.title = url;
            const openBtn = document.createElement('button');
            openBtn.className = 'open-btn';
            openBtn.textContent = '↗';
            openBtn.title = 'Open this link';
            openBtn.disabled = isDeleted;
            openBtn.addEventListener('click', () => openLink(index));
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = isDeleted ? '↺' : '✕';
            deleteBtn.title = isDeleted ? 'Undo delete' : 'Delete this link';
            deleteBtn.addEventListener('click', () => deleteOrRecoverLink(index));
            li.appendChild(urlSpan);
            li.appendChild(openBtn);
            li.appendChild(deleteBtn);
            linksList.appendChild(li);
        });
    }
}
// Open a single link by index
function openLink(index) {
    chrome.storage.local.get(['links'], (result) => {
        const links = result.links || [];
        if (index >= 0 && index < links.length) {
            const link = links[index];
            chrome.tabs.create({ url: link.url });
        }
    });
}
// Delete a single link by index (mark as deleted or undo)
function deleteOrRecoverLink(index) {
    chrome.storage.local.get(['links'], (result) => {
        const links = result.links || [];
        if (index >= 0 && index < links.length) {
            const link = links[index];
            link.deleted = !link.deleted;
            const msg = link.deleted ? 'Link marked for deletion' : 'Delete cancelled';
            showStatus(msg);
            chrome.storage.local.set({ links }, () => {
                renderLinks(links);
            });
        }
    });
}
// Copy all links as plain URLs (one per line, excluding deleted links)
function copyAsUrls() {
    chrome.storage.local.get(['links'], (result) => {
        const links = result.links || [];
        const activeLinks = links.filter(link => !link.deleted);
        if (activeLinks.length === 0)
            return;
        const text = activeLinks.map(link => link.url).join('\n');
        navigator.clipboard.writeText(text).then(() => {
            showStatus('Copied as URLs!');
        }).catch((err) => {
            showStatus('Failed to copy');
            console.error('Copy failed:', err);
        });
    });
}
// Copy all links as Markdown format [title](url), excluding deleted links
function copyAsMarkdown() {
    chrome.storage.local.get(['links'], (result) => {
        const links = result.links || [];
        const activeLinks = links.filter(link => !link.deleted);
        if (activeLinks.length === 0)
            return;
        const markdown = activeLinks.map(link => `[${link.title}](${link.url})`).join('\n\n');
        navigator.clipboard.writeText(markdown).then(() => {
            showStatus('Copied as Markdown!');
        }).catch((err) => {
            showStatus('Failed to copy');
            console.error('Copy failed:', err);
        });
    });
}
// Clear all links with confirmation
function clearAllLinks() {
    if (confirm('Are you sure you want to clear all saved links?')) {
        chrome.storage.local.set({ links: [] }, () => {
            renderLinks([]);
            showStatus('All links cleared');
        });
    }
}
// Show a temporary status message
function showStatus(message) {
    statusMessage.textContent = message;
    statusMessage.style.opacity = '1';
    setTimeout(() => {
        statusMessage.style.opacity = '0';
    }, 2000);
}
export {};
