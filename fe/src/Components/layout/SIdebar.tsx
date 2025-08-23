import {
    ArrowDown2,
    ArrowRight2,
    Back,
    Box1,
    Chart,
    ShoppingCart,
    User,
} from "iconsax-reactjs";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
};

export default function Sidebar({ sidebarOpen, setSidebarOpen }: Props) {
    const [openUsuarios, setOpenUsuarios] = useState(false);
    const [openVentas, setOpenVentas] = useState(false);

    const navigate = useNavigate();

    return (
        <aside
            className={`
                bg-primary-muted shadow-lg transition-all duration-300
                ${sidebarOpen ? "w-64" : "w-16"}
                h-screen
                fixed sm:relative z-40
                top-0 left-0
            `}
        >
            <div className="p-4 sm:p-6 flex items-center justify-between">
                {!sidebarOpen && (
                    <button
                        className="rounded hover:bg-primary-light transition"
                        onClick={() => setSidebarOpen(true)}
                        aria-label="Abrir menú"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                )}
                {sidebarOpen && (
                    <>
                        <h1 className="text-xl sm:text-2xl font-bold text-primary">LiveFree</h1>
                        <button
                            className="ml-auto p-2 rounded hover:bg-primary-light transition"
                            onClick={() => {
                                setSidebarOpen(false);
                                setOpenUsuarios(false);
                                setOpenVentas(false);
                            }}
                            aria-label="Cerrar menú"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </>
                )}
            </div>

            <nav className="mt-4 sm:mt-6">
                <ul className="space-y-4 sm:space-y-5 text-sm sm:text-base">
                    <li>
                        <button 
                            className="pl-6 py-2 text-form-label font-semibold hover:text-primary-dark flex items-center gap-x-4"
                            onClick={() => {
                                navigate("/reports");
                            }}
                        >
                            <Chart size="25" color="#7E22CE" />
                            {sidebarOpen && "Reportes"}
                        </button>
                    </li>

                    <li>
                        <button
                            className="pl-6 py-2 text-form-label font-semibold hover:text-primary-dark flex items-center gap-x-4"
                            onClick={
                                sidebarOpen ? () => setOpenUsuarios(!openUsuarios) : undefined
                            }
                        >
                            <User size="25" color="#7E22CE" />
                            {sidebarOpen && "Usuarios"}
                            {sidebarOpen &&
                                (openUsuarios ? (
                                    <ArrowDown2 size="20" color="#7E22CE" />
                                ) : (
                                    <ArrowRight2 size="20" color="#7E22CE" />
                                ))}
                        </button>
                        {sidebarOpen && openUsuarios && (
                            <ul className="ml-4 mt-1 space-y-1">
                                <li>
                                    <button
                                        className="pl-6 py-2 text-form-label hover:text-primary-dark"
                                        onClick={() => {
                                            setOpenUsuarios(false);
                                            navigate("/users");
                                        }}
                                    >
                                        Gestión de usuarios
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="pl-6 py-2 text-form-label hover:text-primary-dark"
                                        onClick={() => {
                                            setOpenUsuarios(false);
                                            navigate("/clients");
                                        }}
                                    >
                                        Información de clientes
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="pl-6 py-2 text-form-label hover:text-primary-dark"
                                        onClick={() => {
                                            setOpenUsuarios(false);
                                            navigate("/sellers");
                                        }}
                                    >
                                        Información de vendedores
                                    </button>
                                </li>
                            </ul>
                        )}
                    </li>

                    <li>
                        <button
                            className="pl-6 py-2 text-form-label font-semibold hover:text-primary-dark flex items-center gap-x-4"
                            onClick={() => {
                                navigate("/products");
                            }}
                        >
                            <Box1 size="25" color="#7E22CE" />
                            {sidebarOpen && "Productos"}
                        </button>
                    </li>

                    <li>
                        <button
                            className="pl-6 py-2 text-form-label font-semibold hover:text-primary-dark flex items-center gap-x-4"
                            onClick={
                                sidebarOpen ? () => setOpenVentas(!openVentas) : undefined
                            }
                        >
                            <ShoppingCart size="25" color="#7E22CE" />
                            {sidebarOpen && "Ventas"}
                            {sidebarOpen &&
                                (openVentas ? (
                                    <ArrowDown2 size="20" color="#7E22CE" />
                                ) : (
                                    <ArrowRight2 size="20" color="#7E22CE" />
                                ))}
                        </button>
                        {sidebarOpen && openVentas && (
                            <ul className="ml-4 mt-1 space-y-1">
                                <li>
                                    <button
                                        className="pl-6 py-2 text-form-label hover:text-primary-dark"
                                        onClick={() => {
                                            navigate("/sales");
                                        }}
                                    >
                                        Gestión de ventas
                                    </button>
                                </li>
                                <li>
                                    <button 
                                        className="pl-6 py-2 text-form-label hover:text-primary-dark"
                                        onClick={() => {
                                            navigate("/payments");
                                        }}
                                    >
                                        Gestión de Abonos
                                    </button>
                                </li>
                            </ul>
                        )}
                    </li>
                    <li>
                        <button
                            className="pl-6 py-2 text-form-label font-semibold hover:text-primary-dark flex items-center gap-x-4"
                            onClick={() => {
                                navigate("/returns");
                            }}
                        >
                            <Back size="25" color="#7E22CE" />
                            {sidebarOpen && "Devoluciones"}
                        </button>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}
