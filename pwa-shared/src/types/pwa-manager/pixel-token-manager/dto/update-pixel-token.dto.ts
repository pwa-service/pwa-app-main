import {CreatePixelTokenDto} from "./create-pixel-token.dto";
import {OmitType, PartialType} from "@nestjs/swagger";

export class UpdatePixelTokenDto extends PartialType(
    OmitType(CreatePixelTokenDto, ['ownerId'] as const),
) {
    id?: string;
}