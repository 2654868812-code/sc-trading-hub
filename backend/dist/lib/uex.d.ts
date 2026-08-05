export interface UexCommodity {
    id: number;
    name: string;
    code: string;
    kind: string | null;
    weight_scu: number | null;
    is_buyable: number;
    is_sellable: number;
    is_illegal: number;
    is_raw: number;
    is_refined: number;
    date_added: number | null;
    date_modified: number | null;
}
export interface UexTerminal {
    id: number;
    name: string;
    code: string | null;
    type: string | null;
    star_system_name: string | null;
    planet_name: string | null;
    moon_name: string | null;
    city_name: string | null;
    space_station_name: string | null;
    has_cargo_center: number;
    has_docking_port: number;
    has_freight_elevator: number;
    is_auto_load: number;
}
export interface UexPriceAll {
    id_commodity: number;
    id_terminal: number;
    price_buy: number | null;
    price_buy_avg: number | null;
    price_sell: number | null;
    price_sell_avg: number | null;
    scu_buy: number | null;
    scu_buy_avg: number | null;
    scu_sell_stock: number | null;
    scu_sell_stock_avg: number | null;
    scu_sell: number | null;
    scu_sell_avg: number | null;
    date_modified: number | null;
    commodity_name: string;
    terminal_name: string;
}
export declare function fetchCommodities(): Promise<UexCommodity[]>;
export declare function fetchTerminals(): Promise<UexTerminal[]>;
export declare function fetchAllPrices(): Promise<UexPriceAll[]>;
export interface UexCommodityAverage {
    id: number;
    id_commodity: number;
    price_buy: number | null;
    price_buy_avg: number | null;
    price_buy_min: number | null;
    price_buy_max: number | null;
    price_sell: number | null;
    price_sell_avg: number | null;
    price_sell_min: number | null;
    price_sell_max: number | null;
    scu_buy: number | null;
    scu_buy_avg: number | null;
    scu_buy_min: number | null;
    scu_buy_max: number | null;
    scu_sell: number | null;
    scu_sell_avg: number | null;
    scu_sell_min: number | null;
    scu_sell_max: number | null;
    status_buy_avg: number | null;
    status_sell_avg: number | null;
    cax_score: number | null;
    commodity_name: string;
    commodity_code: string;
    game_version: string | null;
    date_modified: number | null;
}
export declare function fetchCommodityAverage(id_commodity: number): Promise<UexCommodityAverage>;
export interface UexCargoRoute {
    id_commodity: number;
    id_terminal_origin: number;
    id_terminal_destination: number;
    distance: number | null;
    container_sizes_origin: string | null;
    container_sizes_destination: string | null;
}
export declare function fetchCommodityRoutes(id_commodity: number): Promise<UexCargoRoute[]>;
export interface UexVehicle {
    id: number;
    name: string;
    name_full: string | null;
    scu: number | null;
    id_company: number | null;
    company_name: string | null;
    is_cargo: number;
    is_spaceship: number;
    pad_type: string | null;
}
export declare function fetchVehicles(): Promise<UexVehicle[]>;
export interface UexTerminalCommodityPrice {
    id_commodity: number;
    id_terminal: number;
    price_buy_avg: number | null;
    price_sell_avg: number | null;
    scu_buy_max: number | null;
    scu_sell_max: number | null;
    scu_buy_avg: number | null;
    scu_sell_avg: number | null;
    date_modified: number | null;
}
export declare function fetchCommodityTerminalPrices(id_commodity: number): Promise<UexTerminalCommodityPrice[]>;
