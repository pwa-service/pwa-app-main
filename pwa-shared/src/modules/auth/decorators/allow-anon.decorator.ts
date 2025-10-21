import { SetMetadata } from '@nestjs/common';
export const ALLOW_ANON = 'ALLOW_ANON';
export const AllowAnonymous = () => SetMetadata(ALLOW_ANON, true);