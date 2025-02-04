async function checkAuth() {
  const token = localStorage.getItem("access_token");
  if (!token) {
    window.location.href = "/view/login";
    return;
  }

  try {
    const response = await fetch("/view/authen", {
      method: "GET",
      headers: {
        access_token: token,
      },
    });
    if (!response.ok) {
      window.location.href = "/view/login";
    }
  } catch (err) {
    console.error("Error validating token:", err);
    window.location.href = "/view/login";
  }
}

window.onload = checkAuth;
