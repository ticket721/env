interface Argument {
    name: string;
    type: string;
}

export interface StrapiMinter {
    abi: any[];
    action_arguments: Argument[];
    build_arguments: Argument[];
    binary: string;
    id: number;
    name: string;
    solidity_version: string;
    sources: string;
    symbol: string;
    t721_version: string;
}
