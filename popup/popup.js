document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["loggedInUser"], (result) => {
    if (result.loggedInUser) {
      chrome.storage.local.get(["cookieData"], (result) => {
        const cookieData = result.cookieData || { count: 0, cookies: [] };
        document.getElementById(
          "info-text"
        ).textContent = `You have ${cookieData.count} cookies from this site.`;
      });
    } else {
      window.location.href = "login.html";
    }
  });

  // Add event listener for the "Clear Cookies" button
  document.getElementById("clear-cookies").addEventListener("click", () => {
    chrome.storage.local.get(["cookieData"], (result) => {
      const cookieData = result.cookieData || {};
      const cookies = cookieData.cookies || [];
      cookies.forEach((cookie) => {
        chrome.cookies.remove({
          url: `https://${cookie.domain}${cookie.path}`,
          name: cookie.name,
        });
      });
      chrome.storage.local.remove(["cookieData"]);
      document.getElementById("info-text").textContent = "Cookies cleared.";
    });
  });
});
