"use client";
import { useEffect, useState, useRef, useMemo } from "react";
import { db } from "../utils/firebaseConfig";
import { collection, doc, updateDoc, onSnapshot } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

/* -------------------------- Visual Variants -------------------------- */
const fadeIn = (delay = 0) => ({
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay } },
});

const stagger = {
    visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const cardHover = {
    rest: { y: 0, boxShadow: "0 10px 30px rgba(0,0,0,0.25)" },
    hover: { y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.4)" },
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
            {/* racing glow border */}
            <div
                className="pointer-events-none absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                    background:
                        "conic-gradient(from 180deg at 50% 50%, #ff3b3b, #ffd447, #00b0ff, #a855f7, #ff3b3b)",
                }}
            />
            {/* card body */}
            <div className="relative rounded-2xl border border-white/15 bg-[rgba(6,10,24,0.94)] backdrop-blur-xl p-5 shadow-[0_10px_35px_rgba(0,0,0,0.7)]">
                <div className="flex items-center justify-between mb-2">
                    <div className="text-lg font-semibold tracking-wide text-yellow-300 flex items-center gap-2">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold shadow">
                            {name?.[0]?.toUpperCase() || "R"}
                        </span>
                        <span>{name}</span>
                    </div>
                    {/* little signal dot like a lap light */}
                    <div
                        className={`h-2 w-2 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] ${status === "Accepted"
                                ? "bg-emerald-400"
                                : status === "Declined"
                                    ? "bg-red-400"
                                    : "bg-yellow-300"
                            }`}
                    />
                </div>

                {/* Status select */}
                <div className="relative mb-3" ref={dropdownRef}>
                    <button
                        onClick={() => setDropdownOpen(!isDropdownOpen)}
                        className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-2.5 text-left text-white hover:bg-black/55 transition flex items-center justify-between"
                        aria-haspopup="listbox"
                        aria-expanded={isDropdownOpen}
                    >
                        <span className="text-sm">
                            {status || "Select status (on the grid?)"}
                        </span>
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
                                className="absolute z-[999] mt-2 w-full overflow-hidden rounded-xl border border-white/15 bg-[#050814] shadow-2xl"
                                role="listbox"
                            >
                                {["Pending", "Accepted", "Declined"].map((s) => (
                                    <button
                                        key={s}
                                        className={`w-full px-4 py-2.5 text-left text-sm transition hover:bg-white/5 ${status === s
                                                ? "text-yellow-300 font-semibold"
                                                : "text-white"
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

                {/* Racer editor (stored as "Villain" field) */}
                {!isEditingVillain ? (
                    <button
                        onClick={() => setEditingVillain(true)}
                        className={`w-full rounded-xl px-4 py-2.5 text-sm transition border ${villain
                                ? "border-blue-400/60 bg-blue-700/25 hover:bg-blue-700/40"
                                : "border-white/15 bg-white/5 hover:bg-white/10"
                            } text-white`}
                        title="Choose your racer"
                    >
                        {villain || "Click here to choose your Mario Kart main"}
                    </button>
                ) : (
                    <div className="flex flex-col gap-2">
                        <input
                            type="text"
                            className="rounded-lg border border-white/15 bg-black/50 px-3 py-2 text-sm text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-blue-400/60"
                            placeholder="Enter your Mario Kart main (e.g. Yoshi, Peach, Toad)"
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
                                    onVillainChange(id, "");
                                    setEditingVillain(false);
                                }}
                                className="rounded-lg bg-white/10 px-4 py-1.5 text-sm text-white hover:bg-white/20"
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
export default function VillainGameDetails() {
    const [guests, setGuests] = useState([]);
    const [villainEdits, setVillainEdits] = useState({});
    const [editingVillainStates, setEditingVillainStates] = useState({});
    const [statusDropdownStates, setStatusDropdownStates] = useState({});

    // font
    useEffect(() => {
        const link = document.createElement("link");
        link.href =
            "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap";
        link.rel = "stylesheet";
        document.head.appendChild(link);
    }, []);

    // firestore subscription
    useEffect(() => {
        const unsub = onSnapshot(collection(db, "villains"), (snapshot) => {
            const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
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
            {/* New heavy racing background */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                {/* dark asphalt base */}
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "radial-gradient(circle at 50% 0%, rgba(15,23,42,0.9), transparent 55%), #020617",
                    }}
                />

                {/* vertical track lane lines */}
                <div className="absolute inset-x-1/4 bottom-0 top-24 opacity-40">
                    <div
                        className="h-full w-full"
                        style={{
                            backgroundImage:
                                "repeating-linear-gradient(to right, rgba(148,163,184,0.22) 0, rgba(148,163,184,0.22) 2px, transparent 2px, transparent 60px)",
                        }}
                    />
                </div>

                {/* diagonal rainbow road band */}
                <div
                    className="absolute -bottom-24 -left-1/3 h-64 w-[200%] opacity-80 blur-md rotate-[-12deg]"
                    style={{
                        background:
                            "linear-gradient(90deg,#f97316,#facc15,#22c55e,#0ea5e9,#6366f1,#ec4899,#f97316)",
                    }}
                />

                {/* side checkered rails */}
                <div
                    className="absolute left-0 top-0 h-full w-6 opacity-90"
                    style={{
                        backgroundImage:
                            "linear-gradient(0deg,#ffffff 25%,#000000 25%,#000000 50%,#ffffff 50%,#ffffff 75%,#000000 75%,#000000 100%)",
                        backgroundSize: "16px 16px",
                    }}
                />
                <div
                    className="absolute right-0 top-0 h-full w-6 opacity-90"
                    style={{
                        backgroundImage:
                            "linear-gradient(0deg,#ffffff 25%,#000000 25%,#000000 50%,#ffffff 50%,#ffffff 75%,#000000 75%,#000000 100%)",
                        backgroundSize: "16px 16px",
                    }}
                />

                {/* soft vignette */}
                <div
                    className="absolute inset-0"
                    style={{
                        boxShadow: "inset 0 0 160px 40px rgba(0,0,0,0.95)",
                    }}
                />
            </div>

            {/* Header: Big stacked title + Hexley */}
            <header className="relative px-4 pt-10 pb-4 sm:pt-12 sm:pb-6">
                <div className="mx-auto max-w-4xl flex flex-col items-center text-center gap-4">
                    <motion.h1
                        variants={fadeIn(0.05)}
                        className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight"
                    >
                        <span
                            className="block text-yellow-300 drop-shadow-[0_0_18px_rgba(250,204,21,0.9)]"
                            style={{
                                textShadow:
                                    "0 0 18px rgba(250,204,21,0.9), 0 0 40px rgba(252,211,77,0.7)",
                            }}
                        >
                            Stanimal&apos;s
                        </span>
                        <span
                            className="block text-yellow-200 drop-shadow-[0_0_16px_rgba(250,204,21,0.7)]"
                            style={{
                                textShadow:
                                    "0 0 16px rgba(250,204,21,0.7), 0 0 32px rgba(252,211,77,0.6)",
                            }}
                        >
                            Invitational
                        </span>
                    </motion.h1>

                    <motion.img
                        variants={fadeIn(0.15)}
                        src="/Hexley_Holding_3.png"
                        alt="Hexley holding race gear"
                        className="w-40 sm:w-48 md:w-56 drop-shadow-[0_24px_60px_rgba(0,0,0,0.8)]"
                    />
                </div>
            </header>

            {/* Thin checkered strip under header */}
            <div className="relative mx-auto max-w-5xl px-4 pb-4">
                <div className="h-6 rounded-full overflow-hidden border border-white/25 bg-black/95">
                    <div
                        className="h-full w-full"
                        style={{
                            backgroundImage:
                                "linear-gradient(45deg, #ffffff 25%, #000000 25%, #000000 50%, #ffffff 50%, #ffffff 75%, #000000 75%, #000000 100%)",
                            backgroundSize: "22px 22px",
                        }}
                    />
                </div>
            </div>

            {/* Details + RSVP */}
            <main className="px-4 pb-16 pt-2">
                <div className="mx-auto flex max-w-6xl flex-col gap-10">
                    {/* Single Event Details section */}
                    <motion.section variants={fadeIn(0.08)}>
                        <div className="rounded-2xl border border-white/15 bg-black/70 p-6 sm:p-7 md:p-8 shadow-[0_20px_70px_rgba(0,0,0,0.85)]">
                            <h2 className="text-2xl font-bold text-yellow-300 mb-3 text-center sm:text-left">
                                Event Details
                            </h2>
                            <div className="space-y-3 text-sm sm:text-base text-white/85">
                                <p>
                                    <span className="font-semibold text-yellow-200">
                                        Game:
                                    </span>{" "}
                                    We&apos;re switching things up from poker and running a full{" "}
                                    <span className="font-semibold">Mario Kart tournament</span> this time.
                                    Expect races, chaos, and the occasional friendship-testing blue shell.
                                </p>
                                <p>
                                    <span className="font-semibold text-yellow-200">
                                        Food &amp; Drinks:
                                    </span>{" "}
                                    No need to bring anything — I&apos;ve got it covered.{" "}
                                    <span className="font-semibold">Domino&apos;s pizza</span> as usual,
                                    plus drinks and snacks.
                                </p>
                                <p>
                                    <span className="font-semibold text-yellow-200">
                                        Dress Code:
                                    </span>{" "}
                                    Come dressed as a{" "}
                                    <span className="font-semibold">Mario Kart character</span>.
                                    Go all in and{" "}
                                    <span className="font-semibold uppercase">
                                        commit to the bit
                                    </span>
                                    .
                                </p>
                                <p>
                                    <span className="font-semibold text-yellow-200">
                                        Location:
                                    </span>{" "}
                                    701 Martha Ave, APT 3119, Lancaster, PA 17601
                                </p>
                                <p>
                                    <span className="font-semibold text-yellow-200">
                                        Start Time:
                                    </span>{" "}
                                    May 2nd @ 6:00 PM
                                </p>
                            </div>
                        </div>
                    </motion.section>

                    {/* RSVP section */}
                    <section>
                        <motion.div
                            variants={fadeIn(0.1)}
                            className="mb-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3"
                        >
                            <div>
                                <h2 className="text-2xl font-bold text-white">
                                    RSVP &amp; Racers
                                </h2>
                                <p className="text-sm sm:text-base text-white/75 mt-1">
                                    Claim your spot on the starting grid and tell us who you&apos;re racing as.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
                                <span className="px-3 py-1 rounded-full bg-black/60 border border-white/15">
                                    Racers: {counts.accepted}/{counts.total} confirmed
                                </span>
                                <span className="px-3 py-1 rounded-full bg-black/60 border border-white/15">
                                    Pending: {counts.pending}
                                </span>
                                <span className="px-3 py-1 rounded-full bg-black/60 border border-white/15">
                                    Declined: {counts.declined}
                                </span>
                            </div>
                        </motion.div>

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
                                        onStatusChange={(id, newStatus) =>
                                            updateDoc(doc(db, "villains", id), { Status: newStatus })
                                        }
                                        onVillainChange={handleVillainChange}
                                        onVillainSubmit={handleVillainSubmit}
                                        isEditingVillain={!!editingVillainStates[guest.id]}
                                        setEditingVillain={(editing) =>
                                            setEditingVillainStates((p) => ({
                                                ...p,
                                                [guest.id]: editing,
                                            }))
                                        }
                                        isDropdownOpen={!!statusDropdownStates[guest.id]}
                                        setDropdownOpen={(open) =>
                                            setStatusDropdownStates((p) => ({
                                                ...p,
                                                [guest.id]: open,
                                            }))
                                        }
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    </section>
                </div>
            </main>
        </motion.div>
    );
}
