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
import { fetchSellers } from '../../redux/sellers/sellersThunk';
import AddSeller from '../../Components/sections/sellers/AddSeller';

type Seller = {
    id: number;
    name: string;
    document: string;
    phone: string;
    email: string;
};


export default function Sellers() {
    const [globalFilter, setGlobalFilter] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [selectedSeller, setSelectedSeller] = useState<Seller | undefined>(undefined);

    const columns = useMemo<ColumnDef<Seller>[]>(
        () => [
            { accessorKey: 'name', header: 'Nombre' },
            { accessorKey: 'document', header: 'Documento' },
            { accessorKey: 'phone', header: 'Teléfono' },
            { accessorKey: 'email', header: 'Correo' },
            {
                id: 'actions',
                header: 'Acciones',
                cell: ({ row }) => (
                    <button
                        onClick={() => {
                            setSelectedSeller(row.original);
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
    const { sellers, loading, error } = useAppSelector(state => state.sellers);

    const data = useMemo(() => [...sellers].reverse(), [sellers]);


    useEffect(() => {
        dispatch(fetchSellers());
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
                        Registrar Vendedor
                    </button>
                </div>
                {!loading && !error && (
                    <>
                        <div className="overflow-x-auto rounded shadow">
                            <table className="min-w-full bg-white text-left text-sm sm:text-base">
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
            <AddSeller
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedSeller(undefined);
                }}
                onSubmitSuccess={() => {
                    dispatch(fetchSellers());
                    setSelectedSeller(undefined);
                }}
                seller={selectedSeller}
            />
        </>
    );
}
