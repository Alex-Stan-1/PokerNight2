"use client";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

export default function TransitionScreen({ onComplete }) {
    const hexleyLines = [
        { img: "Hexley_Smug.png", text: "Oh?" },
        { img: "Hexley_Smug.png", text: "Back again so soon?" },
        { img: "Hexley_Smug.png", text: "I suppose you truly are a fool." },
        { img: "Hexley_Smug.png", text: "I guess that is to be expected." },
        { img: "Hexley_Smug.png", text: "I guess I should welcome you all back." },
        { img: "Hexley_Smug.png", text: "For you new folk, my name is Hexley." },
        { img: "Hexley_Smug.png", text: "You’ve entered my domain and there’s no turning back now." },
        { img: "Hexley_Smug.png", text: "Nothing happens around here without my say so." },
        { img: "Hexley_Smug.png", text: "I’m assuming you’re here for another one of those game nights." },
        { img: "Hexley_Smug.png", text: "I guess I can get something ready for you." },
        { img: "Hexley_Smug.png", text: "I know just what to do!" },
    ];

    const [dialogueIndex, setDialogueIndex] = useState(0);
    const [typedText, setTypedText] = useState("");
    const [showCurtainDown, setShowCurtainDown] = useState(false);

    const typingIntervalRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    const typingSoundRef = useRef(null);

    const currentLine = hexleyLines[dialogueIndex];
    const isLastLine = dialogueIndex === hexleyLines.length - 1;

    // create typing sound once
    useEffect(() => {
        typingSoundRef.current = new Audio("/Hexley_Typing.m4a");
        typingSoundRef.current.preload = "auto";
        typingSoundRef.current.loop = false;
        typingSoundRef.current.volume = 0.12; // adjust

        return () => {
            try {
                typingSoundRef.current?.pause();
            } catch { }
            typingSoundRef.current = null;
        };
    }, []);

    const startTyping = (text) => {
        setTypedText("");
        if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        // play typing click at start of each line (user already interacted by now)
        try {
            if (typingSoundRef.current) {
                typingSoundRef.current.pause();
                typingSoundRef.current.currentTime = 0;
                typingSoundRef.current.play().catch(() => { });
            }
        } catch { }

        typingTimeoutRef.current = setTimeout(() => {
            let charIndex = 0;
            typingIntervalRef.current = setInterval(() => {
                charIndex++;
                setTypedText(text.slice(0, charIndex));
                if (charIndex >= text.length) {
                    clearInterval(typingIntervalRef.current);
                }
            }, 18);
        }, 250);
    };

    useEffect(() => {
        startTyping(hexleyLines[0].text);
        return () => {
            if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (dialogueIndex === 0) return;
        startTyping(currentLine.text);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dialogueIndex]);

    const isTextFullyTyped = () => {
        const full = currentLine?.text ?? "";
        return typedText.length >= full.length;
    };

    const fastForwardText = () => {
        if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        setTypedText(currentLine.text);
    };

    // START Mario music on the final user click (this is what makes autoplay reliable)
    const startMarioMusic = () => {
        try {
            // if already created, don't restart
            if (typeof window !== "undefined" && window.__marioBgm) {
                // make sure it’s playing
                window.__marioBgm.play().catch(() => { });
                return;
            }

            const a = new Audio("/Mario%20Kart%20World.mp3");
            a.loop = true;
            a.preload = "auto";
            a.volume = 0.12;
            a.play().catch((e) => console.warn("Mario music blocked:", e));

            // store globally so VillainGameDetails can reuse it
            window.__marioBgm = a;
        } catch (e) {
            console.warn("Mario music error:", e);
        }
    };

    const handleNext = () => {
        if (!isTextFullyTyped()) {
            fastForwardText();
            return;
        }

        if (!isLastLine) {
            setDialogueIndex((idx) => idx + 1);
        } else {
            // final line → start music NOW (allowed gesture) → curtain down → then go to details
            startMarioMusic();
            setShowCurtainDown(true);
            setTimeout(() => {
                onComplete();
            }, 2200);
        }
    };

    const handleSkip = () => {
        startMarioMusic();
        setShowCurtainDown(true);
        setTimeout(() => {
            onComplete();
        }, 1800);
    };

    // hexley name invisible until that specific line
    const showHexleyTag = dialogueIndex >= 5;

    return (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center text-white text-center px-4 overflow-hidden">
            {/* moody background glow */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-b from-black via-[#120015] to-black" />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(70%_120%_at_50%_120%,rgba(168,85,247,0.22),transparent)]" />
            </div>

            {/* Hexley image */}
            <motion.img
                src="/Hexley_Smug.png"
                alt="Hexley"
                className="fixed top-[16%] w-36 md:w-44 z-10 drop-shadow-[0_18px_40px_rgba(0,0,0,0.7)]"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
            />

            {/* dialogue bubble */}
            <motion.div
                key={dialogueIndex}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(92vw,46rem)] z-20"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
            >
                <div className="relative rounded-2xl border-2 border-purple-500 bg-white text-black px-5 py-4 md:px-6 md:py-5 shadow-[0_16px_50px_rgba(0,0,0,0.6)]">
                    {showHexleyTag && (
                        <div className="absolute -top-3 left-6 rounded-full border border-purple-400 bg-purple-300 px-3 py-0.5 text-[10px] md:text-xs font-extrabold tracking-[0.14em] text-[#1d0433] shadow">
                            HEXLEY
                        </div>
                    )}

                    <div className="text-base md:text-xl leading-relaxed font-medium">
                        <span>{typedText}</span>
                        {typedText.length < (currentLine?.text ?? "").length && (
                            <span className="ml-1 align-baseline opacity-70 animate-pulse">▌</span>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* NEXT button (purple) */}
            {!showCurtainDown && (
                <motion.button
                    onClick={handleNext}
                    className="fixed bottom-20 px-7 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full text-sm sm:text-base font-semibold shadow-lg z-30"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                >
                    Next
                </motion.button>
            )}

            {/* SKIP button (yellow) */}
            {!showCurtainDown && (
                <motion.button
                    onClick={handleSkip}
                    className="fixed bottom-6 px-6 py-2 text-sm bg-yellow-400/90 hover:bg-yellow-300 text-black rounded-full shadow-md z-30 font-semibold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                >
                    Skip to the theme
                </motion.button>
            )}

            {/* Curtain DROP (down) */}
            {showCurtainDown && (
                <motion.img
                    src="/Curtain.png"
                    alt="Curtain"
                    className="absolute top-0 left-0 w-full h-full object-cover object-bottom z-40"
                    initial={{ y: "-100%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                />
            )}
        </div>
    );
}
