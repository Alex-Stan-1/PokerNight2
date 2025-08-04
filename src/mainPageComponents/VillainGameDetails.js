"use client";
import { useEffect, useState, useRef } from "react";
import { db } from "../utils/firebaseConfig";
import { collection, doc, updateDoc, onSnapshot } from "firebase/firestore";
import { motion } from "framer-motion";


function GuestCard({
    id,
    name,
    status,
    villain,
    onStatusChange,
    onVillainChange,
    onVillainSubmit,
    isEditingVillain,
    setEditingVillain,
    isDropdownOpen,
    setDropdownOpen,
}) {
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDropdownOpen]);

    return (
        <div className="bg-[#1a1a2e] border border-purple-700 rounded-xl p-5 w-full sm:max-w-sm flex flex-col gap-4 shadow-lg hover:shadow-purple-500/20 transition-shadow duration-300">
            <div className="text-xl font-semibold text-yellow-300 tracking-wide text-center">{name}</div>

            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setDropdownOpen(!isDropdownOpen)}
                    className="w-full bg-[#2f2f46] text-white px-4 py-2 rounded-lg hover:bg-[#3f3f5e] transition"
                >
                    {status || "Select Status"} <span className="ml-2">&#9662;</span>
                </button>

                {isDropdownOpen && (
                    <div className="absolute z-10 mt-2 bg-[#2f2f46] border border-purple-600 rounded-lg w-full overflow-hidden">
                        {["Pending", "Accepted", "Declined"].map((s) => (
                            <button
                                key={s}
                                className={`w-full text-left px-4 py-2 hover:bg-[#4f4f6f] transition ${status === s ? "text-yellow-400 font-bold" : "text-white"}`}
                                onClick={() => {
                                    setDropdownOpen(false);
                                    onStatusChange(id, s);
                                }}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div>
                {!isEditingVillain ? (
                    <button
                        onClick={() => setEditingVillain(true)}
                        className={`w-full ${villain ? "bg-purple-700 hover:bg-purple-800" : "bg-gray-800 hover:bg-gray-700"} text-white px-4 py-2 rounded-lg transition`}
                    >
                        {villain || "Click here to choose Disney Villain"}
                    </button>
                ) : (
                    <div className="flex flex-col gap-2">
                        <input
                            type="text"
                            className="px-3 py-2 rounded bg-gray-800 border border-gray-600 text-white"
                            placeholder="Enter villain name"
                            value={villain}
                            onChange={(e) => onVillainChange(id, e.target.value)}
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    onVillainSubmit(id);
                                    setEditingVillain(false);
                                }}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded text-sm"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setEditingVillain(false)}
                                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-1 rounded text-sm"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>

    );
}

export default function VillainsInvite() {
    const [guests, setGuests] = useState([]);
    const [villainEdits, setVillainEdits] = useState({});
    const [editingVillainStates, setEditingVillainStates] = useState({});
    const [statusDropdownStates, setStatusDropdownStates] = useState({});

    useEffect(() => {
        // Load Inter font
        const link = document.createElement("link");
        link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap";
        link.rel = "stylesheet";
        document.head.appendChild(link);
    }, []);

    useEffect(() => {
        const unsub = onSnapshot(collection(db, "villains"), (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setGuests(data);
            setVillainEdits(
                Object.fromEntries(data.map(({ id, Villain }) => [id, Villain || ""]))
            );
        });
        return () => unsub();
    }, []);

    const handleVillainChange = (id, value) => {
        setVillainEdits((prev) => ({ ...prev, [id]: value }));
    };

    const handleVillainSubmit = async (id) => {
        const newName = villainEdits[id]?.trim();
        if (newName !== undefined) {
            await updateDoc(doc(db, "villains", id), { Villain: newName });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="min-h-screen text-white font-[Inter] text-[17px] bg-gradient-to-br from-[#1b0034] via-[#2e004f] to-[#420024]"
        >
            <header className="w-full bg-black py-16 px-4 flex justify-center items-center relative">
                <div className="flex items-center justify-center">
                    <div className="hidden md:block w-48" />
                    <div className="text-center z-10">
                        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-yellow-500 leading-snug">
                            <div className="text-yellow-400">Stanimal&apos;s</div>
                            <div className="text-yellow-300">Invitational</div>
                        </h1>
                        <div className="block md:hidden mt-4">
                            <img src="/Hexley holding a number 2.png" alt="Hexley" className="w-32 mx-auto" />
                        </div>
                    </div>
                    <div className="hidden md:block -ml-[0.1rem]">
                        <img src="/Hexley holding a number 2.png" alt="Hexley" className="w-36 md:w-40 lg:w-48" />
                    </div>
                </div>
            </header>

            <div>
                {/* Welcome Section */}
                <section className="text-center py-20 px-6 text-white space-y-6">
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-yellow-400">Welcome</h2>
                    <p className="max-w-3xl mx-auto text-lg sm:text-xl text-gray-300">
                        Congradulations, You&apos;ve made it to the <br /><span className="text-yellow-500 font-semibold">2nd Stanimal&apos;s Invitational</span> <br />
                    </p>
                </section>

                {/* Details Section */}
                <section className="text-center px-6 py-12 text-white space-y-6">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-yellow-400">The Details</h2>
                    <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-300">
                        Texas Hold’em — No buy-in, just good vibes. Drinks are on the house. Pizza’s on me.
                    </p>
                    <div className="space-y-4 text-gray-300 text-md sm:text-lg bg-[#2e004f]/30 d">
                        <div>
                            <p className="text-white font-semibold mb-1">🎭 Dress Code</p>
                            <p>
                                Come dressed as your chosen <span className="text-yellow-400 font-semibold">Disney Villain</span>.
                                You may update your villain before the event—but <span className="text-red-400 font-bold">no duplicates allowed</span>.
                                Strictly Disney: <span className="text-pink-400 font-semibold">Marvel and Star Wars villains do not count</span>.

                            </p>
                        </div>
                        <p>📍 <span className="text-white font-semibold">Location<br/></span> 701 Martha Ave, APT 3119, Lancaster, PA 17601</p>
                        <p>⏰ <span className="text-white font-semibold">Start Time<br /></span> November 14th @ 6:00 PM</p>
                    </div>
                </section>

                {/* RSVP Section */}
                <section className="py-16 px-6 text-white">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-yellow-400 text-center mb-10">RSVP</h2>
                    <div
                        className="grid justify-center gap-6"
                        style={{
                            gridTemplateColumns: "repeat(auto-fit, 300px)",
                            justifyContent: "center",
                            display: "grid",
                        }}
                    >
                        {guests.map((guest) => (
                            <GuestCard
                                key={guest.id}
                                id={guest.id}
                                name={guest.Name}
                                status={guest.Status}
                                villain={villainEdits[guest.id]}
                                onStatusChange={(id, newStatus) =>
                                    updateDoc(doc(db, "villains", id), { Status: newStatus })
                                }
                                onVillainChange={handleVillainChange}
                                onVillainSubmit={handleVillainSubmit}
                                isEditingVillain={!!editingVillainStates[guest.id]}
                                setEditingVillain={(editing) =>
                                    setEditingVillainStates((prev) => ({ ...prev, [guest.id]: editing }))
                                }
                                isDropdownOpen={!!statusDropdownStates[guest.id]}
                                setDropdownOpen={(open) =>
                                    setStatusDropdownStates((prev) => ({ ...prev, [guest.id]: open }))
                                }
                            />
                        ))}
                    </div>
                </section>

                {/* Villain Inspiration Section */}
                <section className="py-16 px-6 text-white text-center">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-yellow-400 mb-10">
                        Villain Inspiration
                    </h2>
                    <div className="flex flex-wrap justify-center gap-10">
                        {[
                            { name: "Captain Hook", file: "Hexley_Hook" },
                            { name: "Ursula", file: "Hexley_Ursula" },
                            { name: "Cruella", file: "Hexley_Cruella" },
                            { name: "Aladdin", file: "Hexley_Aladin" },
                            { name: "Lotso", file: "Hexley_Lotso" },
                        ].map(({ name, file }) => (
                            <div key={name} className="max-w-xs">
                                <img
                                    src={`/${file}.png`}
                                    alt={name}
                                    className="rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
                                />
                                <p className="mt-3 text-lg font-semibold text-yellow-300">{name}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </motion.div>
    );
}
