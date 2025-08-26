// Reports.tsx
import { useEffect, useState } from "react";
import Select from "react-select";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
    fetchCarteraGeneral,
    fetchCarteraPorVendedor,
    fetchCommissions,
} from "../../redux/reports/reportsThunk";
import { Chart1, ClipboardText, FolderOpen, Moneys } from "iconsax-reactjs";
import { fetchSellers } from "../../redux/sellers/sellersThunk";
import { toast } from "react-toastify";

export default function Reports() {
    const dispatch = useAppDispatch();
    const { loading } = useAppSelector((state) => state.reports);
    const { sellers } = useAppSelector((state) => state.sellers);

    useEffect(() => {
        dispatch(fetchSellers());
    }, [dispatch]);

    const [filters, setFilters] = useState({
        startDate: "",
        endDate: "",
        sellerId: "",
    });

    const handleDownload = async (type: string) => {
        if (type === "commissions") {
            if (!filters.startDate || !filters.endDate || !filters.sellerId) {
                toast.error("Debes completar todos los filtros");
                return;
            }
        }
        if (type === "carteraVendedor") {
            if (!filters.sellerId) {
                toast.error("Debes seleccionar un vendedor");
                return;
            }
        }

        let result;
        switch (type) {
            case "commissions":
                result = await dispatch(fetchCommissions(filters)).unwrap();
                break;
            case "carteraVendedor":
                result = await dispatch(
                    fetchCarteraPorVendedor({ sellerId: Number(filters.sellerId) })
                ).unwrap();
                break;
            case "carteraGeneral":
                result = await dispatch(fetchCarteraGeneral()).unwrap();
                break;
        }

        const url = window.URL.createObjectURL(new Blob([result]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${type}.xlsx`);
        document.body.appendChild(link);
        link.click();
    };

    const customSelectStyles = {
        control: (provided: any, state: any) => ({
            ...provided,
            borderColor: "#d1d5db",
            boxShadow: state.isFocused ? "0 0 0 1.5px #9333EA" : provided.boxShadow,
            "&:hover": { borderColor: "#9333EA" },
            borderRadius: "0.5rem",
            minHeight: "2.75rem",
        }),
        option: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: state.isFocused ? "#E9D5FF" : "white",
            color: state.isFocused ? "#7E22CE" : "#111827",
            cursor: "pointer",
        }),
        menu: (provided: any) => ({ ...provided, zIndex: 9999 }),
    };

    return (
        <div className="p-6 space-y-8 bg-background min-h-screen">
            {/* Header */}
            <div className="flex items-center gap-2">
                <Chart1 size="28" color="#7E22CE" />
                <h2 className="text-2xl font-bold text-primary">Reportes LiveFree</h2>
            </div>

            {/* Reporte de Comisiones */}
            <div className="bg-white shadow rounded-xl p-5 space-y-4 border border-border">
                <div className="flex items-center gap-2">
                    <Moneys size="22" color="#7E22CE" />
                    <h3 className="text-lg font-semibold text-foreground">
                        Reporte de Comisiones
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                        type="date"
                        value={filters.startDate}
                        onChange={(e) =>
                            setFilters({ ...filters, startDate: e.target.value })
                        }
                        className="border border-form-border rounded-lg px-3 py-2 w-full text-gray-700 focus:ring-2 focus:ring-form-focus focus:outline-none"
                    />
                    <input
                        type="date"
                        value={filters.endDate}
                        onChange={(e) =>
                            setFilters({ ...filters, endDate: e.target.value })
                        }
                        className="border border-form-border rounded-lg px-3 py-2 w-full text-gray-700 focus:ring-2 focus:ring-form-focus focus:outline-none"
                    />
                    <Select
                        options={sellers}
                        placeholder="Selecciona Vendedor"
                        styles={customSelectStyles}
                        value={sellers.find((s) => s.id === Number(filters.sellerId))}
                        getOptionLabel={(option) =>
                            `${option.seller_code} - ${option.name}`
                        }
                        getOptionValue={(option) => option.id.toString()}
                        onChange={(option) =>
                            setFilters({
                                ...filters,
                                sellerId: option?.id.toString() || "",
                            })
                        }
                    />
                </div>

                <button
                    onClick={() => handleDownload("commissions")}
                    disabled={loading}
                    className="px-5 py-2 bg-primary-light text-white rounded-lg hover:bg-primary transition disabled:opacity-50"
                >
                    Descargar Comisiones
                </button>
            </div>

            {/* Reporte Cartera por Vendedor */}
            <div className="bg-white shadow rounded-xl p-5 space-y-4 border border-border">
                <div className="flex items-center gap-2">
                    <FolderOpen size="22" color="#7E22CE" />
                    <h3 className="text-lg font-semibold text-foreground">
                        Cartera por Vendedor
                    </h3>
                </div>

                <div className="w-full md:w-1/3">
                    <Select
                        options={sellers}
                        placeholder="Selecciona Vendedor"
                        styles={customSelectStyles}
                        value={sellers.find((s) => s.id === Number(filters.sellerId))}
                        getOptionLabel={(option) =>
                            `${option.seller_code} - ${option.name}`
                        }
                        getOptionValue={(option) => option.id.toString()}
                        onChange={(option) =>
                            setFilters({
                                ...filters,
                                sellerId: option?.id.toString() || "",
                            })
                        }
                    />
                </div>

                <button
                    onClick={() => handleDownload("carteraVendedor")}
                    disabled={loading}
                    className="px-5 py-2 bg-primary-light text-white rounded-lg hover:bg-primary transition disabled:opacity-50"
                >
                    Descargar Cartera
                </button>
            </div>

            {/* Reporte Cartera General */}
            <div className="bg-white shadow rounded-xl p-5 space-y-4 border border-border">
                <div className="flex items-center gap-2">
                    <ClipboardText size="22" color="#7E22CE" />
                    <h3 className="text-lg font-semibold text-foreground">
                        Cartera General
                    </h3>
                </div>

                <button
                    onClick={() => handleDownload("carteraGeneral")}
                    disabled={loading}
                    className="px-5 py-2 bg-primary-light text-white rounded-lg hover:bg-primary transition disabled:opacity-50"
                >
                    Descargar Cartera
                </button>
            </div>
        </div>
    );
}
