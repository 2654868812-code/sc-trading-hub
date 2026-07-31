import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type VehicleModel = runtime.Types.Result.DefaultSelection<Prisma.$VehiclePayload>;
export type AggregateVehicle = {
    _count: VehicleCountAggregateOutputType | null;
    _avg: VehicleAvgAggregateOutputType | null;
    _sum: VehicleSumAggregateOutputType | null;
    _min: VehicleMinAggregateOutputType | null;
    _max: VehicleMaxAggregateOutputType | null;
};
export type VehicleAvgAggregateOutputType = {
    id: number | null;
    scu: number | null;
};
export type VehicleSumAggregateOutputType = {
    id: number | null;
    scu: number | null;
};
export type VehicleMinAggregateOutputType = {
    id: number | null;
    name: string | null;
    scu: number | null;
    companyName: string | null;
    isCargo: boolean | null;
    padType: string | null;
    updatedAt: Date | null;
};
export type VehicleMaxAggregateOutputType = {
    id: number | null;
    name: string | null;
    scu: number | null;
    companyName: string | null;
    isCargo: boolean | null;
    padType: string | null;
    updatedAt: Date | null;
};
export type VehicleCountAggregateOutputType = {
    id: number;
    name: number;
    scu: number;
    companyName: number;
    isCargo: number;
    padType: number;
    updatedAt: number;
    _all: number;
};
export type VehicleAvgAggregateInputType = {
    id?: true;
    scu?: true;
};
export type VehicleSumAggregateInputType = {
    id?: true;
    scu?: true;
};
export type VehicleMinAggregateInputType = {
    id?: true;
    name?: true;
    scu?: true;
    companyName?: true;
    isCargo?: true;
    padType?: true;
    updatedAt?: true;
};
export type VehicleMaxAggregateInputType = {
    id?: true;
    name?: true;
    scu?: true;
    companyName?: true;
    isCargo?: true;
    padType?: true;
    updatedAt?: true;
};
export type VehicleCountAggregateInputType = {
    id?: true;
    name?: true;
    scu?: true;
    companyName?: true;
    isCargo?: true;
    padType?: true;
    updatedAt?: true;
    _all?: true;
};
export type VehicleAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.VehicleWhereInput;
    orderBy?: Prisma.VehicleOrderByWithRelationInput | Prisma.VehicleOrderByWithRelationInput[];
    cursor?: Prisma.VehicleWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | VehicleCountAggregateInputType;
    _avg?: VehicleAvgAggregateInputType;
    _sum?: VehicleSumAggregateInputType;
    _min?: VehicleMinAggregateInputType;
    _max?: VehicleMaxAggregateInputType;
};
export type GetVehicleAggregateType<T extends VehicleAggregateArgs> = {
    [P in keyof T & keyof AggregateVehicle]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateVehicle[P]> : Prisma.GetScalarType<T[P], AggregateVehicle[P]>;
};
export type VehicleGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.VehicleWhereInput;
    orderBy?: Prisma.VehicleOrderByWithAggregationInput | Prisma.VehicleOrderByWithAggregationInput[];
    by: Prisma.VehicleScalarFieldEnum[] | Prisma.VehicleScalarFieldEnum;
    having?: Prisma.VehicleScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: VehicleCountAggregateInputType | true;
    _avg?: VehicleAvgAggregateInputType;
    _sum?: VehicleSumAggregateInputType;
    _min?: VehicleMinAggregateInputType;
    _max?: VehicleMaxAggregateInputType;
};
export type VehicleGroupByOutputType = {
    id: number;
    name: string;
    scu: number;
    companyName: string;
    isCargo: boolean;
    padType: string;
    updatedAt: Date;
    _count: VehicleCountAggregateOutputType | null;
    _avg: VehicleAvgAggregateOutputType | null;
    _sum: VehicleSumAggregateOutputType | null;
    _min: VehicleMinAggregateOutputType | null;
    _max: VehicleMaxAggregateOutputType | null;
};
export type GetVehicleGroupByPayload<T extends VehicleGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<VehicleGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof VehicleGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], VehicleGroupByOutputType[P]> : Prisma.GetScalarType<T[P], VehicleGroupByOutputType[P]>;
}>>;
export type VehicleWhereInput = {
    AND?: Prisma.VehicleWhereInput | Prisma.VehicleWhereInput[];
    OR?: Prisma.VehicleWhereInput[];
    NOT?: Prisma.VehicleWhereInput | Prisma.VehicleWhereInput[];
    id?: Prisma.IntFilter<"Vehicle"> | number;
    name?: Prisma.StringFilter<"Vehicle"> | string;
    scu?: Prisma.IntFilter<"Vehicle"> | number;
    companyName?: Prisma.StringFilter<"Vehicle"> | string;
    isCargo?: Prisma.BoolFilter<"Vehicle"> | boolean;
    padType?: Prisma.StringFilter<"Vehicle"> | string;
    updatedAt?: Prisma.DateTimeFilter<"Vehicle"> | Date | string;
};
export type VehicleOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    scu?: Prisma.SortOrder;
    companyName?: Prisma.SortOrder;
    isCargo?: Prisma.SortOrder;
    padType?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type VehicleWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    AND?: Prisma.VehicleWhereInput | Prisma.VehicleWhereInput[];
    OR?: Prisma.VehicleWhereInput[];
    NOT?: Prisma.VehicleWhereInput | Prisma.VehicleWhereInput[];
    name?: Prisma.StringFilter<"Vehicle"> | string;
    scu?: Prisma.IntFilter<"Vehicle"> | number;
    companyName?: Prisma.StringFilter<"Vehicle"> | string;
    isCargo?: Prisma.BoolFilter<"Vehicle"> | boolean;
    padType?: Prisma.StringFilter<"Vehicle"> | string;
    updatedAt?: Prisma.DateTimeFilter<"Vehicle"> | Date | string;
}, "id">;
export type VehicleOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    scu?: Prisma.SortOrder;
    companyName?: Prisma.SortOrder;
    isCargo?: Prisma.SortOrder;
    padType?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.VehicleCountOrderByAggregateInput;
    _avg?: Prisma.VehicleAvgOrderByAggregateInput;
    _max?: Prisma.VehicleMaxOrderByAggregateInput;
    _min?: Prisma.VehicleMinOrderByAggregateInput;
    _sum?: Prisma.VehicleSumOrderByAggregateInput;
};
export type VehicleScalarWhereWithAggregatesInput = {
    AND?: Prisma.VehicleScalarWhereWithAggregatesInput | Prisma.VehicleScalarWhereWithAggregatesInput[];
    OR?: Prisma.VehicleScalarWhereWithAggregatesInput[];
    NOT?: Prisma.VehicleScalarWhereWithAggregatesInput | Prisma.VehicleScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"Vehicle"> | number;
    name?: Prisma.StringWithAggregatesFilter<"Vehicle"> | string;
    scu?: Prisma.IntWithAggregatesFilter<"Vehicle"> | number;
    companyName?: Prisma.StringWithAggregatesFilter<"Vehicle"> | string;
    isCargo?: Prisma.BoolWithAggregatesFilter<"Vehicle"> | boolean;
    padType?: Prisma.StringWithAggregatesFilter<"Vehicle"> | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Vehicle"> | Date | string;
};
export type VehicleCreateInput = {
    id: number;
    name: string;
    scu?: number;
    companyName?: string;
    isCargo?: boolean;
    padType?: string;
    updatedAt: Date | string;
};
export type VehicleUncheckedCreateInput = {
    id: number;
    name: string;
    scu?: number;
    companyName?: string;
    isCargo?: boolean;
    padType?: string;
    updatedAt: Date | string;
};
export type VehicleUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    scu?: Prisma.IntFieldUpdateOperationsInput | number;
    companyName?: Prisma.StringFieldUpdateOperationsInput | string;
    isCargo?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    padType?: Prisma.StringFieldUpdateOperationsInput | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VehicleUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    scu?: Prisma.IntFieldUpdateOperationsInput | number;
    companyName?: Prisma.StringFieldUpdateOperationsInput | string;
    isCargo?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    padType?: Prisma.StringFieldUpdateOperationsInput | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VehicleCreateManyInput = {
    id: number;
    name: string;
    scu?: number;
    companyName?: string;
    isCargo?: boolean;
    padType?: string;
    updatedAt: Date | string;
};
export type VehicleUpdateManyMutationInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    scu?: Prisma.IntFieldUpdateOperationsInput | number;
    companyName?: Prisma.StringFieldUpdateOperationsInput | string;
    isCargo?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    padType?: Prisma.StringFieldUpdateOperationsInput | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VehicleUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    scu?: Prisma.IntFieldUpdateOperationsInput | number;
    companyName?: Prisma.StringFieldUpdateOperationsInput | string;
    isCargo?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    padType?: Prisma.StringFieldUpdateOperationsInput | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VehicleCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    scu?: Prisma.SortOrder;
    companyName?: Prisma.SortOrder;
    isCargo?: Prisma.SortOrder;
    padType?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type VehicleAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    scu?: Prisma.SortOrder;
};
export type VehicleMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    scu?: Prisma.SortOrder;
    companyName?: Prisma.SortOrder;
    isCargo?: Prisma.SortOrder;
    padType?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type VehicleMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    scu?: Prisma.SortOrder;
    companyName?: Prisma.SortOrder;
    isCargo?: Prisma.SortOrder;
    padType?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type VehicleSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    scu?: Prisma.SortOrder;
};
export type VehicleSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    scu?: boolean;
    companyName?: boolean;
    isCargo?: boolean;
    padType?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["vehicle"]>;
