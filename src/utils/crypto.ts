import CryptoJS from "crypto-js"

// derive key from PIN
export const getKey = (pin: string) =>
  CryptoJS.SHA256(pin).toString()

export const encrypt = (text: string, pin: string) => {
  const key = getKey(pin)
  return CryptoJS.AES.encrypt(text, key).toString()
}

export const decrypt = (cipher: string, pin: string) => {
  try {
    const key = getKey(pin)
    const bytes = CryptoJS.AES.decrypt(cipher, key)
    return bytes.toString(CryptoJS.enc.Utf8)
  } catch {
    return null
  }
}

// hash PIN (store this only)
export const hashPin = (pin: string) =>
  CryptoJS.SHA256(pin).toString()