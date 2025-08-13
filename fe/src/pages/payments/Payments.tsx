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
import { ArrowCircleLeft, ArrowCircleRight, DollarCircle, Eye } from 'iconsax-reactjs';
import { fetchPayments } from '../../redux/payments/paymentsThunk';
import AddPayment from '../../Components/sections/payments/AddPayment';
import PaymentDetail from './PaymentsDetail';
import { SortableHeader } from '../../Components/layout/SortableHeader';
import DownloadPaymentButton from '../../Components/PDF/DownloadPaymentButton';
import { SelectStatusFilter } from '../../Components/layout/SelectStatusFilter';
import { FetchParams } from '../sales/Sales';

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

const stateSales = [
    { value: '', label: 'Todos' },
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'pagado', label: 'Pagado' },
    { value: 'cancelado', label: 'Cancelado' },
];

export default function Payments() {

    const [globalFilter, setGlobalFilter] = useState('');

    const [sorting, setSorting] = useState<SortingState>([]);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const [selectedPayment, setSelectedPayment] = useState<Payment>();

    const [statusFilter, setStatusFilter] = useState('');

    const [params, setParams] = useState<FetchParams>({ status: '' });

    const columns = useMemo<ColumnDef<Payment>[]>(() => [
        {
            accessorKey: 'invoice_number',
            header: ({ column }) => (
                <SortableHeader column={column} label="Número de Factura" />
            ),

        },
        {
            accessorKey: 'client_name',
            header: ({ column }) => (
                <SortableHeader column={column} label="Cliente" />
            ),

        },

        {
            accessorKey: 'total_debt',
            header: ({ column }) => (
                <SortableHeader column={column} label="Total Deuda" />
            ),
            cell: ({ getValue }) => {
                const value = getValue<number>();
                return <span className='text-red-700'>${Math.floor(value).toLocaleString()}</span>;
            }

        },
        {
            accessorKey: 'total_payment',
            header: ({ column }) => (
                <SortableHeader column={column} label="Total Pagado" />
            ),
            cell: ({ getValue }) => {
                const value = getValue<number>();
                return <span className='text-green-700'>${Math.floor(value).toLocaleString()}</span>;
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
                const status = getValue() as string | undefined;
                if (!status) {
                    return <span className="text-gray-400">-</span>;
                }
                return (
                    <span
                        className={`px-3 py-1 rounded-full text-base sm:text-lg font-semibold
                                ${status === 'pendiente' ? 'bg-yellow-100 text-yellow-700' :
                                    status === 'pagado' ? 'bg-green-100 text-green-700' :
                                        status === 'cancelado' ? 'bg-red-100 text-red-700' : 
                                            status === 'sobrepagado' ? 'bg-orange-100 text-orange-700' : ''
                            }
                            `}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
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
                        <button
                            onClick={() => {
                                setSelectedPayment(row.original);
                                setIsModalOpen(true);
                            }}
                            className="text-sm text-blue-600 hover:underline"
                            title="Agregar Abono"
                        >
                            <DollarCircle size="25" color="#7E22CE" />
                        </button>
                        <DownloadPaymentButton payment={row.original} />
                    </div>
                );

            }
        },
    ], []);


    const dispatch = useAppDispatch();
    const { payments, loading, error } = useAppSelector(state => state.payments);

    const data = useMemo(() => [...payments].reverse(), [payments]);

    useEffect(() => {
        dispatch(fetchPayments(params));
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
                <div className="mb-4">
                    <SelectStatusFilter
                        value={statusFilter}
                        onChange={
                            (value) => {
                                setStatusFilter(value);
                                setParams({ status: value });
                                dispatch(fetchPayments({ status: value }));
                            }
                        }
                        options={stateSales}
                    />
                </div>
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
                    dispatch(fetchPayments(params));
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
