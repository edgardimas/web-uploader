function parseR01Content(data) {
  const result = {};
  const sections = data.split(/\[(.*?)\]/g).filter(Boolean);

  for (let i = 0; i < sections.length; i += 2) {
    const section = sections[i].trim();
    const content = sections[i + 1].trim();

    const lines = content.split("\n");
    lines.forEach((line) => {
      const [key, value] = line.split("=").map((x) => x.trim());
      if (key && value) {
        result[key] = value;
      }
    });
  }

  return result;
}

module.exports = parseR01Content;
