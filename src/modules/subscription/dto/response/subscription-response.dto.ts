export class CurrentSubscriptionResponse {
  id: string;
  method: 'charge_automatically' | 'send_invoice';
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  unitAmount: number;
  currency: string;

  static fromEntity(stripeSubscription: any): CurrentSubscriptionResponse {
    if (!stripeSubscription.data?.length) {
      throw new Error('Stripe subscription has no items');
    }

    const item = stripeSubscription.data[0];

    const formatDate = (timestamp: number) => {
      const d = new Date(timestamp * 1000);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    };

    const response = new CurrentSubscriptionResponse();
    response.id = stripeSubscription.id;
    response.method = stripeSubscription.collection_method;
    response.startDate = formatDate(item.current_period_start);
    response.endDate = formatDate(item.current_period_end);
    response.unitAmount = item.price.unit_amount;
    response.currency = item.price.currency;

    return response;
  }
}
