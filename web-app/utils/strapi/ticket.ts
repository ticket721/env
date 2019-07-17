export interface StrapiTicket {
    ticket_id: number;
    id: number;
    owner: any;
    event: any;
    actions: any[];
    mint_block: number;
    sale: any;
    issuer: any;
    current_sale: any;
    mint_currency: string;
    mint_price: string;
    creation: Date;
}
