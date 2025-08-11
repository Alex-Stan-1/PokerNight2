"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import VillainGameDetails from "./VillainGameDetails";
import useGlobalBgm from "../utils/useGlobalBgm";

export default function MainPage() {
    const [showGameDetails, setShowGameDetails] = useState(false);
    const [curtainLifted, setCurtainLifted] = useState(false);
    const [fadeComplete, setFadeComplete] = useState(false);
    const [startTransition, setStartTransition] = useState(false);

    const bgm = useGlobalBgm("/Hexley_Theme.mp3");

    useEffect(() => {
        const fadeTimeout = setTimeout(() => setFadeComplete(true), 1500);
        const curtainTimeout = setTimeout(() => setCurtainLifted(true), 3000);
        return () => {
            clearTimeout(fadeTimeout);
            clearTimeout(curtainTimeout);
        };
    }, []);

    useEffect(() => {
        const link = document.createElement("link");
        link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap";
        link.rel = "stylesheet";
        document.head.appendChild(link);
    }, []);

    useEffect(() => {
        if (showGameDetails) return;

        const html = document.documentElement;
        const body = document.body;

        const prevHtmlOverflow = html.style.overflow;
        const prevBodyOverflow = body.style.overflow;
        const prevHtmlHeight = html.style.height;
        const prevBodyHeight = body.style.height;
        const prevOverscroll = html.style.overscrollBehavior;

        html.style.overflow = "hidden";
        body.style.overflow = "hidden";
        html.style.height = "100dvh";
        body.style.height = "100dvh";
        html.style.overscrollBehavior = "none";

        return () => {
            html.style.overflow = prevHtmlOverflow;
            body.style.overflow = prevBodyOverflow;
            html.style.height = prevHtmlHeight;
            body.style.height = prevBodyHeight;
            html.style.overscrollBehavior = prevOverscroll;
        };
    }, [showGameDetails]);

    useEffect(() => {
        bgm?.play();
        bgm?.fadeTo(0.12, 200);
    }, [bgm]);

    const handleEnter = () => {
        setStartTransition(true);
        setTimeout(() => setShowGameDetails(true), 1500);
    };

    if (showGameDetails) return <VillainGameDetails />;

    return (
        <div className="fixed inset-0 overflow-hidden font-[Inter] text-white">
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0b001a] via-[#21002f] to-[#3a042a]" />
                <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_30%,rgba(255,0,180,0.16),transparent)]" />
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
                <div
                    className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
                    style={{
                        backgroundImage:
                            "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22><filter id=%22n%22 x=%220%22 y=%220%22 width=%22100%25%22 height=%22100%25%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.7%22 numOctaves=%222%22 stitchTiles=%22stitch%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%220.15%22/></svg>')",
                    }}
                />
            </div>

            {!fadeComplete && (
                <motion.div
                    className="absolute inset-0 bg-black z-10"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                />
            )}

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

            <motion.img
                src="/Curtain.png"
                alt="Curtain"
                className="absolute bottom-0 left-0 w-full h-full object-cover object-bottom z-40"
                initial={{ y: "0%" }}
                animate={{ y: curtainLifted ? "-100%" : "0%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
            />

            <div className="fixed bottom-2 sm:bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center z-30 w-full px-3">
                <motion.div
                    className="rounded-xl border border-white/10 bg-white/10 backdrop-blur-xl px-3 sm:px-4 py-1.5 sm:py-2 shadow-lg text-xs sm:text-sm md:text-base font-medium text-yellow-100"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 4, duration: 1 }}
                >
                    Every villain has their cards to play
                </motion.div>
                <motion.img
                    src="/Hexley_Hook.png"
                    alt="Hexley Hook"
                    className="w-24 sm:w-32 md:w-36 drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] mt-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 3.5, duration: 1.2 }}
                />
            </div>

            <div className="relative z-20 h-full w-full flex items-center justify-center px-4">
                <div className="w-full max-w-3xl">
                    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 sm:p-12 text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-4xl sm:text-6xl font-extrabold leading-tight"
                        >
                            <span className="block text-yellow-400 drop-shadow-[0_0_12px_rgba(255,215,0,0.25)]">
                                The Villain’s Gambit
                            </span>
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.15 }}
                            className="mt-6"
                        >
                            <button
                                onClick={handleEnter}
                                className="inline-flex items-center justify-center rounded-full border border-yellow-300/70 bg-purple-700/80 px-8 py-3 text-white shadow-md transition hover:bg-purple-800/90 text-sm sm:text-lg"
                            >
                                Enter the Lair
                            </button>
                        </motion.div>

                        <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10" />
                    </div>
                </div>
            </div>
        </div>
    );
}
