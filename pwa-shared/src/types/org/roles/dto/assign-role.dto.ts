import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class AssignRoleDto {
    @IsString()
    @IsUUID('4', { message: 'userId must be a valid UUID' })
    @IsNotEmpty()
    userId: string;

    @IsNumber({}, { message: 'roleId must be a number' })
    @IsNotEmpty()
    roleId: number;
}