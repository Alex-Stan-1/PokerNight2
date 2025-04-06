"use client";

export default function MainPage() {
    return (
        <div className="min-h-screen bg-pink-100 text-pink-900 font-serif flex flex-col items-center justify-center px-4 py-12">
            <h1 className="text-4xl md:text-6xl font-extrabold text-center mb-6 drop-shadow-lg">
                👑 The Royal Flush 👑
            </h1>
            <p className="text-xl md:text-2xl text-center max-w-xl mb-10">
                You’re cordially invited to a night of deception, drama, and diamonds.
                Where queens reign and only the fiercest remain.
            </p>
            <button className="px-8 py-4 bg-pink-500 hover:bg-pink-600 text-white rounded-full text-lg shadow-md transition-all">
                Enter the Castle
            </button>
        </div>
    );
}
