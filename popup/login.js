document
  .getElementById("login-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    chrome.storage.local.get("user", function (result) {
      if (
        result.user &&
        result.user.email === email &&
        result.user.password === password
      ) {
        alert("Login successful!");
        chrome.storage.local.set({ loggedInUser: email }, function () {
          window.location.href = "popup.html";
        });
      } else {
        alert("Invalid email or password.");
      }
    });
  });
