async function uploadDataToDatabase(fileName, content) {
  const query = "INSERT INTO hl7_data (file_name, content) VALUES ($1, $2)";
  try {
    await client.query(query, [fileName, content]);
    console.log(`Data from ${fileName} inserted successfully.`);
  } catch (err) {
    console.error(`Error inserting data for file ${fileName}:`, err.message);
  }
}
