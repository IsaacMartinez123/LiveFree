import { PDFDownloadLink } from '@react-pdf/renderer';
import { DocumentDownload } from 'iconsax-reactjs';
import CustomerLabelPDF from './CustomerLabelPDF';
import { Client, Label } from '../../redux/clients/clientsThunk';

type Props = {
    client: Client;
    label: Label
};

const DownloadCustomerLabelButton = ({ client, label }: Props ) => {
    return (
        <PDFDownloadLink
            document={<CustomerLabelPDF client={client} label={label} />}
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
