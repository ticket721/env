import { canUseDOM } from 'exenv';

export function onClient(fn: (..._args: any[]) => any): (..._args: any[]) => any {
    if (canUseDOM) {
        return fn;
    }

    if (process.env.NODE_ENV === 'development') {
        console.log(`Called ${fn.name} on client side only`);
    }

    return (): void => {};
}
