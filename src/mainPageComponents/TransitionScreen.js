"use client";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import useGlobalBgm from "../utils/useGlobalBgm";

export default function TransitionScreen({ onComplete }) {
    const introMessages = [
        "So you have chosen to enter",
        "You are either very",
        "...",
        "Wait a second, you seem familiar...",
        "Ah, I remember you!"
    ];

    const hexleyLines = [
        { text: "Well well well... Back so soon?" },
        { text: "I guess if you’re going to be a regular guest..." },
        { img: "Hexley_Smug.png", text: "I should probably introduce myself." },
        { img: "Hexley_Smug.png", text: "You can call me Hexley. I basically run this place." },
        { img: "Hexley_Puzzled.png", text: "You must really be messed up if you're coming back to one of these..." },
        { img: "Hexley_Smug.png", text: "Hey, want to see something funny?" },
        { img: "Hexley_Mike.png", text: "I can turn into Mike!" },
        { img: "Hexley_Smug.png", text: "Hey, want to see something even MORE funny?" },
        { img: "Hexley_Connor.png", text: "I can turn into Connor!" },
        { img: "Hexley_Smug.png", text: "Okay okay. Enough fun." },
        { img: "Hexley_Smug.png", text: "Anyway, I suppose you want to enter again." },
        { img: "Hexley_Smug.png", text: "But before I let you in, I think it's time to change things up a bit..." },
        { img: "Hexley_Smug.png", text: "Let's give this place a makeover to match our new theme." }
    ];

    const [showIntro, setShowIntro] = useState(true);
    const [showNextAfterIntro, setShowNextAfterIntro] = useState(false);
    const [showBlackout, setShowBlackout] = useState(false);
    const [showHexley, setShowHexley] = useState(false);
    const [spotlight, setSpotlight] = useState(false);
    const [dialogueIndex, setDialogueIndex] = useState(0);
    const [typedText, setTypedText] = useState("");
    const [showCurtain, setShowCurtain] = useState(false);
    const [showSkip, setShowSkip] = useState(true);

    const currentLine = hexleyLines[dialogueIndex];
    const isLastLine = dialogueIndex === hexleyLines.length - 1;

    const typingIntervalRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    const bgm = useGlobalBgm("/Hexley_Theme.mp3");
    const bgmStartedRef = useRef(false);

    const startTyping = (text) => {
        setTypedText("");
        if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        const typeSound = new Audio("/Hexley_Typing.mp3");
        typeSound.volume = 0.03;
        typeSound.play().catch(() => { });

        typingTimeoutRef.current = setTimeout(() => {
            let charIndex = 0;
            typingIntervalRef.current = setInterval(() => {
                charIndex++;
                setTypedText(text.slice(0, charIndex));
                if (charIndex >= text.length) {
                    clearInterval(typingIntervalRef.current);
                }
            }, 15);
        }, 600);
    };

    useEffect(() => {
        const delay = introMessages.length * 2000 + 500;
        const nextButtonTimeout = setTimeout(() => setShowNextAfterIntro(true), delay);
        return () => clearTimeout(nextButtonTimeout);
    }, []);

    useEffect(() => {
        return () => {
            if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        };
    }, []);

    useEffect(() => {
        if (!showHexley || dialogueIndex === 0) return;
        startTyping(currentLine.text);
    }, [dialogueIndex, showHexley]); // eslint-disable-line react-hooks/exhaustive-deps

    const beginHexleyDialogue = async () => {
        setShowIntro(false);
        setShowBlackout(true);
        setTimeout(() => {
            setShowHexley(true);
            setSpotlight(true);
            startTyping(hexleyLines[0].text);
        }, 1000);
    };

    const isTextFullyTyped = () => {
        const full = currentLine?.text ?? "";
        return typedText.length >= full.length;
    };

    const fastForwardText = () => {
        if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        setTypedText(currentLine.text);
    };

    const maybeStartBgmForNextLine = async (nextIndex) => {
        const nextLine = hexleyLines[nextIndex];
        if (!bgmStartedRef.current && nextLine?.img) {
            await bgm?.play();
            bgm?.fadeTo(0.12, 800);
            bgmStartedRef.current = true;
        }
    };

    const handleNext = async () => {
        if (showHexley && !isTextFullyTyped()) {
            fastForwardText();
            return;
        }
        if (!showHexley) {
            await beginHexleyDialogue();
            return;
        }
        if (!isLastLine) {
            const nextIndex = dialogueIndex + 1;
            await maybeStartBgmForNextLine(nextIndex);
            setDialogueIndex(nextIndex);
        } else {
            setShowCurtain(true);
            setTimeout(() => onComplete(), 2500);
        }
    };

    const showAdvanceCue = showHexley && isTextFullyTyped();

    return (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center text-white text-center px-4 overflow-hidden">
            {showIntro &&
                introMessages.map((message, index) => (
                    <motion.h2
                        key={index}
                        className="text-2xl md:text-4xl font-bold leading-tight"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.8, delay: index * 2 }}
                    >
                        {message}
                    </motion.h2>
                ))}

            {(showNextAfterIntro || showHexley) && !showCurtain && (
                <motion.button
                    onClick={handleNext}
                    className="fixed bottom-20 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg z-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    Next
                </motion.button>
            )}

            {showBlackout && !showHexley && (
                <motion.div
                    className="absolute inset-0 bg-black"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                />
            )}

            {spotlight && (
                <motion.div
                    className="absolute inset-0 bg-black bg-opacity-70 z-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                />
            )}

            {showHexley && currentLine.img && (
                <motion.img
                    src={`/${currentLine.img}`}
                    alt="Hexley"
                    className="fixed top-[18%] w-36 md:w-44 z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                />
            )}

            {showHexley && (
                <motion.div
                    key={dialogueIndex}
                    className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(92vw,46rem)] z-20"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="relative rounded-2xl border-2 border-purple-600 bg-white text-black px-5 py-4 md:px-6 md:py-5 shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
                        {/* Nameplate */}
                        <div className="absolute -top-3 left-6 rounded-full border border-yellow-300/70 bg-yellow-300 px-3 py-0.5 text-[10px] md:text-xs font-extrabold tracking-[0.14em] text-purple-900 shadow">
                            HEXLEY
                        </div>

                        {/* Text + caret */}
                        <div className="text-base md:text-xl leading-relaxed font-medium">
                            <span>{typedText}</span>
                            {typedText.length < (hexleyLines[dialogueIndex]?.text ?? "").length && (
                                <span className="ml-1 align-baseline opacity-70 animate-pulse">▌</span>
                            )}
                        </div>

                        {/* Right pointer triangle (aligned & centered) */}
                       
                    </div>
                </motion.div>
            )}


            {showCurtain && (
                <motion.img
                    src="/Curtain.png"
                    alt="Curtain"
                    className="absolute top-0 left-0 w-full h-full object-cover object-bottom z-40"
                    initial={{ y: "-100%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                />
            )}

            {!showCurtain && showSkip && (
                <motion.button
                    onClick={async () => {
                        await bgm?.play();
                        bgm?.fadeTo(0.12, 800);
                        bgmStartedRef.current = true;
                        setShowSkip(false);
                        setShowCurtain(true);
                        setTimeout(() => onComplete(), 2100);
                    }}
                    className="fixed bottom-6 px-6 py-3 text-lg bg-[#d4af37] text-black rounded-lg shadow-md hover:bg-[#b8972d] transition-all z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                >
                    Skip Intro
                </motion.button>
            )}
        </div>
    );
}
