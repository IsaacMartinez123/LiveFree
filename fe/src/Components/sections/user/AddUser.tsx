import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useMemo } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { createUser, updateUser } from '../../../redux/users/usersThunk';
import { useAppDispatch } from '../../../redux/hooks';
import { toast } from 'react-toastify';


type UserData = {
    id: number;
    name: string;
    email: string;
    rol_id: string;
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSubmitSuccess: () => void;
    user?: UserData;
};

export default function AddUser({ isOpen, onClose, onSubmitSuccess, user }: Props) {
    const isEdit = !!user;
    const dispatch = useAppDispatch();

    const initialValues = useMemo(() => ({
        name: user?.name || '',
        email: user?.email || '',
        rol_id: user?.rol_id || '',
        password: '',
        confirmPassword: '',
    }), [user]);

    const validationSchema = useMemo(() => Yup.object({
        name: Yup.string().required('Nombre requerido'),
        email: Yup.string().email('Email inválido').required('Correo requerido'),
        rol_id: Yup.string().required('Rol requerido'),
        ...(isEdit ? {} : {
            password: Yup.string().min(4, 'Mínimo 4 caracteres').required('Contraseña requerida'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden')
                .required('Confirma tu contraseña'),
        }),
    }), [isEdit]);

    const handleSubmit = async (values: any, { resetForm }: any) => {
        try {
            if (isEdit) {
                const response = await dispatch(updateUser({ id: user?.id, ...values }));
                toast.success(response.payload.message);
            } else {
                const response = await dispatch(createUser(values));
                toast.success(response.payload.message);
            }

            resetForm();
            onSubmitSuccess();
            onClose();
        } catch (error: any) {
            const apiMessage = error.response?.data?.message || error.message;
            toast.error(apiMessage || 'Error al guardar el cliente');
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
                                {isEdit ? 'Editar Usuario' : 'Registrar Usuario'}
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
                                            <label htmlFor="email" className="block text-sm font-medium">Correo</label>
                                            <Field name="email" type="email" className="input-form w-full" />
                                            <ErrorMessage name="email" component="div" className="text-red-500 text-xs" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="password" className="block text-sm font-medium">Contraseña</label>
                                            <Field name="password" type="password" className="input-form w-full" />
                                            <ErrorMessage name="password" component="div" className="text-red-500 text-xs" />
                                        </div>
                                        <div>
                                            <label htmlFor="confirmPassword" className="block text-sm font-medium">Confirma contraseña</label>
                                            <Field name="confirmPassword" type="password" className="input-form w-full" />
                                            <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-xs" />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="rol_id" className="block text-sm font-medium">Rol</label>
                                        <Field as="select" name="rol_id" className="input-form w-full">
                                            <option value="">Selecciona un rol</option>
                                            <option value="1">Administrador</option>
                                            <option value="2">Vendedor</option>
                                            <option value="3">Cliente</option>
                                        </Field>
                                        <ErrorMessage name="rol_id" component="div" className="text-red-500 text-xs" />
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
