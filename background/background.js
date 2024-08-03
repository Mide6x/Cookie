chrome.webNavigation.onCompleted.addListener(async (details) => {
  const url = new URL(details.url);
  const domain = url.hostname;

  // Check both domain and www.domain
  const domainsToCheck = [domain, `www.${domain}`];

  for (const d of domainsToCheck) {
    // Fetch cookies for the current domain
    chrome.cookies.getAll({ domain: d }, (cookies) => {
      if (cookies) {
        console.log(`Retrieved cookies for ${d}:`, cookies);

        // If cookies are found, store them
        if (cookies.length > 0) {
          saveCookieData(d, cookies);

          // Call OpenAI API to check for similar domains
          checkSimilarDomains(domain).then((similarDomains) => {
            similarDomains.forEach((similarDomain) => {
              // Check for cookies in similar domains
              chrome.cookies.getAll(
                { domain: similarDomain },
                (similarCookies) => {
                  if (similarCookies) {
                    console.log(
                      `Retrieved cookies for similar domain ${similarDomain}:`,
                      similarCookies
                    );

                    if (similarCookies.length > 0) {
                      chrome.action.setBadgeText({ text: "!" });
                      chrome.action.setTitle({
                        title: `Clear cookies for ${similarDomain}`,
                      });
                    }
                  }
                }
              );
            });
          });
        } else {
          chrome.action.setBadgeText({ text: "" });
        }
      } else {
        console.error(`No cookies found for ${d}`);
      }
    });
  }
});

async function checkSimilarDomains(domain) {
  try {
    const response = await fetch(
      "https://api.openai.com/v1/engines/davinci/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer YOUR_OPENAI_API_KEY`, // Add your OpenAI API key here
        },
        body: JSON.stringify({
          prompt: `Find domains similar to ${domain}`,
          max_tokens: 50,
        }),
      }
    );
    const data = await response.json();
    return data.choices[0].text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line);
  } catch (error) {
    console.error("Error checking similar domains:", error);
    return [];
  }
}

function saveCookieData(domain, cookies) {
  const cookieData = {
    domain: domain,
    cookies: cookies,
  };
  let allCookies = JSON.parse(localStorage.getItem("cookieData")) || [];
  // Check if the domain already exists in local storage
  const index = allCookies.findIndex((data) => data.domain === domain);
  if (index > -1) {
    allCookies[index] = cookieData; // Update existing domain
  } else {
    allCookies.push(cookieData); // Add new domain
  }
  localStorage.setItem("cookieData", JSON.stringify(allCookies));
}
