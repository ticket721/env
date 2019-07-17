import * as React                   from 'react';
import { AppState }                 from '@utils/redux/app_state';
import { Dispatch }                 from 'redux';
import { connect }                  from 'react-redux';
import { StrapiCallFn, StrapiData } from '@utils/StrapiHelper';
import * as _ from 'lodash-core';

export interface StrapiCascadeCall {
    requires: string;
    converter: (arg: any) => any;
    call: (opt: any) => StrapiCallFn;
}

export interface StrapiCallProps {
    calls: {[key: string]: (StrapiCallFn | StrapiCascadeCall)};
    static?: string[];
    always_refresh?: boolean;
}

interface StrapiCallRState {
    state: AppState;
}

interface StrapiCallRDispatch {
    dispatch: Dispatch;
}

type MergedStrapiCallProps = StrapiCallProps & StrapiCallRState & StrapiCallRDispatch;

/**
 * This component was made to be used with a function as children component
 *
 * ```
 *  <StrapiCall
 *
 *      calls={{
 *          ten_tickets: StrapiHelper.getEntries('tickets', {_limit: 10, _sort: 'id'}),
 *          one_ticket : StrapiHelper.getEntry('tickets', '1'),
 *          ticket_count: StrapiHelper.getEntryCount('tickets')
 *       }}
 *
 *  >
 *      {({ten_tickets, one_ticket, ticket_count}: any): React.ReactNode => {
 *              // Do what you want here
 *      }}
 *  </StrapiCall>
 * ```
 *
 */
class StrapiCall extends React.Component<MergedStrapiCallProps> {

    call_result: {[key: string]: StrapiData} = {};
    render_result: {[key: string]: any[]} = {};

    constructor(props: MergedStrapiCallProps) {
        super(props);

        const calls: string[] = Object.keys(this.props.calls);
        let resolved = false;

        while (!resolved) {
            const start_size = calls.length;
            let rm: number[] = [];

            for (let idx = 0; idx < calls.length; ++idx) {
                if (typeof this.props.calls[calls[idx]] === 'function') {

                    const strapi_fn: StrapiCallFn = this.props.calls[calls[idx]] as StrapiCallFn;

                    this.call_result[calls[idx]] = strapi_fn(this.props.state, this.props.dispatch, this.props.static && this.props.static.indexOf(calls[idx]) !== -1);
                    this.render_result[calls[idx]] = this.call_result[calls[idx]][2];
                    rm.push(idx);

                } else if (
                    (this.props.calls[calls[idx]] as StrapiCascadeCall).call
                    && (this.props.calls[calls[idx]] as StrapiCascadeCall).converter
                    && (this.props.calls[calls[idx]] as StrapiCascadeCall).requires
                ) {
                    const strapi_cascade: StrapiCascadeCall = this.props.calls[calls[idx]] as StrapiCascadeCall;

                    if (this.render_result[strapi_cascade.requires] && calls.indexOf(strapi_cascade.requires) === -1) {
                        const data: any[] = this.render_result[strapi_cascade.requires];
                        const converted_options: any = strapi_cascade.converter(data);
                        if (converted_options !== null) {
                            const generate_call: StrapiCallFn = strapi_cascade.call(converted_options);

                            this.call_result[calls[idx]] = generate_call(this.props.state, this.props.dispatch, this.props.static && this.props.static.indexOf(calls[idx]) !== -1);
                            this.render_result[calls[idx]] = this.call_result[calls[idx]][2];
                            rm.push(idx);
                        }

                    }
                }
            }

            rm = rm.sort((l: number, r: number) => r - l);

            for (const rm_idx of rm) {
                calls.splice(rm_idx, 1);
            }

            if (calls.length === 0 || start_size === calls.length) {
                resolved = true;
            }
        }

    }

    changed(old: StrapiData, data: StrapiData): boolean {
        if (old === undefined) return true;
        if (old[2] !== undefined && data[2] === undefined) return true;
        if (data[0] === 0) return false;
        if (this.props.always_refresh) return true;
        if (data[0] < old[0]) return true;
        if (data[0] > old[0]) return true;
        return !_.isEqual(data[1], old[1]);

    }

    shouldComponentUpdate(nextProps: Readonly<MergedStrapiCallProps>): boolean {

        let render: boolean = false;
        const calls: string[] = Object.keys(nextProps.calls);
        let resolved = false;

        while (!resolved) {
            const start_size = calls.length;
            let rm: number[] = [];

            for (let idx = 0; idx < calls.length; ++idx) {
                if (typeof nextProps.calls[calls[idx]] === 'function') {

                    const strapi_fn: StrapiCallFn = nextProps.calls[calls[idx]] as StrapiCallFn;

                    // If static, stops fetching after first fetch
                    if (this.props.static && this.props.static.indexOf(calls[idx]) !== -1 && this.render_result[calls[idx]]) {
                       rm.push(idx);
                       continue ;
                    }

                    const fresh: StrapiData = strapi_fn(nextProps.state, nextProps.dispatch, this.props.static && this.props.static.indexOf(calls[idx]) !== -1);

                    if (this.changed(this.call_result[calls[idx]], fresh)) {

                        this.call_result[calls[idx]] = fresh;
                        this.render_result[calls[idx]] = this.call_result[calls[idx]][2];
                        render = true;
                    }

                    rm.push(idx);

                } else if (
                    (nextProps.calls[calls[idx]] as StrapiCascadeCall).call
                    && (nextProps.calls[calls[idx]] as StrapiCascadeCall).converter
                    && (nextProps.calls[calls[idx]] as StrapiCascadeCall).requires
                ) {
                    const strapi_cascade: StrapiCascadeCall = nextProps.calls[calls[idx]] as StrapiCascadeCall;

                    if (this.render_result[strapi_cascade.requires] && calls.indexOf(strapi_cascade.requires) === -1) {
                        const data: any[] = this.render_result[strapi_cascade.requires];
                        const converted_options: any = strapi_cascade.converter(data);
                        if (converted_options !== null) {
                            const generate_call: StrapiCallFn = strapi_cascade.call(converted_options);

                            // If static, stops fetching after first fetch
                            if (this.props.static && this.props.static.indexOf(calls[idx]) !== -1 && this.render_result[calls[idx]]) {
                                rm.push(idx);
                                continue ;
                            }

                            const fresh: StrapiData = generate_call(nextProps.state, nextProps.dispatch, this.props.static && this.props.static.indexOf(calls[idx]) !== -1);

                            if (this.changed(this.call_result[calls[idx]], fresh)) {

                                this.call_result[calls[idx]] = fresh;
                                this.render_result[calls[idx]] = this.call_result[calls[idx]][2];
                                render = true;
                            }

                            rm.push(idx);
                        }

                    }
                }
            }

            rm = rm.sort((l: number, r: number) => r - l);

            for (const rm_idx of rm) {
                calls.splice(rm_idx, 1);
            }

            if (calls.length === 0 || start_size === calls.length) {
                resolved = true;
            }
        }

        return render;

    }

    render(): React.ReactNode {

        if (typeof this.props.children !== 'function') {
            throw new Error('Children of StrapiCall should be a function');
        }

        return this.props.children(this.render_result);

    }
}

const mapStateToProps = (state: AppState): StrapiCallRState => ({
    state
});

const mapDispatchToProps = (dispatch: Dispatch): StrapiCallRDispatch => ({
    dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(StrapiCall) as React.ComponentClass<StrapiCallProps>;
