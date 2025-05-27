import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import logoImage from "../public/images/laundry-machine.png";
import delivery from "./assets/delivery.png";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    paddingBottom: 10,
    fontSize: 12,
    fontFamily: "Helvetica",
    display: "flex",
    flexDirection: "column",
    minHeight: "100%",
  },
  section: {
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
    paddingVertical: 8,
  },
  col1: {
    width: "40%",
    paddingLeft: 5,
  },
  col2: {
    width: "15%",
    textAlign: "center",
    paddingRight: 5,
  },
  col3: {
    width: "15%",
    textAlign: "start",
    paddingRight: 5,
  },
  col4: {
    width: "15%",
    textAlign: "start",
    paddingRight: 5,
  },
  col5: {
    width: "15%",
    textAlign: "start",
    paddingRight: 5,
  },
  headerRow: {
    backgroundColor: "#00000013",
    fontWeight: "bold",
    paddingVertical: 5,
  },
  totalSection: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#000",
    paddingTop: 10,
    textAlign: "right",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#193cb8",
  },
  minititle: {
    fontSize: 10,
    fontWeight: "500",
    marginBottom: 5,
    color: "#4a5565",
  },
  invoiceInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  invoiceDetails: {
    textAlign: "start",
    paddingTop: 17,
  },
  amountCell: {
    width: "15%",
    textAlign: "start",
    paddingRight: 5,
  },
  image: {
    marginTop: 10,
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  customerName: {
    fontSize: 10,
    color: "#4a5565",
    marginBottom: 3,
  },
  customerAddress: {
    fontSize: 10,
    color: "#4a5565",
    marginBottom: 3,
  },
  invoiceNumber: {
    color: "#4a5565",
    fontSize: 10,
    marginBottom: 3,
  },
  invoiceDate: {
    color: "#4a5565",
    fontSize: 10,
  },
  common: {
    fontSize: 10,
    color: "#000",
  },
  footer: {
    marginTop: "auto", // Pushes footer to the bottom of the page
    borderTopWidth: 1,
    borderTopColor: "#000",
    paddingTop: 10,
    paddingBottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#000",
    fontWeight: "bold",
    textAlign: "center",
  },
  imageFooter: {
    width: 42,
    height: 40,
  },
});

const getValueOrNull = (value) => {
  if (value === undefined || value === null || value === "") return null;
  return value;
};

const InvoicePDF = ({ invoiceData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>
            {getValueOrNull(invoiceData.businessInfo?.name)}
          </Text>
          <Text style={styles.minititle}>
            {getValueOrNull(invoiceData.businessInfo?.address1)}
          </Text>
          <Text style={styles.minititle}>
            {getValueOrNull(invoiceData.businessInfo?.address2)}
          </Text>
          <Text style={styles.minititle}>
            Phone: {getValueOrNull(invoiceData.businessInfo?.phone)}
          </Text>
          <Text style={styles.minititle}>
            Email: {getValueOrNull(invoiceData.businessInfo?.email)}
          </Text>
        </View>
        <View style={styles.image}>
          <Image src={logoImage} style={{ width: 42, height: 40 }} />
        </View>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={styles.section}>
          <Text style={{ marginBottom: 5, fontWeight: "bold" }}>Bill To:</Text>
          <Text style={styles.customerName}>
            {getValueOrNull(invoiceData.customerName)}
          </Text>
          <Text style={styles.customerAddress}>
            {getValueOrNull(invoiceData.customerAddress)}
          </Text>
        </View>
        <View style={styles.invoiceInfo}>
          <View></View>
          <View style={styles.invoiceDetails}>
            <Text style={styles.invoiceNumber}>
              Invoice: {getValueOrNull(invoiceData.invoiceNumber)}
            </Text>
            <Text style={styles.invoiceDate}>
              Date:{" "}
              {invoiceData.invoiceDate
                ? new Date(invoiceData.invoiceDate).toLocaleDateString("en-GB")
                : null}
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
            <Text style={[styles.col1, styles.common]}>
              {getValueOrNull(item.service)}
            </Text>
            <Text style={[styles.col5, styles.common]}>
              {item.date
                ? new Date(item.date).toLocaleDateString("en-GB")
                : null}
            </Text>
            <Text style={[styles.col2, styles.common]}>
              {getValueOrNull(item.quantity)}
            </Text>
            <Text style={[styles.col3, styles.common]}>
              {item.rate !== undefined && item.rate !== null && item.rate !== ""
                ? Number(item.rate).toFixed(2)
                : null}
            </Text>
            <Text style={[styles.amountCell, styles.common]}>
              {item.quantity && item.rate
                ? (item.quantity * item.rate).toFixed(2)
                : null}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.totalSection}>
        <Text style={{ fontSize: 14, fontWeight: "bold" }}>
          TOTAL:{" "}
          {invoiceData.total !== undefined &&
          invoiceData.total !== null &&
          invoiceData.total !== ""
            ? Number(invoiceData.total).toFixed(2)
            : null}
        </Text>
      </View>

      {invoiceData.bankDetails && (
        <View>
          <Text
            style={{
              color: "#000",
              fontSize: 14,
              fontWeight: "bold",
              marginBottom: 5,
            }}
          >
            Bank Details
          </Text>
          <Text style={{ color: "#4a5565", fontSize: 10, marginBottom: 3 }}>
            Account Name: {getValueOrNull(invoiceData.bankDetails.accountName)}
          </Text>
          <Text style={{ color: "#4a5565", fontSize: 10, marginBottom: 3 }}>
            Account Number:{" "}
            {getValueOrNull(invoiceData.bankDetails.accountNumber)}
          </Text>
          <Text style={{ color: "#4a5565", fontSize: 10, marginBottom: 3 }}>
            IFSC Code: {getValueOrNull(invoiceData.bankDetails.ifsc)}
          </Text>
          <Text style={{ color: "#4a5565", fontSize: 10, marginBottom: 3 }}>
            Bank Name: {getValueOrNull(invoiceData.bankDetails.bankName)}
          </Text>
        </View>
      )}

      {invoiceData.qrImage && (
        <View
          style={{
            marginTop: 16,
            alignItems: "start",
          }}
        >
          <Text
            style={{
              fontSize: 10,
              marginBottom: 4,
              color: "#4a5565",
            }}
          >
            Scan To Pay
          </Text>
          <Image
            src={invoiceData.qrImage}
            style={{
              width: 80,
              height: 80,
              objectFit: "contain",
              borderRadius: 6,
            }}
          />
        </View>
      )}

      {/* Footer Section */}
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
