import { KeysPipe } from './keys.pipe';
import { SafePipe } from './safe.pipe';
import { PadPipe } from './pad.pipe';

export * from './keys.pipe';
export * from './safe.pipe';
export * from './pad.pipe';

export const pipes = [KeysPipe, SafePipe, PadPipe];
