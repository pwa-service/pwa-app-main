import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GrpcPagination = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
    const rpc = ctx.switchToRpc();
    const payload = rpc.getData() as any;
    return payload?.pagination ?? null;
});