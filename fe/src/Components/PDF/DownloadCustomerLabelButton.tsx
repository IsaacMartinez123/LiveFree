import { PDFDownloadLink } from '@react-pdf/renderer';
import { DocumentDownload } from 'iconsax-reactjs';
import CustomerLabelPDF from './CustomerLabelPDF';

export type Client = {
    name: string;
    document: string;
    address: string;
    city: string;
    phone: string;
    store_name: string;
};

const DownloadCustomerLabelButton = ({ client }: { client: Client }) => {
    return (
        <PDFDownloadLink
            document={<CustomerLabelPDF client={client} />}
            fileName={`Rotulo-${client.name || 'cliente'}.pdf`}
        >
            {({ loading }) =>
                loading ? (
                    <span className="text-gray-400 text-sm">Generando PDF...</span>
                ) : (
                    <span title="Descargar Rótulo">
                        <DocumentDownload size={25} color="#8a0000ff" />
                    </span>
                )
            }
        </PDFDownloadLink>
    );
};

export default DownloadCustomerLabelButton;
