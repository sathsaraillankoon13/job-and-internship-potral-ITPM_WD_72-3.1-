import React, { useState } from 'react';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // Add actual login/authentication logic here
        console.log("Login attempted with:", { username, password });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-100 via-indigo-100 to-emerald-50 p-4 font-sans flex items-center justify-center">
            <div className="min-h-[550px] w-full max-w-[850px] overflow-hidden rounded-[30px] border border-white/60 bg-white/40 shadow-2xl backdrop-blur-xl md:flex">

                {/* Left Side: Purple area */}
                <div className="relative hidden w-[55%] flex-col justify-between overflow-hidden bg-sky-500/65 p-10 text-white md:flex">
                    {/* Character Illustration SVG */}
                    <div className="relative -mt-4 flex h-full w-full flex-1 items-center justify-center">
                        <svg className="relative z-10 h-[110%] w-[110%] p-4" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Light blue background circle */}
                            <circle cx="200" cy="200" r="140" fill="#E0F2FE" />

                            {/* Left tall purple leaf */}
                            <path d="M90 280 C50 250, 50 160, 90 130 C110 160, 110 250, 90 280 Z" fill="#3B82F6" opacity="0.9" />

                            {/* Right curved leaf */}
                            <path d="M310 320 C360 270, 340 180, 270 140 C280 200, 270 280, 310 320 Z" fill="#6366F1" opacity="0.95" />

                            {/* Small fern-like leaves left */}
                            <path d="M 120 260 Q 100 220 80 200" stroke="#60A5FA" strokeWidth="6" strokeLinecap="round" />
                            <path d="M 115 250 Q 95 240 85 220" stroke="#60A5FA" strokeWidth="4" strokeLinecap="round" />
                            <path d="M 110 235 Q 90 225 80 215" stroke="#60A5FA" strokeWidth="4" strokeLinecap="round" />

                            {/* Small fern-like leaves right */}
                            <path d="M 270 290 Q 300 240 330 200" stroke="#0066afff" strokeWidth="6" strokeLinecap="round" />
                            <path d="M 275 270 Q 305 255 320 230" stroke="#0066afff" strokeWidth="4" strokeLinecap="round" />
                            <path d="M 285 250 Q 310 235 315 210" stroke="#0066afff" strokeWidth="4" strokeLinecap="round" />

                            {/* The jumping person */}
                            <g transform="translate(185, 120)">
                                {/* Hair (flowing) */}
                                <path d="M25 -10 C 40 -50, -40 -30, -10 30 C 10 40, 20 20, 25 -10 Z" fill="#1E3A8A" />
                                {/* Face */}
                                <circle cx="30" cy="5" r="14" fill="#FDBA74" />

                                {/* Arm left */}
                                <path d="M 20 30 Q -25 10 -40 -15" stroke="#FDBA74" strokeWidth="11" strokeLinecap="round" />
                                {/* Hand details */}
                                <circle cx="-42" cy="-17" r="5" fill="#FDBA74" />

                                {/* Arm right */}
                                <path d="M 40 30 Q 80 10 80 -25" stroke="#FDBA74" strokeWidth="11" strokeLinecap="round" />
                                <circle cx="80" cy="-27" r="5" fill="#FDBA74" />

                                {/* Body (White top) */}
                                <path d="M 12 25 C 25 20, 48 20, 48 40 C 48 55, 45 75, 40 70 C 35 68, 25 68, 20 70 C 15 75, 12 55, 12 25 Z" fill="#FFFFFF" />

                                {/* Leg left (Purple pants) */}
                                <path d="M 23 60 Q 5 110 -40 120" stroke="#0563a2ff" strokeWidth="20" strokeLinecap="round" />
                                {/* Leg right */}
                                <path d="M 41 60 Q 60 70 50 100 L 25 145" stroke="#0563a2ff" strokeWidth="20" strokeLinecap="round" />

                                {/* Shoes */}
                                <path d="M -30 115 L -45 120 L -45 125 L -30 125 Z" fill="#111827" /> {/* Left Shoe */}
                                <path d="M 33 138 L 15 145 L 18 152 L 35 145 Z" fill="#111827" /> {/* Right Shoe */}
                            </g>
                        </svg>
                    </div>

                    <div className="z-10 mb-2 px-4 text-center text-[11px] font-light leading-relaxed tracking-wide text-white/80">
                        Securely manage your academic profile, discover verified university internships,
                        and share authentic ratings to build a trusted, empowering career network for all future student leaders.
                    </div>
                </div>

                {/* Right Side: Login Form */}
                <div className="relative flex w-full flex-col bg-transparent pl-2 md:w-[45%]">

                    {/* "Welcome back" tag */}
                    <div className="absolute left-[-20px] top-[12%] z-20 rounded-r-full bg-sky-700 px-8 py-2.5 text-sm font-medium text-white shadow-md shadow-blue-500/30">
                        Welcome back
                    </div>

                    <div className="flex flex-1 flex-col justify-between px-10 pb-12 pt-36">

                        <div className="mx-auto w-full max-w-sm">
                            <h2 className="mb-12 text-center text-xl font-bold tracking-wide text-gray-500">
                                Login your account
                            </h2>

                            <form className="flex flex-col gap-10" onSubmit={handleLogin}>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Username"
                                        className="w-full border-0 border-b border-gray-300 bg-transparent px-0 py-1.5 text-sm font-semibold tracking-wide text-gray-700 outline-none transition placeholder:text-gray-500 focus:border-sky-500"
                                        required
                                    />
                                </div>
                                <div className="relative">
                                    <input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Password"
                                        className="w-full border-0 border-b border-gray-300 bg-transparent px-0 py-1.5 text-sm font-semibold tracking-wide text-gray-700 outline-none transition placeholder:text-gray-500 focus:border-sky-500"
                                        required
                                    />
                                </div>

                                <div className="flex flex-col items-center pt-6">
                                    <button type="submit" className="rounded-full bg-sky-500 px-12 py-2.5 text-sm font-semibold tracking-wider text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-0.5">
                                        Login
                                    </button>
                                </div>
                            </form>

                            <div className="mt-5 text-center">
                                <a href="/signup" className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-500 transition hover:text-sky-500">
                                    Create Account
                                </a>
                            </div>
                        </div>

                        <div className="mt-auto pt-8 text-center">
                            <a href="/reset-password" className="border-b border-gray-500 pb-0.5 text-[11px] font-bold tracking-wide text-gray-500 transition hover:border-sky-600 hover:text-sky-500">
                                Forgot Password?
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;


