type SortableHeaderProps = {
    column: any;
    label: string;
};

export const SortableHeader = ({ column, label }: SortableHeaderProps) => (
    <button
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="appearance-none bg-transparent border-0 p-0 m-0 font-inherit text-inherit flex items-center gap-1 hover:underline"
    >
        {label}
        <span>
            {{
                asc: '↑',
                desc: '↓',
            }[column.getIsSorted() as string] ?? ''}
        </span>
    </button>
);
