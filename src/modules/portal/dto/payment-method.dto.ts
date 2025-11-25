export class PaymentMethodDto {
  id: string;
  type: string;
  brand?: string;
  last4: string;
  expMonth?: number;
  expYear?: number;
  isDefault: boolean;
}

export class PaymentMethodsResponseDto {
  paymentMethods: PaymentMethodDto[];

  static create(paymentMethods: PaymentMethodDto[]): PaymentMethodsResponseDto {
    const dto = new PaymentMethodsResponseDto();
    dto.paymentMethods = paymentMethods;
    return dto;
  }
}
