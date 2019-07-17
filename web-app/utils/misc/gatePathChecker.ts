import * as React                from 'react';
import { isArray }               from 'lodash';

export interface OrganizedPaths {
    [key: string]: React.ReactElement;
}

/**
 * Checks if all paths in the gate are persent
 *
 * @param children
 * @param required
 */
export const gatePathChecker = (children: React.ReactChild | React.ReactChild[], required: string[]): OrganizedPaths => {
    if (required.length === 1) {
        throw new Error('Only one path is required. The goal of the gate is to switch to approriate path depending on a state variable. If you only have one path, there is no point in using a gate');
    }

    if (!isArray(children)) {
        throw new Error('Provided Path children is a single element and not an array');
    }

    const checked_children: React.ReactElement[] = children as React.ReactElement[];

    let checked_count: number = 0;
    const checked_map: any = {};
    const ret: OrganizedPaths = {};

    for (const child of checked_children) {

        const name = (child.type as any).displayName;

        if (!name) {
            continue ;
        }

        if (required.indexOf(name) !== -1) {
            if (!checked_map[name]) {
                checked_map[name] = true;
                ++checked_count;
                ret[name] = child;
            } else {
                throw new Error(`Duplicate Path ${name} ! Requires only ONE of each following path types: ${required}`);
            }
        }
    }

    if (checked_count !== required.length) {
        throw new Error(`Missing paths in gate: Given => ${Object.keys(checked_map)} Required => ${required}`);
    }

    return ret;
};
