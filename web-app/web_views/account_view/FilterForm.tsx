import { StrapiEvent }        from '@utils/strapi/event';
import * as React             from 'react';
import { Select, Typography } from 'antd';
import { I18N, I18NProps }    from '../../utils/misc/i18n';
import FuzzySearch            from 'fuzzy-search';
import { theme }              from '../../utils/theme';

const Option = Select.Option;

// Props

export interface FilterOptions {
    event: number[];
}

export interface FilterFormProps {
    events: StrapiEvent[];
    options: FilterOptions;
    set_event: (events: number[]) => void;
}

interface FilterFormState {
    search: string;
}

type MergedFilterFormProps = FilterFormProps & I18NProps;

class FilterForm extends React.Component<MergedFilterFormProps, FilterFormState> {

    state: FilterFormState = {
        search: null
    };

    on_event_change = (value: number[]): void => {
        if (value.length === 0) {
            return this.props.set_event(null);
        }
        this.props.set_event(value);
    }

    on_search = (search: string): void => {
        if (!search || search.length === 0) {
            this.setState({
                search: null
            });
        } else {
            this.setState({
                search
            });
        }

    }

    render(): React.ReactNode {
        const event_options = this.props.events

            ? (
                this.state.search !== null
                    ?

                    (new FuzzySearch(this.props.events, ['name'], {
                        sort: true
                    }))
                        .search(this.state.search)
                        .map((event: StrapiEvent, idx: number): React.ReactNode =>
                            <Option key={idx} value={event.id}>
                                <Typography.Text style={{color: theme.dark2}}>{event.name}</Typography.Text>
                                <Typography.Text style={{marginLeft: 12, color: theme.lightgrey}}>#{event.id}</Typography.Text>

                            </Option>)

                    :
                    this.props.events
                        .map((event: StrapiEvent, idx: number): React.ReactNode =>
                            <Option key={idx} value={event.id}>
                                <Typography.Text style={{color: theme.dark2}}>{event.name}</Typography.Text>
                                <Typography.Text style={{marginLeft: 12, color: theme.lightgrey}}>#{event.id}</Typography.Text>
                            </Option>)

            )
            :
            [];

        return <div>
            <div style={{width: '33%'}}>
                <Typography.Text style={{fontSize: 18, color: theme.dark2}}>
                    {this.props.t('list_filter_event_title')}
                </Typography.Text>
                <br/>
                <br/>
                <Select notFoundContent={null} showSearch={true} filterOption={false} onSearch={this.on_search} style={{width: '90%', marginLeft: '5%', float: 'left'}} mode='multiple' onChange={this.on_event_change} value={this.props.options.event ? this.props.options.event : []}>
                    {event_options}
                </Select>
            </div>

        </div>;
    }
}

export default I18N.withNamespaces(['account'])(FilterForm);
