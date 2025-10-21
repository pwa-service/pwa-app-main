import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GrpcUser = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
    const rpc = ctx.switchToRpc();
    const payload = rpc.getData() as any;
    return payload?.user ?? null;
});