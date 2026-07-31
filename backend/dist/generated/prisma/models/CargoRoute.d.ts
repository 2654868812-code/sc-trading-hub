import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type CargoRouteModel = runtime.Types.Result.DefaultSelection<Prisma.$CargoRoutePayload>;
export type AggregateCargoRoute = {
    _count: CargoRouteCountAggregateOutputType | null;
    _avg: CargoRouteAvgAggregateOutputType | null;
    _sum: CargoRouteSumAggregateOutputType | null;
    _min: CargoRouteMinAggregateOutputType | null;
    _max: CargoRouteMaxAggregateOutputType | null;
};
export type CargoRouteAvgAggregateOutputType = {
    commodityId: number | null;
    originTerminalId: number | null;
    destTerminalId: number | null;
    distance: number | null;
};
export type CargoRouteSumAggregateOutputType = {
    commodityId: number | null;
    originTerminalId: number | null;
    destTerminalId: number | null;
    distance: number | null;
};
export type CargoRouteMinAggregateOutputType = {
    commodityId: number | null;
    originTerminalId: number | null;
    destTerminalId: number | null;
    distance: number | null;
    containerSizesOrigin: string | null;
    containerSizesDest: string | null;
};
export type CargoRouteMaxAggregateOutputType = {
    commodityId: number | null;
    originTerminalId: number | null;
    destTerminalId: number | null;
    distance: number | null;
    containerSizesOrigin: string | null;
    containerSizesDest: string | null;
};
export type CargoRouteCountAggregateOutputType = {
    commodityId: number;
    originTerminalId: number;
    destTerminalId: number;
    distance: number;
    containerSizesOrigin: number;
    containerSizesDest: number;
    _all: number;
};
export type CargoRouteAvgAggregateInputType = {
    commodityId?: true;
    originTerminalId?: true;
    destTerminalId?: true;
    distance?: true;
};
export type CargoRouteSumAggregateInputType = {
    commodityId?: true;
    originTerminalId?: true;
    destTerminalId?: true;
    distance?: true;
};
export type CargoRouteMinAggregateInputType = {
    commodityId?: true;
    originTerminalId?: true;
    destTerminalId?: true;
    distance?: true;
    containerSizesOrigin?: true;
    containerSizesDest?: true;
};
export type CargoRouteMaxAggregateInputType = {
    commodityId?: true;
    originTerminalId?: true;
    destTerminalId?: true;
    distance?: true;
    containerSizesOrigin?: true;
    containerSizesDest?: true;
};
export type CargoRouteCountAggregateInputType = {
    commodityId?: true;
    originTerminalId?: true;
    destTerminalId?: true;
    distance?: true;
    containerSizesOrigin?: true;
    containerSizesDest?: true;
    _all?: true;
};
export type CargoRouteAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CargoRouteWhereInput;
    orderBy?: Prisma.CargoRouteOrderByWithRelationInput | Prisma.CargoRouteOrderByWithRelationInput[];
    cursor?: Prisma.CargoRouteWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | CargoRouteCountAggregateInputType;
    _avg?: CargoRouteAvgAggregateInputType;
    _sum?: CargoRouteSumAggregateInputType;
    _min?: CargoRouteMinAggregateInputType;
    _max?: CargoRouteMaxAggregateInputType;
};
export type GetCargoRouteAggregateType<T extends CargoRouteAggregateArgs> = {
    [P in keyof T & keyof AggregateCargoRoute]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateCargoRoute[P]> : Prisma.GetScalarType<T[P], AggregateCargoRoute[P]>;
};
export type CargoRouteGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CargoRouteWhereInput;
    orderBy?: Prisma.CargoRouteOrderByWithAggregationInput | Prisma.CargoRouteOrderByWithAggregationInput[];
    by: Prisma.CargoRouteScalarFieldEnum[] | Prisma.CargoRouteScalarFieldEnum;
    having?: Prisma.CargoRouteScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CargoRouteCountAggregateInputType | true;
    _avg?: CargoRouteAvgAggregateInputType;
    _sum?: CargoRouteSumAggregateInputType;
    _min?: CargoRouteMinAggregateInputType;
    _max?: CargoRouteMaxAggregateInputType;
};
export type CargoRouteGroupByOutputType = {
    commodityId: number;
    originTerminalId: number;
    destTerminalId: number;
    distance: number | null;
    containerSizesOrigin: string | null;
    containerSizesDest: string | null;
    _count: CargoRouteCountAggregateOutputType | null;
    _avg: CargoRouteAvgAggregateOutputType | null;
    _sum: CargoRouteSumAggregateOutputType | null;
    _min: CargoRouteMinAggregateOutputType | null;
    _max: CargoRouteMaxAggregateOutputType | null;
};
export type GetCargoRouteGroupByPayload<T extends CargoRouteGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<CargoRouteGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof CargoRouteGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], CargoRouteGroupByOutputType[P]> : Prisma.GetScalarType<T[P], CargoRouteGroupByOutputType[P]>;
}>>;
export type CargoRouteWhereInput = {
    AND?: Prisma.CargoRouteWhereInput | Prisma.CargoRouteWhereInput[];
    OR?: Prisma.CargoRouteWhereInput[];
    NOT?: Prisma.CargoRouteWhereInput | Prisma.CargoRouteWhereInput[];
    commodityId?: Prisma.IntFilter<"CargoRoute"> | number;
    originTerminalId?: Prisma.IntFilter<"CargoRoute"> | number;
    destTerminalId?: Prisma.IntFilter<"CargoRoute"> | number;
    distance?: Prisma.FloatNullableFilter<"CargoRoute"> | number | null;
    containerSizesOrigin?: Prisma.StringNullableFilter<"CargoRoute"> | string | null;
    containerSizesDest?: Prisma.StringNullableFilter<"CargoRoute"> | string | null;
    commodity?: Prisma.XOR<Prisma.CommodityScalarRelationFilter, Prisma.CommodityWhereInput>;
    originTerminal?: Prisma.XOR<Prisma.TerminalScalarRelationFilter, Prisma.TerminalWhereInput>;
    destTerminal?: Prisma.XOR<Prisma.TerminalScalarRelationFilter, Prisma.TerminalWhereInput>;
};
export type CargoRouteOrderByWithRelationInput = {
    commodityId?: Prisma.SortOrder;
    originTerminalId?: Prisma.SortOrder;
    destTerminalId?: Prisma.SortOrder;
    distance?: Prisma.SortOrderInput | Prisma.SortOrder;
    containerSizesOrigin?: Prisma.SortOrderInput | Prisma.SortOrder;
    containerSizesDest?: Prisma.SortOrderInput | Prisma.SortOrder;
    commodity?: Prisma.CommodityOrderByWithRelationInput;
    originTerminal?: Prisma.TerminalOrderByWithRelationInput;
    destTerminal?: Prisma.TerminalOrderByWithRelationInput;
};
export type CargoRouteWhereUniqueInput = Prisma.AtLeast<{
    commodityId_originTerminalId_destTerminalId?: Prisma.CargoRouteCommodityIdOriginTerminalIdDestTerminalIdCompoundUniqueInput;
    AND?: Prisma.CargoRouteWhereInput | Prisma.CargoRouteWhereInput[];
    OR?: Prisma.CargoRouteWhereInput[];
    NOT?: Prisma.CargoRouteWhereInput | Prisma.CargoRouteWhereInput[];
    commodityId?: Prisma.IntFilter<"CargoRoute"> | number;
    originTerminalId?: Prisma.IntFilter<"CargoRoute"> | number;
    destTerminalId?: Prisma.IntFilter<"CargoRoute"> | number;
    distance?: Prisma.FloatNullableFilter<"CargoRoute"> | number | null;
    containerSizesOrigin?: Prisma.StringNullableFilter<"CargoRoute"> | string | null;
    containerSizesDest?: Prisma.StringNullableFilter<"CargoRoute"> | string | null;
    commodity?: Prisma.XOR<Prisma.CommodityScalarRelationFilter, Prisma.CommodityWhereInput>;
    originTerminal?: Prisma.XOR<Prisma.TerminalScalarRelationFilter, Prisma.TerminalWhereInput>;
    destTerminal?: Prisma.XOR<Prisma.TerminalScalarRelationFilter, Prisma.TerminalWhereInput>;
}, "commodityId_originTerminalId_destTerminalId">;
export type CargoRouteOrderByWithAggregationInput = {
    commodityId?: Prisma.SortOrder;
    originTerminalId?: Prisma.SortOrder;
    destTerminalId?: Prisma.SortOrder;
    distance?: Prisma.SortOrderInput | Prisma.SortOrder;
    containerSizesOrigin?: Prisma.SortOrderInput | Prisma.SortOrder;
    containerSizesDest?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.CargoRouteCountOrderByAggregateInput;
    _avg?: Prisma.CargoRouteAvgOrderByAggregateInput;
    _max?: Prisma.CargoRouteMaxOrderByAggregateInput;
    _min?: Prisma.CargoRouteMinOrderByAggregateInput;
    _sum?: Prisma.CargoRouteSumOrderByAggregateInput;
};
export type CargoRouteScalarWhereWithAggregatesInput = {
    AND?: Prisma.CargoRouteScalarWhereWithAggregatesInput | Prisma.CargoRouteScalarWhereWithAggregatesInput[];
    OR?: Prisma.CargoRouteScalarWhereWithAggregatesInput[];
    NOT?: Prisma.CargoRouteScalarWhereWithAggregatesInput | Prisma.CargoRouteScalarWhereWithAggregatesInput[];
    commodityId?: Prisma.IntWithAggregatesFilter<"CargoRoute"> | number;
    originTerminalId?: Prisma.IntWithAggregatesFilter<"CargoRoute"> | number;
    destTerminalId?: Prisma.IntWithAggregatesFilter<"CargoRoute"> | number;
    distance?: Prisma.FloatNullableWithAggregatesFilter<"CargoRoute"> | number | null;
    containerSizesOrigin?: Prisma.StringNullableWithAggregatesFilter<"CargoRoute"> | string | null;
    containerSizesDest?: Prisma.StringNullableWithAggregatesFilter<"CargoRoute"> | string | null;
};
export type CargoRouteCreateInput = {
    distance?: number | null;
    containerSizesOrigin?: string | null;
    containerSizesDest?: string | null;
    commodity: Prisma.CommodityCreateNestedOneWithoutCargoRoutesInput;
    originTerminal: Prisma.TerminalCreateNestedOneWithoutCargoRoutesOriginInput;
    destTerminal: Prisma.TerminalCreateNestedOneWithoutCargoRoutesDestInput;
};
export type CargoRouteUncheckedCreateInput = {
    commodityId: number;
    originTerminalId: number;
    destTerminalId: number;
    distance?: number | null;
    containerSizesOrigin?: string | null;
    containerSizesDest?: string | null;
};
export type CargoRouteUpdateInput = {
    distance?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    containerSizesOrigin?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    containerSizesDest?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    commodity?: Prisma.CommodityUpdateOneRequiredWithoutCargoRoutesNestedInput;
    originTerminal?: Prisma.TerminalUpdateOneRequiredWithoutCargoRoutesOriginNestedInput;
    destTerminal?: Prisma.TerminalUpdateOneRequiredWithoutCargoRoutesDestNestedInput;
};
export type CargoRouteUncheckedUpdateInput = {
    commodityId?: Prisma.IntFieldUpdateOperationsInput | number;
    originTerminalId?: Prisma.IntFieldUpdateOperationsInput | number;
    destTerminalId?: Prisma.IntFieldUpdateOperationsInput | number;
    distance?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    containerSizesOrigin?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    containerSizesDest?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type CargoRouteCreateManyInput = {
    commodityId: number;
    originTerminalId: number;
    destTerminalId: number;
    distance?: number | null;
    containerSizesOrigin?: string | null;
    containerSizesDest?: string | null;
};
export type CargoRouteUpdateManyMutationInput = {
    distance?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    containerSizesOrigin?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    containerSizesDest?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type CargoRouteUncheckedUpdateManyInput = {
    commodityId?: Prisma.IntFieldUpdateOperationsInput | number;
    originTerminalId?: Prisma.IntFieldUpdateOperationsInput | number;
    destTerminalId?: Prisma.IntFieldUpdateOperationsInput | number;
    distance?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    containerSizesOrigin?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    containerSizesDest?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type CargoRouteListRelationFilter = {
    every?: Prisma.CargoRouteWhereInput;
    some?: Prisma.CargoRouteWhereInput;
    none?: Prisma.CargoRouteWhereInput;
};
export type CargoRouteOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type CargoRouteCommodityIdOriginTerminalIdDestTerminalIdCompoundUniqueInput = {
    commodityId: number;
    originTerminalId: number;
    destTerminalId: number;
};
export type CargoRouteCountOrderByAggregateInput = {
    commodityId?: Prisma.SortOrder;
    originTerminalId?: Prisma.SortOrder;
    destTerminalId?: Prisma.SortOrder;
    distance?: Prisma.SortOrder;
    containerSizesOrigin?: Prisma.SortOrder;
    containerSizesDest?: Prisma.SortOrder;
};
export type CargoRouteAvgOrderByAggregateInput = {
    commodityId?: Prisma.SortOrder;
    originTerminalId?: Prisma.SortOrder;
    destTerminalId?: Prisma.SortOrder;
    distance?: Prisma.SortOrder;
};
export type CargoRouteMaxOrderByAggregateInput = {
    commodityId?: Prisma.SortOrder;
    originTerminalId?: Prisma.SortOrder;
    destTerminalId?: Prisma.SortOrder;
    distance?: Prisma.SortOrder;
    containerSizesOrigin?: Prisma.SortOrder;
    containerSizesDest?: Prisma.SortOrder;
};
export type CargoRouteMinOrderByAggregateInput = {
    commodityId?: Prisma.SortOrder;
    originTerminalId?: Prisma.SortOrder;
    destTerminalId?: Prisma.SortOrder;
    distance?: Prisma.SortOrder;
    containerSizesOrigin?: Prisma.SortOrder;
    containerSizesDest?: Prisma.SortOrder;
};
export type CargoRouteSumOrderByAggregateInput = {
    commodityId?: Prisma.SortOrder;
    originTerminalId?: Prisma.SortOrder;
    destTerminalId?: Prisma.SortOrder;
    distance?: Prisma.SortOrder;
};
export type CargoRouteCreateNestedManyWithoutCommodityInput = {
    create?: Prisma.XOR<Prisma.CargoRouteCreateWithoutCommodityInput, Prisma.CargoRouteUncheckedCreateWithoutCommodityInput> | Prisma.CargoRouteCreateWithoutCommodityInput[] | Prisma.CargoRouteUncheckedCreateWithoutCommodityInput[];
    connectOrCreate?: Prisma.CargoRouteCreateOrConnectWithoutCommodityInput | Prisma.CargoRouteCreateOrConnectWithoutCommodityInput[];
    createMany?: Prisma.CargoRouteCreateManyCommodityInputEnvelope;
    connect?: Prisma.CargoRouteWhereUniqueInput | Prisma.CargoRouteWhereUniqueInput[];
};
export type CargoRouteUncheckedCreateNestedManyWithoutCommodityInput = {
    create?: Prisma.XOR<Prisma.CargoRouteCreateWithoutCommodityInput, Prisma.CargoRouteUncheckedCreateWithoutCommodityInput> | Prisma.CargoRouteCreateWithoutCommodityInput[] | Prisma.CargoRouteUncheckedCreateWithoutCommodityInput[];
    connectOrCreate?: Prisma.CargoRouteCreateOrConnectWithoutCommodityInput | Prisma.CargoRouteCreateOrConnectWithoutCommodityInput[];
    createMany?: Prisma.CargoRouteCreateManyCommodityInputEnvelope;
    connect?: Prisma.CargoRouteWhereUniqueInput | Prisma.CargoRouteWhereUniqueInput[];
};
export type CargoRouteUpdateManyWithoutCommodityNestedInput = {
    create?: Prisma.XOR<Prisma.CargoRouteCreateWithoutCommodityInput, Prisma.CargoRouteUncheckedCreateWithoutCommodityInput> | Prisma.CargoRouteCreateWithoutCommodityInput[] | Prisma.CargoRouteUncheckedCreateWithoutCommodityInput[];
    connectOrCreate?: Prisma.CargoRouteCreateOrConnectWithoutCommodityInput | Prisma.CargoRouteCreateOrConnectWithoutCommodityInput[];
    upsert?: Prisma.CargoRouteUpsertWithWhereUniqueWithoutCommodityInput | Prisma.CargoRouteUpsertWithWhereUniqueWithoutCommodityInput[];
    createMany?: Prisma.CargoRouteCreateManyCommodityInputEnvelope;
    set?: Prisma.CargoRouteWhereUniqueInput | Prisma.CargoRouteWhereUniqueInput[];
    disconnect?: Prisma.CargoRouteWhereUniqueInput | Prisma.CargoRouteWhereUniqueInput[];
    delete?: Prisma.CargoRouteWhereUniqueInput | Prisma.CargoRouteWhereUniqueInput[];
    connect?: Prisma.CargoRouteWhereUniqueInput | Prisma.CargoRouteWhereUniqueInput[];
    update?: Prisma.CargoRouteUpdateWithWhereUniqueWithoutCommodityInput | Prisma.CargoRouteUpdateWithWhereUniqueWithoutCommodityInput[];
    updateMany?: Prisma.CargoRouteUpdateManyWithWhereWithoutCommodityInput | Prisma.CargoRouteUpdateManyWithWhereWithoutCommodityInput[];
    deleteMany?: Prisma.CargoRouteScalarWhereInput | Prisma.CargoRouteScalarWhereInput[];
};
export type CargoRouteUncheckedUpdateManyWithoutCommodityNestedInput = {
    create?: Prisma.XOR<Prisma.CargoRouteCreateWithoutCommodityInput, Prisma.CargoRouteUncheckedCreateWithoutCommodityInput> | Prisma.CargoRouteCreateWithoutCommodityInput[] | Prisma.CargoRouteUncheckedCreateWithoutCommodityInput[];
    connectOrCreate?: Prisma.CargoRouteCreateOrConnectWithoutCommodityInput | Prisma.CargoRouteCreateOrConnectWithoutCommodityInput[];
    upsert?: Prisma.CargoRouteUpsertWithWhereUniqueWithoutCommodityInput | Prisma.CargoRouteUpsertWithWhereUniqueWithoutCommodityInput[];
    createMany?: Prisma.CargoRouteCreateManyCommodityInputEnvelope;
    set?: Prisma.CargoRouteWhereUniqueInput | Prisma.CargoRouteWhereUniqueInput[];
    disconnect?: Prisma.CargoRouteWhereUniqueInput | Prisma.CargoRouteWhereUniqueInput[];
    delete?: Prisma.CargoRouteWhereUniqueInput | Prisma.CargoRouteWhereUniqueInput[];
    connect?: Prisma.CargoRouteWhereUniqueInput | Prisma.CargoRouteWhereUniqueInput[];
    update?: Prisma.CargoRouteUpdateWithWhereUniqueWithoutCommodityInput | Prisma.CargoRouteUpdateWithWhereUniqueWithoutCommodityInput[];
    updateMany?: Prisma.CargoRouteUpdateManyWithWhereWithoutCommodityInput | Prisma.CargoRouteUpdateManyWithWhereWithoutCommodityInput[];
    deleteMany?: Prisma.CargoRouteScalarWhereInput | Prisma.CargoRouteScalarWhereInput[];
};
export type CargoRouteCreateNestedManyWithoutOriginTerminalInput = {
    create?: Prisma.XOR<Prisma.CargoRouteCreateWithoutOriginTerminalInput, Prisma.CargoRouteUncheckedCreateWithoutOriginTerminalInput> | Prisma.CargoRouteCreateWithoutOriginTerminalInput[] | Prisma.CargoRouteUncheckedCreateWithoutOriginTerminalInput[];
    connectOrCreate?: Prisma.CargoRouteCreateOrConnectWithoutOriginTerminalInput | Prisma.CargoRouteCreateOrConnectWithoutOriginTerminalInput[];
    createMany?: Prisma.CargoRouteCreateManyOriginTerminalInputEnvelope;
    connect?: Prisma.CargoRouteWhereUniqueInput | Prisma.CargoRouteWhereUniqueInput[];
};
export type CargoRouteCreateNestedManyWithoutDestTerminalInput = {
    create?: Prisma.XOR<Prisma.CargoRouteCreateWithoutDestTerminalInput, Prisma.CargoRouteUncheckedCreateWithoutDestTerminalInput> | Prisma.CargoRouteCreateWithoutDestTerminalInput[] | Prisma.CargoRouteUncheckedCreateWithoutDestTerminalInput[];
    connectOrCreate?: Prisma.CargoRouteCreateOrConnectWithoutDestTerminalInput | Prisma.CargoRouteCreateOrConnectWithoutDestTerminalInput[];
    createMany?: Prisma.CargoRouteCreateManyDestTerminalInputEnvelope;
    connect?: Prisma.CargoRouteWhereUniqueInput | Prisma.CargoRouteWhereUniqueInput[];
};
export type CargoRouteUncheckedCreateNestedManyWithoutOriginTerminalInput = {
    create?: Prisma.XOR<Prisma.CargoRouteCreateWithoutOriginTerminalInput, Prisma.CargoRouteUncheckedCreateWithoutOriginTerminalInput> | Prisma.CargoRouteCreateWithoutOriginTerminalInput[] | Prisma.CargoRouteUncheckedCreateWithoutOriginTerminalInput[];
    connectOrCreate?: Prisma.CargoRouteCreateOrConnectWithoutOriginTerminalInput | Prisma.CargoRouteCreateOrConnectWithoutOriginTerminalInput[];
    createMany?: Prisma.CargoRouteCreateManyOriginTerminalInputEnvelope;
    connect?: Prisma.CargoRouteWhereUniqueInput | Prisma.CargoRouteWhereUniqueInput[];
};
export type CargoRouteUncheckedCreateNestedManyWithoutDestTerminalInput = {
    create?: Prisma.XOR<Prisma.CargoRouteCreateWithoutDestTerminalInput, Prisma.CargoRouteUncheckedCreateWithoutDestTerminalInput> | Prisma.CargoRouteCreateWithoutDestTerminalInput[] | Prisma.CargoRouteUncheckedCreateWithoutDestTerminalInput[];
    connectOrCreate?: Prisma.CargoRouteCreateOrConnectWithoutDestTerminalInput | Prisma.CargoRouteCreateOrConnectWithoutDestTerminalInput[];
    createMany?: Prisma.CargoRouteCreateManyDestTerminalInputEnvelope;
    connect?: Prisma.CargoRouteWhereUniqueInput | Prisma.CargoRouteWhereUniqueInput[];
};
export type CargoRouteUpdateManyWithoutOriginTerminalNestedInput = {
    create?: Prisma.XOR<Prisma.CargoRouteCreateWithoutOriginTerminalInput, Prisma.CargoRouteUncheckedCreateWithoutOriginTerminalInput> | Prisma.CargoRouteCreateWithoutOriginTerminalInput[] | Prisma.CargoRouteUncheckedCreateWithoutOriginTerminalInput[];
    connectOrCreate?: Prisma.CargoRouteCreateOrConnectWithoutOriginTerminalInput | Prisma.CargoRouteCreateOrConnectWithoutOriginTerminalInput[];
    upsert?: Prisma.CargoRouteUpsertWithWhereUniqueWithoutOriginTerminalInput | Prisma.CargoRouteUpsertWithWhereUniqueWithoutOriginTerminalInput[];
    createMany?: Prisma.CargoRouteCreateManyOriginTerminalInputEnvelope;
    set?: Prisma.CargoRouteWhereUniqueInput | Prisma.CargoRouteWhereUniqueInput[];
    disconnect?: Prisma.CargoRouteWhereUniqueInput | Prisma.CargoRouteWhereUniqueInput[];
    delete?: Prisma.CargoRouteWhereUniqueInput | Prisma.CargoRouteWhereUniqueInput[];
    connect?: Prisma.CargoRouteWhereUniqueInput | Prisma.CargoRouteWhereUniqueInput[];
    update?: Prisma.CargoRouteUpdateWithWhereUniqueWithoutOriginTerminalInput | Prisma.CargoRouteUpdateWithWhereUniqueWithoutOriginTerminalInput[];
    updateMany?: Prisma.CargoRouteUpdateManyWithWhereWithoutOriginTerminalInput | Prisma.CargoRouteUpdateManyWithWhereWithoutOriginTerminalInput[];
    deleteMany?: Prisma.CargoRouteScalarWhereInput | Prisma.CargoRouteScalarWhereInput[];
};
export type CargoRouteUpdateManyWithoutDestTerminalNestedInput = {
    create?: Prisma.XOR<Prisma.CargoRouteCreateWithoutDestTerminalInput, Prisma.CargoRouteUncheckedCreateWithoutDestTerminalInput> | Prisma.CargoRouteCreateWithoutDestTerminalInput[] | Prisma.CargoRouteUncheckedCreateWithoutDestTerminalInput[];
    connectOrCreate?: Prisma.CargoRouteCreateOrConnectWithoutDestTerminalInput | Prisma.CargoRouteCreateOrConnectWithoutDestTerminalInput[];
    upsert?: Prisma.CargoRouteUpsertWithWhereUniqueWithoutDestTerminalInput | Prisma.CargoRouteUpsertWithWhereUniqueWithoutDestTerminalInput[];
    createMany?: Prisma.CargoRouteCreateManyDestTerminalInputEnvelope;
    set?: Prisma.CargoRouteWhereUniqueInput | Prisma.CargoRouteWhereUniqueInput[];
    disconnect?: Prisma.CargoRouteWhereUniqueInput | Prisma.CargoRouteWhereUniqueInput[];
    delete?: Prisma.CargoRouteWhereUniqueInput | Prisma.CargoRouteWhereUniqueInput[];
    connect?: Prisma.CargoRouteWhereUniqueInput | Prisma.CargoRouteWhereUniqueInput[];
    update?: Prisma.CargoRouteUpdateWithWhereUniqueWithoutDestTerminalInput | Prisma.CargoRouteUpdateWithWhereUniqueWithoutDestTerminalInput[];
    updateMany?: Prisma.CargoRouteUpdateManyWithWhereWithoutDestTerminalInput | Prisma.CargoRouteUpdateManyWithWhereWithoutDestTerminalInput[];
    deleteMany?: Prisma.CargoRouteScalarWhereInput | Prisma.CargoRouteScalarWhereInput[];
};
export type CargoRouteUncheckedUpdateManyWithoutOriginTerminalNestedInput = {
    create?: Prisma.XOR<Prisma.CargoRouteCreateWithoutOriginTerminalInput, Prisma.CargoRouteUncheckedCreateWithoutOriginTerminalInput> | Prisma.CargoRouteCreateWithoutOriginTerminalInput[] | Prisma.CargoRouteUncheckedCreateWithoutOriginTerminalInput[];
    connectOrCreate?: Prisma.CargoRouteCreateOrConnectWithoutOriginTerminalInput | Prisma.CargoRouteCreateOrConnectWithoutOriginTerminalInput[];
    upsert?: Prisma.CargoRouteUpsertWithWhereUniqueWithoutOriginTerminalInput | Prisma.CargoRouteUpsertWithWhereUniqueWithoutOriginTerminalInput[];
    createMany?: Prisma.CargoRouteCreateManyOriginTerminalInputEnvelope;
    set?: Prisma.CargoRouteWhereUniqueInput | Prisma.CargoRouteWhereUniqueInput[];
    disconnect?: Prisma.CargoRouteWhereUniqueInput | Prisma.CargoRouteWhereUniqueInput[];
    delete?: Prisma.CargoRouteWhereUniqueInput | Prisma.CargoRouteWhereUniqueInput[];
    connect?: Prisma.CargoRouteWhereUniqueInput | Prisma.CargoRouteWhereUniqueInput[];
    update?: Prisma.CargoRouteUpdateWithWhereUniqueWithoutOriginTerminalInput | Prisma.CargoRouteUpdateWithWhereUniqueWithoutOriginTerminalInput[];
    updateMany?: Prisma.CargoRouteUpdateManyWithWhereWithoutOriginTerminalInput | Prisma.CargoRouteUpdateManyWithWhereWithoutOriginTerminalInput[];
    deleteMany?: Prisma.CargoRouteScalarWhereInput | Prisma.CargoRouteScalarWhereInput[];
};
export type CargoRouteUncheckedUpdateManyWithoutDestTerminalNestedInput = {
    create?: Prisma.XOR<Prisma.CargoRouteCreateWithoutDestTerminalInput, Prisma.CargoRouteUncheckedCreateWithoutDestTerminalInput> | Prisma.CargoRouteCreateWithoutDestTerminalInput[] | Prisma.CargoRouteUncheckedCreateWithoutDestTerminalInput[];
    connectOrCreate?: Prisma.CargoRouteCreateOrConnectWithoutDestTerminalInput | Prisma.CargoRouteCreateOrConnectWithoutDestTerminalInput[];
    upsert?: Prisma.CargoRouteUpsertWithWhereUniqueWithoutDestTerminalInput | Prisma.CargoRouteUpsertWithWhereUniqueWithoutDestTerminalInput[];
    createMany?: Prisma.CargoRouteCreateManyDestTerminalInputEnvelope;
    set?: Prisma.CargoRouteWhereUniqueInput | Prisma.CargoRouteWhereUniqueInput[];
    disconnect?: Prisma.CargoRouteWhereUniqueInput | Prisma.CargoRouteWhereUniqueInput[];
    delete?: Prisma.CargoRouteWhereUniqueInput | Prisma.CargoRouteWhereUniqueInput[];
    connect?: Prisma.CargoRouteWhereUniqueInput | Prisma.CargoRouteWhereUniqueInput[];
    update?: Prisma.CargoRouteUpdateWithWhereUniqueWithoutDestTerminalInput | Prisma.CargoRouteUpdateWithWhereUniqueWithoutDestTerminalInput[];
    updateMany?: Prisma.CargoRouteUpdateManyWithWhereWithoutDestTerminalInput | Prisma.CargoRouteUpdateManyWithWhereWithoutDestTerminalInput[];
    deleteMany?: Prisma.CargoRouteScalarWhereInput | Prisma.CargoRouteScalarWhereInput[];
};
export type CargoRouteCreateWithoutCommodityInput = {
    distance?: number | null;
    containerSizesOrigin?: string | null;
    containerSizesDest?: string | null;
    originTerminal: Prisma.TerminalCreateNestedOneWithoutCargoRoutesOriginInput;
    destTerminal: Prisma.TerminalCreateNestedOneWithoutCargoRoutesDestInput;
};
export type CargoRouteUncheckedCreateWithoutCommodityInput = {
    originTerminalId: number;
    destTerminalId: number;
    distance?: number | null;
    containerSizesOrigin?: string | null;
    containerSizesDest?: string | null;
};
export type CargoRouteCreateOrConnectWithoutCommodityInput = {
    where: Prisma.CargoRouteWhereUniqueInput;
    create: Prisma.XOR<Prisma.CargoRouteCreateWithoutCommodityInput, Prisma.CargoRouteUncheckedCreateWithoutCommodityInput>;
};
export type CargoRouteCreateManyCommodityInputEnvelope = {
    data: Prisma.CargoRouteCreateManyCommodityInput | Prisma.CargoRouteCreateManyCommodityInput[];
    skipDuplicates?: boolean;
};
export type CargoRouteUpsertWithWhereUniqueWithoutCommodityInput = {
    where: Prisma.CargoRouteWhereUniqueInput;
    update: Prisma.XOR<Prisma.CargoRouteUpdateWithoutCommodityInput, Prisma.CargoRouteUncheckedUpdateWithoutCommodityInput>;
    create: Prisma.XOR<Prisma.CargoRouteCreateWithoutCommodityInput, Prisma.CargoRouteUncheckedCreateWithoutCommodityInput>;
};
export type CargoRouteUpdateWithWhereUniqueWithoutCommodityInput = {
    where: Prisma.CargoRouteWhereUniqueInput;
    data: Prisma.XOR<Prisma.CargoRouteUpdateWithoutCommodityInput, Prisma.CargoRouteUncheckedUpdateWithoutCommodityInput>;
};
export type CargoRouteUpdateManyWithWhereWithoutCommodityInput = {
    where: Prisma.CargoRouteScalarWhereInput;
    data: Prisma.XOR<Prisma.CargoRouteUpdateManyMutationInput, Prisma.CargoRouteUncheckedUpdateManyWithoutCommodityInput>;
};
export type CargoRouteScalarWhereInput = {
    AND?: Prisma.CargoRouteScalarWhereInput | Prisma.CargoRouteScalarWhereInput[];
    OR?: Prisma.CargoRouteScalarWhereInput[];
    NOT?: Prisma.CargoRouteScalarWhereInput | Prisma.CargoRouteScalarWhereInput[];
    commodityId?: Prisma.IntFilter<"CargoRoute"> | number;
    originTerminalId?: Prisma.IntFilter<"CargoRoute"> | number;
    destTerminalId?: Prisma.IntFilter<"CargoRoute"> | number;
    distance?: Prisma.FloatNullableFilter<"CargoRoute"> | number | null;
    containerSizesOrigin?: Prisma.StringNullableFilter<"CargoRoute"> | string | null;
    containerSizesDest?: Prisma.StringNullableFilter<"CargoRoute"> | string | null;
};
export type CargoRouteCreateWithoutOriginTerminalInput = {
    distance?: number | null;
    containerSizesOrigin?: string | null;
    containerSizesDest?: string | null;
    commodity: Prisma.CommodityCreateNestedOneWithoutCargoRoutesInput;
    destTerminal: Prisma.TerminalCreateNestedOneWithoutCargoRoutesDestInput;
};
export type CargoRouteUncheckedCreateWithoutOriginTerminalInput = {
    commodityId: number;
    destTerminalId: number;
    distance?: number | null;
    containerSizesOrigin?: string | null;
    containerSizesDest?: string | null;
};
export type CargoRouteCreateOrConnectWithoutOriginTerminalInput = {
    where: Prisma.CargoRouteWhereUniqueInput;
    create: Prisma.XOR<Prisma.CargoRouteCreateWithoutOriginTerminalInput, Prisma.CargoRouteUncheckedCreateWithoutOriginTerminalInput>;
};
export type CargoRouteCreateManyOriginTerminalInputEnvelope = {
    data: Prisma.CargoRouteCreateManyOriginTerminalInput | Prisma.CargoRouteCreateManyOriginTerminalInput[];
    skipDuplicates?: boolean;
};
export type CargoRouteCreateWithoutDestTerminalInput = {
    distance?: number | null;
    containerSizesOrigin?: string | null;
    containerSizesDest?: string | null;
    commodity: Prisma.CommodityCreateNestedOneWithoutCargoRoutesInput;
    originTerminal: Prisma.TerminalCreateNestedOneWithoutCargoRoutesOriginInput;
};
export type CargoRouteUncheckedCreateWithoutDestTerminalInput = {
    commodityId: number;
    originTerminalId: number;
    distance?: number | null;
    containerSizesOrigin?: string | null;
    containerSizesDest?: string | null;
};
export type CargoRouteCreateOrConnectWithoutDestTerminalInput = {
    where: Prisma.CargoRouteWhereUniqueInput;
    create: Prisma.XOR<Prisma.CargoRouteCreateWithoutDestTerminalInput, Prisma.CargoRouteUncheckedCreateWithoutDestTerminalInput>;
};
export type CargoRouteCreateManyDestTerminalInputEnvelope = {
    data: Prisma.CargoRouteCreateManyDestTerminalInput | Prisma.CargoRouteCreateManyDestTerminalInput[];
    skipDuplicates?: boolean;
};
export type CargoRouteUpsertWithWhereUniqueWithoutOriginTerminalInput = {
    where: Prisma.CargoRouteWhereUniqueInput;
    update: Prisma.XOR<Prisma.CargoRouteUpdateWithoutOriginTerminalInput, Prisma.CargoRouteUncheckedUpdateWithoutOriginTerminalInput>;
    create: Prisma.XOR<Prisma.CargoRouteCreateWithoutOriginTerminalInput, Prisma.CargoRouteUncheckedCreateWithoutOriginTerminalInput>;
};
export type CargoRouteUpdateWithWhereUniqueWithoutOriginTerminalInput = {
    where: Prisma.CargoRouteWhereUniqueInput;
    data: Prisma.XOR<Prisma.CargoRouteUpdateWithoutOriginTerminalInput, Prisma.CargoRouteUncheckedUpdateWithoutOriginTerminalInput>;
};
export type CargoRouteUpdateManyWithWhereWithoutOriginTerminalInput = {
    where: Prisma.CargoRouteScalarWhereInput;
    data: Prisma.XOR<Prisma.CargoRouteUpdateManyMutationInput, Prisma.CargoRouteUncheckedUpdateManyWithoutOriginTerminalInput>;
};
export type CargoRouteUpsertWithWhereUniqueWithoutDestTerminalInput = {
    where: Prisma.CargoRouteWhereUniqueInput;
    update: Prisma.XOR<Prisma.CargoRouteUpdateWithoutDestTerminalInput, Prisma.CargoRouteUncheckedUpdateWithoutDestTerminalInput>;
    create: Prisma.XOR<Prisma.CargoRouteCreateWithoutDestTerminalInput, Prisma.CargoRouteUncheckedCreateWithoutDestTerminalInput>;
};
export type CargoRouteUpdateWithWhereUniqueWithoutDestTerminalInput = {
    where: Prisma.CargoRouteWhereUniqueInput;
    data: Prisma.XOR<Prisma.CargoRouteUpdateWithoutDestTerminalInput, Prisma.CargoRouteUncheckedUpdateWithoutDestTerminalInput>;
};
export type CargoRouteUpdateManyWithWhereWithoutDestTerminalInput = {
    where: Prisma.CargoRouteScalarWhereInput;
    data: Prisma.XOR<Prisma.CargoRouteUpdateManyMutationInput, Prisma.CargoRouteUncheckedUpdateManyWithoutDestTerminalInput>;
};
export type CargoRouteCreateManyCommodityInput = {
    originTerminalId: number;
    destTerminalId: number;
    distance?: number | null;
    containerSizesOrigin?: string | null;
    containerSizesDest?: string | null;
};
export type CargoRouteUpdateWithoutCommodityInput = {
    distance?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    containerSizesOrigin?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    containerSizesDest?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    originTerminal?: Prisma.TerminalUpdateOneRequiredWithoutCargoRoutesOriginNestedInput;
    destTerminal?: Prisma.TerminalUpdateOneRequiredWithoutCargoRoutesDestNestedInput;
};
export type CargoRouteUncheckedUpdateWithoutCommodityInput = {
    originTerminalId?: Prisma.IntFieldUpdateOperationsInput | number;
    destTerminalId?: Prisma.IntFieldUpdateOperationsInput | number;
    distance?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    containerSizesOrigin?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    containerSizesDest?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type CargoRouteUncheckedUpdateManyWithoutCommodityInput = {
    originTerminalId?: Prisma.IntFieldUpdateOperationsInput | number;
    destTerminalId?: Prisma.IntFieldUpdateOperationsInput | number;
    distance?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    containerSizesOrigin?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    containerSizesDest?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type CargoRouteCreateManyOriginTerminalInput = {
    commodityId: number;
    destTerminalId: number;
    distance?: number | null;
    containerSizesOrigin?: string | null;
    containerSizesDest?: string | null;
};
export type CargoRouteCreateManyDestTerminalInput = {
    commodityId: number;
    originTerminalId: number;
    distance?: number | null;
    containerSizesOrigin?: string | null;
    containerSizesDest?: string | null;
};
export type CargoRouteUpdateWithoutOriginTerminalInput = {
    distance?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    containerSizesOrigin?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    containerSizesDest?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    commodity?: Prisma.CommodityUpdateOneRequiredWithoutCargoRoutesNestedInput;
    destTerminal?: Prisma.TerminalUpdateOneRequiredWithoutCargoRoutesDestNestedInput;
};
export type CargoRouteUncheckedUpdateWithoutOriginTerminalInput = {
    commodityId?: Prisma.IntFieldUpdateOperationsInput | number;
    destTerminalId?: Prisma.IntFieldUpdateOperationsInput | number;
    distance?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    containerSizesOrigin?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    containerSizesDest?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type CargoRouteUncheckedUpdateManyWithoutOriginTerminalInput = {
    commodityId?: Prisma.IntFieldUpdateOperationsInput | number;
    destTerminalId?: Prisma.IntFieldUpdateOperationsInput | number;
    distance?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    containerSizesOrigin?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    containerSizesDest?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type CargoRouteUpdateWithoutDestTerminalInput = {
    distance?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    containerSizesOrigin?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    containerSizesDest?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    commodity?: Prisma.CommodityUpdateOneRequiredWithoutCargoRoutesNestedInput;
    originTerminal?: Prisma.TerminalUpdateOneRequiredWithoutCargoRoutesOriginNestedInput;
};
export type CargoRouteUncheckedUpdateWithoutDestTerminalInput = {
    commodityId?: Prisma.IntFieldUpdateOperationsInput | number;
    originTerminalId?: Prisma.IntFieldUpdateOperationsInput | number;
    distance?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    containerSizesOrigin?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    containerSizesDest?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type CargoRouteUncheckedUpdateManyWithoutDestTerminalInput = {
    commodityId?: Prisma.IntFieldUpdateOperationsInput | number;
    originTerminalId?: Prisma.IntFieldUpdateOperationsInput | number;
    distance?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    containerSizesOrigin?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    containerSizesDest?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type CargoRouteSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    commodityId?: boolean;
    originTerminalId?: boolean;
    destTerminalId?: boolean;
    distance?: boolean;
    containerSizesOrigin?: boolean;
    containerSizesDest?: boolean;
    commodity?: boolean | Prisma.CommodityDefaultArgs<ExtArgs>;
    originTerminal?: boolean | Prisma.TerminalDefaultArgs<ExtArgs>;
    destTerminal?: boolean | Prisma.TerminalDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["cargoRoute"]>;
export type CargoRouteSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    commodityId?: boolean;
    originTerminalId?: boolean;
    destTerminalId?: boolean;
    distance?: boolean;
    containerSizesOrigin?: boolean;
    containerSizesDest?: boolean;
    commodity?: boolean | Prisma.CommodityDefaultArgs<ExtArgs>;
    originTerminal?: boolean | Prisma.TerminalDefaultArgs<ExtArgs>;
    destTerminal?: boolean | Prisma.TerminalDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["cargoRoute"]>;
export type CargoRouteSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    commodityId?: boolean;
    originTerminalId?: boolean;
    destTerminalId?: boolean;
    distance?: boolean;
    containerSizesOrigin?: boolean;
    containerSizesDest?: boolean;
    commodity?: boolean | Prisma.CommodityDefaultArgs<ExtArgs>;
    originTerminal?: boolean | Prisma.TerminalDefaultArgs<ExtArgs>;
    destTerminal?: boolean | Prisma.TerminalDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["cargoRoute"]>;
export type CargoRouteSelectScalar = {
    commodityId?: boolean;
    originTerminalId?: boolean;
    destTerminalId?: boolean;
    distance?: boolean;
    containerSizesOrigin?: boolean;
    containerSizesDest?: boolean;
};
export type CargoRouteOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"commodityId" | "originTerminalId" | "destTerminalId" | "distance" | "containerSizesOrigin" | "containerSizesDest", ExtArgs["result"]["cargoRoute"]>;
export type CargoRouteInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    commodity?: boolean | Prisma.CommodityDefaultArgs<ExtArgs>;
    originTerminal?: boolean | Prisma.TerminalDefaultArgs<ExtArgs>;
    destTerminal?: boolean | Prisma.TerminalDefaultArgs<ExtArgs>;
};
export type CargoRouteIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    commodity?: boolean | Prisma.CommodityDefaultArgs<ExtArgs>;
    originTerminal?: boolean | Prisma.TerminalDefaultArgs<ExtArgs>;
    destTerminal?: boolean | Prisma.TerminalDefaultArgs<ExtArgs>;
};
export type CargoRouteIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    commodity?: boolean | Prisma.CommodityDefaultArgs<ExtArgs>;
    originTerminal?: boolean | Prisma.TerminalDefaultArgs<ExtArgs>;
    destTerminal?: boolean | Prisma.TerminalDefaultArgs<ExtArgs>;
};
export type $CargoRoutePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "CargoRoute";
    objects: {
        commodity: Prisma.$CommodityPayload<ExtArgs>;
        originTerminal: Prisma.$TerminalPayload<ExtArgs>;
        destTerminal: Prisma.$TerminalPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        commodityId: number;
        originTerminalId: number;
        destTerminalId: number;
        distance: number | null;
        containerSizesOrigin: string | null;
        containerSizesDest: string | null;
    }, ExtArgs["result"]["cargoRoute"]>;
    composites: {};
};
export type CargoRouteGetPayload<S extends boolean | null | undefined | CargoRouteDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$CargoRoutePayload, S>;
export type CargoRouteCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<CargoRouteFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: CargoRouteCountAggregateInputType | true;
};
export interface CargoRouteDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['CargoRoute'];
        meta: {
            name: 'CargoRoute';
        };
    };
    findUnique<T extends CargoRouteFindUniqueArgs>(args: Prisma.SelectSubset<T, CargoRouteFindUniqueArgs<ExtArgs>>): Prisma.Prisma__CargoRouteClient<runtime.Types.Result.GetResult<Prisma.$CargoRoutePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends CargoRouteFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, CargoRouteFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__CargoRouteClient<runtime.Types.Result.GetResult<Prisma.$CargoRoutePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends CargoRouteFindFirstArgs>(args?: Prisma.SelectSubset<T, CargoRouteFindFirstArgs<ExtArgs>>): Prisma.Prisma__CargoRouteClient<runtime.Types.Result.GetResult<Prisma.$CargoRoutePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends CargoRouteFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, CargoRouteFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__CargoRouteClient<runtime.Types.Result.GetResult<Prisma.$CargoRoutePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends CargoRouteFindManyArgs>(args?: Prisma.SelectSubset<T, CargoRouteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CargoRoutePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends CargoRouteCreateArgs>(args: Prisma.SelectSubset<T, CargoRouteCreateArgs<ExtArgs>>): Prisma.Prisma__CargoRouteClient<runtime.Types.Result.GetResult<Prisma.$CargoRoutePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends CargoRouteCreateManyArgs>(args?: Prisma.SelectSubset<T, CargoRouteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends CargoRouteCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, CargoRouteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CargoRoutePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends CargoRouteDeleteArgs>(args: Prisma.SelectSubset<T, CargoRouteDeleteArgs<ExtArgs>>): Prisma.Prisma__CargoRouteClient<runtime.Types.Result.GetResult<Prisma.$CargoRoutePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends CargoRouteUpdateArgs>(args: Prisma.SelectSubset<T, CargoRouteUpdateArgs<ExtArgs>>): Prisma.Prisma__CargoRouteClient<runtime.Types.Result.GetResult<Prisma.$CargoRoutePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends CargoRouteDeleteManyArgs>(args?: Prisma.SelectSubset<T, CargoRouteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends CargoRouteUpdateManyArgs>(args: Prisma.SelectSubset<T, CargoRouteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends CargoRouteUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, CargoRouteUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CargoRoutePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends CargoRouteUpsertArgs>(args: Prisma.SelectSubset<T, CargoRouteUpsertArgs<ExtArgs>>): Prisma.Prisma__CargoRouteClient<runtime.Types.Result.GetResult<Prisma.$CargoRoutePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends CargoRouteCountArgs>(args?: Prisma.Subset<T, CargoRouteCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], CargoRouteCountAggregateOutputType> : number>;
    aggregate<T extends CargoRouteAggregateArgs>(args: Prisma.Subset<T, CargoRouteAggregateArgs>): Prisma.PrismaPromise<GetCargoRouteAggregateType<T>>;
    groupBy<T extends CargoRouteGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: CargoRouteGroupByArgs['orderBy'];
    } : {
        orderBy?: CargoRouteGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, CargoRouteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCargoRouteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: CargoRouteFieldRefs;
}
export interface Prisma__CargoRouteClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    commodity<T extends Prisma.CommodityDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CommodityDefaultArgs<ExtArgs>>): Prisma.Prisma__CommodityClient<runtime.Types.Result.GetResult<Prisma.$CommodityPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    originTerminal<T extends Prisma.TerminalDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TerminalDefaultArgs<ExtArgs>>): Prisma.Prisma__TerminalClient<runtime.Types.Result.GetResult<Prisma.$TerminalPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    destTerminal<T extends Prisma.TerminalDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TerminalDefaultArgs<ExtArgs>>): Prisma.Prisma__TerminalClient<runtime.Types.Result.GetResult<Prisma.$TerminalPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface CargoRouteFieldRefs {
    readonly commodityId: Prisma.FieldRef<"CargoRoute", 'Int'>;
    readonly originTerminalId: Prisma.FieldRef<"CargoRoute", 'Int'>;
    readonly destTerminalId: Prisma.FieldRef<"CargoRoute", 'Int'>;
    readonly distance: Prisma.FieldRef<"CargoRoute", 'Float'>;
    readonly containerSizesOrigin: Prisma.FieldRef<"CargoRoute", 'String'>;
    readonly containerSizesDest: Prisma.FieldRef<"CargoRoute", 'String'>;
}
export type CargoRouteFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CargoRouteSelect<ExtArgs> | null;
    omit?: Prisma.CargoRouteOmit<ExtArgs> | null;
    include?: Prisma.CargoRouteInclude<ExtArgs> | null;
    where: Prisma.CargoRouteWhereUniqueInput;
};
export type CargoRouteFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CargoRouteSelect<ExtArgs> | null;
    omit?: Prisma.CargoRouteOmit<ExtArgs> | null;
    include?: Prisma.CargoRouteInclude<ExtArgs> | null;
    where: Prisma.CargoRouteWhereUniqueInput;
};
export type CargoRouteFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CargoRouteSelect<ExtArgs> | null;
    omit?: Prisma.CargoRouteOmit<ExtArgs> | null;
    include?: Prisma.CargoRouteInclude<ExtArgs> | null;
    where?: Prisma.CargoRouteWhereInput;
    orderBy?: Prisma.CargoRouteOrderByWithRelationInput | Prisma.CargoRouteOrderByWithRelationInput[];
    cursor?: Prisma.CargoRouteWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CargoRouteScalarFieldEnum | Prisma.CargoRouteScalarFieldEnum[];
};
export type CargoRouteFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CargoRouteSelect<ExtArgs> | null;
    omit?: Prisma.CargoRouteOmit<ExtArgs> | null;
    include?: Prisma.CargoRouteInclude<ExtArgs> | null;
    where?: Prisma.CargoRouteWhereInput;
    orderBy?: Prisma.CargoRouteOrderByWithRelationInput | Prisma.CargoRouteOrderByWithRelationInput[];
    cursor?: Prisma.CargoRouteWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CargoRouteScalarFieldEnum | Prisma.CargoRouteScalarFieldEnum[];
};
export type CargoRouteFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CargoRouteSelect<ExtArgs> | null;
    omit?: Prisma.CargoRouteOmit<ExtArgs> | null;
    include?: Prisma.CargoRouteInclude<ExtArgs> | null;
    where?: Prisma.CargoRouteWhereInput;
    orderBy?: Prisma.CargoRouteOrderByWithRelationInput | Prisma.CargoRouteOrderByWithRelationInput[];
    cursor?: Prisma.CargoRouteWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CargoRouteScalarFieldEnum | Prisma.CargoRouteScalarFieldEnum[];
};
export type CargoRouteCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CargoRouteSelect<ExtArgs> | null;
    omit?: Prisma.CargoRouteOmit<ExtArgs> | null;
    include?: Prisma.CargoRouteInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CargoRouteCreateInput, Prisma.CargoRouteUncheckedCreateInput>;
};
export type CargoRouteCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.CargoRouteCreateManyInput | Prisma.CargoRouteCreateManyInput[];
    skipDuplicates?: boolean;
};
export type CargoRouteCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CargoRouteSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CargoRouteOmit<ExtArgs> | null;
    data: Prisma.CargoRouteCreateManyInput | Prisma.CargoRouteCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.CargoRouteIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type CargoRouteUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CargoRouteSelect<ExtArgs> | null;
    omit?: Prisma.CargoRouteOmit<ExtArgs> | null;
    include?: Prisma.CargoRouteInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CargoRouteUpdateInput, Prisma.CargoRouteUncheckedUpdateInput>;
    where: Prisma.CargoRouteWhereUniqueInput;
};
export type CargoRouteUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.CargoRouteUpdateManyMutationInput, Prisma.CargoRouteUncheckedUpdateManyInput>;
    where?: Prisma.CargoRouteWhereInput;
    limit?: number;
};
export type CargoRouteUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CargoRouteSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CargoRouteOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CargoRouteUpdateManyMutationInput, Prisma.CargoRouteUncheckedUpdateManyInput>;
    where?: Prisma.CargoRouteWhereInput;
    limit?: number;
    include?: Prisma.CargoRouteIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type CargoRouteUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CargoRouteSelect<ExtArgs> | null;
    omit?: Prisma.CargoRouteOmit<ExtArgs> | null;
    include?: Prisma.CargoRouteInclude<ExtArgs> | null;
    where: Prisma.CargoRouteWhereUniqueInput;
    create: Prisma.XOR<Prisma.CargoRouteCreateInput, Prisma.CargoRouteUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.CargoRouteUpdateInput, Prisma.CargoRouteUncheckedUpdateInput>;
};
export type CargoRouteDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CargoRouteSelect<ExtArgs> | null;
    omit?: Prisma.CargoRouteOmit<ExtArgs> | null;
    include?: Prisma.CargoRouteInclude<ExtArgs> | null;
    where: Prisma.CargoRouteWhereUniqueInput;
};
export type CargoRouteDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CargoRouteWhereInput;
    limit?: number;
};
export type CargoRouteDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CargoRouteSelect<ExtArgs> | null;
    omit?: Prisma.CargoRouteOmit<ExtArgs> | null;
    include?: Prisma.CargoRouteInclude<ExtArgs> | null;
};
