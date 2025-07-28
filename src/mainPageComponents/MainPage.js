"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function MainPage() {
    const [curtainLifted, setCurtainLifted] = useState(false);
    const [fadeComplete, setFadeComplete] = useState(false);

    useEffect(() => {
        const fadeTimeout = setTimeout(() => {
            setFadeComplete(true);
        }, 1500);

        const curtainTimeout = setTimeout(() => {
            setCurtainLifted(true);
        }, 3000);

        return () => {
            clearTimeout(fadeTimeout);
            clearTimeout(curtainTimeout);
        };
    }, []);

    return (
        <div className="relative min-h-screen bg-[#2a143d] text-yellow-100 font-serif flex flex-col items-center justify-center px-4 py-12 overflow-hidden">

            {/* Radial shadow + vignette effect */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[#3d1a5c]" />
                <div className="absolute inset-0 bg-fuchsia-900 mix-blend-lighten opacity-10" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,0,0.15)_0%,transparent_70%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,0,128,0.12)_0%,transparent_60%)]" />
                <div className="absolute inset-0 bg-black opacity-10" style={{ mixBlendMode: "multiply" }} />
            </div>

            {/* Black fade under curtain */}
            {!fadeComplete && (
                <motion.div
                    className="absolute inset-0 bg-black z-10"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                />
            )}

            {/* Curtain */}
            <motion.img
                src="/Curtain.png"
                alt="Curtain"
                className="absolute bottom-0 left-0 w-full h-full object-cover object-bottom z-40"
                initial={{ y: "0%" }}
                animate={{ y: curtainLifted ? "-100%" : "0%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
            />

            {/* Hexley Villain */}
            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-30">
                <motion.div
                    className="bg-yellow-100 text-purple-900 px-4 py-2 rounded-xl shadow-xl text-sm sm:text-base max-w-[220px] sm:max-w-sm font-medium leading-snug border border-fuchsia-600 mb-3 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 4, duration: 1 }}
                >
                    Every villain has their cards to play
                </motion.div>
                <motion.img
                    src="/Hexley_Hook.png"
                    alt="Hexley Villain"
                    className="w-32 sm:w-36 md:w-40"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 3.5, duration: 1.2 }}
                />
            </div>

            {/* Main Content */}
            <div className="relative z-20 text-center w-full max-w-2xl mt-10">
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-pink-400 drop-shadow-[0_0_12px_rgba(255,0,128,0.4)] mb-6 leading-tight">
                    The Villain’s Gambit
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl text-yellow-200 mb-10 leading-relaxed">
                    A night where the wicked gather,<br />
                    and only the most cunning survive.
                </p>
                <button className="px-6 sm:px-8 py-3 sm:py-4 bg-pink-700 hover:bg-pink-800 text-white rounded-full text-md sm:text-lg shadow-lg transition-all border border-yellow-300">
                    Enter the Lair
                </button>
            </div>
        </div>
    );
}
