import { PDFDownloadLink } from '@react-pdf/renderer';
import { DocumentDownload } from 'iconsax-reactjs';
import ReturnDetailPDF from './ReturnDetailPDF';
import { Return } from '../../redux/returns/returnsThunk';

const DownloadReturnButton = ({ devolucion }: { devolucion: Return }) => {
    return (
        <PDFDownloadLink
            document={<ReturnDetailPDF devolucion={devolucion} />}
            fileName={`Devolución-${devolucion.return_number}-${devolucion.client?.name}.pdf`}
        >
            {({ loading }) =>
                loading ? (
                    <span className="text-gray-400 text-sm">Generando PDF...</span>
                ) : (
                    <span title="Descargar Devolución">
                        <DocumentDownload size={25} color="#8a0000ff" />
                    </span>
                )
            }
        </PDFDownloadLink>
    );
};

export default DownloadReturnButton;
