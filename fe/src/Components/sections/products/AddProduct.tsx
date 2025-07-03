import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useMemo } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch } from '../../../redux/hooks';
import { createClient, updateClient } from '../../../redux/clients/clientsThunk';
import { createSeller, updateSeller } from '../../../redux/sellers/sellersThunk';
import { createProduct, updateProduct } from '../../../redux/products/productsThunk';


type ProductData = {
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

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSubmitSuccess: () => void;
    product?: ProductData;
};

export default function AddProduct({ isOpen, onClose, onSubmitSuccess, product }: Props) {
    const isEdit = !!product;
    const dispatch = useAppDispatch();

    const initialValues = useMemo(() => ({
        reference: product?.reference || '',
        product_name: product?.product_name || '',
        price: product?.price || '',
        color: product?.color || '',
        size_S: product?.size_S || '',
        size_M: product?.size_M || '',
        size_L: product?.size_L || '',
        size_XL: product?.size_XL || '',
        size_2XL: product?.size_2XL || '',
        size_3XL: product?.size_3XL || '',
        size_4XL: product?.size_4XL || '',
        status: product?.status || false,
    }), [product]);

    const validationSchema = useMemo(() => Yup.object({
        reference: Yup.string().required('Referencia requerida'),
        product_name: Yup.string().required('Nombre del producto requerido'),
        price: Yup.number().required('Precio requerido').min(0, 'El precio debe ser numero positivo'),
        color: Yup.string().required('Color requerido'),
        size_S: Yup.number().min(0, 'La talla debe ser numero positivo'),
        size_M: Yup.number().min(0, 'La talla debe ser numero positivo'),
        size_L: Yup.number().min(0, 'La talla debe ser numero positivo'),
        size_XL: Yup.number().min(0, 'La talla debe ser numero positivo'),
        size_2XL: Yup.number().min(0, 'La talla debe ser numero positivo'),
        size_3XL: Yup.number().min(0, 'La talla debe ser numero positivo'),
        size_4XL: Yup.number().min(0, 'La talla debe ser numero positivo'),
    }), [isEdit]);

    const handleSubmit = async (values: any, { resetForm }: any) => {
        try {
            if (isEdit) {                
                await dispatch(updateProduct({ id: product?.id, ...values }));
            } else {
                await dispatch(createProduct(values));
            }

            resetForm();
            onSubmitSuccess();
            onClose();
        } catch (error) {
            console.error('Error al guardar:', error);
        }
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
                        <Dialog.Panel className="bg-white rounded-lg p-6 sm:p-8 w-full max-w-md sm:max-w-2xl shadow-lg my-4">
                            <Dialog.Title className="text-xl sm:text-2xl font-bold text-primary mb-6 text-center sm:text-left">
                                {isEdit ? 'Editar Producto' : 'Registrar Producto'}
                            </Dialog.Title>

                            <Formik
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                                enableReinitialize
                                onSubmit={handleSubmit}
                            >
                                <Form className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="reference" className="block text-sm font-medium">Referencia</label>
                                            <Field name="reference" type="text" className="input-form w-full" placeholder="Ingrese El Numero De Referencia" />
                                            <ErrorMessage name="reference" component="div" className="text-red-500 text-xs" />
                                        </div>
                                        <div>
                                            <label htmlFor="product_name" className="block text-sm font-medium" >Nombre</label>
                                            <Field name="product_name" className="input-form w-full" placeholder="Ingrese El Nombre Del Prodcuto" />
                                            <ErrorMessage name="product_name" component="div" className="text-red-500 text-xs" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="price" className="block text-sm font-medium">Precio</label>
                                            <Field name="price" type="number" className="input-form w-full" placeholder="Ingrese El Precio Del Producto" />
                                            <ErrorMessage name="price" component="div" className="text-red-500 text-xs" />
                                        </div>
                                        <div>
                                            <label htmlFor="color" className="block text-sm font-medium">Color</label>
                                            <Field name="color">
                                                {({ field }: any) => (
                                                    <input
                                                        {...field}
                                                        type="color"
                                                        className="input-form w-full h-10 p-1"
                                                        id="color"
                                                    />
                                                )}
                                            </Field>
                                            <ErrorMessage name="color" component="div" className="text-red-500 text-xs" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="size_S" className="block text-sm font-medium">Talla S</label>
                                            <Field name="size_S" type="number" className="input-form w-full" placeholder="Ingrese La Cantidad De La Talla" />
                                            <ErrorMessage name="size_S" component="div" className="text-red-500 text-xs" />
                                        </div>
                                        <div>
                                            <label htmlFor="size_M" className="block text-sm font-medium">Talla M</label>
                                            <Field name="size_M" type="number" className="input-form w-full" placeholder="Ingrese La Cantidad De La Talla" />
                                            <ErrorMessage name="size_M" component="div" className="text-red-500 text-xs" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="size_L" className="block text-sm font-medium">Talla L</label>
                                            <Field name="size_L" type="number" className="input-form w-full" placeholder="Ingrese La Cantidad De La Talla" />
                                            <ErrorMessage name="size_L" component="div" className="text-red-500 text-xs" />
                                        </div>
                                        <div>
                                            <label htmlFor="size_XL" className="block text-sm font-medium">Talla XL</label>
                                            <Field name="size_XL" type="number" className="input-form w-full" placeholder="Ingrese La Cantidad De La Talla" />
                                            <ErrorMessage name="size_XL" component="div" className="text-red-500 text-xs" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="size_2XL" className="block text-sm font-medium">Talla 2XL</label>
                                            <Field name="size_2XL" type="number" className="input-form w-full" placeholder="Ingrese La Cantidad De La Talla" />
                                            <ErrorMessage name="size_2XL" component="div" className="text-red-500 text-xs" />
                                        </div>
                                        <div>
                                            <label htmlFor="size_3XL" className="block text-sm font-medium">Talla 3XL</label>
                                            <Field name="size_3XL" type="number" className="input-form w-full" placeholder="Ingrese La Cantidad De La Talla" />
                                            <ErrorMessage name="size_3XL" component="div" className="text-red-500 text-xs" />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="size_4XL" className="block text-sm font-medium">Talla 4XL</label>
                                        <Field name="size_4XL" type="number" className="input-form w-full" placeholder="Ingrese La Cantidad De La Talla" />
                                        <ErrorMessage name="size_4XL" component="div" className="text-red-500 text-xs" />
                                    </div>

                                    <div className="flex flex-col sm:flex-row justify-center gap-10 pt-2">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="bg-error text-white px-6 py-2 rounded hover:bg-red-600 w-full sm:w-auto"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark w-full sm:w-auto"
                                        >
                                            {isEdit ? 'Editar' : 'Registrar'}
                                        </button>
                                    </div>
                                </Form>
                            </Formik>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>

    );
}
