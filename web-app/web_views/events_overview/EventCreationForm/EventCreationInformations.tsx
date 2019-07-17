import * as React                    from 'react';
import { Divider, Typography }       from 'antd';
import { EventCreationTabBaseProps } from './EventCreationData';
import EventCreationNameDesc from './EventCreationNameDesc';
import { I18N, I18NProps }   from '@utils/misc/i18n';
import EventCreationBanners  from './EventCreationBanners';
import { ReactReduxContext } from 'react-redux';
import { Store }             from 'redux';
import EventCreationImage    from './EventCreationImage';
import EventCreationLocation from './EventCreationLocation';
import EventCreationDates    from './EventCreationDates';
import { theme }             from '../../../utils/theme';
import { RGA }               from '../../../utils/misc/ga';

// Props

interface EventCreationInformationsOwnProps {

}

export type EventCreationInformationsProps = EventCreationInformationsOwnProps & EventCreationTabBaseProps;

type MergedEventCreationInformationsProps = EventCreationInformationsProps & I18NProps;

class EventCreationInformations extends React.Component<MergedEventCreationInformationsProps> {

    componentDidMount(): void {
        RGA.pageview(window.location.pathname + '/create/informations');
    }

    render(): React.ReactNode {
        return <div>
            <ReactReduxContext.Consumer>
                {({ store }: {store: Store; }): React.ReactNode =>
                    <div>
                        <Typography.Text style={{fontSize: 42, color: theme.primary}}>
                            {this.props.t('namedesc_title')}
                        </Typography.Text>
                        <EventCreationNameDesc
                            form_data={this.props.form_data}
                            set_data={this.props.set_data}
                            t={this.props.t}
                        />
                        <br/>
                        <Divider/>
                        <Typography.Text style={{fontSize: 42, color: theme.primary}}>
                            {this.props.t('location_dates_title')}
                        </Typography.Text>
                        <EventCreationLocation
                            set_data={this.props.set_data}
                            form_data={this.props.form_data}
                            t={this.props.t}
                        />
                        <EventCreationDates
                            form_data={this.props.form_data}
                            set_data={this.props.set_data}
                            t={this.props.t}
                        />
                        <br/>
                        <Divider/>
                        <Typography.Text style={{fontSize: 42, color: theme.primary}}>
                            {this.props.t('images_title')}
                        </Typography.Text>
                        <EventCreationBanners form_data={this.props.form_data} set_data={this.props.set_data} t={this.props.t} store={store} />
                        <EventCreationImage form_data={this.props.form_data} set_data={this.props.set_data} t={this.props.t} store={store} />
                    </div>}
            </ReactReduxContext.Consumer>
        </div>;
    }
}

export default I18N.withNamespaces(['event_creation'])(EventCreationInformations);
