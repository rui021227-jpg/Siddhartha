import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Settings, User, History, LogOut, Maximize2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const Sidebar: React.FC = () => {
    const { user, logout } = useAuthStore();

    // Mock reflections for UI demonstration
    const reflections = [
        { id: '1', title: 'Career Path', date: 'Just now', icon: <History size={14} /> },
        { id: '2', title: 'Letting Go', date: 'Oct 28, 2023', icon: <History size={14} /> },
        { id: '3', title: 'Finding Purpose', date: 'Oct 24, 2023', icon: <History size={14} /> },
        { id: '4', title: 'Anxiety & Calm', date: 'Oct 19, 2023', icon: <History size={14} /> },
    ];

    return (
        <aside className="w-72 h-screen border-r border-border bg-primary/50 flex flex-col px-6 py-8">
            <div className="flex items-center justify-between mb-12">
                <div className="space-y-1">
                    <h2 className="text-[10px] uppercase tracking-[0.3em] text-textSecondary font-medium">Reflections</h2>
                    <p className="text-[10px] text-textSecondary italic opacity-60">Your journey of thought</p>
                </div>
                <button className="text-textSecondary hover:text-textPrimary transition-colors">
                    <Maximize2 size={16} strokeWidth={1.5} />
                </button>
            </div>

            <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
                {reflections.map((item) => (
                    <motion.div
                        key={item.id}
                        whileHover={{ x: 4 }}
                        className={`group cursor-pointer rounded-xl p-4 transition-all duration-300 ${item.id === '1' ? 'bg-white shadow-sm border border-border' : 'hover:bg-white/40'
                            }`}
                    >
                        <div className="flex items-start space-x-3">
                            <div className={`mt-1 ${item.id === '1' ? 'text-textPrimary' : 'text-textSecondary opacity-40'}`}>
                                {item.icon}
                            </div>
                            <div className="flex-1">
                                <h3 className={`text-sm font-medium ${item.id === '1' ? 'text-textPrimary' : 'text-textSecondary'}`}>
                                    {item.title}
                                </h3>
                                <p className="text-[10px] text-textSecondary opacity-50 uppercase tracking-tighter mt-0.5">
                                    {item.date}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </nav>

            <div className="mt-auto pt-8 border-t border-border/50 space-y-6">
                <button className="flex items-center space-x-3 text-textSecondary hover:text-textPrimary transition-colors group w-full px-2">
                    <Settings size={18} strokeWidth={1.5} className="group-hover:rotate-45 transition-transform duration-500" />
                    <span className="text-xs font-medium tracking-wide">Settings</span>
                </button>

                <div className="flex items-center justify-between group cursor-pointer px-2">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center border border-accent/20">
                            <User size={16} className="text-accent" />
                        </div>
                        <div className="text-left">
                            <p className="text-xs font-semibold text-textPrimary leading-none">
                                {user?.is_anonymous ? 'Wandering Soul' : (user?.email?.split('@')[0] || 'Seeker')}
                            </p>
                            <p className="text-[8px] uppercase tracking-[0.2em] text-textSecondary mt-1">
                                {user?.is_anonymous ? 'Free Plan' : 'Seeker'}
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="flex items-center space-x-3 text-textSecondary hover:text-red-400 transition-colors w-full px-2 pt-2"
                >
                    <LogOut size={16} strokeWidth={1.5} />
                    <span className="text-[10px] uppercase tracking-widest">Depart</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
