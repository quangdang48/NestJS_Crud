export interface WebhookStrategy {
  canHandle(eventType: string): boolean;
  handle(event: any): Promise<void>;
}
