import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type PriceSnapshotModel = runtime.Types.Result.DefaultSelection<Prisma.$PriceSnapshotPayload>;
export type AggregatePriceSnapshot = {
    _count: PriceSnapshotCountAggregateOutputType | null;
    _avg: PriceSnapshotAvgAggregateOutputType | null;
    _sum: PriceSnapshotSumAggregateOutputType | null;
    _min: PriceSnapshotMinAggregateOutputType | null;
    _max: PriceSnapshotMaxAggregateOutputType | null;
};
export type PriceSnapshotAvgAggregateOutputType = {
    id: number | null;
    commodityId: number | null;
    terminalId: number | null;
    priceBuy: number | null;
    priceBuyAvg: number | null;
    priceSell: number | null;
    priceSellAvg: number | null;
    scuBuyStock: number | null;
    scuSellStock: number | null;
    scuSellMax: number | null;
    uexModifiedAt: number | null;
};
export type PriceSnapshotSumAggregateOutputType = {
    id: number | null;
    commodityId: number | null;
    terminalId: number | null;
    priceBuy: number | null;
    priceBuyAvg: number | null;
    priceSell: number | null;
    priceSellAvg: number | null;
    scuBuyStock: number | null;
    scuSellStock: number | null;
    scuSellMax: number | null;
    uexModifiedAt: number | null;
};
export type PriceSnapshotMinAggregateOutputType = {
    id: number | null;
    commodityId: number | null;
    terminalId: number | null;
    priceBuy: number | null;
    priceBuyAvg: number | null;
    priceSell: number | null;
    priceSellAvg: number | null;
    scuBuyStock: number | null;
    scuSellStock: number | null;
    scuSellMax: number | null;
    uexModifiedAt: number | null;
    fetchedAt: Date | null;
};
export type PriceSnapshotMaxAggregateOutputType = {
    id: number | null;
    commodityId: number | null;
    terminalId: number | null;
    priceBuy: number | null;
    priceBuyAvg: number | null;
    priceSell: number | null;
    priceSellAvg: number | null;
    scuBuyStock: number | null;
    scuSellStock: number | null;
    scuSellMax: number | null;
    uexModifiedAt: number | null;
    fetchedAt: Date | null;
};
export type PriceSnapshotCountAggregateOutputType = {
    id: number;
    commodityId: number;
    terminalId: number;
    priceBuy: number;
    priceBuyAvg: number;
    priceSell: number;
    priceSellAvg: number;
    scuBuyStock: number;
    scuSellStock: number;
    scuSellMax: number;
    uexModifiedAt: number;
    fetchedAt: number;
    _all: number;
};
export type PriceSnapshotAvgAggregateInputType = {
    id?: true;
    commodityId?: true;
    terminalId?: true;
    priceBuy?: true;
    priceBuyAvg?: true;
    priceSell?: true;
    priceSellAvg?: true;
    scuBuyStock?: true;
    scuSellStock?: true;
    scuSellMax?: true;
    uexModifiedAt?: true;
};
export type PriceSnapshotSumAggregateInputType = {
    id?: true;
    commodityId?: true;
    terminalId?: true;
    priceBuy?: true;
    priceBuyAvg?: true;
    priceSell?: true;
    priceSellAvg?: true;
    scuBuyStock?: true;
    scuSellStock?: true;
    scuSellMax?: true;
    uexModifiedAt?: true;
};
export type PriceSnapshotMinAggregateInputType = {
    id?: true;
    commodityId?: true;
    terminalId?: true;
    priceBuy?: true;
    priceBuyAvg?: true;
    priceSell?: true;
    priceSellAvg?: true;
    scuBuyStock?: true;
    scuSellStock?: true;
    scuSellMax?: true;
    uexModifiedAt?: true;
    fetchedAt?: true;
};
export type PriceSnapshotMaxAggregateInputType = {
    id?: true;
    commodityId?: true;
    terminalId?: true;
    priceBuy?: true;
    priceBuyAvg?: true;
    priceSell?: true;
    priceSellAvg?: true;
    scuBuyStock?: true;
    scuSellStock?: true;
    scuSellMax?: true;
    uexModifiedAt?: true;
    fetchedAt?: true;
};
export type PriceSnapshotCountAggregateInputType = {
    id?: true;
    commodityId?: true;
    terminalId?: true;
    priceBuy?: true;
    priceBuyAvg?: true;
    priceSell?: true;
    priceSellAvg?: true;
    scuBuyStock?: true;
    scuSellStock?: true;
    scuSellMax?: true;
    uexModifiedAt?: true;
    fetchedAt?: true;
    _all?: true;
};
export type PriceSnapshotAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PriceSnapshotWhereInput;
    orderBy?: Prisma.PriceSnapshotOrderByWithRelationInput | Prisma.PriceSnapshotOrderByWithRelationInput[];
    cursor?: Prisma.PriceSnapshotWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | PriceSnapshotCountAggregateInputType;
    _avg?: PriceSnapshotAvgAggregateInputType;
    _sum?: PriceSnapshotSumAggregateInputType;
    _min?: PriceSnapshotMinAggregateInputType;
    _max?: PriceSnapshotMaxAggregateInputType;
};
export type GetPriceSnapshotAggregateType<T extends PriceSnapshotAggregateArgs> = {
    [P in keyof T & keyof AggregatePriceSnapshot]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePriceSnapshot[P]> : Prisma.GetScalarType<T[P], AggregatePriceSnapshot[P]>;
};
export type PriceSnapshotGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PriceSnapshotWhereInput;
    orderBy?: Prisma.PriceSnapshotOrderByWithAggregationInput | Prisma.PriceSnapshotOrderByWithAggregationInput[];
    by: Prisma.PriceSnapshotScalarFieldEnum[] | Prisma.PriceSnapshotScalarFieldEnum;
    having?: Prisma.PriceSnapshotScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PriceSnapshotCountAggregateInputType | true;
    _avg?: PriceSnapshotAvgAggregateInputType;
    _sum?: PriceSnapshotSumAggregateInputType;
    _min?: PriceSnapshotMinAggregateInputType;
    _max?: PriceSnapshotMaxAggregateInputType;
};
export type PriceSnapshotGroupByOutputType = {
    id: number;
    commodityId: number;
    terminalId: number;
    priceBuy: number | null;
    priceBuyAvg: number | null;
    priceSell: number | null;
    priceSellAvg: number | null;
    scuBuyStock: number | null;
    scuSellStock: number | null;
    scuSellMax: number | null;
    uexModifiedAt: number | null;
    fetchedAt: Date;
    _count: PriceSnapshotCountAggregateOutputType | null;
    _avg: PriceSnapshotAvgAggregateOutputType | null;
    _sum: PriceSnapshotSumAggregateOutputType | null;
    _min: PriceSnapshotMinAggregateOutputType | null;
    _max: PriceSnapshotMaxAggregateOutputType | null;
};
export type GetPriceSnapshotGroupByPayload<T extends PriceSnapshotGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<PriceSnapshotGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof PriceSnapshotGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], PriceSnapshotGroupByOutputType[P]> : Prisma.GetScalarType<T[P], PriceSnapshotGroupByOutputType[P]>;
}>>;
export type PriceSnapshotWhereInput = {
    AND?: Prisma.PriceSnapshotWhereInput | Prisma.PriceSnapshotWhereInput[];
    OR?: Prisma.PriceSnapshotWhereInput[];
    NOT?: Prisma.PriceSnapshotWhereInput | Prisma.PriceSnapshotWhereInput[];
    id?: Prisma.IntFilter<"PriceSnapshot"> | number;
    commodityId?: Prisma.IntFilter<"PriceSnapshot"> | number;
    terminalId?: Prisma.IntFilter<"PriceSnapshot"> | number;
    priceBuy?: Prisma.FloatNullableFilter<"PriceSnapshot"> | number | null;
    priceBuyAvg?: Prisma.FloatNullableFilter<"PriceSnapshot"> | number | null;
    priceSell?: Prisma.FloatNullableFilter<"PriceSnapshot"> | number | null;
    priceSellAvg?: Prisma.FloatNullableFilter<"PriceSnapshot"> | number | null;
    scuBuyStock?: Prisma.IntNullableFilter<"PriceSnapshot"> | number | null;
    scuSellStock?: Prisma.IntNullableFilter<"PriceSnapshot"> | number | null;
    scuSellMax?: Prisma.IntNullableFilter<"PriceSnapshot"> | number | null;
    uexModifiedAt?: Prisma.IntNullableFilter<"PriceSnapshot"> | number | null;
    fetchedAt?: Prisma.DateTimeFilter<"PriceSnapshot"> | Date | string;
    commodity?: Prisma.XOR<Prisma.CommodityScalarRelationFilter, Prisma.CommodityWhereInput>;
    terminal?: Prisma.XOR<Prisma.TerminalScalarRelationFilter, Prisma.TerminalWhereInput>;
};
export type PriceSnapshotOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    commodityId?: Prisma.SortOrder;
    terminalId?: Prisma.SortOrder;
    priceBuy?: Prisma.SortOrderInput | Prisma.SortOrder;
    priceBuyAvg?: Prisma.SortOrderInput | Prisma.SortOrder;
    priceSell?: Prisma.SortOrderInput | Prisma.SortOrder;
    priceSellAvg?: Prisma.SortOrderInput | Prisma.SortOrder;
    scuBuyStock?: Prisma.SortOrderInput | Prisma.SortOrder;
    scuSellStock?: Prisma.SortOrderInput | Prisma.SortOrder;
    scuSellMax?: Prisma.SortOrderInput | Prisma.SortOrder;
    uexModifiedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    fetchedAt?: Prisma.SortOrder;
    commodity?: Prisma.CommodityOrderByWithRelationInput;
    terminal?: Prisma.TerminalOrderByWithRelationInput;
};
export type PriceSnapshotWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    commodityId_terminalId_fetchedAt?: Prisma.PriceSnapshotCommodityIdTerminalIdFetchedAtCompoundUniqueInput;
    AND?: Prisma.PriceSnapshotWhereInput | Prisma.PriceSnapshotWhereInput[];
    OR?: Prisma.PriceSnapshotWhereInput[];
    NOT?: Prisma.PriceSnapshotWhereInput | Prisma.PriceSnapshotWhereInput[];
    commodityId?: Prisma.IntFilter<"PriceSnapshot"> | number;
    terminalId?: Prisma.IntFilter<"PriceSnapshot"> | number;
    priceBuy?: Prisma.FloatNullableFilter<"PriceSnapshot"> | number | null;
    priceBuyAvg?: Prisma.FloatNullableFilter<"PriceSnapshot"> | number | null;
    priceSell?: Prisma.FloatNullableFilter<"PriceSnapshot"> | number | null;
    priceSellAvg?: Prisma.FloatNullableFilter<"PriceSnapshot"> | number | null;
    scuBuyStock?: Prisma.IntNullableFilter<"PriceSnapshot"> | number | null;
    scuSellStock?: Prisma.IntNullableFilter<"PriceSnapshot"> | number | null;
    scuSellMax?: Prisma.IntNullableFilter<"PriceSnapshot"> | number | null;
    uexModifiedAt?: Prisma.IntNullableFilter<"PriceSnapshot"> | number | null;
    fetchedAt?: Prisma.DateTimeFilter<"PriceSnapshot"> | Date | string;
    commodity?: Prisma.XOR<Prisma.CommodityScalarRelationFilter, Prisma.CommodityWhereInput>;
    terminal?: Prisma.XOR<Prisma.TerminalScalarRelationFilter, Prisma.TerminalWhereInput>;
}, "id" | "commodityId_terminalId_fetchedAt">;
export type PriceSnapshotOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    commodityId?: Prisma.SortOrder;
    terminalId?: Prisma.SortOrder;
    priceBuy?: Prisma.SortOrderInput | Prisma.SortOrder;
    priceBuyAvg?: Prisma.SortOrderInput | Prisma.SortOrder;
    priceSell?: Prisma.SortOrderInput | Prisma.SortOrder;
    priceSellAvg?: Prisma.SortOrderInput | Prisma.SortOrder;
    scuBuyStock?: Prisma.SortOrderInput | Prisma.SortOrder;
    scuSellStock?: Prisma.SortOrderInput | Prisma.SortOrder;
    scuSellMax?: Prisma.SortOrderInput | Prisma.SortOrder;
    uexModifiedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    fetchedAt?: Prisma.SortOrder;
    _count?: Prisma.PriceSnapshotCountOrderByAggregateInput;
    _avg?: Prisma.PriceSnapshotAvgOrderByAggregateInput;
    _max?: Prisma.PriceSnapshotMaxOrderByAggregateInput;
    _min?: Prisma.PriceSnapshotMinOrderByAggregateInput;
    _sum?: Prisma.PriceSnapshotSumOrderByAggregateInput;
};
export type PriceSnapshotScalarWhereWithAggregatesInput = {
    AND?: Prisma.PriceSnapshotScalarWhereWithAggregatesInput | Prisma.PriceSnapshotScalarWhereWithAggregatesInput[];
    OR?: Prisma.PriceSnapshotScalarWhereWithAggregatesInput[];
    NOT?: Prisma.PriceSnapshotScalarWhereWithAggregatesInput | Prisma.PriceSnapshotScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"PriceSnapshot"> | number;
    commodityId?: Prisma.IntWithAggregatesFilter<"PriceSnapshot"> | number;
    terminalId?: Prisma.IntWithAggregatesFilter<"PriceSnapshot"> | number;
    priceBuy?: Prisma.FloatNullableWithAggregatesFilter<"PriceSnapshot"> | number | null;
    priceBuyAvg?: Prisma.FloatNullableWithAggregatesFilter<"PriceSnapshot"> | number | null;
    priceSell?: Prisma.FloatNullableWithAggregatesFilter<"PriceSnapshot"> | number | null;
    priceSellAvg?: Prisma.FloatNullableWithAggregatesFilter<"PriceSnapshot"> | number | null;
    scuBuyStock?: Prisma.IntNullableWithAggregatesFilter<"PriceSnapshot"> | number | null;
    scuSellStock?: Prisma.IntNullableWithAggregatesFilter<"PriceSnapshot"> | number | null;
    scuSellMax?: Prisma.IntNullableWithAggregatesFilter<"PriceSnapshot"> | number | null;
    uexModifiedAt?: Prisma.IntNullableWithAggregatesFilter<"PriceSnapshot"> | number | null;
    fetchedAt?: Prisma.DateTimeWithAggregatesFilter<"PriceSnapshot"> | Date | string;
};
export type PriceSnapshotCreateInput = {
    priceBuy?: number | null;
    priceBuyAvg?: number | null;
    priceSell?: number | null;
    priceSellAvg?: number | null;
    scuBuyStock?: number | null;
    scuSellStock?: number | null;
    scuSellMax?: number | null;
    uexModifiedAt?: number | null;
    fetchedAt: Date | string;
    commodity: Prisma.CommodityCreateNestedOneWithoutPriceSnapshotsInput;
    terminal: Prisma.TerminalCreateNestedOneWithoutPriceSnapshotsInput;
};
export type PriceSnapshotUncheckedCreateInput = {
    id?: number;
    commodityId: number;
    terminalId: number;
    priceBuy?: number | null;
    priceBuyAvg?: number | null;
    priceSell?: number | null;
    priceSellAvg?: number | null;
    scuBuyStock?: number | null;
    scuSellStock?: number | null;
    scuSellMax?: number | null;
    uexModifiedAt?: number | null;
    fetchedAt: Date | string;
};
export type PriceSnapshotUpdateInput = {
    priceBuy?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    priceBuyAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    priceSell?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    priceSellAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    scuBuyStock?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    scuSellStock?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    scuSellMax?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    uexModifiedAt?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    fetchedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    commodity?: Prisma.CommodityUpdateOneRequiredWithoutPriceSnapshotsNestedInput;
    terminal?: Prisma.TerminalUpdateOneRequiredWithoutPriceSnapshotsNestedInput;
};
export type PriceSnapshotUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    commodityId?: Prisma.IntFieldUpdateOperationsInput | number;
    terminalId?: Prisma.IntFieldUpdateOperationsInput | number;
    priceBuy?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    priceBuyAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    priceSell?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    priceSellAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    scuBuyStock?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    scuSellStock?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    scuSellMax?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    uexModifiedAt?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    fetchedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PriceSnapshotCreateManyInput = {
    id?: number;
    commodityId: number;
    terminalId: number;
    priceBuy?: number | null;
    priceBuyAvg?: number | null;
    priceSell?: number | null;
    priceSellAvg?: number | null;
    scuBuyStock?: number | null;
    scuSellStock?: number | null;
    scuSellMax?: number | null;
    uexModifiedAt?: number | null;
    fetchedAt: Date | string;
};
export type PriceSnapshotUpdateManyMutationInput = {
    priceBuy?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    priceBuyAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    priceSell?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    priceSellAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    scuBuyStock?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    scuSellStock?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    scuSellMax?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    uexModifiedAt?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    fetchedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PriceSnapshotUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    commodityId?: Prisma.IntFieldUpdateOperationsInput | number;
    terminalId?: Prisma.IntFieldUpdateOperationsInput | number;
    priceBuy?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    priceBuyAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    priceSell?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    priceSellAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    scuBuyStock?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    scuSellStock?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    scuSellMax?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    uexModifiedAt?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    fetchedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PriceSnapshotListRelationFilter = {
    every?: Prisma.PriceSnapshotWhereInput;
    some?: Prisma.PriceSnapshotWhereInput;
    none?: Prisma.PriceSnapshotWhereInput;
};
export type PriceSnapshotOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type PriceSnapshotCommodityIdTerminalIdFetchedAtCompoundUniqueInput = {
    commodityId: number;
    terminalId: number;
    fetchedAt: Date | string;
};
export type PriceSnapshotCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    commodityId?: Prisma.SortOrder;
    terminalId?: Prisma.SortOrder;
    priceBuy?: Prisma.SortOrder;
    priceBuyAvg?: Prisma.SortOrder;
    priceSell?: Prisma.SortOrder;
    priceSellAvg?: Prisma.SortOrder;
    scuBuyStock?: Prisma.SortOrder;
    scuSellStock?: Prisma.SortOrder;
    scuSellMax?: Prisma.SortOrder;
    uexModifiedAt?: Prisma.SortOrder;
    fetchedAt?: Prisma.SortOrder;
};
export type PriceSnapshotAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    commodityId?: Prisma.SortOrder;
    terminalId?: Prisma.SortOrder;
    priceBuy?: Prisma.SortOrder;
    priceBuyAvg?: Prisma.SortOrder;
    priceSell?: Prisma.SortOrder;
    priceSellAvg?: Prisma.SortOrder;
    scuBuyStock?: Prisma.SortOrder;
    scuSellStock?: Prisma.SortOrder;
    scuSellMax?: Prisma.SortOrder;
    uexModifiedAt?: Prisma.SortOrder;
};
export type PriceSnapshotMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    commodityId?: Prisma.SortOrder;
    terminalId?: Prisma.SortOrder;
    priceBuy?: Prisma.SortOrder;
    priceBuyAvg?: Prisma.SortOrder;
    priceSell?: Prisma.SortOrder;
    priceSellAvg?: Prisma.SortOrder;
    scuBuyStock?: Prisma.SortOrder;
    scuSellStock?: Prisma.SortOrder;
    scuSellMax?: Prisma.SortOrder;
    uexModifiedAt?: Prisma.SortOrder;
    fetchedAt?: Prisma.SortOrder;
};
export type PriceSnapshotMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    commodityId?: Prisma.SortOrder;
    terminalId?: Prisma.SortOrder;
    priceBuy?: Prisma.SortOrder;
    priceBuyAvg?: Prisma.SortOrder;
    priceSell?: Prisma.SortOrder;
    priceSellAvg?: Prisma.SortOrder;
    scuBuyStock?: Prisma.SortOrder;
    scuSellStock?: Prisma.SortOrder;
    scuSellMax?: Prisma.SortOrder;
    uexModifiedAt?: Prisma.SortOrder;
    fetchedAt?: Prisma.SortOrder;
};
export type PriceSnapshotSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    commodityId?: Prisma.SortOrder;
    terminalId?: Prisma.SortOrder;
    priceBuy?: Prisma.SortOrder;
    priceBuyAvg?: Prisma.SortOrder;
    priceSell?: Prisma.SortOrder;
    priceSellAvg?: Prisma.SortOrder;
    scuBuyStock?: Prisma.SortOrder;
    scuSellStock?: Prisma.SortOrder;
    scuSellMax?: Prisma.SortOrder;
    uexModifiedAt?: Prisma.SortOrder;
};
export type PriceSnapshotCreateNestedManyWithoutCommodityInput = {
    create?: Prisma.XOR<Prisma.PriceSnapshotCreateWithoutCommodityInput, Prisma.PriceSnapshotUncheckedCreateWithoutCommodityInput> | Prisma.PriceSnapshotCreateWithoutCommodityInput[] | Prisma.PriceSnapshotUncheckedCreateWithoutCommodityInput[];
    connectOrCreate?: Prisma.PriceSnapshotCreateOrConnectWithoutCommodityInput | Prisma.PriceSnapshotCreateOrConnectWithoutCommodityInput[];
    createMany?: Prisma.PriceSnapshotCreateManyCommodityInputEnvelope;
    connect?: Prisma.PriceSnapshotWhereUniqueInput | Prisma.PriceSnapshotWhereUniqueInput[];
};
export type PriceSnapshotUncheckedCreateNestedManyWithoutCommodityInput = {
    create?: Prisma.XOR<Prisma.PriceSnapshotCreateWithoutCommodityInput, Prisma.PriceSnapshotUncheckedCreateWithoutCommodityInput> | Prisma.PriceSnapshotCreateWithoutCommodityInput[] | Prisma.PriceSnapshotUncheckedCreateWithoutCommodityInput[];
    connectOrCreate?: Prisma.PriceSnapshotCreateOrConnectWithoutCommodityInput | Prisma.PriceSnapshotCreateOrConnectWithoutCommodityInput[];
    createMany?: Prisma.PriceSnapshotCreateManyCommodityInputEnvelope;
    connect?: Prisma.PriceSnapshotWhereUniqueInput | Prisma.PriceSnapshotWhereUniqueInput[];
};
export type PriceSnapshotUpdateManyWithoutCommodityNestedInput = {
    create?: Prisma.XOR<Prisma.PriceSnapshotCreateWithoutCommodityInput, Prisma.PriceSnapshotUncheckedCreateWithoutCommodityInput> | Prisma.PriceSnapshotCreateWithoutCommodityInput[] | Prisma.PriceSnapshotUncheckedCreateWithoutCommodityInput[];
    connectOrCreate?: Prisma.PriceSnapshotCreateOrConnectWithoutCommodityInput | Prisma.PriceSnapshotCreateOrConnectWithoutCommodityInput[];
    upsert?: Prisma.PriceSnapshotUpsertWithWhereUniqueWithoutCommodityInput | Prisma.PriceSnapshotUpsertWithWhereUniqueWithoutCommodityInput[];
    createMany?: Prisma.PriceSnapshotCreateManyCommodityInputEnvelope;
    set?: Prisma.PriceSnapshotWhereUniqueInput | Prisma.PriceSnapshotWhereUniqueInput[];
    disconnect?: Prisma.PriceSnapshotWhereUniqueInput | Prisma.PriceSnapshotWhereUniqueInput[];
    delete?: Prisma.PriceSnapshotWhereUniqueInput | Prisma.PriceSnapshotWhereUniqueInput[];
    connect?: Prisma.PriceSnapshotWhereUniqueInput | Prisma.PriceSnapshotWhereUniqueInput[];
    update?: Prisma.PriceSnapshotUpdateWithWhereUniqueWithoutCommodityInput | Prisma.PriceSnapshotUpdateWithWhereUniqueWithoutCommodityInput[];
    updateMany?: Prisma.PriceSnapshotUpdateManyWithWhereWithoutCommodityInput | Prisma.PriceSnapshotUpdateManyWithWhereWithoutCommodityInput[];
    deleteMany?: Prisma.PriceSnapshotScalarWhereInput | Prisma.PriceSnapshotScalarWhereInput[];
};
export type PriceSnapshotUncheckedUpdateManyWithoutCommodityNestedInput = {
    create?: Prisma.XOR<Prisma.PriceSnapshotCreateWithoutCommodityInput, Prisma.PriceSnapshotUncheckedCreateWithoutCommodityInput> | Prisma.PriceSnapshotCreateWithoutCommodityInput[] | Prisma.PriceSnapshotUncheckedCreateWithoutCommodityInput[];
    connectOrCreate?: Prisma.PriceSnapshotCreateOrConnectWithoutCommodityInput | Prisma.PriceSnapshotCreateOrConnectWithoutCommodityInput[];
    upsert?: Prisma.PriceSnapshotUpsertWithWhereUniqueWithoutCommodityInput | Prisma.PriceSnapshotUpsertWithWhereUniqueWithoutCommodityInput[];
    createMany?: Prisma.PriceSnapshotCreateManyCommodityInputEnvelope;
    set?: Prisma.PriceSnapshotWhereUniqueInput | Prisma.PriceSnapshotWhereUniqueInput[];
    disconnect?: Prisma.PriceSnapshotWhereUniqueInput | Prisma.PriceSnapshotWhereUniqueInput[];
    delete?: Prisma.PriceSnapshotWhereUniqueInput | Prisma.PriceSnapshotWhereUniqueInput[];
    connect?: Prisma.PriceSnapshotWhereUniqueInput | Prisma.PriceSnapshotWhereUniqueInput[];
    update?: Prisma.PriceSnapshotUpdateWithWhereUniqueWithoutCommodityInput | Prisma.PriceSnapshotUpdateWithWhereUniqueWithoutCommodityInput[];
    updateMany?: Prisma.PriceSnapshotUpdateManyWithWhereWithoutCommodityInput | Prisma.PriceSnapshotUpdateManyWithWhereWithoutCommodityInput[];
    deleteMany?: Prisma.PriceSnapshotScalarWhereInput | Prisma.PriceSnapshotScalarWhereInput[];
};
export type PriceSnapshotCreateNestedManyWithoutTerminalInput = {
    create?: Prisma.XOR<Prisma.PriceSnapshotCreateWithoutTerminalInput, Prisma.PriceSnapshotUncheckedCreateWithoutTerminalInput> | Prisma.PriceSnapshotCreateWithoutTerminalInput[] | Prisma.PriceSnapshotUncheckedCreateWithoutTerminalInput[];
    connectOrCreate?: Prisma.PriceSnapshotCreateOrConnectWithoutTerminalInput | Prisma.PriceSnapshotCreateOrConnectWithoutTerminalInput[];
    createMany?: Prisma.PriceSnapshotCreateManyTerminalInputEnvelope;
    connect?: Prisma.PriceSnapshotWhereUniqueInput | Prisma.PriceSnapshotWhereUniqueInput[];
};
export type PriceSnapshotUncheckedCreateNestedManyWithoutTerminalInput = {
    create?: Prisma.XOR<Prisma.PriceSnapshotCreateWithoutTerminalInput, Prisma.PriceSnapshotUncheckedCreateWithoutTerminalInput> | Prisma.PriceSnapshotCreateWithoutTerminalInput[] | Prisma.PriceSnapshotUncheckedCreateWithoutTerminalInput[];
    connectOrCreate?: Prisma.PriceSnapshotCreateOrConnectWithoutTerminalInput | Prisma.PriceSnapshotCreateOrConnectWithoutTerminalInput[];
    createMany?: Prisma.PriceSnapshotCreateManyTerminalInputEnvelope;
    connect?: Prisma.PriceSnapshotWhereUniqueInput | Prisma.PriceSnapshotWhereUniqueInput[];
};
export type PriceSnapshotUpdateManyWithoutTerminalNestedInput = {
    create?: Prisma.XOR<Prisma.PriceSnapshotCreateWithoutTerminalInput, Prisma.PriceSnapshotUncheckedCreateWithoutTerminalInput> | Prisma.PriceSnapshotCreateWithoutTerminalInput[] | Prisma.PriceSnapshotUncheckedCreateWithoutTerminalInput[];
    connectOrCreate?: Prisma.PriceSnapshotCreateOrConnectWithoutTerminalInput | Prisma.PriceSnapshotCreateOrConnectWithoutTerminalInput[];
    upsert?: Prisma.PriceSnapshotUpsertWithWhereUniqueWithoutTerminalInput | Prisma.PriceSnapshotUpsertWithWhereUniqueWithoutTerminalInput[];
    createMany?: Prisma.PriceSnapshotCreateManyTerminalInputEnvelope;
    set?: Prisma.PriceSnapshotWhereUniqueInput | Prisma.PriceSnapshotWhereUniqueInput[];
    disconnect?: Prisma.PriceSnapshotWhereUniqueInput | Prisma.PriceSnapshotWhereUniqueInput[];
    delete?: Prisma.PriceSnapshotWhereUniqueInput | Prisma.PriceSnapshotWhereUniqueInput[];
    connect?: Prisma.PriceSnapshotWhereUniqueInput | Prisma.PriceSnapshotWhereUniqueInput[];
    update?: Prisma.PriceSnapshotUpdateWithWhereUniqueWithoutTerminalInput | Prisma.PriceSnapshotUpdateWithWhereUniqueWithoutTerminalInput[];
    updateMany?: Prisma.PriceSnapshotUpdateManyWithWhereWithoutTerminalInput | Prisma.PriceSnapshotUpdateManyWithWhereWithoutTerminalInput[];
    deleteMany?: Prisma.PriceSnapshotScalarWhereInput | Prisma.PriceSnapshotScalarWhereInput[];
};
export type PriceSnapshotUncheckedUpdateManyWithoutTerminalNestedInput = {
    create?: Prisma.XOR<Prisma.PriceSnapshotCreateWithoutTerminalInput, Prisma.PriceSnapshotUncheckedCreateWithoutTerminalInput> | Prisma.PriceSnapshotCreateWithoutTerminalInput[] | Prisma.PriceSnapshotUncheckedCreateWithoutTerminalInput[];
    connectOrCreate?: Prisma.PriceSnapshotCreateOrConnectWithoutTerminalInput | Prisma.PriceSnapshotCreateOrConnectWithoutTerminalInput[];
    upsert?: Prisma.PriceSnapshotUpsertWithWhereUniqueWithoutTerminalInput | Prisma.PriceSnapshotUpsertWithWhereUniqueWithoutTerminalInput[];
    createMany?: Prisma.PriceSnapshotCreateManyTerminalInputEnvelope;
    set?: Prisma.PriceSnapshotWhereUniqueInput | Prisma.PriceSnapshotWhereUniqueInput[];
    disconnect?: Prisma.PriceSnapshotWhereUniqueInput | Prisma.PriceSnapshotWhereUniqueInput[];
    delete?: Prisma.PriceSnapshotWhereUniqueInput | Prisma.PriceSnapshotWhereUniqueInput[];
    connect?: Prisma.PriceSnapshotWhereUniqueInput | Prisma.PriceSnapshotWhereUniqueInput[];
    update?: Prisma.PriceSnapshotUpdateWithWhereUniqueWithoutTerminalInput | Prisma.PriceSnapshotUpdateWithWhereUniqueWithoutTerminalInput[];
    updateMany?: Prisma.PriceSnapshotUpdateManyWithWhereWithoutTerminalInput | Prisma.PriceSnapshotUpdateManyWithWhereWithoutTerminalInput[];
    deleteMany?: Prisma.PriceSnapshotScalarWhereInput | Prisma.PriceSnapshotScalarWhereInput[];
};
export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
};
export type PriceSnapshotCreateWithoutCommodityInput = {
    priceBuy?: number | null;
    priceBuyAvg?: number | null;
    priceSell?: number | null;
    priceSellAvg?: number | null;
    scuBuyStock?: number | null;
    scuSellStock?: number | null;
    scuSellMax?: number | null;
    uexModifiedAt?: number | null;
    fetchedAt: Date | string;
    terminal: Prisma.TerminalCreateNestedOneWithoutPriceSnapshotsInput;
};
export type PriceSnapshotUncheckedCreateWithoutCommodityInput = {
    id?: number;
    terminalId: number;
    priceBuy?: number | null;
    priceBuyAvg?: number | null;
    priceSell?: number | null;
    priceSellAvg?: number | null;
    scuBuyStock?: number | null;
    scuSellStock?: number | null;
    scuSellMax?: number | null;
    uexModifiedAt?: number | null;
    fetchedAt: Date | string;
};
export type PriceSnapshotCreateOrConnectWithoutCommodityInput = {
    where: Prisma.PriceSnapshotWhereUniqueInput;
    create: Prisma.XOR<Prisma.PriceSnapshotCreateWithoutCommodityInput, Prisma.PriceSnapshotUncheckedCreateWithoutCommodityInput>;
};
export type PriceSnapshotCreateManyCommodityInputEnvelope = {
    data: Prisma.PriceSnapshotCreateManyCommodityInput | Prisma.PriceSnapshotCreateManyCommodityInput[];
    skipDuplicates?: boolean;
};
export type PriceSnapshotUpsertWithWhereUniqueWithoutCommodityInput = {
    where: Prisma.PriceSnapshotWhereUniqueInput;
    update: Prisma.XOR<Prisma.PriceSnapshotUpdateWithoutCommodityInput, Prisma.PriceSnapshotUncheckedUpdateWithoutCommodityInput>;
    create: Prisma.XOR<Prisma.PriceSnapshotCreateWithoutCommodityInput, Prisma.PriceSnapshotUncheckedCreateWithoutCommodityInput>;
};
export type PriceSnapshotUpdateWithWhereUniqueWithoutCommodityInput = {
    where: Prisma.PriceSnapshotWhereUniqueInput;
    data: Prisma.XOR<Prisma.PriceSnapshotUpdateWithoutCommodityInput, Prisma.PriceSnapshotUncheckedUpdateWithoutCommodityInput>;
};
export type PriceSnapshotUpdateManyWithWhereWithoutCommodityInput = {
    where: Prisma.PriceSnapshotScalarWhereInput;
    data: Prisma.XOR<Prisma.PriceSnapshotUpdateManyMutationInput, Prisma.PriceSnapshotUncheckedUpdateManyWithoutCommodityInput>;
};
export type PriceSnapshotScalarWhereInput = {
    AND?: Prisma.PriceSnapshotScalarWhereInput | Prisma.PriceSnapshotScalarWhereInput[];
    OR?: Prisma.PriceSnapshotScalarWhereInput[];
    NOT?: Prisma.PriceSnapshotScalarWhereInput | Prisma.PriceSnapshotScalarWhereInput[];
    id?: Prisma.IntFilter<"PriceSnapshot"> | number;
    commodityId?: Prisma.IntFilter<"PriceSnapshot"> | number;
    terminalId?: Prisma.IntFilter<"PriceSnapshot"> | number;
    priceBuy?: Prisma.FloatNullableFilter<"PriceSnapshot"> | number | null;
    priceBuyAvg?: Prisma.FloatNullableFilter<"PriceSnapshot"> | number | null;
    priceSell?: Prisma.FloatNullableFilter<"PriceSnapshot"> | number | null;
    priceSellAvg?: Prisma.FloatNullableFilter<"PriceSnapshot"> | number | null;
    scuBuyStock?: Prisma.IntNullableFilter<"PriceSnapshot"> | number | null;
    scuSellStock?: Prisma.IntNullableFilter<"PriceSnapshot"> | number | null;
    scuSellMax?: Prisma.IntNullableFilter<"PriceSnapshot"> | number | null;
    uexModifiedAt?: Prisma.IntNullableFilter<"PriceSnapshot"> | number | null;
    fetchedAt?: Prisma.DateTimeFilter<"PriceSnapshot"> | Date | string;
};
export type PriceSnapshotCreateWithoutTerminalInput = {
    priceBuy?: number | null;
    priceBuyAvg?: number | null;
    priceSell?: number | null;
    priceSellAvg?: number | null;
    scuBuyStock?: number | null;
    scuSellStock?: number | null;
    scuSellMax?: number | null;
    uexModifiedAt?: number | null;
    fetchedAt: Date | string;
    commodity: Prisma.CommodityCreateNestedOneWithoutPriceSnapshotsInput;
};
export type PriceSnapshotUncheckedCreateWithoutTerminalInput = {
    id?: number;
    commodityId: number;
    priceBuy?: number | null;
    priceBuyAvg?: number | null;
    priceSell?: number | null;
    priceSellAvg?: number | null;
    scuBuyStock?: number | null;
    scuSellStock?: number | null;
    scuSellMax?: number | null;
    uexModifiedAt?: number | null;
    fetchedAt: Date | string;
};
export type PriceSnapshotCreateOrConnectWithoutTerminalInput = {
    where: Prisma.PriceSnapshotWhereUniqueInput;
    create: Prisma.XOR<Prisma.PriceSnapshotCreateWithoutTerminalInput, Prisma.PriceSnapshotUncheckedCreateWithoutTerminalInput>;
};
export type PriceSnapshotCreateManyTerminalInputEnvelope = {
    data: Prisma.PriceSnapshotCreateManyTerminalInput | Prisma.PriceSnapshotCreateManyTerminalInput[];
    skipDuplicates?: boolean;
};
export type PriceSnapshotUpsertWithWhereUniqueWithoutTerminalInput = {
    where: Prisma.PriceSnapshotWhereUniqueInput;
    update: Prisma.XOR<Prisma.PriceSnapshotUpdateWithoutTerminalInput, Prisma.PriceSnapshotUncheckedUpdateWithoutTerminalInput>;
    create: Prisma.XOR<Prisma.PriceSnapshotCreateWithoutTerminalInput, Prisma.PriceSnapshotUncheckedCreateWithoutTerminalInput>;
};
export type PriceSnapshotUpdateWithWhereUniqueWithoutTerminalInput = {
    where: Prisma.PriceSnapshotWhereUniqueInput;
    data: Prisma.XOR<Prisma.PriceSnapshotUpdateWithoutTerminalInput, Prisma.PriceSnapshotUncheckedUpdateWithoutTerminalInput>;
};
export type PriceSnapshotUpdateManyWithWhereWithoutTerminalInput = {
    where: Prisma.PriceSnapshotScalarWhereInput;
    data: Prisma.XOR<Prisma.PriceSnapshotUpdateManyMutationInput, Prisma.PriceSnapshotUncheckedUpdateManyWithoutTerminalInput>;
};
export type PriceSnapshotCreateManyCommodityInput = {
    id?: number;
    terminalId: number;
    priceBuy?: number | null;
    priceBuyAvg?: number | null;
    priceSell?: number | null;
    priceSellAvg?: number | null;
    scuBuyStock?: number | null;
    scuSellStock?: number | null;
    scuSellMax?: number | null;
    uexModifiedAt?: number | null;
    fetchedAt: Date | string;
};
export type PriceSnapshotUpdateWithoutCommodityInput = {
    priceBuy?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    priceBuyAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    priceSell?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    priceSellAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    scuBuyStock?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    scuSellStock?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    scuSellMax?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    uexModifiedAt?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    fetchedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    terminal?: Prisma.TerminalUpdateOneRequiredWithoutPriceSnapshotsNestedInput;
};
export type PriceSnapshotUncheckedUpdateWithoutCommodityInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    terminalId?: Prisma.IntFieldUpdateOperationsInput | number;
    priceBuy?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    priceBuyAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    priceSell?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    priceSellAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    scuBuyStock?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    scuSellStock?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    scuSellMax?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    uexModifiedAt?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    fetchedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PriceSnapshotUncheckedUpdateManyWithoutCommodityInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    terminalId?: Prisma.IntFieldUpdateOperationsInput | number;
    priceBuy?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    priceBuyAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    priceSell?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    priceSellAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    scuBuyStock?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    scuSellStock?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    scuSellMax?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    uexModifiedAt?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    fetchedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PriceSnapshotCreateManyTerminalInput = {
    id?: number;
    commodityId: number;
    priceBuy?: number | null;
    priceBuyAvg?: number | null;
    priceSell?: number | null;
    priceSellAvg?: number | null;
    scuBuyStock?: number | null;
    scuSellStock?: number | null;
    scuSellMax?: number | null;
    uexModifiedAt?: number | null;
    fetchedAt: Date | string;
};
export type PriceSnapshotUpdateWithoutTerminalInput = {
    priceBuy?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    priceBuyAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    priceSell?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    priceSellAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    scuBuyStock?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    scuSellStock?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    scuSellMax?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    uexModifiedAt?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    fetchedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    commodity?: Prisma.CommodityUpdateOneRequiredWithoutPriceSnapshotsNestedInput;
};
export type PriceSnapshotUncheckedUpdateWithoutTerminalInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    commodityId?: Prisma.IntFieldUpdateOperationsInput | number;
    priceBuy?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    priceBuyAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    priceSell?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    priceSellAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    scuBuyStock?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    scuSellStock?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    scuSellMax?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    uexModifiedAt?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    fetchedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PriceSnapshotUncheckedUpdateManyWithoutTerminalInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    commodityId?: Prisma.IntFieldUpdateOperationsInput | number;
    priceBuy?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    priceBuyAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    priceSell?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    priceSellAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    scuBuyStock?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    scuSellStock?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    scuSellMax?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    uexModifiedAt?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    fetchedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PriceSnapshotSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    commodityId?: boolean;
    terminalId?: boolean;
    priceBuy?: boolean;
    priceBuyAvg?: boolean;
    priceSell?: boolean;
    priceSellAvg?: boolean;
    scuBuyStock?: boolean;
    scuSellStock?: boolean;
    scuSellMax?: boolean;
    uexModifiedAt?: boolean;
    fetchedAt?: boolean;
    commodity?: boolean | Prisma.CommodityDefaultArgs<ExtArgs>;
    terminal?: boolean | Prisma.TerminalDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["priceSnapshot"]>;
