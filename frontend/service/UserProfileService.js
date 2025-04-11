const DB_NAME = 'HealthHubDB';
const STORE_NAME = 'UserProfile';

export default class UserProfileService {
    async openDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, 1);
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: "id" });
                }
            };
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async get() {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, "readonly");
            const store = tx.objectStore(STORE_NAME);
            const request = store.get("profile");
            request.onsuccess = () => resolve(request.result?.data || {});
            request.onerror = () => reject(request.error);
        });
    }

    async save(data) {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, "readwrite");
            const store = tx.objectStore(STORE_NAME);
            const request = store.put({ id: "profile", data });
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
}
