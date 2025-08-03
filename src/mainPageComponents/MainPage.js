"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import VillainGameDetails from "./VillainGameDetails";

export default function MainPage() {
    const [showGameDetails, setShowGameDetails] = useState(false);
    const [curtainLifted, setCurtainLifted] = useState(false);
    const [fadeComplete, setFadeComplete] = useState(false);
    const [startTransition, setStartTransition] = useState(false);

    useEffect(() => {
        const fadeTimeout = setTimeout(() => setFadeComplete(true), 1500);
        const curtainTimeout = setTimeout(() => setCurtainLifted(true), 3000);
        return () => {
            clearTimeout(fadeTimeout);
            clearTimeout(curtainTimeout);
        };
    }, []);

    const handleEnter = () => {
        setStartTransition(true);
        setTimeout(() => setShowGameDetails(true), 1500); // match fade-out duration
    };

    if (showGameDetails) return <VillainGameDetails />;

    return (
        <div className="relative min-h-screen text-white font-serif bg-gradient-to-br from-[#1b0034] via-[#2e004f] to-[#420024] flex flex-col items-center justify-center px-4 py-16 overflow-hidden">
            {/* Background layers */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)]" />
                <div className="absolute inset-0 bg-black opacity-20" style={{ mixBlendMode: "multiply" }} />
            </div>

            {/* Fade-in from black on load */}
            {!fadeComplete && (
                <motion.div
                    className="absolute inset-0 bg-black z-10"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                />
            )}

            {/* Exit transition */}
            <AnimatePresence>
                {startTransition && (
                    <motion.div
                        className="absolute inset-0 bg-black z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.2 }}
                    />
                )}
            </AnimatePresence>

            {/* Curtain */}
            <motion.img
                src="/Curtain.png"
                alt="Curtain"
                className="absolute bottom-0 left-0 w-full h-full object-cover object-bottom z-40"
                initial={{ y: "0%" }}
                animate={{ y: curtainLifted ? "-100%" : "0%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
            />

            {/* Hexley image & message */}
            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-30">
                <motion.div
                    className="bg-yellow-100 text-purple-900 px-4 py-2 rounded-xl shadow-lg text-sm sm:text-base font-medium border border-fuchsia-700 mb-3 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 4, duration: 1 }}
                >
                    Every villain has their cards to play
                </motion.div>
                <motion.img
                    src="/Hexley_Hook.png"
                    alt="Hexley Hook"
                    className="w-32 sm:w-36 md:w-40 drop-shadow-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 3.5, duration: 1.2 }}
                />
            </div>

            {/* Main intro text */}
            <div className="relative z-20 text-center w-full max-w-2xl mt-10">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-yellow-400 mb-6 drop-shadow-[0_0_12px_rgba(255,215,0,0.3)]">
                    The Villain’s Gambit
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed">
                    A night where the wicked gather,<br />
                    and only the most cunning survive.
                </p>
                <button
                    onClick={handleEnter}
                    className="px-8 py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-full text-lg shadow-md border border-yellow-300 transition"
                >
                    Enter the Lair
                </button>
            </div>
        </div>
    );
}
