import Document, { Head, Main, NextScript } from 'next/document';
import React                                from 'react';
import bg from '@static/assets/misc/bg_repeat.svg';

export default class T721Document extends Document {

    static async getInitialProps(ctx: any): Promise<any> {
        const initialProps = await Document.getInitialProps(ctx);
        return {...initialProps};
    }

    render(): React.ReactNode {
        return (
            <html>
            <Head>
                <script src={'https://maps.googleapis.com/maps/api/js?key=' + process.env.google_api_token + '&libraries=places'}/>
                <title>T721</title>
                <link rel='icon' type='image/x-icon' href='/static/assets/misc/favicon.ico' />
            </Head>
            <style>{`
                #__next {
                    background-color: none !important;
                    background: url(` + bg + `) repeat;
                    background-size: 50px;
                }
                
                #__next .ant-layout {
                    background: none;
                }
            `}</style>
            <body className='custom_class'>
            <Main/>
            <NextScript/>
            </body>
            </html>
        );
    }
}
