import { ProfileCircle } from "iconsax-reactjs";
import { useAppSelector } from "../../redux/hooks";

export default function Navbar() {
    const user = useAppSelector(state => state.auth.user);

    return (
        <header className="h-16 sm:h-20 bg-primary-muted shadow-md flex items-center justify-between px-4 sm:px-10">
            <div className="text-gray-600 font-medium text-sm sm:text-base">
                {/* Puedes colocar aquí el título del sistema o algo dinámico */}
            </div>
            <div className="flex items-center gap-2 text-sm sm:text-base">
                <ProfileCircle size="25" color="#7E22CE" />
                <span className="text-foreground truncate max-w-[120px] sm:max-w-xs">
                    {user?.name}
                </span>
            </div>
        </header>
    );
}
