import { I18N }   from '@utils/misc/i18n';
import dynamic    from 'next/dynamic';
import * as React from 'react';

const ProviderSelectionView = dynamic<any>(async () => import('./ProviderSelectionView'), {
    loading: (): React.ReactElement => null
});

export default I18N.withNamespaces(['provider_selection'])(ProviderSelectionView);
