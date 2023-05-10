import * as CryptoJS from 'crypto-js';
export const getOriginalToken = () => {
    const localStorageItems = localStorage.getItem('persist:root');
    if (localStorageItems) {
        const localStorageItemsParse = JSON.parse(localStorageItems);
        const EncryptedToken = JSON.parse(localStorageItemsParse.auth).token;

        if (!EncryptedToken || typeof EncryptedToken !== 'string') {
            return null;
        }

        const decryptedBytes = CryptoJS.AES.decrypt(EncryptedToken, process.env.REACT_APP_SECRET_KEY);
        const OriginalToken = decryptedBytes.toString(CryptoJS.enc.Utf8);

        return OriginalToken;
    }
    return null;
};
