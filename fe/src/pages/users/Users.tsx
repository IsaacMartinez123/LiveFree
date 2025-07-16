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
import { fetchUsers, toggleUserStatus } from '../../redux/users/usersThunk';
import { ArrowCircleLeft, ArrowCircleRight, Edit, Refresh } from 'iconsax-reactjs';
import AddUser from '../../Components/sections/user/AddUser';

export type User = {
    id: number;
    name: string;
    email: string;
    rol_id: string;
    status: boolean;
};

export default function Users() {

    const [globalFilter, setGlobalFilter] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);

    const loggedUser = useAppSelector(state => state.auth.user);

    const columns = useMemo<ColumnDef<User>[]>(() => [
        { accessorKey: 'name', header: 'Nombre' },
        { accessorKey: 'email', header: 'Correo' },
        { accessorKey: 'rol_id', header: 'Rol' },
        {
            accessorKey: 'rol_id',
            header: 'Rol',
            cell: ({ getValue }) => {
                const rolId = getValue() as string;
                const roles: Record<string, string> = {
                    '1': 'Administrador',
                    '2': 'Vendedor',
                };
                return roles[rolId] || 'Desconocido';
            }
            
        },
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
                        {status ? 'Activo' : 'Inactivo'}
                    </span>
                );
            }
        },
        {
            id: 'actions',
            header: 'Acciones',
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            setSelectedUser(row.original);
                            setIsModalOpen(true);
                        }}
                        className="text-sm text-blue-600 hover:underline"
                        title="Editar"
                    >
                        <Edit size="20" color="#7E22CE" />
                    </button>
                    {row.original.id !== loggedUser?.id && (
                    <button
                        onClick={() => {
                            dispatch(toggleUserStatus(row.original.id)).then(() => {
                                dispatch(fetchUsers());
                            });
                        }}
                        className={`text-sm ${row.original.status ? 'text-red-600' : 'text-green-600'} hover:underline`}
                        title={row.original.status ? "Desactivar" : "Activar"}
                    >
                        <Refresh size="20" color={row.original.status ? "#dc2626" : "#16a34a"} />
                    </button>
                    )}
                </div>
            ),
        },
    ], []);


    const dispatch = useAppDispatch();
    const { users, loading, error } = useAppSelector(state => state.users);

    const data = useMemo(() => [...users].reverse(), [users]);

    useEffect(() => {
        dispatch(fetchUsers());
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
                        Registrar Usuario
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
            <AddUser
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedUser(undefined);
                }}
                onSubmitSuccess={() => {
                    dispatch(fetchUsers());
                    setSelectedUser(undefined);
                }}
                user={selectedUser}
            />
        </>
    );
}
