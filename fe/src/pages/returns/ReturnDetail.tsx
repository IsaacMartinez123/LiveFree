import { useEffect } from "react";
import { Return } from "../../redux/returns/returnsThunk";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    devolucion: Return | undefined;
}

export default function ReturnDetail({ isOpen, onClose, devolucion }: Props) {

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === "Escape" && isOpen) {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEsc);
        return () => {
            document.removeEventListener("keydown", handleEsc);
        };
    }, [isOpen, onClose]);

    if (!isOpen || !devolucion) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-lg p-8 w-full max-w-6xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Título */}
                <h2 className="text-2xl font-bold text-purple-700 text-center mb-2">
                    Detalle de la Devolución #{devolucion.return_number}
                </h2>

                <div className="text-center mb-8">
                    <span
                        className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${devolucion.status === "pendiente"
                            ? "bg-yellow-100 text-yellow-700"
                            : devolucion.status === "procesada"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                    >
                        Estado:{" "}
                        {devolucion.status.charAt(0).toUpperCase() +
                            devolucion.status.slice(1)}
                    </span>
                </div>

                {/* Información general */}
                <div className="flex flex-col gap-8 mb-8">
                    <div className="flex flex-wrap justify-center items-center gap-12 mb-2">
                        {[
                            { label: "Cliente", value: devolucion.client.name },
                            { label: "Usuario", value: devolucion.user.name },
                            {
                                label: "Total devuelto",
                                value: `$${parseFloat(
                                    devolucion.refund_total
                                ).toLocaleString()}`,
                                className: "text-green-700 font-bold",
                            },
                            {
                                label: "Fecha de devolución",
                                value: devolucion.return_date,
                            },
                        ].map(({ label, value, className = "" }, index) => (
                            <div className="text-center" key={index}>
                                <span className="font-semibold block mb-1 text-gray-700">
                                    {label}
                                </span>
                                <span className={`text-lg ${className}`}>{value}</span>
                            </div>
                        ))}
                    </div>

                    {/* Tabla de productos */}
                    <div>
                        <h3 className="font-bold mb-4 text-purple-600 text-center">
                            Productos devueltos:
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm mb-4 table-fixed">
                                <thead>
                                    <tr className="bg-purple-100">
                                        <th className="px-4 py-2 w-20 text-left">REF</th>
                                        <th className="px-4 py-2 w-40 text-left">Producto</th>
                                        <th className="px-4 py-2 w-20 text-left">Color</th>
                                        <th className="px-4 py-2 w-24 text-left">Precio</th>
                                        <th className="px-4 py-2 w-20 text-center">Cantidad</th>
                                        <th className="px-4 py-2 w-24 text-left">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {devolucion.details.map((detail) => (
                                        <tr
                                            key={detail.id}
                                            className="border-t border-gray-200 hover:bg-gray-50 transition-colors text-center align-middle"
                                        >
                                            <td className="px-4 py-2 text-left">
                                                {detail.reference}
                                            </td>
                                            <td className="px-4 py-2 text-left">
                                                {detail.product_name}
                                            </td>
                                            <td className="px-4 py-2 flex justify-center">
                                                <span
                                                    className="inline-block w-5 h-5 rounded-full border"
                                                    style={{ backgroundColor: detail.color }}
                                                />
                                            </td>
                                            <td className="px-4 py-2 text-left">
                                                ${parseFloat(detail.price).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-2">{detail.amount}</td>
                                            <td className="px-4 py-2 text-left">
                                                ${(
                                                    parseFloat(detail.price) * detail.amount
                                                ).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {/* Motivo de la devolución */}
                    <div className="mt-4 p-4 border rounded bg-gray-50">
                        <h4 className="font-bold text-purple-600 mb-2">Motivo de la devolución:</h4>
                        <p className="text-gray-700">{devolucion.reason}</p>
                    </div>
                </div>

                {/* Botón de cierre */}
                <div className="flex justify-end">
                    <button
                        className="px-6 py-2 rounded bg-purple-600 text-white hover:bg-purple-700"
                        onClick={onClose}
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}
