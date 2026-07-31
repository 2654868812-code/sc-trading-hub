import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type TerminalCommodityMaxModel = runtime.Types.Result.DefaultSelection<Prisma.$TerminalCommodityMaxPayload>;
export type AggregateTerminalCommodityMax = {
    _count: TerminalCommodityMaxCountAggregateOutputType | null;
    _avg: TerminalCommodityMaxAvgAggregateOutputType | null;
    _sum: TerminalCommodityMaxSumAggregateOutputType | null;
    _min: TerminalCommodityMaxMinAggregateOutputType | null;
    _max: TerminalCommodityMaxMaxAggregateOutputType | null;
};
export type TerminalCommodityMaxAvgAggregateOutputType = {
    commodityId: number | null;
    terminalId: number | null;
    scuBuyMax: number | null;
    scuSellMax: number | null;
    scuBuyAvg: number | null;
    scuSellAvg: number | null;
    dateModified: number | null;
};
export type TerminalCommodityMaxSumAggregateOutputType = {
    commodityId: number | null;
    terminalId: number | null;
    scuBuyMax: number | null;
    scuSellMax: number | null;
    scuBuyAvg: number | null;
    scuSellAvg: number | null;
    dateModified: number | null;
};
export type TerminalCommodityMaxMinAggregateOutputType = {
    commodityId: number | null;
    terminalId: number | null;
    scuBuyMax: number | null;
    scuSellMax: number | null;
    scuBuyAvg: number | null;
    scuSellAvg: number | null;
    dateModified: number | null;
    fetchedAt: Date | null;
};
export type TerminalCommodityMaxMaxAggregateOutputType = {
    commodityId: number | null;
    terminalId: number | null;
    scuBuyMax: number | null;
    scuSellMax: number | null;
    scuBuyAvg: number | null;
    scuSellAvg: number | null;
    dateModified: number | null;
    fetchedAt: Date | null;
};
export type TerminalCommodityMaxCountAggregateOutputType = {
    commodityId: number;
    terminalId: number;
    scuBuyMax: number;
    scuSellMax: number;
    scuBuyAvg: number;
    scuSellAvg: number;
    dateModified: number;
    fetchedAt: number;
    _all: number;
};
export type TerminalCommodityMaxAvgAggregateInputType = {
    commodityId?: true;
    terminalId?: true;
    scuBuyMax?: true;
    scuSellMax?: true;
    scuBuyAvg?: true;
    scuSellAvg?: true;
    dateModified?: true;
};
export type TerminalCommodityMaxSumAggregateInputType = {
    commodityId?: true;
    terminalId?: true;
    scuBuyMax?: true;
    scuSellMax?: true;
    scuBuyAvg?: true;
    scuSellAvg?: true;
    dateModified?: true;
};
export type TerminalCommodityMaxMinAggregateInputType = {
    commodityId?: true;
    terminalId?: true;
    scuBuyMax?: true;
    scuSellMax?: true;
    scuBuyAvg?: true;
    scuSellAvg?: true;
    dateModified?: true;
    fetchedAt?: true;
};
export type TerminalCommodityMaxMaxAggregateInputType = {
    commodityId?: true;
    terminalId?: true;
    scuBuyMax?: true;
    scuSellMax?: true;
    scuBuyAvg?: true;
    scuSellAvg?: true;
    dateModified?: true;
    fetchedAt?: true;
};
export type TerminalCommodityMaxCountAggregateInputType = {
    commodityId?: true;
    terminalId?: true;
    scuBuyMax?: true;
    scuSellMax?: true;
    scuBuyAvg?: true;
    scuSellAvg?: true;
    dateModified?: true;
    fetchedAt?: true;
    _all?: true;
};
export type TerminalCommodityMaxAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TerminalCommodityMaxWhereInput;
    orderBy?: Prisma.TerminalCommodityMaxOrderByWithRelationInput | Prisma.TerminalCommodityMaxOrderByWithRelationInput[];
    cursor?: Prisma.TerminalCommodityMaxWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | TerminalCommodityMaxCountAggregateInputType;
    _avg?: TerminalCommodityMaxAvgAggregateInputType;
    _sum?: TerminalCommodityMaxSumAggregateInputType;
    _min?: TerminalCommodityMaxMinAggregateInputType;
    _max?: TerminalCommodityMaxMaxAggregateInputType;
};
export type GetTerminalCommodityMaxAggregateType<T extends TerminalCommodityMaxAggregateArgs> = {
    [P in keyof T & keyof AggregateTerminalCommodityMax]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateTerminalCommodityMax[P]> : Prisma.GetScalarType<T[P], AggregateTerminalCommodityMax[P]>;
};
export type TerminalCommodityMaxGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TerminalCommodityMaxWhereInput;
    orderBy?: Prisma.TerminalCommodityMaxOrderByWithAggregationInput | Prisma.TerminalCommodityMaxOrderByWithAggregationInput[];
    by: Prisma.TerminalCommodityMaxScalarFieldEnum[] | Prisma.TerminalCommodityMaxScalarFieldEnum;
    having?: Prisma.TerminalCommodityMaxScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: TerminalCommodityMaxCountAggregateInputType | true;
    _avg?: TerminalCommodityMaxAvgAggregateInputType;
    _sum?: TerminalCommodityMaxSumAggregateInputType;
    _min?: TerminalCommodityMaxMinAggregateInputType;
    _max?: TerminalCommodityMaxMaxAggregateInputType;
};
export type TerminalCommodityMaxGroupByOutputType = {
    commodityId: number;
    terminalId: number;
    scuBuyMax: number | null;
    scuSellMax: number | null;
    scuBuyAvg: number | null;
    scuSellAvg: number | null;
    dateModified: number | null;
    fetchedAt: Date;
    _count: TerminalCommodityMaxCountAggregateOutputType | null;
    _avg: TerminalCommodityMaxAvgAggregateOutputType | null;
    _sum: TerminalCommodityMaxSumAggregateOutputType | null;
    _min: TerminalCommodityMaxMinAggregateOutputType | null;
    _max: TerminalCommodityMaxMaxAggregateOutputType | null;
};
export type GetTerminalCommodityMaxGroupByPayload<T extends TerminalCommodityMaxGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<TerminalCommodityMaxGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof TerminalCommodityMaxGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], TerminalCommodityMaxGroupByOutputType[P]> : Prisma.GetScalarType<T[P], TerminalCommodityMaxGroupByOutputType[P]>;
}>>;
export type TerminalCommodityMaxWhereInput = {
    AND?: Prisma.TerminalCommodityMaxWhereInput | Prisma.TerminalCommodityMaxWhereInput[];
    OR?: Prisma.TerminalCommodityMaxWhereInput[];
    NOT?: Prisma.TerminalCommodityMaxWhereInput | Prisma.TerminalCommodityMaxWhereInput[];
    commodityId?: Prisma.IntFilter<"TerminalCommodityMax"> | number;
    terminalId?: Prisma.IntFilter<"TerminalCommodityMax"> | number;
    scuBuyMax?: Prisma.IntNullableFilter<"TerminalCommodityMax"> | number | null;
    scuSellMax?: Prisma.IntNullableFilter<"TerminalCommodityMax"> | number | null;
    scuBuyAvg?: Prisma.FloatNullableFilter<"TerminalCommodityMax"> | number | null;
    scuSellAvg?: Prisma.FloatNullableFilter<"TerminalCommodityMax"> | number | null;
    dateModified?: Prisma.IntNullableFilter<"TerminalCommodityMax"> | number | null;
    fetchedAt?: Prisma.DateTimeFilter<"TerminalCommodityMax"> | Date | string;
    commodity?: Prisma.XOR<Prisma.CommodityScalarRelationFilter, Prisma.CommodityWhereInput>;
    terminal?: Prisma.XOR<Prisma.TerminalScalarRelationFilter, Prisma.TerminalWhereInput>;
};
export type TerminalCommodityMaxOrderByWithRelationInput = {
    commodityId?: Prisma.SortOrder;
    terminalId?: Prisma.SortOrder;
    scuBuyMax?: Prisma.SortOrderInput | Prisma.SortOrder;
    scuSellMax?: Prisma.SortOrderInput | Prisma.SortOrder;
    scuBuyAvg?: Prisma.SortOrderInput | Prisma.SortOrder;
    scuSellAvg?: Prisma.SortOrderInput | Prisma.SortOrder;
    dateModified?: Prisma.SortOrderInput | Prisma.SortOrder;
    fetchedAt?: Prisma.SortOrder;
    commodity?: Prisma.CommodityOrderByWithRelationInput;
    terminal?: Prisma.TerminalOrderByWithRelationInput;
};
export type TerminalCommodityMaxWhereUniqueInput = Prisma.AtLeast<{
    commodityId_terminalId?: Prisma.TerminalCommodityMaxCommodityIdTerminalIdCompoundUniqueInput;
    AND?: Prisma.TerminalCommodityMaxWhereInput | Prisma.TerminalCommodityMaxWhereInput[];
    OR?: Prisma.TerminalCommodityMaxWhereInput[];
    NOT?: Prisma.TerminalCommodityMaxWhereInput | Prisma.TerminalCommodityMaxWhereInput[];
    commodityId?: Prisma.IntFilter<"TerminalCommodityMax"> | number;
    terminalId?: Prisma.IntFilter<"TerminalCommodityMax"> | number;
    scuBuyMax?: Prisma.IntNullableFilter<"TerminalCommodityMax"> | number | null;
    scuSellMax?: Prisma.IntNullableFilter<"TerminalCommodityMax"> | number | null;
    scuBuyAvg?: Prisma.FloatNullableFilter<"TerminalCommodityMax"> | number | null;
    scuSellAvg?: Prisma.FloatNullableFilter<"TerminalCommodityMax"> | number | null;
    dateModified?: Prisma.IntNullableFilter<"TerminalCommodityMax"> | number | null;
    fetchedAt?: Prisma.DateTimeFilter<"TerminalCommodityMax"> | Date | string;
    commodity?: Prisma.XOR<Prisma.CommodityScalarRelationFilter, Prisma.CommodityWhereInput>;
    terminal?: Prisma.XOR<Prisma.TerminalScalarRelationFilter, Prisma.TerminalWhereInput>;
}, "commodityId_terminalId">;
export type TerminalCommodityMaxOrderByWithAggregationInput = {
    commodityId?: Prisma.SortOrder;
    terminalId?: Prisma.SortOrder;
    scuBuyMax?: Prisma.SortOrderInput | Prisma.SortOrder;
    scuSellMax?: Prisma.SortOrderInput | Prisma.SortOrder;
    scuBuyAvg?: Prisma.SortOrderInput | Prisma.SortOrder;
    scuSellAvg?: Prisma.SortOrderInput | Prisma.SortOrder;
    dateModified?: Prisma.SortOrderInput | Prisma.SortOrder;
    fetchedAt?: Prisma.SortOrder;
    _count?: Prisma.TerminalCommodityMaxCountOrderByAggregateInput;
    _avg?: Prisma.TerminalCommodityMaxAvgOrderByAggregateInput;
    _max?: Prisma.TerminalCommodityMaxMaxOrderByAggregateInput;
    _min?: Prisma.TerminalCommodityMaxMinOrderByAggregateInput;
    _sum?: Prisma.TerminalCommodityMaxSumOrderByAggregateInput;
};
export type TerminalCommodityMaxScalarWhereWithAggregatesInput = {
    AND?: Prisma.TerminalCommodityMaxScalarWhereWithAggregatesInput | Prisma.TerminalCommodityMaxScalarWhereWithAggregatesInput[];
    OR?: Prisma.TerminalCommodityMaxScalarWhereWithAggregatesInput[];
    NOT?: Prisma.TerminalCommodityMaxScalarWhereWithAggregatesInput | Prisma.TerminalCommodityMaxScalarWhereWithAggregatesInput[];
    commodityId?: Prisma.IntWithAggregatesFilter<"TerminalCommodityMax"> | number;
    terminalId?: Prisma.IntWithAggregatesFilter<"TerminalCommodityMax"> | number;
    scuBuyMax?: Prisma.IntNullableWithAggregatesFilter<"TerminalCommodityMax"> | number | null;
    scuSellMax?: Prisma.IntNullableWithAggregatesFilter<"TerminalCommodityMax"> | number | null;
    scuBuyAvg?: Prisma.FloatNullableWithAggregatesFilter<"TerminalCommodityMax"> | number | null;
    scuSellAvg?: Prisma.FloatNullableWithAggregatesFilter<"TerminalCommodityMax"> | number | null;
    dateModified?: Prisma.IntNullableWithAggregatesFilter<"TerminalCommodityMax"> | number | null;
    fetchedAt?: Prisma.DateTimeWithAggregatesFilter<"TerminalCommodityMax"> | Date | string;
};
export type TerminalCommodityMaxCreateInput = {
    scuBuyMax?: number | null;
    scuSellMax?: number | null;
    scuBuyAvg?: number | null;
    scuSellAvg?: number | null;
    dateModified?: number | null;
    fetchedAt: Date | string;
    commodity: Prisma.CommodityCreateNestedOneWithoutTerminalMaxInput;
    terminal: Prisma.TerminalCreateNestedOneWithoutTerminalMaxInput;
};
export type TerminalCommodityMaxUncheckedCreateInput = {
    commodityId: number;
    terminalId: number;
    scuBuyMax?: number | null;
    scuSellMax?: number | null;
    scuBuyAvg?: number | null;
    scuSellAvg?: number | null;
    dateModified?: number | null;
    fetchedAt: Date | string;
};
export type TerminalCommodityMaxUpdateInput = {
    scuBuyMax?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    scuSellMax?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    scuBuyAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    scuSellAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    dateModified?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    fetchedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    commodity?: Prisma.CommodityUpdateOneRequiredWithoutTerminalMaxNestedInput;
    terminal?: Prisma.TerminalUpdateOneRequiredWithoutTerminalMaxNestedInput;
};
export type TerminalCommodityMaxUncheckedUpdateInput = {
    commodityId?: Prisma.IntFieldUpdateOperationsInput | number;
    terminalId?: Prisma.IntFieldUpdateOperationsInput | number;
    scuBuyMax?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    scuSellMax?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    scuBuyAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    scuSellAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    dateModified?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    fetchedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TerminalCommodityMaxCreateManyInput = {
    commodityId: number;
    terminalId: number;
    scuBuyMax?: number | null;
    scuSellMax?: number | null;
    scuBuyAvg?: number | null;
    scuSellAvg?: number | null;
    dateModified?: number | null;
    fetchedAt: Date | string;
};
export type TerminalCommodityMaxUpdateManyMutationInput = {
    scuBuyMax?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    scuSellMax?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    scuBuyAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    scuSellAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    dateModified?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    fetchedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TerminalCommodityMaxUncheckedUpdateManyInput = {
    commodityId?: Prisma.IntFieldUpdateOperationsInput | number;
    terminalId?: Prisma.IntFieldUpdateOperationsInput | number;
    scuBuyMax?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    scuSellMax?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    scuBuyAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    scuSellAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    dateModified?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    fetchedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TerminalCommodityMaxListRelationFilter = {
    every?: Prisma.TerminalCommodityMaxWhereInput;
    some?: Prisma.TerminalCommodityMaxWhereInput;
    none?: Prisma.TerminalCommodityMaxWhereInput;
};
export type TerminalCommodityMaxOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type TerminalCommodityMaxCommodityIdTerminalIdCompoundUniqueInput = {
    commodityId: number;
    terminalId: number;
};
export type TerminalCommodityMaxCountOrderByAggregateInput = {
    commodityId?: Prisma.SortOrder;
    terminalId?: Prisma.SortOrder;
    scuBuyMax?: Prisma.SortOrder;
    scuSellMax?: Prisma.SortOrder;
    scuBuyAvg?: Prisma.SortOrder;
    scuSellAvg?: Prisma.SortOrder;
    dateModified?: Prisma.SortOrder;
    fetchedAt?: Prisma.SortOrder;
};
export type TerminalCommodityMaxAvgOrderByAggregateInput = {
    commodityId?: Prisma.SortOrder;
    terminalId?: Prisma.SortOrder;
    scuBuyMax?: Prisma.SortOrder;
    scuSellMax?: Prisma.SortOrder;
    scuBuyAvg?: Prisma.SortOrder;
    scuSellAvg?: Prisma.SortOrder;
    dateModified?: Prisma.SortOrder;
};
export type TerminalCommodityMaxMaxOrderByAggregateInput = {
    commodityId?: Prisma.SortOrder;
    terminalId?: Prisma.SortOrder;
    scuBuyMax?: Prisma.SortOrder;
    scuSellMax?: Prisma.SortOrder;
    scuBuyAvg?: Prisma.SortOrder;
    scuSellAvg?: Prisma.SortOrder;
    dateModified?: Prisma.SortOrder;
    fetchedAt?: Prisma.SortOrder;
};
export type TerminalCommodityMaxMinOrderByAggregateInput = {
    commodityId?: Prisma.SortOrder;
    terminalId?: Prisma.SortOrder;
    scuBuyMax?: Prisma.SortOrder;
    scuSellMax?: Prisma.SortOrder;
    scuBuyAvg?: Prisma.SortOrder;
    scuSellAvg?: Prisma.SortOrder;
    dateModified?: Prisma.SortOrder;
    fetchedAt?: Prisma.SortOrder;
};
export type TerminalCommodityMaxSumOrderByAggregateInput = {
    commodityId?: Prisma.SortOrder;
    terminalId?: Prisma.SortOrder;
    scuBuyMax?: Prisma.SortOrder;
    scuSellMax?: Prisma.SortOrder;
    scuBuyAvg?: Prisma.SortOrder;
    scuSellAvg?: Prisma.SortOrder;
    dateModified?: Prisma.SortOrder;
};
export type TerminalCommodityMaxCreateNestedManyWithoutCommodityInput = {
    create?: Prisma.XOR<Prisma.TerminalCommodityMaxCreateWithoutCommodityInput, Prisma.TerminalCommodityMaxUncheckedCreateWithoutCommodityInput> | Prisma.TerminalCommodityMaxCreateWithoutCommodityInput[] | Prisma.TerminalCommodityMaxUncheckedCreateWithoutCommodityInput[];
    connectOrCreate?: Prisma.TerminalCommodityMaxCreateOrConnectWithoutCommodityInput | Prisma.TerminalCommodityMaxCreateOrConnectWithoutCommodityInput[];
    createMany?: Prisma.TerminalCommodityMaxCreateManyCommodityInputEnvelope;
    connect?: Prisma.TerminalCommodityMaxWhereUniqueInput | Prisma.TerminalCommodityMaxWhereUniqueInput[];
};
export type TerminalCommodityMaxUncheckedCreateNestedManyWithoutCommodityInput = {
    create?: Prisma.XOR<Prisma.TerminalCommodityMaxCreateWithoutCommodityInput, Prisma.TerminalCommodityMaxUncheckedCreateWithoutCommodityInput> | Prisma.TerminalCommodityMaxCreateWithoutCommodityInput[] | Prisma.TerminalCommodityMaxUncheckedCreateWithoutCommodityInput[];
    connectOrCreate?: Prisma.TerminalCommodityMaxCreateOrConnectWithoutCommodityInput | Prisma.TerminalCommodityMaxCreateOrConnectWithoutCommodityInput[];
    createMany?: Prisma.TerminalCommodityMaxCreateManyCommodityInputEnvelope;
    connect?: Prisma.TerminalCommodityMaxWhereUniqueInput | Prisma.TerminalCommodityMaxWhereUniqueInput[];
};
export type TerminalCommodityMaxUpdateManyWithoutCommodityNestedInput = {
    create?: Prisma.XOR<Prisma.TerminalCommodityMaxCreateWithoutCommodityInput, Prisma.TerminalCommodityMaxUncheckedCreateWithoutCommodityInput> | Prisma.TerminalCommodityMaxCreateWithoutCommodityInput[] | Prisma.TerminalCommodityMaxUncheckedCreateWithoutCommodityInput[];
    connectOrCreate?: Prisma.TerminalCommodityMaxCreateOrConnectWithoutCommodityInput | Prisma.TerminalCommodityMaxCreateOrConnectWithoutCommodityInput[];
    upsert?: Prisma.TerminalCommodityMaxUpsertWithWhereUniqueWithoutCommodityInput | Prisma.TerminalCommodityMaxUpsertWithWhereUniqueWithoutCommodityInput[];
    createMany?: Prisma.TerminalCommodityMaxCreateManyCommodityInputEnvelope;
    set?: Prisma.TerminalCommodityMaxWhereUniqueInput | Prisma.TerminalCommodityMaxWhereUniqueInput[];
    disconnect?: Prisma.TerminalCommodityMaxWhereUniqueInput | Prisma.TerminalCommodityMaxWhereUniqueInput[];
    delete?: Prisma.TerminalCommodityMaxWhereUniqueInput | Prisma.TerminalCommodityMaxWhereUniqueInput[];
    connect?: Prisma.TerminalCommodityMaxWhereUniqueInput | Prisma.TerminalCommodityMaxWhereUniqueInput[];
    update?: Prisma.TerminalCommodityMaxUpdateWithWhereUniqueWithoutCommodityInput | Prisma.TerminalCommodityMaxUpdateWithWhereUniqueWithoutCommodityInput[];
    updateMany?: Prisma.TerminalCommodityMaxUpdateManyWithWhereWithoutCommodityInput | Prisma.TerminalCommodityMaxUpdateManyWithWhereWithoutCommodityInput[];
    deleteMany?: Prisma.TerminalCommodityMaxScalarWhereInput | Prisma.TerminalCommodityMaxScalarWhereInput[];
};
export type TerminalCommodityMaxUncheckedUpdateManyWithoutCommodityNestedInput = {
    create?: Prisma.XOR<Prisma.TerminalCommodityMaxCreateWithoutCommodityInput, Prisma.TerminalCommodityMaxUncheckedCreateWithoutCommodityInput> | Prisma.TerminalCommodityMaxCreateWithoutCommodityInput[] | Prisma.TerminalCommodityMaxUncheckedCreateWithoutCommodityInput[];
    connectOrCreate?: Prisma.TerminalCommodityMaxCreateOrConnectWithoutCommodityInput | Prisma.TerminalCommodityMaxCreateOrConnectWithoutCommodityInput[];
    upsert?: Prisma.TerminalCommodityMaxUpsertWithWhereUniqueWithoutCommodityInput | Prisma.TerminalCommodityMaxUpsertWithWhereUniqueWithoutCommodityInput[];
    createMany?: Prisma.TerminalCommodityMaxCreateManyCommodityInputEnvelope;
    set?: Prisma.TerminalCommodityMaxWhereUniqueInput | Prisma.TerminalCommodityMaxWhereUniqueInput[];
    disconnect?: Prisma.TerminalCommodityMaxWhereUniqueInput | Prisma.TerminalCommodityMaxWhereUniqueInput[];
    delete?: Prisma.TerminalCommodityMaxWhereUniqueInput | Prisma.TerminalCommodityMaxWhereUniqueInput[];
    connect?: Prisma.TerminalCommodityMaxWhereUniqueInput | Prisma.TerminalCommodityMaxWhereUniqueInput[];
    update?: Prisma.TerminalCommodityMaxUpdateWithWhereUniqueWithoutCommodityInput | Prisma.TerminalCommodityMaxUpdateWithWhereUniqueWithoutCommodityInput[];
    updateMany?: Prisma.TerminalCommodityMaxUpdateManyWithWhereWithoutCommodityInput | Prisma.TerminalCommodityMaxUpdateManyWithWhereWithoutCommodityInput[];
    deleteMany?: Prisma.TerminalCommodityMaxScalarWhereInput | Prisma.TerminalCommodityMaxScalarWhereInput[];
};
export type TerminalCommodityMaxCreateNestedManyWithoutTerminalInput = {
    create?: Prisma.XOR<Prisma.TerminalCommodityMaxCreateWithoutTerminalInput, Prisma.TerminalCommodityMaxUncheckedCreateWithoutTerminalInput> | Prisma.TerminalCommodityMaxCreateWithoutTerminalInput[] | Prisma.TerminalCommodityMaxUncheckedCreateWithoutTerminalInput[];
    connectOrCreate?: Prisma.TerminalCommodityMaxCreateOrConnectWithoutTerminalInput | Prisma.TerminalCommodityMaxCreateOrConnectWithoutTerminalInput[];
    createMany?: Prisma.TerminalCommodityMaxCreateManyTerminalInputEnvelope;
    connect?: Prisma.TerminalCommodityMaxWhereUniqueInput | Prisma.TerminalCommodityMaxWhereUniqueInput[];
};
export type TerminalCommodityMaxUncheckedCreateNestedManyWithoutTerminalInput = {
    create?: Prisma.XOR<Prisma.TerminalCommodityMaxCreateWithoutTerminalInput, Prisma.TerminalCommodityMaxUncheckedCreateWithoutTerminalInput> | Prisma.TerminalCommodityMaxCreateWithoutTerminalInput[] | Prisma.TerminalCommodityMaxUncheckedCreateWithoutTerminalInput[];
    connectOrCreate?: Prisma.TerminalCommodityMaxCreateOrConnectWithoutTerminalInput | Prisma.TerminalCommodityMaxCreateOrConnectWithoutTerminalInput[];
    createMany?: Prisma.TerminalCommodityMaxCreateManyTerminalInputEnvelope;
    connect?: Prisma.TerminalCommodityMaxWhereUniqueInput | Prisma.TerminalCommodityMaxWhereUniqueInput[];
};
export type TerminalCommodityMaxUpdateManyWithoutTerminalNestedInput = {
    create?: Prisma.XOR<Prisma.TerminalCommodityMaxCreateWithoutTerminalInput, Prisma.TerminalCommodityMaxUncheckedCreateWithoutTerminalInput> | Prisma.TerminalCommodityMaxCreateWithoutTerminalInput[] | Prisma.TerminalCommodityMaxUncheckedCreateWithoutTerminalInput[];
    connectOrCreate?: Prisma.TerminalCommodityMaxCreateOrConnectWithoutTerminalInput | Prisma.TerminalCommodityMaxCreateOrConnectWithoutTerminalInput[];
    upsert?: Prisma.TerminalCommodityMaxUpsertWithWhereUniqueWithoutTerminalInput | Prisma.TerminalCommodityMaxUpsertWithWhereUniqueWithoutTerminalInput[];
    createMany?: Prisma.TerminalCommodityMaxCreateManyTerminalInputEnvelope;
    set?: Prisma.TerminalCommodityMaxWhereUniqueInput | Prisma.TerminalCommodityMaxWhereUniqueInput[];
    disconnect?: Prisma.TerminalCommodityMaxWhereUniqueInput | Prisma.TerminalCommodityMaxWhereUniqueInput[];
    delete?: Prisma.TerminalCommodityMaxWhereUniqueInput | Prisma.TerminalCommodityMaxWhereUniqueInput[];
    connect?: Prisma.TerminalCommodityMaxWhereUniqueInput | Prisma.TerminalCommodityMaxWhereUniqueInput[];
    update?: Prisma.TerminalCommodityMaxUpdateWithWhereUniqueWithoutTerminalInput | Prisma.TerminalCommodityMaxUpdateWithWhereUniqueWithoutTerminalInput[];
    updateMany?: Prisma.TerminalCommodityMaxUpdateManyWithWhereWithoutTerminalInput | Prisma.TerminalCommodityMaxUpdateManyWithWhereWithoutTerminalInput[];
    deleteMany?: Prisma.TerminalCommodityMaxScalarWhereInput | Prisma.TerminalCommodityMaxScalarWhereInput[];
};
export type TerminalCommodityMaxUncheckedUpdateManyWithoutTerminalNestedInput = {
    create?: Prisma.XOR<Prisma.TerminalCommodityMaxCreateWithoutTerminalInput, Prisma.TerminalCommodityMaxUncheckedCreateWithoutTerminalInput> | Prisma.TerminalCommodityMaxCreateWithoutTerminalInput[] | Prisma.TerminalCommodityMaxUncheckedCreateWithoutTerminalInput[];
    connectOrCreate?: Prisma.TerminalCommodityMaxCreateOrConnectWithoutTerminalInput | Prisma.TerminalCommodityMaxCreateOrConnectWithoutTerminalInput[];
    upsert?: Prisma.TerminalCommodityMaxUpsertWithWhereUniqueWithoutTerminalInput | Prisma.TerminalCommodityMaxUpsertWithWhereUniqueWithoutTerminalInput[];
    createMany?: Prisma.TerminalCommodityMaxCreateManyTerminalInputEnvelope;
    set?: Prisma.TerminalCommodityMaxWhereUniqueInput | Prisma.TerminalCommodityMaxWhereUniqueInput[];
    disconnect?: Prisma.TerminalCommodityMaxWhereUniqueInput | Prisma.TerminalCommodityMaxWhereUniqueInput[];
    delete?: Prisma.TerminalCommodityMaxWhereUniqueInput | Prisma.TerminalCommodityMaxWhereUniqueInput[];
    connect?: Prisma.TerminalCommodityMaxWhereUniqueInput | Prisma.TerminalCommodityMaxWhereUniqueInput[];
    update?: Prisma.TerminalCommodityMaxUpdateWithWhereUniqueWithoutTerminalInput | Prisma.TerminalCommodityMaxUpdateWithWhereUniqueWithoutTerminalInput[];
    updateMany?: Prisma.TerminalCommodityMaxUpdateManyWithWhereWithoutTerminalInput | Prisma.TerminalCommodityMaxUpdateManyWithWhereWithoutTerminalInput[];
    deleteMany?: Prisma.TerminalCommodityMaxScalarWhereInput | Prisma.TerminalCommodityMaxScalarWhereInput[];
};
export type TerminalCommodityMaxCreateWithoutCommodityInput = {
    scuBuyMax?: number | null;
    scuSellMax?: number | null;
    scuBuyAvg?: number | null;
    scuSellAvg?: number | null;
    dateModified?: number | null;
    fetchedAt: Date | string;
    terminal: Prisma.TerminalCreateNestedOneWithoutTerminalMaxInput;
};
export type TerminalCommodityMaxUncheckedCreateWithoutCommodityInput = {
    terminalId: number;
    scuBuyMax?: number | null;
    scuSellMax?: number | null;
    scuBuyAvg?: number | null;
    scuSellAvg?: number | null;
    dateModified?: number | null;
    fetchedAt: Date | string;
};
export type TerminalCommodityMaxCreateOrConnectWithoutCommodityInput = {
    where: Prisma.TerminalCommodityMaxWhereUniqueInput;
    create: Prisma.XOR<Prisma.TerminalCommodityMaxCreateWithoutCommodityInput, Prisma.TerminalCommodityMaxUncheckedCreateWithoutCommodityInput>;
};
export type TerminalCommodityMaxCreateManyCommodityInputEnvelope = {
    data: Prisma.TerminalCommodityMaxCreateManyCommodityInput | Prisma.TerminalCommodityMaxCreateManyCommodityInput[];
    skipDuplicates?: boolean;
};
export type TerminalCommodityMaxUpsertWithWhereUniqueWithoutCommodityInput = {
    where: Prisma.TerminalCommodityMaxWhereUniqueInput;
    update: Prisma.XOR<Prisma.TerminalCommodityMaxUpdateWithoutCommodityInput, Prisma.TerminalCommodityMaxUncheckedUpdateWithoutCommodityInput>;
    create: Prisma.XOR<Prisma.TerminalCommodityMaxCreateWithoutCommodityInput, Prisma.TerminalCommodityMaxUncheckedCreateWithoutCommodityInput>;
};
export type TerminalCommodityMaxUpdateWithWhereUniqueWithoutCommodityInput = {
    where: Prisma.TerminalCommodityMaxWhereUniqueInput;
    data: Prisma.XOR<Prisma.TerminalCommodityMaxUpdateWithoutCommodityInput, Prisma.TerminalCommodityMaxUncheckedUpdateWithoutCommodityInput>;
};
export type TerminalCommodityMaxUpdateManyWithWhereWithoutCommodityInput = {
    where: Prisma.TerminalCommodityMaxScalarWhereInput;
    data: Prisma.XOR<Prisma.TerminalCommodityMaxUpdateManyMutationInput, Prisma.TerminalCommodityMaxUncheckedUpdateManyWithoutCommodityInput>;
};
export type TerminalCommodityMaxScalarWhereInput = {
    AND?: Prisma.TerminalCommodityMaxScalarWhereInput | Prisma.TerminalCommodityMaxScalarWhereInput[];
    OR?: Prisma.TerminalCommodityMaxScalarWhereInput[];
    NOT?: Prisma.TerminalCommodityMaxScalarWhereInput | Prisma.TerminalCommodityMaxScalarWhereInput[];
    commodityId?: Prisma.IntFilter<"TerminalCommodityMax"> | number;
    terminalId?: Prisma.IntFilter<"TerminalCommodityMax"> | number;
    scuBuyMax?: Prisma.IntNullableFilter<"TerminalCommodityMax"> | number | null;
    scuSellMax?: Prisma.IntNullableFilter<"TerminalCommodityMax"> | number | null;
    scuBuyAvg?: Prisma.FloatNullableFilter<"TerminalCommodityMax"> | number | null;
    scuSellAvg?: Prisma.FloatNullableFilter<"TerminalCommodityMax"> | number | null;
    dateModified?: Prisma.IntNullableFilter<"TerminalCommodityMax"> | number | null;
    fetchedAt?: Prisma.DateTimeFilter<"TerminalCommodityMax"> | Date | string;
};
export type TerminalCommodityMaxCreateWithoutTerminalInput = {
    scuBuyMax?: number | null;
    scuSellMax?: number | null;
    scuBuyAvg?: number | null;
    scuSellAvg?: number | null;
    dateModified?: number | null;
    fetchedAt: Date | string;
    commodity: Prisma.CommodityCreateNestedOneWithoutTerminalMaxInput;
};
export type TerminalCommodityMaxUncheckedCreateWithoutTerminalInput = {
    commodityId: number;
    scuBuyMax?: number | null;
    scuSellMax?: number | null;
    scuBuyAvg?: number | null;
    scuSellAvg?: number | null;
    dateModified?: number | null;
    fetchedAt: Date | string;
};
export type TerminalCommodityMaxCreateOrConnectWithoutTerminalInput = {
    where: Prisma.TerminalCommodityMaxWhereUniqueInput;
    create: Prisma.XOR<Prisma.TerminalCommodityMaxCreateWithoutTerminalInput, Prisma.TerminalCommodityMaxUncheckedCreateWithoutTerminalInput>;
};
export type TerminalCommodityMaxCreateManyTerminalInputEnvelope = {
    data: Prisma.TerminalCommodityMaxCreateManyTerminalInput | Prisma.TerminalCommodityMaxCreateManyTerminalInput[];
    skipDuplicates?: boolean;
};
export type TerminalCommodityMaxUpsertWithWhereUniqueWithoutTerminalInput = {
    where: Prisma.TerminalCommodityMaxWhereUniqueInput;
    update: Prisma.XOR<Prisma.TerminalCommodityMaxUpdateWithoutTerminalInput, Prisma.TerminalCommodityMaxUncheckedUpdateWithoutTerminalInput>;
    create: Prisma.XOR<Prisma.TerminalCommodityMaxCreateWithoutTerminalInput, Prisma.TerminalCommodityMaxUncheckedCreateWithoutTerminalInput>;
};
export type TerminalCommodityMaxUpdateWithWhereUniqueWithoutTerminalInput = {
    where: Prisma.TerminalCommodityMaxWhereUniqueInput;
    data: Prisma.XOR<Prisma.TerminalCommodityMaxUpdateWithoutTerminalInput, Prisma.TerminalCommodityMaxUncheckedUpdateWithoutTerminalInput>;
};
export type TerminalCommodityMaxUpdateManyWithWhereWithoutTerminalInput = {
    where: Prisma.TerminalCommodityMaxScalarWhereInput;
    data: Prisma.XOR<Prisma.TerminalCommodityMaxUpdateManyMutationInput, Prisma.TerminalCommodityMaxUncheckedUpdateManyWithoutTerminalInput>;
};
export type TerminalCommodityMaxCreateManyCommodityInput = {
    terminalId: number;
    scuBuyMax?: number | null;
    scuSellMax?: number | null;
    scuBuyAvg?: number | null;
    scuSellAvg?: number | null;
    dateModified?: number | null;
    fetchedAt: Date | string;
};
export type TerminalCommodityMaxUpdateWithoutCommodityInput = {
    scuBuyMax?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    scuSellMax?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    scuBuyAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    scuSellAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    dateModified?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    fetchedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    terminal?: Prisma.TerminalUpdateOneRequiredWithoutTerminalMaxNestedInput;
};
export type TerminalCommodityMaxUncheckedUpdateWithoutCommodityInput = {
    terminalId?: Prisma.IntFieldUpdateOperationsInput | number;
    scuBuyMax?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    scuSellMax?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    scuBuyAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    scuSellAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    dateModified?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    fetchedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TerminalCommodityMaxUncheckedUpdateManyWithoutCommodityInput = {
    terminalId?: Prisma.IntFieldUpdateOperationsInput | number;
    scuBuyMax?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    scuSellMax?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    scuBuyAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    scuSellAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    dateModified?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    fetchedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TerminalCommodityMaxCreateManyTerminalInput = {
    commodityId: number;
    scuBuyMax?: number | null;
    scuSellMax?: number | null;
    scuBuyAvg?: number | null;
    scuSellAvg?: number | null;
    dateModified?: number | null;
    fetchedAt: Date | string;
};
export type TerminalCommodityMaxUpdateWithoutTerminalInput = {
    scuBuyMax?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    scuSellMax?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    scuBuyAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    scuSellAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    dateModified?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    fetchedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    commodity?: Prisma.CommodityUpdateOneRequiredWithoutTerminalMaxNestedInput;
};
export type TerminalCommodityMaxUncheckedUpdateWithoutTerminalInput = {
    commodityId?: Prisma.IntFieldUpdateOperationsInput | number;
    scuBuyMax?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    scuSellMax?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    scuBuyAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    scuSellAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    dateModified?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    fetchedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TerminalCommodityMaxUncheckedUpdateManyWithoutTerminalInput = {
    commodityId?: Prisma.IntFieldUpdateOperationsInput | number;
    scuBuyMax?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    scuSellMax?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    scuBuyAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    scuSellAvg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    dateModified?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    fetchedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TerminalCommodityMaxSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    commodityId?: boolean;
    terminalId?: boolean;
    scuBuyMax?: boolean;
    scuSellMax?: boolean;
    scuBuyAvg?: boolean;
    scuSellAvg?: boolean;
    dateModified?: boolean;
    fetchedAt?: boolean;
    commodity?: boolean | Prisma.CommodityDefaultArgs<ExtArgs>;
    terminal?: boolean | Prisma.TerminalDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["terminalCommodityMax"]>;
export type TerminalCommodityMaxSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    commodityId?: boolean;
    terminalId?: boolean;
    scuBuyMax?: boolean;
    scuSellMax?: boolean;
    scuBuyAvg?: boolean;
    scuSellAvg?: boolean;
    dateModified?: boolean;
    fetchedAt?: boolean;
    commodity?: boolean | Prisma.CommodityDefaultArgs<ExtArgs>;
    terminal?: boolean | Prisma.TerminalDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["terminalCommodityMax"]>;
export type TerminalCommodityMaxSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    commodityId?: boolean;
    terminalId?: boolean;
    scuBuyMax?: boolean;
    scuSellMax?: boolean;
    scuBuyAvg?: boolean;
    scuSellAvg?: boolean;
    dateModified?: boolean;
    fetchedAt?: boolean;
    commodity?: boolean | Prisma.CommodityDefaultArgs<ExtArgs>;
    terminal?: boolean | Prisma.TerminalDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["terminalCommodityMax"]>;
export type TerminalCommodityMaxSelectScalar = {
    commodityId?: boolean;
    terminalId?: boolean;
    scuBuyMax?: boolean;
    scuSellMax?: boolean;
    scuBuyAvg?: boolean;
    scuSellAvg?: boolean;
    dateModified?: boolean;
    fetchedAt?: boolean;
};
export type TerminalCommodityMaxOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"commodityId" | "terminalId" | "scuBuyMax" | "scuSellMax" | "scuBuyAvg" | "scuSellAvg" | "dateModified" | "fetchedAt", ExtArgs["result"]["terminalCommodityMax"]>;
export type TerminalCommodityMaxInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    commodity?: boolean | Prisma.CommodityDefaultArgs<ExtArgs>;
    terminal?: boolean | Prisma.TerminalDefaultArgs<ExtArgs>;
};
export type TerminalCommodityMaxIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    commodity?: boolean | Prisma.CommodityDefaultArgs<ExtArgs>;
    terminal?: boolean | Prisma.TerminalDefaultArgs<ExtArgs>;
};
export type TerminalCommodityMaxIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    commodity?: boolean | Prisma.CommodityDefaultArgs<ExtArgs>;
    terminal?: boolean | Prisma.TerminalDefaultArgs<ExtArgs>;
};
export type $TerminalCommodityMaxPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "TerminalCommodityMax";
    objects: {
        commodity: Prisma.$CommodityPayload<ExtArgs>;
        terminal: Prisma.$TerminalPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        commodityId: number;
        terminalId: number;
        scuBuyMax: number | null;
        scuSellMax: number | null;
        scuBuyAvg: number | null;
        scuSellAvg: number | null;
        dateModified: number | null;
        fetchedAt: Date;
    }, ExtArgs["result"]["terminalCommodityMax"]>;
    composites: {};
};
export type TerminalCommodityMaxGetPayload<S extends boolean | null | undefined | TerminalCommodityMaxDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$TerminalCommodityMaxPayload, S>;
export type TerminalCommodityMaxCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<TerminalCommodityMaxFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: TerminalCommodityMaxCountAggregateInputType | true;
};
export interface TerminalCommodityMaxDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['TerminalCommodityMax'];
        meta: {
            name: 'TerminalCommodityMax';
        };
    };
    findUnique<T extends TerminalCommodityMaxFindUniqueArgs>(args: Prisma.SelectSubset<T, TerminalCommodityMaxFindUniqueArgs<ExtArgs>>): Prisma.Prisma__TerminalCommodityMaxClient<runtime.Types.Result.GetResult<Prisma.$TerminalCommodityMaxPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends TerminalCommodityMaxFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, TerminalCommodityMaxFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__TerminalCommodityMaxClient<runtime.Types.Result.GetResult<Prisma.$TerminalCommodityMaxPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends TerminalCommodityMaxFindFirstArgs>(args?: Prisma.SelectSubset<T, TerminalCommodityMaxFindFirstArgs<ExtArgs>>): Prisma.Prisma__TerminalCommodityMaxClient<runtime.Types.Result.GetResult<Prisma.$TerminalCommodityMaxPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends TerminalCommodityMaxFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, TerminalCommodityMaxFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__TerminalCommodityMaxClient<runtime.Types.Result.GetResult<Prisma.$TerminalCommodityMaxPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends TerminalCommodityMaxFindManyArgs>(args?: Prisma.SelectSubset<T, TerminalCommodityMaxFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TerminalCommodityMaxPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends TerminalCommodityMaxCreateArgs>(args: Prisma.SelectSubset<T, TerminalCommodityMaxCreateArgs<ExtArgs>>): Prisma.Prisma__TerminalCommodityMaxClient<runtime.Types.Result.GetResult<Prisma.$TerminalCommodityMaxPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends TerminalCommodityMaxCreateManyArgs>(args?: Prisma.SelectSubset<T, TerminalCommodityMaxCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends TerminalCommodityMaxCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, TerminalCommodityMaxCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TerminalCommodityMaxPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends TerminalCommodityMaxDeleteArgs>(args: Prisma.SelectSubset<T, TerminalCommodityMaxDeleteArgs<ExtArgs>>): Prisma.Prisma__TerminalCommodityMaxClient<runtime.Types.Result.GetResult<Prisma.$TerminalCommodityMaxPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends TerminalCommodityMaxUpdateArgs>(args: Prisma.SelectSubset<T, TerminalCommodityMaxUpdateArgs<ExtArgs>>): Prisma.Prisma__TerminalCommodityMaxClient<runtime.Types.Result.GetResult<Prisma.$TerminalCommodityMaxPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends TerminalCommodityMaxDeleteManyArgs>(args?: Prisma.SelectSubset<T, TerminalCommodityMaxDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends TerminalCommodityMaxUpdateManyArgs>(args: Prisma.SelectSubset<T, TerminalCommodityMaxUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends TerminalCommodityMaxUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, TerminalCommodityMaxUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TerminalCommodityMaxPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends TerminalCommodityMaxUpsertArgs>(args: Prisma.SelectSubset<T, TerminalCommodityMaxUpsertArgs<ExtArgs>>): Prisma.Prisma__TerminalCommodityMaxClient<runtime.Types.Result.GetResult<Prisma.$TerminalCommodityMaxPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends TerminalCommodityMaxCountArgs>(args?: Prisma.Subset<T, TerminalCommodityMaxCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], TerminalCommodityMaxCountAggregateOutputType> : number>;
    aggregate<T extends TerminalCommodityMaxAggregateArgs>(args: Prisma.Subset<T, TerminalCommodityMaxAggregateArgs>): Prisma.PrismaPromise<GetTerminalCommodityMaxAggregateType<T>>;
    groupBy<T extends TerminalCommodityMaxGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: TerminalCommodityMaxGroupByArgs['orderBy'];
    } : {
        orderBy?: TerminalCommodityMaxGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, TerminalCommodityMaxGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTerminalCommodityMaxGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: TerminalCommodityMaxFieldRefs;
}
export interface Prisma__TerminalCommodityMaxClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    commodity<T extends Prisma.CommodityDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CommodityDefaultArgs<ExtArgs>>): Prisma.Prisma__CommodityClient<runtime.Types.Result.GetResult<Prisma.$CommodityPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    terminal<T extends Prisma.TerminalDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TerminalDefaultArgs<ExtArgs>>): Prisma.Prisma__TerminalClient<runtime.Types.Result.GetResult<Prisma.$TerminalPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface TerminalCommodityMaxFieldRefs {
    readonly commodityId: Prisma.FieldRef<"TerminalCommodityMax", 'Int'>;
    readonly terminalId: Prisma.FieldRef<"TerminalCommodityMax", 'Int'>;
    readonly scuBuyMax: Prisma.FieldRef<"TerminalCommodityMax", 'Int'>;
    readonly scuSellMax: Prisma.FieldRef<"TerminalCommodityMax", 'Int'>;
    readonly scuBuyAvg: Prisma.FieldRef<"TerminalCommodityMax", 'Float'>;
    readonly scuSellAvg: Prisma.FieldRef<"TerminalCommodityMax", 'Float'>;
    readonly dateModified: Prisma.FieldRef<"TerminalCommodityMax", 'Int'>;
    readonly fetchedAt: Prisma.FieldRef<"TerminalCommodityMax", 'DateTime'>;
}
export type TerminalCommodityMaxFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TerminalCommodityMaxSelect<ExtArgs> | null;
    omit?: Prisma.TerminalCommodityMaxOmit<ExtArgs> | null;
    include?: Prisma.TerminalCommodityMaxInclude<ExtArgs> | null;
    where: Prisma.TerminalCommodityMaxWhereUniqueInput;
};
export type TerminalCommodityMaxFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TerminalCommodityMaxSelect<ExtArgs> | null;
    omit?: Prisma.TerminalCommodityMaxOmit<ExtArgs> | null;
    include?: Prisma.TerminalCommodityMaxInclude<ExtArgs> | null;
    where: Prisma.TerminalCommodityMaxWhereUniqueInput;
};
export type TerminalCommodityMaxFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TerminalCommodityMaxSelect<ExtArgs> | null;
    omit?: Prisma.TerminalCommodityMaxOmit<ExtArgs> | null;
    include?: Prisma.TerminalCommodityMaxInclude<ExtArgs> | null;
    where?: Prisma.TerminalCommodityMaxWhereInput;
    orderBy?: Prisma.TerminalCommodityMaxOrderByWithRelationInput | Prisma.TerminalCommodityMaxOrderByWithRelationInput[];
    cursor?: Prisma.TerminalCommodityMaxWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TerminalCommodityMaxScalarFieldEnum | Prisma.TerminalCommodityMaxScalarFieldEnum[];
};
export type TerminalCommodityMaxFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TerminalCommodityMaxSelect<ExtArgs> | null;
    omit?: Prisma.TerminalCommodityMaxOmit<ExtArgs> | null;
    include?: Prisma.TerminalCommodityMaxInclude<ExtArgs> | null;
    where?: Prisma.TerminalCommodityMaxWhereInput;
    orderBy?: Prisma.TerminalCommodityMaxOrderByWithRelationInput | Prisma.TerminalCommodityMaxOrderByWithRelationInput[];
    cursor?: Prisma.TerminalCommodityMaxWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TerminalCommodityMaxScalarFieldEnum | Prisma.TerminalCommodityMaxScalarFieldEnum[];
};
export type TerminalCommodityMaxFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TerminalCommodityMaxSelect<ExtArgs> | null;
    omit?: Prisma.TerminalCommodityMaxOmit<ExtArgs> | null;
    include?: Prisma.TerminalCommodityMaxInclude<ExtArgs> | null;
    where?: Prisma.TerminalCommodityMaxWhereInput;
    orderBy?: Prisma.TerminalCommodityMaxOrderByWithRelationInput | Prisma.TerminalCommodityMaxOrderByWithRelationInput[];
    cursor?: Prisma.TerminalCommodityMaxWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TerminalCommodityMaxScalarFieldEnum | Prisma.TerminalCommodityMaxScalarFieldEnum[];
};
export type TerminalCommodityMaxCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TerminalCommodityMaxSelect<ExtArgs> | null;
    omit?: Prisma.TerminalCommodityMaxOmit<ExtArgs> | null;
    include?: Prisma.TerminalCommodityMaxInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TerminalCommodityMaxCreateInput, Prisma.TerminalCommodityMaxUncheckedCreateInput>;
};
export type TerminalCommodityMaxCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.TerminalCommodityMaxCreateManyInput | Prisma.TerminalCommodityMaxCreateManyInput[];
    skipDuplicates?: boolean;
};
export type TerminalCommodityMaxCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TerminalCommodityMaxSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.TerminalCommodityMaxOmit<ExtArgs> | null;
    data: Prisma.TerminalCommodityMaxCreateManyInput | Prisma.TerminalCommodityMaxCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.TerminalCommodityMaxIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type TerminalCommodityMaxUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TerminalCommodityMaxSelect<ExtArgs> | null;
    omit?: Prisma.TerminalCommodityMaxOmit<ExtArgs> | null;
    include?: Prisma.TerminalCommodityMaxInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TerminalCommodityMaxUpdateInput, Prisma.TerminalCommodityMaxUncheckedUpdateInput>;
    where: Prisma.TerminalCommodityMaxWhereUniqueInput;
};
export type TerminalCommodityMaxUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.TerminalCommodityMaxUpdateManyMutationInput, Prisma.TerminalCommodityMaxUncheckedUpdateManyInput>;
    where?: Prisma.TerminalCommodityMaxWhereInput;
    limit?: number;
};
export type TerminalCommodityMaxUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TerminalCommodityMaxSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.TerminalCommodityMaxOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TerminalCommodityMaxUpdateManyMutationInput, Prisma.TerminalCommodityMaxUncheckedUpdateManyInput>;
    where?: Prisma.TerminalCommodityMaxWhereInput;
    limit?: number;
    include?: Prisma.TerminalCommodityMaxIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type TerminalCommodityMaxUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TerminalCommodityMaxSelect<ExtArgs> | null;
    omit?: Prisma.TerminalCommodityMaxOmit<ExtArgs> | null;
    include?: Prisma.TerminalCommodityMaxInclude<ExtArgs> | null;
    where: Prisma.TerminalCommodityMaxWhereUniqueInput;
    create: Prisma.XOR<Prisma.TerminalCommodityMaxCreateInput, Prisma.TerminalCommodityMaxUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.TerminalCommodityMaxUpdateInput, Prisma.TerminalCommodityMaxUncheckedUpdateInput>;
};
export type TerminalCommodityMaxDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TerminalCommodityMaxSelect<ExtArgs> | null;
    omit?: Prisma.TerminalCommodityMaxOmit<ExtArgs> | null;
    include?: Prisma.TerminalCommodityMaxInclude<ExtArgs> | null;
    where: Prisma.TerminalCommodityMaxWhereUniqueInput;
};
export type TerminalCommodityMaxDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TerminalCommodityMaxWhereInput;
    limit?: number;
};
export type TerminalCommodityMaxDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TerminalCommodityMaxSelect<ExtArgs> | null;
    omit?: Prisma.TerminalCommodityMaxOmit<ExtArgs> | null;
    include?: Prisma.TerminalCommodityMaxInclude<ExtArgs> | null;
};
