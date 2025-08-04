import { Sales } from './Sales';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    sale: Sales | undefined;
}

export default function SalesDetail({ isOpen, onClose, sale }: Props) {
    if (!isOpen || !sale) return null;

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
                    Detalle de la Venta #{sale.invoice_number}
                </h2>

                <div className="text-center mb-8">
                    <span
                        className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${sale.status === 'activa'
                            ? 'bg-green-100 text-green-700'
                            : sale.status === 'cancelada'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                    >
                        Estado: {sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}
                    </span>
                </div>

                {/* Información general */}
                <div className="flex flex-col gap-8 mb-8">
                    <div className="flex flex-wrap justify-center items-center gap-12 mb-2">
                        {[
                            { label: 'Cliente', value: sale.client.name },
                            { label: 'Vendedor', value: sale.seller.name },
                            { label: 'Usuario', value: sale.user.name },
                            {
                                label: 'Total',
                                value: `$${parseFloat(sale.total).toLocaleString()}`,
                                className: 'text-green-700 font-bold',
                            },
                        ].map(({ label, value, className = '' }, index) => (
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
                            Productos:
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm mb-4 table-fixed">
                                <thead>
                                    <tr className="bg-purple-100">
                                        <th className="px-4 py-2 w-20 text-left">REF</th>
                                        <th className="px-4 py-2 w-40 text-left">Producto</th>
                                        <th className="px-4 py-2 w-20 text-left">Color</th>
                                        <th className="px-4 py-2 w-24 text-left">Precio</th>
                                        <th className="px-2 py-2 w-10">S</th>
                                        <th className="px-2 py-2 w-10">M</th>
                                        <th className="px-2 py-2 w-10">L</th>
                                        <th className="px-2 py-2 w-10">XL</th>
                                        <th className="px-2 py-2 w-12">2XL</th>
                                        <th className="px-2 py-2 w-12">3XL</th>
                                        <th className="px-2 py-2 w-12">4XL</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sale.sales_details.map((detail) => (
                                        <tr
                                            key={detail.id}
                                            className="border-t border-gray-200 hover:bg-gray-50 transition-colors text-center align-middle"
                                        >
                                            <td className="px-4 py-2 text-left">{detail.reference}</td>
                                            <td className="px-4 py-2 text-left">{detail.product_name}</td>
                                            <td className="px-4 py-2 flex justify-center">
                                                <span
                                                    className="inline-block w-5 h-5 rounded-full border"
                                                    style={{ backgroundColor: detail.color }}
                                                />
                                            </td>
                                            <td className="px-4 py-2 text-left">
                                                ${parseFloat(detail.price).toLocaleString()}
                                            </td>
                                            <td className="px-2 py-2">{detail.size_S}</td>
                                            <td className="px-2 py-2">{detail.size_M}</td>
                                            <td className="px-2 py-2">{detail.size_L}</td>
                                            <td className="px-2 py-2">{detail.size_XL}</td>
                                            <td className="px-2 py-2">{detail.size_2XL}</td>
                                            <td className="px-2 py-2">{detail.size_3XL}</td>
                                            <td className="px-2 py-2">{detail.size_4XL}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                        </div>
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