export type PriceSnapshotSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    commodityId?: boolean;
    terminalId?: boolean;
    priceBuy?: boolean;
    priceBuyAvg?: boolean;
    priceSell?: boolean;
    priceSellAvg?: boolean;
    scuBuyStock?: boolean;
    scuSellStock?: boolean;
    scuSellMax?: boolean;
    uexModifiedAt?: boolean;
    fetchedAt?: boolean;
    commodity?: boolean | Prisma.CommodityDefaultArgs<ExtArgs>;
    terminal?: boolean | Prisma.TerminalDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["priceSnapshot"]>;
export type PriceSnapshotSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    commodityId?: boolean;
    terminalId?: boolean;
    priceBuy?: boolean;
    priceBuyAvg?: boolean;
    priceSell?: boolean;
    priceSellAvg?: boolean;
    scuBuyStock?: boolean;
    scuSellStock?: boolean;
    scuSellMax?: boolean;
    uexModifiedAt?: boolean;
    fetchedAt?: boolean;
    commodity?: boolean | Prisma.CommodityDefaultArgs<ExtArgs>;
    terminal?: boolean | Prisma.TerminalDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["priceSnapshot"]>;
export type PriceSnapshotSelectScalar = {
    id?: boolean;
    commodityId?: boolean;
    terminalId?: boolean;
    priceBuy?: boolean;
    priceBuyAvg?: boolean;
    priceSell?: boolean;
    priceSellAvg?: boolean;
    scuBuyStock?: boolean;
    scuSellStock?: boolean;
    scuSellMax?: boolean;
    uexModifiedAt?: boolean;
    fetchedAt?: boolean;
};
export type PriceSnapshotOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "commodityId" | "terminalId" | "priceBuy" | "priceBuyAvg" | "priceSell" | "priceSellAvg" | "scuBuyStock" | "scuSellStock" | "scuSellMax" | "uexModifiedAt" | "fetchedAt", ExtArgs["result"]["priceSnapshot"]>;
export type PriceSnapshotInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    commodity?: boolean | Prisma.CommodityDefaultArgs<ExtArgs>;
    terminal?: boolean | Prisma.TerminalDefaultArgs<ExtArgs>;
};
export type PriceSnapshotIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    commodity?: boolean | Prisma.CommodityDefaultArgs<ExtArgs>;
    terminal?: boolean | Prisma.TerminalDefaultArgs<ExtArgs>;
};
export type PriceSnapshotIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    commodity?: boolean | Prisma.CommodityDefaultArgs<ExtArgs>;
    terminal?: boolean | Prisma.TerminalDefaultArgs<ExtArgs>;
};
export type $PriceSnapshotPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "PriceSnapshot";
    objects: {
        commodity: Prisma.$CommodityPayload<ExtArgs>;
        terminal: Prisma.$TerminalPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        commodityId: number;
        terminalId: number;
        priceBuy: number | null;
        priceBuyAvg: number | null;
        priceSell: number | null;
        priceSellAvg: number | null;
        scuBuyStock: number | null;
        scuSellStock: number | null;
        scuSellMax: number | null;
        uexModifiedAt: number | null;
        fetchedAt: Date;
    }, ExtArgs["result"]["priceSnapshot"]>;
    composites: {};
};
export type PriceSnapshotGetPayload<S extends boolean | null | undefined | PriceSnapshotDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$PriceSnapshotPayload, S>;
export type PriceSnapshotCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<PriceSnapshotFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PriceSnapshotCountAggregateInputType | true;
};
export interface PriceSnapshotDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['PriceSnapshot'];
        meta: {
            name: 'PriceSnapshot';
        };
    };
    findUnique<T extends PriceSnapshotFindUniqueArgs>(args: Prisma.SelectSubset<T, PriceSnapshotFindUniqueArgs<ExtArgs>>): Prisma.Prisma__PriceSnapshotClient<runtime.Types.Result.GetResult<Prisma.$PriceSnapshotPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends PriceSnapshotFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, PriceSnapshotFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__PriceSnapshotClient<runtime.Types.Result.GetResult<Prisma.$PriceSnapshotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends PriceSnapshotFindFirstArgs>(args?: Prisma.SelectSubset<T, PriceSnapshotFindFirstArgs<ExtArgs>>): Prisma.Prisma__PriceSnapshotClient<runtime.Types.Result.GetResult<Prisma.$PriceSnapshotPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends PriceSnapshotFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, PriceSnapshotFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__PriceSnapshotClient<runtime.Types.Result.GetResult<Prisma.$PriceSnapshotPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends PriceSnapshotFindManyArgs>(args?: Prisma.SelectSubset<T, PriceSnapshotFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PriceSnapshotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends PriceSnapshotCreateArgs>(args: Prisma.SelectSubset<T, PriceSnapshotCreateArgs<ExtArgs>>): Prisma.Prisma__PriceSnapshotClient<runtime.Types.Result.GetResult<Prisma.$PriceSnapshotPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends PriceSnapshotCreateManyArgs>(args?: Prisma.SelectSubset<T, PriceSnapshotCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends PriceSnapshotCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, PriceSnapshotCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PriceSnapshotPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends PriceSnapshotDeleteArgs>(args: Prisma.SelectSubset<T, PriceSnapshotDeleteArgs<ExtArgs>>): Prisma.Prisma__PriceSnapshotClient<runtime.Types.Result.GetResult<Prisma.$PriceSnapshotPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends PriceSnapshotUpdateArgs>(args: Prisma.SelectSubset<T, PriceSnapshotUpdateArgs<ExtArgs>>): Prisma.Prisma__PriceSnapshotClient<runtime.Types.Result.GetResult<Prisma.$PriceSnapshotPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends PriceSnapshotDeleteManyArgs>(args?: Prisma.SelectSubset<T, PriceSnapshotDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends PriceSnapshotUpdateManyArgs>(args: Prisma.SelectSubset<T, PriceSnapshotUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends PriceSnapshotUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, PriceSnapshotUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PriceSnapshotPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends PriceSnapshotUpsertArgs>(args: Prisma.SelectSubset<T, PriceSnapshotUpsertArgs<ExtArgs>>): Prisma.Prisma__PriceSnapshotClient<runtime.Types.Result.GetResult<Prisma.$PriceSnapshotPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends PriceSnapshotCountArgs>(args?: Prisma.Subset<T, PriceSnapshotCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], PriceSnapshotCountAggregateOutputType> : number>;
    aggregate<T extends PriceSnapshotAggregateArgs>(args: Prisma.Subset<T, PriceSnapshotAggregateArgs>): Prisma.PrismaPromise<GetPriceSnapshotAggregateType<T>>;
    groupBy<T extends PriceSnapshotGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: PriceSnapshotGroupByArgs['orderBy'];
    } : {
        orderBy?: PriceSnapshotGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, PriceSnapshotGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPriceSnapshotGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: PriceSnapshotFieldRefs;
}
export interface Prisma__PriceSnapshotClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    commodity<T extends Prisma.CommodityDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CommodityDefaultArgs<ExtArgs>>): Prisma.Prisma__CommodityClient<runtime.Types.Result.GetResult<Prisma.$CommodityPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    terminal<T extends Prisma.TerminalDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TerminalDefaultArgs<ExtArgs>>): Prisma.Prisma__TerminalClient<runtime.Types.Result.GetResult<Prisma.$TerminalPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface PriceSnapshotFieldRefs {
    readonly id: Prisma.FieldRef<"PriceSnapshot", 'Int'>;
    readonly commodityId: Prisma.FieldRef<"PriceSnapshot", 'Int'>;
    readonly terminalId: Prisma.FieldRef<"PriceSnapshot", 'Int'>;
    readonly priceBuy: Prisma.FieldRef<"PriceSnapshot", 'Float'>;
    readonly priceBuyAvg: Prisma.FieldRef<"PriceSnapshot", 'Float'>;
    readonly priceSell: Prisma.FieldRef<"PriceSnapshot", 'Float'>;
    readonly priceSellAvg: Prisma.FieldRef<"PriceSnapshot", 'Float'>;
    readonly scuBuyStock: Prisma.FieldRef<"PriceSnapshot", 'Int'>;
    readonly scuSellStock: Prisma.FieldRef<"PriceSnapshot", 'Int'>;
    readonly scuSellMax: Prisma.FieldRef<"PriceSnapshot", 'Int'>;
    readonly uexModifiedAt: Prisma.FieldRef<"PriceSnapshot", 'Int'>;
    readonly fetchedAt: Prisma.FieldRef<"PriceSnapshot", 'DateTime'>;
}
export type PriceSnapshotFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PriceSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.PriceSnapshotOmit<ExtArgs> | null;
    include?: Prisma.PriceSnapshotInclude<ExtArgs> | null;
    where: Prisma.PriceSnapshotWhereUniqueInput;
};
export type PriceSnapshotFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PriceSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.PriceSnapshotOmit<ExtArgs> | null;
    include?: Prisma.PriceSnapshotInclude<ExtArgs> | null;
    where: Prisma.PriceSnapshotWhereUniqueInput;
};
export type PriceSnapshotFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PriceSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.PriceSnapshotOmit<ExtArgs> | null;
    include?: Prisma.PriceSnapshotInclude<ExtArgs> | null;
    where?: Prisma.PriceSnapshotWhereInput;
    orderBy?: Prisma.PriceSnapshotOrderByWithRelationInput | Prisma.PriceSnapshotOrderByWithRelationInput[];
    cursor?: Prisma.PriceSnapshotWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PriceSnapshotScalarFieldEnum | Prisma.PriceSnapshotScalarFieldEnum[];
};
export type PriceSnapshotFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PriceSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.PriceSnapshotOmit<ExtArgs> | null;
    include?: Prisma.PriceSnapshotInclude<ExtArgs> | null;
    where?: Prisma.PriceSnapshotWhereInput;
    orderBy?: Prisma.PriceSnapshotOrderByWithRelationInput | Prisma.PriceSnapshotOrderByWithRelationInput[];
    cursor?: Prisma.PriceSnapshotWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PriceSnapshotScalarFieldEnum | Prisma.PriceSnapshotScalarFieldEnum[];
};
export type PriceSnapshotFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PriceSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.PriceSnapshotOmit<ExtArgs> | null;
    include?: Prisma.PriceSnapshotInclude<ExtArgs> | null;
    where?: Prisma.PriceSnapshotWhereInput;
    orderBy?: Prisma.PriceSnapshotOrderByWithRelationInput | Prisma.PriceSnapshotOrderByWithRelationInput[];
    cursor?: Prisma.PriceSnapshotWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PriceSnapshotScalarFieldEnum | Prisma.PriceSnapshotScalarFieldEnum[];
};
export type PriceSnapshotCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PriceSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.PriceSnapshotOmit<ExtArgs> | null;
    include?: Prisma.PriceSnapshotInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PriceSnapshotCreateInput, Prisma.PriceSnapshotUncheckedCreateInput>;
};
export type PriceSnapshotCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.PriceSnapshotCreateManyInput | Prisma.PriceSnapshotCreateManyInput[];
    skipDuplicates?: boolean;
};
export type PriceSnapshotCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PriceSnapshotSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PriceSnapshotOmit<ExtArgs> | null;
    data: Prisma.PriceSnapshotCreateManyInput | Prisma.PriceSnapshotCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.PriceSnapshotIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type PriceSnapshotUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PriceSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.PriceSnapshotOmit<ExtArgs> | null;
    include?: Prisma.PriceSnapshotInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PriceSnapshotUpdateInput, Prisma.PriceSnapshotUncheckedUpdateInput>;
    where: Prisma.PriceSnapshotWhereUniqueInput;
};
export type PriceSnapshotUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.PriceSnapshotUpdateManyMutationInput, Prisma.PriceSnapshotUncheckedUpdateManyInput>;
    where?: Prisma.PriceSnapshotWhereInput;
    limit?: number;
};
export type PriceSnapshotUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PriceSnapshotSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PriceSnapshotOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PriceSnapshotUpdateManyMutationInput, Prisma.PriceSnapshotUncheckedUpdateManyInput>;
    where?: Prisma.PriceSnapshotWhereInput;
    limit?: number;
    include?: Prisma.PriceSnapshotIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type PriceSnapshotUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PriceSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.PriceSnapshotOmit<ExtArgs> | null;
    include?: Prisma.PriceSnapshotInclude<ExtArgs> | null;
    where: Prisma.PriceSnapshotWhereUniqueInput;
    create: Prisma.XOR<Prisma.PriceSnapshotCreateInput, Prisma.PriceSnapshotUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.PriceSnapshotUpdateInput, Prisma.PriceSnapshotUncheckedUpdateInput>;
};
export type PriceSnapshotDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PriceSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.PriceSnapshotOmit<ExtArgs> | null;
    include?: Prisma.PriceSnapshotInclude<ExtArgs> | null;
    where: Prisma.PriceSnapshotWhereUniqueInput;
};
export type PriceSnapshotDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PriceSnapshotWhereInput;
    limit?: number;
};
export type PriceSnapshotDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PriceSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.PriceSnapshotOmit<ExtArgs> | null;
    include?: Prisma.PriceSnapshotInclude<ExtArgs> | null;
};
