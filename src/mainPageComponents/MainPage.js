"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import TransitionScreen from "./TransitionScreen";
import VillainGameDetails from "./VillainGameDetails";

export default function MainPage() {
    // stages: "entrance" → "hexley" → "game"
    const [stage, setStage] = useState("entrance");
    const [showCurtainLift, setShowCurtainLift] = useState(false);

    // font
    useEffect(() => {
        const link = document.createElement("link");
        link.href =
            "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap";
        link.rel = "stylesheet";
        document.head.appendChild(link);
    }, []);

    // lock scroll only during entrance + hexley
    useEffect(() => {
        if (stage === "game") return;

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
    }, [stage]);

    if (stage === "hexley") {
        return (
            <TransitionScreen
                onComplete={() => {
                    // when Hexley is done, switch to game
                    // and start the curtain in the "down" position, ready to lift
                    setStage("game");
                    setShowCurtainLift(true);
                }}
            />
        );
    }

    if (stage === "game") {
        return (
            <div className="relative">
                <VillainGameDetails />

                {showCurtainLift && (
                    <motion.img
                        src="/Curtain.png"
                        alt="Curtain"
                        className="fixed top-0 left-0 w-full h-full object-cover object-bottom z-50"
                        initial={{ y: 0 }}          // curtain starts down, covering screen
                        animate={{ y: "-100%" }}    // then lifts up
                        transition={{ duration: 3, ease: "easeInOut" }}
                        onAnimationComplete={() => setShowCurtainLift(false)}
                    />
                )}
            </div>
        );
    }

    // ENTRANCE SCREEN (initial)
    return (
        <div className="fixed inset-0 overflow-hidden font-[Inter] text-white bg-black">
            {/* ominous red glow behind title */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-black" />
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "radial-gradient(circle at 50% 35%, rgba(127, 29, 29, 0.6), transparent 60%)",
                    }}
                />
                {/* subtle vignette */}
                <div
                    className="absolute inset-0"
                    style={{
                        boxShadow: "inset 0 0 140px 40px rgba(0,0,0,0.95)",
                    }}
                />
            </div>

            {/* Center content */}
            <div className="relative z-10 flex h-full items-center justify-center px-4">
                <div className="w-full max-w-xl">
                    <div className="relative overflow-hidden rounded-3xl border border-red-700/60 bg-black/85 backdrop-blur-xl p-8 sm:p-10 text-center shadow-[0_30px_90px_rgba(0,0,0,1)]">
                        <motion.h1
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight"
                        >
                            <span
                                className="block text-red-400"
                                style={{
                                    textShadow:
                                        "0 0 18px rgba(248,113,113,0.9), 0 0 40px rgba(127,29,29,0.85)",
                                }}
                            >
                                Stanimal&apos;s Invitational
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="mt-5 text-sm sm:text-base text-white/80"
                        >
                        </motion.p>

                        {/* faint horizontal blood-red glow line */}
                        <motion.div
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.35 }}
                            className="mx-auto mt-6 mb-5 h-[2px] max-w-xs rounded-full bg-gradient-to-r from-transparent via-red-500 to-transparent"
                        />

                        {/* Enter button */}
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            onClick={() => setStage("hexley")}
                            className="mt-1 inline-flex items-center justify-center rounded-full border border-red-500/80 bg-red-600 px-10 py-3 text-sm sm:text-lg font-semibold text-white shadow-[0_10px_35px_rgba(127,29,29,0.9)] hover:bg-red-700 hover:border-red-300 hover:shadow-[0_14px_45px_rgba(127,29,29,1)] transition"
                        >
                            Enter if you dare
                        </motion.button>

                        {/* subtle subtext */}
                        <motion.p
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.7 }}
                            className="mt-4 text-[11px] sm:text-xs text-white/50"
                        >
                        </motion.p>

                        {/* frame ring */}
                        <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-red-700/60" />
                    </div>
                </div>
            </div>
        </div>
    );
}
