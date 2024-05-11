import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function loadFileAsBase64(
    imageFilePathLocal: string,
): Promise<[string | null, unknown | null]> {
    const imageFilePathAbsolute = `${__dirname}${imageFilePathLocal}`;
    try {
        const data = await fs.promises.readFile(imageFilePathAbsolute);
        const base64String = Buffer.from(data).toString("base64");
        return [base64String, null];
    } catch (error) {
        return [null, error];
    }
}

export default loadFileAsBase64;
