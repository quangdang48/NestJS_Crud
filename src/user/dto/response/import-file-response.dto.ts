export class ImportUserResponseDto {
  message: string;
  imported: string[];
  failed: FailedImport[];
}
export class FailedImport {
  row: number;
  descriptions: ReasonFailed[];
}
export class ReasonFailed {
  property: string;
  reason: string[];
}
