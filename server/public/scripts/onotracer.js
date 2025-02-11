function handleKeyPress(event) {
  if (event.key === "Enter") {
    searchByOno(); // Call function when Enter is pressed
  }
}

async function searchByOno() {
  const ono = document.getElementById("searchInput").value.trim();
  const tableContainer = document.querySelector(".ono-tracer-table"); // Original Table
  const pagination = document.querySelector(".pagination"); // Pagination

  if (!ono) {
    alert("Please enter an ONO to search.");
    return;
  }

  try {
    const response = await fetch(`/orders/${ono}`);
    if (!response.ok) {
      throw new Error("Order not found.");
    }

    const data = await response.json();

    // Hide the original table and pagination
    tableContainer.style.display = "none";
    pagination.style.display = "none";
    // Show search results
    displaySearchResults(data);
  } catch (error) {
    document.getElementById(
      "searchResults"
    ).innerHTML = `<p style="color: red;">${error.message}</p>`;
  }
}

function displaySearchResults(data) {
  const searchResults = document.getElementById("searchResults");

  if (data.length === 0) {
    searchResults.innerHTML = "<p>No results found.</p>";
    return;
  }

  let tableHTML = `
    <table class="ono-tracer-table" border="1">
        <thead>
          <tr>
            <th>id</th>
            <th>Ono</th>
            <th>Name</th>
            <th>PID</th>
            <th>Control</th>
            <th>is_received</th>
            <th>is_ok</th>
          </tr>
        </thead>
        <tbody id="tableBody">
  `;

  data.forEach((item) => {
    tableHTML += `
      <tr>
        <td>${item.id}</td>
        <td>${item.ono}</td>
        <td>${item.name}</td>
        <td>${item.pid}</td>
        <td>${item.order_control}</td>
        <td class="center-icon">
            ${
              item.is_received
                ? '<span style="color: green;">✅</span>'
                : '<span style="color: red;">❌</span>'
            }
        </td>
        <td class="center-icon">
            ${
              item.is_ok
                ? '<span style="color: green;">✅</span>'
                : `<button onclick="isOkErrButtonHandler(event, '${item.ono}')" 
                        style="color: red; padding: 0; border: none; background: none">
                  ❌
                </button>`
            }
        </td>
      </tr>
    `;
  });

  tableHTML += `</tbody></table>`;

  // Show search results
  searchResults.innerHTML = `
    <button onclick="resetSearch()">Back</button>
    ${tableHTML}
  `;
}

function isOkErrButtonHandler(event, ono) {
  event.preventDefault();
  console.log("isokebutton");
  window.location.href = `/view/hclaberror/${ono}`; // Redirect to the error handler page
}

function resetSearch() {
  // Restore visibility of the original table
  location.reload(); // Reloads the page to restore the table
}
