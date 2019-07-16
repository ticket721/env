import { Form, Input, Modal, Typography } from 'antd';
import * as React                         from 'react';
import * as GeoPattern                    from 'geopattern';
import { theme }                          from '../../../utils/theme';

export const LWUnlockForm = Form.create({name: 'lwunlock_form'})(
    class extends React.Component<any, any> {

        constructor(props: any) {
            super(props);

            this.state = {
                msg: null,
                loading: false
            };
        }

        public setMsg = (msg: string): void => {
            this.setState({
                msg
            });
        }

        public load = (): void => {
            this.setState({
                loading: !this.state.loading
            });
        }

        render(): React.ReactNode {

            const {
                visible, onCancel, onCreate, form
            }: any = this.props;
            const {getFieldDecorator}: any = form;

            const msg = this.state.msg ? (
                <Typography.Text type='danger'>{this.state.msg}</Typography.Text>
            ) : null;

            const pattern = GeoPattern.generate(this.props.coinbase).toDataUrl();

            return (
                <div>
                    <style>{`
                        .lw_unlock .ant-modal-header {
                            background-image: ${pattern};
                        }
                        .lw_unlock .ant-modal-title {
                            color: ${theme.white};
                        }
                        .lw_unlock .ant-modal-close {
                            color: ${theme.white};
                        }
                    `}</style>
                    <Modal
                        wrapClassName={'lw_unlock'}
                        visible={visible}
                        title={this.props.t('lwunlock_title')}
                        okText={this.props.t('lwunlock_ok_button')}
                        cancelText={this.props.t('lwunlock_cancel_button')}
                        onCancel={onCancel}
                        onOk={onCreate}
                        okButtonProps={{loading: this.state.loading}}
                        cancelButtonProps={{disabled: this.state.loading}}
                    >
                        <Form layout='vertical'>
                            <Form.Item label={this.props.t('lwunlock_password')}>
                                {getFieldDecorator('password', {
                                    rules: [{required: true, message: this.props.t('lwunlock_password_warning')}],
                                })(
                                    <Input.Password placeholder={this.props.t('lwunlock_password_placeholder')}/>
                                )}
                            </Form.Item>
                            {msg}
                        </Form>
                    </Modal>
                </div>
            );
        }

    }
);
