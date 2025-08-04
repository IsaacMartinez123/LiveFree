import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useMemo } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { fetchClients } from '../../../redux/clients/clientsThunk';
import { fetchProducts } from '../../../redux/products/productsThunk';
import { CloseCircle } from 'iconsax-reactjs';
import { SaleDetail, Sales } from '../../../pages/sales/Sales';
import { fetchSellers } from '../../../redux/sellers/sellersThunk';
import { createSale, updateSale } from '../../../redux/sales/salesThunk';
import Select from 'react-select';


type SalesFormValues = {
    client_id: number;
    seller_id: number;
    items: SaleDetail[];
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSubmitSuccess: () => void;
    sale?: Sales;
};

export const mapSaleToFormValues = (sale: Sales): SalesFormValues => {
    return {
        seller_id: sale.seller_id,
        client_id: sale.client_id,
        items: sale.sales_details.map((detail) => ({
            id: detail.id,
            sale_id: detail.sale_id,
            product_id: detail.product_id,
            reference: detail.reference,
            product_name: detail.product_name,
            price: detail.price,
            color: detail.color,
            size_S: detail.size_S,
            size_M: detail.size_M,
            size_L: detail.size_L,
            size_XL: detail.size_XL,
            size_2XL: detail.size_2XL,
            size_3XL: detail.size_3XL,
            size_4XL: detail.size_4XL,
        })),
    };
};

