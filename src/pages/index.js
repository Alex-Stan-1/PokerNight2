"use client";
import { useState } from "react";
import TransitionScreen from "../mainPageComponents/TransitionScreen";
import MainPage from "../mainPageComponents/MainPage";

export default function Home() {
    const [hasEntered, setHasEntered] = useState(false);

    return hasEntered ? <MainPage /> : <TransitionScreen onTransitionComplete={() => setHasEntered(true)} />;
}
