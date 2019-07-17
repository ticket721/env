import * as React                      from 'react';
import { Grid, Box }                   from 'grommet';
import { FullDiv }                     from '@components/html/FullDiv';
import { InjectedProviderChoiceProps } from './InjectedProviderChoice';
import { T721ProviderChoiceProps }     from './T721ProviderChoice';
import dynamic                         from 'next-server/dynamic';
import { I18NProps }                   from '../../utils/misc/i18n';
import { RGA }                         from '../../utils/misc/ga';

// Dyanmic Components

const InjectedProviderChoice: React.ComponentType<InjectedProviderChoiceProps> = dynamic<InjectedProviderChoiceProps>(async () => import('./InjectedProviderChoice'), {
    loading: (): React.ReactElement => null
});

const T721ProviderChoice: React.ComponentType<T721ProviderChoiceProps> = dynamic<InjectedProviderChoiceProps>(async () => import('./T721ProviderChoice'), {
    loading: (): React.ReactElement => null
});

export interface ProviderSelectionViewProps {
}

type MergedProviderSelectionViewProps = ProviderSelectionViewProps & I18NProps;

/**
 * Provider selection buttons
 */
export default class ProviderSelectionView extends React.Component<MergedProviderSelectionViewProps> {

    componentDidMount(): void {
        RGA.pageview('/provider');
    }

    render(): React.ReactNode {
        return <FullDiv style={{padding: '2%'}}>
            <Grid

                fill={true}
                rows={['xxsmall', 'auto']}
                columns={['auto', '1/3', '1/3', 'auto']}
                gap='small'
                areas={[
                    {name: 'title', start: [1, 0], end: [2, 0]},
                    {name: 'injected_provider_choice', start: [1, 1], end: [1, 1]},
                    {name: 't721_provider_choice', start: [2, 1], end: [2, 1]},
                ]}
            >
                <Box gridArea='title'>
                    <h1 style={{fontWeight: 100, textAlign: 'center', margin: 0}}>{this.props.t('title')}</h1>
                </Box>
                <Box style={{padding: '5%'}} gridArea='injected_provider_choice'>
                    <InjectedProviderChoice/>
                </Box>
                <Box style={{padding: '5%'}} gridArea='t721_provider_choice'>
                    <T721ProviderChoice/>
                </Box>
            </Grid>
        </FullDiv>;
    }
}
