import { canUseDOM } from 'exenv';

export function onServer(fn: (..._args: any[]) => any): (..._args: any[]) => any {
    if (!canUseDOM) {
        return fn;
    }

    if (process.env.NODE_ENV === 'development') {
        console.log(`Called ${fn.name} on server side only`);
    }

    return (..._: any[]): void => {};
}
