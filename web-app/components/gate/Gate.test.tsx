import * as React     from 'react';
import * as enzyme    from 'enzyme';
import Gate           from './Gate';
import { createPath } from './Path';

describe('Testing [Gate]', (): void => {

    test('Should render child', (): void => {

        const Path_a = createPath('a');
        const Path_b = createPath('b');
        const Path_c = createPath('c');
        const Path_d = createPath('d');

        const scene = enzyme.shallow(<Gate status={0} statuses={['a', 'b', 'c', 'd']}>
            <Path_a>
                <p>Ok</p>
            </Path_a>
            <Path_b>
                <p>Nope b</p>
            </Path_b>
            <Path_c>
                <p>Nope c</p>
            </Path_c>
            <Path_d>
                <p>Nope d</p>
            </Path_d>
        </Gate>);

        expect(scene.containsMatchingElement(<p>Ok</p>)).toBeTruthy();
        expect(scene.containsMatchingElement(<p>Nope b</p>)).toBeFalsy();
        expect(scene.containsMatchingElement(<p>Nope c</p>)).toBeFalsy();
        expect(scene.containsMatchingElement(<p>Nope b</p>)).toBeFalsy();

    });

    test('Should throw on missing path', (): void => {

        const Path_a = createPath('a');
        const Path_b = createPath('b');
        const Path_c = createPath('c');

        expect((): any => {
            enzyme.shallow(<Gate status={0} statuses={['a', 'b', 'c', 'd']}>
                <Path_a>
                    <p>Ok</p>
                </Path_a>
                <Path_b>
                    <p>Nope b</p>
                </Path_b>
                <Path_c>
                    <p>Nope c</p>
                </Path_c>
            </Gate>);
        }).toThrow();

    });

});
