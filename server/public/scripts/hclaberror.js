function saveChanges() {
  const editedText = document.getElementById("editableText").innerText;
  const ono = document.getElementById("ono").value;
  fetch("/orders/error-edit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: editedText, ono }),
  })
    .then((response) => response.json())
    .then((data) => alert("Saved successfully!"))
    .catch((error) => console.error("Error:", error));
}
