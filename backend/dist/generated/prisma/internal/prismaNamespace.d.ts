import * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../models";
import { type PrismaClient } from "./class";
export type * from '../models';
export type DMMF = typeof runtime.DMMF;
export type PrismaPromise<T> = runtime.Types.Public.PrismaPromise<T>;
export declare const PrismaClientKnownRequestError: typeof runtime.PrismaClientKnownRequestError;
export type PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
export declare const PrismaClientUnknownRequestError: typeof runtime.PrismaClientUnknownRequestError;
export type PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
export declare const PrismaClientRustPanicError: typeof runtime.PrismaClientRustPanicError;
export type PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
export declare const PrismaClientInitializationError: typeof runtime.PrismaClientInitializationError;
export type PrismaClientInitializationError = runtime.PrismaClientInitializationError;
export declare const PrismaClientValidationError: typeof runtime.PrismaClientValidationError;
export type PrismaClientValidationError = runtime.PrismaClientValidationError;
export declare const sql: typeof runtime.sqltag;
export declare const empty: runtime.Sql;
export declare const join: typeof runtime.join;
export declare const raw: typeof runtime.raw;
export declare const Sql: typeof runtime.Sql;
export type Sql = runtime.Sql;
export declare const Decimal: typeof runtime.Decimal;
export type Decimal = runtime.Decimal;
export type DecimalJsLike = runtime.DecimalJsLike;
export type Extension = runtime.Types.Extensions.UserArgs;
export declare const getExtensionContext: typeof runtime.Extensions.getExtensionContext;
export type Args<T, F extends runtime.Operation> = runtime.Types.Public.Args<T, F>;
export type Payload<T, F extends runtime.Operation = never> = runtime.Types.Public.Payload<T, F>;
export type Result<T, A, F extends runtime.Operation> = runtime.Types.Public.Result<T, A, F>;
export type Exact<A, W> = runtime.Types.Public.Exact<A, W>;
export type PrismaVersion = {
    client: string;
    engine: string;
};
export declare const prismaVersion: PrismaVersion;
export type Bytes = runtime.Bytes;
export type JsonObject = runtime.JsonObject;
export type JsonArray = runtime.JsonArray;
export type JsonValue = runtime.JsonValue;
export type InputJsonObject = runtime.InputJsonObject;
export type InputJsonArray = runtime.InputJsonArray;
export type InputJsonValue = runtime.InputJsonValue;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
export declare const DbNull: runtime.DbNullClass;
export declare const JsonNull: runtime.JsonNullClass;
export declare const AnyNull: runtime.AnyNullClass;
type SelectAndInclude = {
    select: any;
    include: any;
};
type SelectAndOmit = {
    select: any;
    omit: any;
};
type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
export type Enumerable<T> = T | Array<T>;
export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
};
export type PrismaClientConstructorArgs<Options extends PrismaClientOptions> = [
    PrismaClientOptions
] extends [Options] ? PrismaClientOptions : Subset<Options, PrismaClientOptions>;
export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & (T extends SelectAndInclude ? 'Please either choose `select` or `include`.' : T extends SelectAndOmit ? 'Please either choose `select` or `omit`.' : {});
export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & K;
type Without<T, U> = {
    [P in Exclude<keyof T, keyof U>]?: never;
};
export type XOR<T, U> = T extends object ? U extends object ? ((Without<T, U> & U) | (Without<U, T> & T)) & object : U : T;
type IsObject<T extends any> = T extends Array<any> ? False : T extends Date ? False : T extends Uint8Array ? False : T extends BigInt ? False : T extends object ? True : False;
export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T;
type __Either<O extends object, K extends Key> = Omit<O, K> & {
    [P in K]: Prisma__Pick<O, P & keyof O>;
}[K];
type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;
type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>;
type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>;
    0: EitherLoose<O, K>;
}[strict];
export type Either<O extends object, K extends Key, strict extends Boolean = 1> = O extends unknown ? _Either<O, K, strict> : never;
export type Union = any;
export type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
} & {};
export type IntersectOf<U extends Union> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
} & {};
type _Merge<U extends object> = IntersectOf<Overwrite<U, {
    [K in keyof U]-?: At<U, K>;
}>>;
type Key = string | number | symbol;
type AtStrict<O extends object, K extends Key> = O[K & keyof O];
type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
    1: AtStrict<O, K>;
    0: AtLoose<O, K>;
}[strict];
export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
} & {};
export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
} & {};
type _Record<K extends keyof any, T> = {
    [P in K]: T;
};
type NoExpand<T> = T extends unknown ? T : never;
export type AtLeast<O extends object, K extends string> = NoExpand<O extends unknown ? (K extends keyof O ? {
    [P in K]: O[P];
} & O : O) | {
    [P in keyof O as P extends K ? P : never]-?: O[P];
} & O : never>;
type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;
export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;
export type Boolean = True | False;
export type True = 1;
export type False = 0;
export type Not<B extends Boolean> = {
    0: 1;
    1: 0;
}[B];
export type Extends<A1 extends any, A2 extends any> = [A1] extends [never] ? 0 : A1 extends A2 ? 1 : 0;
export type Has<U extends Union, U1 extends Union> = Not<Extends<Exclude<U1, U>, U1>>;
export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
        0: 0;
        1: 1;
    };
    1: {
        0: 1;
        1: 1;
    };
}[B1][B2];
export type Keys<U extends Union> = U extends unknown ? keyof U : never;
export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O ? O[P] : never;
} : never;
type FieldPaths<T, U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>> = IsObject<T> extends True ? U : T;
export type GetHavingFields<T> = {
    [K in keyof T]: Or<Or<Extends<'OR', K>, Extends<'AND', K>>, Extends<'NOT', K>> extends True ? T[K] extends infer TK ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never> : never : {} extends FieldPaths<T[K]> ? never : K;
}[keyof T];
type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
export type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;
export type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>;
export type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T;
export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;
type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>;
export declare const ModelName: {
    readonly Commodity: "Commodity";
    readonly Terminal: "Terminal";
    readonly PriceSnapshot: "PriceSnapshot";
    readonly CargoRoute: "CargoRoute";
    readonly Vehicle: "Vehicle";
    readonly CommodityAverage: "CommodityAverage";
    readonly TerminalCommodityMax: "TerminalCommodityMax";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export interface TypeMapCb<GlobalOmitOptions = {}> extends runtime.Types.Utils.Fn<{
    extArgs: runtime.Types.Extensions.InternalArgs;
}, runtime.Types.Utils.Record<string, any>> {
    returns: TypeMap<this['params']['extArgs'], GlobalOmitOptions>;
}
export type TypeMap<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
        omit: GlobalOmitOptions;
    };
    meta: {
        modelProps: "commodity" | "terminal" | "priceSnapshot" | "cargoRoute" | "vehicle" | "commodityAverage" | "terminalCommodityMax";
        txIsolationLevel: TransactionIsolationLevel;
    };
    model: {
        Commodity: {
            payload: Prisma.$CommodityPayload<ExtArgs>;
            fields: Prisma.CommodityFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.CommodityFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommodityPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.CommodityFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommodityPayload>;
                };
                findFirst: {
                    args: Prisma.CommodityFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommodityPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.CommodityFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommodityPayload>;
                };
                findMany: {
                    args: Prisma.CommodityFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommodityPayload>[];
                };
                create: {
                    args: Prisma.CommodityCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommodityPayload>;
                };
                createMany: {
                    args: Prisma.CommodityCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.CommodityCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommodityPayload>[];
                };
                delete: {
                    args: Prisma.CommodityDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommodityPayload>;
                };
                update: {
                    args: Prisma.CommodityUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommodityPayload>;
                };
                deleteMany: {
                    args: Prisma.CommodityDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.CommodityUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.CommodityUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommodityPayload>[];
                };
                upsert: {
                    args: Prisma.CommodityUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommodityPayload>;
                };
                aggregate: {
                    args: Prisma.CommodityAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateCommodity>;
                };
                groupBy: {
                    args: Prisma.CommodityGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CommodityGroupByOutputType>[];
                };
                count: {
                    args: Prisma.CommodityCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CommodityCountAggregateOutputType> | number;
                };
            };
        };
        Terminal: {
            payload: Prisma.$TerminalPayload<ExtArgs>;
            fields: Prisma.TerminalFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.TerminalFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TerminalPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.TerminalFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TerminalPayload>;
                };
                findFirst: {
                    args: Prisma.TerminalFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TerminalPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.TerminalFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TerminalPayload>;
                };
                findMany: {
                    args: Prisma.TerminalFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TerminalPayload>[];
                };
                create: {
                    args: Prisma.TerminalCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TerminalPayload>;
                };
                createMany: {
                    args: Prisma.TerminalCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.TerminalCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TerminalPayload>[];
                };
                delete: {
                    args: Prisma.TerminalDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TerminalPayload>;
                };
                update: {
                    args: Prisma.TerminalUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TerminalPayload>;
                };
                deleteMany: {
                    args: Prisma.TerminalDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.TerminalUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.TerminalUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TerminalPayload>[];
                };
                upsert: {
                    args: Prisma.TerminalUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TerminalPayload>;
                };
                aggregate: {
                    args: Prisma.TerminalAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateTerminal>;
                };
                groupBy: {
                    args: Prisma.TerminalGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TerminalGroupByOutputType>[];
                };
                count: {
                    args: Prisma.TerminalCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TerminalCountAggregateOutputType> | number;
                };
            };
        };
        PriceSnapshot: {
            payload: Prisma.$PriceSnapshotPayload<ExtArgs>;
            fields: Prisma.PriceSnapshotFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PriceSnapshotFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PriceSnapshotPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PriceSnapshotFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PriceSnapshotPayload>;
                };
                findFirst: {
                    args: Prisma.PriceSnapshotFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PriceSnapshotPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PriceSnapshotFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PriceSnapshotPayload>;
                };
                findMany: {
                    args: Prisma.PriceSnapshotFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PriceSnapshotPayload>[];
                };
                create: {
                    args: Prisma.PriceSnapshotCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PriceSnapshotPayload>;
                };
                createMany: {
                    args: Prisma.PriceSnapshotCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.PriceSnapshotCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PriceSnapshotPayload>[];
                };
                delete: {
                    args: Prisma.PriceSnapshotDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PriceSnapshotPayload>;
                };
                update: {
                    args: Prisma.PriceSnapshotUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PriceSnapshotPayload>;
                };
                deleteMany: {
                    args: Prisma.PriceSnapshotDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PriceSnapshotUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.PriceSnapshotUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PriceSnapshotPayload>[];
                };
                upsert: {
                    args: Prisma.PriceSnapshotUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PriceSnapshotPayload>;
                };
                aggregate: {
                    args: Prisma.PriceSnapshotAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePriceSnapshot>;
                };
                groupBy: {
                    args: Prisma.PriceSnapshotGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PriceSnapshotGroupByOutputType>[];
                };
                count: {
                    args: Prisma.PriceSnapshotCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PriceSnapshotCountAggregateOutputType> | number;
                };
            };
        };
        CargoRoute: {
            payload: Prisma.$CargoRoutePayload<ExtArgs>;
            fields: Prisma.CargoRouteFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.CargoRouteFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CargoRoutePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.CargoRouteFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CargoRoutePayload>;
                };
                findFirst: {
                    args: Prisma.CargoRouteFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CargoRoutePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.CargoRouteFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CargoRoutePayload>;
                };
                findMany: {
                    args: Prisma.CargoRouteFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CargoRoutePayload>[];
                };
                create: {
                    args: Prisma.CargoRouteCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CargoRoutePayload>;
                };
                createMany: {
                    args: Prisma.CargoRouteCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.CargoRouteCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CargoRoutePayload>[];
                };
                delete: {
                    args: Prisma.CargoRouteDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CargoRoutePayload>;
                };
                update: {
                    args: Prisma.CargoRouteUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CargoRoutePayload>;
                };
                deleteMany: {
                    args: Prisma.CargoRouteDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.CargoRouteUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.CargoRouteUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CargoRoutePayload>[];
                };
                upsert: {
                    args: Prisma.CargoRouteUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CargoRoutePayload>;
                };
                aggregate: {
                    args: Prisma.CargoRouteAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateCargoRoute>;
                };
                groupBy: {
                    args: Prisma.CargoRouteGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CargoRouteGroupByOutputType>[];
                };
                count: {
                    args: Prisma.CargoRouteCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CargoRouteCountAggregateOutputType> | number;
                };
            };
        };
        Vehicle: {
            payload: Prisma.$VehiclePayload<ExtArgs>;
            fields: Prisma.VehicleFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.VehicleFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VehiclePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.VehicleFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VehiclePayload>;
                };
                findFirst: {
                    args: Prisma.VehicleFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VehiclePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.VehicleFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VehiclePayload>;
                };
                findMany: {
                    args: Prisma.VehicleFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VehiclePayload>[];
                };
                create: {
                    args: Prisma.VehicleCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VehiclePayload>;
                };
                createMany: {
                    args: Prisma.VehicleCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.VehicleCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VehiclePayload>[];
                };
                delete: {
                    args: Prisma.VehicleDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VehiclePayload>;
                };
                update: {
                    args: Prisma.VehicleUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VehiclePayload>;
                };
                deleteMany: {
                    args: Prisma.VehicleDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.VehicleUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.VehicleUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VehiclePayload>[];
                };
                upsert: {
                    args: Prisma.VehicleUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VehiclePayload>;
                };
                aggregate: {
                    args: Prisma.VehicleAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateVehicle>;
                };
                groupBy: {
                    args: Prisma.VehicleGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.VehicleGroupByOutputType>[];
                };
                count: {
                    args: Prisma.VehicleCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.VehicleCountAggregateOutputType> | number;
                };
            };
        };
        CommodityAverage: {
            payload: Prisma.$CommodityAveragePayload<ExtArgs>;
            fields: Prisma.CommodityAverageFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.CommodityAverageFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommodityAveragePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.CommodityAverageFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommodityAveragePayload>;
                };
                findFirst: {
                    args: Prisma.CommodityAverageFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommodityAveragePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.CommodityAverageFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommodityAveragePayload>;
                };
                findMany: {
                    args: Prisma.CommodityAverageFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommodityAveragePayload>[];
                };
                create: {
                    args: Prisma.CommodityAverageCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommodityAveragePayload>;
                };
                createMany: {
                    args: Prisma.CommodityAverageCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.CommodityAverageCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommodityAveragePayload>[];
                };
                delete: {
                    args: Prisma.CommodityAverageDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommodityAveragePayload>;
                };
                update: {
                    args: Prisma.CommodityAverageUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommodityAveragePayload>;
                };
                deleteMany: {
                    args: Prisma.CommodityAverageDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.CommodityAverageUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.CommodityAverageUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommodityAveragePayload>[];
                };
                upsert: {
                    args: Prisma.CommodityAverageUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommodityAveragePayload>;
                };
                aggregate: {
                    args: Prisma.CommodityAverageAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateCommodityAverage>;
                };
                groupBy: {
                    args: Prisma.CommodityAverageGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CommodityAverageGroupByOutputType>[];
                };
                count: {
                    args: Prisma.CommodityAverageCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CommodityAverageCountAggregateOutputType> | number;
                };
            };
        };
        TerminalCommodityMax: {
            payload: Prisma.$TerminalCommodityMaxPayload<ExtArgs>;
            fields: Prisma.TerminalCommodityMaxFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.TerminalCommodityMaxFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TerminalCommodityMaxPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.TerminalCommodityMaxFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TerminalCommodityMaxPayload>;
                };
                findFirst: {
                    args: Prisma.TerminalCommodityMaxFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TerminalCommodityMaxPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.TerminalCommodityMaxFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TerminalCommodityMaxPayload>;
                };
                findMany: {
                    args: Prisma.TerminalCommodityMaxFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TerminalCommodityMaxPayload>[];
                };
                create: {
                    args: Prisma.TerminalCommodityMaxCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TerminalCommodityMaxPayload>;
                };
                createMany: {
                    args: Prisma.TerminalCommodityMaxCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.TerminalCommodityMaxCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TerminalCommodityMaxPayload>[];
                };
                delete: {
                    args: Prisma.TerminalCommodityMaxDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TerminalCommodityMaxPayload>;
                };
                update: {
                    args: Prisma.TerminalCommodityMaxUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TerminalCommodityMaxPayload>;
                };
                deleteMany: {
                    args: Prisma.TerminalCommodityMaxDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.TerminalCommodityMaxUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.TerminalCommodityMaxUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TerminalCommodityMaxPayload>[];
                };
                upsert: {
                    args: Prisma.TerminalCommodityMaxUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TerminalCommodityMaxPayload>;
                };
                aggregate: {
                    args: Prisma.TerminalCommodityMaxAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateTerminalCommodityMax>;
                };
                groupBy: {
                    args: Prisma.TerminalCommodityMaxGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TerminalCommodityMaxGroupByOutputType>[];
                };
                count: {
                    args: Prisma.TerminalCommodityMaxCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TerminalCommodityMaxCountAggregateOutputType> | number;
                };
            };
        };
    };
} & {
    other: {
        payload: any;
        operations: {
            $executeRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $executeRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
            $queryRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $queryRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
        };
    };
};
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const CommodityScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly nameEn: "nameEn";
    readonly code: "code";
    readonly kind: "kind";
    readonly weightScu: "weightScu";
    readonly isBuyable: "isBuyable";
    readonly isSellable: "isSellable";
    readonly isIllegal: "isIllegal";
    readonly isRaw: "isRaw";
    readonly isRefined: "isRefined";
    readonly dateAdded: "dateAdded";
    readonly dateModified: "dateModified";
    readonly prevBuyAvg: "prevBuyAvg";
    readonly changePercent: "changePercent";
    readonly profitMargin: "profitMargin";
    readonly profitChange: "profitChange";
    readonly maxProfitMargin: "maxProfitMargin";
};
export type CommodityScalarFieldEnum = (typeof CommodityScalarFieldEnum)[keyof typeof CommodityScalarFieldEnum];
export declare const TerminalScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly nameEn: "nameEn";
    readonly code: "code";
    readonly type: "type";
    readonly starSystemName: "starSystemName";
    readonly starSystemNameEn: "starSystemNameEn";
    readonly planetName: "planetName";
    readonly planetNameEn: "planetNameEn";
    readonly moonName: "moonName";
    readonly moonNameEn: "moonNameEn";
    readonly cityName: "cityName";
    readonly cityNameEn: "cityNameEn";
    readonly spaceStationName: "spaceStationName";
    readonly spaceStationNameEn: "spaceStationNameEn";
    readonly hasCargoCenter: "hasCargoCenter";
    readonly hasDockingPort: "hasDockingPort";
    readonly hasFreightElevator: "hasFreightElevator";
    readonly isAutoLoad: "isAutoLoad";
};
export type TerminalScalarFieldEnum = (typeof TerminalScalarFieldEnum)[keyof typeof TerminalScalarFieldEnum];
export declare const PriceSnapshotScalarFieldEnum: {
    readonly id: "id";
    readonly commodityId: "commodityId";
    readonly terminalId: "terminalId";
    readonly priceBuy: "priceBuy";
    readonly priceBuyAvg: "priceBuyAvg";
    readonly priceSell: "priceSell";
    readonly priceSellAvg: "priceSellAvg";
    readonly scuBuyStock: "scuBuyStock";
    readonly scuSellStock: "scuSellStock";
    readonly scuSellMax: "scuSellMax";
    readonly uexModifiedAt: "uexModifiedAt";
    readonly fetchedAt: "fetchedAt";
};
export type PriceSnapshotScalarFieldEnum = (typeof PriceSnapshotScalarFieldEnum)[keyof typeof PriceSnapshotScalarFieldEnum];
export declare const CargoRouteScalarFieldEnum: {
    readonly commodityId: "commodityId";
    readonly originTerminalId: "originTerminalId";
    readonly destTerminalId: "destTerminalId";
    readonly distance: "distance";
    readonly containerSizesOrigin: "containerSizesOrigin";
    readonly containerSizesDest: "containerSizesDest";
};
export type CargoRouteScalarFieldEnum = (typeof CargoRouteScalarFieldEnum)[keyof typeof CargoRouteScalarFieldEnum];
export declare const VehicleScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly scu: "scu";
    readonly companyName: "companyName";
    readonly isCargo: "isCargo";
    readonly padType: "padType";
    readonly updatedAt: "updatedAt";
};
export type VehicleScalarFieldEnum = (typeof VehicleScalarFieldEnum)[keyof typeof VehicleScalarFieldEnum];
export declare const CommodityAverageScalarFieldEnum: {
    readonly commodityId: "commodityId";
    readonly priceBuyAvg: "priceBuyAvg";
    readonly priceSellAvg: "priceSellAvg";
    readonly scuBuyMax: "scuBuyMax";
    readonly scuBuyAvg: "scuBuyAvg";
    readonly scuSellMax: "scuSellMax";
    readonly scuSellAvg: "scuSellAvg";
    readonly statusBuyAvg: "statusBuyAvg";
    readonly statusSellAvg: "statusSellAvg";
    readonly caxScore: "caxScore";
    readonly gameVersion: "gameVersion";
    readonly dateModified: "dateModified";
    readonly fetchedAt: "fetchedAt";
};
export type CommodityAverageScalarFieldEnum = (typeof CommodityAverageScalarFieldEnum)[keyof typeof CommodityAverageScalarFieldEnum];
export declare const TerminalCommodityMaxScalarFieldEnum: {
    readonly commodityId: "commodityId";
    readonly terminalId: "terminalId";
    readonly scuBuyMax: "scuBuyMax";
    readonly scuSellMax: "scuSellMax";
    readonly scuBuyAvg: "scuBuyAvg";
    readonly scuSellAvg: "scuSellAvg";
    readonly dateModified: "dateModified";
    readonly fetchedAt: "fetchedAt";
};
export type TerminalCommodityMaxScalarFieldEnum = (typeof TerminalCommodityMaxScalarFieldEnum)[keyof typeof TerminalCommodityMaxScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>;
export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>;
export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>;
export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>;
export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>;
export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>;
export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>;
export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>;
export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>;
export type BatchPayload = {
    count: number;
};
export declare const defineExtension: runtime.Types.Extensions.ExtendsHook<"define", TypeMapCb, runtime.Types.Extensions.DefaultArgs>;
export type DefaultPrismaClient = PrismaClient;
export type ErrorFormat = 'pretty' | 'colorless' | 'minimal';
export interface PrismaClientBaseOptions {
    errorFormat?: ErrorFormat;
    log?: (LogLevel | LogDefinition)[];
    transactionOptions?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: TransactionIsolationLevel;
    };
    omit?: GlobalOmitConfig;
    comments?: runtime.SqlCommenterPlugin[];
    queryPlanCacheMaxSize?: number;
}
export interface PrismaClientOptionsWithAccelerateUrl extends PrismaClientBaseOptions {
    accelerateUrl: string;
    adapter?: never;
}
export interface PrismaClientOptionsWithAdapter extends PrismaClientBaseOptions {
    adapter: runtime.SqlDriverAdapterFactory;
    accelerateUrl?: never;
}
export type PrismaClientOptions = PrismaClientOptionsWithAccelerateUrl | PrismaClientOptionsWithAdapter;
export type GlobalOmitConfig = {
    commodity?: Prisma.CommodityOmit;
    terminal?: Prisma.TerminalOmit;
    priceSnapshot?: Prisma.PriceSnapshotOmit;
    cargoRoute?: Prisma.CargoRouteOmit;
    vehicle?: Prisma.VehicleOmit;
    commodityAverage?: Prisma.CommodityAverageOmit;
    terminalCommodityMax?: Prisma.TerminalCommodityMaxOmit;
};
export type LogLevel = 'info' | 'query' | 'warn' | 'error';
export type LogDefinition = {
    level: LogLevel;
    emit: 'stdout' | 'event';
};
export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;
export type GetLogType<T> = CheckIsLogLevel<T extends LogDefinition ? T['level'] : T>;
export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition> ? GetLogType<T[number]> : never;
export type QueryEvent = {
    timestamp: Date;
    query: string;
    params: string;
    duration: number;
    target: string;
};
export type LogEvent = {
    timestamp: Date;
    message: string;
    target: string;
};
export type PrismaAction = 'findUnique' | 'findUniqueOrThrow' | 'findMany' | 'findFirst' | 'findFirstOrThrow' | 'create' | 'createMany' | 'createManyAndReturn' | 'update' | 'updateMany' | 'updateManyAndReturn' | 'upsert' | 'delete' | 'deleteMany' | 'executeRaw' | 'queryRaw' | 'aggregate' | 'count' | 'runCommandRaw' | 'findRaw' | 'groupBy';
export type TransactionClient = Omit<DefaultPrismaClient, runtime.ITXClientDenyList>;
