import { Dialog, Transition } from '@headlessui/react';
import { Warning2 } from 'iconsax-reactjs';
import { Fragment } from 'react';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    oversold?: string[];
};


export default function ModalAlert({ isOpen, onClose, title, message, oversold }: Props) {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300" leave="ease-in duration-200"
                    enterFrom="opacity-0" enterTo="opacity-100"
                    leaveFrom="opacity-100" leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/30" />
                </Transition.Child>

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300" leave="ease-in duration-200"
                        enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
                        leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all">
                            <div className="flex items-center gap-3">
                                <Warning2 size={40} color="#facc15" />
                                <Dialog.Title className="text-lg font-semibold text-gray-900">
                                    {title}
                                </Dialog.Title>
                            </div>
                            <div className="mt-3 text-sm text-gray-700">
                                {message}
                                {oversold && oversold.length > 0 && (
                                    <ul className="mt-2 list-disc list-inside text-sm text-gray-600">
                                        {oversold.map((ref, i) => (
                                            <li key={i}>{ref}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
                                >
                                    Entendido
                                </button>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}
