import * as React                                                       from 'react';
import { TicketCategory }                                               from '../../../web_contract_plugins/minter/MinterCategoriesGetter';
import { Carousel, Col, Divider, Progress, Row, Statistic, Typography } from 'antd';
import { I18N, I18NProps }                                              from '../../../utils/misc/i18n';
const Countdown = Statistic.Countdown;
import currencies                                                       from '@utils/currencies';
import { theme }                                                        from '../../../utils/theme';
import EventCardProgress                                                from './EventCardProgress';

export interface EventCardStatsCarouselProps {
    categories: TicketCategory[];
    creation: string;
}

type MergedEventCardStatsCarouselProps = EventCardStatsCarouselProps & I18NProps;

class EventCardStatsCarousel extends React.Component<MergedEventCardStatsCarouselProps> {

    gen_stats = (): React.ReactNode[] =>

        this.props.categories.map((category: TicketCategory, idx: number): React.ReactNode => {
            const now = Date.now();
            const creation = (new Date(this.props.creation)).getTime();

            let progress = (now - creation) / (category.end.getTime() - creation) * 100;
            if (progress < 0) {
                progress = 100;
            }
            const sale_progress = (category.bought / category.supply) * 100;

            return <div key={idx}>
                <Row gutter={16}>
                    <Col span={8}>
                        <Statistic
                            title={this.props.t('sold_count_stats')}
                            value={category.bought}
                            suffix={`/ ${category.supply}`}
                        />
                    </Col>
                    <Col span={8} style={{textAlign: 'center'}}>
                        <Typography.Text style={{fontSize: 25, color: theme.primary}}>{category.name} <span style={{fontSize: 21, color: theme.white}}>{this.props.t('event_card_category')}</span></Typography.Text>
                        <br/>
                        <Typography.Text style={{fontSize: 22, color: theme.white}}>{currencies['ether'].toFixed(category.price.ether)}</Typography.Text> {currencies['ether'].symbol({fontSize: 22, color: theme.white})}

                    </Col>
                    <Col span={8}>
                        {
                            progress < 100 && sale_progress < 100

                                ?
                                <Countdown
                                    title={this.props.t('sale_end_stats')}
                                    value={category.end.getTime()}
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
                <Row>
                    <Col span={24}>
                        {
                            progress < 100 && sale_progress < 100

                                ?
                                <EventCardProgress progress={parseFloat(progress.toFixed(2))}/>

                                :
                                null
                        }
                    </Col>
                    <br/>
                </Row>
            </div>;
        })

    render(): React.ReactNode {
        if (this.props.categories && this.props.categories.length) {

            const stats = this.gen_stats();

            return <div id={'event_stats_carousel'}>
                <style>{`
                    #event_stats_carousel .ant-carousel .slick-slide {
                        text-align: center;
                        height: 104px;
                        overflow: hidden;
                        border-top-right-radius: 6px;
                        border-top-left-radius: 6px;
                    } 
                    
                    #event_stats_carousel .ant-carousel .slick-slide h3 {
                        color: ${theme.white};
                    }
                    
                    #event_stats_carousel .ant-progress-inner {
                        border-radius: 0px;
                        background-color: ${theme.dark3};
                    }
                    
                    #event_stats_carousel .ant-statistic-title {
                        color: ${theme.white};
                    }
                    
                    #event_stats_carousel .ant-statistic-content {
                        color: ${theme.white};
                    }
                    
                `}</style>
                <Divider
                    style={{
                        width: '60%',
                        minWidth: '60%',
                        marginLeft: '20%',
                        backgroundColor: theme.dark7,
                        marginBottom: 24,
                        marginTop: 0
                    }}
                />
                <Carousel
                    autoplaySpeed={10000}
                    autoplay={true}
                >
                    {stats}
                </Carousel>
            </div>;
        } else {
            return <div id={'event_stats_carousel'}>
                <Divider
                    style={{
                        width: '60%',
                        minWidth: '60%',
                        marginLeft: '20%',
                        backgroundColor: theme.dark7,
                        marginBottom: 24,
                        marginTop: 0
                    }}
                />
                <div style={{height: 104}}/>
            </div>;
        }
    }
}

export default I18N.withNamespaces(['events'])(EventCardStatsCarousel);
