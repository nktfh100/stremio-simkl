import crypto from "crypto";

const algorithm = "aes-192-cbc";
let key: Buffer;

export function initEncryption() {
	const envKey = process.env.ENCRYPTION_KEY;
	const envSalt = process.env.ENCRYPTION_SALT;
	if (!envKey || !envSalt) {
		throw new Error("Encryption key or salt not found!");
	}

	key = crypto.scryptSync(envKey, envSalt, 24);
}

export function encrypt(data: string): string {
	try {
		const iv = crypto.randomBytes(16);
		const cipher = crypto.createCipheriv(algorithm, key, iv);
		const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
		return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
	} catch (error) {
		console.log("Error encrypting data", error);
		return "";
	}
}

export function decrypt(data: string): string {
	try {
		const [iv, encrypted] = data.split(":");
		const decipher = crypto.createDecipheriv(
			algorithm,
			key,
			Buffer.from(iv, "hex")
		);
		const decrypted = Buffer.concat([
			decipher.update(Buffer.from(encrypted, "hex")),
			decipher.final(),
		]);
		return decrypted.toString();
	} catch (error) {
		console.log("Error decrypting data", error);
		return "";
	}
}

export function generateEncryptedConfig(simklAccessToken: string): string {
	const encryptedData = encrypt(simklAccessToken);
	return encryptedData;
}

export function decryptConfig(encryptedData: string): { simklToken: string } {
	const dataStr = decrypt(encryptedData);

	return {
		simklToken: dataStr,
	};
}

// function generateEncKey() {
// 	return generateKeySync("aes", { length: 256 }).export().toString("hex");
// }