export type VehicleSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    scu?: boolean;
    companyName?: boolean;
    isCargo?: boolean;
    padType?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["vehicle"]>;
export type VehicleSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    scu?: boolean;
    companyName?: boolean;
    isCargo?: boolean;
    padType?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["vehicle"]>;
export type VehicleSelectScalar = {
    id?: boolean;
    name?: boolean;
    scu?: boolean;
    companyName?: boolean;
    isCargo?: boolean;
    padType?: boolean;
    updatedAt?: boolean;
};
export type VehicleOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "scu" | "companyName" | "isCargo" | "padType" | "updatedAt", ExtArgs["result"]["vehicle"]>;
export type $VehiclePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Vehicle";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        name: string;
        scu: number;
        companyName: string;
        isCargo: boolean;
        padType: string;
        updatedAt: Date;
    }, ExtArgs["result"]["vehicle"]>;
    composites: {};
};
export type VehicleGetPayload<S extends boolean | null | undefined | VehicleDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$VehiclePayload, S>;
export type VehicleCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<VehicleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: VehicleCountAggregateInputType | true;
};
export interface VehicleDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Vehicle'];
        meta: {
            name: 'Vehicle';
        };
    };
    findUnique<T extends VehicleFindUniqueArgs>(args: Prisma.SelectSubset<T, VehicleFindUniqueArgs<ExtArgs>>): Prisma.Prisma__VehicleClient<runtime.Types.Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends VehicleFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, VehicleFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__VehicleClient<runtime.Types.Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends VehicleFindFirstArgs>(args?: Prisma.SelectSubset<T, VehicleFindFirstArgs<ExtArgs>>): Prisma.Prisma__VehicleClient<runtime.Types.Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends VehicleFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, VehicleFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__VehicleClient<runtime.Types.Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends VehicleFindManyArgs>(args?: Prisma.SelectSubset<T, VehicleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends VehicleCreateArgs>(args: Prisma.SelectSubset<T, VehicleCreateArgs<ExtArgs>>): Prisma.Prisma__VehicleClient<runtime.Types.Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends VehicleCreateManyArgs>(args?: Prisma.SelectSubset<T, VehicleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends VehicleCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, VehicleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends VehicleDeleteArgs>(args: Prisma.SelectSubset<T, VehicleDeleteArgs<ExtArgs>>): Prisma.Prisma__VehicleClient<runtime.Types.Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends VehicleUpdateArgs>(args: Prisma.SelectSubset<T, VehicleUpdateArgs<ExtArgs>>): Prisma.Prisma__VehicleClient<runtime.Types.Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends VehicleDeleteManyArgs>(args?: Prisma.SelectSubset<T, VehicleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends VehicleUpdateManyArgs>(args: Prisma.SelectSubset<T, VehicleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends VehicleUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, VehicleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends VehicleUpsertArgs>(args: Prisma.SelectSubset<T, VehicleUpsertArgs<ExtArgs>>): Prisma.Prisma__VehicleClient<runtime.Types.Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends VehicleCountArgs>(args?: Prisma.Subset<T, VehicleCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], VehicleCountAggregateOutputType> : number>;
    aggregate<T extends VehicleAggregateArgs>(args: Prisma.Subset<T, VehicleAggregateArgs>): Prisma.PrismaPromise<GetVehicleAggregateType<T>>;
    groupBy<T extends VehicleGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: VehicleGroupByArgs['orderBy'];
    } : {
        orderBy?: VehicleGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, VehicleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVehicleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: VehicleFieldRefs;
}
export interface Prisma__VehicleClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface VehicleFieldRefs {
    readonly id: Prisma.FieldRef<"Vehicle", 'Int'>;
    readonly name: Prisma.FieldRef<"Vehicle", 'String'>;
    readonly scu: Prisma.FieldRef<"Vehicle", 'Int'>;
    readonly companyName: Prisma.FieldRef<"Vehicle", 'String'>;
    readonly isCargo: Prisma.FieldRef<"Vehicle", 'Boolean'>;
    readonly padType: Prisma.FieldRef<"Vehicle", 'String'>;
    readonly updatedAt: Prisma.FieldRef<"Vehicle", 'DateTime'>;
}
export type VehicleFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VehicleSelect<ExtArgs> | null;
    omit?: Prisma.VehicleOmit<ExtArgs> | null;
    where: Prisma.VehicleWhereUniqueInput;
};
export type VehicleFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VehicleSelect<ExtArgs> | null;
    omit?: Prisma.VehicleOmit<ExtArgs> | null;
    where: Prisma.VehicleWhereUniqueInput;
};
export type VehicleFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VehicleSelect<ExtArgs> | null;
    omit?: Prisma.VehicleOmit<ExtArgs> | null;
    where?: Prisma.VehicleWhereInput;
    orderBy?: Prisma.VehicleOrderByWithRelationInput | Prisma.VehicleOrderByWithRelationInput[];
    cursor?: Prisma.VehicleWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.VehicleScalarFieldEnum | Prisma.VehicleScalarFieldEnum[];
};
export type VehicleFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VehicleSelect<ExtArgs> | null;
    omit?: Prisma.VehicleOmit<ExtArgs> | null;
    where?: Prisma.VehicleWhereInput;
    orderBy?: Prisma.VehicleOrderByWithRelationInput | Prisma.VehicleOrderByWithRelationInput[];
    cursor?: Prisma.VehicleWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.VehicleScalarFieldEnum | Prisma.VehicleScalarFieldEnum[];
};
export type VehicleFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VehicleSelect<ExtArgs> | null;
    omit?: Prisma.VehicleOmit<ExtArgs> | null;
    where?: Prisma.VehicleWhereInput;
    orderBy?: Prisma.VehicleOrderByWithRelationInput | Prisma.VehicleOrderByWithRelationInput[];
    cursor?: Prisma.VehicleWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.VehicleScalarFieldEnum | Prisma.VehicleScalarFieldEnum[];
};
export type VehicleCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VehicleSelect<ExtArgs> | null;
    omit?: Prisma.VehicleOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.VehicleCreateInput, Prisma.VehicleUncheckedCreateInput>;
};
export type VehicleCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.VehicleCreateManyInput | Prisma.VehicleCreateManyInput[];
    skipDuplicates?: boolean;
};
export type VehicleCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VehicleSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.VehicleOmit<ExtArgs> | null;
    data: Prisma.VehicleCreateManyInput | Prisma.VehicleCreateManyInput[];
    skipDuplicates?: boolean;
};
export type VehicleUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VehicleSelect<ExtArgs> | null;
    omit?: Prisma.VehicleOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.VehicleUpdateInput, Prisma.VehicleUncheckedUpdateInput>;
    where: Prisma.VehicleWhereUniqueInput;
};
export type VehicleUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.VehicleUpdateManyMutationInput, Prisma.VehicleUncheckedUpdateManyInput>;
    where?: Prisma.VehicleWhereInput;
    limit?: number;
};
export type VehicleUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VehicleSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.VehicleOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.VehicleUpdateManyMutationInput, Prisma.VehicleUncheckedUpdateManyInput>;
    where?: Prisma.VehicleWhereInput;
    limit?: number;
};
export type VehicleUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VehicleSelect<ExtArgs> | null;
    omit?: Prisma.VehicleOmit<ExtArgs> | null;
    where: Prisma.VehicleWhereUniqueInput;
    create: Prisma.XOR<Prisma.VehicleCreateInput, Prisma.VehicleUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.VehicleUpdateInput, Prisma.VehicleUncheckedUpdateInput>;
};
export type VehicleDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VehicleSelect<ExtArgs> | null;
    omit?: Prisma.VehicleOmit<ExtArgs> | null;
    where: Prisma.VehicleWhereUniqueInput;
};
export type VehicleDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.VehicleWhereInput;
    limit?: number;
};
export type VehicleDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VehicleSelect<ExtArgs> | null;
    omit?: Prisma.VehicleOmit<ExtArgs> | null;
};
