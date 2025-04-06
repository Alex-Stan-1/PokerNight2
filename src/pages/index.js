"use client";
import { useState } from "react";
import TransitionScreen from "../mainPageComponents/TransitionScreen";
import MainPage from "../mainPageComponents/MainPage";

export default function Home() {
    const [showMainPage, setShowMainPage] = useState(false);

    return (
        <>
            {showMainPage ? (
                <MainPage />
            ) : (
                <TransitionScreen onComplete={() => setShowMainPage(true)} />
            )}
        </>
    );
}
