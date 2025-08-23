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
import { ArrowCircleLeft, ArrowCircleRight, Edit, Eye, MoneySend, Refresh } from 'iconsax-reactjs';
import { FetchParams, fetchSales } from '../../redux/sales/salesThunk';
import { SortableHeader } from '../../Components/layout/SortableHeader';
import { SelectStatusFilter } from '../../Components/layout/SelectStatusFilter';
import { fetchReturns, Return, toggleReturnStatus } from '../../redux/returns/returnsThunk';
import AddReturn from '../../Components/sections/returns/AddReturn';
import ReturnDetail from './ReturnDetail';
import { toast } from 'react-toastify';
import DownloadReturnButton from '../../Components/PDF/DownloadReturnButton';


const stateSales = [
    { value: '', label: 'Todos' },
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'reembolsado', label: 'Reembolsado' },
];

// Componente separado para la celda "reason"
const ReasonCell: React.FC<{ value: string }> = ({ value }) => {
    const [expanded, setExpanded] = useState(false);
    const maxLength = 50;

    const displayedText = expanded
        ? value
        : value.length > maxLength
            ? value.slice(0, maxLength) + '...'
            : value;

    return (
        <div className="max-w-xs break-words whitespace-pre-wrap text-gray-800">
            {displayedText}
            {value.length > maxLength && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="ml-1 text-blue-600 hover:underline text-sm"
                >
                    {expanded ? 'ver menos' : 'ver más'}
                </button>
            )}
        </div>
    );
};


export default function Returns() {
    const [globalFilter, setGlobalFilter] = useState('');

    const [sorting, setSorting] = useState<SortingState>([]);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const [selectedReturn, setSelectedReturn] = useState<Return | undefined>(undefined);

    const [statusFilter, setStatusFilter] = useState('');

    const [params, setParams] = useState<FetchParams>({ status: '' });

    const columns = useMemo<ColumnDef<Return>[]>(
        () => [
            {
                accessorKey: 'return_number',
                header: ({ column }) => (
                    <SortableHeader column={column} label="Número de Devolución" />
                ),
                cell: ({ getValue }) => {
                    const value = getValue<string>();
                    return <span className="font-semibold">#{value}</span>;
                }
            },
            {
                accessorKey: 'client.name',
                header: ({ column }) => (
                    <SortableHeader column={column} label="Cliente" />
                ),
            },
            {
                accessorKey: 'return_date',
                header: ({ column }) => (
                    <SortableHeader column={column} label="Fecha de Devolución" />
                ),
                cell: ({ getValue }) => {
                    const value = getValue<string>();
                    return value ? new Date(value).toLocaleDateString() : '-';
                }
            },
            {
                accessorKey: 'refund_date',
                header: ({ column }) => (
                    <SortableHeader column={column} label="Fecha de Reembolso" />
                ),
                cell: ({ getValue }) => {
                    const value = getValue<string>();
                    return value ? new Date(value).toLocaleDateString() : '-';
                }
            },
            {
                accessorKey: 'refund_total',
                header: ({ column }) => (
                    <SortableHeader column={column} label="Total Reembolsado" />
                ),
                cell: ({ getValue }) => {
                    const value = getValue<number>();
                    return `$ ${Math.floor(value).toLocaleString()}`;
                }
            },
            {
                accessorKey: 'reason',
                header: ({ column }) => (
                    <SortableHeader column={column} label="Motivo" />
                ),
                cell: ({ getValue }) => <ReasonCell value={getValue<string>() || '-'} />
            }
            ,
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
                                    status === 'reembolsado' ? 'bg-green-100 text-green-700' : ''

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
                        <span className="font-semibold text-sm text-gray-700">Usuario:</span>
                        <span className="mb-1">{row.original.user?.name}</span>
                        <span className="font-semibold text-sm text-gray-700">Fecha:</span>
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
                                setSelectedReturn(row.original);
                                setIsDetailOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-800"
                            title='Ver Detalles'
                        >
                            <Eye size="25" />
                        </button>
                        {row.original.status === 'pendiente' && (
                            <button
                                onClick={() => {
                                    setSelectedReturn(row.original);
                                    setIsModalOpen(true);
                                }}
                                className="text-sm text-blue-600 hover:underline"
                                title='Editar Venta'
                            >
                                <Edit size="25" color="#7E22CE" />
                            </button>
                        )}
                        {row.original.status === 'pendiente' ? (
                            <button
                                onClick={() => {
                                    dispatch(toggleReturnStatus(row.original.id))
                                        .unwrap()
                                        .then((res) => {
                                            toast.success(res.message || 'Devolución reembolsada correctamente');
                                            dispatch(fetchReturns(params));
                                        })
                                        .catch((errorMessage) => {
                                            toast.error(errorMessage || 'Hubo un error al reembolsar la devolución');
                                            dispatch(fetchReturns(params));
                                        });
                                }}
                                className={`text-sm text-red-600 hover:underline`}
                                title='Cambiar a Pendiente'
                            >
                                <MoneySend size="25" color="#16a34a" />
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    dispatch(toggleReturnStatus(row.original.id))
                                        .unwrap()
                                        .then((res) => {
                                            toast.success(res.message || 'Devolución cambiada a pendiente correctamente');
                                            dispatch(fetchReturns(params));
                                        })
                                        .catch((errorMessage) => {
                                            toast.error(errorMessage || 'Hubo un error al cambiar el estado de la devolución');
                                            dispatch(fetchReturns(params));
                                        });
                                }}
                                className={`text-sm text-red-600 hover:underline`}
                                title='Cambiar a Pendiente'
                            >
                                <Refresh size="25" color="#c0bd27ff" />
                            </button>
                        )}
                        <DownloadReturnButton devolucion={row.original} />
                    </div>
                )
            }
        ],
        []
    );

    const dispatch = useAppDispatch();

    const { returns, loading, error } = useAppSelector(state => state.returns);

    const data = useMemo(() => [...returns].reverse(), [returns]);

    useEffect(() => {
        dispatch(fetchReturns(params));
    }, [params]);

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
            {/* {error && <div className="text-center text-red-500">Error: {error}</div>} */}

            <div className="p-4 sm:p-6">
                <h1 className="text-2xl font-bold mb-4" style={{ color: '#7E22CE' }}>
                    Gestión de Devoluciones
                </h1>
                <div className="mb-4">
                    <SelectStatusFilter
                        value={statusFilter}
                        onChange={
                            (value) => {
                                setStatusFilter(value);
                                setParams({ status: value });
                                dispatch(fetchSales({ status: value }));
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

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-primary-light text-white px-4 py-2 rounded-lg hover:bg-primary transition text-base sm:text-lg w-full sm:w-auto"
                    >
                        Registrar Devolución
                    </button>
                </div>
                {!loading && !error && (
                    <>
                        <div className="w-full overflow-x-auto rounded shadow border border-gray-200">
                            <table className="min-w-[1000px] w-full bg-white text-left text-base sm:text-lg table-auto">
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
            <AddReturn
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedReturn(undefined);
                }}
                onSubmitSuccess={() => {
                    dispatch(fetchReturns(params));
                    setSelectedReturn(undefined);
                }}
                devolucion={selectedReturn}
            />
            <ReturnDetail isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} devolucion={selectedReturn} />
        </>

    );
}
