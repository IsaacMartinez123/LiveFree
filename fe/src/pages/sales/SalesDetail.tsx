import { Sales } from './Sales'; 

interface Props {
    isOpen: boolean;
    onClose: () => void;
    sale: Sales | undefined;
}

export default function SalesDetail({ isOpen, onClose, sale }: Props) {
    if (!isOpen || !sale) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30" onClick={onClose}>
            <div
                className="bg-white rounded-lg shadow-lg p-8 w-full max-w-6xl"
                onClick={e => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold mb-8 text-purple-700 text-center">Detalle de la Venta #{sale.invoice_number}</h2>
                <div className="flex flex-col gap-8 mb-8">
                    <div className="flex flex-wrap justify-center items-center gap-12 mb-2">
                        <div className="text-center">
                            <span className="font-semibold block mb-1 text-gray-700">Cliente</span>
                            <span className="text-lg">{sale.client.name}</span>
                        </div>
                        <div className="text-center">
                            <span className="font-semibold block mb-1 text-gray-700">Vendedor</span>
                            <span className="text-lg">{sale.seller.name}</span>
                        </div>
                        <div className="text-center">
                            <span className="font-semibold block mb-1 text-gray-700">Usuario</span>
                            <span className="text-lg">{sale.user.name}</span>
                        </div>
                        <div className="text-center">
                            <span className="font-semibold block mb-1 text-gray-700">Total</span>
                            <span className="text-lg text-green-700 font-bold">${parseFloat(sale.total).toLocaleString()}</span>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4 text-purple-600 text-center">Productos:</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm mb-4">
                                <thead>
                                    <tr className="bg-purple-100">
                                        <th className="px-4 py-2">Producto</th>
                                        <th className="px-4 py-2">Color</th>
                                        <th className="px-4 py-2">Precio</th>
                                        <th className="px-4 py-2">S</th>
                                        <th className="px-4 py-2">M</th>
                                        <th className="px-4 py-2">L</th>
                                        <th className="px-4 py-2">XL</th>
                                        <th className="px-4 py-2">2XL</th>
                                        <th className="px-4 py-2">3XL</th>
                                        <th className="px-4 py-2">4XL</th>
                                        <th className="px-4 py-2">Devueltos S</th>
                                        <th className="px-4 py-2">Devueltos M</th>
                                        <th className="px-4 py-2">Devueltos L</th>
                                        <th className="px-4 py-2">Devueltos XL</th>
                                        <th className="px-4 py-2">Devueltos 2XL</th>
                                        <th className="px-4 py-2">Devueltos 3XL</th>
                                        <th className="px-4 py-2">Devueltos 4XL</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sale.sales_details.map(detail => (
                                        <tr key={detail.id} className="border-t border-gray-200 hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-2">{detail.product_name}</td>
                                            <td className="px-4 py-2">
                                                <span
                                                    className="inline-block w-8 h-8 rounded-full border"
                                                    style={{ backgroundColor: detail.color }}
                                                />
                                            </td>
                                            <td className="px-4 py-2">${parseFloat(detail.price).toLocaleString()}</td>
                                            <td className="px-4 py-2">{detail.size_S}</td>
                                            <td className="px-4 py-2">{detail.size_M}</td>
                                            <td className="px-4 py-2">{detail.size_L}</td>
                                            <td className="px-4 py-2">{detail.size_XL}</td>
                                            <td className="px-4 py-2">{detail.size_2XL}</td>
                                            <td className="px-4 py-2">{detail.size_3XL}</td>
                                            <td className="px-4 py-2">{detail.size_4XL}</td>
                                            <td className="px-4 py-2">{detail.returned_S}</td>
                                            <td className="px-4 py-2">{detail.returned_M}</td>
                                            <td className="px-4 py-2">{detail.returned_L}</td>
                                            <td className="px-4 py-2">{detail.returned_XL}</td>
                                            <td className="px-4 py-2">{detail.returned_2XL}</td>
                                            <td className="px-4 py-2">{detail.returned_3XL}</td>
                                            <td className="px-4 py-2">{detail.returned_4XL}</td>
                                        </tr>
                                    ))}
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

