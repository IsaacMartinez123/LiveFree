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
import { ArrowCircleLeft, ArrowCircleRight, DirectInbox, DocumentDownload, Edit, Eye, Forbidden2, Refresh } from 'iconsax-reactjs';
import { dispatchSale, fetchSales, toggleSaleStatus } from '../../redux/sales/salesThunk';
import SalesDetail from './SalesDetail';
import { toast } from 'react-toastify';
import AddSale from '../../Components/sections/sales/AddSale';
import DownloadInvoiceButton from '../../Components/PDF/DownloadInvoiceButton';
import { SortableHeader } from '../../Components/layout/SortableHeader';
import { SelectStatusFilter } from '../../Components/layout/SelectStatusFilter';
import { fetchProducts } from '../../redux/products/productsThunk';
import ModalAlert from '../../Components/layout/ModalAlert';
// import AddProduct from '../../Components/sections/products/AddProduct';

export type SaleDetail = {
    id: number;
    sale_id: number;
    product_id: number;
    reference: string;
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
};

export type Sales = {
    id: number;
    invoice_number: string;
    client_id: number;
    seller_id: number;
    user_id: number;
    total: string;
    client: { id: number; name: string };
    seller: { id: number; name: string, seller_code: string };
    user: { id: number; name: string };
    sales_details: SaleDetail[];
    date: string;
    status: string;
    created_at: string;
};

export type FetchParams = {
    status?: string;
};

const stateSales = [
    { value: '', label: 'Todos' },
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'despachada', label: 'Despachada' },
    { value: 'cancelada', label: 'Cancelada' },
];

