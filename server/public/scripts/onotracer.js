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
    <table border="1">
      <thead>
        <tr>
          <th>ID</th>
          <th>ONO</th>
          <th>Name</th>
          <th>PID</th>
          <th>Order Control</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
  `;

  data.forEach((item) => {
    tableHTML += `
      <tr>
        <td>${item.id}</td>
        <td>${item.ono}</td>
        <td>${item.name}</td>
        <td>${item.pid}</td>
        <td>${item.order_control}</td>
        <td>${item.status || "Status"}</td>
        <td>
          <button onclick="editButtonHandler(event, '${item.his_code}', '${
      item.lis_code
    }')">Details</button>
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

function resetSearch() {
  // Show the original table and pagination
  document.querySelector(".ono-tracer-table").style.display = "table";
  document.querySelector(".pagination").style.display = "block";

  // Clear search results
  document.getElementById("searchResults").innerHTML = "";
  document.getElementById("searchInput").value = "";
}
