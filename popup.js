let blockedSites = [];

document.addEventListener('DOMContentLoaded', function () {
  chrome.storage.sync.get(['blockedSites'], function (result) {
    blockedSites = result.blockedSites || [];
    updateSiteList();
  });

  document.getElementById('addSite').addEventListener('click', addSite);
  document.getElementById('siteInput').addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
      addSite();
    }
  });
});

function addSite() {
  const siteInput = document.getElementById('siteInput');
  const site = siteInput.value.trim();
  if (site && !blockedSites.includes(site)) {
    const blockPattern = site.includes('*') ? site : `${site}/*`;
    blockedSites.push(blockPattern);
    chrome.storage.sync.set({ blockedSites: blockedSites }, function () {
      siteInput.value = '';
      updateSiteList();
    });
  }
}

function removeSite(site) {
  blockedSites = blockedSites.filter(s => s !== site);
  chrome.storage.sync.set({ blockedSites: blockedSites }, function () {
    updateSiteList();
  });
}

function updateSiteList() {
  const siteList = document.getElementById('siteList');
  siteList.innerHTML = '';
  blockedSites.forEach(site => {
    const li = document.createElement('li');
    li.innerHTML = `
            <span>${site}</span>
            <button class="remove-btn" data-site="${site}">Remove</button>
        `;
    siteList.appendChild(li);
  });

  // Add event listeners to remove buttons
  document.querySelectorAll('.remove-btn').forEach(button => {
    button.addEventListener('click', function () {
      removeSite(this.getAttribute('data-site'));
    });
  });
}