import * as fs from 'fs';
import * as mammoth from 'mammoth';

async function extract() {
  try {
    const result = await mammoth.extractRawText({ path: "./Airtel_SOW_Final.docx" });
    const text = result.value; // The raw text
    fs.writeFileSync("./Airtel_SOW_Final.txt", text, "utf-8");
    console.log("Success! Extracted bytes:", text.length);
  } catch (error) {
    console.error("Error extracting docx:", error);
  }
}

extract();
