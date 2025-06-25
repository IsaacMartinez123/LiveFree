import Sidebar from './SIdebar';
import Navbar from './Navbar';
import { useState } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {

    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex min-h-screen">
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            <div className="flex-1 flex flex-col">
                <Navbar />
                <main className="p-4 sm:p-6 overflow-x-auto">{children}</main>
            </div>
        </div>
    );
}