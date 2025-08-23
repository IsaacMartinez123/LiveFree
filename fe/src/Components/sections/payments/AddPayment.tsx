import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useMemo, useEffect } from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { toast } from 'react-toastify';
import { Payment, updatePayment } from '../../../redux/payments/paymentsThunk';
import { CloseCircle } from 'iconsax-reactjs';
import { fetchReturns } from '../../../redux/returns/returnsThunk';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmitSuccess: () => void;
    payment?: Payment;
}

export type paymentDetailData = {
    amount: string;
    payment_method: string;
    date: string;
    observations?: string;
    discount?: boolean;
};

export default function AddPayment({
    isOpen,
    onClose,
    payment,
    onSubmitSuccess
}: PaymentModalProps) {

    const dispatch = useAppDispatch();

    const [paymentDetails, setPaymentDetails] = useState<paymentDetailData[]>([]);

    const { returns } = useAppSelector(state => state.returns);

    const [hasReturns, setHasReturns] = useState(false);

    useEffect(() => {
        dispatch(fetchReturns({}));
    }, []);

    useEffect(() => {
        const clientReturns = returns.filter(ret => ret.client_id === payment?.client_id);

        if (clientReturns.length > 0) {
            const hasPending = clientReturns.some(ret => ret.status === 'pendiente')
            setHasReturns(hasPending);
        } else {
            setHasReturns(false);
        }

    }, [payment, returns]);

    const validationSchema = Yup.object({
        paymentDetails: Yup.array().of(
            Yup.object({
                amount: Yup.number().required('Requerido'),
                payment_method: Yup.string().required('Requerido'),
                date: Yup.date().required('Requerido'),
                observations: Yup.string(),
            })
        ),
    });

    const handleAddRow = () => {
        setPaymentDetails([
            ...paymentDetails,
            { amount: '', payment_method: '', date: '', observations: '', discount: false },
        ]);
    };

    useEffect(() => {
        if (isOpen && payment?.payment_details) {
            setPaymentDetails(
                payment.payment_details.map((detail) => ({
                    amount: detail.amount.toString(),
                    payment_method: detail.payment_method,
                    date: detail.date,
                    observations: detail.observations || '',
                    discount: detail.discount || false,
                }))
            );
        }
    }, [isOpen, payment]);

    const handleChange = <K extends keyof paymentDetailData>(
        index: number,
        field: K,
        value: paymentDetailData[K]
    ) => {
        const updated = [...paymentDetails];
        updated[index] = { ...updated[index], [field]: value };
        setPaymentDetails(updated);
    };


    const handleRemoveRow = (index: number) => {
        setPaymentDetails(paymentDetails.filter((_, i) => i !== index));
    };

    const totalAbonado = useMemo(
        () =>
            paymentDetails.reduce(
                (acc, curr) => acc + (parseFloat(curr.amount) || 0),
                0
            ),
        [paymentDetails]
    );

    const totalDeuda = Number(payment?.total_debt) || 0;

    const restante = totalDeuda - totalAbonado;

    const handleSubmit = async () => {
        try {
            console.log('Updating payment details:', paymentDetails);

            await dispatch(updatePayment({ id: payment?.id, paymentDetailData: paymentDetails })).unwrap();
            toast.success('Abonos actualizados correctamente');
            onSubmitSuccess();
            onClose();
        } catch {
            toast.error('Error al actualizar abonos');
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                {/* Header */}
                                <div className="flex justify-between items-center mb-4">
                                    <Dialog.Title className="text-lg font-medium leading-6 text-primary">
                                        Agregar Abonos{" "}
                                        {hasReturns && (
                                            <span className="text-red-600">(TIENE DEVOLUCIONES)</span>
                                        )}
                                    </Dialog.Title>

                                    <button onClick={onClose}>
                                        <CloseCircle size={24} className="text-muted hover:text-foreground" />
                                    </button>
                                </div>

                                {/* Contadores */}
                                <div className="grid grid-cols-3 gap-4 mb-4">
                                    <div className="bg-primary-muted p-3 rounded text-foreground">
                                        <span className="font-bold">Total deuda:</span>{" "}
                                        ${totalDeuda.toLocaleString("es-CO", { minimumFractionDigits: 0 })}
                                    </div>
                                    <div className="bg-success/20 p-3 rounded text-success">
                                        <span className="font-bold">Abonado:</span>{" "}
                                        ${totalAbonado.toLocaleString("es-CO", { minimumFractionDigits: 0 })}
                                    </div>
                                    <div
                                        className={`p-3 rounded ${restante < 0
                                                ? "bg-red-100 text-red-600"
                                                : "bg-warning/20 text-warning"
                                            }`}
                                    >
                                        <span className="font-bold">Restante:</span>{" "}
                                        ${restante.toLocaleString("es-CO", { minimumFractionDigits: 0 })}
                                    </div>
                                </div>


                                <Formik
                                    initialValues={{ paymentDetails }}
                                    validationSchema={validationSchema}
                                    onSubmit={handleSubmit}
                                    enableReinitialize
                                >
                                    {() => (
                                        <Form>
                                            <div className="overflow-x-auto">
                                                <table className="w-full border border-border text-sm">
                                                    <thead className="bg-primary-muted text-foreground">
                                                        <tr>
                                                            <th className="border px-3 py-2">Monto</th>
                                                            <th className="border px-3 py-2">Método</th>
                                                            <th className="border px-3 py-2">Fecha</th>
                                                            <th className="border px-3 py-2">Observaciones</th>
                                                            <th className="border px-3 py-2">Descuento</th>
                                                            <th className="border px-3 py-2 text-center">Acciones</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {paymentDetails.map((detail, index) => (
                                                            <tr key={index}>
                                                                <td className="border px-3 py-2">
                                                                    <input
                                                                        type="number"
                                                                        className="w-full border border-form-border rounded p-1 focus:border-form-focus"
                                                                        value={detail.amount}
                                                                        onChange={(e) =>
                                                                            handleChange(index, 'amount', e.target.value)
                                                                        }
                                                                    />
                                                                    <ErrorMessage
                                                                        name={`paymentDetails.${index}.amount`}
                                                                        component="div"
                                                                        className="text-form-error text-xs"
                                                                    />
                                                                </td>
                                                                <td className="border px-3 py-2">
                                                                    <input
                                                                        type="text"
                                                                        className="w-full border border-form-border rounded p-1 focus:border-form-focus"
                                                                        value={detail.payment_method}
                                                                        onChange={(e) =>
                                                                            handleChange(index, 'payment_method', e.target.value)
                                                                        }
                                                                    />
                                                                    <ErrorMessage
                                                                        name={`paymentDetails.${index}.payment_method`}
                                                                        component="div"
                                                                        className="text-form-error text-xs"
                                                                    />
                                                                </td>
                                                                <td className="border px-3 py-2">
                                                                    <input
                                                                        type="date"
                                                                        className="w-full border border-form-border rounded p-1 focus:border-form-focus"
                                                                        value={detail.date}
                                                                        onChange={(e) =>
                                                                            handleChange(index, 'date', e.target.value)
                                                                        }
                                                                    />
                                                                    <ErrorMessage
                                                                        name={`paymentDetails.${index}.date`}
                                                                        component="div"
                                                                        className="text-form-error text-xs"
                                                                    />
                                                                </td>
                                                                <td className="border px-3 py-2">
                                                                    <textarea
                                                                        className="w-full border border-form-border rounded p-1 focus:border-form-focus"
                                                                        value={detail.observations}
                                                                        onChange={(e) =>
                                                                            handleChange(index, 'observations', e.target.value)
                                                                        }
                                                                    />
                                                                </td>
                                                                <td className="border px-3 py-2 text-center">
                                                                    <label className="inline-flex items-center gap-2 cursor-pointer">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={detail.discount}
                                                                            onChange={(e) => handleChange(index, "discount", e.target.checked)}
                                                                            className="sr-only peer"
                                                                        />
                                                                        <div
                                                                            role="switch"
                                                                            aria-checked={detail.discount}
                                                                            className="relative w-11 h-6 rounded-full bg-gray-300 transition-colors peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-1 after:left-1 after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-transform after:duration-200 peer-checked:after:translate-x-5"
                                                                        />
                                                                        <span className="select-none text-sm font-medium text-gray-700 peer-checked:text-indigo-600">
                                                                            {detail.discount ? "Sí" : "No"}
                                                                        </span>
                                                                    </label>
                                                                </td>

                                                                <td className="border px-3 py-2 text-center">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleRemoveRow(index)}
                                                                    >
                                                                        <CloseCircle size={25} className="text-error hover:text-red-700" />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                            <div className="mt-4 flex justify-between">
                                                <button
                                                    type="button"
                                                    onClick={handleAddRow}
                                                    className="px-4 py-2 bg-success text-white rounded hover:bg-green-700"
                                                >
                                                    Agregar abono
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
                                                >
                                                    Guardar cambios
                                                </button>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
