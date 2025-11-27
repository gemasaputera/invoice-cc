/* eslint-disable @next/next/no-img-element */
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer'

// Professional template with traditional styling
const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontSize: 11,
    fontFamily: 'Times-Roman',
    color: '#000000',
    backgroundColor: '#ffffff',
  },
  border: {
    borderWidth: 1,
    borderColor: '#000000',
    borderStyle: 'solid',
  },
  header: {
    marginBottom: 40,
    borderBottomWidth: 2,
    borderBottomColor: '#000000',
    borderBottomStyle: 'solid',
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  logo: {
    maxHeight: 50,
    maxWidth: 180,
    marginBottom: 8,
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Times-Bold',
    color: '#000000',
    marginBottom: 8,
  },
  companyDetails: {
    fontSize: 10,
    color: '#333333',
    marginBottom: 3,
    fontFamily: 'Times-Roman',
  },
  titleSection: {
    alignItems: 'flex-end',
    textAlign: 'right',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'Times-Bold',
    color: '#000000',
    marginBottom: 10,
  },
  invoiceInfo: {
    fontSize: 11,
    color: '#333333',
    textAlign: 'right',
    fontFamily: 'Times-Roman',
  },
  invoiceDetails: {
    flexDirection: 'row',
    marginBottom: 40,
    marginTop: 30,
  },
  detailColumn: {
    flex: 1,
  },
  detailTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Times-Bold',
    color: '#000000',
    marginBottom: 10,
    textDecoration: 'underline',
  },
  detailItem: {
    fontSize: 11,
    color: '#333333',
    marginBottom: 6,
    fontFamily: 'Times-Roman',
  },
  detailItemBold: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Times-Bold',
    color: '#000000',
  },
  itemsTable: {
    marginBottom: 30,
  },
  tableBorder: {
    borderWidth: 1,
    borderColor: '#000000',
    borderStyle: 'solid',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    borderBottomStyle: 'solid',
    padding: 12,
  },
  tableHeaderCol: {
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: 'Times-Bold',
    color: '#000000',
  },
  descriptionCol: {
    flex: 3,
  },
  quantityCol: {
    flex: 1,
    textAlign: 'center',
  },
  priceCol: {
    flex: 1,
    textAlign: 'right',
  },
  totalCol: {
    flex: 1,
    textAlign: 'right',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#cccccc',
    borderBottomStyle: 'solid',
    padding: 12,
  },
  tableCol: {
    fontSize: 11,
    color: '#000000',
    fontFamily: 'Times-Roman',
  },
  totalsSection: {
    alignSelf: 'flex-end',
    width: 250,
    borderWidth: 1,
    borderColor: '#000000',
    borderStyle: 'solid',
  },
  totalsHeader: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    borderBottomStyle: 'solid',
  },
  totalsHeaderText: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Times-Bold',
    color: '#000000',
    textAlign: 'center',
  },
  totalsContent: {
    padding: 15,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  totalRowLabel: {
    fontSize: 11,
    color: '#333333',
    fontFamily: 'Times-Roman',
  },
  totalRowValue: {
    fontSize: 11,
    color: '#000000',
    fontFamily: 'Times-Roman',
  },
  totalRowGrand: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#000000',
    borderTopStyle: 'solid',
    paddingTop: 10,
    marginTop: 10,
  },
  totalRowGrandLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: 'Times-Bold',
    color: '#000000',
  },
  totalRowGrandValue: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Times-Bold',
    color: '#000000',
  },
  notesSection: {
    marginTop: 40,
    borderWidth: 1,
    borderColor: '#000000',
    borderStyle: 'solid',
    padding: 15,
  },
  notesHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Times-Bold',
    color: '#000000',
    marginBottom: 8,
    textDecoration: 'underline',
  },
  notesText: {
    fontSize: 11,
    color: '#333333',
    fontFamily: 'Times-Roman',
    lineHeight: 1.4,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 50,
    right: 50,
    fontSize: 9,
    color: '#666666',
    textAlign: 'center',
    fontFamily: 'Times-Roman',
    borderTopWidth: 0.5,
    borderTopColor: '#cccccc',
    borderTopStyle: 'solid',
    paddingTop: 10,
  },
})

