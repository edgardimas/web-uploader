// Function to check if the user is authenticated
function checkAuth() {
  const token = localStorage.getItem("access_token");
  return token;
}

// Function to handle Test Mapping link click and send token via fetch
async function handleTestMappingClick(event) {
  event.preventDefault(); // Prevent default link behavior
  const token = checkAuth();
  if (!token) {
    // If no token, redirect to login
    window.location.href = "/view/login";
    return;
  }

  // Send token to the server using fetch
  try {
    const response = await fetch("/view/authen", {
      method: "GET", // Send as GET request
      headers: {
        access_token: `${token}`, // Send token in the header
      },
    });
    if (response.ok) {
      // Redirect to the test mappings page if authentication is successful
      window.location.href = "/view/testmappings";
    } else {
      window.location.href = "/view/login";
      console.log(response);
    }
  } catch (error) {
    console.error("Error with fetch:", error);
    window.location.href = "/view/login"; // Redirect to login if there's an error
  }
}

async function fetchLogs() {
  try {
    const response = await fetch("/view/data", {
      method: "GET",
    });

    const data = await response.json();

    // Update Order Logs
    const orderLogContainer = document.getElementById("orderLogs");
    orderLogContainer.innerHTML = ""; // Clear current logs
    data.orderLogs.forEach((log) => {
      const logItem = document.createElement("li");
      logItem.textContent = `${log.time} ${log.msg}`;
      orderLogContainer.appendChild(logItem);
    });

    // Update Result Logs
    const resultLogContainer = document.getElementById("resultLogs");
    resultLogContainer.innerHTML = ""; // Clear current logs
    data.resultLogs.forEach((log) => {
      const logItem = document.createElement("li");
      logItem.textContent = `${log.time} ${log.msg}`;
      resultLogContainer.appendChild(logItem);
    });
  } catch (error) {
    console.error("Error fetching logs:", error);
  }
}

window.onload = () => {
  fetchLogs();
};

setInterval(fetchLogs, 2000);
