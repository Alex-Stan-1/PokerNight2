"use client";
import { useEffect, useState } from "react";
import { db } from "../utils/firebaseConfig";
import { collection, addDoc, onSnapshot } from "firebase/firestore";

export default function VillainGameDetails() {
    const [name, setName] = useState("");
    const [villain, setVillain] = useState("");
    const [guests, setGuests] = useState([]);

    useEffect(() => {
        const unsub = onSnapshot(collection(db, "villains"), (snapshot) => {
            setGuests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsub();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !villain) return;

        await addDoc(collection(db, "villains"), {
            name,
            villain
        });

        setName("");
        setVillain("");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-red-900 text-white px-6 py-12 flex flex-col items-center font-serif">
            <h1 className="text-4xl sm:text-6xl font-extrabold mb-6 text-yellow-200 drop-shadow-md">
                Villain’s Gathering
            </h1>

            <p className="text-lg text-center max-w-2xl mb-10 text-gray-300">
                🕷 Location: Shadow Hall | 🕰 Time: 7:00 PM | 🎭 Theme: Dark Carnival Elegance
            </p>

            <form onSubmit={handleSubmit} className="bg-black bg-opacity-50 p-6 rounded-xl shadow-lg border border-purple-700 w-full max-w-md mb-12">
                <h2 className="text-2xl font-bold mb-4 text-pink-400">Choose Your Villain</h2>
                <input
                    className="w-full mb-4 px-4 py-2 rounded bg-gray-900 text-white border border-gray-600 placeholder-gray-400"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    className="w-full mb-4 px-4 py-2 rounded bg-gray-900 text-white border border-gray-600 placeholder-gray-400"
                    placeholder="Villain Costume"
                    value={villain}
                    onChange={(e) => setVillain(e.target.value)}
                />
                <button className="w-full bg-purple-700 hover:bg-purple-800 text-white py-2 rounded transition">
                    Submit
                </button>
            </form>

            <div className="w-full max-w-xl bg-white bg-opacity-10 p-6 rounded-xl border border-yellow-500 shadow-inner">
                <h3 className="text-xl font-semibold text-yellow-300 mb-4">Whos Coming:</h3>
                <ul className="space-y-2">
                    {guests.map(({ id, name, villain }) => (
                        <li key={id} className="flex justify-between text-white bg-black bg-opacity-30 px-4 py-2 rounded-md">
                            <span>{name}</span>
                            <span className="italic text-pink-300">{villain}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
