export class InvoiceDto {
  id: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: Date;
  dueDate?: Date;
  pdfUrl?: string;

  static fromEntity(invoice: any): InvoiceDto {
    const dto = new InvoiceDto();
    dto.id = invoice.id;
    dto.invoiceNumber = invoice.number;
    dto.amount = invoice.amount_paid ? invoice.amount_paid / 100 : 0;
    dto.currency = invoice.currency?.toUpperCase();
    dto.status = invoice.status;
    dto.createdAt = new Date(invoice.created * 1000);
    dto.dueDate = invoice.due_date ? new Date(invoice.due_date * 1000) : null;
    dto.pdfUrl = invoice.invoice_pdf;
    return dto;
  }
}
