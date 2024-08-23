chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [1],
    addRules: [{
        id: 1,
        priority: 1,
        action: {
            type: 'redirect',
            redirect: {
                url: 'https://www.google.com'
            }
        },
        condition: {
            urlFilter: '||linkedin.com',
            resourceTypes: ['main_frame']
        }
    }]
});