import {ApiProperty} from "@nestjs/swagger";
import {EventSessionDto} from "./event-session.dto";

export class PurchaseDto extends EventSessionDto {
    @ApiProperty() value!: number;
    @ApiProperty() currency!: string;
}