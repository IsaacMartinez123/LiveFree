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
import { ArrowCircleLeft, ArrowCircleRight, Edit } from 'iconsax-reactjs';
import { fetchProducts } from '../../redux/products/productsThunk';
import AddProduct from '../../Components/sections/products/AddProduct';

export type Products = {
    id: number;
    reference: string;
    product_name: string;
    price: number;
    color: string;
    size_S: number;
    size_M: number;
    size_L: number;
    size_XL: number;
    size_2XL: number;
    size_3XL: number;
    size_4XL: number;
    status: boolean;
};


export default function Products() {
    const [globalFilter, setGlobalFilter] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [selectedProduct, setSelectedProduct] = useState<Products | undefined>(undefined);

    const columns = useMemo<ColumnDef<Products>[]>(
        () => [
            { accessorKey: 'reference', header: 'Referencia' },
            { accessorKey: 'product_name', header: 'Nombre' },
            {
                accessorKey: 'price',
                header: 'Precio',
                cell: ({ getValue }) => {
                    const value = getValue<number>();
                    return `$ ${Math.floor(value).toLocaleString()}`;
                }
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
            { accessorKey: 'size_S', header: 'Talla S' },
            { accessorKey: 'size_M', header: 'Talla M' },
            { accessorKey: 'size_L', header: 'Talla L' },
            { accessorKey: 'size_XL', header: 'Talla XL' },
            { accessorKey: 'size_2XL', header: 'Talla 2XL' },
            { accessorKey: 'size_3XL', header: 'Talla 3XL' },
            { accessorKey: 'size_4XL', header: 'Talla 4XL' },
            {
                accessorKey: 'status',
                header: 'Estado',
                cell: ({ getValue }) => {
                    const status = getValue() as boolean | number;
                    return (
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold
                                ${status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
                            `}
                        >
                            {status ? 'Disponible' : 'Agotado'}
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
                        className="text-sm text-blue-600 hover:underline"
                    >
                        <Edit size="20" color="#7E22CE" />
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
        dispatch(fetchProducts());
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
                        Registrar Producto
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
            <AddProduct
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedProduct(undefined);
                }}
                onSubmitSuccess={() => {
                    dispatch(fetchProducts());
                    setSelectedProduct(undefined);
                }}
                product={selectedProduct}
            />
        </>
    );
}
