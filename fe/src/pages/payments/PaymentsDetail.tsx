import { useEffect } from "react";
import { Payment } from "../../redux/payments/paymentsThunk";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    payment: Payment | undefined;
}

export default function PaymentDetail({ isOpen, onClose, payment }: Props) {
    
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
    
    if (!isOpen || !payment) return null;
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30" onClick={onClose}>
            <div
                className="bg-white rounded-lg shadow-lg p-8 w-full max-w-6xl"
                onClick={e => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold mb-8 text-purple-700 text-center">Detalle del Abono</h2>
                <div className="text-center mb-8">
                    <span
                        className={`inline-block px-4 py-1 rounded-full text-sm font-medium
                            ${payment.status === 'pagado'
                                ? 'bg-green-100 text-green-700'
                                : payment.status === 'cancelado'
                                    ? 'bg-red-100 text-red-700'
                                    : payment.status === 'sobrepagado'
                                        ? 'bg-orange-100 text-orange-700'
                                        : payment.status === 'pendiente'
                                            ? 'bg-yellow-100 text-yellow-700'
                                            : 'bg-gray-100 text-gray-700'
                            }`}
                    >
                        Estado: {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                </div>
                <div className="flex flex-col gap-8 mb-8">
                    <div className="flex flex-wrap justify-center items-center gap-12 mb-2">
                        <div className="text-center">
                            <span className="font-semibold block mb-1 text-gray-700"># Factura</span>
                            <span className="text-lg">{payment.invoice_number}</span>
                        </div>
                        <div className="text-center">
                            <span className="font-semibold block mb-1 text-gray-700">Cliente</span>
                            <span className="text-lg">{payment.client.name}</span>
                        </div>
                        <div className="text-center">
                            <span className="font-semibold block mb-1 text-gray-700">Total Pagado</span>
                            <span className="text-lg text-green-700 font-bold">${parseFloat(payment.total_payment).toLocaleString()}</span>
                        </div>
                        <div className="text-center">
                            <span className="font-semibold block mb-1 text-gray-700">Deuda Total</span>
                            <span className="text-lg text-red-700 font-bold">${parseFloat(payment.total_debt).toLocaleString()}</span>
                        </div>
                        <div className="text-center">
                            <span className="font-semibold block mb-1 text-gray-700">Deuda Restante</span>
                            <span className="text-lg text-gray-700 font-bold">${(parseFloat(payment.total_debt) - parseFloat(payment.total_payment)).toLocaleString()}</span>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4 text-lg text-purple-600 text-center">Abonos:</h3>
                        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                            <table className="min-w-full text-sm text-gray-800">
                                <thead className="bg-purple-100 text-gray-700 uppercase text-xs">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Monto</th>
                                        <th className="px-4 py-3 text-left">Método</th>
                                        <th className="px-4 py-3 text-left">Fecha</th>
                                        <th className="px-4 py-3 text-left">Observaciones</th>
                                        <th className="px-4 py-3 text-left">Descuento</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payment.payment_details.length > 0 ? (
                                        payment.payment_details.map((detail, index) => (
                                            <tr
                                                key={detail.id}
                                                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                                            >
                                                <td className="px-4 py-2">${parseFloat(detail.amount).toLocaleString()}</td>
                                                <td className="px-4 py-2">{detail.payment_method}</td>
                                                <td className="px-4 py-2">{detail.date}</td>
                                                <td className="px-4 py-2 break-words max-w-xs whitespace-pre-wrap">{detail.observations || '-'}</td>
                                                <td className="px-4 py-2">
                                                    {detail.discount ? (
                                                        <span className="text-green-600 font-semibold">Sí</span>
                                                    ) : (
                                                        <span className="text-red-600 font-semibold">No</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-4 text-center text-gray-500">
                                                No hay abonos registrados.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
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

