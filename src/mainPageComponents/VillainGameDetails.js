"use client";
import { useEffect, useState, useRef, useMemo } from "react";
import { db } from "../utils/firebaseConfig";
import { collection, doc, updateDoc, onSnapshot } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

/* -------------------------- Visual Variants -------------------------- */
const fadeIn = (delay = 0) => ({
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay } },
});

const stagger = {
    visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const cardHover = {
    rest: { y: 0, boxShadow: "0 10px 30px rgba(0,0,0,0.25)" },
    hover: { y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.35)" },
};

/* ---------------------------- Guest Card ---------------------------- */
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
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        if (isDropdownOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isDropdownOpen, setDropdownOpen]);

    return (
        <motion.div
            initial="rest"
            whileHover="hover"
            animate="rest"
            variants={cardHover}
            className={`group relative w-full sm:max-w-sm ${isDropdownOpen ? "z-50" : "z-10"}`}
        >
            {/* Glow ring */}
            <div
                className="pointer-events-none absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: "conic-gradient(from 180deg at 50% 50%, #8a2be2, #d4af37, #ff3cac, #8a2be2)" }}
            />
            {/* Card */}
            <div className="relative rounded-2xl border border-white/10 bg-[rgba(10,8,16,0.6)] backdrop-blur-xl p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                <div className="flex items-center justify-between mb-2">
                    <div className="text-lg font-semibold tracking-wide text-yellow-300">{name}</div>
                    <div className="h-2 w-2 rounded-full bg-fuchsia-400 shadow-[0_0_12px_#f0abfc]" />
                </div>

                {/* Status select */}
                <div className="relative mb-3" ref={dropdownRef}>
                    <button
                        onClick={() => setDropdownOpen(!isDropdownOpen)}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-left text-white hover:bg-white/10 transition flex items-center justify-between"
                        aria-haspopup="listbox"
                        aria-expanded={isDropdownOpen}
                    >
                        <span className="text-sm">{status || "Select Status"}</span>
                        <svg className="h-4 w-4 opacity-70" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z" />
                        </svg>
                    </button>

                    <AnimatePresence>
                        {isDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 6 }}
                                transition={{ duration: 0.12 }}
                                className="absolute z-[999] mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-[#141126] shadow-2xl"
                                role="listbox"
                            >
                                {["Pending", "Accepted", "Declined"].map((s) => (
                                    <button
                                        key={s}
                                        className={`w-full px-4 py-2.5 text-left text-sm transition hover:bg-white/10 ${status === s ? "text-yellow-400 font-semibold" : "text-white"
                                            }`}
                                        onClick={() => {
                                            setDropdownOpen(false);
                                            onStatusChange(id, s);
                                        }}
                                        role="option"
                                        aria-selected={status === s}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Villain editor */}
                {!isEditingVillain ? (
                    <button
                        onClick={() => setEditingVillain(true)}
                        className={`w-full rounded-xl px-4 py-2.5 text-sm transition border ${villain
                                ? "border-purple-500/40 bg-purple-700/20 hover:bg-purple-700/30"
                                : "border-white/10 bg-white/5 hover:bg-white/10"
                            } text-white`}
                        title="Choose your Disney villain"
                    >
                        {villain || "Click here to choose Disney Villain"}
                    </button>
                ) : (
                    <div className="flex flex-col gap-2">
                        <input
                            type="text"
                            className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-fuchsia-500/40"
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
                                className="rounded-lg bg-emerald-600 px-4 py-1.5 text-sm text-white hover:bg-emerald-700"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => {
                                    onVillainChange(id, ""); // clear the input
                                    setEditingVillain(false);
                                }}
                                className="rounded-lg bg-white/10 px-4 py-1.5 text-sm text-white hover:bg-white/15"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

/* --------------------------- Main Component --------------------------- */
export default function VillainsInvite() {
    const [guests, setGuests] = useState([]);
    const [villainEdits, setVillainEdits] = useState({});
    const [editingVillainStates, setEditingVillainStates] = useState({});
    const [statusDropdownStates, setStatusDropdownStates] = useState({});

    // Inter (cleaner) + a little flair; keeps your existing font preference
    useEffect(() => {
        const link = document.createElement("link");
        link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap";
        link.rel = "stylesheet";
        document.head.appendChild(link);
    }, []);

    useEffect(() => {
        const unsub = onSnapshot(collection(db, "villains"), (snapshot) => {
            const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
            setGuests(data);
            setVillainEdits(Object.fromEntries(data.map(({ id, Villain }) => [id, Villain || ""])));
        });
        return () => unsub();
    }, []);

    const handleVillainChange = (id, value) => {
        setVillainEdits((prev) => ({ ...prev, [id]: value }));
    };

    const handleVillainSubmit = async (id) => {
        const newName = villainEdits[id]?.trim();
        if (newName !== undefined) await updateDoc(doc(db, "villains", id), { Villain: newName });
    };

    // Simple computed counts for a header badge vibe
    const counts = useMemo(() => {
        const total = guests.length || 0;
        const accepted = guests.filter((g) => g.Status === "Accepted").length;
        const pending = guests.filter((g) => g.Status === "Pending").length;
        const declined = guests.filter((g) => g.Status === "Declined").length;
        return { total, accepted, pending, declined };
    }, [guests]);

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="min-h-screen font-[Inter] text-white text-[17px] relative overflow-hidden"
        >
            {/* Layered villainy background */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                {/* gradient base */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0b001a] via-[#21002f] to-[#3a042a]" />
                {/* vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_30%,rgba(255,0,180,0.16),transparent)]" />
                {/* moving glints */}
                <motion.div
                    className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-fuchsia-500/15 blur-3xl"
                    animate={{ y: [0, 20, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-yellow-500/10 blur-3xl"
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />
                {/* subtle noise */}
                <div
                    className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
                    style={{
                        backgroundImage:
                            "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22><filter id=%22n%22 x=%220%22 y=%220%22 width=%22100%25%22 height=%22100%25%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.7%22 numOctaves=%222%22 stitchTiles=%22stitch%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%220.15%22/></svg>')",
                    }}
                />
            </div>

            {/* Header / Hero */}
            <header className="relative px-4 py-16 sm:py-20">
                <div className="mx-auto max-w-4xl">
                    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-10 text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-4xl sm:text-6xl font-extrabold leading-tight"
                        >
                            <span className="block text-yellow-400 drop-shadow-[0_0_12px_rgba(255,215,0,0.25)]">
                                Stanimal&apos;s
                            </span>
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-fuchsia-300 to-pink-200">
                                Invitational
                            </span>
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="mt-8 flex justify-center"
                        >
                            <img
                                src="/Hexley holding a number 2.png"
                                alt="Hexley"
                                className="w-40 sm:w-56 md:w-64 drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
                            />
                        </motion.div>
                    </div>
                </div>
            </header>

            {/* Welcome */}
            <section className="px-4 py-12 sm:py-16">
                <motion.div variants={fadeIn(0.05)} className="mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-yellow-400">Welcome</h2>
                    <p className="mt-4 text-lg sm:text-xl text-white/85">
                        Congradulations, You&apos;ve made it to the <br />
                        <span className="text-yellow-300 font-semibold">2nd Stanimal&apos;s Invitational</span>
                    </p>
                </motion.div>
            </section>

            {/* Details */}
            <section className="px-4 pb-4 sm:pb-8">
                <motion.div
                    variants={fadeIn(0.05)}
                    className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-10"
                >
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-yellow-400 text-center">The Details</h3>
                    <p className="mt-4 text-center text-base sm:text-lg text-white/85">
                        Texas Hold’em — No buy-in, just good vibes. Drinks are on the house. Pizza’s on me.
                    </p>

                    <div className="mt-6 grid gap-6 sm:grid-cols-3">
                        <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                            <p className="text-sm font-semibold text-white mb-1">🎭 Dress Code</p>
                            <p className="text-sm text-white/85">
                                Come dressed as your chosen <span className="text-yellow-300 font-semibold">Disney Villain</span>. You may
                                update your villain before the event—but <span className="text-red-300 font-bold">no duplicates allowed</span>. Strictly Disney:
                                <span className="text-pink-300 font-semibold"> Marvel and Star Wars villains do not count</span>.
                            </p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                            <p className="text-sm font-semibold text.white mb-1">📍 Location</p>
                            <p className="text-sm text-white/85">701 Martha Ave, APT 3119, Lancaster, PA 17601</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                            <p className="text-sm font-semibold text-white mb-1">⏰ Start Time</p>
                            <p className="text-sm text-white/85">November 14th @ 6:00 PM</p>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* RSVP */}
            <section className="px-4 py-14 sm:py-16">
                <motion.h3 variants={fadeIn(0.05)} className="text-center text-2xl sm:text-3xl font-extrabold text-yellow-400 mb-8">
                    RSVP
                </motion.h3>

                <motion.div
                    variants={stagger}
                    className="mx-auto grid max-w-6xl gap-6 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]"
                >
                    {guests.map((guest, idx) => (
                        <motion.div
                            variants={fadeIn(0.03 * (idx % 10))}
                            key={guest.id}
                            className="relative"
                        >
                            <GuestCard
                                id={guest.id}
                                name={guest.Name}
                                status={guest.Status}
                                villain={villainEdits[guest.id]}
                                onStatusChange={(id, newStatus) => updateDoc(doc(db, "villains", id), { Status: newStatus })}
                                onVillainChange={handleVillainChange}
                                onVillainSubmit={handleVillainSubmit}
                                isEditingVillain={!!editingVillainStates[guest.id]}
                                setEditingVillain={(editing) => setEditingVillainStates((p) => ({ ...p, [guest.id]: editing }))}
                                isDropdownOpen={!!statusDropdownStates[guest.id]}
                                setDropdownOpen={(open) => setStatusDropdownStates((p) => ({ ...p, [guest.id]: open }))}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* Villain Inspiration */}
            <section className="px-4 pb-24">
                <motion.h3 variants={fadeIn(0.05)} className="text-center text-2xl sm:text-3xl font-extrabold text-yellow-400 mb-8">
                    Villain Inspiration
                </motion.h3>

                <div className="mx-auto max-w-6xl">
                    <div className="flex snap-x snap-mandatory overflow-x-auto gap-6 pb-2 sm:grid sm:grid-cols-5 sm:overflow-visible sm:gap-8">
                        {[
                            { name: "Captain Hook", file: "Hexley_Hook" },
                            { name: "Ursula", file: "Hexley_Ursula" },
                            { name: "Cruella", file: "Hexley_Cruella" },
                            { name: "Jafar", file: "Hexley_Aladin" },
                            { name: "Lotso", file: "Hexley_Lotso" },
                        ].map(({ name, file }, i) => (
                            <motion.div key={name} variants={fadeIn(0.04 * i)} className="snap-start shrink-0 w-[72%] sm:w-auto">
                                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-3">
                                    <img
                                        src={`/${file}.png`}
                                        alt={name}
                                        className="rounded-lg transition-transform duration-300 hover:scale-[1.03] w-full h-auto"
                                        draggable={false}
                                    />
                                    <div className="mt-3 text-center text-sm font-semibold text-yellow-300">{name}</div>
                                    {/* tiny glow */}
                                    <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </motion.div>
    );
}
