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
import { ArrowCircleLeft, ArrowCircleRight, Edit, Trash } from 'iconsax-reactjs';
import { Client, deleteClient, fetchClients, fetchLabels } from '../../redux/clients/clientsThunk';
import AddClient from '../../Components/sections/clients/AddClient';
import DownloadCustomerLabelButton from '../../Components/PDF/DownloadCustomerLabelButton';
import { RootState } from '../../redux/store';
import EditLabel from '../../Components/sections/clients/EditLabel';

export default function Clients() {
    const [globalFilter, setGlobalFilter] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isOpenLabelModal, setIsOpenLabelModal] = useState(false);

    const [selectedClient, setSelectedClient] = useState<Client | undefined>(undefined);

    const dispatch = useAppDispatch();
    const { clients, loading, error } = useAppSelector(state => state.clients);

    const labels = useAppSelector((state: RootState) => state.clients.labels);

    const data = useMemo(() => [...clients].reverse(), [clients]);

    useEffect(() => {
        dispatch(fetchClients());
        dispatch(fetchLabels());
    }, [dispatch]);

    const columns = useMemo<ColumnDef<Client>[]>(
        () => [
            { accessorKey: 'name', header: 'Nombre' },
            { accessorKey: 'document', header: 'Documento' },
            { accessorKey: 'phone', header: 'Teléfono' },
            { accessorKey: 'store_name', header: 'Nombre Del Almacen' },
            { accessorKey: 'address', header: 'Dirección' },
            { accessorKey: 'city', header: 'Ciudad' },
            {
                id: 'actions',
                header: 'Acciones',
                cell: ({ row }) => (
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                setSelectedClient(row.original);
                                setIsModalOpen(true);
                            }}
                            className="text-lg text-blue-600 hover:underline"
                            title="Editar"
                        >
                            <Edit size="30" color="#7E22CE" />
                        </button>
                        {/* <button
                            onClick={() => setShowConfirm({ open: true, id: row.original.id })}
                            className="text-lg text-red-600 hover:underline"
                            title="Eliminar"
                        >
                            <Trash size="30" color="#dc2626" />
                        </button> */}
                        <DownloadCustomerLabelButton client={row.original} label={labels?.[0]} />
                    </div>
                ),
            },
        ],
        [labels]
    );

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
            {/* {showConfirm.open && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50"
                    onClick={() => setShowConfirm({ open: false })}
                >
                    <div
                        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs"
                        onClick={e => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">¿Eliminar cliente?</h2>
                        <p className="mb-6 text-red-700 text-lg">¡Esta acción no se puede deshacer!</p>
                        <div className="flex justify-around items-center">
                            <button
                                className="px-4 py-2 rounded bg-error text-white hover:bg-red-600 text-lg"
                                onClick={() => setShowConfirm({ open: false })}
                            >
                                Cancelar
                            </button>
                            <button
                                className="px-4 py-2 rounded bg-primary text-white hover:bg-primary-dark text-lg"
                                onClick={() => {
                                    if (typeof showConfirm.id !== 'undefined') {
                                        dispatch(deleteClient(showConfirm.id)).then(() => {
                                            dispatch(fetchClients());
                                            setShowConfirm({ open: false });
                                        });
                                    }
                                }}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )} */}
            {loading && <div className="text-center text-purple-600 font-medium">Cargando...</div>}
            {error && <div className="text-center text-red-500">Error: {error}</div>}

            <div className="p-4 sm:p-6">
                <h1 className="text-3xl font-bold mb-12" style={{ color: '#7E22CE' }}>
                    Información de Clientes
                </h1>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Buscar..."
                        className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-72 text-base sm:text-lg"
                        value={globalFilter}
                        onChange={e => setGlobalFilter(e.target.value)}
                    />

                    <div className="flex gap-12 flex-col sm:flex-row w-full sm:w-auto">
                        <button
                            onClick={() => setIsOpenLabelModal(true)}
                            className="bg-primary-light text-white px-4 py-2 rounded-lg hover:bg-primary transition text-base sm:text-xl w-full sm:w-auto"
                        >
                            Editar Rotulo
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-primary-light text-white px-4 py-2 rounded-lg hover:bg-primary transition text-base sm:text-xl w-full sm:w-auto"
                        >
                            Registrar Cliente
                        </button>
                    </div>
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
            <AddClient
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedClient(undefined);
                }}
                onSubmitSuccess={() => {
                    dispatch(fetchClients());
                    setSelectedClient(undefined);
                }}
                client={selectedClient}
            />
            <EditLabel
                isOpen={isOpenLabelModal}
                onClose={() => {
                    setIsOpenLabelModal(false);
                }}
                onSubmitSuccess={() => {
                    dispatch(fetchLabels());
                }}
                label={labels?.[0]}
            />
        </>
    );
}
