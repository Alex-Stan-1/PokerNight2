import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

// IMPORTANT: Your collection is named "Character" (capital C)
const characterCollection = collection(db, "Character");

/**
 * Subscribe to all invited guests (real-time updates).
 * @param {(rows: Array) => void} onData
 * @returns {() => void} unsubscribe
 */
export const subscribeCharacters = (onData) => {
    return onSnapshot(characterCollection, (snapshot) => {
        const rows = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
        }));
        onData(rows);
    });
};

export const updateCharacterStatus = async (id, Status) => {
    const ref = doc(db, "Character", id);
    await updateDoc(ref, { Status });
};

export const updateCharacterChoice = async (id, Character) => {
    const ref = doc(db, "Character", id);
    await updateDoc(ref, { Character });
};
