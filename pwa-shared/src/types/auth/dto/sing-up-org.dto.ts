import {IsEnum} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";
import {SignUpDto} from "./sing-up.dto";
import {ScopeType} from "../../org/roles/enums/scope.enum";

export class SignUpOrgDto extends SignUpDto {
    @ApiProperty({ enum: ScopeType, description: 'Scope level for the member' })
    @IsEnum(ScopeType)
    scope: ScopeType;
}
