import * as React                                                  from 'react';
import { TicketCategory }                                          from '../../../web_contract_plugins/minter/MinterCategoriesGetter';
import { Card, Col, Progress, Row, Select, Statistic, Typography } from 'antd';
import { FullPageLoader }                                          from '../../loaders/FullPageLoader';
import { I18NProps }                                               from '../../../utils/misc/i18n';
import { theme }                                                   from '../../../utils/theme';

const Countdown = Statistic.Countdown;
const Option = Select.Option;

export interface TicketCategoryStatsProps {
    creation: string;
    categories: TicketCategory[];
    selection: number;
    set_selection: (idx: number) => void;
    t: any;
}

interface TicketCategoryStatsState {
    auto_update: any;
}

type MergedTicketCategoryStatsProps = TicketCategoryStatsProps;

export default class TicketCategoryStats extends React.Component<MergedTicketCategoryStatsProps, TicketCategoryStatsState> {

    state: TicketCategoryStatsState = {
        auto_update: null
    };

    shouldComponentUpdate(nextProps: Readonly<TicketCategoryStatsProps & I18NProps>, nextState: Readonly<TicketCategoryStatsState>, nextContext: any): boolean {
        if (this.props.categories !== null && this.props.categories.length && this.props.creation) {

            const now = Date.now();
            const creation = (new Date(this.props.creation)).getTime();

            let progress = (now - creation) / (this.props.categories[this.props.selection].end.getTime() - creation) * 100;
            if (progress < 0) {
                progress = 100;
            }

            if (progress < 100 && nextState.auto_update === null) {
                this.setState({
                    auto_update: setInterval(() => {
                        this.setState({});
                    }, 1000)
                });
            } else if (progress >= 100 && nextState.auto_update !== null) {
                console.log('clearing interval');
                clearInterval(nextState.auto_update);
                this.setState({
                    auto_update: null
                });
            }
        }

        return true;
    }

    componentWillUnmount(): void {
        if (this.state.auto_update !== null) {
            clearInterval(this.state.auto_update);
        }
    }

    render(): React.ReactNode {
        if (this.props.categories === null || this.props.categories.length === 0 || !this.props.creation) {
            return <Card
                style={{width: '100%', height: '100%'}}
                title={this.props.t('categories_title')}
                size={'small'}
            >
                <FullPageLoader/>;
            </Card>;
        }

        const options = this.props.categories.map((cat: TicketCategory, idx: number): React.ReactNode =>
            <Option key={idx} value={idx}>{cat.name}</Option>);

        const now = Date.now();
        const creation = (new Date(this.props.creation)).getTime();

        let progress = (now - creation) / (this.props.categories[this.props.selection].end.getTime() - creation) * 100;
        if (progress < 0) {
            progress = 100;
        }
        const sale_progress = (this.props.categories[this.props.selection].bought / this.props.categories[this.props.selection].supply) * 100;

        return <Card
            style={{width: '100%', height: '100%'}}
            title={this.props.t('categories_title')}
            size={'small'}
        >
            <div style={{width: '100%', textAlign: 'center'}}>
                <br/>
                <Typography.Text style={{fontSize: 18, color: theme.dark2}}>
                    {this.props.t('select_ticket_category')}
                </Typography.Text>
                <br/>
                <br/>
                <Select
                    defaultValue={this.props.selection}
                    showSearch={true}
                    style={{width: '80%'}}
                    placeholder={this.props.t('select_ticket_category')}
                    optionFilterProp='children'
                    onChange={this.props.set_selection}
                >
                    {options}
                </Select>
            </div>

            <div>
                <br/>
                <br/>
                <div style={{textAlign: 'center'}}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Statistic
                                title={this.props.t('sold_count_stats')}
                                value={this.props.categories[this.props.selection].bought}
                                suffix={`/ ${this.props.categories[this.props.selection].supply}`}
                            />
                        </Col>
                        <Col span={12}>
                            {
                                progress < 100 && sale_progress < 100

                                    ?
                                    <Countdown
                                        title={this.props.t('sale_end_stats')}
                                        value={this.props.categories[this.props.selection].end.getTime()}
                                        format='Dd  HH:mm:ss'
                                    />

                                    :
                                    <Statistic
                                        title={this.props.t('sale_end_stats')}
                                        value={this.props.t(`sale_end_stats_ended_${progress < 100 ? 'sold_out' : 'timeout'}`)}
                                    />
                            }
                        </Col>
                    </Row>
                    <br/>
                    <Row gutter={16} id='sale_stats'>
                        <Col span={12}>
                            <Progress
                                strokeColor={sale_progress >= 100 || progress >= 100 ? theme.dark2 : theme.primary}
                                strokeWidth={9}
                                strokeLinecap='square'
                                percent={parseFloat(sale_progress.toFixed(2))}
                                type={'circle'}
                                status={'active'}
                            />
                        </Col>
                        <Col span={12}>
                            <Progress
                                strokeColor={sale_progress >= 100 || progress >= 100 ? theme.dark2 : theme.primary}
                                strokeWidth={9}
                                strokeLinecap='square'
                                percent={parseFloat(progress.toFixed(2))}
                                showInfo={false}
                                type={'circle'}
                                status={'active'}
                            />
                        </Col>
                        <br/>
                    </Row>
                </div>
            </div>

        </Card>;
    }
}
