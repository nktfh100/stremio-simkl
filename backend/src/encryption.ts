import crypto from "crypto";
import { CatalogType, allCatalogs, catalogToInt } from "shared/catalogs";
import { getConfig } from "./lib/config";

const algorithm = "aes-192-cbc";
let key: Buffer;

type ConfigData = {
  simklToken: string;
  selectedCatalogs: CatalogType[];
};

type EncryptedConfig = {
  simklToken: string;
  selectedCatalogs: string;
};

export function initEncryption() {
  const envKey = getConfig().encryption.key;
  const envSalt = getConfig().encryption.salt;

  if (!envKey || !envSalt) {
    throw new Error("Encryption key or salt not found!");
  }

  key = crypto.scryptSync(envKey, envSalt, 24);
}

export function encrypt(data: EncryptedConfig): string {
  try {
    const dataStr = JSON.stringify(data);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const encrypted = Buffer.concat([cipher.update(dataStr), cipher.final()]);
    return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
  } catch (error) {
    console.log("Error encrypting data", error);
    return "";
  }
}

export function decrypt(data: string): EncryptedConfig | string {
  try {
    const [iv, encrypted] = data.split(":");
    const decipher = crypto.createDecipheriv(
      algorithm,
      key,
      Buffer.from(iv, "hex"),
    );
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encrypted, "hex")),
      decipher.final(),
    ]);

    // For backwards compatibility
    try {
      const parsed = JSON.parse(decrypted.toString());
      if (
        typeof parsed === "object" &&
        parsed !== null &&
        "simklToken" in parsed &&
        "selectedCatalogs" in parsed
      ) {
        return parsed;
      }
    } catch {}

    return decrypted.toString();
  } catch (error) {
    console.log("Error decrypting data", error);
    return { simklToken: "", selectedCatalogs: "" };
  }
}

export function generateEncryptedConfig(
  simklToken: string,
  selectedCatalogs: CatalogType[],
): string {
  const selectedCatalogsMinimized = Array.from(
    new Set(selectedCatalogs.map(catalogToInt)),
  ).join("");

  const encryptedData = encrypt({
    simklToken,
    selectedCatalogs: selectedCatalogsMinimized,
  });

  return encryptedData;
}

export function decryptConfig(encryptedData: string): ConfigData {
  const data = decrypt(encryptedData);

  if (typeof data === "string") {
    return { simklToken: data, selectedCatalogs: allCatalogs };
  }

  const selectedCatalogsParsed = data.selectedCatalogs
    .split("")
    .map((c) => allCatalogs[parseInt(c)]);

  return {
    simklToken: data.simklToken,
    selectedCatalogs: selectedCatalogsParsed,
  };
}

// function generateEncKey() {
// 	return generateKeySync("aes", { length: 256 }).export().toString("hex");
// }
