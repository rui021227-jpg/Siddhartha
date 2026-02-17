import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';

export default function LandingPage() {
    const navigate = useNavigate();
    const { guestLogin, isLoading } = useAuthStore();

    const handleGuestEntry = async () => {
        await guestLogin();
        navigate('/app/new');
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-primary text-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="max-w-md w-full flex flex-col items-center space-y-12"
            >
                {/* Minimalist Lotus Icon */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 1.5 }}
                    className="text-textPrimary/80"
                >
                    <svg width="64" height="64" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M50 20C50 20 40 40 40 50C40 60 45 65 50 65C55 65 60 60 60 50C60 40 50 20 50 20Z" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M50 35C50 35 30 45 25 55C20 65 25 75 35 75C45 75 50 70 50 60" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M50 35C50 35 70 45 75 55C80 65 75 75 65 75C55 75 50 70 50 60" stroke="currentColor" strokeWidth="1.5" />
                        <circle cx="50" cy="15" r="4" fill="currentColor" opacity="0.6" />
                    </svg>
                </motion.div>

                <div className="space-y-4">
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 1.5 }}
                        className="text-6xl font-serif text-textPrimary tracking-[0.05em]"
                    >
                        Siddhartha
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9, duration: 1.5 }}
                        className="text-lg text-textSecondary italic font-serif"
                    >
                        Find clarity in the quiet
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 1.5 }}
                    className="pt-8"
                >
                    <button
                        onClick={handleGuestEntry}
                        disabled={isLoading}
                        className="group relative px-12 py-4 border border-textPrimary/20 rounded-full font-serif text-lg tracking-wider hover:border-textPrimary/40 transition-all duration-500"
                    >
                        {isLoading ? (
                            <span className="flex items-center space-x-2">
                                <span className="w-1.5 h-1.5 bg-textSecondary rounded-full animate-pulse" />
                                <span className="italic opacity-50 text-base">Centering...</span>
                            </span>
                        ) : (
                            "Begin your journey"
                        )}
                        <div className="absolute inset-0 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>

                    <button
                        onClick={() => navigate('/auth')}
                        className="block mt-8 text-[10px] uppercase tracking-[0.3em] text-textSecondary hover:text-textPrimary transition-colors duration-500"
                    >
                        Enter your space
                    </button>
                </motion.div>
            </motion.div>
        </div>
    );
}
