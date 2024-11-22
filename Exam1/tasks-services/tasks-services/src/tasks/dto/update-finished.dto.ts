import { IsBoolean } from 'class-validator';

export class UpdateFinishedDto {
  @IsBoolean()
  finished!: boolean;
}
