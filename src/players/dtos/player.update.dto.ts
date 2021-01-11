import { IsNotEmpty } from 'class-validator';

export class PlayerUpdateDto {
  @IsNotEmpty()
  readonly phoneNumber: string;

  @IsNotEmpty()
  readonly name: string;
}
