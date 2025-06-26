import { useState, useRef, useEffect } from "react";
import { ProfileCircle } from "iconsax-reactjs";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { logout } from "../../redux/auth/authSlice";

export default function Navbar() {
    const user = useAppSelector(state => state.auth.user);
    const dispatch = useAppDispatch();
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="h-16 sm:h-20 bg-primary-muted shadow-md flex items-center justify-between px-4 sm:px-10">
            <div className="text-gray-600 font-medium text-sm sm:text-base"></div>
            <div className="relative flex items-center gap-2 text-sm sm:text-base" ref={menuRef}>
                <button
                    className="flex items-center gap-2 focus:outline-none"
                    onClick={() => setOpen(o => !o)}
                >
                    <ProfileCircle size="25" color="#7E22CE" />
                    <span className="text-foreground truncate max-w-[120px] sm:max-w-xs">
                        {user?.name}
                    </span>
                </button>
                {open && (
                    <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded shadow-lg z-50 py-2 border border-gray-100">
                        <button
                            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                            onClick={() => {
                                dispatch(logout());
                                setOpen(false);
                            }}
                        >
                            Cerrar sesión
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}