import { PDFDownloadLink } from '@react-pdf/renderer';
import { DocumentDownload } from 'iconsax-reactjs';
import { Payment } from '../../pages/payments/Payments';
import PaymentDetailPDF from './PaymentDetailPDF';

const DownloadPaymentButton = ({ payment }: { payment: Payment }) => {
    return (
        <PDFDownloadLink
            document={<PaymentDetailPDF payment={payment} />}
            fileName={`Abono-${payment.invoice_number}-${payment.client.name}.pdf`}
        >
            {({ loading }) =>
                loading ? (
                    <span className="text-gray-400 text-sm">Generando PDF...</span>
                ) : (
                    <span title="Descargar Abono">
                        <DocumentDownload size={25} color="#8a0000ff" />
                    </span>
                )
            }
        </PDFDownloadLink>
    );
};

export default DownloadPaymentButton;
