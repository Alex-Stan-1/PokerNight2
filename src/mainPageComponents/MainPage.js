"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function MainPage() {
    const [curtainLifted, setCurtainLifted] = useState(false);
    const [fadeComplete, setFadeComplete] = useState(false);

    useEffect(() => {
        const fadeTimeout = setTimeout(() => {
            setFadeComplete(true); // Fade black away from content below curtain
        }, 1500);

        const curtainTimeout = setTimeout(() => {
            setCurtainLifted(true); // Lift curtain
        }, 3000);

        return () => {
            clearTimeout(fadeTimeout);
            clearTimeout(curtainTimeout);
        };
    }, []);

    return (
        <div className="relative min-h-screen bg-gradient-to-b from-pink-100 via-pink-200 to-pink-300 text-pink-900 font-serif flex flex-col items-center justify-center px-4 py-12 overflow-hidden">

            {/* Black fade under curtain */}
            {!fadeComplete && (
                <motion.div
                    className="absolute inset-0 bg-black z-10"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                />
            )}

            {/* Curtain: stays until lifted */}
            <motion.img
                src="/Curtain.png"
                alt="Curtain"
                className="absolute bottom-0 left-0 w-full h-full object-cover object-bottom z-40"
                initial={{ y: "0%" }}
                animate={{ y: curtainLifted ? "-100%" : "0%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
            />

            {/* Main Content */}
            <div className="relative z-20 text-center w-full max-w-2xl">
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-pink-700 drop-shadow-lg mb-6 leading-tight">
                    The Royal Flush
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl text-pink-800 mb-10 leading-relaxed">
                    You’re cordially invited to a night of deception, drama, and diamonds.<br />
                    Where queens reign and only the fiercest remain.
                </p>
                <button className="px-6 sm:px-8 py-3 sm:py-4 bg-pink-500 hover:bg-pink-600 text-white rounded-full text-md sm:text-lg shadow-lg transition-all">
                    Enter the Castle
                </button>
            </div>
        </div>
    );
}
