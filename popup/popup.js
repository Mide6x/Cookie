document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['cookieData'], (result) => {
      const cookieData = result.cookieData || { count: 0 };
      document.getElementById('info-text').textContent = `You have ${cookieData.count} cookies from this site.`;
    });
  
    document.getElementById('clear-cookies').addEventListener('click', () => {
      chrome.storage.local.get(['cookieData'], (result) => {
        const cookieData = result.cookieData || {};
        const cookies = cookieData.cookies || [];
        cookies.forEach(cookie => {
          chrome.cookies.remove({ url: `https://${cookie.domain}${cookie.path}`, name: cookie.name });
        });
        chrome.storage.local.remove(['cookieData']);
        document.getElementById('info-text').textContent = 'Cookies cleared.';
      });
    });
  });
  