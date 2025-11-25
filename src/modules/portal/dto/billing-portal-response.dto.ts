export class BillingPortalResponse {
  url: string;

  static create(url: string): BillingPortalResponse {
    const dto = new BillingPortalResponse();
    dto.url = url;
    return dto;
  }
}
