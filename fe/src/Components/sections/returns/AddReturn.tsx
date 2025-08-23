import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useMemo } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { fetchClients } from '../../../redux/clients/clientsThunk';
import { fetchProducts } from '../../../redux/products/productsThunk';
import { CloseCircle } from 'iconsax-reactjs';
import { createReturn, updateReturn, ReturnDetail, Return } from '../../../redux/returns/returnsThunk';
import Select from 'react-select';

type ReturnFormValues = {
    client_id: number;
    return_date: string;
    reason: string;
    items: ReturnDetail[];
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSubmitSuccess: () => void;
    devolucion?: Return;
};

export const mapReturnToFormValues = (devolución: Return): ReturnFormValues => ({
    client_id: devolución.client_id,
    return_date: devolución.return_date,
    reason: devolución.reason,
    items: devolución.details.map(detail => ({
        id: detail.id,
        return_id: detail.return_id,
        product_id: detail.product_id,
        reference: detail.reference,
        product_name: detail.product_name,
        color: detail.color,
        amount: detail.amount,
        price: detail.price,
        sub_total: detail.sub_total
    }))
});

export default function AddReturn({ isOpen, onClose, onSubmitSuccess, devolucion }: Props) {
    const dispatch = useAppDispatch();
    const { clients } = useAppSelector(state => state.clients);
    const { products } = useAppSelector(state => state.products);

    useEffect(() => {
        dispatch(fetchClients());
        dispatch(fetchProducts({ status: '' }));
    }, [dispatch]);

    const initialValues: ReturnFormValues = useMemo(() => {
        if (devolucion) {
            return mapReturnToFormValues(devolucion);
        }
        return { 
            client_id: 0, 
            return_date: '', 
            reason: '', 
            items: []
        };
    }, [devolucion]);

    const validationSchema = Yup.object({
        client_id: Yup.string().required('Seleccione un cliente'),
        return_date: Yup.string().required('Seleccione la fecha'),
        reason: Yup.string().required('Ingrese el motivo'),
        items: Yup.array().min(1, 'Debe agregar al menos un producto')
    });

    const handleSubmit = async (values: ReturnFormValues, { resetForm }: any) => {
        try {
            if (devolucion) {
                const response = await dispatch(updateReturn({ id: devolucion.id, ReturnDetail: values })).unwrap();
                toast.success(response.message || 'Devolucion actualizada correctamente');
            } else {
                console.log('Updating return with values:', values);

                const response = await dispatch(createReturn(values)).unwrap();
                toast.success(response.message || 'Devolución registrada correctamente');
            }
            resetForm();
            onSubmitSuccess();
            onClose();
        } catch (error: any) {
            const apiMessage = error.response?.data?.message || error.message;
            toast.error(apiMessage || 'Error al guardar la devolución');
        }
    };

    const clientOptions = clients.map(client => ({
        value: client.id,
        label: client.name,
        document: client.document
    }));

    const productOptions = products.map(product => ({
        value: product.id,
        label: `${product.reference} - ${product.product_name}`,
        ...product
    }));

    const customSelectStyles = {
        control: (provided: any, state: any) => ({
            ...provided,
            borderColor: '#d1d5db',
            boxShadow: state.isFocused ? '0 0 0 1.5px #7e22ce' : provided.boxShadow,
            '&:hover': { borderColor: '#7e22ce' },
            borderRadius: '0.375rem',
            minHeight: '2.5rem'
        }),
        option: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: state.isFocused ? '#ede9fe' : 'white',
            color: state.isFocused ? '#7e22ce' : '#111827',
            cursor: 'pointer'
        }),
        menu: (provided: any) => ({ ...provided, zIndex: 9999 })
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-40" onClose={onClose}>
                <div className="fixed inset-0 bg-black bg-opacity-30" />
                <div className="fixed inset-0 flex items-center justify-center px-4 sm:px-6">
                    <Dialog.Panel className="bg-white rounded-lg p-6 sm:p-8 w-full max-w-screen-3xl shadow-lg my-4">
                        <Dialog.Title className="text-xl font-bold text-primary mb-6 text-center">
                            {devolucion ? 'Editar Devolución' : 'Registrar Devolución'}
                        </Dialog.Title>

                        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                            {({ values, setFieldValue }) => {
                                const total = values.items.reduce((acc, item) => acc + (item.amount || 0) * Number(item.price), 0);

                                return (
                                    <Form className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                        {/* Columna izquierda */}
                                        <div className="space-y-4">
                                            <label className="block text-sm font-medium text-gray-700">Cliente</label>
                                            <Select
                                                options={clientOptions}
                                                value={clientOptions.find(option => option.value === Number(values.client_id))}
                                                onChange={option => setFieldValue('client_id', option?.value || 0)}
                                                placeholder="Seleccione un cliente"
                                                styles={customSelectStyles}
                                            />
                                            <ErrorMessage name="client_id" component="div" className="text-red-500 text-xs" />

                                            <label className="block text-sm font-medium text-gray-700">Documento</label>
                                            <input
                                                type="text"
                                                className="input-form w-full"
                                                readOnly
                                                value={clientOptions.find(option => option.value === Number(values.client_id))?.document || ''}
                                            />

                                            <label className="block text-sm font-medium text-gray-700">Fecha de devolución</label>
                                            <Field name="return_date" type="date" className="input-form w-full" />
                                            <ErrorMessage name="return_date" component="div" className="text-red-500 text-xs" />

                                            <label className="block text-sm font-medium text-gray-700">Motivo de devolución</label>
                                            <Field name="reason" as="textarea" className="input-form w-full" rows={3} />
                                            <ErrorMessage name="reason" component="div" className="text-red-500 text-xs" />

                                            <label className="block text-sm font-medium text-gray-700">Producto</label>
                                            <Select
                                                options={productOptions}
                                                onChange={option => {
                                                    if (option && !values.items.some(item => item.product_id === option.value)) {
                                                        setFieldValue('items', [
                                                            ...values.items,
                                                            {
                                                                id: 0,
                                                                product_id: option.value,
                                                                reference: option.reference,
                                                                product_name: option.product_name,
                                                                color: option.color,
                                                                amount: 0,
                                                                price: option.price
                                                            }
                                                        ]);
                                                    }
                                                }}
                                                placeholder="Seleccione un producto"
                                                styles={customSelectStyles}
                                                formatOptionLabel={option => (
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <span
                                                            style={{
                                                                backgroundColor: option.color,
                                                                width: 16,
                                                                height: 16,
                                                                borderRadius: '50%',
                                                                marginRight: 8,
                                                                border: '1px solid #ccc'
                                                            }}
                                                        />
                                                        {option.label}
                                                    </div>
                                                )}
                                            />
                                        </div>

                                        {/* Columna derecha */}
                                        <div className="md:col-span-3 overflow-x-auto">
                                            <FieldArray name="items">
                                                {({ remove }) => (
                                                    <>
                                                        <table className="min-w-full border text-base">
                                                            <thead className="bg-gray-100">
                                                                <tr>
                                                                    <th className="px-4 py-3 border">Referencia</th>
                                                                    <th className="px-4 py-3 border">Nombre</th>
                                                                    <th className="px-4 py-3 border">Color</th>
                                                                    <th className="px-4 py-3 border">Cantidad</th>
                                                                    <th className="px-4 py-3 border">Precio</th>
                                                                    <th className="px-4 py-3 border">Subtotal</th>
                                                                    <th className="px-4 py-3 border">Acción</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {values.items.map((item, index) => (
                                                                    <tr key={index}>
                                                                        <td className="px-4 py-2 border">{item.reference}</td>
                                                                        <td className="px-4 py-2 border">{item.product_name}</td>
                                                                        <td className="px-4 py-2 border">
                                                                            <span
                                                                                className="inline-block w-6 h-6 rounded-full border border-gray-300"
                                                                                style={{ backgroundColor: item.color }}
                                                                            />
                                                                        </td>
                                                                        <td className="px-4 py-2 border">
                                                                            <Field
                                                                                name={`items[${index}].amount`}
                                                                                type="number"
                                                                                min={1}
                                                                                className="w-16 text-center border rounded"
                                                                            />
                                                                        </td>
                                                                        <td className="px-4 py-2 border">
                                                                            <Field name={`items[${index}].price`} type="number" min={0} className="w-20 text-center border rounded" />
                                                                        </td>
                                                                        <td className="px-4 py-2 border font-semibold">
                                                                            ${((item.amount || 0) * Number(item.price)).toLocaleString() || 0}
                                                                        </td>
                                                                        <td className="px-4 py-2 border text-center">
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => remove(index)}
                                                                            >
                                                                                <CloseCircle size={25} className="text-error hover:text-red-700" />
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                        <div className="flex justify-end mt-4">
                                                            <span className="text-xl font-bold text-primary">
                                                                Total De Devolución: ${total.toLocaleString()}
                                                            </span>
                                                        </div>
                                                    </>
                                                )}
                                            </FieldArray>
                                            <ErrorMessage name="items" component="div" className="text-red-500 text-xs mt-2" />
                                        </div>

                                        {/* Botones */}
                                        <div className="col-span-4 flex justify-center gap-6 mt-6">
                                            <button type="button" onClick={onClose} className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">
                                                Cancelar
                                            </button>
                                            <button type="submit" className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark">
                                                {devolucion ? 'Actualizar Devolución' : 'Registrar Devolución'}
                                            </button>
                                        </div>
                                    </Form>
                                );
                            }}
                        </Formik>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </Transition>
    );
}
