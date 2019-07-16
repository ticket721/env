import * as React           from 'react';
import { Card, Icon, Spin } from 'antd';
import { theme }            from '../../utils/theme';

const antIcon = <Icon type='loading' style={{fontSize: 64, color: theme.dark7}} spin={true}/>;

export default class LoadingTicket extends React.Component {
    render(): React.ReactNode {
        return <div
            id='loading_ticket'
        >
            <style>{`
            #loading_ticket .ant-card-body {
                padding: 12px;
            }
            `}</style>
            <Card
                style={{
                    height: 194,
                    width: 500,
                    background: `linear-gradient(to right, ${theme.primarydark0}, ${theme.dark2})`,
                    border: '0px',
                    borderTopLeftRadius: 6,
                    borderBottomLeftRadius: 6,
                    borderBottomRightRadius: 18,
                    borderTopRightRadius: 6,
                    boxShadow: '0 9px 19px rgba(0,0,0,0.30)'
                }}
                hoverable={true}
            >
                <style>{`
                    #loading_ticket_body .ant-card {
                        background-color: ${theme.dark4};
                        border: none; 
                    }
                `}</style>
                <div
                    id={`loading_ticket_body`}
                    style={{
                        float: 'left'
                    }}
                >
                    <Card
                        style={{
                            height: 170,
                            width: 170,
                            borderRadius: 6,
                            padding: 15
                        }}
                    />
                </div>
                <div id='crans' style={{width: 2, height: 194, marginTop: -12, background: `linear-gradient(${theme.dark4} 60%, rgba(255,255,255,0) 0%)`, backgroundSize: '2px 21px', float: 'left', marginLeft: 12}}/>
                <div
                    style={{
                        height: 170,
                        width: 265,
                        marginLeft: 24,
                        float: 'left',
                    }}
                >
                    <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <Spin indicator={antIcon}/>
                    </div>
                </div>
            </Card>
        </div>;
    }
}
