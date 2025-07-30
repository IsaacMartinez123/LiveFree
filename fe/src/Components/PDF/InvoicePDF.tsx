import {
    Document,
    Page,
    Text,
    View,
    StyleSheet
} from '@react-pdf/renderer';
import { Sales } from '../../pages/sales/Sales';
import { Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica' },
    title: { fontSize: 18, marginBottom: 20, textAlign: 'center', fontWeight: 'bold' },

    infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    infoBlock: { width: '48%' },
    label: { fontWeight: 'bold' },
    value: { marginBottom: 4 },

    sectionTitle: { fontSize: 12, marginTop: 20, marginBottom: 8, fontWeight: 'bold' },

    tableHeader: { flexDirection: 'row', backgroundColor: '#eee', borderBottom: '1 solid #000', paddingVertical: 4 },
    tableRow: { flexDirection: 'row', borderBottom: '1 solid #ccc', paddingVertical: 4 },

    col: { paddingHorizontal: 4, textAlign: 'left' },
    colProduct: { width: '22%' },
    colPrice: { width: '10%' },
    colSize: { width: '12%', textAlign: 'center' },
    colSubtotal: { width: '20%', textAlign: 'right' },
    colSpacer: { width: '80%' },

    totalRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 5,
        paddingRight: 60,
    },
    totalLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        marginRight: 5,
    },
    totalValue: {
        fontSize: 12,
        fontWeight: 'bold',
    },

});

export const InvoicePDF = ({ sale }: { sale: Sales }) => {

    const calculateSubtotal = (detail: any) => {
        const sizes = [
            detail.size_S,
            detail.size_M,
            detail.size_L,
            detail.size_XL,
            detail.size_2XL,
            detail.size_3XL,
            detail.size_4XL,
        ];
        const totalUnits = sizes.reduce((sum, qty) => sum + (Number(qty) || 0), 0);
        const price = Number(detail.price) || 0;
        return totalUnits * price;
    };


    const totalSubtotal = (sale.sales_details ?? []).reduce(
        (acc, detail) => acc + calculateSubtotal(detail),
        0
    );

    const getTotalUnits = (detail: any) => {
        const sizes = [
            detail.size_S,
            detail.size_M,
            detail.size_L,
            detail.size_XL,
            detail.size_2XL,
            detail.size_3XL,
            detail.size_4XL,
        ];
        return sizes.reduce((sum, qty) => sum + (Number(qty) || 0), 0);
    };



    const formatDate = (dateString: any) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-CO', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };


    const formatCurrency = (amount: number | string) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(Number(amount));
    };

    const createdAt = new Date(sale.created_at);
    const dueDate = new Date(createdAt);
    dueDate.setDate(createdAt.getDate() + 30);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={{ textAlign: 'center', marginBottom: 20 }}>
                    <Image
                        src="/livefreelogo.png"
                        style={{ width: 100, height: 100, marginBottom: 10, alignSelf: 'center' }}
                    />

                    <Text style={styles.title}>Factura #{sale?.invoice_number}</Text>
                </View>

                <View style={styles.infoRow}>
                    <View style={styles.infoBlock}>
                        <Text style={styles.label}>Cliente:</Text>
                        <Text style={styles.value}>{sale.client?.name}</Text>

                        <Text style={styles.label}>Vendedor (Código):</Text>
                        <Text style={styles.value}>{sale.seller?.seller_code}</Text>
                    </View>
                    <View style={styles.infoBlock}>
                        <Text style={styles.label}>Fecha:</Text>
                        <Text style={styles.value}>{formatDate(sale?.created_at)}</Text>
                        <Text style={styles.label}>Vencimiento:</Text>
                        <Text style={styles.value}>{formatDate(dueDate)}</Text>

                    </View>
                </View>

                <Text style={styles.sectionTitle}>Productos vendidos</Text>

                <View style={styles.tableHeader}>
                    <Text style={[styles.col, styles.colProduct]}>REF</Text>
                    <Text style={[styles.col, styles.colProduct]}>Producto</Text>
                    <Text style={[styles.col, styles.colSize]}>Cantidad</Text>
                    <Text style={[styles.col, styles.colPrice]}>Precio</Text>
                    <Text style={[styles.col, styles.colSubtotal]}>Subtotal</Text>
                </View>


                {(sale.sales_details ?? []).map((detail) => (
                    <View key={detail.id} style={styles.tableRow}>
                        <Text style={[styles.col, styles.colProduct]}>{detail.reference}</Text>
                        <Text style={[styles.col, styles.colProduct]}>{detail.product_name}</Text>
                        <Text style={[styles.col, styles.colSize]}>{getTotalUnits(detail)}</Text>
                        <Text style={[styles.col, styles.colPrice]}>{formatCurrency(detail.price)}</Text>
                        <Text style={[styles.col, styles.colSubtotal]}>
                            {formatCurrency(calculateSubtotal(detail))}
                        </Text>
                    </View>
                ))}


                <View style={styles.totalRow}>
                    <View style={styles.colSpacer} />
                    <View>
                        <Text style={styles.totalLabel}>Total:</Text>
                        <Text style={styles.totalValue}>{formatCurrency(totalSubtotal)}</Text>
                    </View>
                </View>

            </Page>
        </Document>
    );
};
