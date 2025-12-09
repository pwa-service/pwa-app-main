import {ApiProperty} from "@nestjs/swagger";
import {IsOptional, IsString} from "class-validator";
import {BaseEventDto} from "./base-event.dto";

export class EventSessionDto extends BaseEventDto {
    @ApiProperty()
    @IsOptional()
    @IsString()
    sessionId!: string;
}