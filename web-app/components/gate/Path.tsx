import * as React from 'react';
import { FullDiv }  from '../html/FullDiv';

export interface AppPathProps {}

/**
 * Generates a path with the given name, the result can then be used inside the Gate
 *
 * @param name
 */
export const createPath = (name: string): React.FunctionComponent<AppPathProps> => {
    const path: React.FunctionComponent<AppPathProps> = ({children}: {children: React.ReactChild}): React.ReactElement =>
        (<FullDiv>
            {children}
        </FullDiv>);

    path.displayName = name;

    return path;
};
