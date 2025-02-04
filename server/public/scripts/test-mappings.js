async function checkAuth() {
  console.log("checkauth");
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

function editButtonHandler(event, his_code, lis_code) {
  event.preventDefault();
  window.location.href = `/view/tmeditform?his_code=${his_code}&lis_code=${lis_code}`;
}

function filterTableHIS() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const rows = document.querySelectorAll("#tableBody tr");

  rows.forEach((row) => {
    const hisCodeText =
      row.querySelector("td:nth-child(1)")?.textContent.toLowerCase() || "";
    const lisCodeText =
      row.querySelector("td:nth-child(2)")?.textContent.toLowerCase() || "";

    // Show row if either HIS Code or LIS Code matches input
    row.style.display =
      hisCodeText.includes(input) || lisCodeText.includes(input) ? "" : "none";
  });
}
window.onload = checkAuth;
