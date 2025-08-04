import React, { useEffect, useState } from 'react';

type Option = {
    label: string;
    value: string;
};

type Props = {
    value: string;
    onChange: (value: string) => void;
    options: Option[];
};

export const SelectStatusFilter: React.FC<Props> = ({ value, onChange, options }) => {
    const [statusList, setStatusList] = useState<Option[]>([]);

    useEffect(() => {
        setStatusList(options);
    }, [options]);

    return (
        <div className="w-72">
            <label
                htmlFor="status-filter"
                className="block text-sm font-medium text-black mb-1"
            >
                Filtrar por estado
            </label>
            <select
                id="status-filter"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="h-10 w-full px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
            >
                {statusList.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};
