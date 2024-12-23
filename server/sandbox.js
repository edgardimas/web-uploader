const data = "Some text [section 1] other text [Section 2] more text";

const newData = data.split(/\[(.*?)\]/).filter(Boolean);

console.log(newData);
