import { HttpException, HttpStatus } from '@nestjs/common';
import { status } from '@grpc/grpc-js';

export function mapGrpcError(e: any): HttpException {
    const code = e?.code;
    const msg = e?.details || e?.message || 'Upstream error';
    console.log(code, msg)
    switch (code) {
        case status.UNAUTHENTICATED:
            return new HttpException(msg, HttpStatus.UNAUTHORIZED);
        case status.PERMISSION_DENIED:
            return new HttpException(msg, HttpStatus.FORBIDDEN);
        case status.INVALID_ARGUMENT:
            return new HttpException(msg, HttpStatus.BAD_REQUEST);
        case status.NOT_FOUND:
            return new HttpException(msg, HttpStatus.NOT_FOUND);
        case status.ALREADY_EXISTS:
            return new HttpException(msg, HttpStatus.CONFLICT);
        case status.DEADLINE_EXCEEDED:
            return new HttpException('Upstream timeout', HttpStatus.GATEWAY_TIMEOUT);
        case status.UNAVAILABLE:
            return new HttpException('Upstream unavailable', HttpStatus.SERVICE_UNAVAILABLE);
        default:
            return new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
}