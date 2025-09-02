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

import { useMemo, useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { ArrowCircleLeft, ArrowCircleRight, DollarCircle, Eye } from 'iconsax-reactjs';
import { fetchPayments, Payment } from '../../redux/payments/paymentsThunk';
import AddPayment from '../../Components/sections/payments/AddPayment';
import PaymentDetail from './PaymentsDetail';
import { SortableHeader } from '../../Components/layout/SortableHeader';
import DownloadPaymentButton from '../../Components/PDF/DownloadPaymentButton';
import { FetchParams } from '../../redux/sales/salesThunk';
import { SelectStatusFilter } from '../../Components/layout/SelectStatusFilter';

const stateSales = [
    { value: '', label: 'Todos' },
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'pagado', label: 'Pagado' },
    { value: 'sobrepagado', label: 'Sobrepagado' },
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
                return <span className='text-red-700 text-base md:text-lg lg:text-xl'>${Math.floor(value).toLocaleString()}</span>;
            }
        },
        {
            accessorKey: 'total_payment',
            header: ({ column }) => (
                <SortableHeader column={column} label="Total Pagado" />
            ),
            cell: ({ getValue }) => {
                const value = getValue<number>();
                return <span className='text-green-700 text-base md:text-lg lg:text-xl'>${Math.floor(value).toLocaleString()}</span>;
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
                    return <span className="text-gray-400 text-base md:text-lg">-</span>;
                }
                return (
                    <span
                        className={`px-3 py-1 rounded-full text-base md:text-lg lg:text-xl font-semibold
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
                return (
                    <div className="flex gap-2 text-base md:text-lg lg:text-xl">
                        <button
                            onClick={() => {
                                setSelectedPayment(row.original);
                                setIsDetailOpen(true);
                            }}
                            className="text-blue-600 hover:underline"
                            title="Ver Detalle"
                        >
                            <Eye size="30" />
                        </button>
                        {row.original.status !== 'cancelado' && (
                            <button
                                onClick={() => {
                                    setSelectedPayment(row.original);
                                    setIsModalOpen(true);
                                }}
                                className="text-blue-600 hover:underline"
                                title="Agregar Abono"
                            >
                                <DollarCircle size="30" color="#7E22CE" />
                            </button>
                        )}
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
    }, [dispatch, params]);

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
            {loading && <div className="text-center text-purple-600 font-medium text-xl md:text-2xl">Cargando...</div>}
            {error && <div className="text-center text-red-500 text-xl md:text-2xl">Error: {error}</div>}

            <div className="p-4 sm:p-6 lg:p-8">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-12" style={{ color: '#7E22CE' }}>
                    Gestión de Abonos
                </h1>
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
                        className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-72 text-lg md:text-xl"
                        value={globalFilter}
                        onChange={e => setGlobalFilter(e.target.value)}
                    />
                </div>
                {!loading && !error && (
                    <>
                        <div className="overflow-x-auto rounded shadow">
                            <table className="min-w-full bg-white text-left text-lg md:text-xl">
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
                        <div className="flex flex-col sm:flex-row justify-end items-center mt-4 gap-2 text-lg md:text-xl">
                            <div className="flex items-center gap-2">
                                <button
                                    className="px-3 py-1 hover:bg-purple-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                >
                                    <ArrowCircleLeft size="30" color="#7E22CE" />
                                </button>
                                <span className="mx-2 text-gray-700">
                                    Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
                                </span>
                                <button
                                    className="px-3 py-1 hover:bg-purple-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                >
                                    <ArrowCircleRight size="30" color="#7E22CE" />
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