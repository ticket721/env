import { I18N }                         from '@utils/misc/i18n';
import { LocalWalletCreationViewProps } from './LocalWalletCreationView';
import dynamic                          from 'next/dynamic';
import * as React                       from 'react';

const LocalWalletCreationView: React.ComponentType<LocalWalletCreationViewProps> = dynamic<LocalWalletCreationViewProps>(async () => import('./LocalWalletCreationView'), {
    loading: (): React.ReactElement => null
});

export default I18N.withNamespaces(['local_wallet_creation'])(LocalWalletCreationView);
