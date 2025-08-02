import { getFirestore, collection, getDocs, updateDoc, doc, query, where } from "firebase/firestore";
import firebaseApp from "./firebaseConfig";

const db = getFirestore(firebaseApp);
const playersCollection = collection(db, "players");

// **Fetch All Players from Firestore**
export const getPlayers = async () => {
    try {
        const querySnapshot = await getDocs(playersCollection);
        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error("Error fetching players:", error);
        return [];
    }
};

// **Update Player Status to 'confirmed' When They RSVP**
export const confirmRSVP = async (email) => {
    try {
        const q = query(playersCollection, where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const playerDoc = querySnapshot.docs[0]; // Get the matching player
            const playerRef = doc(db, "players", playerDoc.id);

            await updateDoc(playerRef, { status: "confirmed" });
            return true; // RSVP successful
        }
        return false; // Email not found
    } catch (error) {
        console.error("Error confirming RSVP:", error);
        return false;
    }
};