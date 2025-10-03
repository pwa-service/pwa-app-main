import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class SignUpDto {
    @IsEmail({}, { message: 'Email must be valid' })
    email: string;

    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;

    @IsOptional()
    @IsString()
    name?: string;
}