export default function Sales() {
    const [globalFilter, setGlobalFilter] = useState('');

    const [sorting, setSorting] = useState<SortingState>([]);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const [selectedSale, setSelectedSale] = useState<Sales | undefined>(undefined);

    const [showConfirm, setShowConfirm] = useState<{ open: boolean, id?: number }>({ open: false, id: 0 });

    const [statusFilter, setStatusFilter] = useState('');

    const [params, setParams] = useState<FetchParams>({ status: '' });

    const [stateSale, setStateSale] = useState<boolean>();

    const [isOpneWarning, setIsOpneWarning] = useState<boolean>(false);

    const [oversold, setOversold] = useState<{ id: number; ref: string }[]>([]);


    const columns = useMemo<ColumnDef<Sales>[]>(
        () => [
            {
                accessorKey: 'invoice_number',
                header: ({ column }) => (
                    <SortableHeader column={column} label="Número de Factura" />
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
                accessorKey: 'seller.name',
                header: ({ column }) => (
                    <SortableHeader column={column} label="Vendedor" />
                ),
            },
            {
                accessorKey: 'total',
                header: ({ column }) => (
                    <SortableHeader column={column} label="Total" />
                ),
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
                            className={`px-3 py-1 rounded-full text-base sm:text-lg font-semibold
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
                                setSelectedSale(row.original);
                                setIsDetailOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-800"
                            title='Ver Detalles'
                        >
                            <Eye size="25" />
                        </button>
                        {row.original.status !== 'cancelada' ? (
                            <button
                                onClick={() => setShowConfirm({ open: true, id: row.original.id })}
                                className={`text-sm text-red-600 hover:underline`}
                                title='Cancelar Venta'
                            >
                                <Forbidden2 size="25" color="#dc2626" />
                            </button>

                        ) : (
                            <button
                                onClick={() => {
                                    dispatch(toggleSaleStatus(row.original.id))
                                        .unwrap()
                                        .then((res) => {
                                            toast.success(res.message || 'Venta cambiada a pendiente con éxito');
                                            dispatch(fetchSales(params));
                                        })
                                        .catch((errorMessage) => {
                                            toast.error(errorMessage || 'Hubo un error al cancelar la venta');
                                            dispatch(fetchSales(params));
                                        });
                                }}
                                className={`text-sm text-red-600 hover:underline`}
                                title='Cambiar a Pendiente'
                            >
                                <Refresh size="25" color="#c0bd27ff" />
                            </button>
                        )}
                        {row.original.status !== 'despachada' && row.original.status !== 'cancelada' && (
                            <button
                                onClick={() => {
                                    dispatch(dispatchSale(row.original.id))
                                        .unwrap()
                                        .then((res) => {
                                            toast.success(res.message || 'Venta despachada con éxito');
                                            dispatch(fetchSales(params));
                                            setStateSale(true)
                                        })
                                        .catch((errorMessage) => {
                                            toast.error(errorMessage || 'Hubo un error al despachar la venta');
                                            dispatch(fetchSales(params));

                                        });
                                }}
                                className="text-blue-600 hover:text-blue-800"
                                title='Despachar Venta'
                            >
                                <DirectInbox size="25" color='#16a34a' />
                            </button>
                        )}
                        <DownloadInvoiceButton sale={row.original} />
                        {row.original.status === 'pendiente' && (
                            <button
                                onClick={() => {
                                    setSelectedSale(row.original);
                                    setIsModalOpen(true);
                                }}
                                className="text-sm text-blue-600 hover:underline"
                                title='Editar Venta'
                            >
                                <Edit size="25" color="#7E22CE" />
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

    const { products } = useAppSelector(state => state.products)

    const data = useMemo(() => [...sales].reverse(), [sales]);

    useEffect(() => {
        dispatch(fetchSales(params));
    }, [params]);
    console.log(stateSale);

    useEffect(() => {
        dispatch(fetchProducts({ status: '' }));
    }, [stateSale]);

    useEffect(() => {

        const sobrevendidos = products
            .filter(p => p.status === 'sobrevendido')
            .map(p => ({
                id: p.id,
                ref: p.reference
            }));

        setOversold(sobrevendidos);
        setIsOpneWarning(true)
    }, [products]);

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
            {showConfirm.open && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50"
                    onClick={() => setShowConfirm({ open: false })}
                >
                    <div
                        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs"
                        onClick={e => e.stopPropagation()}
                    >
                        <h2 className="text-lg font-semibold mb-4 text-gray-800">¿Cancelar venta?</h2>
                        <p className="mb-6 text-red-700">¿Estas Seguro Que Deseas Cancelar La Venta?</p>
                        <div className="flex justify-around items-center">
                            <button
                                className="px-4 py-2 rounded bg-error text-white hover:bg-red-600"
                                onClick={() => setShowConfirm({ open: false })}
                            >
                                Cancelar
                            </button>
                            <button
                                className="px-4 py-2 rounded bg-primary text-white hover:bg-primary-dark"
                                onClick={() => {
                                    if (typeof showConfirm.id !== 'undefined') {
                                        dispatch(toggleSaleStatus(showConfirm.id))
                                            .unwrap()
                                            .then((res) => {
                                                toast.success(res.message || 'Venta cancelada con éxito');
                                                dispatch(fetchSales(params));
                                                setStateSale(false)
                                            })
                                            .catch((errorMessage) => {
                                                toast.error(errorMessage || 'Hubo un error al cancelar la venta');
                                                dispatch(fetchSales(params));
                                            });
                                    }
                                    setShowConfirm({ open: false });
                                }}
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {loading && <div className="text-center text-purple-600 font-medium">Cargando...</div>}
            {/* {error && <div className="text-center text-red-500">Error: {error}</div>} */}
            <ModalAlert
                isOpen={isOpneWarning}
                onClose={() => setIsOpneWarning(false)}
                title="Productos sobrevendidos"
                message="Las siguientes referencias tienen un estado de SOBREVENDIDO:."
                oversold={oversold.map(p => p.ref)} 
            />




            <div className="p-4 sm:p-6">
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
                        Registrar Venta
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
            <AddSale
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedSale(undefined);
                }}
                onSubmitSuccess={() => {
                    dispatch(fetchSales(params));
                    setSelectedSale(undefined);
                }}
                sale={selectedSale}
            />
            <SalesDetail isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} sale={selectedSale} />
        </>
    );
}
