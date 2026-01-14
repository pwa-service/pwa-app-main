import {CreatePixelTokenDto} from "./create-pixel-token.dto";
import {PartialType} from "@nestjs/swagger";

export class UpdatePixelTokenDto extends PartialType(CreatePixelTokenDto) {}