export default function AddSale({ isOpen, onClose, onSubmitSuccess, sale }: Props) {
    const dispatch = useAppDispatch();
    const { clients } = useAppSelector(state => state.clients);
    const { products } = useAppSelector(state => state.products);
    const { sellers } = useAppSelector(state => state.sellers);

    useEffect(() => {
        dispatch(fetchClients());
        dispatch(fetchProducts());
        dispatch(fetchSellers());
    }, [dispatch]);


    const initialValues: SalesFormValues = useMemo(() => {
        if (sale) {
            return mapSaleToFormValues(sale);
        }
        return {
            seller_id: 0,
            client_id: 0,
            items: [],
        };
    }, [sale]);



    const validationSchema = Yup.object({
        client_id: Yup.string().required('Seleccione un cliente'),
        seller_id: Yup.string().required('Seleccione un vendedor'),
        items: Yup.array().min(1, 'Debe agregar al menos un producto'),
    });


    const handleSubmit = async (values: any, { resetForm }: any) => {
        try {
            if (sale) {                
                const response = await dispatch(updateSale({ id: sale.id, saleDetailData: values })).unwrap();
                toast.success(response.message || 'Venta actualizada correctamente');
            } else {
                const response = await dispatch(createSale(values)).unwrap();
                toast.success(response.message || 'Venta registrada correctamente');
            }

            resetForm();
            onSubmitSuccess();
            onClose();
        } catch (error: any) {
            const apiMessage = error.response?.data?.message || error.message;
            toast.error(apiMessage || 'Error al guardar la venta');
        }
    };


    const clientOptions = clients.map(client => ({
        value: client.id,
        label: client.name,
        document: client.document,
    }));
    const sellerOptions = sellers.map(seller => ({
        value: seller.id,
        label: seller.name,
    }));

    const productOptions = products.map(product => ({
        value: product.id,
        label: `${product.reference} - ${product.product_name}`,
        ...product,
    }));

    const customSelectStyles = {
        control: (provided: any, state: any) => ({
            ...provided,
            borderColor: '#d1d5db', // mismo color que input-form (tailwind: border-gray-300)
            boxShadow: state.isFocused ? '0 0 0 1.5px #7e22ce' : provided.boxShadow, // ejemplo: color primario al enfocar
            '&:hover': {
                borderColor: '#7e22ce', // color al pasar mouse por el borde
            },
            borderRadius: '0.375rem', // igual que input-form rounded-md
            minHeight: '2.5rem',
        }),
        option: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: state.isFocused
                ? '#ede9fe' // tailwind: bg-purple-100
                : 'white',
            color: state.isFocused ? '#7e22ce' : '#111827', // tailwind: text-primary o text-gray-900
            cursor: 'pointer',
        }),
        menu: (provided: any) => ({
            ...provided,
            zIndex: 9999,
        }),
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-40" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    leave="ease-in duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-30" />
                </Transition.Child>

                <div className="fixed inset-0 flex items-center justify-center px-4 sm:px-6">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        leave="ease-in duration-200"
                        enterFrom="scale-95 opacity-0"
                        enterTo="scale-100 opacity-100"
                        leaveFrom="scale-100 opacity-100"
                        leaveTo="scale-95 opacity-0"
                    >
                        <Dialog.Panel className="bg-white rounded-lg p-6 sm:p-8 w-full max-w-screen-3xl shadow-lg my-4">
                            <Dialog.Title className="text-xl font-bold text-primary mb-6 text-center">
                                {sale ? 'Editar Venta' : 'Registrar Venta'}
                            </Dialog.Title>


                            <Formik
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}
                            >
                                {({ values, setFieldValue }: { values: SalesFormValues; setFieldValue: (field: string, value: any) => void }) => {

                                    const subtotals = values.items.map((item: SaleDetail) => {
                                        const cantidad =
                                            (item.size_S || 0) +
                                            (item.size_M || 0) +
                                            (item.size_L || 0) +
                                            (item.size_XL || 0) +
                                            (item.size_2XL || 0) +
                                            (item.size_3XL || 0) +
                                            (item.size_4XL || 0);
                                        return cantidad * Number(item.price);
                                    });

                                    const total = subtotals.reduce((acc, curr) => acc + curr, 0);

                                    return (
                                        <Form className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                            {/* Columna izquierda */}
                                            <div className="space-y-4">

                                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Del Cliente</label>
                                                <Select
                                                    options={clientOptions}
                                                    value={clientOptions.find(option => option.value === Number(values.client_id))}
                                                    onChange={option => setFieldValue('client_id', option?.value || 0)}
                                                    placeholder="Seleccione un cliente"
                                                    className="mb-2"
                                                    styles={customSelectStyles}
                                                />
                                                <ErrorMessage name="client_id" component="div" className="text-red-500 text-xs" />

                                                <label className="block text-sm font-medium text-gray-700 mb-1">Documento Del Cliente</label>
                                                <input
                                                    type="text"
                                                    className="input-form w-full mt-2"
                                                    placeholder="Documento del cliente"
                                                    value={
                                                        clientOptions.find(option => option.value === Number(values.client_id))?.document || ''
                                                    }
                                                    readOnly
                                                />
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Vendedor</label>
                                                <Select
                                                    options={sellerOptions}
                                                    value={sellerOptions.find(option => option.value === Number(values.seller_id))}
                                                    onChange={option => setFieldValue('seller_id', option?.value || 0)}
                                                    placeholder="Seleccione un vendedor"
                                                    className="mb-2 "
                                                    styles={customSelectStyles}
                                                />
                                                <ErrorMessage name="seller_id" component="div" className="text-red-500 text-xs" />

                                                <label className="block text-sm font-medium text-gray-700 mb-1">Productos</label>
                                                <Select
                                                    options={productOptions}
                                                    onChange={option => {
                                                        if (
                                                            option &&
                                                            !values.items.some(item => item.id === option.value)
                                                        ) {
                                                            setFieldValue('items', [
                                                                ...values.items,
                                                                {
                                                                    id: option.value,
                                                                    product_id: option.value,
                                                                    reference: option.reference,
                                                                    product_name: option.product_name,
                                                                    price: option.price,
                                                                    color: option.color,
                                                                    size_S: 0,
                                                                    size_M: 0,
                                                                    size_L: 0,
                                                                    size_XL: 0,
                                                                    size_2XL: 0,
                                                                    size_3XL: 0,
                                                                    size_4XL: 0,
                                                                },
                                                            ]);
                                                        }
                                                    }}
                                                    placeholder="Seleccione un producto para añadir"
                                                    className="mb-2"
                                                    styles={customSelectStyles}
                                                    formatOptionLabel={option => (
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <span
                                                                style={{
                                                                    backgroundColor: option.color,
                                                                    width: 16,
                                                                    height: 16,
                                                                    borderRadius: '50%',
                                                                    display: 'inline-block',
                                                                    marginRight: 8,
                                                                    border: '1px solid #ccc'
                                                                }}
                                                            />
                                                            <span style={{ color: option.color }}>{option.label}</span>
                                                        </div>
                                                    )}
                                                />
                                            </div>

                                            {/* Columna derecha */}
                                            <div className="md:col-span-3 ml-6 overflow-x-auto">
                                                <FieldArray name="items">
                                                    {({ remove, form }) => (
                                                        <>
                                                            <table className="min-w-full border text-base">
                                                                <thead className="bg-gray-100">
                                                                    <tr>
                                                                        <th className="px-4 py-3 border text-base">Referencia</th>
                                                                        <th className="px-4 py-3 border text-base">Nombre</th>
                                                                        <th className="px-4 py-3 border text-base">Color</th>
                                                                        {['size_S', 'size_M', 'size_L', 'size_XL', 'size_2XL', 'size_3XL', 'size_4XL'].map(size => (
                                                                            <th key={size} className="px-4 py-3 border text-base">{size.replace('size_', '')}</th>
                                                                        ))}
                                                                        <th className="px-4 py-3 border text-base">Precio</th>
                                                                        <th className="px-4 py-3 border text-base">Subtotal</th>
                                                                        <th className="px-4 py-3 border text-base">Acción</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {values.items.map((item, index) => {
                                                                        const cantidad =
                                                                            (item.size_S || 0) +
                                                                            (item.size_M || 0) +
                                                                            (item.size_L || 0) +
                                                                            (item.size_XL || 0) +
                                                                            (item.size_2XL || 0) +
                                                                            (item.size_3XL || 0) +
                                                                            (item.size_4XL || 0);
                                                                        const subtotal = cantidad * Number(item.price);

                                                                        return (
                                                                            <tr key={item.id}>
                                                                                <td className="px-4 py-2 border text-base">{item.reference}</td>
                                                                                <td className="px-4 py-2 border text-base">{item.product_name}</td>
                                                                                <td className="px-4 py-2 border">
                                                                                    <span
                                                                                        className="inline-block w-8 h-8 rounded-full border border-gray-300"
                                                                                        style={{ backgroundColor: item.color }}
                                                                                    />
                                                                                </td>
                                                                                {['size_S', 'size_M', 'size_L', 'size_XL', 'size_2XL', 'size_3XL', 'size_4XL'].map(size => (
                                                                                    <td key={size} className="px-4 py-2 border">
                                                                                        <Field
                                                                                            name={`items[${index}].${size}`}
                                                                                            type="number"
                                                                                            min={0}
                                                                                            className="w-16 text-center border rounded text-base"
                                                                                        />
                                                                                    </td>
                                                                                ))}
                                                                                <td className="px-4 py-2 border text-base">${Number(item.price).toLocaleString()}</td>
                                                                                <td className="px-4 py-2 border text-base font-semibold">
                                                                                    ${subtotal.toLocaleString()}
                                                                                </td>
                                                                                <td className="px-4 py-2 border text-center">
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => remove(index)}
                                                                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                                                                                        title="Eliminar producto"
                                                                                    >
                                                                                        <CloseCircle size="20" />
                                                                                    </button>
                                                                                </td>
                                                                            </tr>
                                                                        );
                                                                    })}
                                                                </tbody>
                                                            </table>
                                                            <div className="flex justify-end mt-4">
                                                                <span className="text-xl font-bold text-primary">
                                                                    Total: ${total.toLocaleString()}
                                                                </span>
                                                            </div>
                                                        </>
                                                    )}
                                                </FieldArray>
                                                <ErrorMessage name="items" component="div" className="text-red-500 text-xs mt-2" />
                                            </div>

                                            <div className="col-span-4 flex justify-center gap-6 mt-6">
                                                <button type="button" onClick={onClose} className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">
                                                    Cancelar
                                                </button>
                                                <button type="submit" className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark">
                                                    {sale ? 'Actualizar Venta' : 'Registrar Venta'}
                                                </button>

                                            </div>
                                        </Form>
                                    );
                                }}
                            </Formik>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}
