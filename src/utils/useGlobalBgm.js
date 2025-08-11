"use client";
import { useCallback, useEffect } from "react";

let _bgm = null;   // HTMLAudioElement (singleton)
let _ctx = null;   // (Web)AudioContext
let _gain = null;  // GainNode for smooth volume
let _srcNode = null;

export default function useGlobalBgm(src = "/Hexley_Theme.mp3") {
    useEffect(() => {
        if (!_bgm) {
            _bgm = new Audio(src);
            _bgm.loop = true;
            _bgm.preload = "auto";
            _bgm.muted = false;
            _bgm.setAttribute("playsinline", "true");
            _bgm.volume = 1;            // IMPORTANT: leave element volume > 0

            try {
                const AC = window.AudioContext || window.webkitAudioContext;
                _ctx = new AC();
                _srcNode = _ctx.createMediaElementSource(_bgm);
                _gain = _ctx.createGain();
                _gain.gain.value = 0;     // start silent via the gain node
                _srcNode.connect(_gain).connect(_ctx.destination);
            } catch {
                _ctx = null;
                _gain = null;
            }
        }
    }, [src]);

    const play = useCallback(async () => {
        try {
            if (_ctx && _ctx.state === "suspended") await _ctx.resume();
            await _bgm.play();
        } catch (e) {
            console.warn("bgm.play() failed:", e);
        }
    }, []);

    const pause = useCallback(() => {
        try { _bgm.pause(); } catch { }
    }, []);

    const isPlaying = useCallback(() => {
        return !!_bgm && !_bgm.paused && _bgm.currentTime > 0 && !_bgm.ended;
    }, []);

    const setVolume = useCallback((v) => {
        if (_gain) _gain.gain.value = v;
        else _bgm.volume = v;
    }, []);

    const fadeTo = useCallback((target = 0.12, ms = 400) => {
        if (_gain && _ctx) {
            const now = _ctx.currentTime;
            _gain.gain.cancelScheduledValues(now);
            _gain.gain.setValueAtTime(_gain.gain.value, now);
            _gain.gain.linearRampToValueAtTime(target, now + ms / 1000);
        } else {
            // fallback if WebAudio unavailable
            const start = _bgm.volume;
            const steps = Math.max(1, Math.floor(ms / 50));
            let i = 0;
            const id = setInterval(() => {
                i++;
                _bgm.volume = start + (target - start) * (i / steps);
                if (i >= steps) clearInterval(id);
            }, 50);
        }
    }, []);

    return { element: _bgm, play, pause, isPlaying, setVolume, fadeTo };
}
