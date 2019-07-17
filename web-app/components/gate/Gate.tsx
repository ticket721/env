import * as React                          from 'react';
import { gatePathChecker, OrganizedPaths } from '@utils/misc/gatePathChecker';

export interface GateProps {
    status: number;
    statuses: string[];
}

export interface GateState {
    paths: OrganizedPaths;
}

/**
 * Used to render its children only when a specific value is `status` is met
 */
export default class Gate extends React.Component<GateProps, GateState> {

    constructor(props: GateProps) {
        super(props);

        this.state = {
            paths: gatePathChecker(this.props.children as React.ReactChild[], this.props.statuses!)
        };
    }

    render(): React.ReactNode {

        if (!this.state.paths[this.props.statuses![this.props.status]]) {
            throw new Error(`Invalid status value ${this.props.status}. Cannot resolve to child`);
        }
        return (this.state.paths[this.props.statuses![this.props.status]]);

    }
}
