import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GrpcFilters = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
    const rpc = ctx.switchToRpc();
    const payload = rpc.getData() as any;
    return payload?.filters ?? null;
});