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
import { ArrowCircleLeft, ArrowCircleRight, Edit } from 'iconsax-reactjs';
import AddProduct from '../../Components/sections/products/AddProduct';
import { SortableHeader } from '../../Components/layout/SortableHeader';
import { SelectStatusFilter } from '../../Components/layout/SelectStatusFilter';
import { fetchProducts, Products } from '../../redux/products/productsThunk';
import { FetchParams } from '../../redux/sales/salesThunk';

const stateSales = [
    { value: '', label: 'Todos' },
    { value: 'disponible', label: 'Disponible' },
    { value: 'agotado', label: 'Agotado' },
    { value: 'sobrevendido', label: 'Sobrevendido' },
];


export default function ProductsPage() {
    const [globalFilter, setGlobalFilter] = useState('');

    const [sorting, setSorting] = useState<SortingState>([]);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [selectedProduct, setSelectedProduct] = useState<Products | undefined>(undefined);

    const [statusFilter, setStatusFilter] = useState('');

    const [params, setParams] = useState<FetchParams>({ status: '' });


    const columns = useMemo<ColumnDef<Products>[]>(
        () => [
            {
                accessorKey: 'reference',
                header: ({ column }) => (
                    <SortableHeader column={column} label="Referencia" />
                ),
            },

            {
                accessorKey: 'product_name',
                header: ({ column }) => (
                    <SortableHeader column={column} label="Nombre" />
                ),
            },
            {
                accessorKey: 'price',
                header: ({ column }) => (
                    <SortableHeader column={column} label="Precio" />
                ),
                enableSorting: true,
                cell: ({ getValue }) => {
                    const value = getValue<number>();
                    return `$ ${Math.floor(value).toLocaleString()}`;
                },
            },
            {
                accessorKey: 'color',
                header: 'Color',
                cell: ({ getValue }) => (
                    <div className="flex items-center gap-2">
                        <span
                            className="inline-block w-8 h-8 rounded-full border border-gray-300"
                            style={{ backgroundColor: getValue() as string }}
                        />
                    </div>
                ),
            },
            {
                accessorKey: 'size_S',
                header: ({ column }) => (
                    <SortableHeader column={column} label="Talla S" />
                ),
            },
            {
                accessorKey: 'size_M',
                header: ({ column }) => (
                    <SortableHeader column={column} label="Talla M" />
                ),
            },
            {
                accessorKey: 'size_L',
                header: ({ column }) => (
                    <SortableHeader column={column} label="Talla L" />
                ),
            },
            {
                accessorKey: 'size_XL',
                header: ({ column }) => (
                    <SortableHeader column={column} label="Talla XL" />
                ),
            },
            {
                accessorKey: 'size_2XL',
                header: ({ column }) => (
                    <SortableHeader column={column} label="Talla 2XL" />
                ),
            },
            {
                accessorKey: 'size_3XL',
                header: ({ column }) => (
                    <SortableHeader column={column} label="Talla 3XL" />
                ),
            },
            {
                accessorKey: 'size_4XL',
                header: ({ column }) => (
                    <SortableHeader column={column} label="Talla 4XL" />
                ),
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
                            className={`px-3 py-1 rounded-full text-lg sm:text-xl font-semibold
                                ${status === 'agotado' ? 'bg-yellow-100 text-yellow-700' :
                                    status === 'disponible' ? 'bg-green-100 text-green-700' :
                                        status === 'sobrevendido' ? 'bg-red-100 text-red-700' : ''

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
                cell: ({ row }) => (
                    <button
                        onClick={() => {
                            setSelectedProduct(row.original);
                            setIsModalOpen(true);
                        }}
                        className="text-lg text-blue-600 hover:underline"
                    >
                        <Edit size="30" color="#7E22CE" />
                    </button>
                ),
            },
        ],
        []
    );

    const dispatch = useAppDispatch();
    const { products, loading, error } = useAppSelector(state => state.products);

    const data = useMemo(() => [...products].reverse(), [products]);


    useEffect(() => {
        dispatch(fetchProducts(params));
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
                <h1 className="text-3xl font-bold mb-12" style={{ color: '#7E22CE' }}>
                    Gestión de Productos
                </h1>
                <div className="mb-4">
                    <SelectStatusFilter
                        value={statusFilter}
                        onChange={
                            (value) => {
                                setStatusFilter(value);
                                setParams({ status: value });
                                dispatch(fetchProducts({ status: value }));
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
                        className="bg-primary-light text-white px-4 py-2 rounded-lg hover:bg-primary transition text-base sm:text-xl w-full sm:w-auto"
                    >
                        Registrar Producto
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
                                                <td key={cell.id} className="px-4 py-3 whitespace-nowrap text-lg sm:text-xl">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-end items-center mt-4 gap-2 text-sm sm:text-base">
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
            <AddProduct
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedProduct(undefined);
                }}
                onSubmitSuccess={() => {
                    dispatch(fetchProducts(params));
                    setSelectedProduct(undefined);
                }}
                product={selectedProduct}
            />
        </>
    );
}
