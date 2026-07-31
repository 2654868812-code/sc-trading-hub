import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type CommodityAverageModel = runtime.Types.Result.DefaultSelection<Prisma.$CommodityAveragePayload>;
export type AggregateCommodityAverage = {
    _count: CommodityAverageCountAggregateOutputType | null;
    _avg: CommodityAverageAvgAggregateOutputType | null;
    _sum: CommodityAverageSumAggregateOutputType | null;
    _min: CommodityAverageMinAggregateOutputType | null;
    _max: CommodityAverageMaxAggregateOutputType | null;
};
export type CommodityAverageAvgAggregateOutputType = {
    commodityId: number | null;
    priceBuyAvg: number | null;
    priceSellAvg: number | null;
    scuBuyMax: number | null;
    scuBuyAvg: number | null;
    scuSellMax: number | null;
    scuSellAvg: number | null;
    statusBuyAvg: number | null;
    statusSellAvg: number | null;
    caxScore: number | null;
    dateModified: number | null;
};
export type CommodityAverageSumAggregateOutputType = {
    commodityId: number | null;
    priceBuyAvg: number | null;
    priceSellAvg: number | null;
    scuBuyMax: number | null;
    scuBuyAvg: number | null;
    scuSellMax: number | null;
    scuSellAvg: number | null;
    statusBuyAvg: number | null;
    statusSellAvg: number | null;
    caxScore: number | null;
    dateModified: number | null;
};
export type CommodityAverageMinAggregateOutputType = {
    commodityId: number | null;
    priceBuyAvg: number | null;
    priceSellAvg: number | null;
    scuBuyMax: number | null;
    scuBuyAvg: number | null;
    scuSellMax: number | null;
    scuSellAvg: number | null;
    statusBuyAvg: number | null;
    statusSellAvg: number | null;
    caxScore: number | null;
    gameVersion: string | null;
    dateModified: number | null;
    fetchedAt: Date | null;
};
export type CommodityAverageMaxAggregateOutputType = {
    commodityId: number | null;
    priceBuyAvg: number | null;
    priceSellAvg: number | null;
    scuBuyMax: number | null;
    scuBuyAvg: number | null;
    scuSellMax: number | null;
    scuSellAvg: number | null;
    statusBuyAvg: number | null;
    statusSellAvg: number | null;
    caxScore: number | null;
    gameVersion: string | null;
    dateModified: number | null;
    fetchedAt: Date | null;
};
export type CommodityAverageCountAggregateOutputType = {
    commodityId: number;
    priceBuyAvg: number;
    priceSellAvg: number;
    scuBuyMax: number;
    scuBuyAvg: number;
    scuSellMax: number;
    scuSellAvg: number;
    statusBuyAvg: number;
    statusSellAvg: number;
    caxScore: number;
    gameVersion: number;
    dateModified: number;
    fetchedAt: number;
    _all: number;
};
export type CommodityAverageAvgAggregateInputType = {
    commodityId?: true;
    priceBuyAvg?: true;
    priceSellAvg?: true;
    scuBuyMax?: true;
    scuBuyAvg?: true;
    scuSellMax?: true;
    scuSellAvg?: true;
    statusBuyAvg?: true;
    statusSellAvg?: true;
    caxScore?: true;
    dateModified?: true;
};
export type CommodityAverageSumAggregateInputType = {
    commodityId?: true;
    priceBuyAvg?: true;
    priceSellAvg?: true;
    scuBuyMax?: true;
    scuBuyAvg?: true;
    scuSellMax?: true;
    scuSellAvg?: true;
    statusBuyAvg?: true;
    statusSellAvg?: true;
    caxScore?: true;
    dateModified?: true;
};
export type CommodityAverageMinAggregateInputType = {
    commodityId?: true;
    priceBuyAvg?: true;
    priceSellAvg?: true;
    scuBuyMax?: true;
    scuBuyAvg?: true;
    scuSellMax?: true;
    scuSellAvg?: true;
    statusBuyAvg?: true;
    statusSellAvg?: true;
    caxScore?: true;
    gameVersion?: true;
    dateModified?: true;
    fetchedAt?: true;
};
export type CommodityAverageMaxAggregateInputType = {
    commodityId?: true;
    priceBuyAvg?: true;
    priceSellAvg?: true;
    scuBuyMax?: true;
    scuBuyAvg?: true;
    scuSellMax?: true;
    scuSellAvg?: true;
    statusBuyAvg?: true;
    statusSellAvg?: true;
    caxScore?: true;
    gameVersion?: true;
    dateModified?: true;
    fetchedAt?: true;
};
export type CommodityAverageCountAggregateInputType = {
    commodityId?: true;
    priceBuyAvg?: true;
    priceSellAvg?: true;
    scuBuyMax?: true;
    scuBuyAvg?: true;
    scuSellMax?: true;
    scuSellAvg?: true;
    statusBuyAvg?: true;
    statusSellAvg?: true;
    caxScore?: true;
    gameVersion?: true;
    dateModified?: true;
    fetchedAt?: true;
    _all?: true;
};
export type CommodityAverageAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CommodityAverageWhereInput;
    orderBy?: Prisma.CommodityAverageOrderByWithRelationInput | Prisma.CommodityAverageOrderByWithRelationInput[];
    cursor?: Prisma.CommodityAverageWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | CommodityAverageCountAggregateInputType;
    _avg?: CommodityAverageAvgAggregateInputType;
    _sum?: CommodityAverageSumAggregateInputType;
    _min?: CommodityAverageMinAggregateInputType;
    _max?: CommodityAverageMaxAggregateInputType;
};
export type GetCommodityAverageAggregateType<T extends CommodityAverageAggregateArgs> = {
    [P in keyof T & keyof AggregateCommodityAverage]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateCommodityAverage[P]> : Prisma.GetScalarType<T[P], AggregateCommodityAverage[P]>;
};
export type CommodityAverageGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CommodityAverageWhereInput;
    orderBy?: Prisma.CommodityAverageOrderByWithAggregationInput | Prisma.CommodityAverageOrderByWithAggregationInput[];
    by: Prisma.CommodityAverageScalarFieldEnum[] | Prisma.CommodityAverageScalarFieldEnum;
    having?: Prisma.CommodityAverageScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CommodityAverageCountAggregateInputType | true;
    _avg?: CommodityAverageAvgAggregateInputType;
    _sum?: CommodityAverageSumAggregateInputType;
    _min?: CommodityAverageMinAggregateInputType;
    _max?: CommodityAverageMaxAggregateInputType;
};
export type CommodityAverageGroupByOutputType = {
    commodityId: number;
    priceBuyAvg: number | null;
    priceSellAvg: number | null;
    scuBuyMax: number | null;
    scuBuyAvg: number | null;
    scuSellMax: number | null;
    scuSellAvg: number | null;
    statusBuyAvg: number | null;
    statusSellAvg: number | null;
    caxScore: number | null;
    gameVersion: string | null;
    dateModified: number | null;
    fetchedAt: Date;
    _count: CommodityAverageCountAggregateOutputType | null;
    _avg: CommodityAverageAvgAggregateOutputType | null;
    _sum: CommodityAverageSumAggregateOutputType | null;
    _min: CommodityAverageMinAggregateOutputType | null;
    _max: CommodityAverageMaxAggregateOutputType | null;
};
export type GetCommodityAverageGroupByPayload<T extends CommodityAverageGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<CommodityAverageGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof CommodityAverageGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], CommodityAverageGroupByOutputType[P]> : Prisma.GetScalarType<T[P], CommodityAverageGroupByOutputType[P]>;
}>>;
export type CommodityAverageWhereInput = {
    AND?: Prisma.CommodityAverageWhereInput | Prisma.CommodityAverageWhereInput[];
    OR?: Prisma.CommodityAverageWhereInput[];
    NOT?: Prisma.CommodityAverageWhereInput | Prisma.CommodityAverageWhereInput[];
    commodityId?: Prisma.IntFilter<"CommodityAverage"> | number;
    priceBuyAvg?: Prisma.FloatNullableFilter<"CommodityAverage"> | number | null;
    priceSellAvg?: Prisma.FloatNullableFilter<"CommodityAverage"> | number | null;
    scuBuyMax?: Prisma.IntNullableFilter<"CommodityAverage"> | number | null;
    scuBuyAvg?: Prisma.FloatNullableFilter<"CommodityAverage"> | number | null;
    scuSellMax?: Prisma.IntNullableFilter<"CommodityAverage"> | number | null;
    scuSellAvg?: Prisma.FloatNullableFilter<"CommodityAverage"> | number | null;
    statusBuyAvg?: Prisma.FloatNullableFilter<"CommodityAverage"> | number | null;
    statusSellAvg?: Prisma.FloatNullableFilter<"CommodityAverage"> | number | null;
    caxScore?: Prisma.IntNullableFilter<"CommodityAverage"> | number | null;
    gameVersion?: Prisma.StringNullableFilter<"CommodityAverage"> | string | null;
    dateModified?: Prisma.IntNullableFilter<"CommodityAverage"> | number | null;
    fetchedAt?: Prisma.DateTimeFilter<"CommodityAverage"> | Date | string;
    commodity?: Prisma.XOR<Prisma.CommodityScalarRelationFilter, Prisma.CommodityWhereInput>;
};
export type CommodityAverageOrderByWithRelationInput = {
    commodityId?: Prisma.SortOrder;
    priceBuyAvg?: Prisma.SortOrderInput | Prisma.SortOrder;
    priceSellAvg?: Prisma.SortOrderInput | Prisma.SortOrder;
    scuBuyMax?: Prisma.SortOrderInput | Prisma.SortOrder;
    scuBuyAvg?: Prisma.SortOrderInput | Prisma.SortOrder;
    scuSellMax?: Prisma.SortOrderInput | Prisma.SortOrder;
    scuSellAvg?: Prisma.SortOrderInput | Prisma.SortOrder;
    statusBuyAvg?: Prisma.SortOrderInput | Prisma.SortOrder;
    statusSellAvg?: Prisma.SortOrderInput | Prisma.SortOrder;
    caxScore?: Prisma.SortOrderInput | Prisma.SortOrder;
    gameVersion?: Prisma.SortOrderInput | Prisma.SortOrder;
    dateModified?: Prisma.SortOrderInput | Prisma.SortOrder;
    fetchedAt?: Prisma.SortOrder;
    commodity?: Prisma.CommodityOrderByWithRelationInput;
};
export type CommodityAverageWhereUniqueInput = Prisma.AtLeast<{
    commodityId?: number;
    AND?: Prisma.CommodityAverageWhereInput | Prisma.CommodityAverageWhereInput[];
    OR?: Prisma.CommodityAverageWhereInput[];
    NOT?: Prisma.CommodityAverageWhereInput | Prisma.CommodityAverageWhereInput[];
    priceBuyAvg?: Prisma.FloatNullableFilter<"CommodityAverage"> | number | null;
    priceSellAvg?: Prisma.FloatNullableFilter<"CommodityAverage"> | number | null;
    scuBuyMax?: Prisma.IntNullableFilter<"CommodityAverage"> | number | null;
    scuBuyAvg?: Prisma.FloatNullableFilter<"CommodityAverage"> | number | null;
    scuSellMax?: Prisma.IntNullableFilter<"CommodityAverage"> | number | null;
    scuSellAvg?: Prisma.FloatNullableFilter<"CommodityAverage"> | number | null;
    statusBuyAvg?: Prisma.FloatNullableFilter<"CommodityAverage"> | number | null;
    statusSellAvg?: Prisma.FloatNullableFilter<"CommodityAverage"> | number | null;
    caxScore?: Prisma.IntNullableFilter<"CommodityAverage"> | number | null;
    gameVersion?: Prisma.StringNullableFilter<"CommodityAverage"> | string | null;
    dateModified?: Prisma.IntNullableFilter<"CommodityAverage"> | number | null;
    fetchedAt?: Prisma.DateTimeFilter<"CommodityAverage"> | Date | string;
    commodity?: Prisma.XOR<Prisma.CommodityScalarRelationFilter, Prisma.CommodityWhereInput>;
}, "commodityId">;
export type CommodityAverageOrderByWithAggregationInput = {
    commodityId?: Prisma.SortOrder;
    priceBuyAvg?: Prisma.SortOrderInput | Prisma.SortOrder;
    priceSellAvg?: Prisma.SortOrderInput | Prisma.SortOrder;
    scuBuyMax?: Prisma.SortOrderInput | Prisma.SortOrder;
    scuBuyAvg?: Prisma.SortOrderInput | Prisma.SortOrder;
    scuSellMax?: Prisma.SortOrderInput | Prisma.SortOrder;
    scuSellAvg?: Prisma.SortOrderInput | Prisma.SortOrder;
    statusBuyAvg?: Prisma.SortOrderInput | Prisma.SortOrder;
    statusSellAvg?: Prisma.SortOrderInput | Prisma.SortOrder;
    caxScore?: Prisma.SortOrderInput | Prisma.SortOrder;
    gameVersion?: Prisma.SortOrderInput | Prisma.SortOrder;
    dateModified?: Prisma.SortOrderInput | Prisma.SortOrder;
    fetchedAt?: Prisma.SortOrder;
    _count?: Prisma.CommodityAverageCountOrderByAggregateInput;
    _avg?: Prisma.CommodityAverageAvgOrderByAggregateInput;
    _max?: Prisma.CommodityAverageMaxOrderByAggregateInput;
    _min?: Prisma.CommodityAverageMinOrderByAggregateInput;
    _sum?: Prisma.CommodityAverageSumOrderByAggregateInput;
};
export type CommodityAverageScalarWhereWithAggregatesInput = {
    AND?: Prisma.CommodityAverageScalarWhereWithAggregatesInput | Prisma.CommodityAverageScalarWhereWithAggregatesInput[];
    OR?: Prisma.CommodityAverageScalarWhereWithAggregatesInput[];
    NOT?: Prisma.CommodityAverageScalarWhereWithAggregatesInput | Prisma.CommodityAverageScalarWhereWithAggregatesInput[];
    commodityId?: Prisma.IntWithAggregatesFilter<"CommodityAverage"> | number;
    priceBuyAvg?: Prisma.FloatNullableWithAggregatesFilter<"CommodityAverage"> | number | null;
    priceSellAvg?: Prisma.FloatNullableWithAggregatesFilter<"CommodityAverage"> | number | null;
    scuBuyMax?: Prisma.IntNullableWithAggregatesFilter<"CommodityAverage"> | number | null;
    scuBuyAvg?: Prisma.FloatNullableWithAggregatesFilter<"CommodityAverage"> | number | null;
    scuSellMax?: Prisma.IntNullableWithAggregatesFilter<"CommodityAverage"> | number | null;
    scuSellAvg?: Prisma.FloatNullableWithAggregatesFilter<"CommodityAverage"> | number | null;
    statusBuyAvg?: Prisma.FloatNullableWithAggregatesFilter<"CommodityAverage"> | number | null;
    statusSellAvg?: Prisma.FloatNullableWithAggregatesFilter<"CommodityAverage"> | number | null;
    caxScore?: Prisma.IntNullableWithAggregatesFilter<"CommodityAverage"> | number | null;
    gameVersion?: Prisma.StringNullableWithAggregatesFilter<"CommodityAverage"> | string | null;
    dateModified?: Prisma.IntNullableWithAggregatesFilter<"CommodityAverage"> | number | null;
    fetchedAt?: Prisma.DateTimeWithAggregatesFilter<"CommodityAverage"> | Date | string;
};
export type CommodityAverageCreateInput = {
    priceBuyAvg?: number | null;
    priceSellAvg?: number | null;
    scuBuyMax?: number | null;
    scuBuyAvg?: number | null;
    scuSellMax?: number | null;
    scuSellAvg?: number | null;
    statusBuyAvg?: number | null;
    statusSellAvg?: number | null;
    caxScore?: number | null;
    gameVersion?: string | null;
    dateModified?: number | null;
    fetchedAt: Date | string;
    commodity: Prisma.CommodityCreateNestedOneWithoutAverageInput;
};
export type CommodityAverageUncheckedCreateInput = {
    commodityId: number;
    priceBuyAvg?: number | null;
    priceSellAvg?: number | null;
    scuBuyMax?: number | null;
    scuBuyAvg?: number | null;
    scuSellMax?: number | null;
    scuSellAvg?: number | null;
    statusBuyAvg?: number | null;
    statusSellAvg?: number | null;
    caxScore?: number | null;
    gameVersion?: string | null;
    dateModified?: number | null;
    fetchedAt: Date | string;
};
export type CommodityAverageUpdateInput = {
    priceBuyAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    priceSellAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    scuBuyMax?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    scuBuyAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    scuSellMax?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    scuSellAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    statusBuyAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    statusSellAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    caxScore?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    gameVersion?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dateModified?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    fetchedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    commodity?: Prisma.CommodityUpdateOneRequiredWithoutAverageNestedInput;
};
export type CommodityAverageUncheckedUpdateInput = {
    commodityId?: Prisma.IntFieldUpdateOperationsInput | number;
    priceBuyAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    priceSellAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    scuBuyMax?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    scuBuyAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    scuSellMax?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    scuSellAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    statusBuyAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    statusSellAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    caxScore?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    gameVersion?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dateModified?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    fetchedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CommodityAverageCreateManyInput = {
    commodityId: number;
    priceBuyAvg?: number | null;
    priceSellAvg?: number | null;
    scuBuyMax?: number | null;
    scuBuyAvg?: number | null;
    scuSellMax?: number | null;
    scuSellAvg?: number | null;
    statusBuyAvg?: number | null;
    statusSellAvg?: number | null;
    caxScore?: number | null;
    gameVersion?: string | null;
    dateModified?: number | null;
    fetchedAt: Date | string;
};
export type CommodityAverageUpdateManyMutationInput = {
    priceBuyAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    priceSellAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    scuBuyMax?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    scuBuyAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    scuSellMax?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    scuSellAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    statusBuyAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    statusSellAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    caxScore?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    gameVersion?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dateModified?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    fetchedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CommodityAverageUncheckedUpdateManyInput = {
    commodityId?: Prisma.IntFieldUpdateOperationsInput | number;
    priceBuyAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    priceSellAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    scuBuyMax?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    scuBuyAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    scuSellMax?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    scuSellAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    statusBuyAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    statusSellAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    caxScore?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    gameVersion?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dateModified?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    fetchedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CommodityAverageNullableScalarRelationFilter = {
    is?: Prisma.CommodityAverageWhereInput | null;
    isNot?: Prisma.CommodityAverageWhereInput | null;
};
export type CommodityAverageCountOrderByAggregateInput = {
    commodityId?: Prisma.SortOrder;
    priceBuyAvg?: Prisma.SortOrder;
    priceSellAvg?: Prisma.SortOrder;
    scuBuyMax?: Prisma.SortOrder;
    scuBuyAvg?: Prisma.SortOrder;
    scuSellMax?: Prisma.SortOrder;
    scuSellAvg?: Prisma.SortOrder;
    statusBuyAvg?: Prisma.SortOrder;
    statusSellAvg?: Prisma.SortOrder;
    caxScore?: Prisma.SortOrder;
    gameVersion?: Prisma.SortOrder;
    dateModified?: Prisma.SortOrder;
    fetchedAt?: Prisma.SortOrder;
};
export type CommodityAverageAvgOrderByAggregateInput = {
    commodityId?: Prisma.SortOrder;
    priceBuyAvg?: Prisma.SortOrder;
    priceSellAvg?: Prisma.SortOrder;
    scuBuyMax?: Prisma.SortOrder;
    scuBuyAvg?: Prisma.SortOrder;
    scuSellMax?: Prisma.SortOrder;
    scuSellAvg?: Prisma.SortOrder;
    statusBuyAvg?: Prisma.SortOrder;
    statusSellAvg?: Prisma.SortOrder;
    caxScore?: Prisma.SortOrder;
    dateModified?: Prisma.SortOrder;
};
export type CommodityAverageMaxOrderByAggregateInput = {
    commodityId?: Prisma.SortOrder;
    priceBuyAvg?: Prisma.SortOrder;
    priceSellAvg?: Prisma.SortOrder;
    scuBuyMax?: Prisma.SortOrder;
    scuBuyAvg?: Prisma.SortOrder;
    scuSellMax?: Prisma.SortOrder;
    scuSellAvg?: Prisma.SortOrder;
    statusBuyAvg?: Prisma.SortOrder;
    statusSellAvg?: Prisma.SortOrder;
    caxScore?: Prisma.SortOrder;
    gameVersion?: Prisma.SortOrder;
    dateModified?: Prisma.SortOrder;
    fetchedAt?: Prisma.SortOrder;
};
export type CommodityAverageMinOrderByAggregateInput = {
    commodityId?: Prisma.SortOrder;
    priceBuyAvg?: Prisma.SortOrder;
    priceSellAvg?: Prisma.SortOrder;
    scuBuyMax?: Prisma.SortOrder;
    scuBuyAvg?: Prisma.SortOrder;
    scuSellMax?: Prisma.SortOrder;
    scuSellAvg?: Prisma.SortOrder;
    statusBuyAvg?: Prisma.SortOrder;
    statusSellAvg?: Prisma.SortOrder;
    caxScore?: Prisma.SortOrder;
    gameVersion?: Prisma.SortOrder;
    dateModified?: Prisma.SortOrder;
    fetchedAt?: Prisma.SortOrder;
};
export type CommodityAverageSumOrderByAggregateInput = {
    commodityId?: Prisma.SortOrder;
    priceBuyAvg?: Prisma.SortOrder;
    priceSellAvg?: Prisma.SortOrder;
    scuBuyMax?: Prisma.SortOrder;
    scuBuyAvg?: Prisma.SortOrder;
    scuSellMax?: Prisma.SortOrder;
    scuSellAvg?: Prisma.SortOrder;
    statusBuyAvg?: Prisma.SortOrder;
    statusSellAvg?: Prisma.SortOrder;
    caxScore?: Prisma.SortOrder;
    dateModified?: Prisma.SortOrder;
};
export type CommodityAverageCreateNestedOneWithoutCommodityInput = {
    create?: Prisma.XOR<Prisma.CommodityAverageCreateWithoutCommodityInput, Prisma.CommodityAverageUncheckedCreateWithoutCommodityInput>;
    connectOrCreate?: Prisma.CommodityAverageCreateOrConnectWithoutCommodityInput;
    connect?: Prisma.CommodityAverageWhereUniqueInput;
};
export type CommodityAverageUncheckedCreateNestedOneWithoutCommodityInput = {
    create?: Prisma.XOR<Prisma.CommodityAverageCreateWithoutCommodityInput, Prisma.CommodityAverageUncheckedCreateWithoutCommodityInput>;
    connectOrCreate?: Prisma.CommodityAverageCreateOrConnectWithoutCommodityInput;
    connect?: Prisma.CommodityAverageWhereUniqueInput;
};
export type CommodityAverageUpdateOneWithoutCommodityNestedInput = {
    create?: Prisma.XOR<Prisma.CommodityAverageCreateWithoutCommodityInput, Prisma.CommodityAverageUncheckedCreateWithoutCommodityInput>;
    connectOrCreate?: Prisma.CommodityAverageCreateOrConnectWithoutCommodityInput;
    upsert?: Prisma.CommodityAverageUpsertWithoutCommodityInput;
    disconnect?: Prisma.CommodityAverageWhereInput | boolean;
    delete?: Prisma.CommodityAverageWhereInput | boolean;
    connect?: Prisma.CommodityAverageWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.CommodityAverageUpdateToOneWithWhereWithoutCommodityInput, Prisma.CommodityAverageUpdateWithoutCommodityInput>, Prisma.CommodityAverageUncheckedUpdateWithoutCommodityInput>;
};
export type CommodityAverageUncheckedUpdateOneWithoutCommodityNestedInput = {
    create?: Prisma.XOR<Prisma.CommodityAverageCreateWithoutCommodityInput, Prisma.CommodityAverageUncheckedCreateWithoutCommodityInput>;
    connectOrCreate?: Prisma.CommodityAverageCreateOrConnectWithoutCommodityInput;
    upsert?: Prisma.CommodityAverageUpsertWithoutCommodityInput;
    disconnect?: Prisma.CommodityAverageWhereInput | boolean;
    delete?: Prisma.CommodityAverageWhereInput | boolean;
    connect?: Prisma.CommodityAverageWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.CommodityAverageUpdateToOneWithWhereWithoutCommodityInput, Prisma.CommodityAverageUpdateWithoutCommodityInput>, Prisma.CommodityAverageUncheckedUpdateWithoutCommodityInput>;
};
export type CommodityAverageCreateWithoutCommodityInput = {
    priceBuyAvg?: number | null;
    priceSellAvg?: number | null;
    scuBuyMax?: number | null;
    scuBuyAvg?: number | null;
    scuSellMax?: number | null;
    scuSellAvg?: number | null;
    statusBuyAvg?: number | null;
    statusSellAvg?: number | null;
    caxScore?: number | null;
    gameVersion?: string | null;
    dateModified?: number | null;
    fetchedAt: Date | string;
};
export type CommodityAverageUncheckedCreateWithoutCommodityInput = {
    priceBuyAvg?: number | null;
    priceSellAvg?: number | null;
    scuBuyMax?: number | null;
    scuBuyAvg?: number | null;
    scuSellMax?: number | null;
    scuSellAvg?: number | null;
    statusBuyAvg?: number | null;
    statusSellAvg?: number | null;
    caxScore?: number | null;
    gameVersion?: string | null;
    dateModified?: number | null;
    fetchedAt: Date | string;
};
export type CommodityAverageCreateOrConnectWithoutCommodityInput = {
    where: Prisma.CommodityAverageWhereUniqueInput;
    create: Prisma.XOR<Prisma.CommodityAverageCreateWithoutCommodityInput, Prisma.CommodityAverageUncheckedCreateWithoutCommodityInput>;
};
export type CommodityAverageUpsertWithoutCommodityInput = {
    update: Prisma.XOR<Prisma.CommodityAverageUpdateWithoutCommodityInput, Prisma.CommodityAverageUncheckedUpdateWithoutCommodityInput>;
    create: Prisma.XOR<Prisma.CommodityAverageCreateWithoutCommodityInput, Prisma.CommodityAverageUncheckedCreateWithoutCommodityInput>;
    where?: Prisma.CommodityAverageWhereInput;
};
export type CommodityAverageUpdateToOneWithWhereWithoutCommodityInput = {
    where?: Prisma.CommodityAverageWhereInput;
    data: Prisma.XOR<Prisma.CommodityAverageUpdateWithoutCommodityInput, Prisma.CommodityAverageUncheckedUpdateWithoutCommodityInput>;
};
export type CommodityAverageUpdateWithoutCommodityInput = {
    priceBuyAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    priceSellAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    scuBuyMax?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    scuBuyAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    scuSellMax?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    scuSellAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    statusBuyAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    statusSellAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    caxScore?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    gameVersion?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dateModified?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    fetchedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CommodityAverageUncheckedUpdateWithoutCommodityInput = {
    priceBuyAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    priceSellAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    scuBuyMax?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    scuBuyAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    scuSellMax?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    scuSellAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    statusBuyAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    statusSellAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    caxScore?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    gameVersion?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dateModified?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    fetchedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CommodityAverageSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    commodityId?: boolean;
    priceBuyAvg?: boolean;
    priceSellAvg?: boolean;
    scuBuyMax?: boolean;
    scuBuyAvg?: boolean;
    scuSellMax?: boolean;
    scuSellAvg?: boolean;
    statusBuyAvg?: boolean;
    statusSellAvg?: boolean;
    caxScore?: boolean;
    gameVersion?: boolean;
    dateModified?: boolean;
    fetchedAt?: boolean;
    commodity?: boolean | Prisma.CommodityDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["commodityAverage"]>;
export type CommodityAverageSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    commodityId?: boolean;
    priceBuyAvg?: boolean;
    priceSellAvg?: boolean;
    scuBuyMax?: boolean;
    scuBuyAvg?: boolean;
    scuSellMax?: boolean;
    scuSellAvg?: boolean;
    statusBuyAvg?: boolean;
    statusSellAvg?: boolean;
    caxScore?: boolean;
    gameVersion?: boolean;
    dateModified?: boolean;
    fetchedAt?: boolean;
    commodity?: boolean | Prisma.CommodityDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["commodityAverage"]>;
export type CommodityAverageSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    commodityId?: boolean;
    priceBuyAvg?: boolean;
    priceSellAvg?: boolean;
    scuBuyMax?: boolean;
    scuBuyAvg?: boolean;
    scuSellMax?: boolean;
    scuSellAvg?: boolean;
    statusBuyAvg?: boolean;
    statusSellAvg?: boolean;
    caxScore?: boolean;
    gameVersion?: boolean;
    dateModified?: boolean;
    fetchedAt?: boolean;
    commodity?: boolean | Prisma.CommodityDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["commodityAverage"]>;
export type CommodityAverageSelectScalar = {
    commodityId?: boolean;
    priceBuyAvg?: boolean;
    priceSellAvg?: boolean;
    scuBuyMax?: boolean;
    scuBuyAvg?: boolean;
    scuSellMax?: boolean;
    scuSellAvg?: boolean;
    statusBuyAvg?: boolean;
    statusSellAvg?: boolean;
    caxScore?: boolean;
    gameVersion?: boolean;
    dateModified?: boolean;
    fetchedAt?: boolean;
};
export type CommodityAverageOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"commodityId" | "priceBuyAvg" | "priceSellAvg" | "scuBuyMax" | "scuBuyAvg" | "scuSellMax" | "scuSellAvg" | "statusBuyAvg" | "statusSellAvg" | "caxScore" | "gameVersion" | "dateModified" | "fetchedAt", ExtArgs["result"]["commodityAverage"]>;
export type CommodityAverageInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    commodity?: boolean | Prisma.CommodityDefaultArgs<ExtArgs>;
};
export type CommodityAverageIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    commodity?: boolean | Prisma.CommodityDefaultArgs<ExtArgs>;
};
export type CommodityAverageIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    commodity?: boolean | Prisma.CommodityDefaultArgs<ExtArgs>;
};
export type $CommodityAveragePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "CommodityAverage";
    objects: {
        commodity: Prisma.$CommodityPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        commodityId: number;
        priceBuyAvg: number | null;
        priceSellAvg: number | null;
        scuBuyMax: number | null;
        scuBuyAvg: number | null;
        scuSellMax: number | null;
        scuSellAvg: number | null;
        statusBuyAvg: number | null;
        statusSellAvg: number | null;
        caxScore: number | null;
        gameVersion: string | null;
        dateModified: number | null;
        fetchedAt: Date;
    }, ExtArgs["result"]["commodityAverage"]>;
    composites: {};
};
export type CommodityAverageGetPayload<S extends boolean | null | undefined | CommodityAverageDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$CommodityAveragePayload, S>;
export type CommodityAverageCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<CommodityAverageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: CommodityAverageCountAggregateInputType | true;
};
export interface CommodityAverageDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['CommodityAverage'];
        meta: {
            name: 'CommodityAverage';
        };
    };
    findUnique<T extends CommodityAverageFindUniqueArgs>(args: Prisma.SelectSubset<T, CommodityAverageFindUniqueArgs<ExtArgs>>): Prisma.Prisma__CommodityAverageClient<runtime.Types.Result.GetResult<Prisma.$CommodityAveragePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends CommodityAverageFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, CommodityAverageFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__CommodityAverageClient<runtime.Types.Result.GetResult<Prisma.$CommodityAveragePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends CommodityAverageFindFirstArgs>(args?: Prisma.SelectSubset<T, CommodityAverageFindFirstArgs<ExtArgs>>): Prisma.Prisma__CommodityAverageClient<runtime.Types.Result.GetResult<Prisma.$CommodityAveragePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends CommodityAverageFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, CommodityAverageFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__CommodityAverageClient<runtime.Types.Result.GetResult<Prisma.$CommodityAveragePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends CommodityAverageFindManyArgs>(args?: Prisma.SelectSubset<T, CommodityAverageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CommodityAveragePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends CommodityAverageCreateArgs>(args: Prisma.SelectSubset<T, CommodityAverageCreateArgs<ExtArgs>>): Prisma.Prisma__CommodityAverageClient<runtime.Types.Result.GetResult<Prisma.$CommodityAveragePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends CommodityAverageCreateManyArgs>(args?: Prisma.SelectSubset<T, CommodityAverageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends CommodityAverageCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, CommodityAverageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CommodityAveragePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends CommodityAverageDeleteArgs>(args: Prisma.SelectSubset<T, CommodityAverageDeleteArgs<ExtArgs>>): Prisma.Prisma__CommodityAverageClient<runtime.Types.Result.GetResult<Prisma.$CommodityAveragePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends CommodityAverageUpdateArgs>(args: Prisma.SelectSubset<T, CommodityAverageUpdateArgs<ExtArgs>>): Prisma.Prisma__CommodityAverageClient<runtime.Types.Result.GetResult<Prisma.$CommodityAveragePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends CommodityAverageDeleteManyArgs>(args?: Prisma.SelectSubset<T, CommodityAverageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends CommodityAverageUpdateManyArgs>(args: Prisma.SelectSubset<T, CommodityAverageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends CommodityAverageUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, CommodityAverageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CommodityAveragePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends CommodityAverageUpsertArgs>(args: Prisma.SelectSubset<T, CommodityAverageUpsertArgs<ExtArgs>>): Prisma.Prisma__CommodityAverageClient<runtime.Types.Result.GetResult<Prisma.$CommodityAveragePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends CommodityAverageCountArgs>(args?: Prisma.Subset<T, CommodityAverageCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], CommodityAverageCountAggregateOutputType> : number>;
    aggregate<T extends CommodityAverageAggregateArgs>(args: Prisma.Subset<T, CommodityAverageAggregateArgs>): Prisma.PrismaPromise<GetCommodityAverageAggregateType<T>>;
    groupBy<T extends CommodityAverageGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: CommodityAverageGroupByArgs['orderBy'];
    } : {
        orderBy?: CommodityAverageGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, CommodityAverageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCommodityAverageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: CommodityAverageFieldRefs;
}
export interface Prisma__CommodityAverageClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    commodity<T extends Prisma.CommodityDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CommodityDefaultArgs<ExtArgs>>): Prisma.Prisma__CommodityClient<runtime.Types.Result.GetResult<Prisma.$CommodityPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface CommodityAverageFieldRefs {
    readonly commodityId: Prisma.FieldRef<"CommodityAverage", 'Int'>;
    readonly priceBuyAvg: Prisma.FieldRef<"CommodityAverage", 'Float'>;
    readonly priceSellAvg: Prisma.FieldRef<"CommodityAverage", 'Float'>;
    readonly scuBuyMax: Prisma.FieldRef<"CommodityAverage", 'Int'>;
    readonly scuBuyAvg: Prisma.FieldRef<"CommodityAverage", 'Float'>;
    readonly scuSellMax: Prisma.FieldRef<"CommodityAverage", 'Int'>;
    readonly scuSellAvg: Prisma.FieldRef<"CommodityAverage", 'Float'>;
    readonly statusBuyAvg: Prisma.FieldRef<"CommodityAverage", 'Float'>;
    readonly statusSellAvg: Prisma.FieldRef<"CommodityAverage", 'Float'>;
    readonly caxScore: Prisma.FieldRef<"CommodityAverage", 'Int'>;
    readonly gameVersion: Prisma.FieldRef<"CommodityAverage", 'String'>;
    readonly dateModified: Prisma.FieldRef<"CommodityAverage", 'Int'>;
    readonly fetchedAt: Prisma.FieldRef<"CommodityAverage", 'DateTime'>;
}
export type CommodityAverageFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommodityAverageSelect<ExtArgs> | null;
    omit?: Prisma.CommodityAverageOmit<ExtArgs> | null;
    include?: Prisma.CommodityAverageInclude<ExtArgs> | null;
    where: Prisma.CommodityAverageWhereUniqueInput;
};
export type CommodityAverageFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommodityAverageSelect<ExtArgs> | null;
    omit?: Prisma.CommodityAverageOmit<ExtArgs> | null;
    include?: Prisma.CommodityAverageInclude<ExtArgs> | null;
    where: Prisma.CommodityAverageWhereUniqueInput;
};
export type CommodityAverageFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommodityAverageSelect<ExtArgs> | null;
    omit?: Prisma.CommodityAverageOmit<ExtArgs> | null;
    include?: Prisma.CommodityAverageInclude<ExtArgs> | null;
    where?: Prisma.CommodityAverageWhereInput;
    orderBy?: Prisma.CommodityAverageOrderByWithRelationInput | Prisma.CommodityAverageOrderByWithRelationInput[];
    cursor?: Prisma.CommodityAverageWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CommodityAverageScalarFieldEnum | Prisma.CommodityAverageScalarFieldEnum[];
};
export type CommodityAverageFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommodityAverageSelect<ExtArgs> | null;
    omit?: Prisma.CommodityAverageOmit<ExtArgs> | null;
    include?: Prisma.CommodityAverageInclude<ExtArgs> | null;
    where?: Prisma.CommodityAverageWhereInput;
    orderBy?: Prisma.CommodityAverageOrderByWithRelationInput | Prisma.CommodityAverageOrderByWithRelationInput[];
    cursor?: Prisma.CommodityAverageWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CommodityAverageScalarFieldEnum | Prisma.CommodityAverageScalarFieldEnum[];
};
export type CommodityAverageFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommodityAverageSelect<ExtArgs> | null;
    omit?: Prisma.CommodityAverageOmit<ExtArgs> | null;
    include?: Prisma.CommodityAverageInclude<ExtArgs> | null;
    where?: Prisma.CommodityAverageWhereInput;
    orderBy?: Prisma.CommodityAverageOrderByWithRelationInput | Prisma.CommodityAverageOrderByWithRelationInput[];
    cursor?: Prisma.CommodityAverageWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CommodityAverageScalarFieldEnum | Prisma.CommodityAverageScalarFieldEnum[];
};
export type CommodityAverageCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommodityAverageSelect<ExtArgs> | null;
    omit?: Prisma.CommodityAverageOmit<ExtArgs> | null;
    include?: Prisma.CommodityAverageInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CommodityAverageCreateInput, Prisma.CommodityAverageUncheckedCreateInput>;
};
export type CommodityAverageCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.CommodityAverageCreateManyInput | Prisma.CommodityAverageCreateManyInput[];
    skipDuplicates?: boolean;
};
export type CommodityAverageCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommodityAverageSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CommodityAverageOmit<ExtArgs> | null;
    data: Prisma.CommodityAverageCreateManyInput | Prisma.CommodityAverageCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.CommodityAverageIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type CommodityAverageUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommodityAverageSelect<ExtArgs> | null;
    omit?: Prisma.CommodityAverageOmit<ExtArgs> | null;
    include?: Prisma.CommodityAverageInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CommodityAverageUpdateInput, Prisma.CommodityAverageUncheckedUpdateInput>;
    where: Prisma.CommodityAverageWhereUniqueInput;
};
export type CommodityAverageUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.CommodityAverageUpdateManyMutationInput, Prisma.CommodityAverageUncheckedUpdateManyInput>;
    where?: Prisma.CommodityAverageWhereInput;
    limit?: number;
};
export type CommodityAverageUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommodityAverageSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CommodityAverageOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CommodityAverageUpdateManyMutationInput, Prisma.CommodityAverageUncheckedUpdateManyInput>;
    where?: Prisma.CommodityAverageWhereInput;
    limit?: number;
    include?: Prisma.CommodityAverageIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type CommodityAverageUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommodityAverageSelect<ExtArgs> | null;
    omit?: Prisma.CommodityAverageOmit<ExtArgs> | null;
    include?: Prisma.CommodityAverageInclude<ExtArgs> | null;
    where: Prisma.CommodityAverageWhereUniqueInput;
    create: Prisma.XOR<Prisma.CommodityAverageCreateInput, Prisma.CommodityAverageUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.CommodityAverageUpdateInput, Prisma.CommodityAverageUncheckedUpdateInput>;
};
export type CommodityAverageDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommodityAverageSelect<ExtArgs> | null;
    omit?: Prisma.CommodityAverageOmit<ExtArgs> | null;
    include?: Prisma.CommodityAverageInclude<ExtArgs> | null;
    where: Prisma.CommodityAverageWhereUniqueInput;
};
export type CommodityAverageDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CommodityAverageWhereInput;
    limit?: number;
};
export type CommodityAverageDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommodityAverageSelect<ExtArgs> | null;
    omit?: Prisma.CommodityAverageOmit<ExtArgs> | null;
    include?: Prisma.CommodityAverageInclude<ExtArgs> | null;
};
