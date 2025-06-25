import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useMemo } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch } from '../../../redux/hooks';
import { createClient, updateClient } from '../../../redux/clients/clientsThunk';
import { createSeller, updateSeller } from '../../../redux/sellers/sellersThunk';


type SellerData = {
    id: number;
    name: string;
    document: string;
    phone: string;
    email: string;
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSubmitSuccess: () => void;
    seller?: SellerData;
};

export default function AddSeller({ isOpen, onClose, onSubmitSuccess, seller }: Props) {
    const isEdit = !!seller;
    const dispatch = useAppDispatch();

    const initialValues = useMemo(() => ({
        name: seller?.name || '',
        document: seller?.document || '',
        phone: seller?.phone || '',
        email: seller?.email || '',
    }), [seller]);

    const validationSchema = useMemo(() => Yup.object({
        name: Yup.string().required('Nombre requerido'),
        document: Yup.string().required('Documento requerido'),
        phone: Yup.string().required('Teléfono requerido'),
        email: Yup.string().required('Correo requerido'),
    }), [isEdit]);

    const handleSubmit = async (values: any, { resetForm }: any) => {
        try {
            if (isEdit) {
                await dispatch(updateSeller({ id: seller?.id, ...values }));
            } else {
                await dispatch(createSeller(values));
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
                                {isEdit ? 'Editar Vendedor' : 'Registrar Vendedor'}
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
                                            <label htmlFor="name" className="block text-sm font-medium">Nombre</label>
                                            <Field name="name" className="input-form w-full" />
                                            <ErrorMessage name="name" component="div" className="text-red-500 text-xs" />
                                        </div>
                                        <div>
                                            <label htmlFor="document" className="block text-sm font-medium">Documento</label>
                                            <Field name="document" type="text" className="input-form w-full" />
                                            <ErrorMessage name="document" component="div" className="text-red-500 text-xs" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium">Correo</label>
                                            <Field name="email" type="email" className="input-form w-full" />
                                            <ErrorMessage name="email" component="div" className="text-red-500 text-xs" />
                                        </div>
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium">Teléfono</label>
                                            <Field name="phone" type="text" className="input-form w-full" />
                                            <ErrorMessage name="phone" component="div" className="text-red-500 text-xs" />
                                        </div>
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
