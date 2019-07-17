import * as React                     from 'react';
import { Card, Carousel, Typography } from 'antd';
import Countdown                      from 'antd/lib/statistic/Countdown';
import { StrapiTicket }               from '../../utils/strapi/ticket';
import currencies                     from '@utils/currencies';
import { I18N, I18NProps }            from '../../utils/misc/i18n';
import { theme }                      from '../../utils/theme';

export interface PriceWidgetProps {
    ticket: StrapiTicket;
}

type MergedPriceWidgetProps = PriceWidgetProps & I18NProps;

const HOUR = 60 * 60 * 1000;
const DAY = HOUR * 24;

class PriceWidget extends React.Component<MergedPriceWidgetProps> {

    gen_carousel_elements = (): React.ReactNode[] =>
        this.props.ticket.current_sale.prices.map((price: any, idx: number): React.ReactNode =>
            <div style={{textAlign: 'center'}} key={idx}>
                {currencies[price.currency].symbol({fontSize: 36, color: theme.white, textShadow: `0px 0px 6px ${theme.gold}`})}
                <br/>
                <Typography.Text style={{fontSize: 36, color: theme.white}}>{currencies[price.currency].toFixed(price.value)}</Typography.Text>
            </div>)

    render(): React.ReactNode {

        const end =  (new Date(this.props.ticket.current_sale.end)).getTime();
        const left = end - Date.now();
        const carousel_elements = this.gen_carousel_elements();

        return <div>
            <Card id={'info_card'} style={{marginLeft: 12, height: 194, width: 150, backgroundColor: theme.dark2, borderRadius: 6, borderColor: theme.dark2, boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)'}}>
                <style>{`
                    #info_card .ant-statistic-title {
                        color: ${theme.white};
                    }
                    
                    #info_card .ant-statistic-content {
                        color: ${theme.white};
                    }
                `}</style>
                {left > 0

                    ?
                    <Countdown style={{marginTop: 12, color: theme.white, fontWeight: 100, fontFamily: 'Roboto', fontSize: 18}} value={end} format={left > DAY ? 'Dd HH:mm' : 'HH:mm:ss'}/>

                    :
                    <div style={{marginTop: 12}}>
                        <Typography.Text style={{marginTop: 12, color: theme.white, fontSize: 24, fontWeight: 300}}>{this.props.t('price_widget_sale_ended')}</Typography.Text>
                    </div>
                }
                <style>{`
                   #carou .ant-carousel .slick-slide {
                       text-align: center;
                       background: ${theme.dark3};
                       overflow: hidden;
                       margin-bottom: 24px;
                   }
                   
                   #carou .ant-carousel .slick-slide h3 {
                       color: ${theme.white};
                   }
                `}</style>
                <div id={'carou'} style={{marginTop: 12}}>
                    <Carousel autoplay={true}>
                        {carousel_elements}
                    </Carousel>
                </div>
            </Card>
        </div>;
    }
}

export default I18N.withNamespaces(['marketplace'])(PriceWidget) as React.ComponentType<PriceWidgetProps>;
