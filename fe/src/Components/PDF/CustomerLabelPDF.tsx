// components/pdf/CustomerLabelPDF.tsx
import React from 'react';
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Font
} from '@react-pdf/renderer';
import { Client } from './DownloadCustomerLabelButton';

// Estilos del PDF
const styles = StyleSheet.create({
    page: { padding: 10, fontSize: 10, fontFamily: 'Helvetica' },

    container: {
        width: '100%',
    },
    sectionCliente: {
        backgroundColor: '#E9D5FF', // primary-muted
        padding: 10,
        borderRadius: 6,
        marginBottom: 12,
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 6,
    },
    label: {
        width: '30%',
        fontWeight: 'bold',
        color: '#7E22CE', // primary-dark
        fontSize: 19,
    },
    value: {
        width: '70%',
        fontSize: 19,
        color: '#111827',
    },
    sectionEmpresa: {
        backgroundColor: '#FDE68A', // algo similar al fondo naranja claro
        padding: 10,
        borderRadius: 6,
    },
    empresaText: {
        fontSize: 18,
        marginBottom: 4,
        color: '#111827',
    },
    empresaNombre: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 8,
        textAlign: 'center',
        color: '#7E22CE',
    },
});

type Props = {
    client: Client;
};

const CustomerLabelPDF = ({ client }: Props) => (
    <Document>
        <Page size="A5" orientation="landscape" style={styles.page}>
            <View style={styles.container}>
                {/* Datos del Cliente */}
                <View style={styles.sectionCliente}>
                    {[
                        ['SEÑORES:', client.name],
                        ['CEDULA:', client.document],
                        ['DIRECCION:', client.address],
                        ['ALMACEN:', client.store_name],
                        ['TELEFONO:', client.phone],
                        ['CIUDAD:', client.city],
                    ].map(([label, value], idx) => (
                        <View style={styles.row} key={idx}>
                            <Text style={styles.label}>{label}</Text>
                            <Text style={styles.value}>{value}</Text>
                        </View>
                    ))}
                </View>

                {/* Datos fijos de empresa */}
                <View style={styles.sectionEmpresa}>
                    <Text style={styles.empresaText}>LIVE FREE</Text>
                    <Text style={styles.empresaText}>CC: 98.624.755</Text>
                    <Text style={styles.empresaText}>
                        CALLE 18 # 71 - 24 BELEN LAS PLAYAS
                    </Text>
                    <Text style={styles.empresaText}>TEL: 3206823281 (SAMUEL CARDONA)</Text>
                    <Text style={styles.empresaNombre}>MEDELLIN - ANTIOQUIA</Text>
                </View>
            </View>
        </Page>
    </Document>
);

export default CustomerLabelPDF;
