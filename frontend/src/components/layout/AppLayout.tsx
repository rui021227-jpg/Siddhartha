import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const AppLayout: React.FC = () => {
    return (
        <div className="flex h-screen w-full bg-primary text-textPrimary overflow-hidden font-sans">
            <Sidebar />

            <main className="flex-1 relative flex flex-col items-center overflow-hidden">
                {/* Visual Pillar Indicator */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10">
                    <div className="px-6 py-1.5 rounded-full border border-border bg-white/50 backdrop-blur-md">
                        <span className="text-[10px] uppercase tracking-[0.5em] text-textSecondary font-medium pl-[0.5em]">
                            Siddhartha
                        </span>
                    </div>
                </div>

                <div className="w-full h-full flex flex-col items-center">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AppLayout;
