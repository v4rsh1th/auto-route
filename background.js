let blockedSites = [];

if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.get(['blockedSites'], function (result) {
        blockedSites = result.blockedSites || [];
        updateBlockRules();
    });

    chrome.storage.onChanged.addListener(function (changes, namespace) {
        if (namespace === 'sync' && changes.blockedSites) {
            blockedSites = changes.blockedSites.newValue;
            updateBlockRules();
        }
    });
} else {
    console.error('Chrome storage API is not available');
}

function updateBlockRules() {
    if (typeof chrome !== 'undefined' && chrome.declarativeNetRequest) {
        chrome.declarativeNetRequest.getDynamicRules((existingRules) => {
            const existingRuleIds = existingRules.map(rule => rule.id);
            chrome.declarativeNetRequest.updateDynamicRules({
                removeRuleIds: existingRuleIds,
                addRules: blockedSites.map((site, index) => ({
                    id: index + 1,
                    priority: 1,
                    action: {
                        type: 'redirect',
                        redirect: {
                            url: 'https://www.google.com'
                        }
                    },
                    condition: {
                        urlFilter: `||${site}`,
                        resourceTypes: ['main_frame']
                    }
                }))
            }, () => {
                if (chrome.runtime.lastError) {
                    console.error('Error updating rules:', chrome.runtime.lastError);
                } else {
                    console.log('Rules updated successfully');
                }
            });
        });
    } else {
        console.error('Chrome declarativeNetRequest API is not available');
    }
}