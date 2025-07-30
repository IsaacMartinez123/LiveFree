import { PDFDownloadLink } from '@react-pdf/renderer';
import { InvoicePDF } from './InvoicePDF';
import { DocumentDownload } from 'iconsax-reactjs';
import { Sales } from '../../pages/sales/Sales';

const DownloadInvoiceButton = ({ sale }: { sale: Sales }) => {
    return (
        <PDFDownloadLink
            document={<InvoicePDF sale={sale} />}
            fileName={`Factura-${sale.invoice_number}.pdf`}
        >
            {({ loading }) =>
                loading ? (
                    <span className="text-gray-400 text-sm">Generando PDF...</span>
                ) : (
                    <span title="Descargar Factura">
                        <DocumentDownload size={25} color="#8a0000ff" />
                    </span>
                )
            }
        </PDFDownloadLink>
    );
};

export default DownloadInvoiceButton;
