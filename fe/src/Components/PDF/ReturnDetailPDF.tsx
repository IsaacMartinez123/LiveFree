import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
} from "@react-pdf/renderer";
import { Return } from "../../redux/returns/returnsThunk";

interface Props {
    devolucion: Return;
}

const styles = StyleSheet.create({
    page: { padding: 40, fontSize: 10, fontFamily: "Helvetica" },

    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    leftColumn: {
        width: "40%",
        justifyContent: "flex-start",
    },
    rightColumn: {
        alignItems: "flex-end",
        justifyContent: "center",
    },
    logo: {
        width: 80,
        height: 80,
    },
    returenTitle: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 6,
        textAlign: "right",
    },
    textLine: {
        fontSize: 10,
        marginBottom: 2,
        textAlign: "right",
        paddingBottom: 2,
    },
    bold: {
        fontWeight: "bold",
    },
    sectionTitle: {
        fontSize: 12,
        marginTop: 20,
        marginBottom: 8,
        fontWeight: "bold",
    },

    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#eee",
        borderBottom: "1 solid #000",
        paddingVertical: 4,
    },
    tableRow: {
        flexDirection: "row",
        borderBottom: "1 solid #ccc",
        paddingVertical: 4,
    },

    col: { paddingHorizontal: 4 },
    colRef: { width: "15%" },
    colName: { width: "25%" },
    colPrice: { width: "15%", textAlign: "right" },
    colQty: { width: "15%", textAlign: "center" },
    colSubtotal: { width: "15%", textAlign: "right" },

    totalRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 6,
        marginLeft: 50,
        paddingTop: 4,
    },

    totalLabel: {
        fontSize: 10,
        fontWeight: "bold",
        textAlign: "right",
    },

    totalValue: {
        fontSize: 12,
        fontWeight: "bold",
        textAlign: "right",
        marginTop: 2,
    },

    motivoContainer: {
        marginTop: 20,
    },
    motivoLabel: {
        fontSize: 10,
        fontWeight: "bold",
        marginBottom: 4,
    },
    motivoText: {
        fontSize: 10,
        lineHeight: 1.4,
    },
});

export default function ReturnDetailPDF({ devolucion }: Props) {
    return (
        <Document>
            <Page size={[612, 396]} style={styles.page}>
                {/* Header */}
                <View style={styles.headerContainer}>
                    <View style={styles.leftColumn}>
                        <Text style={styles.returenTitle}>
                            Devolución #{devolucion.return_number}
                        </Text>

                        <Text style={styles.textLine}>
                            <Text style={styles.bold}>Cliente: </Text>
                            {devolucion.client?.name}
                        </Text>

                        <Text style={styles.textLine}>
                            <Text style={styles.bold}>Usuario: </Text>
                            {devolucion.user?.name}
                        </Text>

                        <Text style={styles.textLine}>
                            <Text style={styles.bold}>Fecha devolución: </Text>
                            {devolucion.return_date}
                        </Text>

                        <Text style={styles.textLine}>
                            <Text style={styles.bold}>Fecha reembolso: </Text>
                            {devolucion.refund_date || "Pendiente"}
                        </Text>
                    </View>

                    <View style={styles.rightColumn}>
                        <Image src="/livefreelogo.png" style={styles.logo} />
                    </View>
                </View>

                {/* Productos */}
                <Text style={styles.sectionTitle}>Productos devueltos:</Text>
                <View style={styles.tableHeader}>
                    <Text style={[styles.col, styles.colRef]}>REF</Text>
                    <Text style={[styles.col, styles.colName]}>Producto</Text>
                    <Text style={[styles.col, styles.colPrice]}>Precio</Text>
                    <Text style={[styles.col, styles.colQty]}>Cantidad</Text>
                    <Text style={[styles.col, styles.colSubtotal]}>Subtotal</Text>
                </View>

                {(devolucion.details ?? []).map((detail, idx) => (
                    <View key={idx} style={styles.tableRow}>
                        <Text style={[styles.col, styles.colRef]}>{detail.reference}</Text>
                        <Text style={[styles.col, styles.colName]}>{detail.product_name}</Text>
                        <Text style={[styles.col, styles.colPrice]}>
                            {parseFloat(detail.price).toLocaleString()}
                        </Text>
                        <Text style={[styles.col, styles.colQty]}>{detail.amount}</Text>
                        <Text style={[styles.col, styles.colSubtotal]}>
                            {(parseFloat(detail.price) * detail.amount).toLocaleString()}
                        </Text>
                    </View>
                ))}

                {/* Totales */}
                <View style={styles.totalRow}>
                    <View style={{ flexDirection: "column", alignItems: "flex-start", width: "30%" }}>
                        <Text style={styles.totalLabel}>Total devuelto:</Text>
                        <Text style={styles.totalValue}>
                            ${parseFloat(devolucion.refund_total).toLocaleString()}
                        </Text>
                    </View>
                </View>

                {/* Motivo */}
                <View style={styles.motivoContainer}>
                    <Text style={styles.motivoLabel}>Motivo de la devolución:</Text>
                    <Text style={styles.motivoText}>{devolucion.reason || "No especificado"}</Text>
                </View>
            </Page>
        </Document>
    );
}
