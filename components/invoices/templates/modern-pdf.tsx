/* eslint-disable @next/next/no-img-element */
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer'

import { InvoicePDFProps } from '@/lib/pdf-types'

// Modern template styles with rounded corners and modern colors
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: 'Helvetica',
    color: '#1f2937',
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 30,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  logo: {
    maxHeight: 60,
    maxWidth: 200,
    marginBottom: 10,
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  companyDetails: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 2,
  },
  titleSection: {
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 5,
  },
  invoiceInfo: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'right',
  },
  invoiceDetails: {
    flexDirection: 'row',
    marginBottom: 30,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 15,
  },
  detailColumn: {
    flex: 1,
  },
  detailTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  detailItem: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 4,
  },
  detailItemBold: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  itemsTable: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#3b82f6',
    borderBottomStyle: 'solid',
    paddingBottom: 10,
    marginBottom: 10,
  },
  tableHeaderCol: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1f2937',
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
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    borderBottomStyle: 'solid',
    paddingVertical: 8,
  },
  tableCol: {
    fontSize: 10,
    color: '#374151',
  },
  totalsSection: {
    alignSelf: 'flex-end',
    width: 200,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 15,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalRowLabel: {
    fontSize: 10,
    color: '#6b7280',
  },
  totalRowValue: {
    fontSize: 10,
    color: '#374151',
  },
  totalRowGrand: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#3b82f6',
    borderTopStyle: 'solid',
    paddingTop: 8,
    marginTop: 8,
  },
  totalRowGrandLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  totalRowGrandValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  notesSection: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#f59e0b',
  },
  notesTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 5,
  },
  notesText: {
    fontSize: 10,
    color: '#78350f',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 8,
    color: '#9ca3af',
    textAlign: 'center',
  },
})

export function ModernPDF({ invoice, client, user, items }: InvoicePDFProps) {
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
                <Text>Invoice #: {invoice.invoiceNumber}</Text>
                <Text>Status: {invoice.status}</Text>
                <Text>Date: {formatDate(invoice.issueDate as string)}</Text>
                {invoice.dueDate && (
                  <Text>Due: {formatDate(invoice.dueDate as string)}</Text>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Invoice Details */}
        <View style={styles.invoiceDetails}>
          <View style={styles.detailColumn}>
            <Text style={styles.detailTitle}>Bill To:</Text>
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
        <View style={styles.itemsTable}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCol, styles.descriptionCol]}>Description</Text>
            <Text style={[styles.tableHeaderCol, styles.quantityCol]}>Qty</Text>
            <Text style={[styles.tableHeaderCol, styles.priceCol]}>Price</Text>
            <Text style={[styles.tableHeaderCol, styles.totalCol]}>Total</Text>
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
          <View style={styles.totalRow}>
            <Text style={styles.totalRowLabel}>Subtotal:</Text>
            <Text style={styles.totalRowValue}>{formatCurrency(invoice.subtotal)}</Text>
          </View>
          {invoice.taxRate > 0 && (
            <>
              <View style={styles.totalRow}>
                <Text style={styles.totalRowLabel}>Tax ({invoice.taxRate}%):</Text>
                <Text style={styles.totalRowValue}>{formatCurrency(invoice.taxAmount)}</Text>
              </View>
            </>
          )}
          <View style={styles.totalRowGrand}>
            <Text style={styles.totalRowGrandLabel}>Total:</Text>
            <Text style={styles.totalRowGrandValue}>{formatCurrency(invoice.total)}</Text>
          </View>
        </View>

        {/* Notes */}
        {invoice.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesTitle}>Notes</Text>
            <Text style={styles.notesText}>{invoice.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <Text style={styles.footer}>
          Thank you for your business! | Invoice generated on {new Date().toLocaleDateString()}
        </Text>
      </Page>
    </Document>
  )
}