interface ProfessionalPDFProps {
  invoice: any
  client: any
  user: any
  items: any[]
}

export function ProfessionalPDF({ invoice, client, user, items }: ProfessionalPDFProps) {
  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: invoice.currency || 'USD',
    }).format(num)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.companyInfo}>
              {user.logoUrl && (
                <Image src={user.logoUrl} style={styles.logo} />
              )}
              <Text style={styles.companyName}>
                {user.businessName || user.name}
              </Text>
              {user.phone && (
                <Text style={styles.companyDetails}>{user.phone}</Text>
              )}
              {user.address && (
                <Text style={styles.companyDetails}>{user.address}</Text>
              )}
              {user.taxId && (
                <Text style={styles.companyDetails}>Tax ID: {user.taxId}</Text>
              )}
            </View>
            <View style={styles.titleSection}>
              <Text style={styles.title}>INVOICE</Text>
              <View style={styles.invoiceInfo}>
                <Text>Invoice No: {invoice.invoiceNumber}</Text>
                <Text>Status: {invoice.status}</Text>
                <Text>Date: {formatDate(invoice.issueDate)}</Text>
                {invoice.dueDate && (
                  <Text>Due Date: {formatDate(invoice.dueDate)}</Text>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Invoice Details */}
        <View style={styles.invoiceDetails}>
          <View style={styles.detailColumn}>
            <Text style={styles.detailTitle}>BILL TO:</Text>
            <Text style={[styles.detailItem, styles.detailItemBold]}>{client.name}</Text>
            {client.company && (
              <Text style={styles.detailItem}>{client.company}</Text>
            )}
            {client.email && (
              <Text style={styles.detailItem}>{client.email}</Text>
            )}
            {client.phone && (
              <Text style={styles.detailItem}>{client.phone}</Text>
            )}
            {client.address && (
              <Text style={styles.detailItem}>{client.address}</Text>
            )}
          </View>
        </View>

        {/* Items Table */}
        <View style={[styles.itemsTable, styles.tableBorder]}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCol, styles.descriptionCol]}>Description</Text>
            <Text style={[styles.tableHeaderCol, styles.quantityCol]}>Quantity</Text>
            <Text style={[styles.tableHeaderCol, styles.priceCol]}>Unit Price</Text>
            <Text style={[styles.tableHeaderCol, styles.totalCol]}>Amount</Text>
          </View>
          {items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCol, styles.descriptionCol]}>{item.description}</Text>
              <Text style={[styles.tableCol, styles.quantityCol]}>{item.quantity}</Text>
              <Text style={[styles.tableCol, styles.priceCol]}>{formatCurrency(item.unitPrice)}</Text>
              <Text style={[styles.tableCol, styles.totalCol]}>{formatCurrency(item.total)}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalsHeader}>
            <Text style={styles.totalsHeaderText}>SUMMARY</Text>
          </View>
          <View style={styles.totalsContent}>
            <View style={styles.totalRow}>
              <Text style={styles.totalRowLabel}>Subtotal:</Text>
              <Text style={styles.totalRowValue}>{formatCurrency(invoice.subtotal)}</Text>
            </View>
            {invoice.taxRate > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalRowLabel}>Tax ({invoice.taxRate}%):</Text>
                <Text style={styles.totalRowValue}>{formatCurrency(invoice.taxAmount)}</Text>
              </View>
            )}
            <View style={styles.totalRowGrand}>
              <Text style={styles.totalRowGrandLabel}>TOTAL AMOUNT:</Text>
              <Text style={styles.totalRowGrandValue}>{formatCurrency(invoice.total)}</Text>
            </View>
          </View>
        </View>

        {/* Notes */}
        {invoice.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesHeader}>NOTES</Text>
            <Text style={styles.notesText}>{invoice.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <Text style={styles.footer}>
          Thank you for your business. Payment terms: Net 30 days.
        </Text>
      </Page>
    </Document>
  )
}