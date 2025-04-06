"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function TransitionScreen({ onTransitionComplete }) {
    const messages = [
        "So you have chosen to return.",
        "You truly are a fool.",
        "But something’s different this time...",
        "You’ve grown wiser, cleverer...",
        "No matter.",
        "I too have grown stronger.",
        "And now...",
        "It’s time for a makeover.",
    ];

    const [visibleIndex, setVisibleIndex] = useState(0);

    useEffect(() => {
        if (visibleIndex < messages.length) {
            const timeout = setTimeout(() => {
                setVisibleIndex(visibleIndex + 1);
            }, 2000);
            return () => clearTimeout(timeout);
        } else {
            const finalDelay = setTimeout(() => {
                onTransitionComplete();
            }, 3000);
            return () => clearTimeout(finalDelay);
        }
    }, [visibleIndex]);

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 text-center">
            {messages.slice(0, visibleIndex + 1).map((message, idx) => (
                <motion.h2
                    key={idx}
                    className="text-xl md:text-3xl font-semibold mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    {message}
                </motion.h2>
            ))}
        </div>
    );
}
