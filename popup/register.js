document
  .getElementById("register-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    chrome.storage.local.set(
      { user: { email, password, cookieData: {} } },
      function () {
        alert("Registration successful!");
        window.location.href = "login.html";
      }
    );
  });
