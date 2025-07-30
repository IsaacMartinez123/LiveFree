import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch } from '../../../redux/hooks';
import { toast } from 'react-toastify';
import { updatePayment } from '../../../redux/payments/paymentsThunk';
import { Payment } from '../../../pages/payments/Payments';
import { CloseCircle } from 'iconsax-reactjs';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSubmitSuccess: () => void;
    payment?: Payment;
};

export type paymentDetailData = {
    amount: string;
    payment_method: string;
    date: string;
    observations?: string;
};

export default function AddPayment({ isOpen, onClose, onSubmitSuccess, payment }: Props) {
    const dispatch = useAppDispatch();

    const [abonosExistentes, setAbonosExistentes] = useState<paymentDetailData[]>([]);
    const [paymentDetailData, setPaymentDetailData] = useState<paymentDetailData[]>([]);


    const initialValues = useMemo(() => ({
        amount: '',
        payment_method: '',
        date: '',
        observations: '',
    }), []);

    useEffect(() => {
        if (payment?.payment_details) {
            const existentes = payment.payment_details.map(detail => ({
                amount: detail.amount.toString(),
                payment_method: detail.payment_method,
                date: detail.date,
                observations: detail.observations || '',
            }));

            setAbonosExistentes(existentes);
            setPaymentDetailData([]);
        }
    }, [payment]);


    const totalPagado = parseFloat(payment?.total_payment || '0');
    const deudaTotal = parseFloat(payment?.total_debt || '0');

    // Solo sumar los nuevos
    const nuevosAbonos = paymentDetailData.reduce((acc, curr) => acc + parseFloat(curr.amount || '0'), 0);
    const restante = deudaTotal - totalPagado - nuevosAbonos;
    const maxAbono = Math.max(0, restante);
    const limiteAlcanzado = maxAbono <= 0;

    const validationSchema = Yup.object({
        amount: Yup.number()
            .typeError('Debe ser un número')
            .min(1, 'El valor debe ser mayor a 0')
            .max(maxAbono, `No puede superar el máximo permitido de $${maxAbono.toLocaleString('es-CO')}`)
            .required('Requerido'),

        payment_method: Yup.string().required('El método de pago es requerido'),
        date: Yup.string().required('La fecha es requerida'),
        observations: Yup.string().nullable().max(255, 'Máximo 255 caracteres'),
    });


    const handleAddAbono = (values: paymentDetailData, { resetForm }: any) => {
        setPaymentDetailData((prev) => [...prev, values]);
        resetForm();
    };

    const handleDeleteAbono = (index: number) => {
        setPaymentDetailData((prev) => prev.filter((_, i) => i !== index));
    };


    const handleGuardarTodos = async () => {
        try {
            if (paymentDetailData.length === 0) return toast.warn('No hay abonos para guardar.');

            const response = await dispatch(updatePayment({ id: payment?.id, paymentDetailData }));

            toast.success(response.payload.message || 'Abonos guardados correctamente');
            onSubmitSuccess();
            onClose();
            setPaymentDetailData([]);
        } catch (error: any) {
            const apiMessage = error.response?.data?.message || error.message;
            toast.error(apiMessage || 'Error al guardar los abonos');
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
                        <Dialog.Panel className="bg-white rounded-lg p-6 sm:p-8 w-full max-w-6xl shadow-lg my-4">
                            <Dialog.Title className="text-2xl font-bold text-primary mb-6 text-center">
                                Agregar Abonos
                            </Dialog.Title>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                {/* Formulario */}
                                <Formik
                                    initialValues={initialValues}
                                    validationSchema={validationSchema}
                                    enableReinitialize
                                    onSubmit={handleAddAbono}
                                >
                                    {({ resetForm }) => (
                                        <Form className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium">Monto</label>
                                                <Field name="amount" type="number" className="input-form w-full" />
                                                <ErrorMessage name="amount" component="div" className="text-red-500 text-xs" />
                                                {!limiteAlcanzado && (
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Máximo permitido: ${maxAbono.toLocaleString('es-CO')}
                                                    </p>
                                                )}

                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium">Método de Pago</label>
                                                <Field name="payment_method" type="text" className="input-form w-full" />
                                                <ErrorMessage name="payment_method" component="div" className="text-red-500 text-xs" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium">Fecha</label>
                                                <Field name="date" type="date" className="input-form w-full" />
                                                <ErrorMessage name="date" component="div" className="text-red-500 text-xs" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium">Observaciones</label>
                                                <Field name="observations" type="text" as="textarea" className="input-form w-full" />
                                                <ErrorMessage name="observations" component="div" className="text-red-500 text-xs" />
                                            </div>

                                            <div className="flex justify-end">
                                                <button
                                                    type="submit"
                                                    disabled={limiteAlcanzado}
                                                    className={`px-4 py-2 rounded text-white font-semibold ${limiteAlcanzado
                                                        ? 'bg-gray-400 cursor-not-allowed'
                                                        : 'bg-purple-600 hover:bg-purple-700'
                                                        }`}
                                                >
                                                    Agregar Abono
                                                </button>

                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                                <div className="md:col-span-2 overflow-x-auto">
                                    <h3 className="text-xl font-semibold mb-4">Abonos añadidos</h3>
                                    {abonosExistentes.length === 0 && paymentDetailData.length === 0 ? (
                                        <p className="text-gray-500 text-base">Aún no se han agregado abonos.</p>
                                    ) : (
                                        <table className="min-w-full text-base border border-gray-200 shadow-md rounded-lg overflow-hidden">
                                            <thead>
                                                <tr className="bg-gray-100 text-gray-700">
                                                    <th className="border px-4 py-3 text-left">Monto</th>
                                                    <th className="border px-4 py-3 text-left">Método</th>
                                                    <th className="border px-4 py-3 text-left">Fecha</th>
                                                    <th className="border px-4 py-3 text-left">Observaciones</th>
                                                    <th className="border px-4 py-3 text-center">Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {[...abonosExistentes, ...paymentDetailData].map((paymentDetail, index) => (
                                                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                        <td className="border px-4 py-3">${parseFloat(paymentDetail.amount).toLocaleString()}</td>
                                                        <td className="border px-4 py-3">{paymentDetail.payment_method}</td>
                                                        <td className="border px-4 py-3">{paymentDetail.date}</td>
                                                        <td className="border px-4 py-3 break-words whitespace-pre-wrap">{paymentDetail.observations}</td>
                                                        <td className="border px-4 py-3 text-center">
                                                            {!abonosExistentes.includes(paymentDetail) && (
                                                                <button
                                                                    onClick={() => handleDeleteAbono(index - abonosExistentes.length)}
                                                                    className="text-red-500 hover:text-red-700 transition-colors"
                                                                    title="Eliminar abono"
                                                                >
                                                                    <CloseCircle size={22} className="inline-block" />
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>

                                        </table>
                                    )}
                                </div>


                            </div>

                            <div className="col-span-4 flex justify-center gap-6 mt-6">
                                <button
                                    onClick={onClose}
                                    className="bg-error text-white px-6 py-2 rounded hover:bg-red-600"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleGuardarTodos}
                                    className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark"
                                >
                                    Guardar Todos
                                </button>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}
