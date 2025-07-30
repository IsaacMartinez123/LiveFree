import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
    ColumnDef,
    SortingState
} from '@tanstack/react-table';

import { useMemo, useState } from 'react';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { ArrowCircleLeft, ArrowCircleRight, EmptyWalletAdd, Eye } from 'iconsax-reactjs';
import { fetchPayments } from '../../redux/payments/paymentsThunk';
import AddPayment from '../../Components/sections/payments/AddPayment';
import PaymentDetail from './PaymentsDetail';
import { SortableHeader } from '../../Components/layout/SortableHeader';

export type PaymentDetail = {
    id: number;
    payment_id: number;
    amount: string;
    payment_method: string;
    date: string;
    observations: string | null;
};

export type Client = {
    id: number;
    name: string;
};

export type Payment = {
    id: number;
    sales_id: number;
    client_id: number;
    invoice_number: string;
    total_debt: string;
    total_payment: string;
    status: string;
    client: Client;
    payment_details: PaymentDetail[];
};


export default function Payments() {

    const [globalFilter, setGlobalFilter] = useState('');

    const [sorting, setSorting] = useState<SortingState>([]);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const [selectedPayment, setSelectedPayment] = useState<Payment | undefined>(undefined);

    const columns = useMemo<ColumnDef<Payment>[]>(() => [
        {
            accessorKey: 'invoice_number',
            header: ({ column }) => (
                <SortableHeader column={column} label="Número de Factura" />
            ),

        },
        {
            accessorKey: 'client',
            header: ({ column }) => (
                <SortableHeader column={column} label="Cliente" />
            ),
            cell: ({ getValue }) => {
                const client = getValue() as { id: string; name: string };
                return client.name ? client.name : 'Sin cliente asignado';
            }

        },
        {
            accessorKey: 'total_debt',
            header: ({ column }) => (
                <SortableHeader column={column} label="Total Deuda" />
            ),
            cell: ({ getValue }) => {
                const value = getValue<number>();
                return `$ ${Math.floor(value).toLocaleString()}`;
            }

        },
        {
            accessorKey: 'total_payment',
            header: ({ column }) => (
                <SortableHeader column={column} label="Total Pagado" />
            ),
            cell: ({ getValue }) => {
                const value = getValue<number>();
                return `$ ${Math.floor(value).toLocaleString()}`;
            }
        },
        {
            header: 'Deuda Restante',
            cell: ({ row }) => {
                const totalDebt = row.original.total_debt;
                const totalPayment = row.original.total_payment;
                const remainingDebt = parseFloat(totalDebt) - parseFloat(totalPayment);
                return `$ ${Math.floor(remainingDebt).toLocaleString()}`;
            }
        },
        {
            accessorKey: 'status',
            header: 'Estado',
            cell: ({ getValue }) => {
                const status = getValue() as boolean | number;
                return (
                    <span
                        className={`px-3 py-1 rounded-full text-md font-semibold
                                ${status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-yellow-700'}
                            `}
                    >
                        {status ? 'Pagado' : 'Pendiente'}
                    </span>
                );
            }
        },
        {
            id: 'actions',
            header: 'Acciones',
            cell: ({ row }) => {
                const status = row.original.status;

                return (
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                setSelectedPayment(row.original);
                                setIsDetailOpen(true);
                            }}
                            className="text-sm text-blue-600 hover:underline"
                            title="Ver Detalle"
                        >
                            <Eye size="25" />
                        </button>
                        {!status && (
                            <button
                                onClick={() => {
                                    setSelectedPayment(row.original);
                                    setIsModalOpen(true);
                                }}
                                className="text-sm text-blue-600 hover:underline"
                                title="Editar"
                            >
                                <EmptyWalletAdd size="25" color="#7E22CE" />
                            </button>
                        )}
                    </div>
                );

            }
        },
    ], []);


    const dispatch = useAppDispatch();
    const { payments, loading, error } = useAppSelector(state => state.payments);

    const data = useMemo(() => [...payments].reverse(), [payments]);

    useEffect(() => {
        dispatch(fetchPayments());
    }, [dispatch]);

    const table = useReactTable({
        data,
        columns,
        state: {
            globalFilter,
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
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
                        className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-72 text-base sm:text-lg"
                        value={globalFilter}
                        onChange={e => setGlobalFilter(e.target.value)}
                    />

                </div>
                {!loading && !error && (
                    <>
                        <div className="overflow-x-auto rounded shadow">
                            <table className="min-w-full bg-white text-left text-base sm:text-lg">
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
            <AddPayment
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedPayment(undefined);
                }}
                onSubmitSuccess={() => {
                    dispatch(fetchPayments());
                    setSelectedPayment(undefined);
                }}
                payment={selectedPayment}
            />
            <PaymentDetail
                isOpen={isDetailOpen}
                onClose={() => {
                    setIsDetailOpen(false);
                    setSelectedPayment(undefined);
                }}
                payment={selectedPayment}
            />
        </>
    );
}
