import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import logoImage from '../public/images/laundry-machine.png';
import delivery from './assets/delivery.png';

const styles = StyleSheet.create({
    page: {
        padding: 40,
        paddingBottom: 10,
        fontSize: 12,
        fontFamily: 'Helvetica',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
    },
    section: {
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        alignItems: 'center',
        paddingVertical: 8,
    },
    col1: {
        width: '40%',
        paddingLeft: 5,
    },
    col2: {
        width: '15%',
        textAlign: 'center',
        paddingRight: 5,
    },
    col3: {
        width: '15%',
        textAlign: 'start',
        paddingRight: 5,
    },
    col4: {
        width: '15%',
        textAlign: 'start',
        paddingRight: 5,
    },
    col5: {
        width: '15%',
        textAlign: 'start',
        paddingRight: 5,
    },
    headerRow: {
        backgroundColor: '#00000013',
        fontWeight: 'bold',
        paddingVertical: 5,
    },
    totalSection: {
        marginTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#000',
        paddingTop: 10,
        textAlign: 'right',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#193cb8',
    },
    minititle: {
        fontSize: 10,
        fontWeight: '500',
        marginBottom: 5,
        color: '#4a5565',
    },
    invoiceInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    invoiceDetails: {
        textAlign: 'start',
        paddingTop: 17,
    },
    amountCell: {
        width: '15%',
        textAlign: 'start',
        paddingRight: 5,
    },
    image: {
        marginTop: 10,
    },
    header: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    customerName: {
        fontSize: 10,
        color: '#4a5565',
        marginBottom: 3,
    },
    customerAddress: {
        fontSize: 10,
        color: '#4a5565',
        marginBottom: 3,
    },
    invoiceNumber: {
        color: '#4a5565',
        fontSize: 10,
        marginBottom: 3,
    },
    invoiceDate: {
        color: '#4a5565',
        fontSize: 10,
    },
    common: {
        fontSize: 10,
        color: '#000',
    },
    footer: {
        marginTop: 'auto', // Pushes footer to the bottom of the page
        borderTopWidth: 1,
        borderTopColor: '#000',
        paddingTop: 10,
        paddingBottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
        color: '#000',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    imageFooter: {
        width: 42,
        height: 40,
    },
});

const InvoicePDF = ({ invoiceData }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>APSARA POWER LAUNDRY</Text>
                    <Text style={styles.minititle}>Shop No: 8, Kedar Appartment, Opp Chamak-Chuna</Text>
                    <Text style={styles.minititle}>Thakkar Nagar - 382350</Text>
                    <Text style={styles.minititle}>Phone: 9558768784</Text>
                    <Text style={styles.minititle}>Email: ananddagar111@gmail.com</Text>
                </View>

                <View style={styles.image}>
                    <Image src={logoImage} style={{ width: 42, height: 40 }} />
                </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={styles.section}>
                    <Text style={{ marginBottom: 5, fontWeight: 'bold' }}>Bill To:</Text>
                    <Text style={styles.customerName}>{invoiceData.customerName || "Halewood Laboratories Private Limited"}</Text>
                    <Text style={styles.customerAddress}>{invoiceData.customerAddress || "319 G I D C Industrial Estate, Phase 2, Vatva, Ahmedabad, Gujarat 382440"}</Text>
                </View>

                <View style={styles.invoiceInfo}>
                    <View></View>
                    <View style={styles.invoiceDetails}>
                        <Text style={styles.invoiceNumber}>Invoice: {invoiceData.invoiceNumber}</Text>
                        <Text style={styles.invoiceDate}>
                            Date: {new Date(invoiceData.invoiceDate).toLocaleDateString('en-GB')}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <View style={[styles.row, styles.headerRow]}>
                    <Text style={styles.col1}>Service</Text>
                    <Text style={styles.col5}>Date</Text>
                    <Text style={styles.col2}>Qty</Text>
                    <Text style={styles.col3}>Rate</Text>
                    <Text style={styles.col4}>Amount</Text>
                </View>

                {invoiceData.items.map((item, index) => (
                    <View key={index} style={styles.row}>
                        <Text style={[styles.col1, styles.common]}>{item.service}</Text>
                        <Text style={[styles.col5, styles.common]}>
                            {new Date(item.date).toLocaleDateString('en-GB')} {/* DD-MM-YY format */}
                        </Text>
                        <Text style={[styles.col2, styles.common]}>{item.quantity}</Text>
                        <Text style={[styles.col3, styles.common]}>{item.rate.toFixed(2)}</Text>
                        <Text style={[styles.amountCell, styles.common]}>{(item.quantity * item.rate).toFixed(2)}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.totalSection}>
                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                    TOTAL: {invoiceData.total.toFixed(2)}
                </Text>
            </View>

            <View>
                <Text style={{ color: "#000", fontSize: 14, fontWeight: "bold", marginBottom: 5 }}>Bank Details</Text>
                <Text style={{ color: "#4a5565", fontSize: 10, marginBottom: 3 }}>Account Name: Dagar Anand Kishanbhai</Text>
                <Text style={{ color: "#4a5565", fontSize: 10, marginBottom: 3 }}>Account Number: 4647033889</Text>
                <Text style={{ color: "#4a5565", fontSize: 10, marginBottom: 3 }}>IFSC Code: KKBK0002603</Text>
                <Text style={{ color: "#4a5565", fontSize: 10, marginBottom: 3 }}>Bank Name: Kotak Mahindra Bank</Text>
            </View>

            {/* Footer Section for Quote - this will now be at the bottom */}
            <View style={styles.footer}>
                <View style={styles.imageFooter}>
                    <Image src={delivery} style={styles.imageFooter} />
                </View>
                <Text style={styles.footerText}>
                    "When time matters, we deliver fast, fresh, and clean!"
                </Text>
                <View style={styles.imageFooter}>
                    <Image src={delivery} style={styles.imageFooter} />
                </View>
            </View>
        </Page>
    </Document>
);

export default InvoicePDF;
