"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function TransitionScreen({ onComplete }) {
    const introMessages = [
        "So you have chosen to enter",
        "You are either very",
        "...", 
        "Wait a second...",
        "I remember you"
    ];

    const hexleyLines = [
        { img: "Hexley_Smug.png", text: "Well well well... Back so soon?" },
        { img: "Hexley_Smug.png", text: "I guess if you’re going to be a regular guest..." },
        { img: "Hexley_Smug.png", text: "I should introduce myself." },
        { img: "Hexley_Smug.png", text: "You can call me Hexley. I basically run this place." },
        { img: "Hexley_Puzzled.png", text: "You’re really persistent. Are you that brave or just... clueless?" },
        { img: "Hexley_Smug.png", text: "Want to see something funny?" },
        { img: "Hexley_Connor.png", text: "I can turn into connor!" },
        { img: "Hexley_Smug.png", text: "Okay okay. Enough fun." },
        { img: "Hexley_Smug.png", text: "Anyway, I suppose you want to enter again." },

        { img: "Hexley_Smug.png", text: "Let’s give this place the makeover it deserves." },
    ];

    const [fadeOutMessages, setFadeOutMessages] = useState(false);
    const [showBlackout, setShowBlackout] = useState(false);
    const [showHexley, setShowHexley] = useState(false);
    const [dialogueIndex, setDialogueIndex] = useState(0);
    const [showCurtain, setShowCurtain] = useState(false);

    const currentLine = hexleyLines[dialogueIndex];

    const isLastLine = dialogueIndex === hexleyLines.length - 1;

    useEffect(() => {
        const delay = introMessages.length * 2000 + 2000;

        const fadeMessagesTimeout = setTimeout(() => setFadeOutMessages(true), delay);
        const blackoutTimeout = setTimeout(() => setShowBlackout(true), delay + 2000);
        const hexleyTimeout = setTimeout(() => setShowHexley(true), delay + 4000);

        return () => {
            clearTimeout(fadeMessagesTimeout);
            clearTimeout(blackoutTimeout);
            clearTimeout(hexleyTimeout);
        };
    }, []);

    useEffect(() => {
        if (isLastLine) {
            const curtainTimeout = setTimeout(() => setShowCurtain(true), 3000);
            const completeTimeout = setTimeout(() => onComplete(), 6000);
            return () => {
                clearTimeout(curtainTimeout);
                clearTimeout(completeTimeout);
            };
        }
    }, [isLastLine]);

    const handleNext = () => {
        if (!isLastLine) setDialogueIndex(dialogueIndex + 1);
    };

    return (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center text-white text-center px-4 overflow-hidden">
            {/* INTRO SEQUENCE */}
            {!fadeOutMessages &&
                introMessages.map((msg, index) => (
                    <motion.h2
                        key={index}
                        className="text-2xl md:text-4xl font-bold transition-message leading-tight"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.8, delay: index * 2 }}
                    >
                        {msg}
                    </motion.h2>
                ))}

            {/* Fade Out Effect */}
            {fadeOutMessages && !showBlackout && (
                <motion.div
                    className="absolute inset-0 bg-black"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 2 }}
                />
            )}

            {/* Full Blackout */}
            {showBlackout && !showHexley && (
                <motion.div
                    className="absolute inset-0 bg-black"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2 }}
                />
            )}

            {/* Hexley Dialog */}
            {showHexley && (
                <motion.div
                    className="z-10 flex flex-col items-center justify-center max-w-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    {currentLine.img && (
                        <motion.img
                            src={`/${currentLine.img}`}
                            alt="Hexley"
                            className="w-40 md:w-48 mb-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1 }}
                        />
                    )}
                    <motion.p
                        key={dialogueIndex}
                        className="text-lg md:text-2xl font-medium px-4 mb-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        {currentLine.text}
                    </motion.p>

                    {!isLastLine && (
                        <button
                            onClick={handleNext}
                            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all"
                        >
                            Next
                        </button>
                    )}
                </motion.div>
            )}

            {/* Curtain Slide In */}
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

            {/* Skip Button - Always fixed at the bottom */}
            <motion.button
                onClick={onComplete}
                className="fixed bottom-10 px-6 py-3 text-lg bg-[#d4af37] text-black rounded-lg shadow-md hover:bg-[#b8972d] transition-all z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 2 }}
            >
                Skip Intro
            </motion.button>
        </div>
    );
}
