import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';
import { NationalResponse } from './dto/response/national-response';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NationalService {
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {}
  async getNationalByName(name: string): Promise<NationalResponse> {
    const data = await lastValueFrom(
      this.httpService
        .get<NationalResponse>(
          `${this.configService.get<string>('CHECK_NATIONAL_URL')}/?name=${name}`,
        )
        .pipe(map((response) => response.data)),
    );
    return data;
  }
}
