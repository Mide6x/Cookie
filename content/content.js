chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "checkCookies") {
    const domain = new URL(request.url).hostname;

    const allCookies = JSON.parse(localStorage.getItem("cookieData")) || [];
    const currentDomainData = allCookies.find((data) => data.domain === domain);

    if (currentDomainData) {
      console.log(
        `Found ${currentDomainData.cookies.length} cookies for ${domain}`
      );
      sendResponse({ cookies: currentDomainData.cookies });
    } else {
      sendResponse({ cookies: [] });
    }
  }
});
