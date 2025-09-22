"use client";

import { useState } from "react";

interface ApiResponse {
    refinedPrompt?: string;
    image?: string;
    error?: string;
}

export default function Home() {
    const [prompt, setPrompt] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [refinedPrompt, setRefinedPrompt] = useState<string>("");
    const [image, setImage] = useState<string>("");
    const [error, setError] = useState<string>("");

    const generateImage = async () => {
        if (!prompt) return;
        setLoading(true);
        setRefinedPrompt("");
        setImage("");
        setError("");

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            });

            const data: ApiResponse = await res.json();

            if (data.error) {
                setError(data.error);
                setRefinedPrompt(data.refinedPrompt || "Image generation failed.");
                return;
            }

            setRefinedPrompt(data.refinedPrompt || "No refined prompt found");
            setImage(data.image || "");
        } catch (err) {
            console.error("Error:", err);
            setError("⚠️ Failed to reach backend.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-white px-6 py-12">
            <h1 className="text-3xl font-bold mb-6 text-center">AI Image Generator</h1>

            <div className="w-full max-w-lg bg-gray-900 rounded-2xl p-6 shadow-lg">
                <textarea
                    className="w-full p-3 rounded-xl text-white bg-gray-800 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                    rows={3}
                    placeholder="Enter your idea (e.g. cyberpunk samurai riding a dragon)"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                />




                <button
                    onClick={generateImage}
                    disabled={loading || !prompt.trim()}
                    className={`mt-4 w-full py-3 px-4 rounded-xl font-semibold transition duration-200 ${loading || !prompt.trim()
                        ? "bg-gray-700 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                        }`}
                >
                    {loading ? "Generating..." : "Generate Image"}
                </button>
            </div>

            {loading && (
                <div className="mt-6 flex flex-col items-center">
                    <div className="animate-spin h-10 w-10 border-4 border-blue-400 border-t-transparent rounded-full"></div>
                    <p className="mt-3 text-blue-300">✨ Crafting the best output...</p>
                </div>
            )}

            {error && !loading && (
                <div className="mt-6 text-center">
                    <p className="text-red-400">{error}</p>
                    <button
                        onClick={generateImage}
                        className="mt-3 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-xl transition duration-200"
                    >
                        Retry
                    </button>
                </div>
            )}

            {!loading && refinedPrompt && !error && (
                <div className="mt-10 max-w-xl text-center">
                    <h2 className="text-xl font-semibold mb-3">Refined Prompt</h2>
                    <p className="text-gray-300">{refinedPrompt}</p>
                </div>
            )}

            {!loading && image && !error && (
                <div className="mt-10 flex flex-col items-center">
                    <h2 className="text-xl font-semibold mb-3">Generated Image</h2>
                    <img
                        src={image}
                        alt="Generated result"
                        className="max-w-xl rounded-2xl shadow-lg opacity-0 animate-fadeIn"
                    />
                    <a
                        href={image}
                        download="generated.png"
                        className="mt-4 inline-block text-blue-400 underline"
                    >
                        ⬇ Download Image
                    </a>
                </div>
            )}

            <style jsx>{`
                @keyframes fadeIn {
                    to {
                        opacity: 1;
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.8s ease forwards;
                }
            `}</style>
        </div>
    );
}
