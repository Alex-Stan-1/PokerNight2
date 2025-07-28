"use client";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";


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
        { img: "Hexley_Connor.png", text: "I can turn into Connor!" },
        { img: "Hexley_Smug.png", text: "Okay okay. Enough fun." },
        { img: "Hexley_Smug.png", text: "Anyway, I suppose you want to enter again." },
        { img: "Hexley_Smug.png", text: "But before I let you in, I think it's time to change things up a bit..." },
        { img: "Hexley_Smug.png", text: "Let's give this place a makeover to match our new theme." }
    ];

    const [fadeOutMessages, setFadeOutMessages] = useState(false);
    const [showBlackout, setShowBlackout] = useState(false);
    const [showHexley, setShowHexley] = useState(false);
    const [dialogueIndex, setDialogueIndex] = useState(0);
    const [showCurtain, setShowCurtain] = useState(false);
    const [spotlight, setSpotlight] = useState(false);
    const [showSkip, setShowSkip] = useState(true);

    const currentLine = hexleyLines[dialogueIndex];
    const isLastLine = dialogueIndex === hexleyLines.length - 1;

    useEffect(() => {
        const delay = introMessages.length * 2000 + 500;

        const fadeMessagesTimeout = setTimeout(() => setFadeOutMessages(true), delay);
        const blackoutTimeout = setTimeout(() => setShowBlackout(true), delay + 1500);
        const hexleyTimeout = setTimeout(() => {
            setShowHexley(true);
            setSpotlight(true);
        }, delay + 2500);

        return () => {
            clearTimeout(fadeMessagesTimeout);
            clearTimeout(blackoutTimeout);
            clearTimeout(hexleyTimeout);
        };
    }, []);

    useEffect(() => {
        if (isLastLine) {
            const curtainTimeout = setTimeout(() => setShowCurtain(true), 3000);
            const completeTimeout = setTimeout(() => onComplete(), 8000);
            return () => {
                clearTimeout(curtainTimeout);
                clearTimeout(completeTimeout);
            };
        }
    }, [isLastLine]);

    const audioRef = useRef(null);

    const handleNext = () => {
        if (dialogueIndex === 1 && !audioRef.current) {
            const audio = new Audio("/Hexley_Theme.mp3");
            audio.volume = 0; // start at 0
            audio.loop = true;
            audio.play().catch((err) => {
                console.warn("Audio failed to play:", err);
            });
            audioRef.current = audio;

            // Fade in over 6s to 0.4
            let vol = 0;
            const fadeIn = setInterval(() => {
                if (vol < 0.4) {
                    vol += 0.02;
                    audio.volume = Math.min(vol, 0.4);
                } else {
                    clearInterval(fadeIn);
                }
            }, 200);
        }

        if (!isLastLine) {
            setDialogueIndex(dialogueIndex + 1);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center text-white text-center px-4 overflow-hidden">
            {/* INTRO TEXT STYLE */}
            {!fadeOutMessages &&
                introMessages.map((message, index) => (
                    <motion.h2
                        key={index}
                        className="text-2xl md:text-4xl font-bold transition-message leading-tight"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.8, delay: index * 2 }}
                    >
                        {message}
                    </motion.h2>
                ))}

            {/* Fade out effect */}
            {fadeOutMessages && !showBlackout && (
                <motion.div
                    className="absolute inset-0 bg-black"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                />
            )}

            {/* Blackout before Hexley */}
            {showBlackout && !showHexley && (
                <motion.div
                    className="absolute inset-0 bg-black"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                />
            )}

            {/* Spotlight background during Hexley */}
            {spotlight && (
                <motion.div
                    className="absolute inset-0 bg-black bg-opacity-70 z-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                />
            )}

            {/* HEXLEY IMAGE - fixed position */}
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

            {/* DIALOGUE TEXT - always centered */}
            {showHexley && (
                <motion.p
                    key={dialogueIndex}
                    className="fixed top-[48%] max-w-[90%] md:max-w-xl text-lg md:text-2xl font-medium z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    {currentLine.text}
                </motion.p>
            )}

            {/* NEXT BUTTON - fixed position, centered horizontally */}
            {showHexley && !isLastLine && (
                <motion.button
                    onClick={handleNext}
                    className="fixed bottom-24 md:bottom-20 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all z-20"
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    Next
                </motion.button>
            )}

            {/* CURTAIN SLIDE */}
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

            {/* SKIP BUTTON - always bottom */}
            {showHexley && !isLastLine && showSkip && (
                <motion.button
                    onClick={() => {
                        setShowSkip(false);
                        setTimeout(() => onComplete(), 800);
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
