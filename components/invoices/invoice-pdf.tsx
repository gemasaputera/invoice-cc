import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from '@react-pdf/renderer'
import { SUPPORTED_CURRENCIES } from '@/lib/validations'

// Use system fonts for better compatibility

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: 'Helvetica',
    color: '#333',
  },
  header: {
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    borderBottomStyle: 'solid',
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  logo: {
    maxHeight: 60,
    maxWidth: 200,
    marginBottom: 10,
  },
  titleSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1f2937',
  },
  invoiceInfo: {
    fontSize: 10,
    color: '#6b7280',
  },
  companyInfo: {
    marginBottom: 20,
  },
  clientInfo: {
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#374151',
  },
  table: {
    width: 'auto',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '50%',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    borderBottomStyle: 'solid',
    padding: 10,
    fontWeight: 'bold',
    backgroundColor: '#f9fafb',
  },
  tableCol: {
    width: '50%',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    borderBottomStyle: 'solid',
    padding: 10,
  },
  itemsTable: {
    width: 'auto',
    marginBottom: 20,
  },
  itemsTableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    borderBottomStyle: 'solid',
    paddingBottom: 10,
    marginBottom: 10,
  },
  itemsTableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    borderBottomStyle: 'solid',
    paddingVertical: 10,
  },
  itemsTableCol: {
    paddingHorizontal: 5,
  },
  itemsTableColDescription: {
    flex: 3,
    paddingHorizontal: 5,
  },
  itemsTableColQuantity: {
    flex: 1,
    paddingHorizontal: 5,
    textAlign: 'center',
  },
  itemsTableColPrice: {
    flex: 2,
    paddingHorizontal: 5,
    textAlign: 'right',
  },
  itemsTableColTotal: {
    flex: 2,
    paddingHorizontal: 5,
    textAlign: 'right',
  },
  totals: {
    marginTop: 20,
    textAlign: 'right',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 5,
  },
  totalLabel: {
    width: 120,
    textAlign: 'right',
    paddingRight: 20,
  },
  totalValue: {
    width: 100,
    textAlign: 'right',
  },
  grandTotal: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    borderTopStyle: 'solid',
  },
  grandTotalLabel: {
    width: 120,
    textAlign: 'right',
    paddingRight: 20,
    fontWeight: 'bold',
  },
  grandTotalValue: {
    width: 100,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  notes: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#f9fafb',
    borderRadius: 4,
  },
  notesTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 10,
    color: '#9ca3af',
    textAlign: 'center',
  },
})

interface InvoicePDFProps {
  invoice: any
  client: any
  user: any
  items: any[]
}

export function InvoicePDF({ invoice, client, user, items }: InvoicePDFProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatCurrency = (amount: number) => {
    const currency = invoice.currency || 'IDR'
    const currencyConfig = SUPPORTED_CURRENCIES.find(c => c.value === currency)

    if (!currencyConfig) {
      // Fallback for unsupported currencies
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount)
    }

    // Special formatting for currencies that don't use decimals
    if (['IDR', 'VND', 'JPY'].includes(currencyConfig.value)) {
      const numAmount = Number(amount)
      return `${currencyConfig.symbol}${numAmount.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}`
    }

    // For currencies with standard decimal formatting, use Intl.NumberFormat
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyConfig.value,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(Number(amount))
    } catch {
      // Final fallback - use symbol with basic formatting
      const numAmount = Number(amount)
      return `${currencyConfig.symbol}${numAmount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`
    }
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            {/* Logo Section */}
            {user.logoUrl && (
              <Image
                src={user.logoUrl}
                style={styles.logo}
              />
            )}

            {/* Title and Invoice Info Section */}
            <View style={styles.titleSection}>
              <Text style={styles.title}>INVOICE</Text>
              <View style={styles.invoiceInfo}>
                <Text>Invoice #: {invoice.invoiceNumber}</Text>
                <Text>Status: {invoice.status}</Text>
                <Text>Issue Date: {formatDate(invoice.issueDate)}</Text>
                {invoice.dueDate && (
                  <Text>Due Date: {formatDate(invoice.dueDate)}</Text>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Company and Client Info */}
        <View style={{ flexDirection: 'row', marginBottom: 30 }}>
          <View style={{ flex: 1, marginRight: 20 }}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>From</Text>
              <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>
                {user.businessName || user.name}
              </Text>
              <Text>{user.email}</Text>
              {user.phone && <Text>{user.phone}</Text>}
              {user.address && <Text>{user.address}</Text>}
              {user.taxId && <Text>Tax ID: {user.taxId}</Text>}
            </View>
          </View>

          <View style={{ flex: 1 }}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Bill To</Text>
              <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>
                {client.name}
              </Text>
              {client.company && <Text>{client.company}</Text>}
              {client.email && <Text>{client.email}</Text>}
              {client.phone && <Text>{client.phone}</Text>}
              {client.address && <Text>{client.address}</Text>}
            </View>
          </View>
        </View>

        {/* Invoice Items Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Items</Text>
          <View style={styles.itemsTable}>
            {/* Table Header */}
            <View style={styles.itemsTableHeader}>
              <Text style={styles.itemsTableColDescription}>Description</Text>
              <Text style={styles.itemsTableColQuantity}>Qty</Text>
              <Text style={styles.itemsTableColPrice}>Price</Text>
              <Text style={styles.itemsTableColTotal}>Total</Text>
            </View>

            {/* Table Rows */}
            {items.map((item, index) => (
              <View key={index} style={styles.itemsTableRow}>
                <Text style={styles.itemsTableColDescription}>{item.description}</Text>
                <Text style={styles.itemsTableColQuantity}>{item.quantity}</Text>
                <Text style={styles.itemsTableColPrice}>
                  {formatCurrency(Number(item.unitPrice))}
                </Text>
                <Text style={styles.itemsTableColTotal}>
                  {formatCurrency(item.total)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Totals */}
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>{formatCurrency(invoice.subtotal)}</Text>
          </View>
          {invoice.taxAmount > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                Tax ({invoice.taxRate}%):
              </Text>
              <Text style={styles.totalValue}>
                {formatCurrency(invoice.taxAmount)}
              </Text>
            </View>
          )}
          <View style={styles.grandTotal}>
            <Text style={styles.grandTotalLabel}>Total:</Text>
            <Text style={styles.grandTotalValue}>
              {formatCurrency(invoice.total)}
            </Text>
          </View>
        </View>

        {/* Notes */}
        {invoice.notes && (
          <View style={styles.notes}>
            <Text style={styles.notesTitle}>Notes:</Text>
            <Text>{invoice.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <Text style={styles.footer}>
          Thank you for your business!
        </Text>
      </Page>
    </Document>
  )
}