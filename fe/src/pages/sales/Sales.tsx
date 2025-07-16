import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    ColumnDef,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { ArrowCircleLeft, ArrowCircleRight, Eye, Forbidden2 } from 'iconsax-reactjs';
import { fetchSales, toggleSaleStatus } from '../../redux/sales/salesThunk';
import SalesDetail from './SalesDetail';
// import AddProduct from '../../Components/sections/products/AddProduct';

export type SaleDetail = {
    id: number;
    sale_id: number;
    product_id: number;
    product_name: string;
    price: string;
    color: string;
    size_S: number;
    size_M: number;
    size_L: number;
    size_XL: number;
    size_2XL: number;
    size_3XL: number;
    size_4XL: number;
    returned_S: number;
    returned_M: number;
    returned_L: number;
    returned_XL: number;
    returned_2XL: number;
    returned_3XL: number;
    returned_4XL: number;
};

export type Sales = {
    id: number;
    invoice_number: string;
    client_id: number;
    seller_id: number;
    user_id: number;
    total: string;
    client: { id: number; name: string };
    seller: { id: number; name: string };
    user: { id: number; name: string };
    sales_details: SaleDetail[];
    date: string;
    status: string;
    created_at?: string;
};

export default function Sales() {
    const [globalFilter, setGlobalFilter] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [selectedSale, setSelectedSale] = useState<Sales | undefined>(undefined);

    const columns = useMemo<ColumnDef<Sales>[]>(
        () => [
            {
                accessorKey: 'invoice_number',
                header: 'Número de Factura',
                cell: ({ getValue }) => {
                    const value = getValue<string>();
                    return <span className="font-semibold">#{value}</span>;
                }
            },
            { accessorKey: 'client.name', header: 'Cliente' },
            { accessorKey: 'seller.name', header: 'Vendedor' },
            {
                accessorKey: 'total',
                header: 'Total',
                cell: ({ getValue }) => {
                    const value = getValue<number>();
                    return `$ ${Math.floor(value).toLocaleString()}`;
                }
            },
            {
                accessorKey: 'status',
                header: 'Estado',
                cell: ({ getValue }) => {
                    const status = getValue() as string | undefined;
                    if (!status) {
                        return <span className="text-gray-400">-</span>;
                    }
                    return (
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold
                                ${status === 'pendiente' ? 'bg-yellow-100 text-yellow-700' :
                                    status === 'despachada' ? 'bg-green-100 text-green-700' :
                                        status === 'cancelada' ? 'bg-red-100 text-red-700' :
                                            status === 'devuelta' ? 'bg-blue-100 text-blue-700' : ''
                                }
                            `}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                    );
                }
            },
            {
                id: 'registro',
                header: 'Datos de Registro',
                cell: ({ row }) => (
                    <div className="flex flex-col">
                        <span className="font-semibold text-xs text-gray-700">Usuario:</span>
                        <span className="mb-1">{row.original.user.name}</span>
                        <span className="font-semibold text-xs text-gray-700">Fecha:</span>
                        <span>{row.original.created_at ? new Date(row.original.created_at).toLocaleString() : '-'}</span>
                    </div>
                )
            },
            {
                id: 'actions',
                header: 'Acciones',
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => {
                                setSelectedSale(row.original);
                                setIsModalOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-800"
                        >
                            <Eye size="20" />
                        </button>
                        {row.original.status !== 'cancelada' &&(
                            <button
                                onClick={() => {
                                    dispatch(toggleSaleStatus(row.original.id)).then(() => {
                                        dispatch(fetchSales());
                                    });
                                }}
                                className={`text-sm ${row.original.status ? 'text-red-600' : 'text-green-600'} hover:underline`}
                                title='Cancelar Venta'
                            >
                                <Forbidden2 size="20" color={row.original.status ? "#dc2626" : "#16a34a"} />
                            </button>
                        )}
                    </div>
                )
            }
        ],
        []
    );

    const dispatch = useAppDispatch();
    const { sales, loading, error } = useAppSelector(state => state.sales);

    const data = useMemo(() => [...sales].reverse(), [sales]);


    useEffect(() => {
        dispatch(fetchSales());
    }, [dispatch]);

    const table = useReactTable({
        data,
        columns,
        state: {
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <>
            {loading && <div className="text-center text-purple-600 font-medium">Cargando...</div>}
            {error && <div className="text-center text-red-500">Error: {error}</div>}

            <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Buscar..."
                        className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-72 text-sm"
                        value={globalFilter}
                        onChange={e => setGlobalFilter(e.target.value)}
                    />

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-primary-light text-white px-4 py-2 rounded-lg hover:bg-primary transition text-sm w-full sm:w-auto"
                    >
                        Registrar Venta
                    </button>
                </div>
                {!loading && !error && (
                    <>
                        <div className="w-full overflow-x-auto rounded shadow border border-gray-200">
                            <table className="min-w-[1000px] w-full bg-white text-left text-sm sm:text-base table-auto">
                                <thead className="bg-purple-100">
                                    {table.getHeaderGroups().map(headerGroup => (
                                        <tr key={headerGroup.id}>
                                            {headerGroup.headers.map(header => (
                                                <th key={header.id} className="px-4 py-3 whitespace-nowrap">
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                </th>
                                            ))}
                                        </tr>
                                    ))}
                                </thead>

                                <tbody>
                                    {table.getRowModel().rows.map(row => (
                                        <tr key={row.id} className="border-t border-gray-200 hover:bg-gray-100 transition-colors">
                                            {row.getVisibleCells().map(cell => (
                                                <td key={cell.id} className="px-4 py-2 whitespace-nowrap">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-end items-center mt-4 gap-2 text-sm">
                            <div className="flex items-center gap-2">
                                <button
                                    className="px-3 py-1 hover:bg-purple-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                >
                                    <ArrowCircleLeft size="25" color="#7E22CE" />
                                </button>

                                <span className="mx-2 text-gray-700">
                                    Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
                                </span>

                                <button
                                    className="px-3 py-1 hover:bg-purple-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                >
                                    <ArrowCircleRight size="25" color="#7E22CE" />
                                </button>
                            </div>
                        </div>

                    </>
                )}
            </div>
            {/* <AddProduct
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedSale(undefined);
                }}
                onSubmitSuccess={() => {
                    dispatch(fetchSales());
                    setSelectedSale(undefined);
                }}
                sale={selectedSale}
            /> */}
            <SalesDetail isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} sale={selectedSale} />
        </>
    );
}
