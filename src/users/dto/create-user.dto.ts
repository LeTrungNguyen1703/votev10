import { IsString, IsNotEmpty, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export interface CreateUserDto {
  name: string;


  surname: string;

  age: number;
}
