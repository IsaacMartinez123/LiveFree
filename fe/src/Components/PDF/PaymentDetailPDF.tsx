import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
} from '@react-pdf/renderer';
import { Payment } from '../../redux/payments/paymentsThunk';

interface Props {
    payment: Payment;
}


const styles = StyleSheet.create({
    page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica' },

    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    leftColumn: {
        width: '40%',
        justifyContent: 'flex-start',
    },
    rightColumn: {
        alignItems: 'flex-end',
        justifyContent: 'center',

    },
    logo: {
        width: 80,
        height: 80,
    },
    invoiceTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
        textAlign: 'right',
    },
    textLine: {
        fontSize: 10,
        marginBottom: 2,
        textAlign: 'right',
        paddingBottom: 2,
    },

    sectionTitle: { fontSize: 12, marginTop: 20, marginBottom: 8, fontWeight: 'bold' },

    tableHeader: { flexDirection: 'row', backgroundColor: '#eee', borderBottom: '1 solid #000', paddingVertical: 4 },
    tableRow: { flexDirection: 'row', borderBottom: '1 solid #ccc', paddingVertical: 4 },


    col: {
        paddingHorizontal: 4,
    },
    colMethod: {
        width: '20%',
    },
    colAmount: {
        width: '20%',
        textAlign: 'right',
    },
    colDate: {
        width: '20%',
        textAlign: 'center',
    },
    colObs: {
        width: '40%',
    },
    colDesc: {
        width: '20%',
        textAlign: 'left',
    },
    summaryText: {
        marginBottom: 4,
    },
    bold: {
        fontWeight: 'bold',
    },
    totalRow: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    totalLabel: {
        fontWeight: 'bold',
        fontSize: 11,
        marginRight: 4,
    },
    totalValue: {
        fontSize: 11,
    },
});

export default function PaymentDetailPDF({ payment }: Props) {

    return (
        <Document>
            <Page size={[612, 396]} style={styles.page}>

                <View style={styles.headerContainer}>
                    <View style={styles.leftColumn}>
                        <Text style={styles.invoiceTitle}>Abono Factura #{payment?.invoice_number}</Text>

                        <Text style={styles.textLine}>
                            <Text style={styles.bold}>Cliente: </Text> {payment.client.name}
                        </Text>

                        <Text style={styles.textLine}>
                            <Text style={styles.bold}>Total Pagado: {parseFloat(payment.total_payment).toLocaleString()}</Text>
                        </Text>

                        <Text style={styles.textLine}>
                            <Text style={styles.bold}>Deuda Total: {parseFloat(payment.total_debt).toLocaleString()}</Text>
                        </Text>
                        <Text style={styles.textLine}>
                            <Text style={styles.bold}>Deuda Restante: {(parseFloat(payment.total_debt) - parseFloat(payment.total_payment)).toLocaleString()}</Text>
                        </Text>
                        <Text style={styles.textLine}>

                        </Text>
                    </View>

                    <View style={styles.rightColumn}>
                        <Image src="/livefreelogo.png" style={styles.logo} />
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Abonos:</Text>

                <View style={styles.tableHeader}>
                    <Text style={[styles.col, styles.colMethod]}>Método</Text>
                    <Text style={[styles.col, styles.colAmount]}>Monto</Text>
                    <Text style={[styles.col, styles.colDate]}>Fecha</Text>
                    <Text style={[styles.col, styles.colObs]}>Observaciones</Text>
                    <Text style={[styles.col, styles.colDesc]}>Descuento</Text>
                </View>

                {(payment.payment_details ?? []).map((detail, idx) => (
                    <View key={idx} style={styles.tableRow}>
                        <Text style={[styles.col, styles.colMethod]}>
                            {detail.payment_method}
                        </Text>
                        <Text style={[styles.col, styles.colAmount]}>
                            {parseFloat(detail.amount).toLocaleString()}
                        </Text>
                        <Text style={[styles.col, styles.colDate]}>
                            {detail.date}
                        </Text>
                        <Text style={[styles.col, styles.colObs]}>
                            {detail.observations || '-'}
                        </Text>
                        <Text style={[styles.col, styles.colDesc]}>
                            {detail.discount ? 'Si' : 'No'}
                        </Text>
                    </View>
                ))}
            </Page>
        </Document>
    );
}
