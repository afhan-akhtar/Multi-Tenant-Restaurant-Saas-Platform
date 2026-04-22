
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model SuperAdmin
 * 
 */
export type SuperAdmin = $Result.DefaultSelection<Prisma.$SuperAdminPayload>
/**
 * Model Tenant
 * Registry row: points to the tenant’s dedicated database via `databaseUrl`.
 */
export type Tenant = $Result.DefaultSelection<Prisma.$TenantPayload>
/**
 * Model StaffLoginLookup
 * Lets restaurant staff sign in with email only (search across tenants) without scanning every DB.
 */
export type StaffLoginLookup = $Result.DefaultSelection<Prisma.$StaffLoginLookupPayload>
/**
 * Model PasswordResetToken
 * One-time token for /forgot-password → email link → /reset-password (super admin + tenant staff).
 */
export type PasswordResetToken = $Result.DefaultSelection<Prisma.$PasswordResetTokenPayload>
/**
 * Model FiskalyPlatformConfig
 * 
 */
export type FiskalyPlatformConfig = $Result.DefaultSelection<Prisma.$FiskalyPlatformConfigPayload>
/**
 * Model SubscriptionPlan
 * 
 */
export type SubscriptionPlan = $Result.DefaultSelection<Prisma.$SubscriptionPlanPayload>
/**
 * Model TenantSubscription
 * 
 */
export type TenantSubscription = $Result.DefaultSelection<Prisma.$TenantSubscriptionPayload>
/**
 * Model BillingInvoice
 * 
 */
export type BillingInvoice = $Result.DefaultSelection<Prisma.$BillingInvoicePayload>
/**
 * Model BillingPayment
 * 
 */
export type BillingPayment = $Result.DefaultSelection<Prisma.$BillingPaymentPayload>
/**
 * Model SubscriptionPlanChangeRequest
 * 
 */
export type SubscriptionPlanChangeRequest = $Result.DefaultSelection<Prisma.$SubscriptionPlanChangeRequestPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const TenantStatus: {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  BLOCKED: 'BLOCKED'
};

export type TenantStatus = (typeof TenantStatus)[keyof typeof TenantStatus]


export const SubscriptionStatus: {
  TRIALING: 'TRIALING',
  ACTIVE: 'ACTIVE',
  GRACE_PERIOD: 'GRACE_PERIOD',
  PAST_DUE: 'PAST_DUE',
  EXPIRED: 'EXPIRED',
  CANCELLED: 'CANCELLED'
};

export type SubscriptionStatus = (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus]


export const BillingInterval: {
  MONTHLY: 'MONTHLY',
  YEARLY: 'YEARLY'
};

export type BillingInterval = (typeof BillingInterval)[keyof typeof BillingInterval]


export const BillingInvoiceStatus: {
  OPEN: 'OPEN',
  PAID: 'PAID',
  VOID: 'VOID',
  OVERDUE: 'OVERDUE'
};

export type BillingInvoiceStatus = (typeof BillingInvoiceStatus)[keyof typeof BillingInvoiceStatus]


export const BillingPaymentStatus: {
  PENDING: 'PENDING',
  SUCCEEDED: 'SUCCEEDED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED'
};

export type BillingPaymentStatus = (typeof BillingPaymentStatus)[keyof typeof BillingPaymentStatus]


export const BillingPaymentMethod: {
  MANUAL: 'MANUAL',
  STRIPE: 'STRIPE',
  CARD: 'CARD',
  BANK_TRANSFER: 'BANK_TRANSFER',
  CASH: 'CASH'
};

export type BillingPaymentMethod = (typeof BillingPaymentMethod)[keyof typeof BillingPaymentMethod]


export const PlanChangeRequestStatus: {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED'
};

export type PlanChangeRequestStatus = (typeof PlanChangeRequestStatus)[keyof typeof PlanChangeRequestStatus]

}

export type TenantStatus = $Enums.TenantStatus

export const TenantStatus: typeof $Enums.TenantStatus

export type SubscriptionStatus = $Enums.SubscriptionStatus

export const SubscriptionStatus: typeof $Enums.SubscriptionStatus

export type BillingInterval = $Enums.BillingInterval

export const BillingInterval: typeof $Enums.BillingInterval

export type BillingInvoiceStatus = $Enums.BillingInvoiceStatus

export const BillingInvoiceStatus: typeof $Enums.BillingInvoiceStatus

export type BillingPaymentStatus = $Enums.BillingPaymentStatus

export const BillingPaymentStatus: typeof $Enums.BillingPaymentStatus

export type BillingPaymentMethod = $Enums.BillingPaymentMethod

export const BillingPaymentMethod: typeof $Enums.BillingPaymentMethod

export type PlanChangeRequestStatus = $Enums.PlanChangeRequestStatus

export const PlanChangeRequestStatus: typeof $Enums.PlanChangeRequestStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more SuperAdmins
 * const superAdmins = await prisma.superAdmin.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more SuperAdmins
   * const superAdmins = await prisma.superAdmin.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.superAdmin`: Exposes CRUD operations for the **SuperAdmin** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SuperAdmins
    * const superAdmins = await prisma.superAdmin.findMany()
    * ```
    */
  get superAdmin(): Prisma.SuperAdminDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tenant`: Exposes CRUD operations for the **Tenant** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tenants
    * const tenants = await prisma.tenant.findMany()
    * ```
    */
  get tenant(): Prisma.TenantDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.staffLoginLookup`: Exposes CRUD operations for the **StaffLoginLookup** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more StaffLoginLookups
    * const staffLoginLookups = await prisma.staffLoginLookup.findMany()
    * ```
    */
  get staffLoginLookup(): Prisma.StaffLoginLookupDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.passwordResetToken`: Exposes CRUD operations for the **PasswordResetToken** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PasswordResetTokens
    * const passwordResetTokens = await prisma.passwordResetToken.findMany()
    * ```
    */
  get passwordResetToken(): Prisma.PasswordResetTokenDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.fiskalyPlatformConfig`: Exposes CRUD operations for the **FiskalyPlatformConfig** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FiskalyPlatformConfigs
    * const fiskalyPlatformConfigs = await prisma.fiskalyPlatformConfig.findMany()
    * ```
    */
  get fiskalyPlatformConfig(): Prisma.FiskalyPlatformConfigDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.subscriptionPlan`: Exposes CRUD operations for the **SubscriptionPlan** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SubscriptionPlans
    * const subscriptionPlans = await prisma.subscriptionPlan.findMany()
    * ```
    */
  get subscriptionPlan(): Prisma.SubscriptionPlanDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tenantSubscription`: Exposes CRUD operations for the **TenantSubscription** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TenantSubscriptions
    * const tenantSubscriptions = await prisma.tenantSubscription.findMany()
    * ```
    */
  get tenantSubscription(): Prisma.TenantSubscriptionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.billingInvoice`: Exposes CRUD operations for the **BillingInvoice** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BillingInvoices
    * const billingInvoices = await prisma.billingInvoice.findMany()
    * ```
    */
  get billingInvoice(): Prisma.BillingInvoiceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.billingPayment`: Exposes CRUD operations for the **BillingPayment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BillingPayments
    * const billingPayments = await prisma.billingPayment.findMany()
    * ```
    */
  get billingPayment(): Prisma.BillingPaymentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.subscriptionPlanChangeRequest`: Exposes CRUD operations for the **SubscriptionPlanChangeRequest** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SubscriptionPlanChangeRequests
    * const subscriptionPlanChangeRequests = await prisma.subscriptionPlanChangeRequest.findMany()
    * ```
    */
  get subscriptionPlanChangeRequest(): Prisma.SubscriptionPlanChangeRequestDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.4.1
   * Query Engine version: 55ae170b1ced7fc6ed07a15f110549408c501bb3
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
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

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    SuperAdmin: 'SuperAdmin',
    Tenant: 'Tenant',
    StaffLoginLookup: 'StaffLoginLookup',
    PasswordResetToken: 'PasswordResetToken',
    FiskalyPlatformConfig: 'FiskalyPlatformConfig',
    SubscriptionPlan: 'SubscriptionPlan',
    TenantSubscription: 'TenantSubscription',
    BillingInvoice: 'BillingInvoice',
    BillingPayment: 'BillingPayment',
    SubscriptionPlanChangeRequest: 'SubscriptionPlanChangeRequest'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "superAdmin" | "tenant" | "staffLoginLookup" | "passwordResetToken" | "fiskalyPlatformConfig" | "subscriptionPlan" | "tenantSubscription" | "billingInvoice" | "billingPayment" | "subscriptionPlanChangeRequest"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      SuperAdmin: {
        payload: Prisma.$SuperAdminPayload<ExtArgs>
        fields: Prisma.SuperAdminFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SuperAdminFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SuperAdminFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload>
          }
          findFirst: {
            args: Prisma.SuperAdminFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SuperAdminFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload>
          }
          findMany: {
            args: Prisma.SuperAdminFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload>[]
          }
          create: {
            args: Prisma.SuperAdminCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload>
          }
          createMany: {
            args: Prisma.SuperAdminCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SuperAdminCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload>[]
          }
          delete: {
            args: Prisma.SuperAdminDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload>
          }
          update: {
            args: Prisma.SuperAdminUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload>
          }
          deleteMany: {
            args: Prisma.SuperAdminDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SuperAdminUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SuperAdminUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload>[]
          }
          upsert: {
            args: Prisma.SuperAdminUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload>
          }
          aggregate: {
            args: Prisma.SuperAdminAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSuperAdmin>
          }
          groupBy: {
            args: Prisma.SuperAdminGroupByArgs<ExtArgs>
            result: $Utils.Optional<SuperAdminGroupByOutputType>[]
          }
          count: {
            args: Prisma.SuperAdminCountArgs<ExtArgs>
            result: $Utils.Optional<SuperAdminCountAggregateOutputType> | number
          }
        }
      }
      Tenant: {
        payload: Prisma.$TenantPayload<ExtArgs>
        fields: Prisma.TenantFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TenantFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TenantFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          findFirst: {
            args: Prisma.TenantFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TenantFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          findMany: {
            args: Prisma.TenantFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>[]
          }
          create: {
            args: Prisma.TenantCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          createMany: {
            args: Prisma.TenantCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TenantCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>[]
          }
          delete: {
            args: Prisma.TenantDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          update: {
            args: Prisma.TenantUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          deleteMany: {
            args: Prisma.TenantDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TenantUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TenantUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>[]
          }
          upsert: {
            args: Prisma.TenantUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          aggregate: {
            args: Prisma.TenantAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTenant>
          }
          groupBy: {
            args: Prisma.TenantGroupByArgs<ExtArgs>
            result: $Utils.Optional<TenantGroupByOutputType>[]
          }
          count: {
            args: Prisma.TenantCountArgs<ExtArgs>
            result: $Utils.Optional<TenantCountAggregateOutputType> | number
          }
        }
      }
      StaffLoginLookup: {
        payload: Prisma.$StaffLoginLookupPayload<ExtArgs>
        fields: Prisma.StaffLoginLookupFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StaffLoginLookupFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StaffLoginLookupPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StaffLoginLookupFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StaffLoginLookupPayload>
          }
          findFirst: {
            args: Prisma.StaffLoginLookupFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StaffLoginLookupPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StaffLoginLookupFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StaffLoginLookupPayload>
          }
          findMany: {
            args: Prisma.StaffLoginLookupFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StaffLoginLookupPayload>[]
          }
          create: {
            args: Prisma.StaffLoginLookupCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StaffLoginLookupPayload>
          }
          createMany: {
            args: Prisma.StaffLoginLookupCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StaffLoginLookupCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StaffLoginLookupPayload>[]
          }
          delete: {
            args: Prisma.StaffLoginLookupDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StaffLoginLookupPayload>
          }
          update: {
            args: Prisma.StaffLoginLookupUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StaffLoginLookupPayload>
          }
          deleteMany: {
            args: Prisma.StaffLoginLookupDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StaffLoginLookupUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.StaffLoginLookupUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StaffLoginLookupPayload>[]
          }
          upsert: {
            args: Prisma.StaffLoginLookupUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StaffLoginLookupPayload>
          }
          aggregate: {
            args: Prisma.StaffLoginLookupAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStaffLoginLookup>
          }
          groupBy: {
            args: Prisma.StaffLoginLookupGroupByArgs<ExtArgs>
            result: $Utils.Optional<StaffLoginLookupGroupByOutputType>[]
          }
          count: {
            args: Prisma.StaffLoginLookupCountArgs<ExtArgs>
            result: $Utils.Optional<StaffLoginLookupCountAggregateOutputType> | number
          }
        }
      }
      PasswordResetToken: {
        payload: Prisma.$PasswordResetTokenPayload<ExtArgs>
        fields: Prisma.PasswordResetTokenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PasswordResetTokenFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PasswordResetTokenFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>
          }
          findFirst: {
            args: Prisma.PasswordResetTokenFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PasswordResetTokenFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>
          }
          findMany: {
            args: Prisma.PasswordResetTokenFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>[]
          }
          create: {
            args: Prisma.PasswordResetTokenCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>
          }
          createMany: {
            args: Prisma.PasswordResetTokenCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PasswordResetTokenCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>[]
          }
          delete: {
            args: Prisma.PasswordResetTokenDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>
          }
          update: {
            args: Prisma.PasswordResetTokenUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>
          }
          deleteMany: {
            args: Prisma.PasswordResetTokenDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PasswordResetTokenUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PasswordResetTokenUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>[]
          }
          upsert: {
            args: Prisma.PasswordResetTokenUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>
          }
          aggregate: {
            args: Prisma.PasswordResetTokenAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePasswordResetToken>
          }
          groupBy: {
            args: Prisma.PasswordResetTokenGroupByArgs<ExtArgs>
            result: $Utils.Optional<PasswordResetTokenGroupByOutputType>[]
          }
          count: {
            args: Prisma.PasswordResetTokenCountArgs<ExtArgs>
            result: $Utils.Optional<PasswordResetTokenCountAggregateOutputType> | number
          }
        }
      }
      FiskalyPlatformConfig: {
        payload: Prisma.$FiskalyPlatformConfigPayload<ExtArgs>
        fields: Prisma.FiskalyPlatformConfigFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FiskalyPlatformConfigFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FiskalyPlatformConfigPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FiskalyPlatformConfigFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FiskalyPlatformConfigPayload>
          }
          findFirst: {
            args: Prisma.FiskalyPlatformConfigFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FiskalyPlatformConfigPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FiskalyPlatformConfigFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FiskalyPlatformConfigPayload>
          }
          findMany: {
            args: Prisma.FiskalyPlatformConfigFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FiskalyPlatformConfigPayload>[]
          }
          create: {
            args: Prisma.FiskalyPlatformConfigCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FiskalyPlatformConfigPayload>
          }
          createMany: {
            args: Prisma.FiskalyPlatformConfigCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FiskalyPlatformConfigCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FiskalyPlatformConfigPayload>[]
          }
          delete: {
            args: Prisma.FiskalyPlatformConfigDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FiskalyPlatformConfigPayload>
          }
          update: {
            args: Prisma.FiskalyPlatformConfigUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FiskalyPlatformConfigPayload>
          }
          deleteMany: {
            args: Prisma.FiskalyPlatformConfigDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FiskalyPlatformConfigUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FiskalyPlatformConfigUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FiskalyPlatformConfigPayload>[]
          }
          upsert: {
            args: Prisma.FiskalyPlatformConfigUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FiskalyPlatformConfigPayload>
          }
          aggregate: {
            args: Prisma.FiskalyPlatformConfigAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFiskalyPlatformConfig>
          }
          groupBy: {
            args: Prisma.FiskalyPlatformConfigGroupByArgs<ExtArgs>
            result: $Utils.Optional<FiskalyPlatformConfigGroupByOutputType>[]
          }
          count: {
            args: Prisma.FiskalyPlatformConfigCountArgs<ExtArgs>
            result: $Utils.Optional<FiskalyPlatformConfigCountAggregateOutputType> | number
          }
        }
      }
      SubscriptionPlan: {
        payload: Prisma.$SubscriptionPlanPayload<ExtArgs>
        fields: Prisma.SubscriptionPlanFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SubscriptionPlanFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPlanPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SubscriptionPlanFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPlanPayload>
          }
          findFirst: {
            args: Prisma.SubscriptionPlanFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPlanPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SubscriptionPlanFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPlanPayload>
          }
          findMany: {
            args: Prisma.SubscriptionPlanFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPlanPayload>[]
          }
          create: {
            args: Prisma.SubscriptionPlanCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPlanPayload>
          }
          createMany: {
            args: Prisma.SubscriptionPlanCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SubscriptionPlanCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPlanPayload>[]
          }
          delete: {
            args: Prisma.SubscriptionPlanDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPlanPayload>
          }
          update: {
            args: Prisma.SubscriptionPlanUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPlanPayload>
          }
          deleteMany: {
            args: Prisma.SubscriptionPlanDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SubscriptionPlanUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SubscriptionPlanUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPlanPayload>[]
          }
          upsert: {
            args: Prisma.SubscriptionPlanUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPlanPayload>
          }
          aggregate: {
            args: Prisma.SubscriptionPlanAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSubscriptionPlan>
          }
          groupBy: {
            args: Prisma.SubscriptionPlanGroupByArgs<ExtArgs>
            result: $Utils.Optional<SubscriptionPlanGroupByOutputType>[]
          }
          count: {
            args: Prisma.SubscriptionPlanCountArgs<ExtArgs>
            result: $Utils.Optional<SubscriptionPlanCountAggregateOutputType> | number
          }
        }
      }
      TenantSubscription: {
        payload: Prisma.$TenantSubscriptionPayload<ExtArgs>
        fields: Prisma.TenantSubscriptionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TenantSubscriptionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantSubscriptionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TenantSubscriptionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantSubscriptionPayload>
          }
          findFirst: {
            args: Prisma.TenantSubscriptionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantSubscriptionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TenantSubscriptionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantSubscriptionPayload>
          }
          findMany: {
            args: Prisma.TenantSubscriptionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantSubscriptionPayload>[]
          }
          create: {
            args: Prisma.TenantSubscriptionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantSubscriptionPayload>
          }
          createMany: {
            args: Prisma.TenantSubscriptionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TenantSubscriptionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantSubscriptionPayload>[]
          }
          delete: {
            args: Prisma.TenantSubscriptionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantSubscriptionPayload>
          }
          update: {
            args: Prisma.TenantSubscriptionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantSubscriptionPayload>
          }
          deleteMany: {
            args: Prisma.TenantSubscriptionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TenantSubscriptionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TenantSubscriptionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantSubscriptionPayload>[]
          }
          upsert: {
            args: Prisma.TenantSubscriptionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantSubscriptionPayload>
          }
          aggregate: {
            args: Prisma.TenantSubscriptionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTenantSubscription>
          }
          groupBy: {
            args: Prisma.TenantSubscriptionGroupByArgs<ExtArgs>
            result: $Utils.Optional<TenantSubscriptionGroupByOutputType>[]
          }
          count: {
            args: Prisma.TenantSubscriptionCountArgs<ExtArgs>
            result: $Utils.Optional<TenantSubscriptionCountAggregateOutputType> | number
          }
        }
      }
      BillingInvoice: {
        payload: Prisma.$BillingInvoicePayload<ExtArgs>
        fields: Prisma.BillingInvoiceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BillingInvoiceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingInvoicePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BillingInvoiceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingInvoicePayload>
          }
          findFirst: {
            args: Prisma.BillingInvoiceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingInvoicePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BillingInvoiceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingInvoicePayload>
          }
          findMany: {
            args: Prisma.BillingInvoiceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingInvoicePayload>[]
          }
          create: {
            args: Prisma.BillingInvoiceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingInvoicePayload>
          }
          createMany: {
            args: Prisma.BillingInvoiceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BillingInvoiceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingInvoicePayload>[]
          }
          delete: {
            args: Prisma.BillingInvoiceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingInvoicePayload>
          }
          update: {
            args: Prisma.BillingInvoiceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingInvoicePayload>
          }
          deleteMany: {
            args: Prisma.BillingInvoiceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BillingInvoiceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BillingInvoiceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingInvoicePayload>[]
          }
          upsert: {
            args: Prisma.BillingInvoiceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingInvoicePayload>
          }
          aggregate: {
            args: Prisma.BillingInvoiceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBillingInvoice>
          }
          groupBy: {
            args: Prisma.BillingInvoiceGroupByArgs<ExtArgs>
            result: $Utils.Optional<BillingInvoiceGroupByOutputType>[]
          }
          count: {
            args: Prisma.BillingInvoiceCountArgs<ExtArgs>
            result: $Utils.Optional<BillingInvoiceCountAggregateOutputType> | number
          }
        }
      }
      BillingPayment: {
        payload: Prisma.$BillingPaymentPayload<ExtArgs>
        fields: Prisma.BillingPaymentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BillingPaymentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingPaymentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BillingPaymentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingPaymentPayload>
          }
          findFirst: {
            args: Prisma.BillingPaymentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingPaymentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BillingPaymentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingPaymentPayload>
          }
          findMany: {
            args: Prisma.BillingPaymentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingPaymentPayload>[]
          }
          create: {
            args: Prisma.BillingPaymentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingPaymentPayload>
          }
          createMany: {
            args: Prisma.BillingPaymentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BillingPaymentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingPaymentPayload>[]
          }
          delete: {
            args: Prisma.BillingPaymentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingPaymentPayload>
          }
          update: {
            args: Prisma.BillingPaymentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingPaymentPayload>
          }
          deleteMany: {
            args: Prisma.BillingPaymentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BillingPaymentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BillingPaymentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingPaymentPayload>[]
          }
          upsert: {
            args: Prisma.BillingPaymentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingPaymentPayload>
          }
          aggregate: {
            args: Prisma.BillingPaymentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBillingPayment>
          }
          groupBy: {
            args: Prisma.BillingPaymentGroupByArgs<ExtArgs>
            result: $Utils.Optional<BillingPaymentGroupByOutputType>[]
          }
          count: {
            args: Prisma.BillingPaymentCountArgs<ExtArgs>
            result: $Utils.Optional<BillingPaymentCountAggregateOutputType> | number
          }
        }
      }
      SubscriptionPlanChangeRequest: {
        payload: Prisma.$SubscriptionPlanChangeRequestPayload<ExtArgs>
        fields: Prisma.SubscriptionPlanChangeRequestFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SubscriptionPlanChangeRequestFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPlanChangeRequestPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SubscriptionPlanChangeRequestFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPlanChangeRequestPayload>
          }
          findFirst: {
            args: Prisma.SubscriptionPlanChangeRequestFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPlanChangeRequestPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SubscriptionPlanChangeRequestFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPlanChangeRequestPayload>
          }
          findMany: {
            args: Prisma.SubscriptionPlanChangeRequestFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPlanChangeRequestPayload>[]
          }
          create: {
            args: Prisma.SubscriptionPlanChangeRequestCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPlanChangeRequestPayload>
          }
          createMany: {
            args: Prisma.SubscriptionPlanChangeRequestCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SubscriptionPlanChangeRequestCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPlanChangeRequestPayload>[]
          }
          delete: {
            args: Prisma.SubscriptionPlanChangeRequestDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPlanChangeRequestPayload>
          }
          update: {
            args: Prisma.SubscriptionPlanChangeRequestUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPlanChangeRequestPayload>
          }
          deleteMany: {
            args: Prisma.SubscriptionPlanChangeRequestDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SubscriptionPlanChangeRequestUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SubscriptionPlanChangeRequestUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPlanChangeRequestPayload>[]
          }
          upsert: {
            args: Prisma.SubscriptionPlanChangeRequestUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPlanChangeRequestPayload>
          }
          aggregate: {
            args: Prisma.SubscriptionPlanChangeRequestAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSubscriptionPlanChangeRequest>
          }
          groupBy: {
            args: Prisma.SubscriptionPlanChangeRequestGroupByArgs<ExtArgs>
            result: $Utils.Optional<SubscriptionPlanChangeRequestGroupByOutputType>[]
          }
          count: {
            args: Prisma.SubscriptionPlanChangeRequestCountArgs<ExtArgs>
            result: $Utils.Optional<SubscriptionPlanChangeRequestCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    superAdmin?: SuperAdminOmit
    tenant?: TenantOmit
    staffLoginLookup?: StaffLoginLookupOmit
    passwordResetToken?: PasswordResetTokenOmit
    fiskalyPlatformConfig?: FiskalyPlatformConfigOmit
    subscriptionPlan?: SubscriptionPlanOmit
    tenantSubscription?: TenantSubscriptionOmit
    billingInvoice?: BillingInvoiceOmit
    billingPayment?: BillingPaymentOmit
    subscriptionPlanChangeRequest?: SubscriptionPlanChangeRequestOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type TenantCountOutputType
   */

  export type TenantCountOutputType = {
    staffLoginLookups: number
    subscription: number
    billingInvoices: number
    billingPayments: number
    planChangeRequests: number
  }

  export type TenantCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    staffLoginLookups?: boolean | TenantCountOutputTypeCountStaffLoginLookupsArgs
    subscription?: boolean | TenantCountOutputTypeCountSubscriptionArgs
    billingInvoices?: boolean | TenantCountOutputTypeCountBillingInvoicesArgs
    billingPayments?: boolean | TenantCountOutputTypeCountBillingPaymentsArgs
    planChangeRequests?: boolean | TenantCountOutputTypeCountPlanChangeRequestsArgs
  }

  // Custom InputTypes
  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantCountOutputType
     */
    select?: TenantCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountStaffLoginLookupsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StaffLoginLookupWhereInput
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountSubscriptionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TenantSubscriptionWhereInput
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountBillingInvoicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BillingInvoiceWhereInput
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountBillingPaymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BillingPaymentWhereInput
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountPlanChangeRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubscriptionPlanChangeRequestWhereInput
  }


  /**
   * Count Type SubscriptionPlanCountOutputType
   */

  export type SubscriptionPlanCountOutputType = {
    tenantSubscriptions: number
    invoices: number
    requestedChanges: number
  }

  export type SubscriptionPlanCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenantSubscriptions?: boolean | SubscriptionPlanCountOutputTypeCountTenantSubscriptionsArgs
    invoices?: boolean | SubscriptionPlanCountOutputTypeCountInvoicesArgs
    requestedChanges?: boolean | SubscriptionPlanCountOutputTypeCountRequestedChangesArgs
  }

  // Custom InputTypes
  /**
   * SubscriptionPlanCountOutputType without action
   */
  export type SubscriptionPlanCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlanCountOutputType
     */
    select?: SubscriptionPlanCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SubscriptionPlanCountOutputType without action
   */
  export type SubscriptionPlanCountOutputTypeCountTenantSubscriptionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TenantSubscriptionWhereInput
  }

  /**
   * SubscriptionPlanCountOutputType without action
   */
  export type SubscriptionPlanCountOutputTypeCountInvoicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BillingInvoiceWhereInput
  }

  /**
   * SubscriptionPlanCountOutputType without action
   */
  export type SubscriptionPlanCountOutputTypeCountRequestedChangesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubscriptionPlanChangeRequestWhereInput
  }


  /**
   * Count Type TenantSubscriptionCountOutputType
   */

  export type TenantSubscriptionCountOutputType = {
    invoices: number
    planChangeRequests: number
  }

  export type TenantSubscriptionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoices?: boolean | TenantSubscriptionCountOutputTypeCountInvoicesArgs
    planChangeRequests?: boolean | TenantSubscriptionCountOutputTypeCountPlanChangeRequestsArgs
  }

  // Custom InputTypes
  /**
   * TenantSubscriptionCountOutputType without action
   */
  export type TenantSubscriptionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantSubscriptionCountOutputType
     */
    select?: TenantSubscriptionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TenantSubscriptionCountOutputType without action
   */
  export type TenantSubscriptionCountOutputTypeCountInvoicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BillingInvoiceWhereInput
  }

  /**
   * TenantSubscriptionCountOutputType without action
   */
  export type TenantSubscriptionCountOutputTypeCountPlanChangeRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubscriptionPlanChangeRequestWhereInput
  }


  /**
   * Count Type BillingInvoiceCountOutputType
   */

  export type BillingInvoiceCountOutputType = {
    payments: number
  }

  export type BillingInvoiceCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    payments?: boolean | BillingInvoiceCountOutputTypeCountPaymentsArgs
  }

  // Custom InputTypes
  /**
   * BillingInvoiceCountOutputType without action
   */
  export type BillingInvoiceCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoiceCountOutputType
     */
    select?: BillingInvoiceCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * BillingInvoiceCountOutputType without action
   */
  export type BillingInvoiceCountOutputTypeCountPaymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BillingPaymentWhereInput
  }


  /**
   * Models
   */

  /**
   * Model SuperAdmin
   */

  export type AggregateSuperAdmin = {
    _count: SuperAdminCountAggregateOutputType | null
    _avg: SuperAdminAvgAggregateOutputType | null
    _sum: SuperAdminSumAggregateOutputType | null
    _min: SuperAdminMinAggregateOutputType | null
    _max: SuperAdminMaxAggregateOutputType | null
  }

  export type SuperAdminAvgAggregateOutputType = {
    id: number | null
  }

  export type SuperAdminSumAggregateOutputType = {
    id: number | null
  }

  export type SuperAdminMinAggregateOutputType = {
    id: number | null
    name: string | null
    email: string | null
    passwordHash: string | null
    createdAt: Date | null
  }

  export type SuperAdminMaxAggregateOutputType = {
    id: number | null
    name: string | null
    email: string | null
    passwordHash: string | null
    createdAt: Date | null
  }

  export type SuperAdminCountAggregateOutputType = {
    id: number
    name: number
    email: number
    passwordHash: number
    createdAt: number
    _all: number
  }


  export type SuperAdminAvgAggregateInputType = {
    id?: true
  }

  export type SuperAdminSumAggregateInputType = {
    id?: true
  }

  export type SuperAdminMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    passwordHash?: true
    createdAt?: true
  }

  export type SuperAdminMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    passwordHash?: true
    createdAt?: true
  }

  export type SuperAdminCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    passwordHash?: true
    createdAt?: true
    _all?: true
  }

  export type SuperAdminAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SuperAdmin to aggregate.
     */
    where?: SuperAdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SuperAdmins to fetch.
     */
    orderBy?: SuperAdminOrderByWithRelationInput | SuperAdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SuperAdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SuperAdmins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SuperAdmins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SuperAdmins
    **/
    _count?: true | SuperAdminCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SuperAdminAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SuperAdminSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SuperAdminMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SuperAdminMaxAggregateInputType
  }

  export type GetSuperAdminAggregateType<T extends SuperAdminAggregateArgs> = {
        [P in keyof T & keyof AggregateSuperAdmin]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSuperAdmin[P]>
      : GetScalarType<T[P], AggregateSuperAdmin[P]>
  }




  export type SuperAdminGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SuperAdminWhereInput
    orderBy?: SuperAdminOrderByWithAggregationInput | SuperAdminOrderByWithAggregationInput[]
    by: SuperAdminScalarFieldEnum[] | SuperAdminScalarFieldEnum
    having?: SuperAdminScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SuperAdminCountAggregateInputType | true
    _avg?: SuperAdminAvgAggregateInputType
    _sum?: SuperAdminSumAggregateInputType
    _min?: SuperAdminMinAggregateInputType
    _max?: SuperAdminMaxAggregateInputType
  }

  export type SuperAdminGroupByOutputType = {
    id: number
    name: string
    email: string
    passwordHash: string
    createdAt: Date
    _count: SuperAdminCountAggregateOutputType | null
    _avg: SuperAdminAvgAggregateOutputType | null
    _sum: SuperAdminSumAggregateOutputType | null
    _min: SuperAdminMinAggregateOutputType | null
    _max: SuperAdminMaxAggregateOutputType | null
  }

  type GetSuperAdminGroupByPayload<T extends SuperAdminGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SuperAdminGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SuperAdminGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SuperAdminGroupByOutputType[P]>
            : GetScalarType<T[P], SuperAdminGroupByOutputType[P]>
        }
      >
    >


  export type SuperAdminSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    passwordHash?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["superAdmin"]>

  export type SuperAdminSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    passwordHash?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["superAdmin"]>

  export type SuperAdminSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    passwordHash?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["superAdmin"]>

  export type SuperAdminSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    passwordHash?: boolean
    createdAt?: boolean
  }

  export type SuperAdminOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "passwordHash" | "createdAt", ExtArgs["result"]["superAdmin"]>

  export type $SuperAdminPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SuperAdmin"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      email: string
      passwordHash: string
      createdAt: Date
    }, ExtArgs["result"]["superAdmin"]>
    composites: {}
  }

  type SuperAdminGetPayload<S extends boolean | null | undefined | SuperAdminDefaultArgs> = $Result.GetResult<Prisma.$SuperAdminPayload, S>

  type SuperAdminCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SuperAdminFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SuperAdminCountAggregateInputType | true
    }

  export interface SuperAdminDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SuperAdmin'], meta: { name: 'SuperAdmin' } }
    /**
     * Find zero or one SuperAdmin that matches the filter.
     * @param {SuperAdminFindUniqueArgs} args - Arguments to find a SuperAdmin
     * @example
     * // Get one SuperAdmin
     * const superAdmin = await prisma.superAdmin.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SuperAdminFindUniqueArgs>(args: SelectSubset<T, SuperAdminFindUniqueArgs<ExtArgs>>): Prisma__SuperAdminClient<$Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SuperAdmin that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SuperAdminFindUniqueOrThrowArgs} args - Arguments to find a SuperAdmin
     * @example
     * // Get one SuperAdmin
     * const superAdmin = await prisma.superAdmin.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SuperAdminFindUniqueOrThrowArgs>(args: SelectSubset<T, SuperAdminFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SuperAdminClient<$Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SuperAdmin that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuperAdminFindFirstArgs} args - Arguments to find a SuperAdmin
     * @example
     * // Get one SuperAdmin
     * const superAdmin = await prisma.superAdmin.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SuperAdminFindFirstArgs>(args?: SelectSubset<T, SuperAdminFindFirstArgs<ExtArgs>>): Prisma__SuperAdminClient<$Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SuperAdmin that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuperAdminFindFirstOrThrowArgs} args - Arguments to find a SuperAdmin
     * @example
     * // Get one SuperAdmin
     * const superAdmin = await prisma.superAdmin.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SuperAdminFindFirstOrThrowArgs>(args?: SelectSubset<T, SuperAdminFindFirstOrThrowArgs<ExtArgs>>): Prisma__SuperAdminClient<$Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SuperAdmins that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuperAdminFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SuperAdmins
     * const superAdmins = await prisma.superAdmin.findMany()
     * 
     * // Get first 10 SuperAdmins
     * const superAdmins = await prisma.superAdmin.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const superAdminWithIdOnly = await prisma.superAdmin.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SuperAdminFindManyArgs>(args?: SelectSubset<T, SuperAdminFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SuperAdmin.
     * @param {SuperAdminCreateArgs} args - Arguments to create a SuperAdmin.
     * @example
     * // Create one SuperAdmin
     * const SuperAdmin = await prisma.superAdmin.create({
     *   data: {
     *     // ... data to create a SuperAdmin
     *   }
     * })
     * 
     */
    create<T extends SuperAdminCreateArgs>(args: SelectSubset<T, SuperAdminCreateArgs<ExtArgs>>): Prisma__SuperAdminClient<$Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SuperAdmins.
     * @param {SuperAdminCreateManyArgs} args - Arguments to create many SuperAdmins.
     * @example
     * // Create many SuperAdmins
     * const superAdmin = await prisma.superAdmin.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SuperAdminCreateManyArgs>(args?: SelectSubset<T, SuperAdminCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SuperAdmins and returns the data saved in the database.
     * @param {SuperAdminCreateManyAndReturnArgs} args - Arguments to create many SuperAdmins.
     * @example
     * // Create many SuperAdmins
     * const superAdmin = await prisma.superAdmin.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SuperAdmins and only return the `id`
     * const superAdminWithIdOnly = await prisma.superAdmin.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SuperAdminCreateManyAndReturnArgs>(args?: SelectSubset<T, SuperAdminCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SuperAdmin.
     * @param {SuperAdminDeleteArgs} args - Arguments to delete one SuperAdmin.
     * @example
     * // Delete one SuperAdmin
     * const SuperAdmin = await prisma.superAdmin.delete({
     *   where: {
     *     // ... filter to delete one SuperAdmin
     *   }
     * })
     * 
     */
    delete<T extends SuperAdminDeleteArgs>(args: SelectSubset<T, SuperAdminDeleteArgs<ExtArgs>>): Prisma__SuperAdminClient<$Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SuperAdmin.
     * @param {SuperAdminUpdateArgs} args - Arguments to update one SuperAdmin.
     * @example
     * // Update one SuperAdmin
     * const superAdmin = await prisma.superAdmin.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SuperAdminUpdateArgs>(args: SelectSubset<T, SuperAdminUpdateArgs<ExtArgs>>): Prisma__SuperAdminClient<$Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SuperAdmins.
     * @param {SuperAdminDeleteManyArgs} args - Arguments to filter SuperAdmins to delete.
     * @example
     * // Delete a few SuperAdmins
     * const { count } = await prisma.superAdmin.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SuperAdminDeleteManyArgs>(args?: SelectSubset<T, SuperAdminDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SuperAdmins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuperAdminUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SuperAdmins
     * const superAdmin = await prisma.superAdmin.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SuperAdminUpdateManyArgs>(args: SelectSubset<T, SuperAdminUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SuperAdmins and returns the data updated in the database.
     * @param {SuperAdminUpdateManyAndReturnArgs} args - Arguments to update many SuperAdmins.
     * @example
     * // Update many SuperAdmins
     * const superAdmin = await prisma.superAdmin.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SuperAdmins and only return the `id`
     * const superAdminWithIdOnly = await prisma.superAdmin.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SuperAdminUpdateManyAndReturnArgs>(args: SelectSubset<T, SuperAdminUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SuperAdmin.
     * @param {SuperAdminUpsertArgs} args - Arguments to update or create a SuperAdmin.
     * @example
     * // Update or create a SuperAdmin
     * const superAdmin = await prisma.superAdmin.upsert({
     *   create: {
     *     // ... data to create a SuperAdmin
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SuperAdmin we want to update
     *   }
     * })
     */
    upsert<T extends SuperAdminUpsertArgs>(args: SelectSubset<T, SuperAdminUpsertArgs<ExtArgs>>): Prisma__SuperAdminClient<$Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SuperAdmins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuperAdminCountArgs} args - Arguments to filter SuperAdmins to count.
     * @example
     * // Count the number of SuperAdmins
     * const count = await prisma.superAdmin.count({
     *   where: {
     *     // ... the filter for the SuperAdmins we want to count
     *   }
     * })
    **/
    count<T extends SuperAdminCountArgs>(
      args?: Subset<T, SuperAdminCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SuperAdminCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SuperAdmin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuperAdminAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SuperAdminAggregateArgs>(args: Subset<T, SuperAdminAggregateArgs>): Prisma.PrismaPromise<GetSuperAdminAggregateType<T>>

    /**
     * Group by SuperAdmin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuperAdminGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SuperAdminGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SuperAdminGroupByArgs['orderBy'] }
        : { orderBy?: SuperAdminGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SuperAdminGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSuperAdminGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SuperAdmin model
   */
  readonly fields: SuperAdminFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SuperAdmin.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SuperAdminClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SuperAdmin model
   */
  interface SuperAdminFieldRefs {
    readonly id: FieldRef<"SuperAdmin", 'Int'>
    readonly name: FieldRef<"SuperAdmin", 'String'>
    readonly email: FieldRef<"SuperAdmin", 'String'>
    readonly passwordHash: FieldRef<"SuperAdmin", 'String'>
    readonly createdAt: FieldRef<"SuperAdmin", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SuperAdmin findUnique
   */
  export type SuperAdminFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SuperAdmin
     */
    omit?: SuperAdminOmit<ExtArgs> | null
    /**
     * Filter, which SuperAdmin to fetch.
     */
    where: SuperAdminWhereUniqueInput
  }

  /**
   * SuperAdmin findUniqueOrThrow
   */
  export type SuperAdminFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SuperAdmin
     */
    omit?: SuperAdminOmit<ExtArgs> | null
    /**
     * Filter, which SuperAdmin to fetch.
     */
    where: SuperAdminWhereUniqueInput
  }

  /**
   * SuperAdmin findFirst
   */
  export type SuperAdminFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SuperAdmin
     */
    omit?: SuperAdminOmit<ExtArgs> | null
    /**
     * Filter, which SuperAdmin to fetch.
     */
    where?: SuperAdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SuperAdmins to fetch.
     */
    orderBy?: SuperAdminOrderByWithRelationInput | SuperAdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SuperAdmins.
     */
    cursor?: SuperAdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SuperAdmins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SuperAdmins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SuperAdmins.
     */
    distinct?: SuperAdminScalarFieldEnum | SuperAdminScalarFieldEnum[]
  }

  /**
   * SuperAdmin findFirstOrThrow
   */
  export type SuperAdminFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SuperAdmin
     */
    omit?: SuperAdminOmit<ExtArgs> | null
    /**
     * Filter, which SuperAdmin to fetch.
     */
    where?: SuperAdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SuperAdmins to fetch.
     */
    orderBy?: SuperAdminOrderByWithRelationInput | SuperAdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SuperAdmins.
     */
    cursor?: SuperAdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SuperAdmins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SuperAdmins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SuperAdmins.
     */
    distinct?: SuperAdminScalarFieldEnum | SuperAdminScalarFieldEnum[]
  }

  /**
   * SuperAdmin findMany
   */
  export type SuperAdminFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SuperAdmin
     */
    omit?: SuperAdminOmit<ExtArgs> | null
    /**
     * Filter, which SuperAdmins to fetch.
     */
    where?: SuperAdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SuperAdmins to fetch.
     */
    orderBy?: SuperAdminOrderByWithRelationInput | SuperAdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SuperAdmins.
     */
    cursor?: SuperAdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SuperAdmins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SuperAdmins.
     */
    skip?: number
    distinct?: SuperAdminScalarFieldEnum | SuperAdminScalarFieldEnum[]
  }

  /**
   * SuperAdmin create
   */
  export type SuperAdminCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SuperAdmin
     */
    omit?: SuperAdminOmit<ExtArgs> | null
    /**
     * The data needed to create a SuperAdmin.
     */
    data: XOR<SuperAdminCreateInput, SuperAdminUncheckedCreateInput>
  }

  /**
   * SuperAdmin createMany
   */
  export type SuperAdminCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SuperAdmins.
     */
    data: SuperAdminCreateManyInput | SuperAdminCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SuperAdmin createManyAndReturn
   */
  export type SuperAdminCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SuperAdmin
     */
    omit?: SuperAdminOmit<ExtArgs> | null
    /**
     * The data used to create many SuperAdmins.
     */
    data: SuperAdminCreateManyInput | SuperAdminCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SuperAdmin update
   */
  export type SuperAdminUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SuperAdmin
     */
    omit?: SuperAdminOmit<ExtArgs> | null
    /**
     * The data needed to update a SuperAdmin.
     */
    data: XOR<SuperAdminUpdateInput, SuperAdminUncheckedUpdateInput>
    /**
     * Choose, which SuperAdmin to update.
     */
    where: SuperAdminWhereUniqueInput
  }

  /**
   * SuperAdmin updateMany
   */
  export type SuperAdminUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SuperAdmins.
     */
    data: XOR<SuperAdminUpdateManyMutationInput, SuperAdminUncheckedUpdateManyInput>
    /**
     * Filter which SuperAdmins to update
     */
    where?: SuperAdminWhereInput
    /**
     * Limit how many SuperAdmins to update.
     */
    limit?: number
  }

  /**
   * SuperAdmin updateManyAndReturn
   */
  export type SuperAdminUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SuperAdmin
     */
    omit?: SuperAdminOmit<ExtArgs> | null
    /**
     * The data used to update SuperAdmins.
     */
    data: XOR<SuperAdminUpdateManyMutationInput, SuperAdminUncheckedUpdateManyInput>
    /**
     * Filter which SuperAdmins to update
     */
    where?: SuperAdminWhereInput
    /**
     * Limit how many SuperAdmins to update.
     */
    limit?: number
  }

  /**
   * SuperAdmin upsert
   */
  export type SuperAdminUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SuperAdmin
     */
    omit?: SuperAdminOmit<ExtArgs> | null
    /**
     * The filter to search for the SuperAdmin to update in case it exists.
     */
    where: SuperAdminWhereUniqueInput
    /**
     * In case the SuperAdmin found by the `where` argument doesn't exist, create a new SuperAdmin with this data.
     */
    create: XOR<SuperAdminCreateInput, SuperAdminUncheckedCreateInput>
    /**
     * In case the SuperAdmin was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SuperAdminUpdateInput, SuperAdminUncheckedUpdateInput>
  }

  /**
   * SuperAdmin delete
   */
  export type SuperAdminDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SuperAdmin
     */
    omit?: SuperAdminOmit<ExtArgs> | null
    /**
     * Filter which SuperAdmin to delete.
     */
    where: SuperAdminWhereUniqueInput
  }

  /**
   * SuperAdmin deleteMany
   */
  export type SuperAdminDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SuperAdmins to delete
     */
    where?: SuperAdminWhereInput
    /**
     * Limit how many SuperAdmins to delete.
     */
    limit?: number
  }

  /**
   * SuperAdmin without action
   */
  export type SuperAdminDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SuperAdmin
     */
    omit?: SuperAdminOmit<ExtArgs> | null
  }


  /**
   * Model Tenant
   */

  export type AggregateTenant = {
    _count: TenantCountAggregateOutputType | null
    _avg: TenantAvgAggregateOutputType | null
    _sum: TenantSumAggregateOutputType | null
    _min: TenantMinAggregateOutputType | null
    _max: TenantMaxAggregateOutputType | null
  }

  export type TenantAvgAggregateOutputType = {
    id: number | null
  }

  export type TenantSumAggregateOutputType = {
    id: number | null
  }

  export type TenantMinAggregateOutputType = {
    id: number | null
    name: string | null
    subdomain: string | null
    databaseUrl: string | null
    country: string | null
    logoUrl: string | null
    status: $Enums.TenantStatus | null
    createdAt: Date | null
  }

  export type TenantMaxAggregateOutputType = {
    id: number | null
    name: string | null
    subdomain: string | null
    databaseUrl: string | null
    country: string | null
    logoUrl: string | null
    status: $Enums.TenantStatus | null
    createdAt: Date | null
  }

  export type TenantCountAggregateOutputType = {
    id: number
    name: number
    subdomain: number
    databaseUrl: number
    country: number
    logoUrl: number
    status: number
    createdAt: number
    _all: number
  }


  export type TenantAvgAggregateInputType = {
    id?: true
  }

  export type TenantSumAggregateInputType = {
    id?: true
  }

  export type TenantMinAggregateInputType = {
    id?: true
    name?: true
    subdomain?: true
    databaseUrl?: true
    country?: true
    logoUrl?: true
    status?: true
    createdAt?: true
  }

  export type TenantMaxAggregateInputType = {
    id?: true
    name?: true
    subdomain?: true
    databaseUrl?: true
    country?: true
    logoUrl?: true
    status?: true
    createdAt?: true
  }

  export type TenantCountAggregateInputType = {
    id?: true
    name?: true
    subdomain?: true
    databaseUrl?: true
    country?: true
    logoUrl?: true
    status?: true
    createdAt?: true
    _all?: true
  }

  export type TenantAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tenant to aggregate.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tenants
    **/
    _count?: true | TenantCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TenantAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TenantSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TenantMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TenantMaxAggregateInputType
  }

  export type GetTenantAggregateType<T extends TenantAggregateArgs> = {
        [P in keyof T & keyof AggregateTenant]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTenant[P]>
      : GetScalarType<T[P], AggregateTenant[P]>
  }




  export type TenantGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TenantWhereInput
    orderBy?: TenantOrderByWithAggregationInput | TenantOrderByWithAggregationInput[]
    by: TenantScalarFieldEnum[] | TenantScalarFieldEnum
    having?: TenantScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TenantCountAggregateInputType | true
    _avg?: TenantAvgAggregateInputType
    _sum?: TenantSumAggregateInputType
    _min?: TenantMinAggregateInputType
    _max?: TenantMaxAggregateInputType
  }

  export type TenantGroupByOutputType = {
    id: number
    name: string
    subdomain: string
    databaseUrl: string | null
    country: string
    logoUrl: string | null
    status: $Enums.TenantStatus
    createdAt: Date
    _count: TenantCountAggregateOutputType | null
    _avg: TenantAvgAggregateOutputType | null
    _sum: TenantSumAggregateOutputType | null
    _min: TenantMinAggregateOutputType | null
    _max: TenantMaxAggregateOutputType | null
  }

  type GetTenantGroupByPayload<T extends TenantGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TenantGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TenantGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TenantGroupByOutputType[P]>
            : GetScalarType<T[P], TenantGroupByOutputType[P]>
        }
      >
    >


  export type TenantSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    subdomain?: boolean
    databaseUrl?: boolean
    country?: boolean
    logoUrl?: boolean
    status?: boolean
    createdAt?: boolean
    staffLoginLookups?: boolean | Tenant$staffLoginLookupsArgs<ExtArgs>
    subscription?: boolean | Tenant$subscriptionArgs<ExtArgs>
    billingInvoices?: boolean | Tenant$billingInvoicesArgs<ExtArgs>
    billingPayments?: boolean | Tenant$billingPaymentsArgs<ExtArgs>
    planChangeRequests?: boolean | Tenant$planChangeRequestsArgs<ExtArgs>
    _count?: boolean | TenantCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tenant"]>

  export type TenantSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    subdomain?: boolean
    databaseUrl?: boolean
    country?: boolean
    logoUrl?: boolean
    status?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["tenant"]>

  export type TenantSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    subdomain?: boolean
    databaseUrl?: boolean
    country?: boolean
    logoUrl?: boolean
    status?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["tenant"]>

  export type TenantSelectScalar = {
    id?: boolean
    name?: boolean
    subdomain?: boolean
    databaseUrl?: boolean
    country?: boolean
    logoUrl?: boolean
    status?: boolean
    createdAt?: boolean
  }

  export type TenantOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "subdomain" | "databaseUrl" | "country" | "logoUrl" | "status" | "createdAt", ExtArgs["result"]["tenant"]>
  export type TenantInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    staffLoginLookups?: boolean | Tenant$staffLoginLookupsArgs<ExtArgs>
    subscription?: boolean | Tenant$subscriptionArgs<ExtArgs>
    billingInvoices?: boolean | Tenant$billingInvoicesArgs<ExtArgs>
    billingPayments?: boolean | Tenant$billingPaymentsArgs<ExtArgs>
    planChangeRequests?: boolean | Tenant$planChangeRequestsArgs<ExtArgs>
    _count?: boolean | TenantCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TenantIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type TenantIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $TenantPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Tenant"
    objects: {
      staffLoginLookups: Prisma.$StaffLoginLookupPayload<ExtArgs>[]
      subscription: Prisma.$TenantSubscriptionPayload<ExtArgs>[]
      billingInvoices: Prisma.$BillingInvoicePayload<ExtArgs>[]
      billingPayments: Prisma.$BillingPaymentPayload<ExtArgs>[]
      planChangeRequests: Prisma.$SubscriptionPlanChangeRequestPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      subdomain: string
      /**
       * PostgreSQL connection string for this tenant’s database (restaurant data).
       */
      databaseUrl: string | null
      country: string
      logoUrl: string | null
      status: $Enums.TenantStatus
      createdAt: Date
    }, ExtArgs["result"]["tenant"]>
    composites: {}
  }

  type TenantGetPayload<S extends boolean | null | undefined | TenantDefaultArgs> = $Result.GetResult<Prisma.$TenantPayload, S>

  type TenantCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TenantFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TenantCountAggregateInputType | true
    }

  export interface TenantDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Tenant'], meta: { name: 'Tenant' } }
    /**
     * Find zero or one Tenant that matches the filter.
     * @param {TenantFindUniqueArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TenantFindUniqueArgs>(args: SelectSubset<T, TenantFindUniqueArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Tenant that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TenantFindUniqueOrThrowArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TenantFindUniqueOrThrowArgs>(args: SelectSubset<T, TenantFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Tenant that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantFindFirstArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TenantFindFirstArgs>(args?: SelectSubset<T, TenantFindFirstArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Tenant that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantFindFirstOrThrowArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TenantFindFirstOrThrowArgs>(args?: SelectSubset<T, TenantFindFirstOrThrowArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Tenants that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tenants
     * const tenants = await prisma.tenant.findMany()
     * 
     * // Get first 10 Tenants
     * const tenants = await prisma.tenant.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tenantWithIdOnly = await prisma.tenant.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TenantFindManyArgs>(args?: SelectSubset<T, TenantFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Tenant.
     * @param {TenantCreateArgs} args - Arguments to create a Tenant.
     * @example
     * // Create one Tenant
     * const Tenant = await prisma.tenant.create({
     *   data: {
     *     // ... data to create a Tenant
     *   }
     * })
     * 
     */
    create<T extends TenantCreateArgs>(args: SelectSubset<T, TenantCreateArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Tenants.
     * @param {TenantCreateManyArgs} args - Arguments to create many Tenants.
     * @example
     * // Create many Tenants
     * const tenant = await prisma.tenant.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TenantCreateManyArgs>(args?: SelectSubset<T, TenantCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Tenants and returns the data saved in the database.
     * @param {TenantCreateManyAndReturnArgs} args - Arguments to create many Tenants.
     * @example
     * // Create many Tenants
     * const tenant = await prisma.tenant.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Tenants and only return the `id`
     * const tenantWithIdOnly = await prisma.tenant.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TenantCreateManyAndReturnArgs>(args?: SelectSubset<T, TenantCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Tenant.
     * @param {TenantDeleteArgs} args - Arguments to delete one Tenant.
     * @example
     * // Delete one Tenant
     * const Tenant = await prisma.tenant.delete({
     *   where: {
     *     // ... filter to delete one Tenant
     *   }
     * })
     * 
     */
    delete<T extends TenantDeleteArgs>(args: SelectSubset<T, TenantDeleteArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Tenant.
     * @param {TenantUpdateArgs} args - Arguments to update one Tenant.
     * @example
     * // Update one Tenant
     * const tenant = await prisma.tenant.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TenantUpdateArgs>(args: SelectSubset<T, TenantUpdateArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Tenants.
     * @param {TenantDeleteManyArgs} args - Arguments to filter Tenants to delete.
     * @example
     * // Delete a few Tenants
     * const { count } = await prisma.tenant.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TenantDeleteManyArgs>(args?: SelectSubset<T, TenantDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tenants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tenants
     * const tenant = await prisma.tenant.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TenantUpdateManyArgs>(args: SelectSubset<T, TenantUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tenants and returns the data updated in the database.
     * @param {TenantUpdateManyAndReturnArgs} args - Arguments to update many Tenants.
     * @example
     * // Update many Tenants
     * const tenant = await prisma.tenant.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Tenants and only return the `id`
     * const tenantWithIdOnly = await prisma.tenant.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TenantUpdateManyAndReturnArgs>(args: SelectSubset<T, TenantUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Tenant.
     * @param {TenantUpsertArgs} args - Arguments to update or create a Tenant.
     * @example
     * // Update or create a Tenant
     * const tenant = await prisma.tenant.upsert({
     *   create: {
     *     // ... data to create a Tenant
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Tenant we want to update
     *   }
     * })
     */
    upsert<T extends TenantUpsertArgs>(args: SelectSubset<T, TenantUpsertArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Tenants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantCountArgs} args - Arguments to filter Tenants to count.
     * @example
     * // Count the number of Tenants
     * const count = await prisma.tenant.count({
     *   where: {
     *     // ... the filter for the Tenants we want to count
     *   }
     * })
    **/
    count<T extends TenantCountArgs>(
      args?: Subset<T, TenantCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TenantCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Tenant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TenantAggregateArgs>(args: Subset<T, TenantAggregateArgs>): Prisma.PrismaPromise<GetTenantAggregateType<T>>

    /**
     * Group by Tenant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TenantGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TenantGroupByArgs['orderBy'] }
        : { orderBy?: TenantGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TenantGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTenantGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Tenant model
   */
  readonly fields: TenantFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Tenant.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TenantClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    staffLoginLookups<T extends Tenant$staffLoginLookupsArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$staffLoginLookupsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StaffLoginLookupPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    subscription<T extends Tenant$subscriptionArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$subscriptionArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantSubscriptionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    billingInvoices<T extends Tenant$billingInvoicesArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$billingInvoicesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BillingInvoicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    billingPayments<T extends Tenant$billingPaymentsArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$billingPaymentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BillingPaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    planChangeRequests<T extends Tenant$planChangeRequestsArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$planChangeRequestsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPlanChangeRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Tenant model
   */
  interface TenantFieldRefs {
    readonly id: FieldRef<"Tenant", 'Int'>
    readonly name: FieldRef<"Tenant", 'String'>
    readonly subdomain: FieldRef<"Tenant", 'String'>
    readonly databaseUrl: FieldRef<"Tenant", 'String'>
    readonly country: FieldRef<"Tenant", 'String'>
    readonly logoUrl: FieldRef<"Tenant", 'String'>
    readonly status: FieldRef<"Tenant", 'TenantStatus'>
    readonly createdAt: FieldRef<"Tenant", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Tenant findUnique
   */
  export type TenantFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant findUniqueOrThrow
   */
  export type TenantFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant findFirst
   */
  export type TenantFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tenants.
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tenants.
     */
    distinct?: TenantScalarFieldEnum | TenantScalarFieldEnum[]
  }

  /**
   * Tenant findFirstOrThrow
   */
  export type TenantFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tenants.
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tenants.
     */
    distinct?: TenantScalarFieldEnum | TenantScalarFieldEnum[]
  }

  /**
   * Tenant findMany
   */
  export type TenantFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenants to fetch.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tenants.
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    distinct?: TenantScalarFieldEnum | TenantScalarFieldEnum[]
  }

  /**
   * Tenant create
   */
  export type TenantCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * The data needed to create a Tenant.
     */
    data: XOR<TenantCreateInput, TenantUncheckedCreateInput>
  }

  /**
   * Tenant createMany
   */
  export type TenantCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tenants.
     */
    data: TenantCreateManyInput | TenantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Tenant createManyAndReturn
   */
  export type TenantCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * The data used to create many Tenants.
     */
    data: TenantCreateManyInput | TenantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Tenant update
   */
  export type TenantUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * The data needed to update a Tenant.
     */
    data: XOR<TenantUpdateInput, TenantUncheckedUpdateInput>
    /**
     * Choose, which Tenant to update.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant updateMany
   */
  export type TenantUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tenants.
     */
    data: XOR<TenantUpdateManyMutationInput, TenantUncheckedUpdateManyInput>
    /**
     * Filter which Tenants to update
     */
    where?: TenantWhereInput
    /**
     * Limit how many Tenants to update.
     */
    limit?: number
  }

  /**
   * Tenant updateManyAndReturn
   */
  export type TenantUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * The data used to update Tenants.
     */
    data: XOR<TenantUpdateManyMutationInput, TenantUncheckedUpdateManyInput>
    /**
     * Filter which Tenants to update
     */
    where?: TenantWhereInput
    /**
     * Limit how many Tenants to update.
     */
    limit?: number
  }

  /**
   * Tenant upsert
   */
  export type TenantUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * The filter to search for the Tenant to update in case it exists.
     */
    where: TenantWhereUniqueInput
    /**
     * In case the Tenant found by the `where` argument doesn't exist, create a new Tenant with this data.
     */
    create: XOR<TenantCreateInput, TenantUncheckedCreateInput>
    /**
     * In case the Tenant was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TenantUpdateInput, TenantUncheckedUpdateInput>
  }

  /**
   * Tenant delete
   */
  export type TenantDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter which Tenant to delete.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant deleteMany
   */
  export type TenantDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tenants to delete
     */
    where?: TenantWhereInput
    /**
     * Limit how many Tenants to delete.
     */
    limit?: number
  }

  /**
   * Tenant.staffLoginLookups
   */
  export type Tenant$staffLoginLookupsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StaffLoginLookup
     */
    select?: StaffLoginLookupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StaffLoginLookup
     */
    omit?: StaffLoginLookupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StaffLoginLookupInclude<ExtArgs> | null
    where?: StaffLoginLookupWhereInput
    orderBy?: StaffLoginLookupOrderByWithRelationInput | StaffLoginLookupOrderByWithRelationInput[]
    cursor?: StaffLoginLookupWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StaffLoginLookupScalarFieldEnum | StaffLoginLookupScalarFieldEnum[]
  }

  /**
   * Tenant.subscription
   */
  export type Tenant$subscriptionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantSubscription
     */
    select?: TenantSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantSubscription
     */
    omit?: TenantSubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantSubscriptionInclude<ExtArgs> | null
    where?: TenantSubscriptionWhereInput
    orderBy?: TenantSubscriptionOrderByWithRelationInput | TenantSubscriptionOrderByWithRelationInput[]
    cursor?: TenantSubscriptionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TenantSubscriptionScalarFieldEnum | TenantSubscriptionScalarFieldEnum[]
  }

  /**
   * Tenant.billingInvoices
   */
  export type Tenant$billingInvoicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoice
     */
    select?: BillingInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoice
     */
    omit?: BillingInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInvoiceInclude<ExtArgs> | null
    where?: BillingInvoiceWhereInput
    orderBy?: BillingInvoiceOrderByWithRelationInput | BillingInvoiceOrderByWithRelationInput[]
    cursor?: BillingInvoiceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BillingInvoiceScalarFieldEnum | BillingInvoiceScalarFieldEnum[]
  }

  /**
   * Tenant.billingPayments
   */
  export type Tenant$billingPaymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingPayment
     */
    select?: BillingPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingPayment
     */
    omit?: BillingPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingPaymentInclude<ExtArgs> | null
    where?: BillingPaymentWhereInput
    orderBy?: BillingPaymentOrderByWithRelationInput | BillingPaymentOrderByWithRelationInput[]
    cursor?: BillingPaymentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BillingPaymentScalarFieldEnum | BillingPaymentScalarFieldEnum[]
  }

  /**
   * Tenant.planChangeRequests
   */
  export type Tenant$planChangeRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlanChangeRequest
     */
    select?: SubscriptionPlanChangeRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPlanChangeRequest
     */
    omit?: SubscriptionPlanChangeRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPlanChangeRequestInclude<ExtArgs> | null
    where?: SubscriptionPlanChangeRequestWhereInput
    orderBy?: SubscriptionPlanChangeRequestOrderByWithRelationInput | SubscriptionPlanChangeRequestOrderByWithRelationInput[]
    cursor?: SubscriptionPlanChangeRequestWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SubscriptionPlanChangeRequestScalarFieldEnum | SubscriptionPlanChangeRequestScalarFieldEnum[]
  }

  /**
   * Tenant without action
   */
  export type TenantDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
  }


  /**
   * Model StaffLoginLookup
   */

  export type AggregateStaffLoginLookup = {
    _count: StaffLoginLookupCountAggregateOutputType | null
    _avg: StaffLoginLookupAvgAggregateOutputType | null
    _sum: StaffLoginLookupSumAggregateOutputType | null
    _min: StaffLoginLookupMinAggregateOutputType | null
    _max: StaffLoginLookupMaxAggregateOutputType | null
  }

  export type StaffLoginLookupAvgAggregateOutputType = {
    id: number | null
    tenantId: number | null
    staffId: number | null
  }

  export type StaffLoginLookupSumAggregateOutputType = {
    id: number | null
    tenantId: number | null
    staffId: number | null
  }

  export type StaffLoginLookupMinAggregateOutputType = {
    id: number | null
    email: string | null
    tenantId: number | null
    staffId: number | null
  }

  export type StaffLoginLookupMaxAggregateOutputType = {
    id: number | null
    email: string | null
    tenantId: number | null
    staffId: number | null
  }

  export type StaffLoginLookupCountAggregateOutputType = {
    id: number
    email: number
    tenantId: number
    staffId: number
    _all: number
  }


  export type StaffLoginLookupAvgAggregateInputType = {
    id?: true
    tenantId?: true
    staffId?: true
  }

  export type StaffLoginLookupSumAggregateInputType = {
    id?: true
    tenantId?: true
    staffId?: true
  }

  export type StaffLoginLookupMinAggregateInputType = {
    id?: true
    email?: true
    tenantId?: true
    staffId?: true
  }

  export type StaffLoginLookupMaxAggregateInputType = {
    id?: true
    email?: true
    tenantId?: true
    staffId?: true
  }

  export type StaffLoginLookupCountAggregateInputType = {
    id?: true
    email?: true
    tenantId?: true
    staffId?: true
    _all?: true
  }

  export type StaffLoginLookupAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StaffLoginLookup to aggregate.
     */
    where?: StaffLoginLookupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StaffLoginLookups to fetch.
     */
    orderBy?: StaffLoginLookupOrderByWithRelationInput | StaffLoginLookupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StaffLoginLookupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StaffLoginLookups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StaffLoginLookups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned StaffLoginLookups
    **/
    _count?: true | StaffLoginLookupCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: StaffLoginLookupAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: StaffLoginLookupSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StaffLoginLookupMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StaffLoginLookupMaxAggregateInputType
  }

  export type GetStaffLoginLookupAggregateType<T extends StaffLoginLookupAggregateArgs> = {
        [P in keyof T & keyof AggregateStaffLoginLookup]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStaffLoginLookup[P]>
      : GetScalarType<T[P], AggregateStaffLoginLookup[P]>
  }




  export type StaffLoginLookupGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StaffLoginLookupWhereInput
    orderBy?: StaffLoginLookupOrderByWithAggregationInput | StaffLoginLookupOrderByWithAggregationInput[]
    by: StaffLoginLookupScalarFieldEnum[] | StaffLoginLookupScalarFieldEnum
    having?: StaffLoginLookupScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StaffLoginLookupCountAggregateInputType | true
    _avg?: StaffLoginLookupAvgAggregateInputType
    _sum?: StaffLoginLookupSumAggregateInputType
    _min?: StaffLoginLookupMinAggregateInputType
    _max?: StaffLoginLookupMaxAggregateInputType
  }

  export type StaffLoginLookupGroupByOutputType = {
    id: number
    email: string
    tenantId: number
    staffId: number
    _count: StaffLoginLookupCountAggregateOutputType | null
    _avg: StaffLoginLookupAvgAggregateOutputType | null
    _sum: StaffLoginLookupSumAggregateOutputType | null
    _min: StaffLoginLookupMinAggregateOutputType | null
    _max: StaffLoginLookupMaxAggregateOutputType | null
  }

  type GetStaffLoginLookupGroupByPayload<T extends StaffLoginLookupGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StaffLoginLookupGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StaffLoginLookupGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StaffLoginLookupGroupByOutputType[P]>
            : GetScalarType<T[P], StaffLoginLookupGroupByOutputType[P]>
        }
      >
    >


  export type StaffLoginLookupSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    tenantId?: boolean
    staffId?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["staffLoginLookup"]>

  export type StaffLoginLookupSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    tenantId?: boolean
    staffId?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["staffLoginLookup"]>

  export type StaffLoginLookupSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    tenantId?: boolean
    staffId?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["staffLoginLookup"]>

  export type StaffLoginLookupSelectScalar = {
    id?: boolean
    email?: boolean
    tenantId?: boolean
    staffId?: boolean
  }

  export type StaffLoginLookupOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "tenantId" | "staffId", ExtArgs["result"]["staffLoginLookup"]>
  export type StaffLoginLookupInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type StaffLoginLookupIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type StaffLoginLookupIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }

  export type $StaffLoginLookupPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "StaffLoginLookup"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      email: string
      tenantId: number
      staffId: number
    }, ExtArgs["result"]["staffLoginLookup"]>
    composites: {}
  }

  type StaffLoginLookupGetPayload<S extends boolean | null | undefined | StaffLoginLookupDefaultArgs> = $Result.GetResult<Prisma.$StaffLoginLookupPayload, S>

  type StaffLoginLookupCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<StaffLoginLookupFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: StaffLoginLookupCountAggregateInputType | true
    }

  export interface StaffLoginLookupDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['StaffLoginLookup'], meta: { name: 'StaffLoginLookup' } }
    /**
     * Find zero or one StaffLoginLookup that matches the filter.
     * @param {StaffLoginLookupFindUniqueArgs} args - Arguments to find a StaffLoginLookup
     * @example
     * // Get one StaffLoginLookup
     * const staffLoginLookup = await prisma.staffLoginLookup.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StaffLoginLookupFindUniqueArgs>(args: SelectSubset<T, StaffLoginLookupFindUniqueArgs<ExtArgs>>): Prisma__StaffLoginLookupClient<$Result.GetResult<Prisma.$StaffLoginLookupPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one StaffLoginLookup that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {StaffLoginLookupFindUniqueOrThrowArgs} args - Arguments to find a StaffLoginLookup
     * @example
     * // Get one StaffLoginLookup
     * const staffLoginLookup = await prisma.staffLoginLookup.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StaffLoginLookupFindUniqueOrThrowArgs>(args: SelectSubset<T, StaffLoginLookupFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StaffLoginLookupClient<$Result.GetResult<Prisma.$StaffLoginLookupPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StaffLoginLookup that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StaffLoginLookupFindFirstArgs} args - Arguments to find a StaffLoginLookup
     * @example
     * // Get one StaffLoginLookup
     * const staffLoginLookup = await prisma.staffLoginLookup.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StaffLoginLookupFindFirstArgs>(args?: SelectSubset<T, StaffLoginLookupFindFirstArgs<ExtArgs>>): Prisma__StaffLoginLookupClient<$Result.GetResult<Prisma.$StaffLoginLookupPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StaffLoginLookup that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StaffLoginLookupFindFirstOrThrowArgs} args - Arguments to find a StaffLoginLookup
     * @example
     * // Get one StaffLoginLookup
     * const staffLoginLookup = await prisma.staffLoginLookup.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StaffLoginLookupFindFirstOrThrowArgs>(args?: SelectSubset<T, StaffLoginLookupFindFirstOrThrowArgs<ExtArgs>>): Prisma__StaffLoginLookupClient<$Result.GetResult<Prisma.$StaffLoginLookupPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more StaffLoginLookups that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StaffLoginLookupFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all StaffLoginLookups
     * const staffLoginLookups = await prisma.staffLoginLookup.findMany()
     * 
     * // Get first 10 StaffLoginLookups
     * const staffLoginLookups = await prisma.staffLoginLookup.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const staffLoginLookupWithIdOnly = await prisma.staffLoginLookup.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StaffLoginLookupFindManyArgs>(args?: SelectSubset<T, StaffLoginLookupFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StaffLoginLookupPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a StaffLoginLookup.
     * @param {StaffLoginLookupCreateArgs} args - Arguments to create a StaffLoginLookup.
     * @example
     * // Create one StaffLoginLookup
     * const StaffLoginLookup = await prisma.staffLoginLookup.create({
     *   data: {
     *     // ... data to create a StaffLoginLookup
     *   }
     * })
     * 
     */
    create<T extends StaffLoginLookupCreateArgs>(args: SelectSubset<T, StaffLoginLookupCreateArgs<ExtArgs>>): Prisma__StaffLoginLookupClient<$Result.GetResult<Prisma.$StaffLoginLookupPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many StaffLoginLookups.
     * @param {StaffLoginLookupCreateManyArgs} args - Arguments to create many StaffLoginLookups.
     * @example
     * // Create many StaffLoginLookups
     * const staffLoginLookup = await prisma.staffLoginLookup.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StaffLoginLookupCreateManyArgs>(args?: SelectSubset<T, StaffLoginLookupCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many StaffLoginLookups and returns the data saved in the database.
     * @param {StaffLoginLookupCreateManyAndReturnArgs} args - Arguments to create many StaffLoginLookups.
     * @example
     * // Create many StaffLoginLookups
     * const staffLoginLookup = await prisma.staffLoginLookup.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many StaffLoginLookups and only return the `id`
     * const staffLoginLookupWithIdOnly = await prisma.staffLoginLookup.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StaffLoginLookupCreateManyAndReturnArgs>(args?: SelectSubset<T, StaffLoginLookupCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StaffLoginLookupPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a StaffLoginLookup.
     * @param {StaffLoginLookupDeleteArgs} args - Arguments to delete one StaffLoginLookup.
     * @example
     * // Delete one StaffLoginLookup
     * const StaffLoginLookup = await prisma.staffLoginLookup.delete({
     *   where: {
     *     // ... filter to delete one StaffLoginLookup
     *   }
     * })
     * 
     */
    delete<T extends StaffLoginLookupDeleteArgs>(args: SelectSubset<T, StaffLoginLookupDeleteArgs<ExtArgs>>): Prisma__StaffLoginLookupClient<$Result.GetResult<Prisma.$StaffLoginLookupPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one StaffLoginLookup.
     * @param {StaffLoginLookupUpdateArgs} args - Arguments to update one StaffLoginLookup.
     * @example
     * // Update one StaffLoginLookup
     * const staffLoginLookup = await prisma.staffLoginLookup.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StaffLoginLookupUpdateArgs>(args: SelectSubset<T, StaffLoginLookupUpdateArgs<ExtArgs>>): Prisma__StaffLoginLookupClient<$Result.GetResult<Prisma.$StaffLoginLookupPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more StaffLoginLookups.
     * @param {StaffLoginLookupDeleteManyArgs} args - Arguments to filter StaffLoginLookups to delete.
     * @example
     * // Delete a few StaffLoginLookups
     * const { count } = await prisma.staffLoginLookup.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StaffLoginLookupDeleteManyArgs>(args?: SelectSubset<T, StaffLoginLookupDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StaffLoginLookups.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StaffLoginLookupUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many StaffLoginLookups
     * const staffLoginLookup = await prisma.staffLoginLookup.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StaffLoginLookupUpdateManyArgs>(args: SelectSubset<T, StaffLoginLookupUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StaffLoginLookups and returns the data updated in the database.
     * @param {StaffLoginLookupUpdateManyAndReturnArgs} args - Arguments to update many StaffLoginLookups.
     * @example
     * // Update many StaffLoginLookups
     * const staffLoginLookup = await prisma.staffLoginLookup.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more StaffLoginLookups and only return the `id`
     * const staffLoginLookupWithIdOnly = await prisma.staffLoginLookup.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends StaffLoginLookupUpdateManyAndReturnArgs>(args: SelectSubset<T, StaffLoginLookupUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StaffLoginLookupPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one StaffLoginLookup.
     * @param {StaffLoginLookupUpsertArgs} args - Arguments to update or create a StaffLoginLookup.
     * @example
     * // Update or create a StaffLoginLookup
     * const staffLoginLookup = await prisma.staffLoginLookup.upsert({
     *   create: {
     *     // ... data to create a StaffLoginLookup
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the StaffLoginLookup we want to update
     *   }
     * })
     */
    upsert<T extends StaffLoginLookupUpsertArgs>(args: SelectSubset<T, StaffLoginLookupUpsertArgs<ExtArgs>>): Prisma__StaffLoginLookupClient<$Result.GetResult<Prisma.$StaffLoginLookupPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of StaffLoginLookups.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StaffLoginLookupCountArgs} args - Arguments to filter StaffLoginLookups to count.
     * @example
     * // Count the number of StaffLoginLookups
     * const count = await prisma.staffLoginLookup.count({
     *   where: {
     *     // ... the filter for the StaffLoginLookups we want to count
     *   }
     * })
    **/
    count<T extends StaffLoginLookupCountArgs>(
      args?: Subset<T, StaffLoginLookupCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StaffLoginLookupCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a StaffLoginLookup.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StaffLoginLookupAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends StaffLoginLookupAggregateArgs>(args: Subset<T, StaffLoginLookupAggregateArgs>): Prisma.PrismaPromise<GetStaffLoginLookupAggregateType<T>>

    /**
     * Group by StaffLoginLookup.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StaffLoginLookupGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends StaffLoginLookupGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StaffLoginLookupGroupByArgs['orderBy'] }
        : { orderBy?: StaffLoginLookupGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, StaffLoginLookupGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStaffLoginLookupGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the StaffLoginLookup model
   */
  readonly fields: StaffLoginLookupFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for StaffLoginLookup.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StaffLoginLookupClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the StaffLoginLookup model
   */
  interface StaffLoginLookupFieldRefs {
    readonly id: FieldRef<"StaffLoginLookup", 'Int'>
    readonly email: FieldRef<"StaffLoginLookup", 'String'>
    readonly tenantId: FieldRef<"StaffLoginLookup", 'Int'>
    readonly staffId: FieldRef<"StaffLoginLookup", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * StaffLoginLookup findUnique
   */
  export type StaffLoginLookupFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StaffLoginLookup
     */
    select?: StaffLoginLookupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StaffLoginLookup
     */
    omit?: StaffLoginLookupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StaffLoginLookupInclude<ExtArgs> | null
    /**
     * Filter, which StaffLoginLookup to fetch.
     */
    where: StaffLoginLookupWhereUniqueInput
  }

  /**
   * StaffLoginLookup findUniqueOrThrow
   */
  export type StaffLoginLookupFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StaffLoginLookup
     */
    select?: StaffLoginLookupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StaffLoginLookup
     */
    omit?: StaffLoginLookupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StaffLoginLookupInclude<ExtArgs> | null
    /**
     * Filter, which StaffLoginLookup to fetch.
     */
    where: StaffLoginLookupWhereUniqueInput
  }

  /**
   * StaffLoginLookup findFirst
   */
  export type StaffLoginLookupFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StaffLoginLookup
     */
    select?: StaffLoginLookupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StaffLoginLookup
     */
    omit?: StaffLoginLookupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StaffLoginLookupInclude<ExtArgs> | null
    /**
     * Filter, which StaffLoginLookup to fetch.
     */
    where?: StaffLoginLookupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StaffLoginLookups to fetch.
     */
    orderBy?: StaffLoginLookupOrderByWithRelationInput | StaffLoginLookupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StaffLoginLookups.
     */
    cursor?: StaffLoginLookupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StaffLoginLookups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StaffLoginLookups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StaffLoginLookups.
     */
    distinct?: StaffLoginLookupScalarFieldEnum | StaffLoginLookupScalarFieldEnum[]
  }

  /**
   * StaffLoginLookup findFirstOrThrow
   */
  export type StaffLoginLookupFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StaffLoginLookup
     */
    select?: StaffLoginLookupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StaffLoginLookup
     */
    omit?: StaffLoginLookupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StaffLoginLookupInclude<ExtArgs> | null
    /**
     * Filter, which StaffLoginLookup to fetch.
     */
    where?: StaffLoginLookupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StaffLoginLookups to fetch.
     */
    orderBy?: StaffLoginLookupOrderByWithRelationInput | StaffLoginLookupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StaffLoginLookups.
     */
    cursor?: StaffLoginLookupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StaffLoginLookups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StaffLoginLookups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StaffLoginLookups.
     */
    distinct?: StaffLoginLookupScalarFieldEnum | StaffLoginLookupScalarFieldEnum[]
  }

  /**
   * StaffLoginLookup findMany
   */
  export type StaffLoginLookupFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StaffLoginLookup
     */
    select?: StaffLoginLookupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StaffLoginLookup
     */
    omit?: StaffLoginLookupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StaffLoginLookupInclude<ExtArgs> | null
    /**
     * Filter, which StaffLoginLookups to fetch.
     */
    where?: StaffLoginLookupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StaffLoginLookups to fetch.
     */
    orderBy?: StaffLoginLookupOrderByWithRelationInput | StaffLoginLookupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing StaffLoginLookups.
     */
    cursor?: StaffLoginLookupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StaffLoginLookups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StaffLoginLookups.
     */
    skip?: number
    distinct?: StaffLoginLookupScalarFieldEnum | StaffLoginLookupScalarFieldEnum[]
  }

  /**
   * StaffLoginLookup create
   */
  export type StaffLoginLookupCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StaffLoginLookup
     */
    select?: StaffLoginLookupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StaffLoginLookup
     */
    omit?: StaffLoginLookupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StaffLoginLookupInclude<ExtArgs> | null
    /**
     * The data needed to create a StaffLoginLookup.
     */
    data: XOR<StaffLoginLookupCreateInput, StaffLoginLookupUncheckedCreateInput>
  }

  /**
   * StaffLoginLookup createMany
   */
  export type StaffLoginLookupCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many StaffLoginLookups.
     */
    data: StaffLoginLookupCreateManyInput | StaffLoginLookupCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * StaffLoginLookup createManyAndReturn
   */
  export type StaffLoginLookupCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StaffLoginLookup
     */
    select?: StaffLoginLookupSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the StaffLoginLookup
     */
    omit?: StaffLoginLookupOmit<ExtArgs> | null
    /**
     * The data used to create many StaffLoginLookups.
     */
    data: StaffLoginLookupCreateManyInput | StaffLoginLookupCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StaffLoginLookupIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * StaffLoginLookup update
   */
  export type StaffLoginLookupUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StaffLoginLookup
     */
    select?: StaffLoginLookupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StaffLoginLookup
     */
    omit?: StaffLoginLookupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StaffLoginLookupInclude<ExtArgs> | null
    /**
     * The data needed to update a StaffLoginLookup.
     */
    data: XOR<StaffLoginLookupUpdateInput, StaffLoginLookupUncheckedUpdateInput>
    /**
     * Choose, which StaffLoginLookup to update.
     */
    where: StaffLoginLookupWhereUniqueInput
  }

  /**
   * StaffLoginLookup updateMany
   */
  export type StaffLoginLookupUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update StaffLoginLookups.
     */
    data: XOR<StaffLoginLookupUpdateManyMutationInput, StaffLoginLookupUncheckedUpdateManyInput>
    /**
     * Filter which StaffLoginLookups to update
     */
    where?: StaffLoginLookupWhereInput
    /**
     * Limit how many StaffLoginLookups to update.
     */
    limit?: number
  }

  /**
   * StaffLoginLookup updateManyAndReturn
   */
  export type StaffLoginLookupUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StaffLoginLookup
     */
    select?: StaffLoginLookupSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the StaffLoginLookup
     */
    omit?: StaffLoginLookupOmit<ExtArgs> | null
    /**
     * The data used to update StaffLoginLookups.
     */
    data: XOR<StaffLoginLookupUpdateManyMutationInput, StaffLoginLookupUncheckedUpdateManyInput>
    /**
     * Filter which StaffLoginLookups to update
     */
    where?: StaffLoginLookupWhereInput
    /**
     * Limit how many StaffLoginLookups to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StaffLoginLookupIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * StaffLoginLookup upsert
   */
  export type StaffLoginLookupUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StaffLoginLookup
     */
    select?: StaffLoginLookupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StaffLoginLookup
     */
    omit?: StaffLoginLookupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StaffLoginLookupInclude<ExtArgs> | null
    /**
     * The filter to search for the StaffLoginLookup to update in case it exists.
     */
    where: StaffLoginLookupWhereUniqueInput
    /**
     * In case the StaffLoginLookup found by the `where` argument doesn't exist, create a new StaffLoginLookup with this data.
     */
    create: XOR<StaffLoginLookupCreateInput, StaffLoginLookupUncheckedCreateInput>
    /**
     * In case the StaffLoginLookup was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StaffLoginLookupUpdateInput, StaffLoginLookupUncheckedUpdateInput>
  }

  /**
   * StaffLoginLookup delete
   */
  export type StaffLoginLookupDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StaffLoginLookup
     */
    select?: StaffLoginLookupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StaffLoginLookup
     */
    omit?: StaffLoginLookupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StaffLoginLookupInclude<ExtArgs> | null
    /**
     * Filter which StaffLoginLookup to delete.
     */
    where: StaffLoginLookupWhereUniqueInput
  }

  /**
   * StaffLoginLookup deleteMany
   */
  export type StaffLoginLookupDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StaffLoginLookups to delete
     */
    where?: StaffLoginLookupWhereInput
    /**
     * Limit how many StaffLoginLookups to delete.
     */
    limit?: number
  }

  /**
   * StaffLoginLookup without action
   */
  export type StaffLoginLookupDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StaffLoginLookup
     */
    select?: StaffLoginLookupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StaffLoginLookup
     */
    omit?: StaffLoginLookupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StaffLoginLookupInclude<ExtArgs> | null
  }


  /**
   * Model PasswordResetToken
   */

  export type AggregatePasswordResetToken = {
    _count: PasswordResetTokenCountAggregateOutputType | null
    _avg: PasswordResetTokenAvgAggregateOutputType | null
    _sum: PasswordResetTokenSumAggregateOutputType | null
    _min: PasswordResetTokenMinAggregateOutputType | null
    _max: PasswordResetTokenMaxAggregateOutputType | null
  }

  export type PasswordResetTokenAvgAggregateOutputType = {
    id: number | null
    tenantId: number | null
    staffId: number | null
  }

  export type PasswordResetTokenSumAggregateOutputType = {
    id: number | null
    tenantId: number | null
    staffId: number | null
  }

  export type PasswordResetTokenMinAggregateOutputType = {
    id: number | null
    tokenHash: string | null
    email: string | null
    kind: string | null
    tenantId: number | null
    staffId: number | null
    expiresAt: Date | null
    usedAt: Date | null
    createdAt: Date | null
  }

  export type PasswordResetTokenMaxAggregateOutputType = {
    id: number | null
    tokenHash: string | null
    email: string | null
    kind: string | null
    tenantId: number | null
    staffId: number | null
    expiresAt: Date | null
    usedAt: Date | null
    createdAt: Date | null
  }

  export type PasswordResetTokenCountAggregateOutputType = {
    id: number
    tokenHash: number
    email: number
    kind: number
    tenantId: number
    staffId: number
    expiresAt: number
    usedAt: number
    createdAt: number
    _all: number
  }


  export type PasswordResetTokenAvgAggregateInputType = {
    id?: true
    tenantId?: true
    staffId?: true
  }

  export type PasswordResetTokenSumAggregateInputType = {
    id?: true
    tenantId?: true
    staffId?: true
  }

  export type PasswordResetTokenMinAggregateInputType = {
    id?: true
    tokenHash?: true
    email?: true
    kind?: true
    tenantId?: true
    staffId?: true
    expiresAt?: true
    usedAt?: true
    createdAt?: true
  }

  export type PasswordResetTokenMaxAggregateInputType = {
    id?: true
    tokenHash?: true
    email?: true
    kind?: true
    tenantId?: true
    staffId?: true
    expiresAt?: true
    usedAt?: true
    createdAt?: true
  }

  export type PasswordResetTokenCountAggregateInputType = {
    id?: true
    tokenHash?: true
    email?: true
    kind?: true
    tenantId?: true
    staffId?: true
    expiresAt?: true
    usedAt?: true
    createdAt?: true
    _all?: true
  }

  export type PasswordResetTokenAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PasswordResetToken to aggregate.
     */
    where?: PasswordResetTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasswordResetTokens to fetch.
     */
    orderBy?: PasswordResetTokenOrderByWithRelationInput | PasswordResetTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PasswordResetTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasswordResetTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasswordResetTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PasswordResetTokens
    **/
    _count?: true | PasswordResetTokenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PasswordResetTokenAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PasswordResetTokenSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PasswordResetTokenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PasswordResetTokenMaxAggregateInputType
  }

  export type GetPasswordResetTokenAggregateType<T extends PasswordResetTokenAggregateArgs> = {
        [P in keyof T & keyof AggregatePasswordResetToken]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePasswordResetToken[P]>
      : GetScalarType<T[P], AggregatePasswordResetToken[P]>
  }




  export type PasswordResetTokenGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PasswordResetTokenWhereInput
    orderBy?: PasswordResetTokenOrderByWithAggregationInput | PasswordResetTokenOrderByWithAggregationInput[]
    by: PasswordResetTokenScalarFieldEnum[] | PasswordResetTokenScalarFieldEnum
    having?: PasswordResetTokenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PasswordResetTokenCountAggregateInputType | true
    _avg?: PasswordResetTokenAvgAggregateInputType
    _sum?: PasswordResetTokenSumAggregateInputType
    _min?: PasswordResetTokenMinAggregateInputType
    _max?: PasswordResetTokenMaxAggregateInputType
  }

  export type PasswordResetTokenGroupByOutputType = {
    id: number
    tokenHash: string
    email: string
    kind: string
    tenantId: number | null
    staffId: number | null
    expiresAt: Date
    usedAt: Date | null
    createdAt: Date
    _count: PasswordResetTokenCountAggregateOutputType | null
    _avg: PasswordResetTokenAvgAggregateOutputType | null
    _sum: PasswordResetTokenSumAggregateOutputType | null
    _min: PasswordResetTokenMinAggregateOutputType | null
    _max: PasswordResetTokenMaxAggregateOutputType | null
  }

  type GetPasswordResetTokenGroupByPayload<T extends PasswordResetTokenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PasswordResetTokenGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PasswordResetTokenGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PasswordResetTokenGroupByOutputType[P]>
            : GetScalarType<T[P], PasswordResetTokenGroupByOutputType[P]>
        }
      >
    >


  export type PasswordResetTokenSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tokenHash?: boolean
    email?: boolean
    kind?: boolean
    tenantId?: boolean
    staffId?: boolean
    expiresAt?: boolean
    usedAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["passwordResetToken"]>

  export type PasswordResetTokenSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tokenHash?: boolean
    email?: boolean
    kind?: boolean
    tenantId?: boolean
    staffId?: boolean
    expiresAt?: boolean
    usedAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["passwordResetToken"]>

  export type PasswordResetTokenSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tokenHash?: boolean
    email?: boolean
    kind?: boolean
    tenantId?: boolean
    staffId?: boolean
    expiresAt?: boolean
    usedAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["passwordResetToken"]>

  export type PasswordResetTokenSelectScalar = {
    id?: boolean
    tokenHash?: boolean
    email?: boolean
    kind?: boolean
    tenantId?: boolean
    staffId?: boolean
    expiresAt?: boolean
    usedAt?: boolean
    createdAt?: boolean
  }

  export type PasswordResetTokenOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tokenHash" | "email" | "kind" | "tenantId" | "staffId" | "expiresAt" | "usedAt" | "createdAt", ExtArgs["result"]["passwordResetToken"]>

  export type $PasswordResetTokenPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PasswordResetToken"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      tokenHash: string
      email: string
      /**
       * SUPER_ADMIN or STAFF (column name in DB: userType)
       */
      kind: string
      tenantId: number | null
      staffId: number | null
      expiresAt: Date
      usedAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["passwordResetToken"]>
    composites: {}
  }

  type PasswordResetTokenGetPayload<S extends boolean | null | undefined | PasswordResetTokenDefaultArgs> = $Result.GetResult<Prisma.$PasswordResetTokenPayload, S>

  type PasswordResetTokenCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PasswordResetTokenFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PasswordResetTokenCountAggregateInputType | true
    }

  export interface PasswordResetTokenDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PasswordResetToken'], meta: { name: 'PasswordResetToken' } }
    /**
     * Find zero or one PasswordResetToken that matches the filter.
     * @param {PasswordResetTokenFindUniqueArgs} args - Arguments to find a PasswordResetToken
     * @example
     * // Get one PasswordResetToken
     * const passwordResetToken = await prisma.passwordResetToken.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PasswordResetTokenFindUniqueArgs>(args: SelectSubset<T, PasswordResetTokenFindUniqueArgs<ExtArgs>>): Prisma__PasswordResetTokenClient<$Result.GetResult<Prisma.$PasswordResetTokenPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PasswordResetToken that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PasswordResetTokenFindUniqueOrThrowArgs} args - Arguments to find a PasswordResetToken
     * @example
     * // Get one PasswordResetToken
     * const passwordResetToken = await prisma.passwordResetToken.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PasswordResetTokenFindUniqueOrThrowArgs>(args: SelectSubset<T, PasswordResetTokenFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PasswordResetTokenClient<$Result.GetResult<Prisma.$PasswordResetTokenPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PasswordResetToken that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetTokenFindFirstArgs} args - Arguments to find a PasswordResetToken
     * @example
     * // Get one PasswordResetToken
     * const passwordResetToken = await prisma.passwordResetToken.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PasswordResetTokenFindFirstArgs>(args?: SelectSubset<T, PasswordResetTokenFindFirstArgs<ExtArgs>>): Prisma__PasswordResetTokenClient<$Result.GetResult<Prisma.$PasswordResetTokenPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PasswordResetToken that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetTokenFindFirstOrThrowArgs} args - Arguments to find a PasswordResetToken
     * @example
     * // Get one PasswordResetToken
     * const passwordResetToken = await prisma.passwordResetToken.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PasswordResetTokenFindFirstOrThrowArgs>(args?: SelectSubset<T, PasswordResetTokenFindFirstOrThrowArgs<ExtArgs>>): Prisma__PasswordResetTokenClient<$Result.GetResult<Prisma.$PasswordResetTokenPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PasswordResetTokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetTokenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PasswordResetTokens
     * const passwordResetTokens = await prisma.passwordResetToken.findMany()
     * 
     * // Get first 10 PasswordResetTokens
     * const passwordResetTokens = await prisma.passwordResetToken.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const passwordResetTokenWithIdOnly = await prisma.passwordResetToken.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PasswordResetTokenFindManyArgs>(args?: SelectSubset<T, PasswordResetTokenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PasswordResetTokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PasswordResetToken.
     * @param {PasswordResetTokenCreateArgs} args - Arguments to create a PasswordResetToken.
     * @example
     * // Create one PasswordResetToken
     * const PasswordResetToken = await prisma.passwordResetToken.create({
     *   data: {
     *     // ... data to create a PasswordResetToken
     *   }
     * })
     * 
     */
    create<T extends PasswordResetTokenCreateArgs>(args: SelectSubset<T, PasswordResetTokenCreateArgs<ExtArgs>>): Prisma__PasswordResetTokenClient<$Result.GetResult<Prisma.$PasswordResetTokenPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PasswordResetTokens.
     * @param {PasswordResetTokenCreateManyArgs} args - Arguments to create many PasswordResetTokens.
     * @example
     * // Create many PasswordResetTokens
     * const passwordResetToken = await prisma.passwordResetToken.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PasswordResetTokenCreateManyArgs>(args?: SelectSubset<T, PasswordResetTokenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PasswordResetTokens and returns the data saved in the database.
     * @param {PasswordResetTokenCreateManyAndReturnArgs} args - Arguments to create many PasswordResetTokens.
     * @example
     * // Create many PasswordResetTokens
     * const passwordResetToken = await prisma.passwordResetToken.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PasswordResetTokens and only return the `id`
     * const passwordResetTokenWithIdOnly = await prisma.passwordResetToken.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PasswordResetTokenCreateManyAndReturnArgs>(args?: SelectSubset<T, PasswordResetTokenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PasswordResetTokenPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PasswordResetToken.
     * @param {PasswordResetTokenDeleteArgs} args - Arguments to delete one PasswordResetToken.
     * @example
     * // Delete one PasswordResetToken
     * const PasswordResetToken = await prisma.passwordResetToken.delete({
     *   where: {
     *     // ... filter to delete one PasswordResetToken
     *   }
     * })
     * 
     */
    delete<T extends PasswordResetTokenDeleteArgs>(args: SelectSubset<T, PasswordResetTokenDeleteArgs<ExtArgs>>): Prisma__PasswordResetTokenClient<$Result.GetResult<Prisma.$PasswordResetTokenPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PasswordResetToken.
     * @param {PasswordResetTokenUpdateArgs} args - Arguments to update one PasswordResetToken.
     * @example
     * // Update one PasswordResetToken
     * const passwordResetToken = await prisma.passwordResetToken.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PasswordResetTokenUpdateArgs>(args: SelectSubset<T, PasswordResetTokenUpdateArgs<ExtArgs>>): Prisma__PasswordResetTokenClient<$Result.GetResult<Prisma.$PasswordResetTokenPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PasswordResetTokens.
     * @param {PasswordResetTokenDeleteManyArgs} args - Arguments to filter PasswordResetTokens to delete.
     * @example
     * // Delete a few PasswordResetTokens
     * const { count } = await prisma.passwordResetToken.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PasswordResetTokenDeleteManyArgs>(args?: SelectSubset<T, PasswordResetTokenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PasswordResetTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetTokenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PasswordResetTokens
     * const passwordResetToken = await prisma.passwordResetToken.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PasswordResetTokenUpdateManyArgs>(args: SelectSubset<T, PasswordResetTokenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PasswordResetTokens and returns the data updated in the database.
     * @param {PasswordResetTokenUpdateManyAndReturnArgs} args - Arguments to update many PasswordResetTokens.
     * @example
     * // Update many PasswordResetTokens
     * const passwordResetToken = await prisma.passwordResetToken.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PasswordResetTokens and only return the `id`
     * const passwordResetTokenWithIdOnly = await prisma.passwordResetToken.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PasswordResetTokenUpdateManyAndReturnArgs>(args: SelectSubset<T, PasswordResetTokenUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PasswordResetTokenPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PasswordResetToken.
     * @param {PasswordResetTokenUpsertArgs} args - Arguments to update or create a PasswordResetToken.
     * @example
     * // Update or create a PasswordResetToken
     * const passwordResetToken = await prisma.passwordResetToken.upsert({
     *   create: {
     *     // ... data to create a PasswordResetToken
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PasswordResetToken we want to update
     *   }
     * })
     */
    upsert<T extends PasswordResetTokenUpsertArgs>(args: SelectSubset<T, PasswordResetTokenUpsertArgs<ExtArgs>>): Prisma__PasswordResetTokenClient<$Result.GetResult<Prisma.$PasswordResetTokenPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PasswordResetTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetTokenCountArgs} args - Arguments to filter PasswordResetTokens to count.
     * @example
     * // Count the number of PasswordResetTokens
     * const count = await prisma.passwordResetToken.count({
     *   where: {
     *     // ... the filter for the PasswordResetTokens we want to count
     *   }
     * })
    **/
    count<T extends PasswordResetTokenCountArgs>(
      args?: Subset<T, PasswordResetTokenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PasswordResetTokenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PasswordResetToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetTokenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PasswordResetTokenAggregateArgs>(args: Subset<T, PasswordResetTokenAggregateArgs>): Prisma.PrismaPromise<GetPasswordResetTokenAggregateType<T>>

    /**
     * Group by PasswordResetToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetTokenGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PasswordResetTokenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PasswordResetTokenGroupByArgs['orderBy'] }
        : { orderBy?: PasswordResetTokenGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PasswordResetTokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPasswordResetTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PasswordResetToken model
   */
  readonly fields: PasswordResetTokenFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PasswordResetToken.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PasswordResetTokenClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PasswordResetToken model
   */
  interface PasswordResetTokenFieldRefs {
    readonly id: FieldRef<"PasswordResetToken", 'Int'>
    readonly tokenHash: FieldRef<"PasswordResetToken", 'String'>
    readonly email: FieldRef<"PasswordResetToken", 'String'>
    readonly kind: FieldRef<"PasswordResetToken", 'String'>
    readonly tenantId: FieldRef<"PasswordResetToken", 'Int'>
    readonly staffId: FieldRef<"PasswordResetToken", 'Int'>
    readonly expiresAt: FieldRef<"PasswordResetToken", 'DateTime'>
    readonly usedAt: FieldRef<"PasswordResetToken", 'DateTime'>
    readonly createdAt: FieldRef<"PasswordResetToken", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PasswordResetToken findUnique
   */
  export type PasswordResetTokenFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null
    /**
     * Filter, which PasswordResetToken to fetch.
     */
    where: PasswordResetTokenWhereUniqueInput
  }

  /**
   * PasswordResetToken findUniqueOrThrow
   */
  export type PasswordResetTokenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null
    /**
     * Filter, which PasswordResetToken to fetch.
     */
    where: PasswordResetTokenWhereUniqueInput
  }

  /**
   * PasswordResetToken findFirst
   */
  export type PasswordResetTokenFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null
    /**
     * Filter, which PasswordResetToken to fetch.
     */
    where?: PasswordResetTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasswordResetTokens to fetch.
     */
    orderBy?: PasswordResetTokenOrderByWithRelationInput | PasswordResetTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PasswordResetTokens.
     */
    cursor?: PasswordResetTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasswordResetTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasswordResetTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PasswordResetTokens.
     */
    distinct?: PasswordResetTokenScalarFieldEnum | PasswordResetTokenScalarFieldEnum[]
  }

  /**
   * PasswordResetToken findFirstOrThrow
   */
  export type PasswordResetTokenFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null
    /**
     * Filter, which PasswordResetToken to fetch.
     */
    where?: PasswordResetTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasswordResetTokens to fetch.
     */
    orderBy?: PasswordResetTokenOrderByWithRelationInput | PasswordResetTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PasswordResetTokens.
     */
    cursor?: PasswordResetTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasswordResetTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasswordResetTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PasswordResetTokens.
     */
    distinct?: PasswordResetTokenScalarFieldEnum | PasswordResetTokenScalarFieldEnum[]
  }

  /**
   * PasswordResetToken findMany
   */
  export type PasswordResetTokenFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null
    /**
     * Filter, which PasswordResetTokens to fetch.
     */
    where?: PasswordResetTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasswordResetTokens to fetch.
     */
    orderBy?: PasswordResetTokenOrderByWithRelationInput | PasswordResetTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PasswordResetTokens.
     */
    cursor?: PasswordResetTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasswordResetTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasswordResetTokens.
     */
    skip?: number
    distinct?: PasswordResetTokenScalarFieldEnum | PasswordResetTokenScalarFieldEnum[]
  }

  /**
   * PasswordResetToken create
   */
  export type PasswordResetTokenCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null
    /**
     * The data needed to create a PasswordResetToken.
     */
    data: XOR<PasswordResetTokenCreateInput, PasswordResetTokenUncheckedCreateInput>
  }

  /**
   * PasswordResetToken createMany
   */
  export type PasswordResetTokenCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PasswordResetTokens.
     */
    data: PasswordResetTokenCreateManyInput | PasswordResetTokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PasswordResetToken createManyAndReturn
   */
  export type PasswordResetTokenCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null
    /**
     * The data used to create many PasswordResetTokens.
     */
    data: PasswordResetTokenCreateManyInput | PasswordResetTokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PasswordResetToken update
   */
  export type PasswordResetTokenUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null
    /**
     * The data needed to update a PasswordResetToken.
     */
    data: XOR<PasswordResetTokenUpdateInput, PasswordResetTokenUncheckedUpdateInput>
    /**
     * Choose, which PasswordResetToken to update.
     */
    where: PasswordResetTokenWhereUniqueInput
  }

  /**
   * PasswordResetToken updateMany
   */
  export type PasswordResetTokenUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PasswordResetTokens.
     */
    data: XOR<PasswordResetTokenUpdateManyMutationInput, PasswordResetTokenUncheckedUpdateManyInput>
    /**
     * Filter which PasswordResetTokens to update
     */
    where?: PasswordResetTokenWhereInput
    /**
     * Limit how many PasswordResetTokens to update.
     */
    limit?: number
  }

  /**
   * PasswordResetToken updateManyAndReturn
   */
  export type PasswordResetTokenUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null
    /**
     * The data used to update PasswordResetTokens.
     */
    data: XOR<PasswordResetTokenUpdateManyMutationInput, PasswordResetTokenUncheckedUpdateManyInput>
    /**
     * Filter which PasswordResetTokens to update
     */
    where?: PasswordResetTokenWhereInput
    /**
     * Limit how many PasswordResetTokens to update.
     */
    limit?: number
  }

  /**
   * PasswordResetToken upsert
   */
  export type PasswordResetTokenUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null
    /**
     * The filter to search for the PasswordResetToken to update in case it exists.
     */
    where: PasswordResetTokenWhereUniqueInput
    /**
     * In case the PasswordResetToken found by the `where` argument doesn't exist, create a new PasswordResetToken with this data.
     */
    create: XOR<PasswordResetTokenCreateInput, PasswordResetTokenUncheckedCreateInput>
    /**
     * In case the PasswordResetToken was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PasswordResetTokenUpdateInput, PasswordResetTokenUncheckedUpdateInput>
  }

  /**
   * PasswordResetToken delete
   */
  export type PasswordResetTokenDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null
    /**
     * Filter which PasswordResetToken to delete.
     */
    where: PasswordResetTokenWhereUniqueInput
  }

  /**
   * PasswordResetToken deleteMany
   */
  export type PasswordResetTokenDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PasswordResetTokens to delete
     */
    where?: PasswordResetTokenWhereInput
    /**
     * Limit how many PasswordResetTokens to delete.
     */
    limit?: number
  }

  /**
   * PasswordResetToken without action
   */
  export type PasswordResetTokenDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null
  }


  /**
   * Model FiskalyPlatformConfig
   */

  export type AggregateFiskalyPlatformConfig = {
    _count: FiskalyPlatformConfigCountAggregateOutputType | null
    _avg: FiskalyPlatformConfigAvgAggregateOutputType | null
    _sum: FiskalyPlatformConfigSumAggregateOutputType | null
    _min: FiskalyPlatformConfigMinAggregateOutputType | null
    _max: FiskalyPlatformConfigMaxAggregateOutputType | null
  }

  export type FiskalyPlatformConfigAvgAggregateOutputType = {
    id: number | null
  }

  export type FiskalyPlatformConfigSumAggregateOutputType = {
    id: number | null
  }

  export type FiskalyPlatformConfigMinAggregateOutputType = {
    id: number | null
    apiKey: string | null
    tssId: string | null
    clientId: string | null
    adminPuk: string | null
    updatedAt: Date | null
  }

  export type FiskalyPlatformConfigMaxAggregateOutputType = {
    id: number | null
    apiKey: string | null
    tssId: string | null
    clientId: string | null
    adminPuk: string | null
    updatedAt: Date | null
  }

  export type FiskalyPlatformConfigCountAggregateOutputType = {
    id: number
    apiKey: number
    tssId: number
    clientId: number
    adminPuk: number
    updatedAt: number
    _all: number
  }


  export type FiskalyPlatformConfigAvgAggregateInputType = {
    id?: true
  }

  export type FiskalyPlatformConfigSumAggregateInputType = {
    id?: true
  }

  export type FiskalyPlatformConfigMinAggregateInputType = {
    id?: true
    apiKey?: true
    tssId?: true
    clientId?: true
    adminPuk?: true
    updatedAt?: true
  }

  export type FiskalyPlatformConfigMaxAggregateInputType = {
    id?: true
    apiKey?: true
    tssId?: true
    clientId?: true
    adminPuk?: true
    updatedAt?: true
  }

  export type FiskalyPlatformConfigCountAggregateInputType = {
    id?: true
    apiKey?: true
    tssId?: true
    clientId?: true
    adminPuk?: true
    updatedAt?: true
    _all?: true
  }

  export type FiskalyPlatformConfigAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FiskalyPlatformConfig to aggregate.
     */
    where?: FiskalyPlatformConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FiskalyPlatformConfigs to fetch.
     */
    orderBy?: FiskalyPlatformConfigOrderByWithRelationInput | FiskalyPlatformConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FiskalyPlatformConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FiskalyPlatformConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FiskalyPlatformConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FiskalyPlatformConfigs
    **/
    _count?: true | FiskalyPlatformConfigCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FiskalyPlatformConfigAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FiskalyPlatformConfigSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FiskalyPlatformConfigMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FiskalyPlatformConfigMaxAggregateInputType
  }

  export type GetFiskalyPlatformConfigAggregateType<T extends FiskalyPlatformConfigAggregateArgs> = {
        [P in keyof T & keyof AggregateFiskalyPlatformConfig]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFiskalyPlatformConfig[P]>
      : GetScalarType<T[P], AggregateFiskalyPlatformConfig[P]>
  }




  export type FiskalyPlatformConfigGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FiskalyPlatformConfigWhereInput
    orderBy?: FiskalyPlatformConfigOrderByWithAggregationInput | FiskalyPlatformConfigOrderByWithAggregationInput[]
    by: FiskalyPlatformConfigScalarFieldEnum[] | FiskalyPlatformConfigScalarFieldEnum
    having?: FiskalyPlatformConfigScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FiskalyPlatformConfigCountAggregateInputType | true
    _avg?: FiskalyPlatformConfigAvgAggregateInputType
    _sum?: FiskalyPlatformConfigSumAggregateInputType
    _min?: FiskalyPlatformConfigMinAggregateInputType
    _max?: FiskalyPlatformConfigMaxAggregateInputType
  }

  export type FiskalyPlatformConfigGroupByOutputType = {
    id: number
    apiKey: string
    tssId: string
    clientId: string
    adminPuk: string | null
    updatedAt: Date
    _count: FiskalyPlatformConfigCountAggregateOutputType | null
    _avg: FiskalyPlatformConfigAvgAggregateOutputType | null
    _sum: FiskalyPlatformConfigSumAggregateOutputType | null
    _min: FiskalyPlatformConfigMinAggregateOutputType | null
    _max: FiskalyPlatformConfigMaxAggregateOutputType | null
  }

  type GetFiskalyPlatformConfigGroupByPayload<T extends FiskalyPlatformConfigGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FiskalyPlatformConfigGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FiskalyPlatformConfigGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FiskalyPlatformConfigGroupByOutputType[P]>
            : GetScalarType<T[P], FiskalyPlatformConfigGroupByOutputType[P]>
        }
      >
    >


  export type FiskalyPlatformConfigSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    apiKey?: boolean
    tssId?: boolean
    clientId?: boolean
    adminPuk?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["fiskalyPlatformConfig"]>

  export type FiskalyPlatformConfigSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    apiKey?: boolean
    tssId?: boolean
    clientId?: boolean
    adminPuk?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["fiskalyPlatformConfig"]>

  export type FiskalyPlatformConfigSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    apiKey?: boolean
    tssId?: boolean
    clientId?: boolean
    adminPuk?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["fiskalyPlatformConfig"]>

  export type FiskalyPlatformConfigSelectScalar = {
    id?: boolean
    apiKey?: boolean
    tssId?: boolean
    clientId?: boolean
    adminPuk?: boolean
    updatedAt?: boolean
  }

  export type FiskalyPlatformConfigOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "apiKey" | "tssId" | "clientId" | "adminPuk" | "updatedAt", ExtArgs["result"]["fiskalyPlatformConfig"]>

  export type $FiskalyPlatformConfigPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FiskalyPlatformConfig"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      apiKey: string
      tssId: string
      clientId: string
      adminPuk: string | null
      updatedAt: Date
    }, ExtArgs["result"]["fiskalyPlatformConfig"]>
    composites: {}
  }

  type FiskalyPlatformConfigGetPayload<S extends boolean | null | undefined | FiskalyPlatformConfigDefaultArgs> = $Result.GetResult<Prisma.$FiskalyPlatformConfigPayload, S>

  type FiskalyPlatformConfigCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FiskalyPlatformConfigFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FiskalyPlatformConfigCountAggregateInputType | true
    }

  export interface FiskalyPlatformConfigDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FiskalyPlatformConfig'], meta: { name: 'FiskalyPlatformConfig' } }
    /**
     * Find zero or one FiskalyPlatformConfig that matches the filter.
     * @param {FiskalyPlatformConfigFindUniqueArgs} args - Arguments to find a FiskalyPlatformConfig
     * @example
     * // Get one FiskalyPlatformConfig
     * const fiskalyPlatformConfig = await prisma.fiskalyPlatformConfig.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FiskalyPlatformConfigFindUniqueArgs>(args: SelectSubset<T, FiskalyPlatformConfigFindUniqueArgs<ExtArgs>>): Prisma__FiskalyPlatformConfigClient<$Result.GetResult<Prisma.$FiskalyPlatformConfigPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one FiskalyPlatformConfig that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FiskalyPlatformConfigFindUniqueOrThrowArgs} args - Arguments to find a FiskalyPlatformConfig
     * @example
     * // Get one FiskalyPlatformConfig
     * const fiskalyPlatformConfig = await prisma.fiskalyPlatformConfig.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FiskalyPlatformConfigFindUniqueOrThrowArgs>(args: SelectSubset<T, FiskalyPlatformConfigFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FiskalyPlatformConfigClient<$Result.GetResult<Prisma.$FiskalyPlatformConfigPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FiskalyPlatformConfig that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FiskalyPlatformConfigFindFirstArgs} args - Arguments to find a FiskalyPlatformConfig
     * @example
     * // Get one FiskalyPlatformConfig
     * const fiskalyPlatformConfig = await prisma.fiskalyPlatformConfig.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FiskalyPlatformConfigFindFirstArgs>(args?: SelectSubset<T, FiskalyPlatformConfigFindFirstArgs<ExtArgs>>): Prisma__FiskalyPlatformConfigClient<$Result.GetResult<Prisma.$FiskalyPlatformConfigPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FiskalyPlatformConfig that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FiskalyPlatformConfigFindFirstOrThrowArgs} args - Arguments to find a FiskalyPlatformConfig
     * @example
     * // Get one FiskalyPlatformConfig
     * const fiskalyPlatformConfig = await prisma.fiskalyPlatformConfig.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FiskalyPlatformConfigFindFirstOrThrowArgs>(args?: SelectSubset<T, FiskalyPlatformConfigFindFirstOrThrowArgs<ExtArgs>>): Prisma__FiskalyPlatformConfigClient<$Result.GetResult<Prisma.$FiskalyPlatformConfigPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more FiskalyPlatformConfigs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FiskalyPlatformConfigFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FiskalyPlatformConfigs
     * const fiskalyPlatformConfigs = await prisma.fiskalyPlatformConfig.findMany()
     * 
     * // Get first 10 FiskalyPlatformConfigs
     * const fiskalyPlatformConfigs = await prisma.fiskalyPlatformConfig.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const fiskalyPlatformConfigWithIdOnly = await prisma.fiskalyPlatformConfig.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FiskalyPlatformConfigFindManyArgs>(args?: SelectSubset<T, FiskalyPlatformConfigFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FiskalyPlatformConfigPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a FiskalyPlatformConfig.
     * @param {FiskalyPlatformConfigCreateArgs} args - Arguments to create a FiskalyPlatformConfig.
     * @example
     * // Create one FiskalyPlatformConfig
     * const FiskalyPlatformConfig = await prisma.fiskalyPlatformConfig.create({
     *   data: {
     *     // ... data to create a FiskalyPlatformConfig
     *   }
     * })
     * 
     */
    create<T extends FiskalyPlatformConfigCreateArgs>(args: SelectSubset<T, FiskalyPlatformConfigCreateArgs<ExtArgs>>): Prisma__FiskalyPlatformConfigClient<$Result.GetResult<Prisma.$FiskalyPlatformConfigPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many FiskalyPlatformConfigs.
     * @param {FiskalyPlatformConfigCreateManyArgs} args - Arguments to create many FiskalyPlatformConfigs.
     * @example
     * // Create many FiskalyPlatformConfigs
     * const fiskalyPlatformConfig = await prisma.fiskalyPlatformConfig.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FiskalyPlatformConfigCreateManyArgs>(args?: SelectSubset<T, FiskalyPlatformConfigCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many FiskalyPlatformConfigs and returns the data saved in the database.
     * @param {FiskalyPlatformConfigCreateManyAndReturnArgs} args - Arguments to create many FiskalyPlatformConfigs.
     * @example
     * // Create many FiskalyPlatformConfigs
     * const fiskalyPlatformConfig = await prisma.fiskalyPlatformConfig.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many FiskalyPlatformConfigs and only return the `id`
     * const fiskalyPlatformConfigWithIdOnly = await prisma.fiskalyPlatformConfig.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FiskalyPlatformConfigCreateManyAndReturnArgs>(args?: SelectSubset<T, FiskalyPlatformConfigCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FiskalyPlatformConfigPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a FiskalyPlatformConfig.
     * @param {FiskalyPlatformConfigDeleteArgs} args - Arguments to delete one FiskalyPlatformConfig.
     * @example
     * // Delete one FiskalyPlatformConfig
     * const FiskalyPlatformConfig = await prisma.fiskalyPlatformConfig.delete({
     *   where: {
     *     // ... filter to delete one FiskalyPlatformConfig
     *   }
     * })
     * 
     */
    delete<T extends FiskalyPlatformConfigDeleteArgs>(args: SelectSubset<T, FiskalyPlatformConfigDeleteArgs<ExtArgs>>): Prisma__FiskalyPlatformConfigClient<$Result.GetResult<Prisma.$FiskalyPlatformConfigPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one FiskalyPlatformConfig.
     * @param {FiskalyPlatformConfigUpdateArgs} args - Arguments to update one FiskalyPlatformConfig.
     * @example
     * // Update one FiskalyPlatformConfig
     * const fiskalyPlatformConfig = await prisma.fiskalyPlatformConfig.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FiskalyPlatformConfigUpdateArgs>(args: SelectSubset<T, FiskalyPlatformConfigUpdateArgs<ExtArgs>>): Prisma__FiskalyPlatformConfigClient<$Result.GetResult<Prisma.$FiskalyPlatformConfigPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more FiskalyPlatformConfigs.
     * @param {FiskalyPlatformConfigDeleteManyArgs} args - Arguments to filter FiskalyPlatformConfigs to delete.
     * @example
     * // Delete a few FiskalyPlatformConfigs
     * const { count } = await prisma.fiskalyPlatformConfig.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FiskalyPlatformConfigDeleteManyArgs>(args?: SelectSubset<T, FiskalyPlatformConfigDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FiskalyPlatformConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FiskalyPlatformConfigUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FiskalyPlatformConfigs
     * const fiskalyPlatformConfig = await prisma.fiskalyPlatformConfig.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FiskalyPlatformConfigUpdateManyArgs>(args: SelectSubset<T, FiskalyPlatformConfigUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FiskalyPlatformConfigs and returns the data updated in the database.
     * @param {FiskalyPlatformConfigUpdateManyAndReturnArgs} args - Arguments to update many FiskalyPlatformConfigs.
     * @example
     * // Update many FiskalyPlatformConfigs
     * const fiskalyPlatformConfig = await prisma.fiskalyPlatformConfig.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more FiskalyPlatformConfigs and only return the `id`
     * const fiskalyPlatformConfigWithIdOnly = await prisma.fiskalyPlatformConfig.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FiskalyPlatformConfigUpdateManyAndReturnArgs>(args: SelectSubset<T, FiskalyPlatformConfigUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FiskalyPlatformConfigPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one FiskalyPlatformConfig.
     * @param {FiskalyPlatformConfigUpsertArgs} args - Arguments to update or create a FiskalyPlatformConfig.
     * @example
     * // Update or create a FiskalyPlatformConfig
     * const fiskalyPlatformConfig = await prisma.fiskalyPlatformConfig.upsert({
     *   create: {
     *     // ... data to create a FiskalyPlatformConfig
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FiskalyPlatformConfig we want to update
     *   }
     * })
     */
    upsert<T extends FiskalyPlatformConfigUpsertArgs>(args: SelectSubset<T, FiskalyPlatformConfigUpsertArgs<ExtArgs>>): Prisma__FiskalyPlatformConfigClient<$Result.GetResult<Prisma.$FiskalyPlatformConfigPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of FiskalyPlatformConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FiskalyPlatformConfigCountArgs} args - Arguments to filter FiskalyPlatformConfigs to count.
     * @example
     * // Count the number of FiskalyPlatformConfigs
     * const count = await prisma.fiskalyPlatformConfig.count({
     *   where: {
     *     // ... the filter for the FiskalyPlatformConfigs we want to count
     *   }
     * })
    **/
    count<T extends FiskalyPlatformConfigCountArgs>(
      args?: Subset<T, FiskalyPlatformConfigCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FiskalyPlatformConfigCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FiskalyPlatformConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FiskalyPlatformConfigAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FiskalyPlatformConfigAggregateArgs>(args: Subset<T, FiskalyPlatformConfigAggregateArgs>): Prisma.PrismaPromise<GetFiskalyPlatformConfigAggregateType<T>>

    /**
     * Group by FiskalyPlatformConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FiskalyPlatformConfigGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FiskalyPlatformConfigGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FiskalyPlatformConfigGroupByArgs['orderBy'] }
        : { orderBy?: FiskalyPlatformConfigGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FiskalyPlatformConfigGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFiskalyPlatformConfigGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FiskalyPlatformConfig model
   */
  readonly fields: FiskalyPlatformConfigFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FiskalyPlatformConfig.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FiskalyPlatformConfigClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the FiskalyPlatformConfig model
   */
  interface FiskalyPlatformConfigFieldRefs {
    readonly id: FieldRef<"FiskalyPlatformConfig", 'Int'>
    readonly apiKey: FieldRef<"FiskalyPlatformConfig", 'String'>
    readonly tssId: FieldRef<"FiskalyPlatformConfig", 'String'>
    readonly clientId: FieldRef<"FiskalyPlatformConfig", 'String'>
    readonly adminPuk: FieldRef<"FiskalyPlatformConfig", 'String'>
    readonly updatedAt: FieldRef<"FiskalyPlatformConfig", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * FiskalyPlatformConfig findUnique
   */
  export type FiskalyPlatformConfigFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FiskalyPlatformConfig
     */
    select?: FiskalyPlatformConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FiskalyPlatformConfig
     */
    omit?: FiskalyPlatformConfigOmit<ExtArgs> | null
    /**
     * Filter, which FiskalyPlatformConfig to fetch.
     */
    where: FiskalyPlatformConfigWhereUniqueInput
  }

  /**
   * FiskalyPlatformConfig findUniqueOrThrow
   */
  export type FiskalyPlatformConfigFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FiskalyPlatformConfig
     */
    select?: FiskalyPlatformConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FiskalyPlatformConfig
     */
    omit?: FiskalyPlatformConfigOmit<ExtArgs> | null
    /**
     * Filter, which FiskalyPlatformConfig to fetch.
     */
    where: FiskalyPlatformConfigWhereUniqueInput
  }

  /**
   * FiskalyPlatformConfig findFirst
   */
  export type FiskalyPlatformConfigFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FiskalyPlatformConfig
     */
    select?: FiskalyPlatformConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FiskalyPlatformConfig
     */
    omit?: FiskalyPlatformConfigOmit<ExtArgs> | null
    /**
     * Filter, which FiskalyPlatformConfig to fetch.
     */
    where?: FiskalyPlatformConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FiskalyPlatformConfigs to fetch.
     */
    orderBy?: FiskalyPlatformConfigOrderByWithRelationInput | FiskalyPlatformConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FiskalyPlatformConfigs.
     */
    cursor?: FiskalyPlatformConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FiskalyPlatformConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FiskalyPlatformConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FiskalyPlatformConfigs.
     */
    distinct?: FiskalyPlatformConfigScalarFieldEnum | FiskalyPlatformConfigScalarFieldEnum[]
  }

  /**
   * FiskalyPlatformConfig findFirstOrThrow
   */
  export type FiskalyPlatformConfigFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FiskalyPlatformConfig
     */
    select?: FiskalyPlatformConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FiskalyPlatformConfig
     */
    omit?: FiskalyPlatformConfigOmit<ExtArgs> | null
    /**
     * Filter, which FiskalyPlatformConfig to fetch.
     */
    where?: FiskalyPlatformConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FiskalyPlatformConfigs to fetch.
     */
    orderBy?: FiskalyPlatformConfigOrderByWithRelationInput | FiskalyPlatformConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FiskalyPlatformConfigs.
     */
    cursor?: FiskalyPlatformConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FiskalyPlatformConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FiskalyPlatformConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FiskalyPlatformConfigs.
     */
    distinct?: FiskalyPlatformConfigScalarFieldEnum | FiskalyPlatformConfigScalarFieldEnum[]
  }

  /**
   * FiskalyPlatformConfig findMany
   */
  export type FiskalyPlatformConfigFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FiskalyPlatformConfig
     */
    select?: FiskalyPlatformConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FiskalyPlatformConfig
     */
    omit?: FiskalyPlatformConfigOmit<ExtArgs> | null
    /**
     * Filter, which FiskalyPlatformConfigs to fetch.
     */
    where?: FiskalyPlatformConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FiskalyPlatformConfigs to fetch.
     */
    orderBy?: FiskalyPlatformConfigOrderByWithRelationInput | FiskalyPlatformConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FiskalyPlatformConfigs.
     */
    cursor?: FiskalyPlatformConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FiskalyPlatformConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FiskalyPlatformConfigs.
     */
    skip?: number
    distinct?: FiskalyPlatformConfigScalarFieldEnum | FiskalyPlatformConfigScalarFieldEnum[]
  }

  /**
   * FiskalyPlatformConfig create
   */
  export type FiskalyPlatformConfigCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FiskalyPlatformConfig
     */
    select?: FiskalyPlatformConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FiskalyPlatformConfig
     */
    omit?: FiskalyPlatformConfigOmit<ExtArgs> | null
    /**
     * The data needed to create a FiskalyPlatformConfig.
     */
    data: XOR<FiskalyPlatformConfigCreateInput, FiskalyPlatformConfigUncheckedCreateInput>
  }

  /**
   * FiskalyPlatformConfig createMany
   */
  export type FiskalyPlatformConfigCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FiskalyPlatformConfigs.
     */
    data: FiskalyPlatformConfigCreateManyInput | FiskalyPlatformConfigCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FiskalyPlatformConfig createManyAndReturn
   */
  export type FiskalyPlatformConfigCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FiskalyPlatformConfig
     */
    select?: FiskalyPlatformConfigSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FiskalyPlatformConfig
     */
    omit?: FiskalyPlatformConfigOmit<ExtArgs> | null
    /**
     * The data used to create many FiskalyPlatformConfigs.
     */
    data: FiskalyPlatformConfigCreateManyInput | FiskalyPlatformConfigCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FiskalyPlatformConfig update
   */
  export type FiskalyPlatformConfigUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FiskalyPlatformConfig
     */
    select?: FiskalyPlatformConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FiskalyPlatformConfig
     */
    omit?: FiskalyPlatformConfigOmit<ExtArgs> | null
    /**
     * The data needed to update a FiskalyPlatformConfig.
     */
    data: XOR<FiskalyPlatformConfigUpdateInput, FiskalyPlatformConfigUncheckedUpdateInput>
    /**
     * Choose, which FiskalyPlatformConfig to update.
     */
    where: FiskalyPlatformConfigWhereUniqueInput
  }

  /**
   * FiskalyPlatformConfig updateMany
   */
  export type FiskalyPlatformConfigUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FiskalyPlatformConfigs.
     */
    data: XOR<FiskalyPlatformConfigUpdateManyMutationInput, FiskalyPlatformConfigUncheckedUpdateManyInput>
    /**
     * Filter which FiskalyPlatformConfigs to update
     */
    where?: FiskalyPlatformConfigWhereInput
    /**
     * Limit how many FiskalyPlatformConfigs to update.
     */
    limit?: number
  }

  /**
   * FiskalyPlatformConfig updateManyAndReturn
   */
  export type FiskalyPlatformConfigUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FiskalyPlatformConfig
     */
    select?: FiskalyPlatformConfigSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FiskalyPlatformConfig
     */
    omit?: FiskalyPlatformConfigOmit<ExtArgs> | null
    /**
     * The data used to update FiskalyPlatformConfigs.
     */
    data: XOR<FiskalyPlatformConfigUpdateManyMutationInput, FiskalyPlatformConfigUncheckedUpdateManyInput>
    /**
     * Filter which FiskalyPlatformConfigs to update
     */
    where?: FiskalyPlatformConfigWhereInput
    /**
     * Limit how many FiskalyPlatformConfigs to update.
     */
    limit?: number
  }

  /**
   * FiskalyPlatformConfig upsert
   */
  export type FiskalyPlatformConfigUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FiskalyPlatformConfig
     */
    select?: FiskalyPlatformConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FiskalyPlatformConfig
     */
    omit?: FiskalyPlatformConfigOmit<ExtArgs> | null
    /**
     * The filter to search for the FiskalyPlatformConfig to update in case it exists.
     */
    where: FiskalyPlatformConfigWhereUniqueInput
    /**
     * In case the FiskalyPlatformConfig found by the `where` argument doesn't exist, create a new FiskalyPlatformConfig with this data.
     */
    create: XOR<FiskalyPlatformConfigCreateInput, FiskalyPlatformConfigUncheckedCreateInput>
    /**
     * In case the FiskalyPlatformConfig was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FiskalyPlatformConfigUpdateInput, FiskalyPlatformConfigUncheckedUpdateInput>
  }

  /**
   * FiskalyPlatformConfig delete
   */
  export type FiskalyPlatformConfigDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FiskalyPlatformConfig
     */
    select?: FiskalyPlatformConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FiskalyPlatformConfig
     */
    omit?: FiskalyPlatformConfigOmit<ExtArgs> | null
    /**
     * Filter which FiskalyPlatformConfig to delete.
     */
    where: FiskalyPlatformConfigWhereUniqueInput
  }

  /**
   * FiskalyPlatformConfig deleteMany
   */
  export type FiskalyPlatformConfigDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FiskalyPlatformConfigs to delete
     */
    where?: FiskalyPlatformConfigWhereInput
    /**
     * Limit how many FiskalyPlatformConfigs to delete.
     */
    limit?: number
  }

  /**
   * FiskalyPlatformConfig without action
   */
  export type FiskalyPlatformConfigDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FiskalyPlatformConfig
     */
    select?: FiskalyPlatformConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FiskalyPlatformConfig
     */
    omit?: FiskalyPlatformConfigOmit<ExtArgs> | null
  }


  /**
   * Model SubscriptionPlan
   */

  export type AggregateSubscriptionPlan = {
    _count: SubscriptionPlanCountAggregateOutputType | null
    _avg: SubscriptionPlanAvgAggregateOutputType | null
    _sum: SubscriptionPlanSumAggregateOutputType | null
    _min: SubscriptionPlanMinAggregateOutputType | null
    _max: SubscriptionPlanMaxAggregateOutputType | null
  }

  export type SubscriptionPlanAvgAggregateOutputType = {
    id: number | null
    monthlyPrice: Decimal | null
    commissionPercent: Decimal | null
    trialDays: number | null
    graceDays: number | null
    sortOrder: number | null
  }

  export type SubscriptionPlanSumAggregateOutputType = {
    id: number | null
    monthlyPrice: Decimal | null
    commissionPercent: Decimal | null
    trialDays: number | null
    graceDays: number | null
    sortOrder: number | null
  }

  export type SubscriptionPlanMinAggregateOutputType = {
    id: number | null
    code: string | null
    name: string | null
    description: string | null
    billingInterval: $Enums.BillingInterval | null
    monthlyPrice: Decimal | null
    commissionPercent: Decimal | null
    trialDays: number | null
    graceDays: number | null
    sortOrder: number | null
  }

  export type SubscriptionPlanMaxAggregateOutputType = {
    id: number | null
    code: string | null
    name: string | null
    description: string | null
    billingInterval: $Enums.BillingInterval | null
    monthlyPrice: Decimal | null
    commissionPercent: Decimal | null
    trialDays: number | null
    graceDays: number | null
    sortOrder: number | null
  }

  export type SubscriptionPlanCountAggregateOutputType = {
    id: number
    code: number
    name: number
    description: number
    billingInterval: number
    monthlyPrice: number
    commissionPercent: number
    trialDays: number
    graceDays: number
    sortOrder: number
    features: number
    _all: number
  }


  export type SubscriptionPlanAvgAggregateInputType = {
    id?: true
    monthlyPrice?: true
    commissionPercent?: true
    trialDays?: true
    graceDays?: true
    sortOrder?: true
  }

  export type SubscriptionPlanSumAggregateInputType = {
    id?: true
    monthlyPrice?: true
    commissionPercent?: true
    trialDays?: true
    graceDays?: true
    sortOrder?: true
  }

  export type SubscriptionPlanMinAggregateInputType = {
    id?: true
    code?: true
    name?: true
    description?: true
    billingInterval?: true
    monthlyPrice?: true
    commissionPercent?: true
    trialDays?: true
    graceDays?: true
    sortOrder?: true
  }

  export type SubscriptionPlanMaxAggregateInputType = {
    id?: true
    code?: true
    name?: true
    description?: true
    billingInterval?: true
    monthlyPrice?: true
    commissionPercent?: true
    trialDays?: true
    graceDays?: true
    sortOrder?: true
  }

  export type SubscriptionPlanCountAggregateInputType = {
    id?: true
    code?: true
    name?: true
    description?: true
    billingInterval?: true
    monthlyPrice?: true
    commissionPercent?: true
    trialDays?: true
    graceDays?: true
    sortOrder?: true
    features?: true
    _all?: true
  }

  export type SubscriptionPlanAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SubscriptionPlan to aggregate.
     */
    where?: SubscriptionPlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubscriptionPlans to fetch.
     */
    orderBy?: SubscriptionPlanOrderByWithRelationInput | SubscriptionPlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SubscriptionPlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubscriptionPlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubscriptionPlans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SubscriptionPlans
    **/
    _count?: true | SubscriptionPlanCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SubscriptionPlanAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SubscriptionPlanSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SubscriptionPlanMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SubscriptionPlanMaxAggregateInputType
  }

  export type GetSubscriptionPlanAggregateType<T extends SubscriptionPlanAggregateArgs> = {
        [P in keyof T & keyof AggregateSubscriptionPlan]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSubscriptionPlan[P]>
      : GetScalarType<T[P], AggregateSubscriptionPlan[P]>
  }




  export type SubscriptionPlanGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubscriptionPlanWhereInput
    orderBy?: SubscriptionPlanOrderByWithAggregationInput | SubscriptionPlanOrderByWithAggregationInput[]
    by: SubscriptionPlanScalarFieldEnum[] | SubscriptionPlanScalarFieldEnum
    having?: SubscriptionPlanScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SubscriptionPlanCountAggregateInputType | true
    _avg?: SubscriptionPlanAvgAggregateInputType
    _sum?: SubscriptionPlanSumAggregateInputType
    _min?: SubscriptionPlanMinAggregateInputType
    _max?: SubscriptionPlanMaxAggregateInputType
  }

  export type SubscriptionPlanGroupByOutputType = {
    id: number
    code: string | null
    name: string
    description: string | null
    billingInterval: $Enums.BillingInterval
    monthlyPrice: Decimal
    commissionPercent: Decimal
    trialDays: number
    graceDays: number
    sortOrder: number
    features: JsonValue
    _count: SubscriptionPlanCountAggregateOutputType | null
    _avg: SubscriptionPlanAvgAggregateOutputType | null
    _sum: SubscriptionPlanSumAggregateOutputType | null
    _min: SubscriptionPlanMinAggregateOutputType | null
    _max: SubscriptionPlanMaxAggregateOutputType | null
  }

  type GetSubscriptionPlanGroupByPayload<T extends SubscriptionPlanGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SubscriptionPlanGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SubscriptionPlanGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SubscriptionPlanGroupByOutputType[P]>
            : GetScalarType<T[P], SubscriptionPlanGroupByOutputType[P]>
        }
      >
    >


  export type SubscriptionPlanSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    name?: boolean
    description?: boolean
    billingInterval?: boolean
    monthlyPrice?: boolean
    commissionPercent?: boolean
    trialDays?: boolean
    graceDays?: boolean
    sortOrder?: boolean
    features?: boolean
    tenantSubscriptions?: boolean | SubscriptionPlan$tenantSubscriptionsArgs<ExtArgs>
    invoices?: boolean | SubscriptionPlan$invoicesArgs<ExtArgs>
    requestedChanges?: boolean | SubscriptionPlan$requestedChangesArgs<ExtArgs>
    _count?: boolean | SubscriptionPlanCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subscriptionPlan"]>

  export type SubscriptionPlanSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    name?: boolean
    description?: boolean
    billingInterval?: boolean
    monthlyPrice?: boolean
    commissionPercent?: boolean
    trialDays?: boolean
    graceDays?: boolean
    sortOrder?: boolean
    features?: boolean
  }, ExtArgs["result"]["subscriptionPlan"]>

  export type SubscriptionPlanSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    name?: boolean
    description?: boolean
    billingInterval?: boolean
    monthlyPrice?: boolean
    commissionPercent?: boolean
    trialDays?: boolean
    graceDays?: boolean
    sortOrder?: boolean
    features?: boolean
  }, ExtArgs["result"]["subscriptionPlan"]>

  export type SubscriptionPlanSelectScalar = {
    id?: boolean
    code?: boolean
    name?: boolean
    description?: boolean
    billingInterval?: boolean
    monthlyPrice?: boolean
    commissionPercent?: boolean
    trialDays?: boolean
    graceDays?: boolean
    sortOrder?: boolean
    features?: boolean
  }

  export type SubscriptionPlanOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "code" | "name" | "description" | "billingInterval" | "monthlyPrice" | "commissionPercent" | "trialDays" | "graceDays" | "sortOrder" | "features", ExtArgs["result"]["subscriptionPlan"]>
  export type SubscriptionPlanInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenantSubscriptions?: boolean | SubscriptionPlan$tenantSubscriptionsArgs<ExtArgs>
    invoices?: boolean | SubscriptionPlan$invoicesArgs<ExtArgs>
    requestedChanges?: boolean | SubscriptionPlan$requestedChangesArgs<ExtArgs>
    _count?: boolean | SubscriptionPlanCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SubscriptionPlanIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type SubscriptionPlanIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $SubscriptionPlanPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SubscriptionPlan"
    objects: {
      tenantSubscriptions: Prisma.$TenantSubscriptionPayload<ExtArgs>[]
      invoices: Prisma.$BillingInvoicePayload<ExtArgs>[]
      requestedChanges: Prisma.$SubscriptionPlanChangeRequestPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      code: string | null
      name: string
      description: string | null
      billingInterval: $Enums.BillingInterval
      monthlyPrice: Prisma.Decimal
      commissionPercent: Prisma.Decimal
      trialDays: number
      graceDays: number
      sortOrder: number
      features: Prisma.JsonValue
    }, ExtArgs["result"]["subscriptionPlan"]>
    composites: {}
  }

  type SubscriptionPlanGetPayload<S extends boolean | null | undefined | SubscriptionPlanDefaultArgs> = $Result.GetResult<Prisma.$SubscriptionPlanPayload, S>

  type SubscriptionPlanCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SubscriptionPlanFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SubscriptionPlanCountAggregateInputType | true
    }

  export interface SubscriptionPlanDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SubscriptionPlan'], meta: { name: 'SubscriptionPlan' } }
    /**
     * Find zero or one SubscriptionPlan that matches the filter.
     * @param {SubscriptionPlanFindUniqueArgs} args - Arguments to find a SubscriptionPlan
     * @example
     * // Get one SubscriptionPlan
     * const subscriptionPlan = await prisma.subscriptionPlan.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SubscriptionPlanFindUniqueArgs>(args: SelectSubset<T, SubscriptionPlanFindUniqueArgs<ExtArgs>>): Prisma__SubscriptionPlanClient<$Result.GetResult<Prisma.$SubscriptionPlanPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SubscriptionPlan that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SubscriptionPlanFindUniqueOrThrowArgs} args - Arguments to find a SubscriptionPlan
     * @example
     * // Get one SubscriptionPlan
     * const subscriptionPlan = await prisma.subscriptionPlan.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SubscriptionPlanFindUniqueOrThrowArgs>(args: SelectSubset<T, SubscriptionPlanFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SubscriptionPlanClient<$Result.GetResult<Prisma.$SubscriptionPlanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SubscriptionPlan that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPlanFindFirstArgs} args - Arguments to find a SubscriptionPlan
     * @example
     * // Get one SubscriptionPlan
     * const subscriptionPlan = await prisma.subscriptionPlan.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SubscriptionPlanFindFirstArgs>(args?: SelectSubset<T, SubscriptionPlanFindFirstArgs<ExtArgs>>): Prisma__SubscriptionPlanClient<$Result.GetResult<Prisma.$SubscriptionPlanPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SubscriptionPlan that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPlanFindFirstOrThrowArgs} args - Arguments to find a SubscriptionPlan
     * @example
     * // Get one SubscriptionPlan
     * const subscriptionPlan = await prisma.subscriptionPlan.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SubscriptionPlanFindFirstOrThrowArgs>(args?: SelectSubset<T, SubscriptionPlanFindFirstOrThrowArgs<ExtArgs>>): Prisma__SubscriptionPlanClient<$Result.GetResult<Prisma.$SubscriptionPlanPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SubscriptionPlans that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPlanFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SubscriptionPlans
     * const subscriptionPlans = await prisma.subscriptionPlan.findMany()
     * 
     * // Get first 10 SubscriptionPlans
     * const subscriptionPlans = await prisma.subscriptionPlan.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const subscriptionPlanWithIdOnly = await prisma.subscriptionPlan.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SubscriptionPlanFindManyArgs>(args?: SelectSubset<T, SubscriptionPlanFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPlanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SubscriptionPlan.
     * @param {SubscriptionPlanCreateArgs} args - Arguments to create a SubscriptionPlan.
     * @example
     * // Create one SubscriptionPlan
     * const SubscriptionPlan = await prisma.subscriptionPlan.create({
     *   data: {
     *     // ... data to create a SubscriptionPlan
     *   }
     * })
     * 
     */
    create<T extends SubscriptionPlanCreateArgs>(args: SelectSubset<T, SubscriptionPlanCreateArgs<ExtArgs>>): Prisma__SubscriptionPlanClient<$Result.GetResult<Prisma.$SubscriptionPlanPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SubscriptionPlans.
     * @param {SubscriptionPlanCreateManyArgs} args - Arguments to create many SubscriptionPlans.
     * @example
     * // Create many SubscriptionPlans
     * const subscriptionPlan = await prisma.subscriptionPlan.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SubscriptionPlanCreateManyArgs>(args?: SelectSubset<T, SubscriptionPlanCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SubscriptionPlans and returns the data saved in the database.
     * @param {SubscriptionPlanCreateManyAndReturnArgs} args - Arguments to create many SubscriptionPlans.
     * @example
     * // Create many SubscriptionPlans
     * const subscriptionPlan = await prisma.subscriptionPlan.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SubscriptionPlans and only return the `id`
     * const subscriptionPlanWithIdOnly = await prisma.subscriptionPlan.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SubscriptionPlanCreateManyAndReturnArgs>(args?: SelectSubset<T, SubscriptionPlanCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPlanPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SubscriptionPlan.
     * @param {SubscriptionPlanDeleteArgs} args - Arguments to delete one SubscriptionPlan.
     * @example
     * // Delete one SubscriptionPlan
     * const SubscriptionPlan = await prisma.subscriptionPlan.delete({
     *   where: {
     *     // ... filter to delete one SubscriptionPlan
     *   }
     * })
     * 
     */
    delete<T extends SubscriptionPlanDeleteArgs>(args: SelectSubset<T, SubscriptionPlanDeleteArgs<ExtArgs>>): Prisma__SubscriptionPlanClient<$Result.GetResult<Prisma.$SubscriptionPlanPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SubscriptionPlan.
     * @param {SubscriptionPlanUpdateArgs} args - Arguments to update one SubscriptionPlan.
     * @example
     * // Update one SubscriptionPlan
     * const subscriptionPlan = await prisma.subscriptionPlan.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SubscriptionPlanUpdateArgs>(args: SelectSubset<T, SubscriptionPlanUpdateArgs<ExtArgs>>): Prisma__SubscriptionPlanClient<$Result.GetResult<Prisma.$SubscriptionPlanPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SubscriptionPlans.
     * @param {SubscriptionPlanDeleteManyArgs} args - Arguments to filter SubscriptionPlans to delete.
     * @example
     * // Delete a few SubscriptionPlans
     * const { count } = await prisma.subscriptionPlan.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SubscriptionPlanDeleteManyArgs>(args?: SelectSubset<T, SubscriptionPlanDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SubscriptionPlans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPlanUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SubscriptionPlans
     * const subscriptionPlan = await prisma.subscriptionPlan.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SubscriptionPlanUpdateManyArgs>(args: SelectSubset<T, SubscriptionPlanUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SubscriptionPlans and returns the data updated in the database.
     * @param {SubscriptionPlanUpdateManyAndReturnArgs} args - Arguments to update many SubscriptionPlans.
     * @example
     * // Update many SubscriptionPlans
     * const subscriptionPlan = await prisma.subscriptionPlan.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SubscriptionPlans and only return the `id`
     * const subscriptionPlanWithIdOnly = await prisma.subscriptionPlan.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SubscriptionPlanUpdateManyAndReturnArgs>(args: SelectSubset<T, SubscriptionPlanUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPlanPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SubscriptionPlan.
     * @param {SubscriptionPlanUpsertArgs} args - Arguments to update or create a SubscriptionPlan.
     * @example
     * // Update or create a SubscriptionPlan
     * const subscriptionPlan = await prisma.subscriptionPlan.upsert({
     *   create: {
     *     // ... data to create a SubscriptionPlan
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SubscriptionPlan we want to update
     *   }
     * })
     */
    upsert<T extends SubscriptionPlanUpsertArgs>(args: SelectSubset<T, SubscriptionPlanUpsertArgs<ExtArgs>>): Prisma__SubscriptionPlanClient<$Result.GetResult<Prisma.$SubscriptionPlanPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SubscriptionPlans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPlanCountArgs} args - Arguments to filter SubscriptionPlans to count.
     * @example
     * // Count the number of SubscriptionPlans
     * const count = await prisma.subscriptionPlan.count({
     *   where: {
     *     // ... the filter for the SubscriptionPlans we want to count
     *   }
     * })
    **/
    count<T extends SubscriptionPlanCountArgs>(
      args?: Subset<T, SubscriptionPlanCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SubscriptionPlanCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SubscriptionPlan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPlanAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SubscriptionPlanAggregateArgs>(args: Subset<T, SubscriptionPlanAggregateArgs>): Prisma.PrismaPromise<GetSubscriptionPlanAggregateType<T>>

    /**
     * Group by SubscriptionPlan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPlanGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SubscriptionPlanGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SubscriptionPlanGroupByArgs['orderBy'] }
        : { orderBy?: SubscriptionPlanGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SubscriptionPlanGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubscriptionPlanGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SubscriptionPlan model
   */
  readonly fields: SubscriptionPlanFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SubscriptionPlan.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SubscriptionPlanClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenantSubscriptions<T extends SubscriptionPlan$tenantSubscriptionsArgs<ExtArgs> = {}>(args?: Subset<T, SubscriptionPlan$tenantSubscriptionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantSubscriptionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    invoices<T extends SubscriptionPlan$invoicesArgs<ExtArgs> = {}>(args?: Subset<T, SubscriptionPlan$invoicesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BillingInvoicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    requestedChanges<T extends SubscriptionPlan$requestedChangesArgs<ExtArgs> = {}>(args?: Subset<T, SubscriptionPlan$requestedChangesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPlanChangeRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SubscriptionPlan model
   */
  interface SubscriptionPlanFieldRefs {
    readonly id: FieldRef<"SubscriptionPlan", 'Int'>
    readonly code: FieldRef<"SubscriptionPlan", 'String'>
    readonly name: FieldRef<"SubscriptionPlan", 'String'>
    readonly description: FieldRef<"SubscriptionPlan", 'String'>
    readonly billingInterval: FieldRef<"SubscriptionPlan", 'BillingInterval'>
    readonly monthlyPrice: FieldRef<"SubscriptionPlan", 'Decimal'>
    readonly commissionPercent: FieldRef<"SubscriptionPlan", 'Decimal'>
    readonly trialDays: FieldRef<"SubscriptionPlan", 'Int'>
    readonly graceDays: FieldRef<"SubscriptionPlan", 'Int'>
    readonly sortOrder: FieldRef<"SubscriptionPlan", 'Int'>
    readonly features: FieldRef<"SubscriptionPlan", 'Json'>
  }
    

  // Custom InputTypes
  /**
   * SubscriptionPlan findUnique
   */
  export type SubscriptionPlanFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlan
     */
    select?: SubscriptionPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPlan
     */
    omit?: SubscriptionPlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPlanInclude<ExtArgs> | null
    /**
     * Filter, which SubscriptionPlan to fetch.
     */
    where: SubscriptionPlanWhereUniqueInput
  }

  /**
   * SubscriptionPlan findUniqueOrThrow
   */
  export type SubscriptionPlanFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlan
     */
    select?: SubscriptionPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPlan
     */
    omit?: SubscriptionPlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPlanInclude<ExtArgs> | null
    /**
     * Filter, which SubscriptionPlan to fetch.
     */
    where: SubscriptionPlanWhereUniqueInput
  }

  /**
   * SubscriptionPlan findFirst
   */
  export type SubscriptionPlanFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlan
     */
    select?: SubscriptionPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPlan
     */
    omit?: SubscriptionPlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPlanInclude<ExtArgs> | null
    /**
     * Filter, which SubscriptionPlan to fetch.
     */
    where?: SubscriptionPlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubscriptionPlans to fetch.
     */
    orderBy?: SubscriptionPlanOrderByWithRelationInput | SubscriptionPlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SubscriptionPlans.
     */
    cursor?: SubscriptionPlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubscriptionPlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubscriptionPlans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SubscriptionPlans.
     */
    distinct?: SubscriptionPlanScalarFieldEnum | SubscriptionPlanScalarFieldEnum[]
  }

  /**
   * SubscriptionPlan findFirstOrThrow
   */
  export type SubscriptionPlanFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlan
     */
    select?: SubscriptionPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPlan
     */
    omit?: SubscriptionPlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPlanInclude<ExtArgs> | null
    /**
     * Filter, which SubscriptionPlan to fetch.
     */
    where?: SubscriptionPlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubscriptionPlans to fetch.
     */
    orderBy?: SubscriptionPlanOrderByWithRelationInput | SubscriptionPlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SubscriptionPlans.
     */
    cursor?: SubscriptionPlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubscriptionPlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubscriptionPlans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SubscriptionPlans.
     */
    distinct?: SubscriptionPlanScalarFieldEnum | SubscriptionPlanScalarFieldEnum[]
  }

  /**
   * SubscriptionPlan findMany
   */
  export type SubscriptionPlanFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlan
     */
    select?: SubscriptionPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPlan
     */
    omit?: SubscriptionPlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPlanInclude<ExtArgs> | null
    /**
     * Filter, which SubscriptionPlans to fetch.
     */
    where?: SubscriptionPlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubscriptionPlans to fetch.
     */
    orderBy?: SubscriptionPlanOrderByWithRelationInput | SubscriptionPlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SubscriptionPlans.
     */
    cursor?: SubscriptionPlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubscriptionPlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubscriptionPlans.
     */
    skip?: number
    distinct?: SubscriptionPlanScalarFieldEnum | SubscriptionPlanScalarFieldEnum[]
  }

  /**
   * SubscriptionPlan create
   */
  export type SubscriptionPlanCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlan
     */
    select?: SubscriptionPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPlan
     */
    omit?: SubscriptionPlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPlanInclude<ExtArgs> | null
    /**
     * The data needed to create a SubscriptionPlan.
     */
    data: XOR<SubscriptionPlanCreateInput, SubscriptionPlanUncheckedCreateInput>
  }

  /**
   * SubscriptionPlan createMany
   */
  export type SubscriptionPlanCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SubscriptionPlans.
     */
    data: SubscriptionPlanCreateManyInput | SubscriptionPlanCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SubscriptionPlan createManyAndReturn
   */
  export type SubscriptionPlanCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlan
     */
    select?: SubscriptionPlanSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPlan
     */
    omit?: SubscriptionPlanOmit<ExtArgs> | null
    /**
     * The data used to create many SubscriptionPlans.
     */
    data: SubscriptionPlanCreateManyInput | SubscriptionPlanCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SubscriptionPlan update
   */
  export type SubscriptionPlanUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlan
     */
    select?: SubscriptionPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPlan
     */
    omit?: SubscriptionPlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPlanInclude<ExtArgs> | null
    /**
     * The data needed to update a SubscriptionPlan.
     */
    data: XOR<SubscriptionPlanUpdateInput, SubscriptionPlanUncheckedUpdateInput>
    /**
     * Choose, which SubscriptionPlan to update.
     */
    where: SubscriptionPlanWhereUniqueInput
  }

  /**
   * SubscriptionPlan updateMany
   */
  export type SubscriptionPlanUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SubscriptionPlans.
     */
    data: XOR<SubscriptionPlanUpdateManyMutationInput, SubscriptionPlanUncheckedUpdateManyInput>
    /**
     * Filter which SubscriptionPlans to update
     */
    where?: SubscriptionPlanWhereInput
    /**
     * Limit how many SubscriptionPlans to update.
     */
    limit?: number
  }

  /**
   * SubscriptionPlan updateManyAndReturn
   */
  export type SubscriptionPlanUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlan
     */
    select?: SubscriptionPlanSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPlan
     */
    omit?: SubscriptionPlanOmit<ExtArgs> | null
    /**
     * The data used to update SubscriptionPlans.
     */
    data: XOR<SubscriptionPlanUpdateManyMutationInput, SubscriptionPlanUncheckedUpdateManyInput>
    /**
     * Filter which SubscriptionPlans to update
     */
    where?: SubscriptionPlanWhereInput
    /**
     * Limit how many SubscriptionPlans to update.
     */
    limit?: number
  }

  /**
   * SubscriptionPlan upsert
   */
  export type SubscriptionPlanUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlan
     */
    select?: SubscriptionPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPlan
     */
    omit?: SubscriptionPlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPlanInclude<ExtArgs> | null
    /**
     * The filter to search for the SubscriptionPlan to update in case it exists.
     */
    where: SubscriptionPlanWhereUniqueInput
    /**
     * In case the SubscriptionPlan found by the `where` argument doesn't exist, create a new SubscriptionPlan with this data.
     */
    create: XOR<SubscriptionPlanCreateInput, SubscriptionPlanUncheckedCreateInput>
    /**
     * In case the SubscriptionPlan was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SubscriptionPlanUpdateInput, SubscriptionPlanUncheckedUpdateInput>
  }

  /**
   * SubscriptionPlan delete
   */
  export type SubscriptionPlanDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlan
     */
    select?: SubscriptionPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPlan
     */
    omit?: SubscriptionPlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPlanInclude<ExtArgs> | null
    /**
     * Filter which SubscriptionPlan to delete.
     */
    where: SubscriptionPlanWhereUniqueInput
  }

  /**
   * SubscriptionPlan deleteMany
   */
  export type SubscriptionPlanDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SubscriptionPlans to delete
     */
    where?: SubscriptionPlanWhereInput
    /**
     * Limit how many SubscriptionPlans to delete.
     */
    limit?: number
  }

  /**
   * SubscriptionPlan.tenantSubscriptions
   */
  export type SubscriptionPlan$tenantSubscriptionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantSubscription
     */
    select?: TenantSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantSubscription
     */
    omit?: TenantSubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantSubscriptionInclude<ExtArgs> | null
    where?: TenantSubscriptionWhereInput
    orderBy?: TenantSubscriptionOrderByWithRelationInput | TenantSubscriptionOrderByWithRelationInput[]
    cursor?: TenantSubscriptionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TenantSubscriptionScalarFieldEnum | TenantSubscriptionScalarFieldEnum[]
  }

  /**
   * SubscriptionPlan.invoices
   */
  export type SubscriptionPlan$invoicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoice
     */
    select?: BillingInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoice
     */
    omit?: BillingInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInvoiceInclude<ExtArgs> | null
    where?: BillingInvoiceWhereInput
    orderBy?: BillingInvoiceOrderByWithRelationInput | BillingInvoiceOrderByWithRelationInput[]
    cursor?: BillingInvoiceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BillingInvoiceScalarFieldEnum | BillingInvoiceScalarFieldEnum[]
  }

  /**
   * SubscriptionPlan.requestedChanges
   */
  export type SubscriptionPlan$requestedChangesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlanChangeRequest
     */
    select?: SubscriptionPlanChangeRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPlanChangeRequest
     */
    omit?: SubscriptionPlanChangeRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPlanChangeRequestInclude<ExtArgs> | null
    where?: SubscriptionPlanChangeRequestWhereInput
    orderBy?: SubscriptionPlanChangeRequestOrderByWithRelationInput | SubscriptionPlanChangeRequestOrderByWithRelationInput[]
    cursor?: SubscriptionPlanChangeRequestWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SubscriptionPlanChangeRequestScalarFieldEnum | SubscriptionPlanChangeRequestScalarFieldEnum[]
  }

  /**
   * SubscriptionPlan without action
   */
  export type SubscriptionPlanDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlan
     */
    select?: SubscriptionPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPlan
     */
    omit?: SubscriptionPlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPlanInclude<ExtArgs> | null
  }


  /**
   * Model TenantSubscription
   */

  export type AggregateTenantSubscription = {
    _count: TenantSubscriptionCountAggregateOutputType | null
    _avg: TenantSubscriptionAvgAggregateOutputType | null
    _sum: TenantSubscriptionSumAggregateOutputType | null
    _min: TenantSubscriptionMinAggregateOutputType | null
    _max: TenantSubscriptionMaxAggregateOutputType | null
  }

  export type TenantSubscriptionAvgAggregateOutputType = {
    id: number | null
    tenantId: number | null
    planId: number | null
  }

  export type TenantSubscriptionSumAggregateOutputType = {
    id: number | null
    tenantId: number | null
    planId: number | null
  }

  export type TenantSubscriptionMinAggregateOutputType = {
    id: number | null
    tenantId: number | null
    planId: number | null
    status: $Enums.SubscriptionStatus | null
    startDate: Date | null
    endDate: Date | null
    trialStartDate: Date | null
    trialEndDate: Date | null
    gracePeriodEndsAt: Date | null
    nextBillingDate: Date | null
    autoRenew: boolean | null
    cancelAtPeriodEnd: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TenantSubscriptionMaxAggregateOutputType = {
    id: number | null
    tenantId: number | null
    planId: number | null
    status: $Enums.SubscriptionStatus | null
    startDate: Date | null
    endDate: Date | null
    trialStartDate: Date | null
    trialEndDate: Date | null
    gracePeriodEndsAt: Date | null
    nextBillingDate: Date | null
    autoRenew: boolean | null
    cancelAtPeriodEnd: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TenantSubscriptionCountAggregateOutputType = {
    id: number
    tenantId: number
    planId: number
    status: number
    startDate: number
    endDate: number
    trialStartDate: number
    trialEndDate: number
    gracePeriodEndsAt: number
    nextBillingDate: number
    autoRenew: number
    cancelAtPeriodEnd: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TenantSubscriptionAvgAggregateInputType = {
    id?: true
    tenantId?: true
    planId?: true
  }

  export type TenantSubscriptionSumAggregateInputType = {
    id?: true
    tenantId?: true
    planId?: true
  }

  export type TenantSubscriptionMinAggregateInputType = {
    id?: true
    tenantId?: true
    planId?: true
    status?: true
    startDate?: true
    endDate?: true
    trialStartDate?: true
    trialEndDate?: true
    gracePeriodEndsAt?: true
    nextBillingDate?: true
    autoRenew?: true
    cancelAtPeriodEnd?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TenantSubscriptionMaxAggregateInputType = {
    id?: true
    tenantId?: true
    planId?: true
    status?: true
    startDate?: true
    endDate?: true
    trialStartDate?: true
    trialEndDate?: true
    gracePeriodEndsAt?: true
    nextBillingDate?: true
    autoRenew?: true
    cancelAtPeriodEnd?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TenantSubscriptionCountAggregateInputType = {
    id?: true
    tenantId?: true
    planId?: true
    status?: true
    startDate?: true
    endDate?: true
    trialStartDate?: true
    trialEndDate?: true
    gracePeriodEndsAt?: true
    nextBillingDate?: true
    autoRenew?: true
    cancelAtPeriodEnd?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TenantSubscriptionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TenantSubscription to aggregate.
     */
    where?: TenantSubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantSubscriptions to fetch.
     */
    orderBy?: TenantSubscriptionOrderByWithRelationInput | TenantSubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TenantSubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantSubscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantSubscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TenantSubscriptions
    **/
    _count?: true | TenantSubscriptionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TenantSubscriptionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TenantSubscriptionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TenantSubscriptionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TenantSubscriptionMaxAggregateInputType
  }

  export type GetTenantSubscriptionAggregateType<T extends TenantSubscriptionAggregateArgs> = {
        [P in keyof T & keyof AggregateTenantSubscription]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTenantSubscription[P]>
      : GetScalarType<T[P], AggregateTenantSubscription[P]>
  }




  export type TenantSubscriptionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TenantSubscriptionWhereInput
    orderBy?: TenantSubscriptionOrderByWithAggregationInput | TenantSubscriptionOrderByWithAggregationInput[]
    by: TenantSubscriptionScalarFieldEnum[] | TenantSubscriptionScalarFieldEnum
    having?: TenantSubscriptionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TenantSubscriptionCountAggregateInputType | true
    _avg?: TenantSubscriptionAvgAggregateInputType
    _sum?: TenantSubscriptionSumAggregateInputType
    _min?: TenantSubscriptionMinAggregateInputType
    _max?: TenantSubscriptionMaxAggregateInputType
  }

  export type TenantSubscriptionGroupByOutputType = {
    id: number
    tenantId: number
    planId: number
    status: $Enums.SubscriptionStatus
    startDate: Date
    endDate: Date
    trialStartDate: Date | null
    trialEndDate: Date | null
    gracePeriodEndsAt: Date | null
    nextBillingDate: Date | null
    autoRenew: boolean
    cancelAtPeriodEnd: boolean
    createdAt: Date
    updatedAt: Date
    _count: TenantSubscriptionCountAggregateOutputType | null
    _avg: TenantSubscriptionAvgAggregateOutputType | null
    _sum: TenantSubscriptionSumAggregateOutputType | null
    _min: TenantSubscriptionMinAggregateOutputType | null
    _max: TenantSubscriptionMaxAggregateOutputType | null
  }

  type GetTenantSubscriptionGroupByPayload<T extends TenantSubscriptionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TenantSubscriptionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TenantSubscriptionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TenantSubscriptionGroupByOutputType[P]>
            : GetScalarType<T[P], TenantSubscriptionGroupByOutputType[P]>
        }
      >
    >


  export type TenantSubscriptionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    planId?: boolean
    status?: boolean
    startDate?: boolean
    endDate?: boolean
    trialStartDate?: boolean
    trialEndDate?: boolean
    gracePeriodEndsAt?: boolean
    nextBillingDate?: boolean
    autoRenew?: boolean
    cancelAtPeriodEnd?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    plan?: boolean | SubscriptionPlanDefaultArgs<ExtArgs>
    invoices?: boolean | TenantSubscription$invoicesArgs<ExtArgs>
    planChangeRequests?: boolean | TenantSubscription$planChangeRequestsArgs<ExtArgs>
    _count?: boolean | TenantSubscriptionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tenantSubscription"]>

  export type TenantSubscriptionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    planId?: boolean
    status?: boolean
    startDate?: boolean
    endDate?: boolean
    trialStartDate?: boolean
    trialEndDate?: boolean
    gracePeriodEndsAt?: boolean
    nextBillingDate?: boolean
    autoRenew?: boolean
    cancelAtPeriodEnd?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    plan?: boolean | SubscriptionPlanDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tenantSubscription"]>

  export type TenantSubscriptionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    planId?: boolean
    status?: boolean
    startDate?: boolean
    endDate?: boolean
    trialStartDate?: boolean
    trialEndDate?: boolean
    gracePeriodEndsAt?: boolean
    nextBillingDate?: boolean
    autoRenew?: boolean
    cancelAtPeriodEnd?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    plan?: boolean | SubscriptionPlanDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tenantSubscription"]>

  export type TenantSubscriptionSelectScalar = {
    id?: boolean
    tenantId?: boolean
    planId?: boolean
    status?: boolean
    startDate?: boolean
    endDate?: boolean
    trialStartDate?: boolean
    trialEndDate?: boolean
    gracePeriodEndsAt?: boolean
    nextBillingDate?: boolean
    autoRenew?: boolean
    cancelAtPeriodEnd?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TenantSubscriptionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "planId" | "status" | "startDate" | "endDate" | "trialStartDate" | "trialEndDate" | "gracePeriodEndsAt" | "nextBillingDate" | "autoRenew" | "cancelAtPeriodEnd" | "createdAt" | "updatedAt", ExtArgs["result"]["tenantSubscription"]>
  export type TenantSubscriptionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    plan?: boolean | SubscriptionPlanDefaultArgs<ExtArgs>
    invoices?: boolean | TenantSubscription$invoicesArgs<ExtArgs>
    planChangeRequests?: boolean | TenantSubscription$planChangeRequestsArgs<ExtArgs>
    _count?: boolean | TenantSubscriptionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TenantSubscriptionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    plan?: boolean | SubscriptionPlanDefaultArgs<ExtArgs>
  }
  export type TenantSubscriptionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    plan?: boolean | SubscriptionPlanDefaultArgs<ExtArgs>
  }

  export type $TenantSubscriptionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TenantSubscription"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
      plan: Prisma.$SubscriptionPlanPayload<ExtArgs>
      invoices: Prisma.$BillingInvoicePayload<ExtArgs>[]
      planChangeRequests: Prisma.$SubscriptionPlanChangeRequestPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      tenantId: number
      planId: number
      status: $Enums.SubscriptionStatus
      startDate: Date
      endDate: Date
      trialStartDate: Date | null
      trialEndDate: Date | null
      gracePeriodEndsAt: Date | null
      nextBillingDate: Date | null
      autoRenew: boolean
      cancelAtPeriodEnd: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["tenantSubscription"]>
    composites: {}
  }

  type TenantSubscriptionGetPayload<S extends boolean | null | undefined | TenantSubscriptionDefaultArgs> = $Result.GetResult<Prisma.$TenantSubscriptionPayload, S>

  type TenantSubscriptionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TenantSubscriptionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TenantSubscriptionCountAggregateInputType | true
    }

  export interface TenantSubscriptionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TenantSubscription'], meta: { name: 'TenantSubscription' } }
    /**
     * Find zero or one TenantSubscription that matches the filter.
     * @param {TenantSubscriptionFindUniqueArgs} args - Arguments to find a TenantSubscription
     * @example
     * // Get one TenantSubscription
     * const tenantSubscription = await prisma.tenantSubscription.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TenantSubscriptionFindUniqueArgs>(args: SelectSubset<T, TenantSubscriptionFindUniqueArgs<ExtArgs>>): Prisma__TenantSubscriptionClient<$Result.GetResult<Prisma.$TenantSubscriptionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TenantSubscription that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TenantSubscriptionFindUniqueOrThrowArgs} args - Arguments to find a TenantSubscription
     * @example
     * // Get one TenantSubscription
     * const tenantSubscription = await prisma.tenantSubscription.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TenantSubscriptionFindUniqueOrThrowArgs>(args: SelectSubset<T, TenantSubscriptionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TenantSubscriptionClient<$Result.GetResult<Prisma.$TenantSubscriptionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TenantSubscription that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantSubscriptionFindFirstArgs} args - Arguments to find a TenantSubscription
     * @example
     * // Get one TenantSubscription
     * const tenantSubscription = await prisma.tenantSubscription.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TenantSubscriptionFindFirstArgs>(args?: SelectSubset<T, TenantSubscriptionFindFirstArgs<ExtArgs>>): Prisma__TenantSubscriptionClient<$Result.GetResult<Prisma.$TenantSubscriptionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TenantSubscription that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantSubscriptionFindFirstOrThrowArgs} args - Arguments to find a TenantSubscription
     * @example
     * // Get one TenantSubscription
     * const tenantSubscription = await prisma.tenantSubscription.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TenantSubscriptionFindFirstOrThrowArgs>(args?: SelectSubset<T, TenantSubscriptionFindFirstOrThrowArgs<ExtArgs>>): Prisma__TenantSubscriptionClient<$Result.GetResult<Prisma.$TenantSubscriptionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TenantSubscriptions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantSubscriptionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TenantSubscriptions
     * const tenantSubscriptions = await prisma.tenantSubscription.findMany()
     * 
     * // Get first 10 TenantSubscriptions
     * const tenantSubscriptions = await prisma.tenantSubscription.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tenantSubscriptionWithIdOnly = await prisma.tenantSubscription.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TenantSubscriptionFindManyArgs>(args?: SelectSubset<T, TenantSubscriptionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantSubscriptionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TenantSubscription.
     * @param {TenantSubscriptionCreateArgs} args - Arguments to create a TenantSubscription.
     * @example
     * // Create one TenantSubscription
     * const TenantSubscription = await prisma.tenantSubscription.create({
     *   data: {
     *     // ... data to create a TenantSubscription
     *   }
     * })
     * 
     */
    create<T extends TenantSubscriptionCreateArgs>(args: SelectSubset<T, TenantSubscriptionCreateArgs<ExtArgs>>): Prisma__TenantSubscriptionClient<$Result.GetResult<Prisma.$TenantSubscriptionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TenantSubscriptions.
     * @param {TenantSubscriptionCreateManyArgs} args - Arguments to create many TenantSubscriptions.
     * @example
     * // Create many TenantSubscriptions
     * const tenantSubscription = await prisma.tenantSubscription.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TenantSubscriptionCreateManyArgs>(args?: SelectSubset<T, TenantSubscriptionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TenantSubscriptions and returns the data saved in the database.
     * @param {TenantSubscriptionCreateManyAndReturnArgs} args - Arguments to create many TenantSubscriptions.
     * @example
     * // Create many TenantSubscriptions
     * const tenantSubscription = await prisma.tenantSubscription.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TenantSubscriptions and only return the `id`
     * const tenantSubscriptionWithIdOnly = await prisma.tenantSubscription.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TenantSubscriptionCreateManyAndReturnArgs>(args?: SelectSubset<T, TenantSubscriptionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantSubscriptionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TenantSubscription.
     * @param {TenantSubscriptionDeleteArgs} args - Arguments to delete one TenantSubscription.
     * @example
     * // Delete one TenantSubscription
     * const TenantSubscription = await prisma.tenantSubscription.delete({
     *   where: {
     *     // ... filter to delete one TenantSubscription
     *   }
     * })
     * 
     */
    delete<T extends TenantSubscriptionDeleteArgs>(args: SelectSubset<T, TenantSubscriptionDeleteArgs<ExtArgs>>): Prisma__TenantSubscriptionClient<$Result.GetResult<Prisma.$TenantSubscriptionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TenantSubscription.
     * @param {TenantSubscriptionUpdateArgs} args - Arguments to update one TenantSubscription.
     * @example
     * // Update one TenantSubscription
     * const tenantSubscription = await prisma.tenantSubscription.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TenantSubscriptionUpdateArgs>(args: SelectSubset<T, TenantSubscriptionUpdateArgs<ExtArgs>>): Prisma__TenantSubscriptionClient<$Result.GetResult<Prisma.$TenantSubscriptionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TenantSubscriptions.
     * @param {TenantSubscriptionDeleteManyArgs} args - Arguments to filter TenantSubscriptions to delete.
     * @example
     * // Delete a few TenantSubscriptions
     * const { count } = await prisma.tenantSubscription.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TenantSubscriptionDeleteManyArgs>(args?: SelectSubset<T, TenantSubscriptionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TenantSubscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantSubscriptionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TenantSubscriptions
     * const tenantSubscription = await prisma.tenantSubscription.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TenantSubscriptionUpdateManyArgs>(args: SelectSubset<T, TenantSubscriptionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TenantSubscriptions and returns the data updated in the database.
     * @param {TenantSubscriptionUpdateManyAndReturnArgs} args - Arguments to update many TenantSubscriptions.
     * @example
     * // Update many TenantSubscriptions
     * const tenantSubscription = await prisma.tenantSubscription.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TenantSubscriptions and only return the `id`
     * const tenantSubscriptionWithIdOnly = await prisma.tenantSubscription.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TenantSubscriptionUpdateManyAndReturnArgs>(args: SelectSubset<T, TenantSubscriptionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantSubscriptionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TenantSubscription.
     * @param {TenantSubscriptionUpsertArgs} args - Arguments to update or create a TenantSubscription.
     * @example
     * // Update or create a TenantSubscription
     * const tenantSubscription = await prisma.tenantSubscription.upsert({
     *   create: {
     *     // ... data to create a TenantSubscription
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TenantSubscription we want to update
     *   }
     * })
     */
    upsert<T extends TenantSubscriptionUpsertArgs>(args: SelectSubset<T, TenantSubscriptionUpsertArgs<ExtArgs>>): Prisma__TenantSubscriptionClient<$Result.GetResult<Prisma.$TenantSubscriptionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TenantSubscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantSubscriptionCountArgs} args - Arguments to filter TenantSubscriptions to count.
     * @example
     * // Count the number of TenantSubscriptions
     * const count = await prisma.tenantSubscription.count({
     *   where: {
     *     // ... the filter for the TenantSubscriptions we want to count
     *   }
     * })
    **/
    count<T extends TenantSubscriptionCountArgs>(
      args?: Subset<T, TenantSubscriptionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TenantSubscriptionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TenantSubscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantSubscriptionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TenantSubscriptionAggregateArgs>(args: Subset<T, TenantSubscriptionAggregateArgs>): Prisma.PrismaPromise<GetTenantSubscriptionAggregateType<T>>

    /**
     * Group by TenantSubscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantSubscriptionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TenantSubscriptionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TenantSubscriptionGroupByArgs['orderBy'] }
        : { orderBy?: TenantSubscriptionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TenantSubscriptionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTenantSubscriptionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TenantSubscription model
   */
  readonly fields: TenantSubscriptionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TenantSubscription.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TenantSubscriptionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    plan<T extends SubscriptionPlanDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SubscriptionPlanDefaultArgs<ExtArgs>>): Prisma__SubscriptionPlanClient<$Result.GetResult<Prisma.$SubscriptionPlanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    invoices<T extends TenantSubscription$invoicesArgs<ExtArgs> = {}>(args?: Subset<T, TenantSubscription$invoicesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BillingInvoicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    planChangeRequests<T extends TenantSubscription$planChangeRequestsArgs<ExtArgs> = {}>(args?: Subset<T, TenantSubscription$planChangeRequestsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPlanChangeRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TenantSubscription model
   */
  interface TenantSubscriptionFieldRefs {
    readonly id: FieldRef<"TenantSubscription", 'Int'>
    readonly tenantId: FieldRef<"TenantSubscription", 'Int'>
    readonly planId: FieldRef<"TenantSubscription", 'Int'>
    readonly status: FieldRef<"TenantSubscription", 'SubscriptionStatus'>
    readonly startDate: FieldRef<"TenantSubscription", 'DateTime'>
    readonly endDate: FieldRef<"TenantSubscription", 'DateTime'>
    readonly trialStartDate: FieldRef<"TenantSubscription", 'DateTime'>
    readonly trialEndDate: FieldRef<"TenantSubscription", 'DateTime'>
    readonly gracePeriodEndsAt: FieldRef<"TenantSubscription", 'DateTime'>
    readonly nextBillingDate: FieldRef<"TenantSubscription", 'DateTime'>
    readonly autoRenew: FieldRef<"TenantSubscription", 'Boolean'>
    readonly cancelAtPeriodEnd: FieldRef<"TenantSubscription", 'Boolean'>
    readonly createdAt: FieldRef<"TenantSubscription", 'DateTime'>
    readonly updatedAt: FieldRef<"TenantSubscription", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TenantSubscription findUnique
   */
  export type TenantSubscriptionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantSubscription
     */
    select?: TenantSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantSubscription
     */
    omit?: TenantSubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantSubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which TenantSubscription to fetch.
     */
    where: TenantSubscriptionWhereUniqueInput
  }

  /**
   * TenantSubscription findUniqueOrThrow
   */
  export type TenantSubscriptionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantSubscription
     */
    select?: TenantSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantSubscription
     */
    omit?: TenantSubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantSubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which TenantSubscription to fetch.
     */
    where: TenantSubscriptionWhereUniqueInput
  }

  /**
   * TenantSubscription findFirst
   */
  export type TenantSubscriptionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantSubscription
     */
    select?: TenantSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantSubscription
     */
    omit?: TenantSubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantSubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which TenantSubscription to fetch.
     */
    where?: TenantSubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantSubscriptions to fetch.
     */
    orderBy?: TenantSubscriptionOrderByWithRelationInput | TenantSubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TenantSubscriptions.
     */
    cursor?: TenantSubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantSubscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantSubscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TenantSubscriptions.
     */
    distinct?: TenantSubscriptionScalarFieldEnum | TenantSubscriptionScalarFieldEnum[]
  }

  /**
   * TenantSubscription findFirstOrThrow
   */
  export type TenantSubscriptionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantSubscription
     */
    select?: TenantSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantSubscription
     */
    omit?: TenantSubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantSubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which TenantSubscription to fetch.
     */
    where?: TenantSubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantSubscriptions to fetch.
     */
    orderBy?: TenantSubscriptionOrderByWithRelationInput | TenantSubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TenantSubscriptions.
     */
    cursor?: TenantSubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantSubscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantSubscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TenantSubscriptions.
     */
    distinct?: TenantSubscriptionScalarFieldEnum | TenantSubscriptionScalarFieldEnum[]
  }

  /**
   * TenantSubscription findMany
   */
  export type TenantSubscriptionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantSubscription
     */
    select?: TenantSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantSubscription
     */
    omit?: TenantSubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantSubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which TenantSubscriptions to fetch.
     */
    where?: TenantSubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantSubscriptions to fetch.
     */
    orderBy?: TenantSubscriptionOrderByWithRelationInput | TenantSubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TenantSubscriptions.
     */
    cursor?: TenantSubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantSubscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantSubscriptions.
     */
    skip?: number
    distinct?: TenantSubscriptionScalarFieldEnum | TenantSubscriptionScalarFieldEnum[]
  }

  /**
   * TenantSubscription create
   */
  export type TenantSubscriptionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantSubscription
     */
    select?: TenantSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantSubscription
     */
    omit?: TenantSubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantSubscriptionInclude<ExtArgs> | null
    /**
     * The data needed to create a TenantSubscription.
     */
    data: XOR<TenantSubscriptionCreateInput, TenantSubscriptionUncheckedCreateInput>
  }

  /**
   * TenantSubscription createMany
   */
  export type TenantSubscriptionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TenantSubscriptions.
     */
    data: TenantSubscriptionCreateManyInput | TenantSubscriptionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TenantSubscription createManyAndReturn
   */
  export type TenantSubscriptionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantSubscription
     */
    select?: TenantSubscriptionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TenantSubscription
     */
    omit?: TenantSubscriptionOmit<ExtArgs> | null
    /**
     * The data used to create many TenantSubscriptions.
     */
    data: TenantSubscriptionCreateManyInput | TenantSubscriptionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantSubscriptionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TenantSubscription update
   */
  export type TenantSubscriptionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantSubscription
     */
    select?: TenantSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantSubscription
     */
    omit?: TenantSubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantSubscriptionInclude<ExtArgs> | null
    /**
     * The data needed to update a TenantSubscription.
     */
    data: XOR<TenantSubscriptionUpdateInput, TenantSubscriptionUncheckedUpdateInput>
    /**
     * Choose, which TenantSubscription to update.
     */
    where: TenantSubscriptionWhereUniqueInput
  }

  /**
   * TenantSubscription updateMany
   */
  export type TenantSubscriptionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TenantSubscriptions.
     */
    data: XOR<TenantSubscriptionUpdateManyMutationInput, TenantSubscriptionUncheckedUpdateManyInput>
    /**
     * Filter which TenantSubscriptions to update
     */
    where?: TenantSubscriptionWhereInput
    /**
     * Limit how many TenantSubscriptions to update.
     */
    limit?: number
  }

  /**
   * TenantSubscription updateManyAndReturn
   */
  export type TenantSubscriptionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantSubscription
     */
    select?: TenantSubscriptionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TenantSubscription
     */
    omit?: TenantSubscriptionOmit<ExtArgs> | null
    /**
     * The data used to update TenantSubscriptions.
     */
    data: XOR<TenantSubscriptionUpdateManyMutationInput, TenantSubscriptionUncheckedUpdateManyInput>
    /**
     * Filter which TenantSubscriptions to update
     */
    where?: TenantSubscriptionWhereInput
    /**
     * Limit how many TenantSubscriptions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantSubscriptionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TenantSubscription upsert
   */
  export type TenantSubscriptionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantSubscription
     */
    select?: TenantSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantSubscription
     */
    omit?: TenantSubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantSubscriptionInclude<ExtArgs> | null
    /**
     * The filter to search for the TenantSubscription to update in case it exists.
     */
    where: TenantSubscriptionWhereUniqueInput
    /**
     * In case the TenantSubscription found by the `where` argument doesn't exist, create a new TenantSubscription with this data.
     */
    create: XOR<TenantSubscriptionCreateInput, TenantSubscriptionUncheckedCreateInput>
    /**
     * In case the TenantSubscription was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TenantSubscriptionUpdateInput, TenantSubscriptionUncheckedUpdateInput>
  }

  /**
   * TenantSubscription delete
   */
  export type TenantSubscriptionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantSubscription
     */
    select?: TenantSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantSubscription
     */
    omit?: TenantSubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantSubscriptionInclude<ExtArgs> | null
    /**
     * Filter which TenantSubscription to delete.
     */
    where: TenantSubscriptionWhereUniqueInput
  }

  /**
   * TenantSubscription deleteMany
   */
  export type TenantSubscriptionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TenantSubscriptions to delete
     */
    where?: TenantSubscriptionWhereInput
    /**
     * Limit how many TenantSubscriptions to delete.
     */
    limit?: number
  }

  /**
   * TenantSubscription.invoices
   */
  export type TenantSubscription$invoicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoice
     */
    select?: BillingInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoice
     */
    omit?: BillingInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInvoiceInclude<ExtArgs> | null
    where?: BillingInvoiceWhereInput
    orderBy?: BillingInvoiceOrderByWithRelationInput | BillingInvoiceOrderByWithRelationInput[]
    cursor?: BillingInvoiceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BillingInvoiceScalarFieldEnum | BillingInvoiceScalarFieldEnum[]
  }

  /**
   * TenantSubscription.planChangeRequests
   */
  export type TenantSubscription$planChangeRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlanChangeRequest
     */
    select?: SubscriptionPlanChangeRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPlanChangeRequest
     */
    omit?: SubscriptionPlanChangeRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPlanChangeRequestInclude<ExtArgs> | null
    where?: SubscriptionPlanChangeRequestWhereInput
    orderBy?: SubscriptionPlanChangeRequestOrderByWithRelationInput | SubscriptionPlanChangeRequestOrderByWithRelationInput[]
    cursor?: SubscriptionPlanChangeRequestWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SubscriptionPlanChangeRequestScalarFieldEnum | SubscriptionPlanChangeRequestScalarFieldEnum[]
  }

  /**
   * TenantSubscription without action
   */
  export type TenantSubscriptionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantSubscription
     */
    select?: TenantSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantSubscription
     */
    omit?: TenantSubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantSubscriptionInclude<ExtArgs> | null
  }


  /**
   * Model BillingInvoice
   */

  export type AggregateBillingInvoice = {
    _count: BillingInvoiceCountAggregateOutputType | null
    _avg: BillingInvoiceAvgAggregateOutputType | null
    _sum: BillingInvoiceSumAggregateOutputType | null
    _min: BillingInvoiceMinAggregateOutputType | null
    _max: BillingInvoiceMaxAggregateOutputType | null
  }

  export type BillingInvoiceAvgAggregateOutputType = {
    id: number | null
    tenantId: number | null
    subscriptionId: number | null
    planId: number | null
    subtotal: Decimal | null
    taxAmount: Decimal | null
    totalAmount: Decimal | null
  }

  export type BillingInvoiceSumAggregateOutputType = {
    id: number | null
    tenantId: number | null
    subscriptionId: number | null
    planId: number | null
    subtotal: Decimal | null
    taxAmount: Decimal | null
    totalAmount: Decimal | null
  }

  export type BillingInvoiceMinAggregateOutputType = {
    id: number | null
    tenantId: number | null
    subscriptionId: number | null
    planId: number | null
    invoiceNumber: string | null
    status: $Enums.BillingInvoiceStatus | null
    issuedAt: Date | null
    dueDate: Date | null
    periodStart: Date | null
    periodEnd: Date | null
    subtotal: Decimal | null
    taxAmount: Decimal | null
    totalAmount: Decimal | null
    currency: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BillingInvoiceMaxAggregateOutputType = {
    id: number | null
    tenantId: number | null
    subscriptionId: number | null
    planId: number | null
    invoiceNumber: string | null
    status: $Enums.BillingInvoiceStatus | null
    issuedAt: Date | null
    dueDate: Date | null
    periodStart: Date | null
    periodEnd: Date | null
    subtotal: Decimal | null
    taxAmount: Decimal | null
    totalAmount: Decimal | null
    currency: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BillingInvoiceCountAggregateOutputType = {
    id: number
    tenantId: number
    subscriptionId: number
    planId: number
    invoiceNumber: number
    status: number
    issuedAt: number
    dueDate: number
    periodStart: number
    periodEnd: number
    subtotal: number
    taxAmount: number
    totalAmount: number
    currency: number
    lineItems: number
    notes: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type BillingInvoiceAvgAggregateInputType = {
    id?: true
    tenantId?: true
    subscriptionId?: true
    planId?: true
    subtotal?: true
    taxAmount?: true
    totalAmount?: true
  }

  export type BillingInvoiceSumAggregateInputType = {
    id?: true
    tenantId?: true
    subscriptionId?: true
    planId?: true
    subtotal?: true
    taxAmount?: true
    totalAmount?: true
  }

  export type BillingInvoiceMinAggregateInputType = {
    id?: true
    tenantId?: true
    subscriptionId?: true
    planId?: true
    invoiceNumber?: true
    status?: true
    issuedAt?: true
    dueDate?: true
    periodStart?: true
    periodEnd?: true
    subtotal?: true
    taxAmount?: true
    totalAmount?: true
    currency?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BillingInvoiceMaxAggregateInputType = {
    id?: true
    tenantId?: true
    subscriptionId?: true
    planId?: true
    invoiceNumber?: true
    status?: true
    issuedAt?: true
    dueDate?: true
    periodStart?: true
    periodEnd?: true
    subtotal?: true
    taxAmount?: true
    totalAmount?: true
    currency?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BillingInvoiceCountAggregateInputType = {
    id?: true
    tenantId?: true
    subscriptionId?: true
    planId?: true
    invoiceNumber?: true
    status?: true
    issuedAt?: true
    dueDate?: true
    periodStart?: true
    periodEnd?: true
    subtotal?: true
    taxAmount?: true
    totalAmount?: true
    currency?: true
    lineItems?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type BillingInvoiceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BillingInvoice to aggregate.
     */
    where?: BillingInvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingInvoices to fetch.
     */
    orderBy?: BillingInvoiceOrderByWithRelationInput | BillingInvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BillingInvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingInvoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingInvoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BillingInvoices
    **/
    _count?: true | BillingInvoiceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BillingInvoiceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BillingInvoiceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BillingInvoiceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BillingInvoiceMaxAggregateInputType
  }

  export type GetBillingInvoiceAggregateType<T extends BillingInvoiceAggregateArgs> = {
        [P in keyof T & keyof AggregateBillingInvoice]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBillingInvoice[P]>
      : GetScalarType<T[P], AggregateBillingInvoice[P]>
  }




  export type BillingInvoiceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BillingInvoiceWhereInput
    orderBy?: BillingInvoiceOrderByWithAggregationInput | BillingInvoiceOrderByWithAggregationInput[]
    by: BillingInvoiceScalarFieldEnum[] | BillingInvoiceScalarFieldEnum
    having?: BillingInvoiceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BillingInvoiceCountAggregateInputType | true
    _avg?: BillingInvoiceAvgAggregateInputType
    _sum?: BillingInvoiceSumAggregateInputType
    _min?: BillingInvoiceMinAggregateInputType
    _max?: BillingInvoiceMaxAggregateInputType
  }

  export type BillingInvoiceGroupByOutputType = {
    id: number
    tenantId: number
    subscriptionId: number
    planId: number
    invoiceNumber: string
    status: $Enums.BillingInvoiceStatus
    issuedAt: Date
    dueDate: Date
    periodStart: Date
    periodEnd: Date
    subtotal: Decimal
    taxAmount: Decimal
    totalAmount: Decimal
    currency: string
    lineItems: JsonValue
    notes: string | null
    createdAt: Date
    updatedAt: Date
    _count: BillingInvoiceCountAggregateOutputType | null
    _avg: BillingInvoiceAvgAggregateOutputType | null
    _sum: BillingInvoiceSumAggregateOutputType | null
    _min: BillingInvoiceMinAggregateOutputType | null
    _max: BillingInvoiceMaxAggregateOutputType | null
  }

  type GetBillingInvoiceGroupByPayload<T extends BillingInvoiceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BillingInvoiceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BillingInvoiceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BillingInvoiceGroupByOutputType[P]>
            : GetScalarType<T[P], BillingInvoiceGroupByOutputType[P]>
        }
      >
    >


  export type BillingInvoiceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    subscriptionId?: boolean
    planId?: boolean
    invoiceNumber?: boolean
    status?: boolean
    issuedAt?: boolean
    dueDate?: boolean
    periodStart?: boolean
    periodEnd?: boolean
    subtotal?: boolean
    taxAmount?: boolean
    totalAmount?: boolean
    currency?: boolean
    lineItems?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    subscription?: boolean | TenantSubscriptionDefaultArgs<ExtArgs>
    plan?: boolean | SubscriptionPlanDefaultArgs<ExtArgs>
    payments?: boolean | BillingInvoice$paymentsArgs<ExtArgs>
    _count?: boolean | BillingInvoiceCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["billingInvoice"]>

  export type BillingInvoiceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    subscriptionId?: boolean
    planId?: boolean
    invoiceNumber?: boolean
    status?: boolean
    issuedAt?: boolean
    dueDate?: boolean
    periodStart?: boolean
    periodEnd?: boolean
    subtotal?: boolean
    taxAmount?: boolean
    totalAmount?: boolean
    currency?: boolean
    lineItems?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    subscription?: boolean | TenantSubscriptionDefaultArgs<ExtArgs>
    plan?: boolean | SubscriptionPlanDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["billingInvoice"]>

  export type BillingInvoiceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    subscriptionId?: boolean
    planId?: boolean
    invoiceNumber?: boolean
    status?: boolean
    issuedAt?: boolean
    dueDate?: boolean
    periodStart?: boolean
    periodEnd?: boolean
    subtotal?: boolean
    taxAmount?: boolean
    totalAmount?: boolean
    currency?: boolean
    lineItems?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    subscription?: boolean | TenantSubscriptionDefaultArgs<ExtArgs>
    plan?: boolean | SubscriptionPlanDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["billingInvoice"]>

  export type BillingInvoiceSelectScalar = {
    id?: boolean
    tenantId?: boolean
    subscriptionId?: boolean
    planId?: boolean
    invoiceNumber?: boolean
    status?: boolean
    issuedAt?: boolean
    dueDate?: boolean
    periodStart?: boolean
    periodEnd?: boolean
    subtotal?: boolean
    taxAmount?: boolean
    totalAmount?: boolean
    currency?: boolean
    lineItems?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type BillingInvoiceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "subscriptionId" | "planId" | "invoiceNumber" | "status" | "issuedAt" | "dueDate" | "periodStart" | "periodEnd" | "subtotal" | "taxAmount" | "totalAmount" | "currency" | "lineItems" | "notes" | "createdAt" | "updatedAt", ExtArgs["result"]["billingInvoice"]>
  export type BillingInvoiceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    subscription?: boolean | TenantSubscriptionDefaultArgs<ExtArgs>
    plan?: boolean | SubscriptionPlanDefaultArgs<ExtArgs>
    payments?: boolean | BillingInvoice$paymentsArgs<ExtArgs>
    _count?: boolean | BillingInvoiceCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type BillingInvoiceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    subscription?: boolean | TenantSubscriptionDefaultArgs<ExtArgs>
    plan?: boolean | SubscriptionPlanDefaultArgs<ExtArgs>
  }
  export type BillingInvoiceIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    subscription?: boolean | TenantSubscriptionDefaultArgs<ExtArgs>
    plan?: boolean | SubscriptionPlanDefaultArgs<ExtArgs>
  }

  export type $BillingInvoicePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BillingInvoice"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
      subscription: Prisma.$TenantSubscriptionPayload<ExtArgs>
      plan: Prisma.$SubscriptionPlanPayload<ExtArgs>
      payments: Prisma.$BillingPaymentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      tenantId: number
      subscriptionId: number
      planId: number
      invoiceNumber: string
      status: $Enums.BillingInvoiceStatus
      issuedAt: Date
      dueDate: Date
      periodStart: Date
      periodEnd: Date
      subtotal: Prisma.Decimal
      taxAmount: Prisma.Decimal
      totalAmount: Prisma.Decimal
      currency: string
      lineItems: Prisma.JsonValue
      notes: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["billingInvoice"]>
    composites: {}
  }

  type BillingInvoiceGetPayload<S extends boolean | null | undefined | BillingInvoiceDefaultArgs> = $Result.GetResult<Prisma.$BillingInvoicePayload, S>

  type BillingInvoiceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BillingInvoiceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BillingInvoiceCountAggregateInputType | true
    }

  export interface BillingInvoiceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BillingInvoice'], meta: { name: 'BillingInvoice' } }
    /**
     * Find zero or one BillingInvoice that matches the filter.
     * @param {BillingInvoiceFindUniqueArgs} args - Arguments to find a BillingInvoice
     * @example
     * // Get one BillingInvoice
     * const billingInvoice = await prisma.billingInvoice.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BillingInvoiceFindUniqueArgs>(args: SelectSubset<T, BillingInvoiceFindUniqueArgs<ExtArgs>>): Prisma__BillingInvoiceClient<$Result.GetResult<Prisma.$BillingInvoicePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one BillingInvoice that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BillingInvoiceFindUniqueOrThrowArgs} args - Arguments to find a BillingInvoice
     * @example
     * // Get one BillingInvoice
     * const billingInvoice = await prisma.billingInvoice.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BillingInvoiceFindUniqueOrThrowArgs>(args: SelectSubset<T, BillingInvoiceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BillingInvoiceClient<$Result.GetResult<Prisma.$BillingInvoicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BillingInvoice that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingInvoiceFindFirstArgs} args - Arguments to find a BillingInvoice
     * @example
     * // Get one BillingInvoice
     * const billingInvoice = await prisma.billingInvoice.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BillingInvoiceFindFirstArgs>(args?: SelectSubset<T, BillingInvoiceFindFirstArgs<ExtArgs>>): Prisma__BillingInvoiceClient<$Result.GetResult<Prisma.$BillingInvoicePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BillingInvoice that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingInvoiceFindFirstOrThrowArgs} args - Arguments to find a BillingInvoice
     * @example
     * // Get one BillingInvoice
     * const billingInvoice = await prisma.billingInvoice.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BillingInvoiceFindFirstOrThrowArgs>(args?: SelectSubset<T, BillingInvoiceFindFirstOrThrowArgs<ExtArgs>>): Prisma__BillingInvoiceClient<$Result.GetResult<Prisma.$BillingInvoicePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more BillingInvoices that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingInvoiceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BillingInvoices
     * const billingInvoices = await prisma.billingInvoice.findMany()
     * 
     * // Get first 10 BillingInvoices
     * const billingInvoices = await prisma.billingInvoice.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const billingInvoiceWithIdOnly = await prisma.billingInvoice.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BillingInvoiceFindManyArgs>(args?: SelectSubset<T, BillingInvoiceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BillingInvoicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a BillingInvoice.
     * @param {BillingInvoiceCreateArgs} args - Arguments to create a BillingInvoice.
     * @example
     * // Create one BillingInvoice
     * const BillingInvoice = await prisma.billingInvoice.create({
     *   data: {
     *     // ... data to create a BillingInvoice
     *   }
     * })
     * 
     */
    create<T extends BillingInvoiceCreateArgs>(args: SelectSubset<T, BillingInvoiceCreateArgs<ExtArgs>>): Prisma__BillingInvoiceClient<$Result.GetResult<Prisma.$BillingInvoicePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many BillingInvoices.
     * @param {BillingInvoiceCreateManyArgs} args - Arguments to create many BillingInvoices.
     * @example
     * // Create many BillingInvoices
     * const billingInvoice = await prisma.billingInvoice.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BillingInvoiceCreateManyArgs>(args?: SelectSubset<T, BillingInvoiceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BillingInvoices and returns the data saved in the database.
     * @param {BillingInvoiceCreateManyAndReturnArgs} args - Arguments to create many BillingInvoices.
     * @example
     * // Create many BillingInvoices
     * const billingInvoice = await prisma.billingInvoice.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BillingInvoices and only return the `id`
     * const billingInvoiceWithIdOnly = await prisma.billingInvoice.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BillingInvoiceCreateManyAndReturnArgs>(args?: SelectSubset<T, BillingInvoiceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BillingInvoicePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a BillingInvoice.
     * @param {BillingInvoiceDeleteArgs} args - Arguments to delete one BillingInvoice.
     * @example
     * // Delete one BillingInvoice
     * const BillingInvoice = await prisma.billingInvoice.delete({
     *   where: {
     *     // ... filter to delete one BillingInvoice
     *   }
     * })
     * 
     */
    delete<T extends BillingInvoiceDeleteArgs>(args: SelectSubset<T, BillingInvoiceDeleteArgs<ExtArgs>>): Prisma__BillingInvoiceClient<$Result.GetResult<Prisma.$BillingInvoicePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one BillingInvoice.
     * @param {BillingInvoiceUpdateArgs} args - Arguments to update one BillingInvoice.
     * @example
     * // Update one BillingInvoice
     * const billingInvoice = await prisma.billingInvoice.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BillingInvoiceUpdateArgs>(args: SelectSubset<T, BillingInvoiceUpdateArgs<ExtArgs>>): Prisma__BillingInvoiceClient<$Result.GetResult<Prisma.$BillingInvoicePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more BillingInvoices.
     * @param {BillingInvoiceDeleteManyArgs} args - Arguments to filter BillingInvoices to delete.
     * @example
     * // Delete a few BillingInvoices
     * const { count } = await prisma.billingInvoice.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BillingInvoiceDeleteManyArgs>(args?: SelectSubset<T, BillingInvoiceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BillingInvoices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingInvoiceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BillingInvoices
     * const billingInvoice = await prisma.billingInvoice.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BillingInvoiceUpdateManyArgs>(args: SelectSubset<T, BillingInvoiceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BillingInvoices and returns the data updated in the database.
     * @param {BillingInvoiceUpdateManyAndReturnArgs} args - Arguments to update many BillingInvoices.
     * @example
     * // Update many BillingInvoices
     * const billingInvoice = await prisma.billingInvoice.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more BillingInvoices and only return the `id`
     * const billingInvoiceWithIdOnly = await prisma.billingInvoice.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BillingInvoiceUpdateManyAndReturnArgs>(args: SelectSubset<T, BillingInvoiceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BillingInvoicePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one BillingInvoice.
     * @param {BillingInvoiceUpsertArgs} args - Arguments to update or create a BillingInvoice.
     * @example
     * // Update or create a BillingInvoice
     * const billingInvoice = await prisma.billingInvoice.upsert({
     *   create: {
     *     // ... data to create a BillingInvoice
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BillingInvoice we want to update
     *   }
     * })
     */
    upsert<T extends BillingInvoiceUpsertArgs>(args: SelectSubset<T, BillingInvoiceUpsertArgs<ExtArgs>>): Prisma__BillingInvoiceClient<$Result.GetResult<Prisma.$BillingInvoicePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of BillingInvoices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingInvoiceCountArgs} args - Arguments to filter BillingInvoices to count.
     * @example
     * // Count the number of BillingInvoices
     * const count = await prisma.billingInvoice.count({
     *   where: {
     *     // ... the filter for the BillingInvoices we want to count
     *   }
     * })
    **/
    count<T extends BillingInvoiceCountArgs>(
      args?: Subset<T, BillingInvoiceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BillingInvoiceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BillingInvoice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingInvoiceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BillingInvoiceAggregateArgs>(args: Subset<T, BillingInvoiceAggregateArgs>): Prisma.PrismaPromise<GetBillingInvoiceAggregateType<T>>

    /**
     * Group by BillingInvoice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingInvoiceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BillingInvoiceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BillingInvoiceGroupByArgs['orderBy'] }
        : { orderBy?: BillingInvoiceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BillingInvoiceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBillingInvoiceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BillingInvoice model
   */
  readonly fields: BillingInvoiceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BillingInvoice.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BillingInvoiceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    subscription<T extends TenantSubscriptionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantSubscriptionDefaultArgs<ExtArgs>>): Prisma__TenantSubscriptionClient<$Result.GetResult<Prisma.$TenantSubscriptionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    plan<T extends SubscriptionPlanDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SubscriptionPlanDefaultArgs<ExtArgs>>): Prisma__SubscriptionPlanClient<$Result.GetResult<Prisma.$SubscriptionPlanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    payments<T extends BillingInvoice$paymentsArgs<ExtArgs> = {}>(args?: Subset<T, BillingInvoice$paymentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BillingPaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the BillingInvoice model
   */
  interface BillingInvoiceFieldRefs {
    readonly id: FieldRef<"BillingInvoice", 'Int'>
    readonly tenantId: FieldRef<"BillingInvoice", 'Int'>
    readonly subscriptionId: FieldRef<"BillingInvoice", 'Int'>
    readonly planId: FieldRef<"BillingInvoice", 'Int'>
    readonly invoiceNumber: FieldRef<"BillingInvoice", 'String'>
    readonly status: FieldRef<"BillingInvoice", 'BillingInvoiceStatus'>
    readonly issuedAt: FieldRef<"BillingInvoice", 'DateTime'>
    readonly dueDate: FieldRef<"BillingInvoice", 'DateTime'>
    readonly periodStart: FieldRef<"BillingInvoice", 'DateTime'>
    readonly periodEnd: FieldRef<"BillingInvoice", 'DateTime'>
    readonly subtotal: FieldRef<"BillingInvoice", 'Decimal'>
    readonly taxAmount: FieldRef<"BillingInvoice", 'Decimal'>
    readonly totalAmount: FieldRef<"BillingInvoice", 'Decimal'>
    readonly currency: FieldRef<"BillingInvoice", 'String'>
    readonly lineItems: FieldRef<"BillingInvoice", 'Json'>
    readonly notes: FieldRef<"BillingInvoice", 'String'>
    readonly createdAt: FieldRef<"BillingInvoice", 'DateTime'>
    readonly updatedAt: FieldRef<"BillingInvoice", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * BillingInvoice findUnique
   */
  export type BillingInvoiceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoice
     */
    select?: BillingInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoice
     */
    omit?: BillingInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInvoiceInclude<ExtArgs> | null
    /**
     * Filter, which BillingInvoice to fetch.
     */
    where: BillingInvoiceWhereUniqueInput
  }

  /**
   * BillingInvoice findUniqueOrThrow
   */
  export type BillingInvoiceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoice
     */
    select?: BillingInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoice
     */
    omit?: BillingInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInvoiceInclude<ExtArgs> | null
    /**
     * Filter, which BillingInvoice to fetch.
     */
    where: BillingInvoiceWhereUniqueInput
  }

  /**
   * BillingInvoice findFirst
   */
  export type BillingInvoiceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoice
     */
    select?: BillingInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoice
     */
    omit?: BillingInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInvoiceInclude<ExtArgs> | null
    /**
     * Filter, which BillingInvoice to fetch.
     */
    where?: BillingInvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingInvoices to fetch.
     */
    orderBy?: BillingInvoiceOrderByWithRelationInput | BillingInvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BillingInvoices.
     */
    cursor?: BillingInvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingInvoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingInvoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BillingInvoices.
     */
    distinct?: BillingInvoiceScalarFieldEnum | BillingInvoiceScalarFieldEnum[]
  }

  /**
   * BillingInvoice findFirstOrThrow
   */
  export type BillingInvoiceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoice
     */
    select?: BillingInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoice
     */
    omit?: BillingInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInvoiceInclude<ExtArgs> | null
    /**
     * Filter, which BillingInvoice to fetch.
     */
    where?: BillingInvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingInvoices to fetch.
     */
    orderBy?: BillingInvoiceOrderByWithRelationInput | BillingInvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BillingInvoices.
     */
    cursor?: BillingInvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingInvoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingInvoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BillingInvoices.
     */
    distinct?: BillingInvoiceScalarFieldEnum | BillingInvoiceScalarFieldEnum[]
  }

  /**
   * BillingInvoice findMany
   */
  export type BillingInvoiceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoice
     */
    select?: BillingInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoice
     */
    omit?: BillingInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInvoiceInclude<ExtArgs> | null
    /**
     * Filter, which BillingInvoices to fetch.
     */
    where?: BillingInvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingInvoices to fetch.
     */
    orderBy?: BillingInvoiceOrderByWithRelationInput | BillingInvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BillingInvoices.
     */
    cursor?: BillingInvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingInvoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingInvoices.
     */
    skip?: number
    distinct?: BillingInvoiceScalarFieldEnum | BillingInvoiceScalarFieldEnum[]
  }

  /**
   * BillingInvoice create
   */
  export type BillingInvoiceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoice
     */
    select?: BillingInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoice
     */
    omit?: BillingInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInvoiceInclude<ExtArgs> | null
    /**
     * The data needed to create a BillingInvoice.
     */
    data: XOR<BillingInvoiceCreateInput, BillingInvoiceUncheckedCreateInput>
  }

  /**
   * BillingInvoice createMany
   */
  export type BillingInvoiceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BillingInvoices.
     */
    data: BillingInvoiceCreateManyInput | BillingInvoiceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BillingInvoice createManyAndReturn
   */
  export type BillingInvoiceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoice
     */
    select?: BillingInvoiceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoice
     */
    omit?: BillingInvoiceOmit<ExtArgs> | null
    /**
     * The data used to create many BillingInvoices.
     */
    data: BillingInvoiceCreateManyInput | BillingInvoiceCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInvoiceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * BillingInvoice update
   */
  export type BillingInvoiceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoice
     */
    select?: BillingInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoice
     */
    omit?: BillingInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInvoiceInclude<ExtArgs> | null
    /**
     * The data needed to update a BillingInvoice.
     */
    data: XOR<BillingInvoiceUpdateInput, BillingInvoiceUncheckedUpdateInput>
    /**
     * Choose, which BillingInvoice to update.
     */
    where: BillingInvoiceWhereUniqueInput
  }

  /**
   * BillingInvoice updateMany
   */
  export type BillingInvoiceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BillingInvoices.
     */
    data: XOR<BillingInvoiceUpdateManyMutationInput, BillingInvoiceUncheckedUpdateManyInput>
    /**
     * Filter which BillingInvoices to update
     */
    where?: BillingInvoiceWhereInput
    /**
     * Limit how many BillingInvoices to update.
     */
    limit?: number
  }

  /**
   * BillingInvoice updateManyAndReturn
   */
  export type BillingInvoiceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoice
     */
    select?: BillingInvoiceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoice
     */
    omit?: BillingInvoiceOmit<ExtArgs> | null
    /**
     * The data used to update BillingInvoices.
     */
    data: XOR<BillingInvoiceUpdateManyMutationInput, BillingInvoiceUncheckedUpdateManyInput>
    /**
     * Filter which BillingInvoices to update
     */
    where?: BillingInvoiceWhereInput
    /**
     * Limit how many BillingInvoices to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInvoiceIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * BillingInvoice upsert
   */
  export type BillingInvoiceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoice
     */
    select?: BillingInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoice
     */
    omit?: BillingInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInvoiceInclude<ExtArgs> | null
    /**
     * The filter to search for the BillingInvoice to update in case it exists.
     */
    where: BillingInvoiceWhereUniqueInput
    /**
     * In case the BillingInvoice found by the `where` argument doesn't exist, create a new BillingInvoice with this data.
     */
    create: XOR<BillingInvoiceCreateInput, BillingInvoiceUncheckedCreateInput>
    /**
     * In case the BillingInvoice was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BillingInvoiceUpdateInput, BillingInvoiceUncheckedUpdateInput>
  }

  /**
   * BillingInvoice delete
   */
  export type BillingInvoiceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoice
     */
    select?: BillingInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoice
     */
    omit?: BillingInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInvoiceInclude<ExtArgs> | null
    /**
     * Filter which BillingInvoice to delete.
     */
    where: BillingInvoiceWhereUniqueInput
  }

  /**
   * BillingInvoice deleteMany
   */
  export type BillingInvoiceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BillingInvoices to delete
     */
    where?: BillingInvoiceWhereInput
    /**
     * Limit how many BillingInvoices to delete.
     */
    limit?: number
  }

  /**
   * BillingInvoice.payments
   */
  export type BillingInvoice$paymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingPayment
     */
    select?: BillingPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingPayment
     */
    omit?: BillingPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingPaymentInclude<ExtArgs> | null
    where?: BillingPaymentWhereInput
    orderBy?: BillingPaymentOrderByWithRelationInput | BillingPaymentOrderByWithRelationInput[]
    cursor?: BillingPaymentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BillingPaymentScalarFieldEnum | BillingPaymentScalarFieldEnum[]
  }

  /**
   * BillingInvoice without action
   */
  export type BillingInvoiceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoice
     */
    select?: BillingInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoice
     */
    omit?: BillingInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInvoiceInclude<ExtArgs> | null
  }


  /**
   * Model BillingPayment
   */

  export type AggregateBillingPayment = {
    _count: BillingPaymentCountAggregateOutputType | null
    _avg: BillingPaymentAvgAggregateOutputType | null
    _sum: BillingPaymentSumAggregateOutputType | null
    _min: BillingPaymentMinAggregateOutputType | null
    _max: BillingPaymentMaxAggregateOutputType | null
  }

  export type BillingPaymentAvgAggregateOutputType = {
    id: number | null
    invoiceId: number | null
    tenantId: number | null
    amount: Decimal | null
  }

  export type BillingPaymentSumAggregateOutputType = {
    id: number | null
    invoiceId: number | null
    tenantId: number | null
    amount: Decimal | null
  }

  export type BillingPaymentMinAggregateOutputType = {
    id: number | null
    invoiceId: number | null
    tenantId: number | null
    amount: Decimal | null
    method: $Enums.BillingPaymentMethod | null
    status: $Enums.BillingPaymentStatus | null
    paidAt: Date | null
    reference: string | null
    notes: string | null
    createdAt: Date | null
  }

  export type BillingPaymentMaxAggregateOutputType = {
    id: number | null
    invoiceId: number | null
    tenantId: number | null
    amount: Decimal | null
    method: $Enums.BillingPaymentMethod | null
    status: $Enums.BillingPaymentStatus | null
    paidAt: Date | null
    reference: string | null
    notes: string | null
    createdAt: Date | null
  }

  export type BillingPaymentCountAggregateOutputType = {
    id: number
    invoiceId: number
    tenantId: number
    amount: number
    method: number
    status: number
    paidAt: number
    reference: number
    notes: number
    createdAt: number
    _all: number
  }


  export type BillingPaymentAvgAggregateInputType = {
    id?: true
    invoiceId?: true
    tenantId?: true
    amount?: true
  }

  export type BillingPaymentSumAggregateInputType = {
    id?: true
    invoiceId?: true
    tenantId?: true
    amount?: true
  }

  export type BillingPaymentMinAggregateInputType = {
    id?: true
    invoiceId?: true
    tenantId?: true
    amount?: true
    method?: true
    status?: true
    paidAt?: true
    reference?: true
    notes?: true
    createdAt?: true
  }

  export type BillingPaymentMaxAggregateInputType = {
    id?: true
    invoiceId?: true
    tenantId?: true
    amount?: true
    method?: true
    status?: true
    paidAt?: true
    reference?: true
    notes?: true
    createdAt?: true
  }

  export type BillingPaymentCountAggregateInputType = {
    id?: true
    invoiceId?: true
    tenantId?: true
    amount?: true
    method?: true
    status?: true
    paidAt?: true
    reference?: true
    notes?: true
    createdAt?: true
    _all?: true
  }

  export type BillingPaymentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BillingPayment to aggregate.
     */
    where?: BillingPaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingPayments to fetch.
     */
    orderBy?: BillingPaymentOrderByWithRelationInput | BillingPaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BillingPaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingPayments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingPayments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BillingPayments
    **/
    _count?: true | BillingPaymentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BillingPaymentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BillingPaymentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BillingPaymentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BillingPaymentMaxAggregateInputType
  }

  export type GetBillingPaymentAggregateType<T extends BillingPaymentAggregateArgs> = {
        [P in keyof T & keyof AggregateBillingPayment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBillingPayment[P]>
      : GetScalarType<T[P], AggregateBillingPayment[P]>
  }




  export type BillingPaymentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BillingPaymentWhereInput
    orderBy?: BillingPaymentOrderByWithAggregationInput | BillingPaymentOrderByWithAggregationInput[]
    by: BillingPaymentScalarFieldEnum[] | BillingPaymentScalarFieldEnum
    having?: BillingPaymentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BillingPaymentCountAggregateInputType | true
    _avg?: BillingPaymentAvgAggregateInputType
    _sum?: BillingPaymentSumAggregateInputType
    _min?: BillingPaymentMinAggregateInputType
    _max?: BillingPaymentMaxAggregateInputType
  }

  export type BillingPaymentGroupByOutputType = {
    id: number
    invoiceId: number
    tenantId: number
    amount: Decimal
    method: $Enums.BillingPaymentMethod
    status: $Enums.BillingPaymentStatus
    paidAt: Date
    reference: string | null
    notes: string | null
    createdAt: Date
    _count: BillingPaymentCountAggregateOutputType | null
    _avg: BillingPaymentAvgAggregateOutputType | null
    _sum: BillingPaymentSumAggregateOutputType | null
    _min: BillingPaymentMinAggregateOutputType | null
    _max: BillingPaymentMaxAggregateOutputType | null
  }

  type GetBillingPaymentGroupByPayload<T extends BillingPaymentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BillingPaymentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BillingPaymentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BillingPaymentGroupByOutputType[P]>
            : GetScalarType<T[P], BillingPaymentGroupByOutputType[P]>
        }
      >
    >


  export type BillingPaymentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    invoiceId?: boolean
    tenantId?: boolean
    amount?: boolean
    method?: boolean
    status?: boolean
    paidAt?: boolean
    reference?: boolean
    notes?: boolean
    createdAt?: boolean
    invoice?: boolean | BillingInvoiceDefaultArgs<ExtArgs>
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["billingPayment"]>

  export type BillingPaymentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    invoiceId?: boolean
    tenantId?: boolean
    amount?: boolean
    method?: boolean
    status?: boolean
    paidAt?: boolean
    reference?: boolean
    notes?: boolean
    createdAt?: boolean
    invoice?: boolean | BillingInvoiceDefaultArgs<ExtArgs>
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["billingPayment"]>

  export type BillingPaymentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    invoiceId?: boolean
    tenantId?: boolean
    amount?: boolean
    method?: boolean
    status?: boolean
    paidAt?: boolean
    reference?: boolean
    notes?: boolean
    createdAt?: boolean
    invoice?: boolean | BillingInvoiceDefaultArgs<ExtArgs>
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["billingPayment"]>

  export type BillingPaymentSelectScalar = {
    id?: boolean
    invoiceId?: boolean
    tenantId?: boolean
    amount?: boolean
    method?: boolean
    status?: boolean
    paidAt?: boolean
    reference?: boolean
    notes?: boolean
    createdAt?: boolean
  }

  export type BillingPaymentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "invoiceId" | "tenantId" | "amount" | "method" | "status" | "paidAt" | "reference" | "notes" | "createdAt", ExtArgs["result"]["billingPayment"]>
  export type BillingPaymentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoice?: boolean | BillingInvoiceDefaultArgs<ExtArgs>
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type BillingPaymentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoice?: boolean | BillingInvoiceDefaultArgs<ExtArgs>
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type BillingPaymentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoice?: boolean | BillingInvoiceDefaultArgs<ExtArgs>
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }

  export type $BillingPaymentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BillingPayment"
    objects: {
      invoice: Prisma.$BillingInvoicePayload<ExtArgs>
      tenant: Prisma.$TenantPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      invoiceId: number
      tenantId: number
      amount: Prisma.Decimal
      method: $Enums.BillingPaymentMethod
      status: $Enums.BillingPaymentStatus
      paidAt: Date
      reference: string | null
      notes: string | null
      createdAt: Date
    }, ExtArgs["result"]["billingPayment"]>
    composites: {}
  }

  type BillingPaymentGetPayload<S extends boolean | null | undefined | BillingPaymentDefaultArgs> = $Result.GetResult<Prisma.$BillingPaymentPayload, S>

  type BillingPaymentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BillingPaymentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BillingPaymentCountAggregateInputType | true
    }

  export interface BillingPaymentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BillingPayment'], meta: { name: 'BillingPayment' } }
    /**
     * Find zero or one BillingPayment that matches the filter.
     * @param {BillingPaymentFindUniqueArgs} args - Arguments to find a BillingPayment
     * @example
     * // Get one BillingPayment
     * const billingPayment = await prisma.billingPayment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BillingPaymentFindUniqueArgs>(args: SelectSubset<T, BillingPaymentFindUniqueArgs<ExtArgs>>): Prisma__BillingPaymentClient<$Result.GetResult<Prisma.$BillingPaymentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one BillingPayment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BillingPaymentFindUniqueOrThrowArgs} args - Arguments to find a BillingPayment
     * @example
     * // Get one BillingPayment
     * const billingPayment = await prisma.billingPayment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BillingPaymentFindUniqueOrThrowArgs>(args: SelectSubset<T, BillingPaymentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BillingPaymentClient<$Result.GetResult<Prisma.$BillingPaymentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BillingPayment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingPaymentFindFirstArgs} args - Arguments to find a BillingPayment
     * @example
     * // Get one BillingPayment
     * const billingPayment = await prisma.billingPayment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BillingPaymentFindFirstArgs>(args?: SelectSubset<T, BillingPaymentFindFirstArgs<ExtArgs>>): Prisma__BillingPaymentClient<$Result.GetResult<Prisma.$BillingPaymentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BillingPayment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingPaymentFindFirstOrThrowArgs} args - Arguments to find a BillingPayment
     * @example
     * // Get one BillingPayment
     * const billingPayment = await prisma.billingPayment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BillingPaymentFindFirstOrThrowArgs>(args?: SelectSubset<T, BillingPaymentFindFirstOrThrowArgs<ExtArgs>>): Prisma__BillingPaymentClient<$Result.GetResult<Prisma.$BillingPaymentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more BillingPayments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingPaymentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BillingPayments
     * const billingPayments = await prisma.billingPayment.findMany()
     * 
     * // Get first 10 BillingPayments
     * const billingPayments = await prisma.billingPayment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const billingPaymentWithIdOnly = await prisma.billingPayment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BillingPaymentFindManyArgs>(args?: SelectSubset<T, BillingPaymentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BillingPaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a BillingPayment.
     * @param {BillingPaymentCreateArgs} args - Arguments to create a BillingPayment.
     * @example
     * // Create one BillingPayment
     * const BillingPayment = await prisma.billingPayment.create({
     *   data: {
     *     // ... data to create a BillingPayment
     *   }
     * })
     * 
     */
    create<T extends BillingPaymentCreateArgs>(args: SelectSubset<T, BillingPaymentCreateArgs<ExtArgs>>): Prisma__BillingPaymentClient<$Result.GetResult<Prisma.$BillingPaymentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many BillingPayments.
     * @param {BillingPaymentCreateManyArgs} args - Arguments to create many BillingPayments.
     * @example
     * // Create many BillingPayments
     * const billingPayment = await prisma.billingPayment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BillingPaymentCreateManyArgs>(args?: SelectSubset<T, BillingPaymentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BillingPayments and returns the data saved in the database.
     * @param {BillingPaymentCreateManyAndReturnArgs} args - Arguments to create many BillingPayments.
     * @example
     * // Create many BillingPayments
     * const billingPayment = await prisma.billingPayment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BillingPayments and only return the `id`
     * const billingPaymentWithIdOnly = await prisma.billingPayment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BillingPaymentCreateManyAndReturnArgs>(args?: SelectSubset<T, BillingPaymentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BillingPaymentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a BillingPayment.
     * @param {BillingPaymentDeleteArgs} args - Arguments to delete one BillingPayment.
     * @example
     * // Delete one BillingPayment
     * const BillingPayment = await prisma.billingPayment.delete({
     *   where: {
     *     // ... filter to delete one BillingPayment
     *   }
     * })
     * 
     */
    delete<T extends BillingPaymentDeleteArgs>(args: SelectSubset<T, BillingPaymentDeleteArgs<ExtArgs>>): Prisma__BillingPaymentClient<$Result.GetResult<Prisma.$BillingPaymentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one BillingPayment.
     * @param {BillingPaymentUpdateArgs} args - Arguments to update one BillingPayment.
     * @example
     * // Update one BillingPayment
     * const billingPayment = await prisma.billingPayment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BillingPaymentUpdateArgs>(args: SelectSubset<T, BillingPaymentUpdateArgs<ExtArgs>>): Prisma__BillingPaymentClient<$Result.GetResult<Prisma.$BillingPaymentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more BillingPayments.
     * @param {BillingPaymentDeleteManyArgs} args - Arguments to filter BillingPayments to delete.
     * @example
     * // Delete a few BillingPayments
     * const { count } = await prisma.billingPayment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BillingPaymentDeleteManyArgs>(args?: SelectSubset<T, BillingPaymentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BillingPayments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingPaymentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BillingPayments
     * const billingPayment = await prisma.billingPayment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BillingPaymentUpdateManyArgs>(args: SelectSubset<T, BillingPaymentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BillingPayments and returns the data updated in the database.
     * @param {BillingPaymentUpdateManyAndReturnArgs} args - Arguments to update many BillingPayments.
     * @example
     * // Update many BillingPayments
     * const billingPayment = await prisma.billingPayment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more BillingPayments and only return the `id`
     * const billingPaymentWithIdOnly = await prisma.billingPayment.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BillingPaymentUpdateManyAndReturnArgs>(args: SelectSubset<T, BillingPaymentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BillingPaymentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one BillingPayment.
     * @param {BillingPaymentUpsertArgs} args - Arguments to update or create a BillingPayment.
     * @example
     * // Update or create a BillingPayment
     * const billingPayment = await prisma.billingPayment.upsert({
     *   create: {
     *     // ... data to create a BillingPayment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BillingPayment we want to update
     *   }
     * })
     */
    upsert<T extends BillingPaymentUpsertArgs>(args: SelectSubset<T, BillingPaymentUpsertArgs<ExtArgs>>): Prisma__BillingPaymentClient<$Result.GetResult<Prisma.$BillingPaymentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of BillingPayments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingPaymentCountArgs} args - Arguments to filter BillingPayments to count.
     * @example
     * // Count the number of BillingPayments
     * const count = await prisma.billingPayment.count({
     *   where: {
     *     // ... the filter for the BillingPayments we want to count
     *   }
     * })
    **/
    count<T extends BillingPaymentCountArgs>(
      args?: Subset<T, BillingPaymentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BillingPaymentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BillingPayment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingPaymentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BillingPaymentAggregateArgs>(args: Subset<T, BillingPaymentAggregateArgs>): Prisma.PrismaPromise<GetBillingPaymentAggregateType<T>>

    /**
     * Group by BillingPayment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingPaymentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BillingPaymentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BillingPaymentGroupByArgs['orderBy'] }
        : { orderBy?: BillingPaymentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BillingPaymentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBillingPaymentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BillingPayment model
   */
  readonly fields: BillingPaymentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BillingPayment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BillingPaymentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    invoice<T extends BillingInvoiceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BillingInvoiceDefaultArgs<ExtArgs>>): Prisma__BillingInvoiceClient<$Result.GetResult<Prisma.$BillingInvoicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the BillingPayment model
   */
  interface BillingPaymentFieldRefs {
    readonly id: FieldRef<"BillingPayment", 'Int'>
    readonly invoiceId: FieldRef<"BillingPayment", 'Int'>
    readonly tenantId: FieldRef<"BillingPayment", 'Int'>
    readonly amount: FieldRef<"BillingPayment", 'Decimal'>
    readonly method: FieldRef<"BillingPayment", 'BillingPaymentMethod'>
    readonly status: FieldRef<"BillingPayment", 'BillingPaymentStatus'>
    readonly paidAt: FieldRef<"BillingPayment", 'DateTime'>
    readonly reference: FieldRef<"BillingPayment", 'String'>
    readonly notes: FieldRef<"BillingPayment", 'String'>
    readonly createdAt: FieldRef<"BillingPayment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * BillingPayment findUnique
   */
  export type BillingPaymentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingPayment
     */
    select?: BillingPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingPayment
     */
    omit?: BillingPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingPaymentInclude<ExtArgs> | null
    /**
     * Filter, which BillingPayment to fetch.
     */
    where: BillingPaymentWhereUniqueInput
  }

  /**
   * BillingPayment findUniqueOrThrow
   */
  export type BillingPaymentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingPayment
     */
    select?: BillingPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingPayment
     */
    omit?: BillingPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingPaymentInclude<ExtArgs> | null
    /**
     * Filter, which BillingPayment to fetch.
     */
    where: BillingPaymentWhereUniqueInput
  }

  /**
   * BillingPayment findFirst
   */
  export type BillingPaymentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingPayment
     */
    select?: BillingPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingPayment
     */
    omit?: BillingPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingPaymentInclude<ExtArgs> | null
    /**
     * Filter, which BillingPayment to fetch.
     */
    where?: BillingPaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingPayments to fetch.
     */
    orderBy?: BillingPaymentOrderByWithRelationInput | BillingPaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BillingPayments.
     */
    cursor?: BillingPaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingPayments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingPayments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BillingPayments.
     */
    distinct?: BillingPaymentScalarFieldEnum | BillingPaymentScalarFieldEnum[]
  }

  /**
   * BillingPayment findFirstOrThrow
   */
  export type BillingPaymentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingPayment
     */
    select?: BillingPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingPayment
     */
    omit?: BillingPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingPaymentInclude<ExtArgs> | null
    /**
     * Filter, which BillingPayment to fetch.
     */
    where?: BillingPaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingPayments to fetch.
     */
    orderBy?: BillingPaymentOrderByWithRelationInput | BillingPaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BillingPayments.
     */
    cursor?: BillingPaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingPayments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingPayments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BillingPayments.
     */
    distinct?: BillingPaymentScalarFieldEnum | BillingPaymentScalarFieldEnum[]
  }

  /**
   * BillingPayment findMany
   */
  export type BillingPaymentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingPayment
     */
    select?: BillingPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingPayment
     */
    omit?: BillingPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingPaymentInclude<ExtArgs> | null
    /**
     * Filter, which BillingPayments to fetch.
     */
    where?: BillingPaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingPayments to fetch.
     */
    orderBy?: BillingPaymentOrderByWithRelationInput | BillingPaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BillingPayments.
     */
    cursor?: BillingPaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingPayments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingPayments.
     */
    skip?: number
    distinct?: BillingPaymentScalarFieldEnum | BillingPaymentScalarFieldEnum[]
  }

  /**
   * BillingPayment create
   */
  export type BillingPaymentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingPayment
     */
    select?: BillingPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingPayment
     */
    omit?: BillingPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingPaymentInclude<ExtArgs> | null
    /**
     * The data needed to create a BillingPayment.
     */
    data: XOR<BillingPaymentCreateInput, BillingPaymentUncheckedCreateInput>
  }

  /**
   * BillingPayment createMany
   */
  export type BillingPaymentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BillingPayments.
     */
    data: BillingPaymentCreateManyInput | BillingPaymentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BillingPayment createManyAndReturn
   */
  export type BillingPaymentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingPayment
     */
    select?: BillingPaymentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BillingPayment
     */
    omit?: BillingPaymentOmit<ExtArgs> | null
    /**
     * The data used to create many BillingPayments.
     */
    data: BillingPaymentCreateManyInput | BillingPaymentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingPaymentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * BillingPayment update
   */
  export type BillingPaymentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingPayment
     */
    select?: BillingPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingPayment
     */
    omit?: BillingPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingPaymentInclude<ExtArgs> | null
    /**
     * The data needed to update a BillingPayment.
     */
    data: XOR<BillingPaymentUpdateInput, BillingPaymentUncheckedUpdateInput>
    /**
     * Choose, which BillingPayment to update.
     */
    where: BillingPaymentWhereUniqueInput
  }

  /**
   * BillingPayment updateMany
   */
  export type BillingPaymentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BillingPayments.
     */
    data: XOR<BillingPaymentUpdateManyMutationInput, BillingPaymentUncheckedUpdateManyInput>
    /**
     * Filter which BillingPayments to update
     */
    where?: BillingPaymentWhereInput
    /**
     * Limit how many BillingPayments to update.
     */
    limit?: number
  }

  /**
   * BillingPayment updateManyAndReturn
   */
  export type BillingPaymentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingPayment
     */
    select?: BillingPaymentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BillingPayment
     */
    omit?: BillingPaymentOmit<ExtArgs> | null
    /**
     * The data used to update BillingPayments.
     */
    data: XOR<BillingPaymentUpdateManyMutationInput, BillingPaymentUncheckedUpdateManyInput>
    /**
     * Filter which BillingPayments to update
     */
    where?: BillingPaymentWhereInput
    /**
     * Limit how many BillingPayments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingPaymentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * BillingPayment upsert
   */
  export type BillingPaymentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingPayment
     */
    select?: BillingPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingPayment
     */
    omit?: BillingPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingPaymentInclude<ExtArgs> | null
    /**
     * The filter to search for the BillingPayment to update in case it exists.
     */
    where: BillingPaymentWhereUniqueInput
    /**
     * In case the BillingPayment found by the `where` argument doesn't exist, create a new BillingPayment with this data.
     */
    create: XOR<BillingPaymentCreateInput, BillingPaymentUncheckedCreateInput>
    /**
     * In case the BillingPayment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BillingPaymentUpdateInput, BillingPaymentUncheckedUpdateInput>
  }

  /**
   * BillingPayment delete
   */
  export type BillingPaymentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingPayment
     */
    select?: BillingPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingPayment
     */
    omit?: BillingPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingPaymentInclude<ExtArgs> | null
    /**
     * Filter which BillingPayment to delete.
     */
    where: BillingPaymentWhereUniqueInput
  }

  /**
   * BillingPayment deleteMany
   */
  export type BillingPaymentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BillingPayments to delete
     */
    where?: BillingPaymentWhereInput
    /**
     * Limit how many BillingPayments to delete.
     */
    limit?: number
  }

  /**
   * BillingPayment without action
   */
  export type BillingPaymentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingPayment
     */
    select?: BillingPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingPayment
     */
    omit?: BillingPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingPaymentInclude<ExtArgs> | null
  }


  /**
   * Model SubscriptionPlanChangeRequest
   */

  export type AggregateSubscriptionPlanChangeRequest = {
    _count: SubscriptionPlanChangeRequestCountAggregateOutputType | null
    _avg: SubscriptionPlanChangeRequestAvgAggregateOutputType | null
    _sum: SubscriptionPlanChangeRequestSumAggregateOutputType | null
    _min: SubscriptionPlanChangeRequestMinAggregateOutputType | null
    _max: SubscriptionPlanChangeRequestMaxAggregateOutputType | null
  }

  export type SubscriptionPlanChangeRequestAvgAggregateOutputType = {
    id: number | null
    tenantId: number | null
    currentSubscriptionId: number | null
    requestedPlanId: number | null
  }

  export type SubscriptionPlanChangeRequestSumAggregateOutputType = {
    id: number | null
    tenantId: number | null
    currentSubscriptionId: number | null
    requestedPlanId: number | null
  }

  export type SubscriptionPlanChangeRequestMinAggregateOutputType = {
    id: number | null
    tenantId: number | null
    currentSubscriptionId: number | null
    requestedPlanId: number | null
    status: $Enums.PlanChangeRequestStatus | null
    message: string | null
    reviewedNote: string | null
    createdAt: Date | null
    updatedAt: Date | null
    reviewedAt: Date | null
  }

  export type SubscriptionPlanChangeRequestMaxAggregateOutputType = {
    id: number | null
    tenantId: number | null
    currentSubscriptionId: number | null
    requestedPlanId: number | null
    status: $Enums.PlanChangeRequestStatus | null
    message: string | null
    reviewedNote: string | null
    createdAt: Date | null
    updatedAt: Date | null
    reviewedAt: Date | null
  }

  export type SubscriptionPlanChangeRequestCountAggregateOutputType = {
    id: number
    tenantId: number
    currentSubscriptionId: number
    requestedPlanId: number
    status: number
    message: number
    reviewedNote: number
    createdAt: number
    updatedAt: number
    reviewedAt: number
    _all: number
  }


  export type SubscriptionPlanChangeRequestAvgAggregateInputType = {
    id?: true
    tenantId?: true
    currentSubscriptionId?: true
    requestedPlanId?: true
  }

  export type SubscriptionPlanChangeRequestSumAggregateInputType = {
    id?: true
    tenantId?: true
    currentSubscriptionId?: true
    requestedPlanId?: true
  }

  export type SubscriptionPlanChangeRequestMinAggregateInputType = {
    id?: true
    tenantId?: true
    currentSubscriptionId?: true
    requestedPlanId?: true
    status?: true
    message?: true
    reviewedNote?: true
    createdAt?: true
    updatedAt?: true
    reviewedAt?: true
  }

  export type SubscriptionPlanChangeRequestMaxAggregateInputType = {
    id?: true
    tenantId?: true
    currentSubscriptionId?: true
    requestedPlanId?: true
    status?: true
    message?: true
    reviewedNote?: true
    createdAt?: true
    updatedAt?: true
    reviewedAt?: true
  }

  export type SubscriptionPlanChangeRequestCountAggregateInputType = {
    id?: true
    tenantId?: true
    currentSubscriptionId?: true
    requestedPlanId?: true
    status?: true
    message?: true
    reviewedNote?: true
    createdAt?: true
    updatedAt?: true
    reviewedAt?: true
    _all?: true
  }

  export type SubscriptionPlanChangeRequestAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SubscriptionPlanChangeRequest to aggregate.
     */
    where?: SubscriptionPlanChangeRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubscriptionPlanChangeRequests to fetch.
     */
    orderBy?: SubscriptionPlanChangeRequestOrderByWithRelationInput | SubscriptionPlanChangeRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SubscriptionPlanChangeRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubscriptionPlanChangeRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubscriptionPlanChangeRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SubscriptionPlanChangeRequests
    **/
    _count?: true | SubscriptionPlanChangeRequestCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SubscriptionPlanChangeRequestAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SubscriptionPlanChangeRequestSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SubscriptionPlanChangeRequestMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SubscriptionPlanChangeRequestMaxAggregateInputType
  }

  export type GetSubscriptionPlanChangeRequestAggregateType<T extends SubscriptionPlanChangeRequestAggregateArgs> = {
        [P in keyof T & keyof AggregateSubscriptionPlanChangeRequest]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSubscriptionPlanChangeRequest[P]>
      : GetScalarType<T[P], AggregateSubscriptionPlanChangeRequest[P]>
  }




  export type SubscriptionPlanChangeRequestGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubscriptionPlanChangeRequestWhereInput
    orderBy?: SubscriptionPlanChangeRequestOrderByWithAggregationInput | SubscriptionPlanChangeRequestOrderByWithAggregationInput[]
    by: SubscriptionPlanChangeRequestScalarFieldEnum[] | SubscriptionPlanChangeRequestScalarFieldEnum
    having?: SubscriptionPlanChangeRequestScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SubscriptionPlanChangeRequestCountAggregateInputType | true
    _avg?: SubscriptionPlanChangeRequestAvgAggregateInputType
    _sum?: SubscriptionPlanChangeRequestSumAggregateInputType
    _min?: SubscriptionPlanChangeRequestMinAggregateInputType
    _max?: SubscriptionPlanChangeRequestMaxAggregateInputType
  }

  export type SubscriptionPlanChangeRequestGroupByOutputType = {
    id: number
    tenantId: number
    currentSubscriptionId: number | null
    requestedPlanId: number
    status: $Enums.PlanChangeRequestStatus
    message: string | null
    reviewedNote: string | null
    createdAt: Date
    updatedAt: Date
    reviewedAt: Date | null
    _count: SubscriptionPlanChangeRequestCountAggregateOutputType | null
    _avg: SubscriptionPlanChangeRequestAvgAggregateOutputType | null
    _sum: SubscriptionPlanChangeRequestSumAggregateOutputType | null
    _min: SubscriptionPlanChangeRequestMinAggregateOutputType | null
    _max: SubscriptionPlanChangeRequestMaxAggregateOutputType | null
  }

  type GetSubscriptionPlanChangeRequestGroupByPayload<T extends SubscriptionPlanChangeRequestGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SubscriptionPlanChangeRequestGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SubscriptionPlanChangeRequestGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SubscriptionPlanChangeRequestGroupByOutputType[P]>
            : GetScalarType<T[P], SubscriptionPlanChangeRequestGroupByOutputType[P]>
        }
      >
    >


  export type SubscriptionPlanChangeRequestSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    currentSubscriptionId?: boolean
    requestedPlanId?: boolean
    status?: boolean
    message?: boolean
    reviewedNote?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    reviewedAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    currentSubscription?: boolean | SubscriptionPlanChangeRequest$currentSubscriptionArgs<ExtArgs>
    requestedPlan?: boolean | SubscriptionPlanDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subscriptionPlanChangeRequest"]>

  export type SubscriptionPlanChangeRequestSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    currentSubscriptionId?: boolean
    requestedPlanId?: boolean
    status?: boolean
    message?: boolean
    reviewedNote?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    reviewedAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    currentSubscription?: boolean | SubscriptionPlanChangeRequest$currentSubscriptionArgs<ExtArgs>
    requestedPlan?: boolean | SubscriptionPlanDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subscriptionPlanChangeRequest"]>

  export type SubscriptionPlanChangeRequestSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    currentSubscriptionId?: boolean
    requestedPlanId?: boolean
    status?: boolean
    message?: boolean
    reviewedNote?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    reviewedAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    currentSubscription?: boolean | SubscriptionPlanChangeRequest$currentSubscriptionArgs<ExtArgs>
    requestedPlan?: boolean | SubscriptionPlanDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subscriptionPlanChangeRequest"]>

  export type SubscriptionPlanChangeRequestSelectScalar = {
    id?: boolean
    tenantId?: boolean
    currentSubscriptionId?: boolean
    requestedPlanId?: boolean
    status?: boolean
    message?: boolean
    reviewedNote?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    reviewedAt?: boolean
  }

  export type SubscriptionPlanChangeRequestOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "currentSubscriptionId" | "requestedPlanId" | "status" | "message" | "reviewedNote" | "createdAt" | "updatedAt" | "reviewedAt", ExtArgs["result"]["subscriptionPlanChangeRequest"]>
  export type SubscriptionPlanChangeRequestInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    currentSubscription?: boolean | SubscriptionPlanChangeRequest$currentSubscriptionArgs<ExtArgs>
    requestedPlan?: boolean | SubscriptionPlanDefaultArgs<ExtArgs>
  }
  export type SubscriptionPlanChangeRequestIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    currentSubscription?: boolean | SubscriptionPlanChangeRequest$currentSubscriptionArgs<ExtArgs>
    requestedPlan?: boolean | SubscriptionPlanDefaultArgs<ExtArgs>
  }
  export type SubscriptionPlanChangeRequestIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    currentSubscription?: boolean | SubscriptionPlanChangeRequest$currentSubscriptionArgs<ExtArgs>
    requestedPlan?: boolean | SubscriptionPlanDefaultArgs<ExtArgs>
  }

  export type $SubscriptionPlanChangeRequestPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SubscriptionPlanChangeRequest"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
      currentSubscription: Prisma.$TenantSubscriptionPayload<ExtArgs> | null
      requestedPlan: Prisma.$SubscriptionPlanPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      tenantId: number
      currentSubscriptionId: number | null
      requestedPlanId: number
      status: $Enums.PlanChangeRequestStatus
      message: string | null
      reviewedNote: string | null
      createdAt: Date
      updatedAt: Date
      reviewedAt: Date | null
    }, ExtArgs["result"]["subscriptionPlanChangeRequest"]>
    composites: {}
  }

  type SubscriptionPlanChangeRequestGetPayload<S extends boolean | null | undefined | SubscriptionPlanChangeRequestDefaultArgs> = $Result.GetResult<Prisma.$SubscriptionPlanChangeRequestPayload, S>

  type SubscriptionPlanChangeRequestCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SubscriptionPlanChangeRequestFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SubscriptionPlanChangeRequestCountAggregateInputType | true
    }

  export interface SubscriptionPlanChangeRequestDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SubscriptionPlanChangeRequest'], meta: { name: 'SubscriptionPlanChangeRequest' } }
    /**
     * Find zero or one SubscriptionPlanChangeRequest that matches the filter.
     * @param {SubscriptionPlanChangeRequestFindUniqueArgs} args - Arguments to find a SubscriptionPlanChangeRequest
     * @example
     * // Get one SubscriptionPlanChangeRequest
     * const subscriptionPlanChangeRequest = await prisma.subscriptionPlanChangeRequest.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SubscriptionPlanChangeRequestFindUniqueArgs>(args: SelectSubset<T, SubscriptionPlanChangeRequestFindUniqueArgs<ExtArgs>>): Prisma__SubscriptionPlanChangeRequestClient<$Result.GetResult<Prisma.$SubscriptionPlanChangeRequestPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SubscriptionPlanChangeRequest that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SubscriptionPlanChangeRequestFindUniqueOrThrowArgs} args - Arguments to find a SubscriptionPlanChangeRequest
     * @example
     * // Get one SubscriptionPlanChangeRequest
     * const subscriptionPlanChangeRequest = await prisma.subscriptionPlanChangeRequest.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SubscriptionPlanChangeRequestFindUniqueOrThrowArgs>(args: SelectSubset<T, SubscriptionPlanChangeRequestFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SubscriptionPlanChangeRequestClient<$Result.GetResult<Prisma.$SubscriptionPlanChangeRequestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SubscriptionPlanChangeRequest that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPlanChangeRequestFindFirstArgs} args - Arguments to find a SubscriptionPlanChangeRequest
     * @example
     * // Get one SubscriptionPlanChangeRequest
     * const subscriptionPlanChangeRequest = await prisma.subscriptionPlanChangeRequest.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SubscriptionPlanChangeRequestFindFirstArgs>(args?: SelectSubset<T, SubscriptionPlanChangeRequestFindFirstArgs<ExtArgs>>): Prisma__SubscriptionPlanChangeRequestClient<$Result.GetResult<Prisma.$SubscriptionPlanChangeRequestPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SubscriptionPlanChangeRequest that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPlanChangeRequestFindFirstOrThrowArgs} args - Arguments to find a SubscriptionPlanChangeRequest
     * @example
     * // Get one SubscriptionPlanChangeRequest
     * const subscriptionPlanChangeRequest = await prisma.subscriptionPlanChangeRequest.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SubscriptionPlanChangeRequestFindFirstOrThrowArgs>(args?: SelectSubset<T, SubscriptionPlanChangeRequestFindFirstOrThrowArgs<ExtArgs>>): Prisma__SubscriptionPlanChangeRequestClient<$Result.GetResult<Prisma.$SubscriptionPlanChangeRequestPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SubscriptionPlanChangeRequests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPlanChangeRequestFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SubscriptionPlanChangeRequests
     * const subscriptionPlanChangeRequests = await prisma.subscriptionPlanChangeRequest.findMany()
     * 
     * // Get first 10 SubscriptionPlanChangeRequests
     * const subscriptionPlanChangeRequests = await prisma.subscriptionPlanChangeRequest.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const subscriptionPlanChangeRequestWithIdOnly = await prisma.subscriptionPlanChangeRequest.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SubscriptionPlanChangeRequestFindManyArgs>(args?: SelectSubset<T, SubscriptionPlanChangeRequestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPlanChangeRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SubscriptionPlanChangeRequest.
     * @param {SubscriptionPlanChangeRequestCreateArgs} args - Arguments to create a SubscriptionPlanChangeRequest.
     * @example
     * // Create one SubscriptionPlanChangeRequest
     * const SubscriptionPlanChangeRequest = await prisma.subscriptionPlanChangeRequest.create({
     *   data: {
     *     // ... data to create a SubscriptionPlanChangeRequest
     *   }
     * })
     * 
     */
    create<T extends SubscriptionPlanChangeRequestCreateArgs>(args: SelectSubset<T, SubscriptionPlanChangeRequestCreateArgs<ExtArgs>>): Prisma__SubscriptionPlanChangeRequestClient<$Result.GetResult<Prisma.$SubscriptionPlanChangeRequestPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SubscriptionPlanChangeRequests.
     * @param {SubscriptionPlanChangeRequestCreateManyArgs} args - Arguments to create many SubscriptionPlanChangeRequests.
     * @example
     * // Create many SubscriptionPlanChangeRequests
     * const subscriptionPlanChangeRequest = await prisma.subscriptionPlanChangeRequest.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SubscriptionPlanChangeRequestCreateManyArgs>(args?: SelectSubset<T, SubscriptionPlanChangeRequestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SubscriptionPlanChangeRequests and returns the data saved in the database.
     * @param {SubscriptionPlanChangeRequestCreateManyAndReturnArgs} args - Arguments to create many SubscriptionPlanChangeRequests.
     * @example
     * // Create many SubscriptionPlanChangeRequests
     * const subscriptionPlanChangeRequest = await prisma.subscriptionPlanChangeRequest.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SubscriptionPlanChangeRequests and only return the `id`
     * const subscriptionPlanChangeRequestWithIdOnly = await prisma.subscriptionPlanChangeRequest.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SubscriptionPlanChangeRequestCreateManyAndReturnArgs>(args?: SelectSubset<T, SubscriptionPlanChangeRequestCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPlanChangeRequestPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SubscriptionPlanChangeRequest.
     * @param {SubscriptionPlanChangeRequestDeleteArgs} args - Arguments to delete one SubscriptionPlanChangeRequest.
     * @example
     * // Delete one SubscriptionPlanChangeRequest
     * const SubscriptionPlanChangeRequest = await prisma.subscriptionPlanChangeRequest.delete({
     *   where: {
     *     // ... filter to delete one SubscriptionPlanChangeRequest
     *   }
     * })
     * 
     */
    delete<T extends SubscriptionPlanChangeRequestDeleteArgs>(args: SelectSubset<T, SubscriptionPlanChangeRequestDeleteArgs<ExtArgs>>): Prisma__SubscriptionPlanChangeRequestClient<$Result.GetResult<Prisma.$SubscriptionPlanChangeRequestPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SubscriptionPlanChangeRequest.
     * @param {SubscriptionPlanChangeRequestUpdateArgs} args - Arguments to update one SubscriptionPlanChangeRequest.
     * @example
     * // Update one SubscriptionPlanChangeRequest
     * const subscriptionPlanChangeRequest = await prisma.subscriptionPlanChangeRequest.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SubscriptionPlanChangeRequestUpdateArgs>(args: SelectSubset<T, SubscriptionPlanChangeRequestUpdateArgs<ExtArgs>>): Prisma__SubscriptionPlanChangeRequestClient<$Result.GetResult<Prisma.$SubscriptionPlanChangeRequestPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SubscriptionPlanChangeRequests.
     * @param {SubscriptionPlanChangeRequestDeleteManyArgs} args - Arguments to filter SubscriptionPlanChangeRequests to delete.
     * @example
     * // Delete a few SubscriptionPlanChangeRequests
     * const { count } = await prisma.subscriptionPlanChangeRequest.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SubscriptionPlanChangeRequestDeleteManyArgs>(args?: SelectSubset<T, SubscriptionPlanChangeRequestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SubscriptionPlanChangeRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPlanChangeRequestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SubscriptionPlanChangeRequests
     * const subscriptionPlanChangeRequest = await prisma.subscriptionPlanChangeRequest.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SubscriptionPlanChangeRequestUpdateManyArgs>(args: SelectSubset<T, SubscriptionPlanChangeRequestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SubscriptionPlanChangeRequests and returns the data updated in the database.
     * @param {SubscriptionPlanChangeRequestUpdateManyAndReturnArgs} args - Arguments to update many SubscriptionPlanChangeRequests.
     * @example
     * // Update many SubscriptionPlanChangeRequests
     * const subscriptionPlanChangeRequest = await prisma.subscriptionPlanChangeRequest.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SubscriptionPlanChangeRequests and only return the `id`
     * const subscriptionPlanChangeRequestWithIdOnly = await prisma.subscriptionPlanChangeRequest.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SubscriptionPlanChangeRequestUpdateManyAndReturnArgs>(args: SelectSubset<T, SubscriptionPlanChangeRequestUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPlanChangeRequestPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SubscriptionPlanChangeRequest.
     * @param {SubscriptionPlanChangeRequestUpsertArgs} args - Arguments to update or create a SubscriptionPlanChangeRequest.
     * @example
     * // Update or create a SubscriptionPlanChangeRequest
     * const subscriptionPlanChangeRequest = await prisma.subscriptionPlanChangeRequest.upsert({
     *   create: {
     *     // ... data to create a SubscriptionPlanChangeRequest
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SubscriptionPlanChangeRequest we want to update
     *   }
     * })
     */
    upsert<T extends SubscriptionPlanChangeRequestUpsertArgs>(args: SelectSubset<T, SubscriptionPlanChangeRequestUpsertArgs<ExtArgs>>): Prisma__SubscriptionPlanChangeRequestClient<$Result.GetResult<Prisma.$SubscriptionPlanChangeRequestPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SubscriptionPlanChangeRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPlanChangeRequestCountArgs} args - Arguments to filter SubscriptionPlanChangeRequests to count.
     * @example
     * // Count the number of SubscriptionPlanChangeRequests
     * const count = await prisma.subscriptionPlanChangeRequest.count({
     *   where: {
     *     // ... the filter for the SubscriptionPlanChangeRequests we want to count
     *   }
     * })
    **/
    count<T extends SubscriptionPlanChangeRequestCountArgs>(
      args?: Subset<T, SubscriptionPlanChangeRequestCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SubscriptionPlanChangeRequestCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SubscriptionPlanChangeRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPlanChangeRequestAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SubscriptionPlanChangeRequestAggregateArgs>(args: Subset<T, SubscriptionPlanChangeRequestAggregateArgs>): Prisma.PrismaPromise<GetSubscriptionPlanChangeRequestAggregateType<T>>

    /**
     * Group by SubscriptionPlanChangeRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPlanChangeRequestGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SubscriptionPlanChangeRequestGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SubscriptionPlanChangeRequestGroupByArgs['orderBy'] }
        : { orderBy?: SubscriptionPlanChangeRequestGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SubscriptionPlanChangeRequestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubscriptionPlanChangeRequestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SubscriptionPlanChangeRequest model
   */
  readonly fields: SubscriptionPlanChangeRequestFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SubscriptionPlanChangeRequest.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SubscriptionPlanChangeRequestClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    currentSubscription<T extends SubscriptionPlanChangeRequest$currentSubscriptionArgs<ExtArgs> = {}>(args?: Subset<T, SubscriptionPlanChangeRequest$currentSubscriptionArgs<ExtArgs>>): Prisma__TenantSubscriptionClient<$Result.GetResult<Prisma.$TenantSubscriptionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    requestedPlan<T extends SubscriptionPlanDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SubscriptionPlanDefaultArgs<ExtArgs>>): Prisma__SubscriptionPlanClient<$Result.GetResult<Prisma.$SubscriptionPlanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SubscriptionPlanChangeRequest model
   */
  interface SubscriptionPlanChangeRequestFieldRefs {
    readonly id: FieldRef<"SubscriptionPlanChangeRequest", 'Int'>
    readonly tenantId: FieldRef<"SubscriptionPlanChangeRequest", 'Int'>
    readonly currentSubscriptionId: FieldRef<"SubscriptionPlanChangeRequest", 'Int'>
    readonly requestedPlanId: FieldRef<"SubscriptionPlanChangeRequest", 'Int'>
    readonly status: FieldRef<"SubscriptionPlanChangeRequest", 'PlanChangeRequestStatus'>
    readonly message: FieldRef<"SubscriptionPlanChangeRequest", 'String'>
    readonly reviewedNote: FieldRef<"SubscriptionPlanChangeRequest", 'String'>
    readonly createdAt: FieldRef<"SubscriptionPlanChangeRequest", 'DateTime'>
    readonly updatedAt: FieldRef<"SubscriptionPlanChangeRequest", 'DateTime'>
    readonly reviewedAt: FieldRef<"SubscriptionPlanChangeRequest", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SubscriptionPlanChangeRequest findUnique
   */
  export type SubscriptionPlanChangeRequestFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlanChangeRequest
     */
    select?: SubscriptionPlanChangeRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPlanChangeRequest
     */
    omit?: SubscriptionPlanChangeRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPlanChangeRequestInclude<ExtArgs> | null
    /**
     * Filter, which SubscriptionPlanChangeRequest to fetch.
     */
    where: SubscriptionPlanChangeRequestWhereUniqueInput
  }

  /**
   * SubscriptionPlanChangeRequest findUniqueOrThrow
   */
  export type SubscriptionPlanChangeRequestFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlanChangeRequest
     */
    select?: SubscriptionPlanChangeRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPlanChangeRequest
     */
    omit?: SubscriptionPlanChangeRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPlanChangeRequestInclude<ExtArgs> | null
    /**
     * Filter, which SubscriptionPlanChangeRequest to fetch.
     */
    where: SubscriptionPlanChangeRequestWhereUniqueInput
  }

  /**
   * SubscriptionPlanChangeRequest findFirst
   */
  export type SubscriptionPlanChangeRequestFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlanChangeRequest
     */
    select?: SubscriptionPlanChangeRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPlanChangeRequest
     */
    omit?: SubscriptionPlanChangeRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPlanChangeRequestInclude<ExtArgs> | null
    /**
     * Filter, which SubscriptionPlanChangeRequest to fetch.
     */
    where?: SubscriptionPlanChangeRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubscriptionPlanChangeRequests to fetch.
     */
    orderBy?: SubscriptionPlanChangeRequestOrderByWithRelationInput | SubscriptionPlanChangeRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SubscriptionPlanChangeRequests.
     */
    cursor?: SubscriptionPlanChangeRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubscriptionPlanChangeRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubscriptionPlanChangeRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SubscriptionPlanChangeRequests.
     */
    distinct?: SubscriptionPlanChangeRequestScalarFieldEnum | SubscriptionPlanChangeRequestScalarFieldEnum[]
  }

  /**
   * SubscriptionPlanChangeRequest findFirstOrThrow
   */
  export type SubscriptionPlanChangeRequestFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlanChangeRequest
     */
    select?: SubscriptionPlanChangeRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPlanChangeRequest
     */
    omit?: SubscriptionPlanChangeRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPlanChangeRequestInclude<ExtArgs> | null
    /**
     * Filter, which SubscriptionPlanChangeRequest to fetch.
     */
    where?: SubscriptionPlanChangeRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubscriptionPlanChangeRequests to fetch.
     */
    orderBy?: SubscriptionPlanChangeRequestOrderByWithRelationInput | SubscriptionPlanChangeRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SubscriptionPlanChangeRequests.
     */
    cursor?: SubscriptionPlanChangeRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubscriptionPlanChangeRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubscriptionPlanChangeRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SubscriptionPlanChangeRequests.
     */
    distinct?: SubscriptionPlanChangeRequestScalarFieldEnum | SubscriptionPlanChangeRequestScalarFieldEnum[]
  }

  /**
   * SubscriptionPlanChangeRequest findMany
   */
  export type SubscriptionPlanChangeRequestFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlanChangeRequest
     */
    select?: SubscriptionPlanChangeRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPlanChangeRequest
     */
    omit?: SubscriptionPlanChangeRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPlanChangeRequestInclude<ExtArgs> | null
    /**
     * Filter, which SubscriptionPlanChangeRequests to fetch.
     */
    where?: SubscriptionPlanChangeRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubscriptionPlanChangeRequests to fetch.
     */
    orderBy?: SubscriptionPlanChangeRequestOrderByWithRelationInput | SubscriptionPlanChangeRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SubscriptionPlanChangeRequests.
     */
    cursor?: SubscriptionPlanChangeRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubscriptionPlanChangeRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubscriptionPlanChangeRequests.
     */
    skip?: number
    distinct?: SubscriptionPlanChangeRequestScalarFieldEnum | SubscriptionPlanChangeRequestScalarFieldEnum[]
  }

  /**
   * SubscriptionPlanChangeRequest create
   */
  export type SubscriptionPlanChangeRequestCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlanChangeRequest
     */
    select?: SubscriptionPlanChangeRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPlanChangeRequest
     */
    omit?: SubscriptionPlanChangeRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPlanChangeRequestInclude<ExtArgs> | null
    /**
     * The data needed to create a SubscriptionPlanChangeRequest.
     */
    data: XOR<SubscriptionPlanChangeRequestCreateInput, SubscriptionPlanChangeRequestUncheckedCreateInput>
  }

  /**
   * SubscriptionPlanChangeRequest createMany
   */
  export type SubscriptionPlanChangeRequestCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SubscriptionPlanChangeRequests.
     */
    data: SubscriptionPlanChangeRequestCreateManyInput | SubscriptionPlanChangeRequestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SubscriptionPlanChangeRequest createManyAndReturn
   */
  export type SubscriptionPlanChangeRequestCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlanChangeRequest
     */
    select?: SubscriptionPlanChangeRequestSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPlanChangeRequest
     */
    omit?: SubscriptionPlanChangeRequestOmit<ExtArgs> | null
    /**
     * The data used to create many SubscriptionPlanChangeRequests.
     */
    data: SubscriptionPlanChangeRequestCreateManyInput | SubscriptionPlanChangeRequestCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPlanChangeRequestIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SubscriptionPlanChangeRequest update
   */
  export type SubscriptionPlanChangeRequestUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlanChangeRequest
     */
    select?: SubscriptionPlanChangeRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPlanChangeRequest
     */
    omit?: SubscriptionPlanChangeRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPlanChangeRequestInclude<ExtArgs> | null
    /**
     * The data needed to update a SubscriptionPlanChangeRequest.
     */
    data: XOR<SubscriptionPlanChangeRequestUpdateInput, SubscriptionPlanChangeRequestUncheckedUpdateInput>
    /**
     * Choose, which SubscriptionPlanChangeRequest to update.
     */
    where: SubscriptionPlanChangeRequestWhereUniqueInput
  }

  /**
   * SubscriptionPlanChangeRequest updateMany
   */
  export type SubscriptionPlanChangeRequestUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SubscriptionPlanChangeRequests.
     */
    data: XOR<SubscriptionPlanChangeRequestUpdateManyMutationInput, SubscriptionPlanChangeRequestUncheckedUpdateManyInput>
    /**
     * Filter which SubscriptionPlanChangeRequests to update
     */
    where?: SubscriptionPlanChangeRequestWhereInput
    /**
     * Limit how many SubscriptionPlanChangeRequests to update.
     */
    limit?: number
  }

  /**
   * SubscriptionPlanChangeRequest updateManyAndReturn
   */
  export type SubscriptionPlanChangeRequestUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlanChangeRequest
     */
    select?: SubscriptionPlanChangeRequestSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPlanChangeRequest
     */
    omit?: SubscriptionPlanChangeRequestOmit<ExtArgs> | null
    /**
     * The data used to update SubscriptionPlanChangeRequests.
     */
    data: XOR<SubscriptionPlanChangeRequestUpdateManyMutationInput, SubscriptionPlanChangeRequestUncheckedUpdateManyInput>
    /**
     * Filter which SubscriptionPlanChangeRequests to update
     */
    where?: SubscriptionPlanChangeRequestWhereInput
    /**
     * Limit how many SubscriptionPlanChangeRequests to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPlanChangeRequestIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * SubscriptionPlanChangeRequest upsert
   */
  export type SubscriptionPlanChangeRequestUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlanChangeRequest
     */
    select?: SubscriptionPlanChangeRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPlanChangeRequest
     */
    omit?: SubscriptionPlanChangeRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPlanChangeRequestInclude<ExtArgs> | null
    /**
     * The filter to search for the SubscriptionPlanChangeRequest to update in case it exists.
     */
    where: SubscriptionPlanChangeRequestWhereUniqueInput
    /**
     * In case the SubscriptionPlanChangeRequest found by the `where` argument doesn't exist, create a new SubscriptionPlanChangeRequest with this data.
     */
    create: XOR<SubscriptionPlanChangeRequestCreateInput, SubscriptionPlanChangeRequestUncheckedCreateInput>
    /**
     * In case the SubscriptionPlanChangeRequest was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SubscriptionPlanChangeRequestUpdateInput, SubscriptionPlanChangeRequestUncheckedUpdateInput>
  }

  /**
   * SubscriptionPlanChangeRequest delete
   */
  export type SubscriptionPlanChangeRequestDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlanChangeRequest
     */
    select?: SubscriptionPlanChangeRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPlanChangeRequest
     */
    omit?: SubscriptionPlanChangeRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPlanChangeRequestInclude<ExtArgs> | null
    /**
     * Filter which SubscriptionPlanChangeRequest to delete.
     */
    where: SubscriptionPlanChangeRequestWhereUniqueInput
  }

  /**
   * SubscriptionPlanChangeRequest deleteMany
   */
  export type SubscriptionPlanChangeRequestDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SubscriptionPlanChangeRequests to delete
     */
    where?: SubscriptionPlanChangeRequestWhereInput
    /**
     * Limit how many SubscriptionPlanChangeRequests to delete.
     */
    limit?: number
  }

  /**
   * SubscriptionPlanChangeRequest.currentSubscription
   */
  export type SubscriptionPlanChangeRequest$currentSubscriptionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantSubscription
     */
    select?: TenantSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantSubscription
     */
    omit?: TenantSubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantSubscriptionInclude<ExtArgs> | null
    where?: TenantSubscriptionWhereInput
  }

  /**
   * SubscriptionPlanChangeRequest without action
   */
  export type SubscriptionPlanChangeRequestDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlanChangeRequest
     */
    select?: SubscriptionPlanChangeRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPlanChangeRequest
     */
    omit?: SubscriptionPlanChangeRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPlanChangeRequestInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const SuperAdminScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    passwordHash: 'passwordHash',
    createdAt: 'createdAt'
  };

  export type SuperAdminScalarFieldEnum = (typeof SuperAdminScalarFieldEnum)[keyof typeof SuperAdminScalarFieldEnum]


  export const TenantScalarFieldEnum: {
    id: 'id',
    name: 'name',
    subdomain: 'subdomain',
    databaseUrl: 'databaseUrl',
    country: 'country',
    logoUrl: 'logoUrl',
    status: 'status',
    createdAt: 'createdAt'
  };

  export type TenantScalarFieldEnum = (typeof TenantScalarFieldEnum)[keyof typeof TenantScalarFieldEnum]


  export const StaffLoginLookupScalarFieldEnum: {
    id: 'id',
    email: 'email',
    tenantId: 'tenantId',
    staffId: 'staffId'
  };

  export type StaffLoginLookupScalarFieldEnum = (typeof StaffLoginLookupScalarFieldEnum)[keyof typeof StaffLoginLookupScalarFieldEnum]


  export const PasswordResetTokenScalarFieldEnum: {
    id: 'id',
    tokenHash: 'tokenHash',
    email: 'email',
    kind: 'kind',
    tenantId: 'tenantId',
    staffId: 'staffId',
    expiresAt: 'expiresAt',
    usedAt: 'usedAt',
    createdAt: 'createdAt'
  };

  export type PasswordResetTokenScalarFieldEnum = (typeof PasswordResetTokenScalarFieldEnum)[keyof typeof PasswordResetTokenScalarFieldEnum]


  export const FiskalyPlatformConfigScalarFieldEnum: {
    id: 'id',
    apiKey: 'apiKey',
    tssId: 'tssId',
    clientId: 'clientId',
    adminPuk: 'adminPuk',
    updatedAt: 'updatedAt'
  };

  export type FiskalyPlatformConfigScalarFieldEnum = (typeof FiskalyPlatformConfigScalarFieldEnum)[keyof typeof FiskalyPlatformConfigScalarFieldEnum]


  export const SubscriptionPlanScalarFieldEnum: {
    id: 'id',
    code: 'code',
    name: 'name',
    description: 'description',
    billingInterval: 'billingInterval',
    monthlyPrice: 'monthlyPrice',
    commissionPercent: 'commissionPercent',
    trialDays: 'trialDays',
    graceDays: 'graceDays',
    sortOrder: 'sortOrder',
    features: 'features'
  };

  export type SubscriptionPlanScalarFieldEnum = (typeof SubscriptionPlanScalarFieldEnum)[keyof typeof SubscriptionPlanScalarFieldEnum]


  export const TenantSubscriptionScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    planId: 'planId',
    status: 'status',
    startDate: 'startDate',
    endDate: 'endDate',
    trialStartDate: 'trialStartDate',
    trialEndDate: 'trialEndDate',
    gracePeriodEndsAt: 'gracePeriodEndsAt',
    nextBillingDate: 'nextBillingDate',
    autoRenew: 'autoRenew',
    cancelAtPeriodEnd: 'cancelAtPeriodEnd',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TenantSubscriptionScalarFieldEnum = (typeof TenantSubscriptionScalarFieldEnum)[keyof typeof TenantSubscriptionScalarFieldEnum]


  export const BillingInvoiceScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    subscriptionId: 'subscriptionId',
    planId: 'planId',
    invoiceNumber: 'invoiceNumber',
    status: 'status',
    issuedAt: 'issuedAt',
    dueDate: 'dueDate',
    periodStart: 'periodStart',
    periodEnd: 'periodEnd',
    subtotal: 'subtotal',
    taxAmount: 'taxAmount',
    totalAmount: 'totalAmount',
    currency: 'currency',
    lineItems: 'lineItems',
    notes: 'notes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type BillingInvoiceScalarFieldEnum = (typeof BillingInvoiceScalarFieldEnum)[keyof typeof BillingInvoiceScalarFieldEnum]


  export const BillingPaymentScalarFieldEnum: {
    id: 'id',
    invoiceId: 'invoiceId',
    tenantId: 'tenantId',
    amount: 'amount',
    method: 'method',
    status: 'status',
    paidAt: 'paidAt',
    reference: 'reference',
    notes: 'notes',
    createdAt: 'createdAt'
  };

  export type BillingPaymentScalarFieldEnum = (typeof BillingPaymentScalarFieldEnum)[keyof typeof BillingPaymentScalarFieldEnum]


  export const SubscriptionPlanChangeRequestScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    currentSubscriptionId: 'currentSubscriptionId',
    requestedPlanId: 'requestedPlanId',
    status: 'status',
    message: 'message',
    reviewedNote: 'reviewedNote',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    reviewedAt: 'reviewedAt'
  };

  export type SubscriptionPlanChangeRequestScalarFieldEnum = (typeof SubscriptionPlanChangeRequestScalarFieldEnum)[keyof typeof SubscriptionPlanChangeRequestScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'TenantStatus'
   */
  export type EnumTenantStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TenantStatus'>
    


  /**
   * Reference to a field of type 'TenantStatus[]'
   */
  export type ListEnumTenantStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TenantStatus[]'>
    


  /**
   * Reference to a field of type 'BillingInterval'
   */
  export type EnumBillingIntervalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BillingInterval'>
    


  /**
   * Reference to a field of type 'BillingInterval[]'
   */
  export type ListEnumBillingIntervalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BillingInterval[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'SubscriptionStatus'
   */
  export type EnumSubscriptionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SubscriptionStatus'>
    


  /**
   * Reference to a field of type 'SubscriptionStatus[]'
   */
  export type ListEnumSubscriptionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SubscriptionStatus[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'BillingInvoiceStatus'
   */
  export type EnumBillingInvoiceStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BillingInvoiceStatus'>
    


  /**
   * Reference to a field of type 'BillingInvoiceStatus[]'
   */
  export type ListEnumBillingInvoiceStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BillingInvoiceStatus[]'>
    


  /**
   * Reference to a field of type 'BillingPaymentMethod'
   */
  export type EnumBillingPaymentMethodFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BillingPaymentMethod'>
    


  /**
   * Reference to a field of type 'BillingPaymentMethod[]'
   */
  export type ListEnumBillingPaymentMethodFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BillingPaymentMethod[]'>
    


  /**
   * Reference to a field of type 'BillingPaymentStatus'
   */
  export type EnumBillingPaymentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BillingPaymentStatus'>
    


  /**
   * Reference to a field of type 'BillingPaymentStatus[]'
   */
  export type ListEnumBillingPaymentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BillingPaymentStatus[]'>
    


  /**
   * Reference to a field of type 'PlanChangeRequestStatus'
   */
  export type EnumPlanChangeRequestStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PlanChangeRequestStatus'>
    


  /**
   * Reference to a field of type 'PlanChangeRequestStatus[]'
   */
  export type ListEnumPlanChangeRequestStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PlanChangeRequestStatus[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type SuperAdminWhereInput = {
    AND?: SuperAdminWhereInput | SuperAdminWhereInput[]
    OR?: SuperAdminWhereInput[]
    NOT?: SuperAdminWhereInput | SuperAdminWhereInput[]
    id?: IntFilter<"SuperAdmin"> | number
    name?: StringFilter<"SuperAdmin"> | string
    email?: StringFilter<"SuperAdmin"> | string
    passwordHash?: StringFilter<"SuperAdmin"> | string
    createdAt?: DateTimeFilter<"SuperAdmin"> | Date | string
  }

  export type SuperAdminOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    createdAt?: SortOrder
  }

  export type SuperAdminWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    email?: string
    AND?: SuperAdminWhereInput | SuperAdminWhereInput[]
    OR?: SuperAdminWhereInput[]
    NOT?: SuperAdminWhereInput | SuperAdminWhereInput[]
    name?: StringFilter<"SuperAdmin"> | string
    passwordHash?: StringFilter<"SuperAdmin"> | string
    createdAt?: DateTimeFilter<"SuperAdmin"> | Date | string
  }, "id" | "email">

  export type SuperAdminOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    createdAt?: SortOrder
    _count?: SuperAdminCountOrderByAggregateInput
    _avg?: SuperAdminAvgOrderByAggregateInput
    _max?: SuperAdminMaxOrderByAggregateInput
    _min?: SuperAdminMinOrderByAggregateInput
    _sum?: SuperAdminSumOrderByAggregateInput
  }

  export type SuperAdminScalarWhereWithAggregatesInput = {
    AND?: SuperAdminScalarWhereWithAggregatesInput | SuperAdminScalarWhereWithAggregatesInput[]
    OR?: SuperAdminScalarWhereWithAggregatesInput[]
    NOT?: SuperAdminScalarWhereWithAggregatesInput | SuperAdminScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"SuperAdmin"> | number
    name?: StringWithAggregatesFilter<"SuperAdmin"> | string
    email?: StringWithAggregatesFilter<"SuperAdmin"> | string
    passwordHash?: StringWithAggregatesFilter<"SuperAdmin"> | string
    createdAt?: DateTimeWithAggregatesFilter<"SuperAdmin"> | Date | string
  }

  export type TenantWhereInput = {
    AND?: TenantWhereInput | TenantWhereInput[]
    OR?: TenantWhereInput[]
    NOT?: TenantWhereInput | TenantWhereInput[]
    id?: IntFilter<"Tenant"> | number
    name?: StringFilter<"Tenant"> | string
    subdomain?: StringFilter<"Tenant"> | string
    databaseUrl?: StringNullableFilter<"Tenant"> | string | null
    country?: StringFilter<"Tenant"> | string
    logoUrl?: StringNullableFilter<"Tenant"> | string | null
    status?: EnumTenantStatusFilter<"Tenant"> | $Enums.TenantStatus
    createdAt?: DateTimeFilter<"Tenant"> | Date | string
    staffLoginLookups?: StaffLoginLookupListRelationFilter
    subscription?: TenantSubscriptionListRelationFilter
    billingInvoices?: BillingInvoiceListRelationFilter
    billingPayments?: BillingPaymentListRelationFilter
    planChangeRequests?: SubscriptionPlanChangeRequestListRelationFilter
  }

  export type TenantOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    subdomain?: SortOrder
    databaseUrl?: SortOrderInput | SortOrder
    country?: SortOrder
    logoUrl?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    staffLoginLookups?: StaffLoginLookupOrderByRelationAggregateInput
    subscription?: TenantSubscriptionOrderByRelationAggregateInput
    billingInvoices?: BillingInvoiceOrderByRelationAggregateInput
    billingPayments?: BillingPaymentOrderByRelationAggregateInput
    planChangeRequests?: SubscriptionPlanChangeRequestOrderByRelationAggregateInput
  }

  export type TenantWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    subdomain?: string
    AND?: TenantWhereInput | TenantWhereInput[]
    OR?: TenantWhereInput[]
    NOT?: TenantWhereInput | TenantWhereInput[]
    name?: StringFilter<"Tenant"> | string
    databaseUrl?: StringNullableFilter<"Tenant"> | string | null
    country?: StringFilter<"Tenant"> | string
    logoUrl?: StringNullableFilter<"Tenant"> | string | null
    status?: EnumTenantStatusFilter<"Tenant"> | $Enums.TenantStatus
    createdAt?: DateTimeFilter<"Tenant"> | Date | string
    staffLoginLookups?: StaffLoginLookupListRelationFilter
    subscription?: TenantSubscriptionListRelationFilter
    billingInvoices?: BillingInvoiceListRelationFilter
    billingPayments?: BillingPaymentListRelationFilter
    planChangeRequests?: SubscriptionPlanChangeRequestListRelationFilter
  }, "id" | "subdomain">

  export type TenantOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    subdomain?: SortOrder
    databaseUrl?: SortOrderInput | SortOrder
    country?: SortOrder
    logoUrl?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    _count?: TenantCountOrderByAggregateInput
    _avg?: TenantAvgOrderByAggregateInput
    _max?: TenantMaxOrderByAggregateInput
    _min?: TenantMinOrderByAggregateInput
    _sum?: TenantSumOrderByAggregateInput
  }

  export type TenantScalarWhereWithAggregatesInput = {
    AND?: TenantScalarWhereWithAggregatesInput | TenantScalarWhereWithAggregatesInput[]
    OR?: TenantScalarWhereWithAggregatesInput[]
    NOT?: TenantScalarWhereWithAggregatesInput | TenantScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Tenant"> | number
    name?: StringWithAggregatesFilter<"Tenant"> | string
    subdomain?: StringWithAggregatesFilter<"Tenant"> | string
    databaseUrl?: StringNullableWithAggregatesFilter<"Tenant"> | string | null
    country?: StringWithAggregatesFilter<"Tenant"> | string
    logoUrl?: StringNullableWithAggregatesFilter<"Tenant"> | string | null
    status?: EnumTenantStatusWithAggregatesFilter<"Tenant"> | $Enums.TenantStatus
    createdAt?: DateTimeWithAggregatesFilter<"Tenant"> | Date | string
  }

  export type StaffLoginLookupWhereInput = {
    AND?: StaffLoginLookupWhereInput | StaffLoginLookupWhereInput[]
    OR?: StaffLoginLookupWhereInput[]
    NOT?: StaffLoginLookupWhereInput | StaffLoginLookupWhereInput[]
    id?: IntFilter<"StaffLoginLookup"> | number
    email?: StringFilter<"StaffLoginLookup"> | string
    tenantId?: IntFilter<"StaffLoginLookup"> | number
    staffId?: IntFilter<"StaffLoginLookup"> | number
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }

  export type StaffLoginLookupOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    tenantId?: SortOrder
    staffId?: SortOrder
    tenant?: TenantOrderByWithRelationInput
  }

  export type StaffLoginLookupWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    email_tenantId?: StaffLoginLookupEmailTenantIdCompoundUniqueInput
    AND?: StaffLoginLookupWhereInput | StaffLoginLookupWhereInput[]
    OR?: StaffLoginLookupWhereInput[]
    NOT?: StaffLoginLookupWhereInput | StaffLoginLookupWhereInput[]
    email?: StringFilter<"StaffLoginLookup"> | string
    tenantId?: IntFilter<"StaffLoginLookup"> | number
    staffId?: IntFilter<"StaffLoginLookup"> | number
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }, "id" | "email_tenantId">

  export type StaffLoginLookupOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    tenantId?: SortOrder
    staffId?: SortOrder
    _count?: StaffLoginLookupCountOrderByAggregateInput
    _avg?: StaffLoginLookupAvgOrderByAggregateInput
    _max?: StaffLoginLookupMaxOrderByAggregateInput
    _min?: StaffLoginLookupMinOrderByAggregateInput
    _sum?: StaffLoginLookupSumOrderByAggregateInput
  }

  export type StaffLoginLookupScalarWhereWithAggregatesInput = {
    AND?: StaffLoginLookupScalarWhereWithAggregatesInput | StaffLoginLookupScalarWhereWithAggregatesInput[]
    OR?: StaffLoginLookupScalarWhereWithAggregatesInput[]
    NOT?: StaffLoginLookupScalarWhereWithAggregatesInput | StaffLoginLookupScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"StaffLoginLookup"> | number
    email?: StringWithAggregatesFilter<"StaffLoginLookup"> | string
    tenantId?: IntWithAggregatesFilter<"StaffLoginLookup"> | number
    staffId?: IntWithAggregatesFilter<"StaffLoginLookup"> | number
  }

  export type PasswordResetTokenWhereInput = {
    AND?: PasswordResetTokenWhereInput | PasswordResetTokenWhereInput[]
    OR?: PasswordResetTokenWhereInput[]
    NOT?: PasswordResetTokenWhereInput | PasswordResetTokenWhereInput[]
    id?: IntFilter<"PasswordResetToken"> | number
    tokenHash?: StringFilter<"PasswordResetToken"> | string
    email?: StringFilter<"PasswordResetToken"> | string
    kind?: StringFilter<"PasswordResetToken"> | string
    tenantId?: IntNullableFilter<"PasswordResetToken"> | number | null
    staffId?: IntNullableFilter<"PasswordResetToken"> | number | null
    expiresAt?: DateTimeFilter<"PasswordResetToken"> | Date | string
    usedAt?: DateTimeNullableFilter<"PasswordResetToken"> | Date | string | null
    createdAt?: DateTimeFilter<"PasswordResetToken"> | Date | string
  }

  export type PasswordResetTokenOrderByWithRelationInput = {
    id?: SortOrder
    tokenHash?: SortOrder
    email?: SortOrder
    kind?: SortOrder
    tenantId?: SortOrderInput | SortOrder
    staffId?: SortOrderInput | SortOrder
    expiresAt?: SortOrder
    usedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type PasswordResetTokenWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    tokenHash?: string
    AND?: PasswordResetTokenWhereInput | PasswordResetTokenWhereInput[]
    OR?: PasswordResetTokenWhereInput[]
    NOT?: PasswordResetTokenWhereInput | PasswordResetTokenWhereInput[]
    email?: StringFilter<"PasswordResetToken"> | string
    kind?: StringFilter<"PasswordResetToken"> | string
    tenantId?: IntNullableFilter<"PasswordResetToken"> | number | null
    staffId?: IntNullableFilter<"PasswordResetToken"> | number | null
    expiresAt?: DateTimeFilter<"PasswordResetToken"> | Date | string
    usedAt?: DateTimeNullableFilter<"PasswordResetToken"> | Date | string | null
    createdAt?: DateTimeFilter<"PasswordResetToken"> | Date | string
  }, "id" | "tokenHash">

  export type PasswordResetTokenOrderByWithAggregationInput = {
    id?: SortOrder
    tokenHash?: SortOrder
    email?: SortOrder
    kind?: SortOrder
    tenantId?: SortOrderInput | SortOrder
    staffId?: SortOrderInput | SortOrder
    expiresAt?: SortOrder
    usedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: PasswordResetTokenCountOrderByAggregateInput
    _avg?: PasswordResetTokenAvgOrderByAggregateInput
    _max?: PasswordResetTokenMaxOrderByAggregateInput
    _min?: PasswordResetTokenMinOrderByAggregateInput
    _sum?: PasswordResetTokenSumOrderByAggregateInput
  }

  export type PasswordResetTokenScalarWhereWithAggregatesInput = {
    AND?: PasswordResetTokenScalarWhereWithAggregatesInput | PasswordResetTokenScalarWhereWithAggregatesInput[]
    OR?: PasswordResetTokenScalarWhereWithAggregatesInput[]
    NOT?: PasswordResetTokenScalarWhereWithAggregatesInput | PasswordResetTokenScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"PasswordResetToken"> | number
    tokenHash?: StringWithAggregatesFilter<"PasswordResetToken"> | string
    email?: StringWithAggregatesFilter<"PasswordResetToken"> | string
    kind?: StringWithAggregatesFilter<"PasswordResetToken"> | string
    tenantId?: IntNullableWithAggregatesFilter<"PasswordResetToken"> | number | null
    staffId?: IntNullableWithAggregatesFilter<"PasswordResetToken"> | number | null
    expiresAt?: DateTimeWithAggregatesFilter<"PasswordResetToken"> | Date | string
    usedAt?: DateTimeNullableWithAggregatesFilter<"PasswordResetToken"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"PasswordResetToken"> | Date | string
  }

  export type FiskalyPlatformConfigWhereInput = {
    AND?: FiskalyPlatformConfigWhereInput | FiskalyPlatformConfigWhereInput[]
    OR?: FiskalyPlatformConfigWhereInput[]
    NOT?: FiskalyPlatformConfigWhereInput | FiskalyPlatformConfigWhereInput[]
    id?: IntFilter<"FiskalyPlatformConfig"> | number
    apiKey?: StringFilter<"FiskalyPlatformConfig"> | string
    tssId?: StringFilter<"FiskalyPlatformConfig"> | string
    clientId?: StringFilter<"FiskalyPlatformConfig"> | string
    adminPuk?: StringNullableFilter<"FiskalyPlatformConfig"> | string | null
    updatedAt?: DateTimeFilter<"FiskalyPlatformConfig"> | Date | string
  }

  export type FiskalyPlatformConfigOrderByWithRelationInput = {
    id?: SortOrder
    apiKey?: SortOrder
    tssId?: SortOrder
    clientId?: SortOrder
    adminPuk?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
  }

  export type FiskalyPlatformConfigWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    apiKey?: string
    AND?: FiskalyPlatformConfigWhereInput | FiskalyPlatformConfigWhereInput[]
    OR?: FiskalyPlatformConfigWhereInput[]
    NOT?: FiskalyPlatformConfigWhereInput | FiskalyPlatformConfigWhereInput[]
    tssId?: StringFilter<"FiskalyPlatformConfig"> | string
    clientId?: StringFilter<"FiskalyPlatformConfig"> | string
    adminPuk?: StringNullableFilter<"FiskalyPlatformConfig"> | string | null
    updatedAt?: DateTimeFilter<"FiskalyPlatformConfig"> | Date | string
  }, "id" | "apiKey">

  export type FiskalyPlatformConfigOrderByWithAggregationInput = {
    id?: SortOrder
    apiKey?: SortOrder
    tssId?: SortOrder
    clientId?: SortOrder
    adminPuk?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    _count?: FiskalyPlatformConfigCountOrderByAggregateInput
    _avg?: FiskalyPlatformConfigAvgOrderByAggregateInput
    _max?: FiskalyPlatformConfigMaxOrderByAggregateInput
    _min?: FiskalyPlatformConfigMinOrderByAggregateInput
    _sum?: FiskalyPlatformConfigSumOrderByAggregateInput
  }

  export type FiskalyPlatformConfigScalarWhereWithAggregatesInput = {
    AND?: FiskalyPlatformConfigScalarWhereWithAggregatesInput | FiskalyPlatformConfigScalarWhereWithAggregatesInput[]
    OR?: FiskalyPlatformConfigScalarWhereWithAggregatesInput[]
    NOT?: FiskalyPlatformConfigScalarWhereWithAggregatesInput | FiskalyPlatformConfigScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"FiskalyPlatformConfig"> | number
    apiKey?: StringWithAggregatesFilter<"FiskalyPlatformConfig"> | string
    tssId?: StringWithAggregatesFilter<"FiskalyPlatformConfig"> | string
    clientId?: StringWithAggregatesFilter<"FiskalyPlatformConfig"> | string
    adminPuk?: StringNullableWithAggregatesFilter<"FiskalyPlatformConfig"> | string | null
    updatedAt?: DateTimeWithAggregatesFilter<"FiskalyPlatformConfig"> | Date | string
  }

  export type SubscriptionPlanWhereInput = {
    AND?: SubscriptionPlanWhereInput | SubscriptionPlanWhereInput[]
    OR?: SubscriptionPlanWhereInput[]
    NOT?: SubscriptionPlanWhereInput | SubscriptionPlanWhereInput[]
    id?: IntFilter<"SubscriptionPlan"> | number
    code?: StringNullableFilter<"SubscriptionPlan"> | string | null
    name?: StringFilter<"SubscriptionPlan"> | string
    description?: StringNullableFilter<"SubscriptionPlan"> | string | null
    billingInterval?: EnumBillingIntervalFilter<"SubscriptionPlan"> | $Enums.BillingInterval
    monthlyPrice?: DecimalFilter<"SubscriptionPlan"> | Decimal | DecimalJsLike | number | string
    commissionPercent?: DecimalFilter<"SubscriptionPlan"> | Decimal | DecimalJsLike | number | string
    trialDays?: IntFilter<"SubscriptionPlan"> | number
    graceDays?: IntFilter<"SubscriptionPlan"> | number
    sortOrder?: IntFilter<"SubscriptionPlan"> | number
    features?: JsonFilter<"SubscriptionPlan">
    tenantSubscriptions?: TenantSubscriptionListRelationFilter
    invoices?: BillingInvoiceListRelationFilter
    requestedChanges?: SubscriptionPlanChangeRequestListRelationFilter
  }

  export type SubscriptionPlanOrderByWithRelationInput = {
    id?: SortOrder
    code?: SortOrderInput | SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    billingInterval?: SortOrder
    monthlyPrice?: SortOrder
    commissionPercent?: SortOrder
    trialDays?: SortOrder
    graceDays?: SortOrder
    sortOrder?: SortOrder
    features?: SortOrder
    tenantSubscriptions?: TenantSubscriptionOrderByRelationAggregateInput
    invoices?: BillingInvoiceOrderByRelationAggregateInput
    requestedChanges?: SubscriptionPlanChangeRequestOrderByRelationAggregateInput
  }

  export type SubscriptionPlanWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    code?: string
    AND?: SubscriptionPlanWhereInput | SubscriptionPlanWhereInput[]
    OR?: SubscriptionPlanWhereInput[]
    NOT?: SubscriptionPlanWhereInput | SubscriptionPlanWhereInput[]
    name?: StringFilter<"SubscriptionPlan"> | string
    description?: StringNullableFilter<"SubscriptionPlan"> | string | null
    billingInterval?: EnumBillingIntervalFilter<"SubscriptionPlan"> | $Enums.BillingInterval
    monthlyPrice?: DecimalFilter<"SubscriptionPlan"> | Decimal | DecimalJsLike | number | string
    commissionPercent?: DecimalFilter<"SubscriptionPlan"> | Decimal | DecimalJsLike | number | string
    trialDays?: IntFilter<"SubscriptionPlan"> | number
    graceDays?: IntFilter<"SubscriptionPlan"> | number
    sortOrder?: IntFilter<"SubscriptionPlan"> | number
    features?: JsonFilter<"SubscriptionPlan">
    tenantSubscriptions?: TenantSubscriptionListRelationFilter
    invoices?: BillingInvoiceListRelationFilter
    requestedChanges?: SubscriptionPlanChangeRequestListRelationFilter
  }, "id" | "code">

  export type SubscriptionPlanOrderByWithAggregationInput = {
    id?: SortOrder
    code?: SortOrderInput | SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    billingInterval?: SortOrder
    monthlyPrice?: SortOrder
    commissionPercent?: SortOrder
    trialDays?: SortOrder
    graceDays?: SortOrder
    sortOrder?: SortOrder
    features?: SortOrder
    _count?: SubscriptionPlanCountOrderByAggregateInput
    _avg?: SubscriptionPlanAvgOrderByAggregateInput
    _max?: SubscriptionPlanMaxOrderByAggregateInput
    _min?: SubscriptionPlanMinOrderByAggregateInput
    _sum?: SubscriptionPlanSumOrderByAggregateInput
  }

  export type SubscriptionPlanScalarWhereWithAggregatesInput = {
    AND?: SubscriptionPlanScalarWhereWithAggregatesInput | SubscriptionPlanScalarWhereWithAggregatesInput[]
    OR?: SubscriptionPlanScalarWhereWithAggregatesInput[]
    NOT?: SubscriptionPlanScalarWhereWithAggregatesInput | SubscriptionPlanScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"SubscriptionPlan"> | number
    code?: StringNullableWithAggregatesFilter<"SubscriptionPlan"> | string | null
    name?: StringWithAggregatesFilter<"SubscriptionPlan"> | string
    description?: StringNullableWithAggregatesFilter<"SubscriptionPlan"> | string | null
    billingInterval?: EnumBillingIntervalWithAggregatesFilter<"SubscriptionPlan"> | $Enums.BillingInterval
    monthlyPrice?: DecimalWithAggregatesFilter<"SubscriptionPlan"> | Decimal | DecimalJsLike | number | string
    commissionPercent?: DecimalWithAggregatesFilter<"SubscriptionPlan"> | Decimal | DecimalJsLike | number | string
    trialDays?: IntWithAggregatesFilter<"SubscriptionPlan"> | number
    graceDays?: IntWithAggregatesFilter<"SubscriptionPlan"> | number
    sortOrder?: IntWithAggregatesFilter<"SubscriptionPlan"> | number
    features?: JsonWithAggregatesFilter<"SubscriptionPlan">
  }

  export type TenantSubscriptionWhereInput = {
    AND?: TenantSubscriptionWhereInput | TenantSubscriptionWhereInput[]
    OR?: TenantSubscriptionWhereInput[]
    NOT?: TenantSubscriptionWhereInput | TenantSubscriptionWhereInput[]
    id?: IntFilter<"TenantSubscription"> | number
    tenantId?: IntFilter<"TenantSubscription"> | number
    planId?: IntFilter<"TenantSubscription"> | number
    status?: EnumSubscriptionStatusFilter<"TenantSubscription"> | $Enums.SubscriptionStatus
    startDate?: DateTimeFilter<"TenantSubscription"> | Date | string
    endDate?: DateTimeFilter<"TenantSubscription"> | Date | string
    trialStartDate?: DateTimeNullableFilter<"TenantSubscription"> | Date | string | null
    trialEndDate?: DateTimeNullableFilter<"TenantSubscription"> | Date | string | null
    gracePeriodEndsAt?: DateTimeNullableFilter<"TenantSubscription"> | Date | string | null
    nextBillingDate?: DateTimeNullableFilter<"TenantSubscription"> | Date | string | null
    autoRenew?: BoolFilter<"TenantSubscription"> | boolean
    cancelAtPeriodEnd?: BoolFilter<"TenantSubscription"> | boolean
    createdAt?: DateTimeFilter<"TenantSubscription"> | Date | string
    updatedAt?: DateTimeFilter<"TenantSubscription"> | Date | string
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
    plan?: XOR<SubscriptionPlanScalarRelationFilter, SubscriptionPlanWhereInput>
    invoices?: BillingInvoiceListRelationFilter
    planChangeRequests?: SubscriptionPlanChangeRequestListRelationFilter
  }

  export type TenantSubscriptionOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    planId?: SortOrder
    status?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    trialStartDate?: SortOrderInput | SortOrder
    trialEndDate?: SortOrderInput | SortOrder
    gracePeriodEndsAt?: SortOrderInput | SortOrder
    nextBillingDate?: SortOrderInput | SortOrder
    autoRenew?: SortOrder
    cancelAtPeriodEnd?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    tenant?: TenantOrderByWithRelationInput
    plan?: SubscriptionPlanOrderByWithRelationInput
    invoices?: BillingInvoiceOrderByRelationAggregateInput
    planChangeRequests?: SubscriptionPlanChangeRequestOrderByRelationAggregateInput
  }

  export type TenantSubscriptionWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: TenantSubscriptionWhereInput | TenantSubscriptionWhereInput[]
    OR?: TenantSubscriptionWhereInput[]
    NOT?: TenantSubscriptionWhereInput | TenantSubscriptionWhereInput[]
    tenantId?: IntFilter<"TenantSubscription"> | number
    planId?: IntFilter<"TenantSubscription"> | number
    status?: EnumSubscriptionStatusFilter<"TenantSubscription"> | $Enums.SubscriptionStatus
    startDate?: DateTimeFilter<"TenantSubscription"> | Date | string
    endDate?: DateTimeFilter<"TenantSubscription"> | Date | string
    trialStartDate?: DateTimeNullableFilter<"TenantSubscription"> | Date | string | null
    trialEndDate?: DateTimeNullableFilter<"TenantSubscription"> | Date | string | null
    gracePeriodEndsAt?: DateTimeNullableFilter<"TenantSubscription"> | Date | string | null
    nextBillingDate?: DateTimeNullableFilter<"TenantSubscription"> | Date | string | null
    autoRenew?: BoolFilter<"TenantSubscription"> | boolean
    cancelAtPeriodEnd?: BoolFilter<"TenantSubscription"> | boolean
    createdAt?: DateTimeFilter<"TenantSubscription"> | Date | string
    updatedAt?: DateTimeFilter<"TenantSubscription"> | Date | string
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
    plan?: XOR<SubscriptionPlanScalarRelationFilter, SubscriptionPlanWhereInput>
    invoices?: BillingInvoiceListRelationFilter
    planChangeRequests?: SubscriptionPlanChangeRequestListRelationFilter
  }, "id">

  export type TenantSubscriptionOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    planId?: SortOrder
    status?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    trialStartDate?: SortOrderInput | SortOrder
    trialEndDate?: SortOrderInput | SortOrder
    gracePeriodEndsAt?: SortOrderInput | SortOrder
    nextBillingDate?: SortOrderInput | SortOrder
    autoRenew?: SortOrder
    cancelAtPeriodEnd?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TenantSubscriptionCountOrderByAggregateInput
    _avg?: TenantSubscriptionAvgOrderByAggregateInput
    _max?: TenantSubscriptionMaxOrderByAggregateInput
    _min?: TenantSubscriptionMinOrderByAggregateInput
    _sum?: TenantSubscriptionSumOrderByAggregateInput
  }

  export type TenantSubscriptionScalarWhereWithAggregatesInput = {
    AND?: TenantSubscriptionScalarWhereWithAggregatesInput | TenantSubscriptionScalarWhereWithAggregatesInput[]
    OR?: TenantSubscriptionScalarWhereWithAggregatesInput[]
    NOT?: TenantSubscriptionScalarWhereWithAggregatesInput | TenantSubscriptionScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"TenantSubscription"> | number
    tenantId?: IntWithAggregatesFilter<"TenantSubscription"> | number
    planId?: IntWithAggregatesFilter<"TenantSubscription"> | number
    status?: EnumSubscriptionStatusWithAggregatesFilter<"TenantSubscription"> | $Enums.SubscriptionStatus
    startDate?: DateTimeWithAggregatesFilter<"TenantSubscription"> | Date | string
    endDate?: DateTimeWithAggregatesFilter<"TenantSubscription"> | Date | string
    trialStartDate?: DateTimeNullableWithAggregatesFilter<"TenantSubscription"> | Date | string | null
    trialEndDate?: DateTimeNullableWithAggregatesFilter<"TenantSubscription"> | Date | string | null
    gracePeriodEndsAt?: DateTimeNullableWithAggregatesFilter<"TenantSubscription"> | Date | string | null
    nextBillingDate?: DateTimeNullableWithAggregatesFilter<"TenantSubscription"> | Date | string | null
    autoRenew?: BoolWithAggregatesFilter<"TenantSubscription"> | boolean
    cancelAtPeriodEnd?: BoolWithAggregatesFilter<"TenantSubscription"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"TenantSubscription"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"TenantSubscription"> | Date | string
  }

  export type BillingInvoiceWhereInput = {
    AND?: BillingInvoiceWhereInput | BillingInvoiceWhereInput[]
    OR?: BillingInvoiceWhereInput[]
    NOT?: BillingInvoiceWhereInput | BillingInvoiceWhereInput[]
    id?: IntFilter<"BillingInvoice"> | number
    tenantId?: IntFilter<"BillingInvoice"> | number
    subscriptionId?: IntFilter<"BillingInvoice"> | number
    planId?: IntFilter<"BillingInvoice"> | number
    invoiceNumber?: StringFilter<"BillingInvoice"> | string
    status?: EnumBillingInvoiceStatusFilter<"BillingInvoice"> | $Enums.BillingInvoiceStatus
    issuedAt?: DateTimeFilter<"BillingInvoice"> | Date | string
    dueDate?: DateTimeFilter<"BillingInvoice"> | Date | string
    periodStart?: DateTimeFilter<"BillingInvoice"> | Date | string
    periodEnd?: DateTimeFilter<"BillingInvoice"> | Date | string
    subtotal?: DecimalFilter<"BillingInvoice"> | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalFilter<"BillingInvoice"> | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFilter<"BillingInvoice"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"BillingInvoice"> | string
    lineItems?: JsonFilter<"BillingInvoice">
    notes?: StringNullableFilter<"BillingInvoice"> | string | null
    createdAt?: DateTimeFilter<"BillingInvoice"> | Date | string
    updatedAt?: DateTimeFilter<"BillingInvoice"> | Date | string
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
    subscription?: XOR<TenantSubscriptionScalarRelationFilter, TenantSubscriptionWhereInput>
    plan?: XOR<SubscriptionPlanScalarRelationFilter, SubscriptionPlanWhereInput>
    payments?: BillingPaymentListRelationFilter
  }

  export type BillingInvoiceOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    subscriptionId?: SortOrder
    planId?: SortOrder
    invoiceNumber?: SortOrder
    status?: SortOrder
    issuedAt?: SortOrder
    dueDate?: SortOrder
    periodStart?: SortOrder
    periodEnd?: SortOrder
    subtotal?: SortOrder
    taxAmount?: SortOrder
    totalAmount?: SortOrder
    currency?: SortOrder
    lineItems?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    tenant?: TenantOrderByWithRelationInput
    subscription?: TenantSubscriptionOrderByWithRelationInput
    plan?: SubscriptionPlanOrderByWithRelationInput
    payments?: BillingPaymentOrderByRelationAggregateInput
  }

  export type BillingInvoiceWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    invoiceNumber?: string
    AND?: BillingInvoiceWhereInput | BillingInvoiceWhereInput[]
    OR?: BillingInvoiceWhereInput[]
    NOT?: BillingInvoiceWhereInput | BillingInvoiceWhereInput[]
    tenantId?: IntFilter<"BillingInvoice"> | number
    subscriptionId?: IntFilter<"BillingInvoice"> | number
    planId?: IntFilter<"BillingInvoice"> | number
    status?: EnumBillingInvoiceStatusFilter<"BillingInvoice"> | $Enums.BillingInvoiceStatus
    issuedAt?: DateTimeFilter<"BillingInvoice"> | Date | string
    dueDate?: DateTimeFilter<"BillingInvoice"> | Date | string
    periodStart?: DateTimeFilter<"BillingInvoice"> | Date | string
    periodEnd?: DateTimeFilter<"BillingInvoice"> | Date | string
    subtotal?: DecimalFilter<"BillingInvoice"> | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalFilter<"BillingInvoice"> | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFilter<"BillingInvoice"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"BillingInvoice"> | string
    lineItems?: JsonFilter<"BillingInvoice">
    notes?: StringNullableFilter<"BillingInvoice"> | string | null
    createdAt?: DateTimeFilter<"BillingInvoice"> | Date | string
    updatedAt?: DateTimeFilter<"BillingInvoice"> | Date | string
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
    subscription?: XOR<TenantSubscriptionScalarRelationFilter, TenantSubscriptionWhereInput>
    plan?: XOR<SubscriptionPlanScalarRelationFilter, SubscriptionPlanWhereInput>
    payments?: BillingPaymentListRelationFilter
  }, "id" | "invoiceNumber">

  export type BillingInvoiceOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    subscriptionId?: SortOrder
    planId?: SortOrder
    invoiceNumber?: SortOrder
    status?: SortOrder
    issuedAt?: SortOrder
    dueDate?: SortOrder
    periodStart?: SortOrder
    periodEnd?: SortOrder
    subtotal?: SortOrder
    taxAmount?: SortOrder
    totalAmount?: SortOrder
    currency?: SortOrder
    lineItems?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: BillingInvoiceCountOrderByAggregateInput
    _avg?: BillingInvoiceAvgOrderByAggregateInput
    _max?: BillingInvoiceMaxOrderByAggregateInput
    _min?: BillingInvoiceMinOrderByAggregateInput
    _sum?: BillingInvoiceSumOrderByAggregateInput
  }

  export type BillingInvoiceScalarWhereWithAggregatesInput = {
    AND?: BillingInvoiceScalarWhereWithAggregatesInput | BillingInvoiceScalarWhereWithAggregatesInput[]
    OR?: BillingInvoiceScalarWhereWithAggregatesInput[]
    NOT?: BillingInvoiceScalarWhereWithAggregatesInput | BillingInvoiceScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"BillingInvoice"> | number
    tenantId?: IntWithAggregatesFilter<"BillingInvoice"> | number
    subscriptionId?: IntWithAggregatesFilter<"BillingInvoice"> | number
    planId?: IntWithAggregatesFilter<"BillingInvoice"> | number
    invoiceNumber?: StringWithAggregatesFilter<"BillingInvoice"> | string
    status?: EnumBillingInvoiceStatusWithAggregatesFilter<"BillingInvoice"> | $Enums.BillingInvoiceStatus
    issuedAt?: DateTimeWithAggregatesFilter<"BillingInvoice"> | Date | string
    dueDate?: DateTimeWithAggregatesFilter<"BillingInvoice"> | Date | string
    periodStart?: DateTimeWithAggregatesFilter<"BillingInvoice"> | Date | string
    periodEnd?: DateTimeWithAggregatesFilter<"BillingInvoice"> | Date | string
    subtotal?: DecimalWithAggregatesFilter<"BillingInvoice"> | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalWithAggregatesFilter<"BillingInvoice"> | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalWithAggregatesFilter<"BillingInvoice"> | Decimal | DecimalJsLike | number | string
    currency?: StringWithAggregatesFilter<"BillingInvoice"> | string
    lineItems?: JsonWithAggregatesFilter<"BillingInvoice">
    notes?: StringNullableWithAggregatesFilter<"BillingInvoice"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"BillingInvoice"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"BillingInvoice"> | Date | string
  }

  export type BillingPaymentWhereInput = {
    AND?: BillingPaymentWhereInput | BillingPaymentWhereInput[]
    OR?: BillingPaymentWhereInput[]
    NOT?: BillingPaymentWhereInput | BillingPaymentWhereInput[]
    id?: IntFilter<"BillingPayment"> | number
    invoiceId?: IntFilter<"BillingPayment"> | number
    tenantId?: IntFilter<"BillingPayment"> | number
    amount?: DecimalFilter<"BillingPayment"> | Decimal | DecimalJsLike | number | string
    method?: EnumBillingPaymentMethodFilter<"BillingPayment"> | $Enums.BillingPaymentMethod
    status?: EnumBillingPaymentStatusFilter<"BillingPayment"> | $Enums.BillingPaymentStatus
    paidAt?: DateTimeFilter<"BillingPayment"> | Date | string
    reference?: StringNullableFilter<"BillingPayment"> | string | null
    notes?: StringNullableFilter<"BillingPayment"> | string | null
    createdAt?: DateTimeFilter<"BillingPayment"> | Date | string
    invoice?: XOR<BillingInvoiceScalarRelationFilter, BillingInvoiceWhereInput>
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }

  export type BillingPaymentOrderByWithRelationInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    tenantId?: SortOrder
    amount?: SortOrder
    method?: SortOrder
    status?: SortOrder
    paidAt?: SortOrder
    reference?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    invoice?: BillingInvoiceOrderByWithRelationInput
    tenant?: TenantOrderByWithRelationInput
  }

  export type BillingPaymentWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: BillingPaymentWhereInput | BillingPaymentWhereInput[]
    OR?: BillingPaymentWhereInput[]
    NOT?: BillingPaymentWhereInput | BillingPaymentWhereInput[]
    invoiceId?: IntFilter<"BillingPayment"> | number
    tenantId?: IntFilter<"BillingPayment"> | number
    amount?: DecimalFilter<"BillingPayment"> | Decimal | DecimalJsLike | number | string
    method?: EnumBillingPaymentMethodFilter<"BillingPayment"> | $Enums.BillingPaymentMethod
    status?: EnumBillingPaymentStatusFilter<"BillingPayment"> | $Enums.BillingPaymentStatus
    paidAt?: DateTimeFilter<"BillingPayment"> | Date | string
    reference?: StringNullableFilter<"BillingPayment"> | string | null
    notes?: StringNullableFilter<"BillingPayment"> | string | null
    createdAt?: DateTimeFilter<"BillingPayment"> | Date | string
    invoice?: XOR<BillingInvoiceScalarRelationFilter, BillingInvoiceWhereInput>
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }, "id">

  export type BillingPaymentOrderByWithAggregationInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    tenantId?: SortOrder
    amount?: SortOrder
    method?: SortOrder
    status?: SortOrder
    paidAt?: SortOrder
    reference?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: BillingPaymentCountOrderByAggregateInput
    _avg?: BillingPaymentAvgOrderByAggregateInput
    _max?: BillingPaymentMaxOrderByAggregateInput
    _min?: BillingPaymentMinOrderByAggregateInput
    _sum?: BillingPaymentSumOrderByAggregateInput
  }

  export type BillingPaymentScalarWhereWithAggregatesInput = {
    AND?: BillingPaymentScalarWhereWithAggregatesInput | BillingPaymentScalarWhereWithAggregatesInput[]
    OR?: BillingPaymentScalarWhereWithAggregatesInput[]
    NOT?: BillingPaymentScalarWhereWithAggregatesInput | BillingPaymentScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"BillingPayment"> | number
    invoiceId?: IntWithAggregatesFilter<"BillingPayment"> | number
    tenantId?: IntWithAggregatesFilter<"BillingPayment"> | number
    amount?: DecimalWithAggregatesFilter<"BillingPayment"> | Decimal | DecimalJsLike | number | string
    method?: EnumBillingPaymentMethodWithAggregatesFilter<"BillingPayment"> | $Enums.BillingPaymentMethod
    status?: EnumBillingPaymentStatusWithAggregatesFilter<"BillingPayment"> | $Enums.BillingPaymentStatus
    paidAt?: DateTimeWithAggregatesFilter<"BillingPayment"> | Date | string
    reference?: StringNullableWithAggregatesFilter<"BillingPayment"> | string | null
    notes?: StringNullableWithAggregatesFilter<"BillingPayment"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"BillingPayment"> | Date | string
  }

  export type SubscriptionPlanChangeRequestWhereInput = {
    AND?: SubscriptionPlanChangeRequestWhereInput | SubscriptionPlanChangeRequestWhereInput[]
    OR?: SubscriptionPlanChangeRequestWhereInput[]
    NOT?: SubscriptionPlanChangeRequestWhereInput | SubscriptionPlanChangeRequestWhereInput[]
    id?: IntFilter<"SubscriptionPlanChangeRequest"> | number
    tenantId?: IntFilter<"SubscriptionPlanChangeRequest"> | number
    currentSubscriptionId?: IntNullableFilter<"SubscriptionPlanChangeRequest"> | number | null
    requestedPlanId?: IntFilter<"SubscriptionPlanChangeRequest"> | number
    status?: EnumPlanChangeRequestStatusFilter<"SubscriptionPlanChangeRequest"> | $Enums.PlanChangeRequestStatus
    message?: StringNullableFilter<"SubscriptionPlanChangeRequest"> | string | null
    reviewedNote?: StringNullableFilter<"SubscriptionPlanChangeRequest"> | string | null
    createdAt?: DateTimeFilter<"SubscriptionPlanChangeRequest"> | Date | string
    updatedAt?: DateTimeFilter<"SubscriptionPlanChangeRequest"> | Date | string
    reviewedAt?: DateTimeNullableFilter<"SubscriptionPlanChangeRequest"> | Date | string | null
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
    currentSubscription?: XOR<TenantSubscriptionNullableScalarRelationFilter, TenantSubscriptionWhereInput> | null
    requestedPlan?: XOR<SubscriptionPlanScalarRelationFilter, SubscriptionPlanWhereInput>
  }

  export type SubscriptionPlanChangeRequestOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    currentSubscriptionId?: SortOrderInput | SortOrder
    requestedPlanId?: SortOrder
    status?: SortOrder
    message?: SortOrderInput | SortOrder
    reviewedNote?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    reviewedAt?: SortOrderInput | SortOrder
    tenant?: TenantOrderByWithRelationInput
    currentSubscription?: TenantSubscriptionOrderByWithRelationInput
    requestedPlan?: SubscriptionPlanOrderByWithRelationInput
  }

  export type SubscriptionPlanChangeRequestWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: SubscriptionPlanChangeRequestWhereInput | SubscriptionPlanChangeRequestWhereInput[]
    OR?: SubscriptionPlanChangeRequestWhereInput[]
    NOT?: SubscriptionPlanChangeRequestWhereInput | SubscriptionPlanChangeRequestWhereInput[]
    tenantId?: IntFilter<"SubscriptionPlanChangeRequest"> | number
    currentSubscriptionId?: IntNullableFilter<"SubscriptionPlanChangeRequest"> | number | null
    requestedPlanId?: IntFilter<"SubscriptionPlanChangeRequest"> | number
    status?: EnumPlanChangeRequestStatusFilter<"SubscriptionPlanChangeRequest"> | $Enums.PlanChangeRequestStatus
    message?: StringNullableFilter<"SubscriptionPlanChangeRequest"> | string | null
    reviewedNote?: StringNullableFilter<"SubscriptionPlanChangeRequest"> | string | null
    createdAt?: DateTimeFilter<"SubscriptionPlanChangeRequest"> | Date | string
    updatedAt?: DateTimeFilter<"SubscriptionPlanChangeRequest"> | Date | string
    reviewedAt?: DateTimeNullableFilter<"SubscriptionPlanChangeRequest"> | Date | string | null
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
    currentSubscription?: XOR<TenantSubscriptionNullableScalarRelationFilter, TenantSubscriptionWhereInput> | null
    requestedPlan?: XOR<SubscriptionPlanScalarRelationFilter, SubscriptionPlanWhereInput>
  }, "id">

  export type SubscriptionPlanChangeRequestOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    currentSubscriptionId?: SortOrderInput | SortOrder
    requestedPlanId?: SortOrder
    status?: SortOrder
    message?: SortOrderInput | SortOrder
    reviewedNote?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    reviewedAt?: SortOrderInput | SortOrder
    _count?: SubscriptionPlanChangeRequestCountOrderByAggregateInput
    _avg?: SubscriptionPlanChangeRequestAvgOrderByAggregateInput
    _max?: SubscriptionPlanChangeRequestMaxOrderByAggregateInput
    _min?: SubscriptionPlanChangeRequestMinOrderByAggregateInput
    _sum?: SubscriptionPlanChangeRequestSumOrderByAggregateInput
  }

  export type SubscriptionPlanChangeRequestScalarWhereWithAggregatesInput = {
    AND?: SubscriptionPlanChangeRequestScalarWhereWithAggregatesInput | SubscriptionPlanChangeRequestScalarWhereWithAggregatesInput[]
    OR?: SubscriptionPlanChangeRequestScalarWhereWithAggregatesInput[]
    NOT?: SubscriptionPlanChangeRequestScalarWhereWithAggregatesInput | SubscriptionPlanChangeRequestScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"SubscriptionPlanChangeRequest"> | number
    tenantId?: IntWithAggregatesFilter<"SubscriptionPlanChangeRequest"> | number
    currentSubscriptionId?: IntNullableWithAggregatesFilter<"SubscriptionPlanChangeRequest"> | number | null
    requestedPlanId?: IntWithAggregatesFilter<"SubscriptionPlanChangeRequest"> | number
    status?: EnumPlanChangeRequestStatusWithAggregatesFilter<"SubscriptionPlanChangeRequest"> | $Enums.PlanChangeRequestStatus
    message?: StringNullableWithAggregatesFilter<"SubscriptionPlanChangeRequest"> | string | null
    reviewedNote?: StringNullableWithAggregatesFilter<"SubscriptionPlanChangeRequest"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"SubscriptionPlanChangeRequest"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SubscriptionPlanChangeRequest"> | Date | string
    reviewedAt?: DateTimeNullableWithAggregatesFilter<"SubscriptionPlanChangeRequest"> | Date | string | null
  }

  export type SuperAdminCreateInput = {
    name: string
    email: string
    passwordHash: string
    createdAt?: Date | string
  }

  export type SuperAdminUncheckedCreateInput = {
    id?: number
    name: string
    email: string
    passwordHash: string
    createdAt?: Date | string
  }

  export type SuperAdminUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SuperAdminUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SuperAdminCreateManyInput = {
    id?: number
    name: string
    email: string
    passwordHash: string
    createdAt?: Date | string
  }

  export type SuperAdminUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SuperAdminUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantCreateInput = {
    name: string
    subdomain: string
    databaseUrl?: string | null
    country?: string
    logoUrl?: string | null
    status?: $Enums.TenantStatus
    createdAt?: Date | string
    staffLoginLookups?: StaffLoginLookupCreateNestedManyWithoutTenantInput
    subscription?: TenantSubscriptionCreateNestedManyWithoutTenantInput
    billingInvoices?: BillingInvoiceCreateNestedManyWithoutTenantInput
    billingPayments?: BillingPaymentCreateNestedManyWithoutTenantInput
    planChangeRequests?: SubscriptionPlanChangeRequestCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateInput = {
    id?: number
    name: string
    subdomain: string
    databaseUrl?: string | null
    country?: string
    logoUrl?: string | null
    status?: $Enums.TenantStatus
    createdAt?: Date | string
    staffLoginLookups?: StaffLoginLookupUncheckedCreateNestedManyWithoutTenantInput
    subscription?: TenantSubscriptionUncheckedCreateNestedManyWithoutTenantInput
    billingInvoices?: BillingInvoiceUncheckedCreateNestedManyWithoutTenantInput
    billingPayments?: BillingPaymentUncheckedCreateNestedManyWithoutTenantInput
    planChangeRequests?: SubscriptionPlanChangeRequestUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    databaseUrl?: NullableStringFieldUpdateOperationsInput | string | null
    country?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    staffLoginLookups?: StaffLoginLookupUpdateManyWithoutTenantNestedInput
    subscription?: TenantSubscriptionUpdateManyWithoutTenantNestedInput
    billingInvoices?: BillingInvoiceUpdateManyWithoutTenantNestedInput
    billingPayments?: BillingPaymentUpdateManyWithoutTenantNestedInput
    planChangeRequests?: SubscriptionPlanChangeRequestUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    databaseUrl?: NullableStringFieldUpdateOperationsInput | string | null
    country?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    staffLoginLookups?: StaffLoginLookupUncheckedUpdateManyWithoutTenantNestedInput
    subscription?: TenantSubscriptionUncheckedUpdateManyWithoutTenantNestedInput
    billingInvoices?: BillingInvoiceUncheckedUpdateManyWithoutTenantNestedInput
    billingPayments?: BillingPaymentUncheckedUpdateManyWithoutTenantNestedInput
    planChangeRequests?: SubscriptionPlanChangeRequestUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type TenantCreateManyInput = {
    id?: number
    name: string
    subdomain: string
    databaseUrl?: string | null
    country?: string
    logoUrl?: string | null
    status?: $Enums.TenantStatus
    createdAt?: Date | string
  }

  export type TenantUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    databaseUrl?: NullableStringFieldUpdateOperationsInput | string | null
    country?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    databaseUrl?: NullableStringFieldUpdateOperationsInput | string | null
    country?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StaffLoginLookupCreateInput = {
    email: string
    staffId: number
    tenant: TenantCreateNestedOneWithoutStaffLoginLookupsInput
  }

  export type StaffLoginLookupUncheckedCreateInput = {
    id?: number
    email: string
    tenantId: number
    staffId: number
  }

  export type StaffLoginLookupUpdateInput = {
    email?: StringFieldUpdateOperationsInput | string
    staffId?: IntFieldUpdateOperationsInput | number
    tenant?: TenantUpdateOneRequiredWithoutStaffLoginLookupsNestedInput
  }

  export type StaffLoginLookupUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    tenantId?: IntFieldUpdateOperationsInput | number
    staffId?: IntFieldUpdateOperationsInput | number
  }

  export type StaffLoginLookupCreateManyInput = {
    id?: number
    email: string
    tenantId: number
    staffId: number
  }

  export type StaffLoginLookupUpdateManyMutationInput = {
    email?: StringFieldUpdateOperationsInput | string
    staffId?: IntFieldUpdateOperationsInput | number
  }

  export type StaffLoginLookupUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    tenantId?: IntFieldUpdateOperationsInput | number
    staffId?: IntFieldUpdateOperationsInput | number
  }

  export type PasswordResetTokenCreateInput = {
    tokenHash: string
    email: string
    kind: string
    tenantId?: number | null
    staffId?: number | null
    expiresAt: Date | string
    usedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type PasswordResetTokenUncheckedCreateInput = {
    id?: number
    tokenHash: string
    email: string
    kind: string
    tenantId?: number | null
    staffId?: number | null
    expiresAt: Date | string
    usedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type PasswordResetTokenUpdateInput = {
    tokenHash?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    tenantId?: NullableIntFieldUpdateOperationsInput | number | null
    staffId?: NullableIntFieldUpdateOperationsInput | number | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasswordResetTokenUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    tokenHash?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    tenantId?: NullableIntFieldUpdateOperationsInput | number | null
    staffId?: NullableIntFieldUpdateOperationsInput | number | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasswordResetTokenCreateManyInput = {
    id?: number
    tokenHash: string
    email: string
    kind: string
    tenantId?: number | null
    staffId?: number | null
    expiresAt: Date | string
    usedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type PasswordResetTokenUpdateManyMutationInput = {
    tokenHash?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    tenantId?: NullableIntFieldUpdateOperationsInput | number | null
    staffId?: NullableIntFieldUpdateOperationsInput | number | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasswordResetTokenUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    tokenHash?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    tenantId?: NullableIntFieldUpdateOperationsInput | number | null
    staffId?: NullableIntFieldUpdateOperationsInput | number | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FiskalyPlatformConfigCreateInput = {
    apiKey: string
    tssId: string
    clientId: string
    adminPuk?: string | null
    updatedAt?: Date | string
  }

  export type FiskalyPlatformConfigUncheckedCreateInput = {
    id?: number
    apiKey: string
    tssId: string
    clientId: string
    adminPuk?: string | null
    updatedAt?: Date | string
  }

  export type FiskalyPlatformConfigUpdateInput = {
    apiKey?: StringFieldUpdateOperationsInput | string
    tssId?: StringFieldUpdateOperationsInput | string
    clientId?: StringFieldUpdateOperationsInput | string
    adminPuk?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FiskalyPlatformConfigUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    apiKey?: StringFieldUpdateOperationsInput | string
    tssId?: StringFieldUpdateOperationsInput | string
    clientId?: StringFieldUpdateOperationsInput | string
    adminPuk?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FiskalyPlatformConfigCreateManyInput = {
    id?: number
    apiKey: string
    tssId: string
    clientId: string
    adminPuk?: string | null
    updatedAt?: Date | string
  }

  export type FiskalyPlatformConfigUpdateManyMutationInput = {
    apiKey?: StringFieldUpdateOperationsInput | string
    tssId?: StringFieldUpdateOperationsInput | string
    clientId?: StringFieldUpdateOperationsInput | string
    adminPuk?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FiskalyPlatformConfigUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    apiKey?: StringFieldUpdateOperationsInput | string
    tssId?: StringFieldUpdateOperationsInput | string
    clientId?: StringFieldUpdateOperationsInput | string
    adminPuk?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionPlanCreateInput = {
    code?: string | null
    name: string
    description?: string | null
    billingInterval?: $Enums.BillingInterval
    monthlyPrice: Decimal | DecimalJsLike | number | string
    commissionPercent: Decimal | DecimalJsLike | number | string
    trialDays?: number
    graceDays?: number
    sortOrder?: number
    features: JsonNullValueInput | InputJsonValue
    tenantSubscriptions?: TenantSubscriptionCreateNestedManyWithoutPlanInput
    invoices?: BillingInvoiceCreateNestedManyWithoutPlanInput
    requestedChanges?: SubscriptionPlanChangeRequestCreateNestedManyWithoutRequestedPlanInput
  }

  export type SubscriptionPlanUncheckedCreateInput = {
    id?: number
    code?: string | null
    name: string
    description?: string | null
    billingInterval?: $Enums.BillingInterval
    monthlyPrice: Decimal | DecimalJsLike | number | string
    commissionPercent: Decimal | DecimalJsLike | number | string
    trialDays?: number
    graceDays?: number
    sortOrder?: number
    features: JsonNullValueInput | InputJsonValue
    tenantSubscriptions?: TenantSubscriptionUncheckedCreateNestedManyWithoutPlanInput
    invoices?: BillingInvoiceUncheckedCreateNestedManyWithoutPlanInput
    requestedChanges?: SubscriptionPlanChangeRequestUncheckedCreateNestedManyWithoutRequestedPlanInput
  }

  export type SubscriptionPlanUpdateInput = {
    code?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    billingInterval?: EnumBillingIntervalFieldUpdateOperationsInput | $Enums.BillingInterval
    monthlyPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    commissionPercent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    trialDays?: IntFieldUpdateOperationsInput | number
    graceDays?: IntFieldUpdateOperationsInput | number
    sortOrder?: IntFieldUpdateOperationsInput | number
    features?: JsonNullValueInput | InputJsonValue
    tenantSubscriptions?: TenantSubscriptionUpdateManyWithoutPlanNestedInput
    invoices?: BillingInvoiceUpdateManyWithoutPlanNestedInput
    requestedChanges?: SubscriptionPlanChangeRequestUpdateManyWithoutRequestedPlanNestedInput
  }

  export type SubscriptionPlanUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    code?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    billingInterval?: EnumBillingIntervalFieldUpdateOperationsInput | $Enums.BillingInterval
    monthlyPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    commissionPercent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    trialDays?: IntFieldUpdateOperationsInput | number
    graceDays?: IntFieldUpdateOperationsInput | number
    sortOrder?: IntFieldUpdateOperationsInput | number
    features?: JsonNullValueInput | InputJsonValue
    tenantSubscriptions?: TenantSubscriptionUncheckedUpdateManyWithoutPlanNestedInput
    invoices?: BillingInvoiceUncheckedUpdateManyWithoutPlanNestedInput
    requestedChanges?: SubscriptionPlanChangeRequestUncheckedUpdateManyWithoutRequestedPlanNestedInput
  }

  export type SubscriptionPlanCreateManyInput = {
    id?: number
    code?: string | null
    name: string
    description?: string | null
    billingInterval?: $Enums.BillingInterval
    monthlyPrice: Decimal | DecimalJsLike | number | string
    commissionPercent: Decimal | DecimalJsLike | number | string
    trialDays?: number
    graceDays?: number
    sortOrder?: number
    features: JsonNullValueInput | InputJsonValue
  }

  export type SubscriptionPlanUpdateManyMutationInput = {
    code?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    billingInterval?: EnumBillingIntervalFieldUpdateOperationsInput | $Enums.BillingInterval
    monthlyPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    commissionPercent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    trialDays?: IntFieldUpdateOperationsInput | number
    graceDays?: IntFieldUpdateOperationsInput | number
    sortOrder?: IntFieldUpdateOperationsInput | number
    features?: JsonNullValueInput | InputJsonValue
  }

  export type SubscriptionPlanUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    code?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    billingInterval?: EnumBillingIntervalFieldUpdateOperationsInput | $Enums.BillingInterval
    monthlyPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    commissionPercent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    trialDays?: IntFieldUpdateOperationsInput | number
    graceDays?: IntFieldUpdateOperationsInput | number
    sortOrder?: IntFieldUpdateOperationsInput | number
    features?: JsonNullValueInput | InputJsonValue
  }

  export type TenantSubscriptionCreateInput = {
    status: $Enums.SubscriptionStatus
    startDate: Date | string
    endDate: Date | string
    trialStartDate?: Date | string | null
    trialEndDate?: Date | string | null
    gracePeriodEndsAt?: Date | string | null
    nextBillingDate?: Date | string | null
    autoRenew?: boolean
    cancelAtPeriodEnd?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    tenant: TenantCreateNestedOneWithoutSubscriptionInput
    plan: SubscriptionPlanCreateNestedOneWithoutTenantSubscriptionsInput
    invoices?: BillingInvoiceCreateNestedManyWithoutSubscriptionInput
    planChangeRequests?: SubscriptionPlanChangeRequestCreateNestedManyWithoutCurrentSubscriptionInput
  }

  export type TenantSubscriptionUncheckedCreateInput = {
    id?: number
    tenantId: number
    planId: number
    status: $Enums.SubscriptionStatus
    startDate: Date | string
    endDate: Date | string
    trialStartDate?: Date | string | null
    trialEndDate?: Date | string | null
    gracePeriodEndsAt?: Date | string | null
    nextBillingDate?: Date | string | null
    autoRenew?: boolean
    cancelAtPeriodEnd?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    invoices?: BillingInvoiceUncheckedCreateNestedManyWithoutSubscriptionInput
    planChangeRequests?: SubscriptionPlanChangeRequestUncheckedCreateNestedManyWithoutCurrentSubscriptionInput
  }

  export type TenantSubscriptionUpdateInput = {
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    trialStartDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gracePeriodEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextBillingDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    autoRenew?: BoolFieldUpdateOperationsInput | boolean
    cancelAtPeriodEnd?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutSubscriptionNestedInput
    plan?: SubscriptionPlanUpdateOneRequiredWithoutTenantSubscriptionsNestedInput
    invoices?: BillingInvoiceUpdateManyWithoutSubscriptionNestedInput
    planChangeRequests?: SubscriptionPlanChangeRequestUpdateManyWithoutCurrentSubscriptionNestedInput
  }

  export type TenantSubscriptionUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    tenantId?: IntFieldUpdateOperationsInput | number
    planId?: IntFieldUpdateOperationsInput | number
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    trialStartDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gracePeriodEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextBillingDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    autoRenew?: BoolFieldUpdateOperationsInput | boolean
    cancelAtPeriodEnd?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoices?: BillingInvoiceUncheckedUpdateManyWithoutSubscriptionNestedInput
    planChangeRequests?: SubscriptionPlanChangeRequestUncheckedUpdateManyWithoutCurrentSubscriptionNestedInput
  }

  export type TenantSubscriptionCreateManyInput = {
    id?: number
    tenantId: number
    planId: number
    status: $Enums.SubscriptionStatus
    startDate: Date | string
    endDate: Date | string
    trialStartDate?: Date | string | null
    trialEndDate?: Date | string | null
    gracePeriodEndsAt?: Date | string | null
    nextBillingDate?: Date | string | null
    autoRenew?: boolean
    cancelAtPeriodEnd?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TenantSubscriptionUpdateManyMutationInput = {
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    trialStartDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gracePeriodEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextBillingDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    autoRenew?: BoolFieldUpdateOperationsInput | boolean
    cancelAtPeriodEnd?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantSubscriptionUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    tenantId?: IntFieldUpdateOperationsInput | number
    planId?: IntFieldUpdateOperationsInput | number
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    trialStartDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gracePeriodEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextBillingDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    autoRenew?: BoolFieldUpdateOperationsInput | boolean
    cancelAtPeriodEnd?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BillingInvoiceCreateInput = {
    invoiceNumber: string
    status?: $Enums.BillingInvoiceStatus
    issuedAt?: Date | string
    dueDate: Date | string
    periodStart: Date | string
    periodEnd: Date | string
    subtotal: Decimal | DecimalJsLike | number | string
    taxAmount?: Decimal | DecimalJsLike | number | string
    totalAmount: Decimal | DecimalJsLike | number | string
    currency?: string
    lineItems: JsonNullValueInput | InputJsonValue
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    tenant: TenantCreateNestedOneWithoutBillingInvoicesInput
    subscription: TenantSubscriptionCreateNestedOneWithoutInvoicesInput
    plan: SubscriptionPlanCreateNestedOneWithoutInvoicesInput
    payments?: BillingPaymentCreateNestedManyWithoutInvoiceInput
  }

  export type BillingInvoiceUncheckedCreateInput = {
    id?: number
    tenantId: number
    subscriptionId: number
    planId: number
    invoiceNumber: string
    status?: $Enums.BillingInvoiceStatus
    issuedAt?: Date | string
    dueDate: Date | string
    periodStart: Date | string
    periodEnd: Date | string
    subtotal: Decimal | DecimalJsLike | number | string
    taxAmount?: Decimal | DecimalJsLike | number | string
    totalAmount: Decimal | DecimalJsLike | number | string
    currency?: string
    lineItems: JsonNullValueInput | InputJsonValue
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    payments?: BillingPaymentUncheckedCreateNestedManyWithoutInvoiceInput
  }

  export type BillingInvoiceUpdateInput = {
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    status?: EnumBillingInvoiceStatusFieldUpdateOperationsInput | $Enums.BillingInvoiceStatus
    issuedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    lineItems?: JsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutBillingInvoicesNestedInput
    subscription?: TenantSubscriptionUpdateOneRequiredWithoutInvoicesNestedInput
    plan?: SubscriptionPlanUpdateOneRequiredWithoutInvoicesNestedInput
    payments?: BillingPaymentUpdateManyWithoutInvoiceNestedInput
  }

  export type BillingInvoiceUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    tenantId?: IntFieldUpdateOperationsInput | number
    subscriptionId?: IntFieldUpdateOperationsInput | number
    planId?: IntFieldUpdateOperationsInput | number
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    status?: EnumBillingInvoiceStatusFieldUpdateOperationsInput | $Enums.BillingInvoiceStatus
    issuedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    lineItems?: JsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    payments?: BillingPaymentUncheckedUpdateManyWithoutInvoiceNestedInput
  }

  export type BillingInvoiceCreateManyInput = {
    id?: number
    tenantId: number
    subscriptionId: number
    planId: number
    invoiceNumber: string
    status?: $Enums.BillingInvoiceStatus
    issuedAt?: Date | string
    dueDate: Date | string
    periodStart: Date | string
    periodEnd: Date | string
    subtotal: Decimal | DecimalJsLike | number | string
    taxAmount?: Decimal | DecimalJsLike | number | string
    totalAmount: Decimal | DecimalJsLike | number | string
    currency?: string
    lineItems: JsonNullValueInput | InputJsonValue
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BillingInvoiceUpdateManyMutationInput = {
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    status?: EnumBillingInvoiceStatusFieldUpdateOperationsInput | $Enums.BillingInvoiceStatus
    issuedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    lineItems?: JsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BillingInvoiceUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    tenantId?: IntFieldUpdateOperationsInput | number
    subscriptionId?: IntFieldUpdateOperationsInput | number
    planId?: IntFieldUpdateOperationsInput | number
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    status?: EnumBillingInvoiceStatusFieldUpdateOperationsInput | $Enums.BillingInvoiceStatus
    issuedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    lineItems?: JsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BillingPaymentCreateInput = {
    amount: Decimal | DecimalJsLike | number | string
    method?: $Enums.BillingPaymentMethod
    status?: $Enums.BillingPaymentStatus
    paidAt?: Date | string
    reference?: string | null
    notes?: string | null
    createdAt?: Date | string
    invoice: BillingInvoiceCreateNestedOneWithoutPaymentsInput
    tenant: TenantCreateNestedOneWithoutBillingPaymentsInput
  }

  export type BillingPaymentUncheckedCreateInput = {
    id?: number
    invoiceId: number
    tenantId: number
    amount: Decimal | DecimalJsLike | number | string
    method?: $Enums.BillingPaymentMethod
    status?: $Enums.BillingPaymentStatus
    paidAt?: Date | string
    reference?: string | null
    notes?: string | null
    createdAt?: Date | string
  }

  export type BillingPaymentUpdateInput = {
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    method?: EnumBillingPaymentMethodFieldUpdateOperationsInput | $Enums.BillingPaymentMethod
    status?: EnumBillingPaymentStatusFieldUpdateOperationsInput | $Enums.BillingPaymentStatus
    paidAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoice?: BillingInvoiceUpdateOneRequiredWithoutPaymentsNestedInput
    tenant?: TenantUpdateOneRequiredWithoutBillingPaymentsNestedInput
  }

  export type BillingPaymentUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    invoiceId?: IntFieldUpdateOperationsInput | number
    tenantId?: IntFieldUpdateOperationsInput | number
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    method?: EnumBillingPaymentMethodFieldUpdateOperationsInput | $Enums.BillingPaymentMethod
    status?: EnumBillingPaymentStatusFieldUpdateOperationsInput | $Enums.BillingPaymentStatus
    paidAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BillingPaymentCreateManyInput = {
    id?: number
    invoiceId: number
    tenantId: number
    amount: Decimal | DecimalJsLike | number | string
    method?: $Enums.BillingPaymentMethod
    status?: $Enums.BillingPaymentStatus
    paidAt?: Date | string
    reference?: string | null
    notes?: string | null
    createdAt?: Date | string
  }

  export type BillingPaymentUpdateManyMutationInput = {
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    method?: EnumBillingPaymentMethodFieldUpdateOperationsInput | $Enums.BillingPaymentMethod
    status?: EnumBillingPaymentStatusFieldUpdateOperationsInput | $Enums.BillingPaymentStatus
    paidAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BillingPaymentUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    invoiceId?: IntFieldUpdateOperationsInput | number
    tenantId?: IntFieldUpdateOperationsInput | number
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    method?: EnumBillingPaymentMethodFieldUpdateOperationsInput | $Enums.BillingPaymentMethod
    status?: EnumBillingPaymentStatusFieldUpdateOperationsInput | $Enums.BillingPaymentStatus
    paidAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionPlanChangeRequestCreateInput = {
    status?: $Enums.PlanChangeRequestStatus
    message?: string | null
    reviewedNote?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    reviewedAt?: Date | string | null
    tenant: TenantCreateNestedOneWithoutPlanChangeRequestsInput
    currentSubscription?: TenantSubscriptionCreateNestedOneWithoutPlanChangeRequestsInput
    requestedPlan: SubscriptionPlanCreateNestedOneWithoutRequestedChangesInput
  }

  export type SubscriptionPlanChangeRequestUncheckedCreateInput = {
    id?: number
    tenantId: number
    currentSubscriptionId?: number | null
    requestedPlanId: number
    status?: $Enums.PlanChangeRequestStatus
    message?: string | null
    reviewedNote?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    reviewedAt?: Date | string | null
  }

  export type SubscriptionPlanChangeRequestUpdateInput = {
    status?: EnumPlanChangeRequestStatusFieldUpdateOperationsInput | $Enums.PlanChangeRequestStatus
    message?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tenant?: TenantUpdateOneRequiredWithoutPlanChangeRequestsNestedInput
    currentSubscription?: TenantSubscriptionUpdateOneWithoutPlanChangeRequestsNestedInput
    requestedPlan?: SubscriptionPlanUpdateOneRequiredWithoutRequestedChangesNestedInput
  }

  export type SubscriptionPlanChangeRequestUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    tenantId?: IntFieldUpdateOperationsInput | number
    currentSubscriptionId?: NullableIntFieldUpdateOperationsInput | number | null
    requestedPlanId?: IntFieldUpdateOperationsInput | number
    status?: EnumPlanChangeRequestStatusFieldUpdateOperationsInput | $Enums.PlanChangeRequestStatus
    message?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type SubscriptionPlanChangeRequestCreateManyInput = {
    id?: number
    tenantId: number
    currentSubscriptionId?: number | null
    requestedPlanId: number
    status?: $Enums.PlanChangeRequestStatus
    message?: string | null
    reviewedNote?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    reviewedAt?: Date | string | null
  }

  export type SubscriptionPlanChangeRequestUpdateManyMutationInput = {
    status?: EnumPlanChangeRequestStatusFieldUpdateOperationsInput | $Enums.PlanChangeRequestStatus
    message?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type SubscriptionPlanChangeRequestUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    tenantId?: IntFieldUpdateOperationsInput | number
    currentSubscriptionId?: NullableIntFieldUpdateOperationsInput | number | null
    requestedPlanId?: IntFieldUpdateOperationsInput | number
    status?: EnumPlanChangeRequestStatusFieldUpdateOperationsInput | $Enums.PlanChangeRequestStatus
    message?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SuperAdminCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    createdAt?: SortOrder
  }

  export type SuperAdminAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type SuperAdminMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    createdAt?: SortOrder
  }

  export type SuperAdminMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    createdAt?: SortOrder
  }

  export type SuperAdminSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type EnumTenantStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TenantStatus | EnumTenantStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TenantStatus[] | ListEnumTenantStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TenantStatus[] | ListEnumTenantStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTenantStatusFilter<$PrismaModel> | $Enums.TenantStatus
  }

  export type StaffLoginLookupListRelationFilter = {
    every?: StaffLoginLookupWhereInput
    some?: StaffLoginLookupWhereInput
    none?: StaffLoginLookupWhereInput
  }

  export type TenantSubscriptionListRelationFilter = {
    every?: TenantSubscriptionWhereInput
    some?: TenantSubscriptionWhereInput
    none?: TenantSubscriptionWhereInput
  }

  export type BillingInvoiceListRelationFilter = {
    every?: BillingInvoiceWhereInput
    some?: BillingInvoiceWhereInput
    none?: BillingInvoiceWhereInput
  }

  export type BillingPaymentListRelationFilter = {
    every?: BillingPaymentWhereInput
    some?: BillingPaymentWhereInput
    none?: BillingPaymentWhereInput
  }

  export type SubscriptionPlanChangeRequestListRelationFilter = {
    every?: SubscriptionPlanChangeRequestWhereInput
    some?: SubscriptionPlanChangeRequestWhereInput
    none?: SubscriptionPlanChangeRequestWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type StaffLoginLookupOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TenantSubscriptionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BillingInvoiceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BillingPaymentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SubscriptionPlanChangeRequestOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TenantCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    subdomain?: SortOrder
    databaseUrl?: SortOrder
    country?: SortOrder
    logoUrl?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type TenantAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type TenantMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    subdomain?: SortOrder
    databaseUrl?: SortOrder
    country?: SortOrder
    logoUrl?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type TenantMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    subdomain?: SortOrder
    databaseUrl?: SortOrder
    country?: SortOrder
    logoUrl?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type TenantSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumTenantStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TenantStatus | EnumTenantStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TenantStatus[] | ListEnumTenantStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TenantStatus[] | ListEnumTenantStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTenantStatusWithAggregatesFilter<$PrismaModel> | $Enums.TenantStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTenantStatusFilter<$PrismaModel>
    _max?: NestedEnumTenantStatusFilter<$PrismaModel>
  }

  export type TenantScalarRelationFilter = {
    is?: TenantWhereInput
    isNot?: TenantWhereInput
  }

  export type StaffLoginLookupEmailTenantIdCompoundUniqueInput = {
    email: string
    tenantId: number
  }

  export type StaffLoginLookupCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    tenantId?: SortOrder
    staffId?: SortOrder
  }

  export type StaffLoginLookupAvgOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    staffId?: SortOrder
  }

  export type StaffLoginLookupMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    tenantId?: SortOrder
    staffId?: SortOrder
  }

  export type StaffLoginLookupMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    tenantId?: SortOrder
    staffId?: SortOrder
  }

  export type StaffLoginLookupSumOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    staffId?: SortOrder
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type PasswordResetTokenCountOrderByAggregateInput = {
    id?: SortOrder
    tokenHash?: SortOrder
    email?: SortOrder
    kind?: SortOrder
    tenantId?: SortOrder
    staffId?: SortOrder
    expiresAt?: SortOrder
    usedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PasswordResetTokenAvgOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    staffId?: SortOrder
  }

  export type PasswordResetTokenMaxOrderByAggregateInput = {
    id?: SortOrder
    tokenHash?: SortOrder
    email?: SortOrder
    kind?: SortOrder
    tenantId?: SortOrder
    staffId?: SortOrder
    expiresAt?: SortOrder
    usedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PasswordResetTokenMinOrderByAggregateInput = {
    id?: SortOrder
    tokenHash?: SortOrder
    email?: SortOrder
    kind?: SortOrder
    tenantId?: SortOrder
    staffId?: SortOrder
    expiresAt?: SortOrder
    usedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PasswordResetTokenSumOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    staffId?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type FiskalyPlatformConfigCountOrderByAggregateInput = {
    id?: SortOrder
    apiKey?: SortOrder
    tssId?: SortOrder
    clientId?: SortOrder
    adminPuk?: SortOrder
    updatedAt?: SortOrder
  }

  export type FiskalyPlatformConfigAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type FiskalyPlatformConfigMaxOrderByAggregateInput = {
    id?: SortOrder
    apiKey?: SortOrder
    tssId?: SortOrder
    clientId?: SortOrder
    adminPuk?: SortOrder
    updatedAt?: SortOrder
  }

  export type FiskalyPlatformConfigMinOrderByAggregateInput = {
    id?: SortOrder
    apiKey?: SortOrder
    tssId?: SortOrder
    clientId?: SortOrder
    adminPuk?: SortOrder
    updatedAt?: SortOrder
  }

  export type FiskalyPlatformConfigSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type EnumBillingIntervalFilter<$PrismaModel = never> = {
    equals?: $Enums.BillingInterval | EnumBillingIntervalFieldRefInput<$PrismaModel>
    in?: $Enums.BillingInterval[] | ListEnumBillingIntervalFieldRefInput<$PrismaModel>
    notIn?: $Enums.BillingInterval[] | ListEnumBillingIntervalFieldRefInput<$PrismaModel>
    not?: NestedEnumBillingIntervalFilter<$PrismaModel> | $Enums.BillingInterval
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type SubscriptionPlanCountOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    description?: SortOrder
    billingInterval?: SortOrder
    monthlyPrice?: SortOrder
    commissionPercent?: SortOrder
    trialDays?: SortOrder
    graceDays?: SortOrder
    sortOrder?: SortOrder
    features?: SortOrder
  }

  export type SubscriptionPlanAvgOrderByAggregateInput = {
    id?: SortOrder
    monthlyPrice?: SortOrder
    commissionPercent?: SortOrder
    trialDays?: SortOrder
    graceDays?: SortOrder
    sortOrder?: SortOrder
  }

  export type SubscriptionPlanMaxOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    description?: SortOrder
    billingInterval?: SortOrder
    monthlyPrice?: SortOrder
    commissionPercent?: SortOrder
    trialDays?: SortOrder
    graceDays?: SortOrder
    sortOrder?: SortOrder
  }

  export type SubscriptionPlanMinOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    description?: SortOrder
    billingInterval?: SortOrder
    monthlyPrice?: SortOrder
    commissionPercent?: SortOrder
    trialDays?: SortOrder
    graceDays?: SortOrder
    sortOrder?: SortOrder
  }

  export type SubscriptionPlanSumOrderByAggregateInput = {
    id?: SortOrder
    monthlyPrice?: SortOrder
    commissionPercent?: SortOrder
    trialDays?: SortOrder
    graceDays?: SortOrder
    sortOrder?: SortOrder
  }

  export type EnumBillingIntervalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BillingInterval | EnumBillingIntervalFieldRefInput<$PrismaModel>
    in?: $Enums.BillingInterval[] | ListEnumBillingIntervalFieldRefInput<$PrismaModel>
    notIn?: $Enums.BillingInterval[] | ListEnumBillingIntervalFieldRefInput<$PrismaModel>
    not?: NestedEnumBillingIntervalWithAggregatesFilter<$PrismaModel> | $Enums.BillingInterval
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBillingIntervalFilter<$PrismaModel>
    _max?: NestedEnumBillingIntervalFilter<$PrismaModel>
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type EnumSubscriptionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionStatus | EnumSubscriptionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSubscriptionStatusFilter<$PrismaModel> | $Enums.SubscriptionStatus
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type SubscriptionPlanScalarRelationFilter = {
    is?: SubscriptionPlanWhereInput
    isNot?: SubscriptionPlanWhereInput
  }

  export type TenantSubscriptionCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    planId?: SortOrder
    status?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    trialStartDate?: SortOrder
    trialEndDate?: SortOrder
    gracePeriodEndsAt?: SortOrder
    nextBillingDate?: SortOrder
    autoRenew?: SortOrder
    cancelAtPeriodEnd?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TenantSubscriptionAvgOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    planId?: SortOrder
  }

  export type TenantSubscriptionMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    planId?: SortOrder
    status?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    trialStartDate?: SortOrder
    trialEndDate?: SortOrder
    gracePeriodEndsAt?: SortOrder
    nextBillingDate?: SortOrder
    autoRenew?: SortOrder
    cancelAtPeriodEnd?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TenantSubscriptionMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    planId?: SortOrder
    status?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    trialStartDate?: SortOrder
    trialEndDate?: SortOrder
    gracePeriodEndsAt?: SortOrder
    nextBillingDate?: SortOrder
    autoRenew?: SortOrder
    cancelAtPeriodEnd?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TenantSubscriptionSumOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    planId?: SortOrder
  }

  export type EnumSubscriptionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionStatus | EnumSubscriptionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSubscriptionStatusWithAggregatesFilter<$PrismaModel> | $Enums.SubscriptionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSubscriptionStatusFilter<$PrismaModel>
    _max?: NestedEnumSubscriptionStatusFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type EnumBillingInvoiceStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.BillingInvoiceStatus | EnumBillingInvoiceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.BillingInvoiceStatus[] | ListEnumBillingInvoiceStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.BillingInvoiceStatus[] | ListEnumBillingInvoiceStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumBillingInvoiceStatusFilter<$PrismaModel> | $Enums.BillingInvoiceStatus
  }

  export type TenantSubscriptionScalarRelationFilter = {
    is?: TenantSubscriptionWhereInput
    isNot?: TenantSubscriptionWhereInput
  }

  export type BillingInvoiceCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    subscriptionId?: SortOrder
    planId?: SortOrder
    invoiceNumber?: SortOrder
    status?: SortOrder
    issuedAt?: SortOrder
    dueDate?: SortOrder
    periodStart?: SortOrder
    periodEnd?: SortOrder
    subtotal?: SortOrder
    taxAmount?: SortOrder
    totalAmount?: SortOrder
    currency?: SortOrder
    lineItems?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BillingInvoiceAvgOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    subscriptionId?: SortOrder
    planId?: SortOrder
    subtotal?: SortOrder
    taxAmount?: SortOrder
    totalAmount?: SortOrder
  }

  export type BillingInvoiceMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    subscriptionId?: SortOrder
    planId?: SortOrder
    invoiceNumber?: SortOrder
    status?: SortOrder
    issuedAt?: SortOrder
    dueDate?: SortOrder
    periodStart?: SortOrder
    periodEnd?: SortOrder
    subtotal?: SortOrder
    taxAmount?: SortOrder
    totalAmount?: SortOrder
    currency?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BillingInvoiceMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    subscriptionId?: SortOrder
    planId?: SortOrder
    invoiceNumber?: SortOrder
    status?: SortOrder
    issuedAt?: SortOrder
    dueDate?: SortOrder
    periodStart?: SortOrder
    periodEnd?: SortOrder
    subtotal?: SortOrder
    taxAmount?: SortOrder
    totalAmount?: SortOrder
    currency?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BillingInvoiceSumOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    subscriptionId?: SortOrder
    planId?: SortOrder
    subtotal?: SortOrder
    taxAmount?: SortOrder
    totalAmount?: SortOrder
  }

  export type EnumBillingInvoiceStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BillingInvoiceStatus | EnumBillingInvoiceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.BillingInvoiceStatus[] | ListEnumBillingInvoiceStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.BillingInvoiceStatus[] | ListEnumBillingInvoiceStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumBillingInvoiceStatusWithAggregatesFilter<$PrismaModel> | $Enums.BillingInvoiceStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBillingInvoiceStatusFilter<$PrismaModel>
    _max?: NestedEnumBillingInvoiceStatusFilter<$PrismaModel>
  }

  export type EnumBillingPaymentMethodFilter<$PrismaModel = never> = {
    equals?: $Enums.BillingPaymentMethod | EnumBillingPaymentMethodFieldRefInput<$PrismaModel>
    in?: $Enums.BillingPaymentMethod[] | ListEnumBillingPaymentMethodFieldRefInput<$PrismaModel>
    notIn?: $Enums.BillingPaymentMethod[] | ListEnumBillingPaymentMethodFieldRefInput<$PrismaModel>
    not?: NestedEnumBillingPaymentMethodFilter<$PrismaModel> | $Enums.BillingPaymentMethod
  }

  export type EnumBillingPaymentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.BillingPaymentStatus | EnumBillingPaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.BillingPaymentStatus[] | ListEnumBillingPaymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.BillingPaymentStatus[] | ListEnumBillingPaymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumBillingPaymentStatusFilter<$PrismaModel> | $Enums.BillingPaymentStatus
  }

  export type BillingInvoiceScalarRelationFilter = {
    is?: BillingInvoiceWhereInput
    isNot?: BillingInvoiceWhereInput
  }

  export type BillingPaymentCountOrderByAggregateInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    tenantId?: SortOrder
    amount?: SortOrder
    method?: SortOrder
    status?: SortOrder
    paidAt?: SortOrder
    reference?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
  }

  export type BillingPaymentAvgOrderByAggregateInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    tenantId?: SortOrder
    amount?: SortOrder
  }

  export type BillingPaymentMaxOrderByAggregateInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    tenantId?: SortOrder
    amount?: SortOrder
    method?: SortOrder
    status?: SortOrder
    paidAt?: SortOrder
    reference?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
  }

  export type BillingPaymentMinOrderByAggregateInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    tenantId?: SortOrder
    amount?: SortOrder
    method?: SortOrder
    status?: SortOrder
    paidAt?: SortOrder
    reference?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
  }

  export type BillingPaymentSumOrderByAggregateInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    tenantId?: SortOrder
    amount?: SortOrder
  }

  export type EnumBillingPaymentMethodWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BillingPaymentMethod | EnumBillingPaymentMethodFieldRefInput<$PrismaModel>
    in?: $Enums.BillingPaymentMethod[] | ListEnumBillingPaymentMethodFieldRefInput<$PrismaModel>
    notIn?: $Enums.BillingPaymentMethod[] | ListEnumBillingPaymentMethodFieldRefInput<$PrismaModel>
    not?: NestedEnumBillingPaymentMethodWithAggregatesFilter<$PrismaModel> | $Enums.BillingPaymentMethod
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBillingPaymentMethodFilter<$PrismaModel>
    _max?: NestedEnumBillingPaymentMethodFilter<$PrismaModel>
  }

  export type EnumBillingPaymentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BillingPaymentStatus | EnumBillingPaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.BillingPaymentStatus[] | ListEnumBillingPaymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.BillingPaymentStatus[] | ListEnumBillingPaymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumBillingPaymentStatusWithAggregatesFilter<$PrismaModel> | $Enums.BillingPaymentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBillingPaymentStatusFilter<$PrismaModel>
    _max?: NestedEnumBillingPaymentStatusFilter<$PrismaModel>
  }

  export type EnumPlanChangeRequestStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PlanChangeRequestStatus | EnumPlanChangeRequestStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PlanChangeRequestStatus[] | ListEnumPlanChangeRequestStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PlanChangeRequestStatus[] | ListEnumPlanChangeRequestStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPlanChangeRequestStatusFilter<$PrismaModel> | $Enums.PlanChangeRequestStatus
  }

  export type TenantSubscriptionNullableScalarRelationFilter = {
    is?: TenantSubscriptionWhereInput | null
    isNot?: TenantSubscriptionWhereInput | null
  }

  export type SubscriptionPlanChangeRequestCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    currentSubscriptionId?: SortOrder
    requestedPlanId?: SortOrder
    status?: SortOrder
    message?: SortOrder
    reviewedNote?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    reviewedAt?: SortOrder
  }

  export type SubscriptionPlanChangeRequestAvgOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    currentSubscriptionId?: SortOrder
    requestedPlanId?: SortOrder
  }

  export type SubscriptionPlanChangeRequestMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    currentSubscriptionId?: SortOrder
    requestedPlanId?: SortOrder
    status?: SortOrder
    message?: SortOrder
    reviewedNote?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    reviewedAt?: SortOrder
  }

  export type SubscriptionPlanChangeRequestMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    currentSubscriptionId?: SortOrder
    requestedPlanId?: SortOrder
    status?: SortOrder
    message?: SortOrder
    reviewedNote?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    reviewedAt?: SortOrder
  }

  export type SubscriptionPlanChangeRequestSumOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    currentSubscriptionId?: SortOrder
    requestedPlanId?: SortOrder
  }

  export type EnumPlanChangeRequestStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PlanChangeRequestStatus | EnumPlanChangeRequestStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PlanChangeRequestStatus[] | ListEnumPlanChangeRequestStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PlanChangeRequestStatus[] | ListEnumPlanChangeRequestStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPlanChangeRequestStatusWithAggregatesFilter<$PrismaModel> | $Enums.PlanChangeRequestStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPlanChangeRequestStatusFilter<$PrismaModel>
    _max?: NestedEnumPlanChangeRequestStatusFilter<$PrismaModel>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type StaffLoginLookupCreateNestedManyWithoutTenantInput = {
    create?: XOR<StaffLoginLookupCreateWithoutTenantInput, StaffLoginLookupUncheckedCreateWithoutTenantInput> | StaffLoginLookupCreateWithoutTenantInput[] | StaffLoginLookupUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: StaffLoginLookupCreateOrConnectWithoutTenantInput | StaffLoginLookupCreateOrConnectWithoutTenantInput[]
    createMany?: StaffLoginLookupCreateManyTenantInputEnvelope
    connect?: StaffLoginLookupWhereUniqueInput | StaffLoginLookupWhereUniqueInput[]
  }

  export type TenantSubscriptionCreateNestedManyWithoutTenantInput = {
    create?: XOR<TenantSubscriptionCreateWithoutTenantInput, TenantSubscriptionUncheckedCreateWithoutTenantInput> | TenantSubscriptionCreateWithoutTenantInput[] | TenantSubscriptionUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: TenantSubscriptionCreateOrConnectWithoutTenantInput | TenantSubscriptionCreateOrConnectWithoutTenantInput[]
    createMany?: TenantSubscriptionCreateManyTenantInputEnvelope
    connect?: TenantSubscriptionWhereUniqueInput | TenantSubscriptionWhereUniqueInput[]
  }

  export type BillingInvoiceCreateNestedManyWithoutTenantInput = {
    create?: XOR<BillingInvoiceCreateWithoutTenantInput, BillingInvoiceUncheckedCreateWithoutTenantInput> | BillingInvoiceCreateWithoutTenantInput[] | BillingInvoiceUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: BillingInvoiceCreateOrConnectWithoutTenantInput | BillingInvoiceCreateOrConnectWithoutTenantInput[]
    createMany?: BillingInvoiceCreateManyTenantInputEnvelope
    connect?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
  }

  export type BillingPaymentCreateNestedManyWithoutTenantInput = {
    create?: XOR<BillingPaymentCreateWithoutTenantInput, BillingPaymentUncheckedCreateWithoutTenantInput> | BillingPaymentCreateWithoutTenantInput[] | BillingPaymentUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: BillingPaymentCreateOrConnectWithoutTenantInput | BillingPaymentCreateOrConnectWithoutTenantInput[]
    createMany?: BillingPaymentCreateManyTenantInputEnvelope
    connect?: BillingPaymentWhereUniqueInput | BillingPaymentWhereUniqueInput[]
  }

  export type SubscriptionPlanChangeRequestCreateNestedManyWithoutTenantInput = {
    create?: XOR<SubscriptionPlanChangeRequestCreateWithoutTenantInput, SubscriptionPlanChangeRequestUncheckedCreateWithoutTenantInput> | SubscriptionPlanChangeRequestCreateWithoutTenantInput[] | SubscriptionPlanChangeRequestUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: SubscriptionPlanChangeRequestCreateOrConnectWithoutTenantInput | SubscriptionPlanChangeRequestCreateOrConnectWithoutTenantInput[]
    createMany?: SubscriptionPlanChangeRequestCreateManyTenantInputEnvelope
    connect?: SubscriptionPlanChangeRequestWhereUniqueInput | SubscriptionPlanChangeRequestWhereUniqueInput[]
  }

  export type StaffLoginLookupUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<StaffLoginLookupCreateWithoutTenantInput, StaffLoginLookupUncheckedCreateWithoutTenantInput> | StaffLoginLookupCreateWithoutTenantInput[] | StaffLoginLookupUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: StaffLoginLookupCreateOrConnectWithoutTenantInput | StaffLoginLookupCreateOrConnectWithoutTenantInput[]
    createMany?: StaffLoginLookupCreateManyTenantInputEnvelope
    connect?: StaffLoginLookupWhereUniqueInput | StaffLoginLookupWhereUniqueInput[]
  }

  export type TenantSubscriptionUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<TenantSubscriptionCreateWithoutTenantInput, TenantSubscriptionUncheckedCreateWithoutTenantInput> | TenantSubscriptionCreateWithoutTenantInput[] | TenantSubscriptionUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: TenantSubscriptionCreateOrConnectWithoutTenantInput | TenantSubscriptionCreateOrConnectWithoutTenantInput[]
    createMany?: TenantSubscriptionCreateManyTenantInputEnvelope
    connect?: TenantSubscriptionWhereUniqueInput | TenantSubscriptionWhereUniqueInput[]
  }

  export type BillingInvoiceUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<BillingInvoiceCreateWithoutTenantInput, BillingInvoiceUncheckedCreateWithoutTenantInput> | BillingInvoiceCreateWithoutTenantInput[] | BillingInvoiceUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: BillingInvoiceCreateOrConnectWithoutTenantInput | BillingInvoiceCreateOrConnectWithoutTenantInput[]
    createMany?: BillingInvoiceCreateManyTenantInputEnvelope
    connect?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
  }

  export type BillingPaymentUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<BillingPaymentCreateWithoutTenantInput, BillingPaymentUncheckedCreateWithoutTenantInput> | BillingPaymentCreateWithoutTenantInput[] | BillingPaymentUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: BillingPaymentCreateOrConnectWithoutTenantInput | BillingPaymentCreateOrConnectWithoutTenantInput[]
    createMany?: BillingPaymentCreateManyTenantInputEnvelope
    connect?: BillingPaymentWhereUniqueInput | BillingPaymentWhereUniqueInput[]
  }

  export type SubscriptionPlanChangeRequestUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<SubscriptionPlanChangeRequestCreateWithoutTenantInput, SubscriptionPlanChangeRequestUncheckedCreateWithoutTenantInput> | SubscriptionPlanChangeRequestCreateWithoutTenantInput[] | SubscriptionPlanChangeRequestUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: SubscriptionPlanChangeRequestCreateOrConnectWithoutTenantInput | SubscriptionPlanChangeRequestCreateOrConnectWithoutTenantInput[]
    createMany?: SubscriptionPlanChangeRequestCreateManyTenantInputEnvelope
    connect?: SubscriptionPlanChangeRequestWhereUniqueInput | SubscriptionPlanChangeRequestWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumTenantStatusFieldUpdateOperationsInput = {
    set?: $Enums.TenantStatus
  }

  export type StaffLoginLookupUpdateManyWithoutTenantNestedInput = {
    create?: XOR<StaffLoginLookupCreateWithoutTenantInput, StaffLoginLookupUncheckedCreateWithoutTenantInput> | StaffLoginLookupCreateWithoutTenantInput[] | StaffLoginLookupUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: StaffLoginLookupCreateOrConnectWithoutTenantInput | StaffLoginLookupCreateOrConnectWithoutTenantInput[]
    upsert?: StaffLoginLookupUpsertWithWhereUniqueWithoutTenantInput | StaffLoginLookupUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: StaffLoginLookupCreateManyTenantInputEnvelope
    set?: StaffLoginLookupWhereUniqueInput | StaffLoginLookupWhereUniqueInput[]
    disconnect?: StaffLoginLookupWhereUniqueInput | StaffLoginLookupWhereUniqueInput[]
    delete?: StaffLoginLookupWhereUniqueInput | StaffLoginLookupWhereUniqueInput[]
    connect?: StaffLoginLookupWhereUniqueInput | StaffLoginLookupWhereUniqueInput[]
    update?: StaffLoginLookupUpdateWithWhereUniqueWithoutTenantInput | StaffLoginLookupUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: StaffLoginLookupUpdateManyWithWhereWithoutTenantInput | StaffLoginLookupUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: StaffLoginLookupScalarWhereInput | StaffLoginLookupScalarWhereInput[]
  }

  export type TenantSubscriptionUpdateManyWithoutTenantNestedInput = {
    create?: XOR<TenantSubscriptionCreateWithoutTenantInput, TenantSubscriptionUncheckedCreateWithoutTenantInput> | TenantSubscriptionCreateWithoutTenantInput[] | TenantSubscriptionUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: TenantSubscriptionCreateOrConnectWithoutTenantInput | TenantSubscriptionCreateOrConnectWithoutTenantInput[]
    upsert?: TenantSubscriptionUpsertWithWhereUniqueWithoutTenantInput | TenantSubscriptionUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: TenantSubscriptionCreateManyTenantInputEnvelope
    set?: TenantSubscriptionWhereUniqueInput | TenantSubscriptionWhereUniqueInput[]
    disconnect?: TenantSubscriptionWhereUniqueInput | TenantSubscriptionWhereUniqueInput[]
    delete?: TenantSubscriptionWhereUniqueInput | TenantSubscriptionWhereUniqueInput[]
    connect?: TenantSubscriptionWhereUniqueInput | TenantSubscriptionWhereUniqueInput[]
    update?: TenantSubscriptionUpdateWithWhereUniqueWithoutTenantInput | TenantSubscriptionUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: TenantSubscriptionUpdateManyWithWhereWithoutTenantInput | TenantSubscriptionUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: TenantSubscriptionScalarWhereInput | TenantSubscriptionScalarWhereInput[]
  }

  export type BillingInvoiceUpdateManyWithoutTenantNestedInput = {
    create?: XOR<BillingInvoiceCreateWithoutTenantInput, BillingInvoiceUncheckedCreateWithoutTenantInput> | BillingInvoiceCreateWithoutTenantInput[] | BillingInvoiceUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: BillingInvoiceCreateOrConnectWithoutTenantInput | BillingInvoiceCreateOrConnectWithoutTenantInput[]
    upsert?: BillingInvoiceUpsertWithWhereUniqueWithoutTenantInput | BillingInvoiceUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: BillingInvoiceCreateManyTenantInputEnvelope
    set?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
    disconnect?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
    delete?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
    connect?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
    update?: BillingInvoiceUpdateWithWhereUniqueWithoutTenantInput | BillingInvoiceUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: BillingInvoiceUpdateManyWithWhereWithoutTenantInput | BillingInvoiceUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: BillingInvoiceScalarWhereInput | BillingInvoiceScalarWhereInput[]
  }

  export type BillingPaymentUpdateManyWithoutTenantNestedInput = {
    create?: XOR<BillingPaymentCreateWithoutTenantInput, BillingPaymentUncheckedCreateWithoutTenantInput> | BillingPaymentCreateWithoutTenantInput[] | BillingPaymentUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: BillingPaymentCreateOrConnectWithoutTenantInput | BillingPaymentCreateOrConnectWithoutTenantInput[]
    upsert?: BillingPaymentUpsertWithWhereUniqueWithoutTenantInput | BillingPaymentUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: BillingPaymentCreateManyTenantInputEnvelope
    set?: BillingPaymentWhereUniqueInput | BillingPaymentWhereUniqueInput[]
    disconnect?: BillingPaymentWhereUniqueInput | BillingPaymentWhereUniqueInput[]
    delete?: BillingPaymentWhereUniqueInput | BillingPaymentWhereUniqueInput[]
    connect?: BillingPaymentWhereUniqueInput | BillingPaymentWhereUniqueInput[]
    update?: BillingPaymentUpdateWithWhereUniqueWithoutTenantInput | BillingPaymentUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: BillingPaymentUpdateManyWithWhereWithoutTenantInput | BillingPaymentUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: BillingPaymentScalarWhereInput | BillingPaymentScalarWhereInput[]
  }

  export type SubscriptionPlanChangeRequestUpdateManyWithoutTenantNestedInput = {
    create?: XOR<SubscriptionPlanChangeRequestCreateWithoutTenantInput, SubscriptionPlanChangeRequestUncheckedCreateWithoutTenantInput> | SubscriptionPlanChangeRequestCreateWithoutTenantInput[] | SubscriptionPlanChangeRequestUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: SubscriptionPlanChangeRequestCreateOrConnectWithoutTenantInput | SubscriptionPlanChangeRequestCreateOrConnectWithoutTenantInput[]
    upsert?: SubscriptionPlanChangeRequestUpsertWithWhereUniqueWithoutTenantInput | SubscriptionPlanChangeRequestUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: SubscriptionPlanChangeRequestCreateManyTenantInputEnvelope
    set?: SubscriptionPlanChangeRequestWhereUniqueInput | SubscriptionPlanChangeRequestWhereUniqueInput[]
    disconnect?: SubscriptionPlanChangeRequestWhereUniqueInput | SubscriptionPlanChangeRequestWhereUniqueInput[]
    delete?: SubscriptionPlanChangeRequestWhereUniqueInput | SubscriptionPlanChangeRequestWhereUniqueInput[]
    connect?: SubscriptionPlanChangeRequestWhereUniqueInput | SubscriptionPlanChangeRequestWhereUniqueInput[]
    update?: SubscriptionPlanChangeRequestUpdateWithWhereUniqueWithoutTenantInput | SubscriptionPlanChangeRequestUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: SubscriptionPlanChangeRequestUpdateManyWithWhereWithoutTenantInput | SubscriptionPlanChangeRequestUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: SubscriptionPlanChangeRequestScalarWhereInput | SubscriptionPlanChangeRequestScalarWhereInput[]
  }

  export type StaffLoginLookupUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<StaffLoginLookupCreateWithoutTenantInput, StaffLoginLookupUncheckedCreateWithoutTenantInput> | StaffLoginLookupCreateWithoutTenantInput[] | StaffLoginLookupUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: StaffLoginLookupCreateOrConnectWithoutTenantInput | StaffLoginLookupCreateOrConnectWithoutTenantInput[]
    upsert?: StaffLoginLookupUpsertWithWhereUniqueWithoutTenantInput | StaffLoginLookupUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: StaffLoginLookupCreateManyTenantInputEnvelope
    set?: StaffLoginLookupWhereUniqueInput | StaffLoginLookupWhereUniqueInput[]
    disconnect?: StaffLoginLookupWhereUniqueInput | StaffLoginLookupWhereUniqueInput[]
    delete?: StaffLoginLookupWhereUniqueInput | StaffLoginLookupWhereUniqueInput[]
    connect?: StaffLoginLookupWhereUniqueInput | StaffLoginLookupWhereUniqueInput[]
    update?: StaffLoginLookupUpdateWithWhereUniqueWithoutTenantInput | StaffLoginLookupUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: StaffLoginLookupUpdateManyWithWhereWithoutTenantInput | StaffLoginLookupUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: StaffLoginLookupScalarWhereInput | StaffLoginLookupScalarWhereInput[]
  }

  export type TenantSubscriptionUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<TenantSubscriptionCreateWithoutTenantInput, TenantSubscriptionUncheckedCreateWithoutTenantInput> | TenantSubscriptionCreateWithoutTenantInput[] | TenantSubscriptionUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: TenantSubscriptionCreateOrConnectWithoutTenantInput | TenantSubscriptionCreateOrConnectWithoutTenantInput[]
    upsert?: TenantSubscriptionUpsertWithWhereUniqueWithoutTenantInput | TenantSubscriptionUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: TenantSubscriptionCreateManyTenantInputEnvelope
    set?: TenantSubscriptionWhereUniqueInput | TenantSubscriptionWhereUniqueInput[]
    disconnect?: TenantSubscriptionWhereUniqueInput | TenantSubscriptionWhereUniqueInput[]
    delete?: TenantSubscriptionWhereUniqueInput | TenantSubscriptionWhereUniqueInput[]
    connect?: TenantSubscriptionWhereUniqueInput | TenantSubscriptionWhereUniqueInput[]
    update?: TenantSubscriptionUpdateWithWhereUniqueWithoutTenantInput | TenantSubscriptionUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: TenantSubscriptionUpdateManyWithWhereWithoutTenantInput | TenantSubscriptionUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: TenantSubscriptionScalarWhereInput | TenantSubscriptionScalarWhereInput[]
  }

  export type BillingInvoiceUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<BillingInvoiceCreateWithoutTenantInput, BillingInvoiceUncheckedCreateWithoutTenantInput> | BillingInvoiceCreateWithoutTenantInput[] | BillingInvoiceUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: BillingInvoiceCreateOrConnectWithoutTenantInput | BillingInvoiceCreateOrConnectWithoutTenantInput[]
    upsert?: BillingInvoiceUpsertWithWhereUniqueWithoutTenantInput | BillingInvoiceUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: BillingInvoiceCreateManyTenantInputEnvelope
    set?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
    disconnect?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
    delete?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
    connect?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
    update?: BillingInvoiceUpdateWithWhereUniqueWithoutTenantInput | BillingInvoiceUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: BillingInvoiceUpdateManyWithWhereWithoutTenantInput | BillingInvoiceUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: BillingInvoiceScalarWhereInput | BillingInvoiceScalarWhereInput[]
  }

  export type BillingPaymentUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<BillingPaymentCreateWithoutTenantInput, BillingPaymentUncheckedCreateWithoutTenantInput> | BillingPaymentCreateWithoutTenantInput[] | BillingPaymentUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: BillingPaymentCreateOrConnectWithoutTenantInput | BillingPaymentCreateOrConnectWithoutTenantInput[]
    upsert?: BillingPaymentUpsertWithWhereUniqueWithoutTenantInput | BillingPaymentUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: BillingPaymentCreateManyTenantInputEnvelope
    set?: BillingPaymentWhereUniqueInput | BillingPaymentWhereUniqueInput[]
    disconnect?: BillingPaymentWhereUniqueInput | BillingPaymentWhereUniqueInput[]
    delete?: BillingPaymentWhereUniqueInput | BillingPaymentWhereUniqueInput[]
    connect?: BillingPaymentWhereUniqueInput | BillingPaymentWhereUniqueInput[]
    update?: BillingPaymentUpdateWithWhereUniqueWithoutTenantInput | BillingPaymentUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: BillingPaymentUpdateManyWithWhereWithoutTenantInput | BillingPaymentUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: BillingPaymentScalarWhereInput | BillingPaymentScalarWhereInput[]
  }

  export type SubscriptionPlanChangeRequestUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<SubscriptionPlanChangeRequestCreateWithoutTenantInput, SubscriptionPlanChangeRequestUncheckedCreateWithoutTenantInput> | SubscriptionPlanChangeRequestCreateWithoutTenantInput[] | SubscriptionPlanChangeRequestUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: SubscriptionPlanChangeRequestCreateOrConnectWithoutTenantInput | SubscriptionPlanChangeRequestCreateOrConnectWithoutTenantInput[]
    upsert?: SubscriptionPlanChangeRequestUpsertWithWhereUniqueWithoutTenantInput | SubscriptionPlanChangeRequestUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: SubscriptionPlanChangeRequestCreateManyTenantInputEnvelope
    set?: SubscriptionPlanChangeRequestWhereUniqueInput | SubscriptionPlanChangeRequestWhereUniqueInput[]
    disconnect?: SubscriptionPlanChangeRequestWhereUniqueInput | SubscriptionPlanChangeRequestWhereUniqueInput[]
    delete?: SubscriptionPlanChangeRequestWhereUniqueInput | SubscriptionPlanChangeRequestWhereUniqueInput[]
    connect?: SubscriptionPlanChangeRequestWhereUniqueInput | SubscriptionPlanChangeRequestWhereUniqueInput[]
    update?: SubscriptionPlanChangeRequestUpdateWithWhereUniqueWithoutTenantInput | SubscriptionPlanChangeRequestUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: SubscriptionPlanChangeRequestUpdateManyWithWhereWithoutTenantInput | SubscriptionPlanChangeRequestUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: SubscriptionPlanChangeRequestScalarWhereInput | SubscriptionPlanChangeRequestScalarWhereInput[]
  }

  export type TenantCreateNestedOneWithoutStaffLoginLookupsInput = {
    create?: XOR<TenantCreateWithoutStaffLoginLookupsInput, TenantUncheckedCreateWithoutStaffLoginLookupsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutStaffLoginLookupsInput
    connect?: TenantWhereUniqueInput
  }

  export type TenantUpdateOneRequiredWithoutStaffLoginLookupsNestedInput = {
    create?: XOR<TenantCreateWithoutStaffLoginLookupsInput, TenantUncheckedCreateWithoutStaffLoginLookupsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutStaffLoginLookupsInput
    upsert?: TenantUpsertWithoutStaffLoginLookupsInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutStaffLoginLookupsInput, TenantUpdateWithoutStaffLoginLookupsInput>, TenantUncheckedUpdateWithoutStaffLoginLookupsInput>
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type TenantSubscriptionCreateNestedManyWithoutPlanInput = {
    create?: XOR<TenantSubscriptionCreateWithoutPlanInput, TenantSubscriptionUncheckedCreateWithoutPlanInput> | TenantSubscriptionCreateWithoutPlanInput[] | TenantSubscriptionUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: TenantSubscriptionCreateOrConnectWithoutPlanInput | TenantSubscriptionCreateOrConnectWithoutPlanInput[]
    createMany?: TenantSubscriptionCreateManyPlanInputEnvelope
    connect?: TenantSubscriptionWhereUniqueInput | TenantSubscriptionWhereUniqueInput[]
  }

  export type BillingInvoiceCreateNestedManyWithoutPlanInput = {
    create?: XOR<BillingInvoiceCreateWithoutPlanInput, BillingInvoiceUncheckedCreateWithoutPlanInput> | BillingInvoiceCreateWithoutPlanInput[] | BillingInvoiceUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: BillingInvoiceCreateOrConnectWithoutPlanInput | BillingInvoiceCreateOrConnectWithoutPlanInput[]
    createMany?: BillingInvoiceCreateManyPlanInputEnvelope
    connect?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
  }

  export type SubscriptionPlanChangeRequestCreateNestedManyWithoutRequestedPlanInput = {
    create?: XOR<SubscriptionPlanChangeRequestCreateWithoutRequestedPlanInput, SubscriptionPlanChangeRequestUncheckedCreateWithoutRequestedPlanInput> | SubscriptionPlanChangeRequestCreateWithoutRequestedPlanInput[] | SubscriptionPlanChangeRequestUncheckedCreateWithoutRequestedPlanInput[]
    connectOrCreate?: SubscriptionPlanChangeRequestCreateOrConnectWithoutRequestedPlanInput | SubscriptionPlanChangeRequestCreateOrConnectWithoutRequestedPlanInput[]
    createMany?: SubscriptionPlanChangeRequestCreateManyRequestedPlanInputEnvelope
    connect?: SubscriptionPlanChangeRequestWhereUniqueInput | SubscriptionPlanChangeRequestWhereUniqueInput[]
  }

  export type TenantSubscriptionUncheckedCreateNestedManyWithoutPlanInput = {
    create?: XOR<TenantSubscriptionCreateWithoutPlanInput, TenantSubscriptionUncheckedCreateWithoutPlanInput> | TenantSubscriptionCreateWithoutPlanInput[] | TenantSubscriptionUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: TenantSubscriptionCreateOrConnectWithoutPlanInput | TenantSubscriptionCreateOrConnectWithoutPlanInput[]
    createMany?: TenantSubscriptionCreateManyPlanInputEnvelope
    connect?: TenantSubscriptionWhereUniqueInput | TenantSubscriptionWhereUniqueInput[]
  }

  export type BillingInvoiceUncheckedCreateNestedManyWithoutPlanInput = {
    create?: XOR<BillingInvoiceCreateWithoutPlanInput, BillingInvoiceUncheckedCreateWithoutPlanInput> | BillingInvoiceCreateWithoutPlanInput[] | BillingInvoiceUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: BillingInvoiceCreateOrConnectWithoutPlanInput | BillingInvoiceCreateOrConnectWithoutPlanInput[]
    createMany?: BillingInvoiceCreateManyPlanInputEnvelope
    connect?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
  }

  export type SubscriptionPlanChangeRequestUncheckedCreateNestedManyWithoutRequestedPlanInput = {
    create?: XOR<SubscriptionPlanChangeRequestCreateWithoutRequestedPlanInput, SubscriptionPlanChangeRequestUncheckedCreateWithoutRequestedPlanInput> | SubscriptionPlanChangeRequestCreateWithoutRequestedPlanInput[] | SubscriptionPlanChangeRequestUncheckedCreateWithoutRequestedPlanInput[]
    connectOrCreate?: SubscriptionPlanChangeRequestCreateOrConnectWithoutRequestedPlanInput | SubscriptionPlanChangeRequestCreateOrConnectWithoutRequestedPlanInput[]
    createMany?: SubscriptionPlanChangeRequestCreateManyRequestedPlanInputEnvelope
    connect?: SubscriptionPlanChangeRequestWhereUniqueInput | SubscriptionPlanChangeRequestWhereUniqueInput[]
  }

  export type EnumBillingIntervalFieldUpdateOperationsInput = {
    set?: $Enums.BillingInterval
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type TenantSubscriptionUpdateManyWithoutPlanNestedInput = {
    create?: XOR<TenantSubscriptionCreateWithoutPlanInput, TenantSubscriptionUncheckedCreateWithoutPlanInput> | TenantSubscriptionCreateWithoutPlanInput[] | TenantSubscriptionUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: TenantSubscriptionCreateOrConnectWithoutPlanInput | TenantSubscriptionCreateOrConnectWithoutPlanInput[]
    upsert?: TenantSubscriptionUpsertWithWhereUniqueWithoutPlanInput | TenantSubscriptionUpsertWithWhereUniqueWithoutPlanInput[]
    createMany?: TenantSubscriptionCreateManyPlanInputEnvelope
    set?: TenantSubscriptionWhereUniqueInput | TenantSubscriptionWhereUniqueInput[]
    disconnect?: TenantSubscriptionWhereUniqueInput | TenantSubscriptionWhereUniqueInput[]
    delete?: TenantSubscriptionWhereUniqueInput | TenantSubscriptionWhereUniqueInput[]
    connect?: TenantSubscriptionWhereUniqueInput | TenantSubscriptionWhereUniqueInput[]
    update?: TenantSubscriptionUpdateWithWhereUniqueWithoutPlanInput | TenantSubscriptionUpdateWithWhereUniqueWithoutPlanInput[]
    updateMany?: TenantSubscriptionUpdateManyWithWhereWithoutPlanInput | TenantSubscriptionUpdateManyWithWhereWithoutPlanInput[]
    deleteMany?: TenantSubscriptionScalarWhereInput | TenantSubscriptionScalarWhereInput[]
  }

  export type BillingInvoiceUpdateManyWithoutPlanNestedInput = {
    create?: XOR<BillingInvoiceCreateWithoutPlanInput, BillingInvoiceUncheckedCreateWithoutPlanInput> | BillingInvoiceCreateWithoutPlanInput[] | BillingInvoiceUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: BillingInvoiceCreateOrConnectWithoutPlanInput | BillingInvoiceCreateOrConnectWithoutPlanInput[]
    upsert?: BillingInvoiceUpsertWithWhereUniqueWithoutPlanInput | BillingInvoiceUpsertWithWhereUniqueWithoutPlanInput[]
    createMany?: BillingInvoiceCreateManyPlanInputEnvelope
    set?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
    disconnect?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
    delete?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
    connect?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
    update?: BillingInvoiceUpdateWithWhereUniqueWithoutPlanInput | BillingInvoiceUpdateWithWhereUniqueWithoutPlanInput[]
    updateMany?: BillingInvoiceUpdateManyWithWhereWithoutPlanInput | BillingInvoiceUpdateManyWithWhereWithoutPlanInput[]
    deleteMany?: BillingInvoiceScalarWhereInput | BillingInvoiceScalarWhereInput[]
  }

  export type SubscriptionPlanChangeRequestUpdateManyWithoutRequestedPlanNestedInput = {
    create?: XOR<SubscriptionPlanChangeRequestCreateWithoutRequestedPlanInput, SubscriptionPlanChangeRequestUncheckedCreateWithoutRequestedPlanInput> | SubscriptionPlanChangeRequestCreateWithoutRequestedPlanInput[] | SubscriptionPlanChangeRequestUncheckedCreateWithoutRequestedPlanInput[]
    connectOrCreate?: SubscriptionPlanChangeRequestCreateOrConnectWithoutRequestedPlanInput | SubscriptionPlanChangeRequestCreateOrConnectWithoutRequestedPlanInput[]
    upsert?: SubscriptionPlanChangeRequestUpsertWithWhereUniqueWithoutRequestedPlanInput | SubscriptionPlanChangeRequestUpsertWithWhereUniqueWithoutRequestedPlanInput[]
    createMany?: SubscriptionPlanChangeRequestCreateManyRequestedPlanInputEnvelope
    set?: SubscriptionPlanChangeRequestWhereUniqueInput | SubscriptionPlanChangeRequestWhereUniqueInput[]
    disconnect?: SubscriptionPlanChangeRequestWhereUniqueInput | SubscriptionPlanChangeRequestWhereUniqueInput[]
    delete?: SubscriptionPlanChangeRequestWhereUniqueInput | SubscriptionPlanChangeRequestWhereUniqueInput[]
    connect?: SubscriptionPlanChangeRequestWhereUniqueInput | SubscriptionPlanChangeRequestWhereUniqueInput[]
    update?: SubscriptionPlanChangeRequestUpdateWithWhereUniqueWithoutRequestedPlanInput | SubscriptionPlanChangeRequestUpdateWithWhereUniqueWithoutRequestedPlanInput[]
    updateMany?: SubscriptionPlanChangeRequestUpdateManyWithWhereWithoutRequestedPlanInput | SubscriptionPlanChangeRequestUpdateManyWithWhereWithoutRequestedPlanInput[]
    deleteMany?: SubscriptionPlanChangeRequestScalarWhereInput | SubscriptionPlanChangeRequestScalarWhereInput[]
  }

  export type TenantSubscriptionUncheckedUpdateManyWithoutPlanNestedInput = {
    create?: XOR<TenantSubscriptionCreateWithoutPlanInput, TenantSubscriptionUncheckedCreateWithoutPlanInput> | TenantSubscriptionCreateWithoutPlanInput[] | TenantSubscriptionUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: TenantSubscriptionCreateOrConnectWithoutPlanInput | TenantSubscriptionCreateOrConnectWithoutPlanInput[]
    upsert?: TenantSubscriptionUpsertWithWhereUniqueWithoutPlanInput | TenantSubscriptionUpsertWithWhereUniqueWithoutPlanInput[]
    createMany?: TenantSubscriptionCreateManyPlanInputEnvelope
    set?: TenantSubscriptionWhereUniqueInput | TenantSubscriptionWhereUniqueInput[]
    disconnect?: TenantSubscriptionWhereUniqueInput | TenantSubscriptionWhereUniqueInput[]
    delete?: TenantSubscriptionWhereUniqueInput | TenantSubscriptionWhereUniqueInput[]
    connect?: TenantSubscriptionWhereUniqueInput | TenantSubscriptionWhereUniqueInput[]
    update?: TenantSubscriptionUpdateWithWhereUniqueWithoutPlanInput | TenantSubscriptionUpdateWithWhereUniqueWithoutPlanInput[]
    updateMany?: TenantSubscriptionUpdateManyWithWhereWithoutPlanInput | TenantSubscriptionUpdateManyWithWhereWithoutPlanInput[]
    deleteMany?: TenantSubscriptionScalarWhereInput | TenantSubscriptionScalarWhereInput[]
  }

  export type BillingInvoiceUncheckedUpdateManyWithoutPlanNestedInput = {
    create?: XOR<BillingInvoiceCreateWithoutPlanInput, BillingInvoiceUncheckedCreateWithoutPlanInput> | BillingInvoiceCreateWithoutPlanInput[] | BillingInvoiceUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: BillingInvoiceCreateOrConnectWithoutPlanInput | BillingInvoiceCreateOrConnectWithoutPlanInput[]
    upsert?: BillingInvoiceUpsertWithWhereUniqueWithoutPlanInput | BillingInvoiceUpsertWithWhereUniqueWithoutPlanInput[]
    createMany?: BillingInvoiceCreateManyPlanInputEnvelope
    set?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
    disconnect?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
    delete?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
    connect?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
    update?: BillingInvoiceUpdateWithWhereUniqueWithoutPlanInput | BillingInvoiceUpdateWithWhereUniqueWithoutPlanInput[]
    updateMany?: BillingInvoiceUpdateManyWithWhereWithoutPlanInput | BillingInvoiceUpdateManyWithWhereWithoutPlanInput[]
    deleteMany?: BillingInvoiceScalarWhereInput | BillingInvoiceScalarWhereInput[]
  }

  export type SubscriptionPlanChangeRequestUncheckedUpdateManyWithoutRequestedPlanNestedInput = {
    create?: XOR<SubscriptionPlanChangeRequestCreateWithoutRequestedPlanInput, SubscriptionPlanChangeRequestUncheckedCreateWithoutRequestedPlanInput> | SubscriptionPlanChangeRequestCreateWithoutRequestedPlanInput[] | SubscriptionPlanChangeRequestUncheckedCreateWithoutRequestedPlanInput[]
    connectOrCreate?: SubscriptionPlanChangeRequestCreateOrConnectWithoutRequestedPlanInput | SubscriptionPlanChangeRequestCreateOrConnectWithoutRequestedPlanInput[]
    upsert?: SubscriptionPlanChangeRequestUpsertWithWhereUniqueWithoutRequestedPlanInput | SubscriptionPlanChangeRequestUpsertWithWhereUniqueWithoutRequestedPlanInput[]
    createMany?: SubscriptionPlanChangeRequestCreateManyRequestedPlanInputEnvelope
    set?: SubscriptionPlanChangeRequestWhereUniqueInput | SubscriptionPlanChangeRequestWhereUniqueInput[]
    disconnect?: SubscriptionPlanChangeRequestWhereUniqueInput | SubscriptionPlanChangeRequestWhereUniqueInput[]
    delete?: SubscriptionPlanChangeRequestWhereUniqueInput | SubscriptionPlanChangeRequestWhereUniqueInput[]
    connect?: SubscriptionPlanChangeRequestWhereUniqueInput | SubscriptionPlanChangeRequestWhereUniqueInput[]
    update?: SubscriptionPlanChangeRequestUpdateWithWhereUniqueWithoutRequestedPlanInput | SubscriptionPlanChangeRequestUpdateWithWhereUniqueWithoutRequestedPlanInput[]
    updateMany?: SubscriptionPlanChangeRequestUpdateManyWithWhereWithoutRequestedPlanInput | SubscriptionPlanChangeRequestUpdateManyWithWhereWithoutRequestedPlanInput[]
    deleteMany?: SubscriptionPlanChangeRequestScalarWhereInput | SubscriptionPlanChangeRequestScalarWhereInput[]
  }

  export type TenantCreateNestedOneWithoutSubscriptionInput = {
    create?: XOR<TenantCreateWithoutSubscriptionInput, TenantUncheckedCreateWithoutSubscriptionInput>
    connectOrCreate?: TenantCreateOrConnectWithoutSubscriptionInput
    connect?: TenantWhereUniqueInput
  }

  export type SubscriptionPlanCreateNestedOneWithoutTenantSubscriptionsInput = {
    create?: XOR<SubscriptionPlanCreateWithoutTenantSubscriptionsInput, SubscriptionPlanUncheckedCreateWithoutTenantSubscriptionsInput>
    connectOrCreate?: SubscriptionPlanCreateOrConnectWithoutTenantSubscriptionsInput
    connect?: SubscriptionPlanWhereUniqueInput
  }

  export type BillingInvoiceCreateNestedManyWithoutSubscriptionInput = {
    create?: XOR<BillingInvoiceCreateWithoutSubscriptionInput, BillingInvoiceUncheckedCreateWithoutSubscriptionInput> | BillingInvoiceCreateWithoutSubscriptionInput[] | BillingInvoiceUncheckedCreateWithoutSubscriptionInput[]
    connectOrCreate?: BillingInvoiceCreateOrConnectWithoutSubscriptionInput | BillingInvoiceCreateOrConnectWithoutSubscriptionInput[]
    createMany?: BillingInvoiceCreateManySubscriptionInputEnvelope
    connect?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
  }

  export type SubscriptionPlanChangeRequestCreateNestedManyWithoutCurrentSubscriptionInput = {
    create?: XOR<SubscriptionPlanChangeRequestCreateWithoutCurrentSubscriptionInput, SubscriptionPlanChangeRequestUncheckedCreateWithoutCurrentSubscriptionInput> | SubscriptionPlanChangeRequestCreateWithoutCurrentSubscriptionInput[] | SubscriptionPlanChangeRequestUncheckedCreateWithoutCurrentSubscriptionInput[]
    connectOrCreate?: SubscriptionPlanChangeRequestCreateOrConnectWithoutCurrentSubscriptionInput | SubscriptionPlanChangeRequestCreateOrConnectWithoutCurrentSubscriptionInput[]
    createMany?: SubscriptionPlanChangeRequestCreateManyCurrentSubscriptionInputEnvelope
    connect?: SubscriptionPlanChangeRequestWhereUniqueInput | SubscriptionPlanChangeRequestWhereUniqueInput[]
  }

  export type BillingInvoiceUncheckedCreateNestedManyWithoutSubscriptionInput = {
    create?: XOR<BillingInvoiceCreateWithoutSubscriptionInput, BillingInvoiceUncheckedCreateWithoutSubscriptionInput> | BillingInvoiceCreateWithoutSubscriptionInput[] | BillingInvoiceUncheckedCreateWithoutSubscriptionInput[]
    connectOrCreate?: BillingInvoiceCreateOrConnectWithoutSubscriptionInput | BillingInvoiceCreateOrConnectWithoutSubscriptionInput[]
    createMany?: BillingInvoiceCreateManySubscriptionInputEnvelope
    connect?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
  }

  export type SubscriptionPlanChangeRequestUncheckedCreateNestedManyWithoutCurrentSubscriptionInput = {
    create?: XOR<SubscriptionPlanChangeRequestCreateWithoutCurrentSubscriptionInput, SubscriptionPlanChangeRequestUncheckedCreateWithoutCurrentSubscriptionInput> | SubscriptionPlanChangeRequestCreateWithoutCurrentSubscriptionInput[] | SubscriptionPlanChangeRequestUncheckedCreateWithoutCurrentSubscriptionInput[]
    connectOrCreate?: SubscriptionPlanChangeRequestCreateOrConnectWithoutCurrentSubscriptionInput | SubscriptionPlanChangeRequestCreateOrConnectWithoutCurrentSubscriptionInput[]
    createMany?: SubscriptionPlanChangeRequestCreateManyCurrentSubscriptionInputEnvelope
    connect?: SubscriptionPlanChangeRequestWhereUniqueInput | SubscriptionPlanChangeRequestWhereUniqueInput[]
  }

  export type EnumSubscriptionStatusFieldUpdateOperationsInput = {
    set?: $Enums.SubscriptionStatus
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type TenantUpdateOneRequiredWithoutSubscriptionNestedInput = {
    create?: XOR<TenantCreateWithoutSubscriptionInput, TenantUncheckedCreateWithoutSubscriptionInput>
    connectOrCreate?: TenantCreateOrConnectWithoutSubscriptionInput
    upsert?: TenantUpsertWithoutSubscriptionInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutSubscriptionInput, TenantUpdateWithoutSubscriptionInput>, TenantUncheckedUpdateWithoutSubscriptionInput>
  }

  export type SubscriptionPlanUpdateOneRequiredWithoutTenantSubscriptionsNestedInput = {
    create?: XOR<SubscriptionPlanCreateWithoutTenantSubscriptionsInput, SubscriptionPlanUncheckedCreateWithoutTenantSubscriptionsInput>
    connectOrCreate?: SubscriptionPlanCreateOrConnectWithoutTenantSubscriptionsInput
    upsert?: SubscriptionPlanUpsertWithoutTenantSubscriptionsInput
    connect?: SubscriptionPlanWhereUniqueInput
    update?: XOR<XOR<SubscriptionPlanUpdateToOneWithWhereWithoutTenantSubscriptionsInput, SubscriptionPlanUpdateWithoutTenantSubscriptionsInput>, SubscriptionPlanUncheckedUpdateWithoutTenantSubscriptionsInput>
  }

  export type BillingInvoiceUpdateManyWithoutSubscriptionNestedInput = {
    create?: XOR<BillingInvoiceCreateWithoutSubscriptionInput, BillingInvoiceUncheckedCreateWithoutSubscriptionInput> | BillingInvoiceCreateWithoutSubscriptionInput[] | BillingInvoiceUncheckedCreateWithoutSubscriptionInput[]
    connectOrCreate?: BillingInvoiceCreateOrConnectWithoutSubscriptionInput | BillingInvoiceCreateOrConnectWithoutSubscriptionInput[]
    upsert?: BillingInvoiceUpsertWithWhereUniqueWithoutSubscriptionInput | BillingInvoiceUpsertWithWhereUniqueWithoutSubscriptionInput[]
    createMany?: BillingInvoiceCreateManySubscriptionInputEnvelope
    set?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
    disconnect?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
    delete?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
    connect?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
    update?: BillingInvoiceUpdateWithWhereUniqueWithoutSubscriptionInput | BillingInvoiceUpdateWithWhereUniqueWithoutSubscriptionInput[]
    updateMany?: BillingInvoiceUpdateManyWithWhereWithoutSubscriptionInput | BillingInvoiceUpdateManyWithWhereWithoutSubscriptionInput[]
    deleteMany?: BillingInvoiceScalarWhereInput | BillingInvoiceScalarWhereInput[]
  }

  export type SubscriptionPlanChangeRequestUpdateManyWithoutCurrentSubscriptionNestedInput = {
    create?: XOR<SubscriptionPlanChangeRequestCreateWithoutCurrentSubscriptionInput, SubscriptionPlanChangeRequestUncheckedCreateWithoutCurrentSubscriptionInput> | SubscriptionPlanChangeRequestCreateWithoutCurrentSubscriptionInput[] | SubscriptionPlanChangeRequestUncheckedCreateWithoutCurrentSubscriptionInput[]
    connectOrCreate?: SubscriptionPlanChangeRequestCreateOrConnectWithoutCurrentSubscriptionInput | SubscriptionPlanChangeRequestCreateOrConnectWithoutCurrentSubscriptionInput[]
    upsert?: SubscriptionPlanChangeRequestUpsertWithWhereUniqueWithoutCurrentSubscriptionInput | SubscriptionPlanChangeRequestUpsertWithWhereUniqueWithoutCurrentSubscriptionInput[]
    createMany?: SubscriptionPlanChangeRequestCreateManyCurrentSubscriptionInputEnvelope
    set?: SubscriptionPlanChangeRequestWhereUniqueInput | SubscriptionPlanChangeRequestWhereUniqueInput[]
    disconnect?: SubscriptionPlanChangeRequestWhereUniqueInput | SubscriptionPlanChangeRequestWhereUniqueInput[]
    delete?: SubscriptionPlanChangeRequestWhereUniqueInput | SubscriptionPlanChangeRequestWhereUniqueInput[]
    connect?: SubscriptionPlanChangeRequestWhereUniqueInput | SubscriptionPlanChangeRequestWhereUniqueInput[]
    update?: SubscriptionPlanChangeRequestUpdateWithWhereUniqueWithoutCurrentSubscriptionInput | SubscriptionPlanChangeRequestUpdateWithWhereUniqueWithoutCurrentSubscriptionInput[]
    updateMany?: SubscriptionPlanChangeRequestUpdateManyWithWhereWithoutCurrentSubscriptionInput | SubscriptionPlanChangeRequestUpdateManyWithWhereWithoutCurrentSubscriptionInput[]
    deleteMany?: SubscriptionPlanChangeRequestScalarWhereInput | SubscriptionPlanChangeRequestScalarWhereInput[]
  }

  export type BillingInvoiceUncheckedUpdateManyWithoutSubscriptionNestedInput = {
    create?: XOR<BillingInvoiceCreateWithoutSubscriptionInput, BillingInvoiceUncheckedCreateWithoutSubscriptionInput> | BillingInvoiceCreateWithoutSubscriptionInput[] | BillingInvoiceUncheckedCreateWithoutSubscriptionInput[]
    connectOrCreate?: BillingInvoiceCreateOrConnectWithoutSubscriptionInput | BillingInvoiceCreateOrConnectWithoutSubscriptionInput[]
    upsert?: BillingInvoiceUpsertWithWhereUniqueWithoutSubscriptionInput | BillingInvoiceUpsertWithWhereUniqueWithoutSubscriptionInput[]
    createMany?: BillingInvoiceCreateManySubscriptionInputEnvelope
    set?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
    disconnect?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
    delete?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
    connect?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
    update?: BillingInvoiceUpdateWithWhereUniqueWithoutSubscriptionInput | BillingInvoiceUpdateWithWhereUniqueWithoutSubscriptionInput[]
    updateMany?: BillingInvoiceUpdateManyWithWhereWithoutSubscriptionInput | BillingInvoiceUpdateManyWithWhereWithoutSubscriptionInput[]
    deleteMany?: BillingInvoiceScalarWhereInput | BillingInvoiceScalarWhereInput[]
  }

  export type SubscriptionPlanChangeRequestUncheckedUpdateManyWithoutCurrentSubscriptionNestedInput = {
    create?: XOR<SubscriptionPlanChangeRequestCreateWithoutCurrentSubscriptionInput, SubscriptionPlanChangeRequestUncheckedCreateWithoutCurrentSubscriptionInput> | SubscriptionPlanChangeRequestCreateWithoutCurrentSubscriptionInput[] | SubscriptionPlanChangeRequestUncheckedCreateWithoutCurrentSubscriptionInput[]
    connectOrCreate?: SubscriptionPlanChangeRequestCreateOrConnectWithoutCurrentSubscriptionInput | SubscriptionPlanChangeRequestCreateOrConnectWithoutCurrentSubscriptionInput[]
    upsert?: SubscriptionPlanChangeRequestUpsertWithWhereUniqueWithoutCurrentSubscriptionInput | SubscriptionPlanChangeRequestUpsertWithWhereUniqueWithoutCurrentSubscriptionInput[]
    createMany?: SubscriptionPlanChangeRequestCreateManyCurrentSubscriptionInputEnvelope
    set?: SubscriptionPlanChangeRequestWhereUniqueInput | SubscriptionPlanChangeRequestWhereUniqueInput[]
    disconnect?: SubscriptionPlanChangeRequestWhereUniqueInput | SubscriptionPlanChangeRequestWhereUniqueInput[]
    delete?: SubscriptionPlanChangeRequestWhereUniqueInput | SubscriptionPlanChangeRequestWhereUniqueInput[]
    connect?: SubscriptionPlanChangeRequestWhereUniqueInput | SubscriptionPlanChangeRequestWhereUniqueInput[]
    update?: SubscriptionPlanChangeRequestUpdateWithWhereUniqueWithoutCurrentSubscriptionInput | SubscriptionPlanChangeRequestUpdateWithWhereUniqueWithoutCurrentSubscriptionInput[]
    updateMany?: SubscriptionPlanChangeRequestUpdateManyWithWhereWithoutCurrentSubscriptionInput | SubscriptionPlanChangeRequestUpdateManyWithWhereWithoutCurrentSubscriptionInput[]
    deleteMany?: SubscriptionPlanChangeRequestScalarWhereInput | SubscriptionPlanChangeRequestScalarWhereInput[]
  }

  export type TenantCreateNestedOneWithoutBillingInvoicesInput = {
    create?: XOR<TenantCreateWithoutBillingInvoicesInput, TenantUncheckedCreateWithoutBillingInvoicesInput>
    connectOrCreate?: TenantCreateOrConnectWithoutBillingInvoicesInput
    connect?: TenantWhereUniqueInput
  }

  export type TenantSubscriptionCreateNestedOneWithoutInvoicesInput = {
    create?: XOR<TenantSubscriptionCreateWithoutInvoicesInput, TenantSubscriptionUncheckedCreateWithoutInvoicesInput>
    connectOrCreate?: TenantSubscriptionCreateOrConnectWithoutInvoicesInput
    connect?: TenantSubscriptionWhereUniqueInput
  }

  export type SubscriptionPlanCreateNestedOneWithoutInvoicesInput = {
    create?: XOR<SubscriptionPlanCreateWithoutInvoicesInput, SubscriptionPlanUncheckedCreateWithoutInvoicesInput>
    connectOrCreate?: SubscriptionPlanCreateOrConnectWithoutInvoicesInput
    connect?: SubscriptionPlanWhereUniqueInput
  }

  export type BillingPaymentCreateNestedManyWithoutInvoiceInput = {
    create?: XOR<BillingPaymentCreateWithoutInvoiceInput, BillingPaymentUncheckedCreateWithoutInvoiceInput> | BillingPaymentCreateWithoutInvoiceInput[] | BillingPaymentUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: BillingPaymentCreateOrConnectWithoutInvoiceInput | BillingPaymentCreateOrConnectWithoutInvoiceInput[]
    createMany?: BillingPaymentCreateManyInvoiceInputEnvelope
    connect?: BillingPaymentWhereUniqueInput | BillingPaymentWhereUniqueInput[]
  }

  export type BillingPaymentUncheckedCreateNestedManyWithoutInvoiceInput = {
    create?: XOR<BillingPaymentCreateWithoutInvoiceInput, BillingPaymentUncheckedCreateWithoutInvoiceInput> | BillingPaymentCreateWithoutInvoiceInput[] | BillingPaymentUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: BillingPaymentCreateOrConnectWithoutInvoiceInput | BillingPaymentCreateOrConnectWithoutInvoiceInput[]
    createMany?: BillingPaymentCreateManyInvoiceInputEnvelope
    connect?: BillingPaymentWhereUniqueInput | BillingPaymentWhereUniqueInput[]
  }

  export type EnumBillingInvoiceStatusFieldUpdateOperationsInput = {
    set?: $Enums.BillingInvoiceStatus
  }

  export type TenantUpdateOneRequiredWithoutBillingInvoicesNestedInput = {
    create?: XOR<TenantCreateWithoutBillingInvoicesInput, TenantUncheckedCreateWithoutBillingInvoicesInput>
    connectOrCreate?: TenantCreateOrConnectWithoutBillingInvoicesInput
    upsert?: TenantUpsertWithoutBillingInvoicesInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutBillingInvoicesInput, TenantUpdateWithoutBillingInvoicesInput>, TenantUncheckedUpdateWithoutBillingInvoicesInput>
  }

  export type TenantSubscriptionUpdateOneRequiredWithoutInvoicesNestedInput = {
    create?: XOR<TenantSubscriptionCreateWithoutInvoicesInput, TenantSubscriptionUncheckedCreateWithoutInvoicesInput>
    connectOrCreate?: TenantSubscriptionCreateOrConnectWithoutInvoicesInput
    upsert?: TenantSubscriptionUpsertWithoutInvoicesInput
    connect?: TenantSubscriptionWhereUniqueInput
    update?: XOR<XOR<TenantSubscriptionUpdateToOneWithWhereWithoutInvoicesInput, TenantSubscriptionUpdateWithoutInvoicesInput>, TenantSubscriptionUncheckedUpdateWithoutInvoicesInput>
  }

  export type SubscriptionPlanUpdateOneRequiredWithoutInvoicesNestedInput = {
    create?: XOR<SubscriptionPlanCreateWithoutInvoicesInput, SubscriptionPlanUncheckedCreateWithoutInvoicesInput>
    connectOrCreate?: SubscriptionPlanCreateOrConnectWithoutInvoicesInput
    upsert?: SubscriptionPlanUpsertWithoutInvoicesInput
    connect?: SubscriptionPlanWhereUniqueInput
    update?: XOR<XOR<SubscriptionPlanUpdateToOneWithWhereWithoutInvoicesInput, SubscriptionPlanUpdateWithoutInvoicesInput>, SubscriptionPlanUncheckedUpdateWithoutInvoicesInput>
  }

  export type BillingPaymentUpdateManyWithoutInvoiceNestedInput = {
    create?: XOR<BillingPaymentCreateWithoutInvoiceInput, BillingPaymentUncheckedCreateWithoutInvoiceInput> | BillingPaymentCreateWithoutInvoiceInput[] | BillingPaymentUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: BillingPaymentCreateOrConnectWithoutInvoiceInput | BillingPaymentCreateOrConnectWithoutInvoiceInput[]
    upsert?: BillingPaymentUpsertWithWhereUniqueWithoutInvoiceInput | BillingPaymentUpsertWithWhereUniqueWithoutInvoiceInput[]
    createMany?: BillingPaymentCreateManyInvoiceInputEnvelope
    set?: BillingPaymentWhereUniqueInput | BillingPaymentWhereUniqueInput[]
    disconnect?: BillingPaymentWhereUniqueInput | BillingPaymentWhereUniqueInput[]
    delete?: BillingPaymentWhereUniqueInput | BillingPaymentWhereUniqueInput[]
    connect?: BillingPaymentWhereUniqueInput | BillingPaymentWhereUniqueInput[]
    update?: BillingPaymentUpdateWithWhereUniqueWithoutInvoiceInput | BillingPaymentUpdateWithWhereUniqueWithoutInvoiceInput[]
    updateMany?: BillingPaymentUpdateManyWithWhereWithoutInvoiceInput | BillingPaymentUpdateManyWithWhereWithoutInvoiceInput[]
    deleteMany?: BillingPaymentScalarWhereInput | BillingPaymentScalarWhereInput[]
  }

  export type BillingPaymentUncheckedUpdateManyWithoutInvoiceNestedInput = {
    create?: XOR<BillingPaymentCreateWithoutInvoiceInput, BillingPaymentUncheckedCreateWithoutInvoiceInput> | BillingPaymentCreateWithoutInvoiceInput[] | BillingPaymentUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: BillingPaymentCreateOrConnectWithoutInvoiceInput | BillingPaymentCreateOrConnectWithoutInvoiceInput[]
    upsert?: BillingPaymentUpsertWithWhereUniqueWithoutInvoiceInput | BillingPaymentUpsertWithWhereUniqueWithoutInvoiceInput[]
    createMany?: BillingPaymentCreateManyInvoiceInputEnvelope
    set?: BillingPaymentWhereUniqueInput | BillingPaymentWhereUniqueInput[]
    disconnect?: BillingPaymentWhereUniqueInput | BillingPaymentWhereUniqueInput[]
    delete?: BillingPaymentWhereUniqueInput | BillingPaymentWhereUniqueInput[]
    connect?: BillingPaymentWhereUniqueInput | BillingPaymentWhereUniqueInput[]
    update?: BillingPaymentUpdateWithWhereUniqueWithoutInvoiceInput | BillingPaymentUpdateWithWhereUniqueWithoutInvoiceInput[]
    updateMany?: BillingPaymentUpdateManyWithWhereWithoutInvoiceInput | BillingPaymentUpdateManyWithWhereWithoutInvoiceInput[]
    deleteMany?: BillingPaymentScalarWhereInput | BillingPaymentScalarWhereInput[]
  }

  export type BillingInvoiceCreateNestedOneWithoutPaymentsInput = {
    create?: XOR<BillingInvoiceCreateWithoutPaymentsInput, BillingInvoiceUncheckedCreateWithoutPaymentsInput>
    connectOrCreate?: BillingInvoiceCreateOrConnectWithoutPaymentsInput
    connect?: BillingInvoiceWhereUniqueInput
  }

  export type TenantCreateNestedOneWithoutBillingPaymentsInput = {
    create?: XOR<TenantCreateWithoutBillingPaymentsInput, TenantUncheckedCreateWithoutBillingPaymentsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutBillingPaymentsInput
    connect?: TenantWhereUniqueInput
  }

  export type EnumBillingPaymentMethodFieldUpdateOperationsInput = {
    set?: $Enums.BillingPaymentMethod
  }

  export type EnumBillingPaymentStatusFieldUpdateOperationsInput = {
    set?: $Enums.BillingPaymentStatus
  }

  export type BillingInvoiceUpdateOneRequiredWithoutPaymentsNestedInput = {
    create?: XOR<BillingInvoiceCreateWithoutPaymentsInput, BillingInvoiceUncheckedCreateWithoutPaymentsInput>
    connectOrCreate?: BillingInvoiceCreateOrConnectWithoutPaymentsInput
    upsert?: BillingInvoiceUpsertWithoutPaymentsInput
    connect?: BillingInvoiceWhereUniqueInput
    update?: XOR<XOR<BillingInvoiceUpdateToOneWithWhereWithoutPaymentsInput, BillingInvoiceUpdateWithoutPaymentsInput>, BillingInvoiceUncheckedUpdateWithoutPaymentsInput>
  }

  export type TenantUpdateOneRequiredWithoutBillingPaymentsNestedInput = {
    create?: XOR<TenantCreateWithoutBillingPaymentsInput, TenantUncheckedCreateWithoutBillingPaymentsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutBillingPaymentsInput
    upsert?: TenantUpsertWithoutBillingPaymentsInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutBillingPaymentsInput, TenantUpdateWithoutBillingPaymentsInput>, TenantUncheckedUpdateWithoutBillingPaymentsInput>
  }

  export type TenantCreateNestedOneWithoutPlanChangeRequestsInput = {
    create?: XOR<TenantCreateWithoutPlanChangeRequestsInput, TenantUncheckedCreateWithoutPlanChangeRequestsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutPlanChangeRequestsInput
    connect?: TenantWhereUniqueInput
  }

  export type TenantSubscriptionCreateNestedOneWithoutPlanChangeRequestsInput = {
    create?: XOR<TenantSubscriptionCreateWithoutPlanChangeRequestsInput, TenantSubscriptionUncheckedCreateWithoutPlanChangeRequestsInput>
    connectOrCreate?: TenantSubscriptionCreateOrConnectWithoutPlanChangeRequestsInput
    connect?: TenantSubscriptionWhereUniqueInput
  }

  export type SubscriptionPlanCreateNestedOneWithoutRequestedChangesInput = {
    create?: XOR<SubscriptionPlanCreateWithoutRequestedChangesInput, SubscriptionPlanUncheckedCreateWithoutRequestedChangesInput>
    connectOrCreate?: SubscriptionPlanCreateOrConnectWithoutRequestedChangesInput
    connect?: SubscriptionPlanWhereUniqueInput
  }

  export type EnumPlanChangeRequestStatusFieldUpdateOperationsInput = {
    set?: $Enums.PlanChangeRequestStatus
  }

  export type TenantUpdateOneRequiredWithoutPlanChangeRequestsNestedInput = {
    create?: XOR<TenantCreateWithoutPlanChangeRequestsInput, TenantUncheckedCreateWithoutPlanChangeRequestsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutPlanChangeRequestsInput
    upsert?: TenantUpsertWithoutPlanChangeRequestsInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutPlanChangeRequestsInput, TenantUpdateWithoutPlanChangeRequestsInput>, TenantUncheckedUpdateWithoutPlanChangeRequestsInput>
  }

  export type TenantSubscriptionUpdateOneWithoutPlanChangeRequestsNestedInput = {
    create?: XOR<TenantSubscriptionCreateWithoutPlanChangeRequestsInput, TenantSubscriptionUncheckedCreateWithoutPlanChangeRequestsInput>
    connectOrCreate?: TenantSubscriptionCreateOrConnectWithoutPlanChangeRequestsInput
    upsert?: TenantSubscriptionUpsertWithoutPlanChangeRequestsInput
    disconnect?: TenantSubscriptionWhereInput | boolean
    delete?: TenantSubscriptionWhereInput | boolean
    connect?: TenantSubscriptionWhereUniqueInput
    update?: XOR<XOR<TenantSubscriptionUpdateToOneWithWhereWithoutPlanChangeRequestsInput, TenantSubscriptionUpdateWithoutPlanChangeRequestsInput>, TenantSubscriptionUncheckedUpdateWithoutPlanChangeRequestsInput>
  }

  export type SubscriptionPlanUpdateOneRequiredWithoutRequestedChangesNestedInput = {
    create?: XOR<SubscriptionPlanCreateWithoutRequestedChangesInput, SubscriptionPlanUncheckedCreateWithoutRequestedChangesInput>
    connectOrCreate?: SubscriptionPlanCreateOrConnectWithoutRequestedChangesInput
    upsert?: SubscriptionPlanUpsertWithoutRequestedChangesInput
    connect?: SubscriptionPlanWhereUniqueInput
    update?: XOR<XOR<SubscriptionPlanUpdateToOneWithWhereWithoutRequestedChangesInput, SubscriptionPlanUpdateWithoutRequestedChangesInput>, SubscriptionPlanUncheckedUpdateWithoutRequestedChangesInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumTenantStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TenantStatus | EnumTenantStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TenantStatus[] | ListEnumTenantStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TenantStatus[] | ListEnumTenantStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTenantStatusFilter<$PrismaModel> | $Enums.TenantStatus
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumTenantStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TenantStatus | EnumTenantStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TenantStatus[] | ListEnumTenantStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TenantStatus[] | ListEnumTenantStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTenantStatusWithAggregatesFilter<$PrismaModel> | $Enums.TenantStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTenantStatusFilter<$PrismaModel>
    _max?: NestedEnumTenantStatusFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumBillingIntervalFilter<$PrismaModel = never> = {
    equals?: $Enums.BillingInterval | EnumBillingIntervalFieldRefInput<$PrismaModel>
    in?: $Enums.BillingInterval[] | ListEnumBillingIntervalFieldRefInput<$PrismaModel>
    notIn?: $Enums.BillingInterval[] | ListEnumBillingIntervalFieldRefInput<$PrismaModel>
    not?: NestedEnumBillingIntervalFilter<$PrismaModel> | $Enums.BillingInterval
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedEnumBillingIntervalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BillingInterval | EnumBillingIntervalFieldRefInput<$PrismaModel>
    in?: $Enums.BillingInterval[] | ListEnumBillingIntervalFieldRefInput<$PrismaModel>
    notIn?: $Enums.BillingInterval[] | ListEnumBillingIntervalFieldRefInput<$PrismaModel>
    not?: NestedEnumBillingIntervalWithAggregatesFilter<$PrismaModel> | $Enums.BillingInterval
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBillingIntervalFilter<$PrismaModel>
    _max?: NestedEnumBillingIntervalFilter<$PrismaModel>
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumSubscriptionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionStatus | EnumSubscriptionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSubscriptionStatusFilter<$PrismaModel> | $Enums.SubscriptionStatus
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedEnumSubscriptionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionStatus | EnumSubscriptionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSubscriptionStatusWithAggregatesFilter<$PrismaModel> | $Enums.SubscriptionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSubscriptionStatusFilter<$PrismaModel>
    _max?: NestedEnumSubscriptionStatusFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumBillingInvoiceStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.BillingInvoiceStatus | EnumBillingInvoiceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.BillingInvoiceStatus[] | ListEnumBillingInvoiceStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.BillingInvoiceStatus[] | ListEnumBillingInvoiceStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumBillingInvoiceStatusFilter<$PrismaModel> | $Enums.BillingInvoiceStatus
  }

  export type NestedEnumBillingInvoiceStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BillingInvoiceStatus | EnumBillingInvoiceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.BillingInvoiceStatus[] | ListEnumBillingInvoiceStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.BillingInvoiceStatus[] | ListEnumBillingInvoiceStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumBillingInvoiceStatusWithAggregatesFilter<$PrismaModel> | $Enums.BillingInvoiceStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBillingInvoiceStatusFilter<$PrismaModel>
    _max?: NestedEnumBillingInvoiceStatusFilter<$PrismaModel>
  }

  export type NestedEnumBillingPaymentMethodFilter<$PrismaModel = never> = {
    equals?: $Enums.BillingPaymentMethod | EnumBillingPaymentMethodFieldRefInput<$PrismaModel>
    in?: $Enums.BillingPaymentMethod[] | ListEnumBillingPaymentMethodFieldRefInput<$PrismaModel>
    notIn?: $Enums.BillingPaymentMethod[] | ListEnumBillingPaymentMethodFieldRefInput<$PrismaModel>
    not?: NestedEnumBillingPaymentMethodFilter<$PrismaModel> | $Enums.BillingPaymentMethod
  }

  export type NestedEnumBillingPaymentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.BillingPaymentStatus | EnumBillingPaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.BillingPaymentStatus[] | ListEnumBillingPaymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.BillingPaymentStatus[] | ListEnumBillingPaymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumBillingPaymentStatusFilter<$PrismaModel> | $Enums.BillingPaymentStatus
  }

  export type NestedEnumBillingPaymentMethodWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BillingPaymentMethod | EnumBillingPaymentMethodFieldRefInput<$PrismaModel>
    in?: $Enums.BillingPaymentMethod[] | ListEnumBillingPaymentMethodFieldRefInput<$PrismaModel>
    notIn?: $Enums.BillingPaymentMethod[] | ListEnumBillingPaymentMethodFieldRefInput<$PrismaModel>
    not?: NestedEnumBillingPaymentMethodWithAggregatesFilter<$PrismaModel> | $Enums.BillingPaymentMethod
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBillingPaymentMethodFilter<$PrismaModel>
    _max?: NestedEnumBillingPaymentMethodFilter<$PrismaModel>
  }

  export type NestedEnumBillingPaymentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BillingPaymentStatus | EnumBillingPaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.BillingPaymentStatus[] | ListEnumBillingPaymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.BillingPaymentStatus[] | ListEnumBillingPaymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumBillingPaymentStatusWithAggregatesFilter<$PrismaModel> | $Enums.BillingPaymentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBillingPaymentStatusFilter<$PrismaModel>
    _max?: NestedEnumBillingPaymentStatusFilter<$PrismaModel>
  }

  export type NestedEnumPlanChangeRequestStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PlanChangeRequestStatus | EnumPlanChangeRequestStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PlanChangeRequestStatus[] | ListEnumPlanChangeRequestStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PlanChangeRequestStatus[] | ListEnumPlanChangeRequestStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPlanChangeRequestStatusFilter<$PrismaModel> | $Enums.PlanChangeRequestStatus
  }

  export type NestedEnumPlanChangeRequestStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PlanChangeRequestStatus | EnumPlanChangeRequestStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PlanChangeRequestStatus[] | ListEnumPlanChangeRequestStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PlanChangeRequestStatus[] | ListEnumPlanChangeRequestStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPlanChangeRequestStatusWithAggregatesFilter<$PrismaModel> | $Enums.PlanChangeRequestStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPlanChangeRequestStatusFilter<$PrismaModel>
    _max?: NestedEnumPlanChangeRequestStatusFilter<$PrismaModel>
  }

  export type StaffLoginLookupCreateWithoutTenantInput = {
    email: string
    staffId: number
  }

  export type StaffLoginLookupUncheckedCreateWithoutTenantInput = {
    id?: number
    email: string
    staffId: number
  }

  export type StaffLoginLookupCreateOrConnectWithoutTenantInput = {
    where: StaffLoginLookupWhereUniqueInput
    create: XOR<StaffLoginLookupCreateWithoutTenantInput, StaffLoginLookupUncheckedCreateWithoutTenantInput>
  }

  export type StaffLoginLookupCreateManyTenantInputEnvelope = {
    data: StaffLoginLookupCreateManyTenantInput | StaffLoginLookupCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type TenantSubscriptionCreateWithoutTenantInput = {
    status: $Enums.SubscriptionStatus
    startDate: Date | string
    endDate: Date | string
    trialStartDate?: Date | string | null
    trialEndDate?: Date | string | null
    gracePeriodEndsAt?: Date | string | null
    nextBillingDate?: Date | string | null
    autoRenew?: boolean
    cancelAtPeriodEnd?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    plan: SubscriptionPlanCreateNestedOneWithoutTenantSubscriptionsInput
    invoices?: BillingInvoiceCreateNestedManyWithoutSubscriptionInput
    planChangeRequests?: SubscriptionPlanChangeRequestCreateNestedManyWithoutCurrentSubscriptionInput
  }

  export type TenantSubscriptionUncheckedCreateWithoutTenantInput = {
    id?: number
    planId: number
    status: $Enums.SubscriptionStatus
    startDate: Date | string
    endDate: Date | string
    trialStartDate?: Date | string | null
    trialEndDate?: Date | string | null
    gracePeriodEndsAt?: Date | string | null
    nextBillingDate?: Date | string | null
    autoRenew?: boolean
    cancelAtPeriodEnd?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    invoices?: BillingInvoiceUncheckedCreateNestedManyWithoutSubscriptionInput
    planChangeRequests?: SubscriptionPlanChangeRequestUncheckedCreateNestedManyWithoutCurrentSubscriptionInput
  }

  export type TenantSubscriptionCreateOrConnectWithoutTenantInput = {
    where: TenantSubscriptionWhereUniqueInput
    create: XOR<TenantSubscriptionCreateWithoutTenantInput, TenantSubscriptionUncheckedCreateWithoutTenantInput>
  }

  export type TenantSubscriptionCreateManyTenantInputEnvelope = {
    data: TenantSubscriptionCreateManyTenantInput | TenantSubscriptionCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type BillingInvoiceCreateWithoutTenantInput = {
    invoiceNumber: string
    status?: $Enums.BillingInvoiceStatus
    issuedAt?: Date | string
    dueDate: Date | string
    periodStart: Date | string
    periodEnd: Date | string
    subtotal: Decimal | DecimalJsLike | number | string
    taxAmount?: Decimal | DecimalJsLike | number | string
    totalAmount: Decimal | DecimalJsLike | number | string
    currency?: string
    lineItems: JsonNullValueInput | InputJsonValue
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    subscription: TenantSubscriptionCreateNestedOneWithoutInvoicesInput
    plan: SubscriptionPlanCreateNestedOneWithoutInvoicesInput
    payments?: BillingPaymentCreateNestedManyWithoutInvoiceInput
  }

  export type BillingInvoiceUncheckedCreateWithoutTenantInput = {
    id?: number
    subscriptionId: number
    planId: number
    invoiceNumber: string
    status?: $Enums.BillingInvoiceStatus
    issuedAt?: Date | string
    dueDate: Date | string
    periodStart: Date | string
    periodEnd: Date | string
    subtotal: Decimal | DecimalJsLike | number | string
    taxAmount?: Decimal | DecimalJsLike | number | string
    totalAmount: Decimal | DecimalJsLike | number | string
    currency?: string
    lineItems: JsonNullValueInput | InputJsonValue
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    payments?: BillingPaymentUncheckedCreateNestedManyWithoutInvoiceInput
  }

  export type BillingInvoiceCreateOrConnectWithoutTenantInput = {
    where: BillingInvoiceWhereUniqueInput
    create: XOR<BillingInvoiceCreateWithoutTenantInput, BillingInvoiceUncheckedCreateWithoutTenantInput>
  }

  export type BillingInvoiceCreateManyTenantInputEnvelope = {
    data: BillingInvoiceCreateManyTenantInput | BillingInvoiceCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type BillingPaymentCreateWithoutTenantInput = {
    amount: Decimal | DecimalJsLike | number | string
    method?: $Enums.BillingPaymentMethod
    status?: $Enums.BillingPaymentStatus
    paidAt?: Date | string
    reference?: string | null
    notes?: string | null
    createdAt?: Date | string
    invoice: BillingInvoiceCreateNestedOneWithoutPaymentsInput
  }

  export type BillingPaymentUncheckedCreateWithoutTenantInput = {
    id?: number
    invoiceId: number
    amount: Decimal | DecimalJsLike | number | string
    method?: $Enums.BillingPaymentMethod
    status?: $Enums.BillingPaymentStatus
    paidAt?: Date | string
    reference?: string | null
    notes?: string | null
    createdAt?: Date | string
  }

  export type BillingPaymentCreateOrConnectWithoutTenantInput = {
    where: BillingPaymentWhereUniqueInput
    create: XOR<BillingPaymentCreateWithoutTenantInput, BillingPaymentUncheckedCreateWithoutTenantInput>
  }

  export type BillingPaymentCreateManyTenantInputEnvelope = {
    data: BillingPaymentCreateManyTenantInput | BillingPaymentCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type SubscriptionPlanChangeRequestCreateWithoutTenantInput = {
    status?: $Enums.PlanChangeRequestStatus
    message?: string | null
    reviewedNote?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    reviewedAt?: Date | string | null
    currentSubscription?: TenantSubscriptionCreateNestedOneWithoutPlanChangeRequestsInput
    requestedPlan: SubscriptionPlanCreateNestedOneWithoutRequestedChangesInput
  }

  export type SubscriptionPlanChangeRequestUncheckedCreateWithoutTenantInput = {
    id?: number
    currentSubscriptionId?: number | null
    requestedPlanId: number
    status?: $Enums.PlanChangeRequestStatus
    message?: string | null
    reviewedNote?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    reviewedAt?: Date | string | null
  }

  export type SubscriptionPlanChangeRequestCreateOrConnectWithoutTenantInput = {
    where: SubscriptionPlanChangeRequestWhereUniqueInput
    create: XOR<SubscriptionPlanChangeRequestCreateWithoutTenantInput, SubscriptionPlanChangeRequestUncheckedCreateWithoutTenantInput>
  }

  export type SubscriptionPlanChangeRequestCreateManyTenantInputEnvelope = {
    data: SubscriptionPlanChangeRequestCreateManyTenantInput | SubscriptionPlanChangeRequestCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type StaffLoginLookupUpsertWithWhereUniqueWithoutTenantInput = {
    where: StaffLoginLookupWhereUniqueInput
    update: XOR<StaffLoginLookupUpdateWithoutTenantInput, StaffLoginLookupUncheckedUpdateWithoutTenantInput>
    create: XOR<StaffLoginLookupCreateWithoutTenantInput, StaffLoginLookupUncheckedCreateWithoutTenantInput>
  }

  export type StaffLoginLookupUpdateWithWhereUniqueWithoutTenantInput = {
    where: StaffLoginLookupWhereUniqueInput
    data: XOR<StaffLoginLookupUpdateWithoutTenantInput, StaffLoginLookupUncheckedUpdateWithoutTenantInput>
  }

  export type StaffLoginLookupUpdateManyWithWhereWithoutTenantInput = {
    where: StaffLoginLookupScalarWhereInput
    data: XOR<StaffLoginLookupUpdateManyMutationInput, StaffLoginLookupUncheckedUpdateManyWithoutTenantInput>
  }

  export type StaffLoginLookupScalarWhereInput = {
    AND?: StaffLoginLookupScalarWhereInput | StaffLoginLookupScalarWhereInput[]
    OR?: StaffLoginLookupScalarWhereInput[]
    NOT?: StaffLoginLookupScalarWhereInput | StaffLoginLookupScalarWhereInput[]
    id?: IntFilter<"StaffLoginLookup"> | number
    email?: StringFilter<"StaffLoginLookup"> | string
    tenantId?: IntFilter<"StaffLoginLookup"> | number
    staffId?: IntFilter<"StaffLoginLookup"> | number
  }

  export type TenantSubscriptionUpsertWithWhereUniqueWithoutTenantInput = {
    where: TenantSubscriptionWhereUniqueInput
    update: XOR<TenantSubscriptionUpdateWithoutTenantInput, TenantSubscriptionUncheckedUpdateWithoutTenantInput>
    create: XOR<TenantSubscriptionCreateWithoutTenantInput, TenantSubscriptionUncheckedCreateWithoutTenantInput>
  }

  export type TenantSubscriptionUpdateWithWhereUniqueWithoutTenantInput = {
    where: TenantSubscriptionWhereUniqueInput
    data: XOR<TenantSubscriptionUpdateWithoutTenantInput, TenantSubscriptionUncheckedUpdateWithoutTenantInput>
  }

  export type TenantSubscriptionUpdateManyWithWhereWithoutTenantInput = {
    where: TenantSubscriptionScalarWhereInput
    data: XOR<TenantSubscriptionUpdateManyMutationInput, TenantSubscriptionUncheckedUpdateManyWithoutTenantInput>
  }

  export type TenantSubscriptionScalarWhereInput = {
    AND?: TenantSubscriptionScalarWhereInput | TenantSubscriptionScalarWhereInput[]
    OR?: TenantSubscriptionScalarWhereInput[]
    NOT?: TenantSubscriptionScalarWhereInput | TenantSubscriptionScalarWhereInput[]
    id?: IntFilter<"TenantSubscription"> | number
    tenantId?: IntFilter<"TenantSubscription"> | number
    planId?: IntFilter<"TenantSubscription"> | number
    status?: EnumSubscriptionStatusFilter<"TenantSubscription"> | $Enums.SubscriptionStatus
    startDate?: DateTimeFilter<"TenantSubscription"> | Date | string
    endDate?: DateTimeFilter<"TenantSubscription"> | Date | string
    trialStartDate?: DateTimeNullableFilter<"TenantSubscription"> | Date | string | null
    trialEndDate?: DateTimeNullableFilter<"TenantSubscription"> | Date | string | null
    gracePeriodEndsAt?: DateTimeNullableFilter<"TenantSubscription"> | Date | string | null
    nextBillingDate?: DateTimeNullableFilter<"TenantSubscription"> | Date | string | null
    autoRenew?: BoolFilter<"TenantSubscription"> | boolean
    cancelAtPeriodEnd?: BoolFilter<"TenantSubscription"> | boolean
    createdAt?: DateTimeFilter<"TenantSubscription"> | Date | string
    updatedAt?: DateTimeFilter<"TenantSubscription"> | Date | string
  }

  export type BillingInvoiceUpsertWithWhereUniqueWithoutTenantInput = {
    where: BillingInvoiceWhereUniqueInput
    update: XOR<BillingInvoiceUpdateWithoutTenantInput, BillingInvoiceUncheckedUpdateWithoutTenantInput>
    create: XOR<BillingInvoiceCreateWithoutTenantInput, BillingInvoiceUncheckedCreateWithoutTenantInput>
  }

  export type BillingInvoiceUpdateWithWhereUniqueWithoutTenantInput = {
    where: BillingInvoiceWhereUniqueInput
    data: XOR<BillingInvoiceUpdateWithoutTenantInput, BillingInvoiceUncheckedUpdateWithoutTenantInput>
  }

  export type BillingInvoiceUpdateManyWithWhereWithoutTenantInput = {
    where: BillingInvoiceScalarWhereInput
    data: XOR<BillingInvoiceUpdateManyMutationInput, BillingInvoiceUncheckedUpdateManyWithoutTenantInput>
  }

  export type BillingInvoiceScalarWhereInput = {
    AND?: BillingInvoiceScalarWhereInput | BillingInvoiceScalarWhereInput[]
    OR?: BillingInvoiceScalarWhereInput[]
    NOT?: BillingInvoiceScalarWhereInput | BillingInvoiceScalarWhereInput[]
    id?: IntFilter<"BillingInvoice"> | number
    tenantId?: IntFilter<"BillingInvoice"> | number
    subscriptionId?: IntFilter<"BillingInvoice"> | number
    planId?: IntFilter<"BillingInvoice"> | number
    invoiceNumber?: StringFilter<"BillingInvoice"> | string
    status?: EnumBillingInvoiceStatusFilter<"BillingInvoice"> | $Enums.BillingInvoiceStatus
    issuedAt?: DateTimeFilter<"BillingInvoice"> | Date | string
    dueDate?: DateTimeFilter<"BillingInvoice"> | Date | string
    periodStart?: DateTimeFilter<"BillingInvoice"> | Date | string
    periodEnd?: DateTimeFilter<"BillingInvoice"> | Date | string
    subtotal?: DecimalFilter<"BillingInvoice"> | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalFilter<"BillingInvoice"> | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFilter<"BillingInvoice"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"BillingInvoice"> | string
    lineItems?: JsonFilter<"BillingInvoice">
    notes?: StringNullableFilter<"BillingInvoice"> | string | null
    createdAt?: DateTimeFilter<"BillingInvoice"> | Date | string
    updatedAt?: DateTimeFilter<"BillingInvoice"> | Date | string
  }

  export type BillingPaymentUpsertWithWhereUniqueWithoutTenantInput = {
    where: BillingPaymentWhereUniqueInput
    update: XOR<BillingPaymentUpdateWithoutTenantInput, BillingPaymentUncheckedUpdateWithoutTenantInput>
    create: XOR<BillingPaymentCreateWithoutTenantInput, BillingPaymentUncheckedCreateWithoutTenantInput>
  }

  export type BillingPaymentUpdateWithWhereUniqueWithoutTenantInput = {
    where: BillingPaymentWhereUniqueInput
    data: XOR<BillingPaymentUpdateWithoutTenantInput, BillingPaymentUncheckedUpdateWithoutTenantInput>
  }

  export type BillingPaymentUpdateManyWithWhereWithoutTenantInput = {
    where: BillingPaymentScalarWhereInput
    data: XOR<BillingPaymentUpdateManyMutationInput, BillingPaymentUncheckedUpdateManyWithoutTenantInput>
  }

  export type BillingPaymentScalarWhereInput = {
    AND?: BillingPaymentScalarWhereInput | BillingPaymentScalarWhereInput[]
    OR?: BillingPaymentScalarWhereInput[]
    NOT?: BillingPaymentScalarWhereInput | BillingPaymentScalarWhereInput[]
    id?: IntFilter<"BillingPayment"> | number
    invoiceId?: IntFilter<"BillingPayment"> | number
    tenantId?: IntFilter<"BillingPayment"> | number
    amount?: DecimalFilter<"BillingPayment"> | Decimal | DecimalJsLike | number | string
    method?: EnumBillingPaymentMethodFilter<"BillingPayment"> | $Enums.BillingPaymentMethod
    status?: EnumBillingPaymentStatusFilter<"BillingPayment"> | $Enums.BillingPaymentStatus
    paidAt?: DateTimeFilter<"BillingPayment"> | Date | string
    reference?: StringNullableFilter<"BillingPayment"> | string | null
    notes?: StringNullableFilter<"BillingPayment"> | string | null
    createdAt?: DateTimeFilter<"BillingPayment"> | Date | string
  }

  export type SubscriptionPlanChangeRequestUpsertWithWhereUniqueWithoutTenantInput = {
    where: SubscriptionPlanChangeRequestWhereUniqueInput
    update: XOR<SubscriptionPlanChangeRequestUpdateWithoutTenantInput, SubscriptionPlanChangeRequestUncheckedUpdateWithoutTenantInput>
    create: XOR<SubscriptionPlanChangeRequestCreateWithoutTenantInput, SubscriptionPlanChangeRequestUncheckedCreateWithoutTenantInput>
  }

  export type SubscriptionPlanChangeRequestUpdateWithWhereUniqueWithoutTenantInput = {
    where: SubscriptionPlanChangeRequestWhereUniqueInput
    data: XOR<SubscriptionPlanChangeRequestUpdateWithoutTenantInput, SubscriptionPlanChangeRequestUncheckedUpdateWithoutTenantInput>
  }

  export type SubscriptionPlanChangeRequestUpdateManyWithWhereWithoutTenantInput = {
    where: SubscriptionPlanChangeRequestScalarWhereInput
    data: XOR<SubscriptionPlanChangeRequestUpdateManyMutationInput, SubscriptionPlanChangeRequestUncheckedUpdateManyWithoutTenantInput>
  }

  export type SubscriptionPlanChangeRequestScalarWhereInput = {
    AND?: SubscriptionPlanChangeRequestScalarWhereInput | SubscriptionPlanChangeRequestScalarWhereInput[]
    OR?: SubscriptionPlanChangeRequestScalarWhereInput[]
    NOT?: SubscriptionPlanChangeRequestScalarWhereInput | SubscriptionPlanChangeRequestScalarWhereInput[]
    id?: IntFilter<"SubscriptionPlanChangeRequest"> | number
    tenantId?: IntFilter<"SubscriptionPlanChangeRequest"> | number
    currentSubscriptionId?: IntNullableFilter<"SubscriptionPlanChangeRequest"> | number | null
    requestedPlanId?: IntFilter<"SubscriptionPlanChangeRequest"> | number
    status?: EnumPlanChangeRequestStatusFilter<"SubscriptionPlanChangeRequest"> | $Enums.PlanChangeRequestStatus
    message?: StringNullableFilter<"SubscriptionPlanChangeRequest"> | string | null
    reviewedNote?: StringNullableFilter<"SubscriptionPlanChangeRequest"> | string | null
    createdAt?: DateTimeFilter<"SubscriptionPlanChangeRequest"> | Date | string
    updatedAt?: DateTimeFilter<"SubscriptionPlanChangeRequest"> | Date | string
    reviewedAt?: DateTimeNullableFilter<"SubscriptionPlanChangeRequest"> | Date | string | null
  }

  export type TenantCreateWithoutStaffLoginLookupsInput = {
    name: string
    subdomain: string
    databaseUrl?: string | null
    country?: string
    logoUrl?: string | null
    status?: $Enums.TenantStatus
    createdAt?: Date | string
    subscription?: TenantSubscriptionCreateNestedManyWithoutTenantInput
    billingInvoices?: BillingInvoiceCreateNestedManyWithoutTenantInput
    billingPayments?: BillingPaymentCreateNestedManyWithoutTenantInput
    planChangeRequests?: SubscriptionPlanChangeRequestCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutStaffLoginLookupsInput = {
    id?: number
    name: string
    subdomain: string
    databaseUrl?: string | null
    country?: string
    logoUrl?: string | null
    status?: $Enums.TenantStatus
    createdAt?: Date | string
    subscription?: TenantSubscriptionUncheckedCreateNestedManyWithoutTenantInput
    billingInvoices?: BillingInvoiceUncheckedCreateNestedManyWithoutTenantInput
    billingPayments?: BillingPaymentUncheckedCreateNestedManyWithoutTenantInput
    planChangeRequests?: SubscriptionPlanChangeRequestUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutStaffLoginLookupsInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutStaffLoginLookupsInput, TenantUncheckedCreateWithoutStaffLoginLookupsInput>
  }

  export type TenantUpsertWithoutStaffLoginLookupsInput = {
    update: XOR<TenantUpdateWithoutStaffLoginLookupsInput, TenantUncheckedUpdateWithoutStaffLoginLookupsInput>
    create: XOR<TenantCreateWithoutStaffLoginLookupsInput, TenantUncheckedCreateWithoutStaffLoginLookupsInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutStaffLoginLookupsInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutStaffLoginLookupsInput, TenantUncheckedUpdateWithoutStaffLoginLookupsInput>
  }

  export type TenantUpdateWithoutStaffLoginLookupsInput = {
    name?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    databaseUrl?: NullableStringFieldUpdateOperationsInput | string | null
    country?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subscription?: TenantSubscriptionUpdateManyWithoutTenantNestedInput
    billingInvoices?: BillingInvoiceUpdateManyWithoutTenantNestedInput
    billingPayments?: BillingPaymentUpdateManyWithoutTenantNestedInput
    planChangeRequests?: SubscriptionPlanChangeRequestUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutStaffLoginLookupsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    databaseUrl?: NullableStringFieldUpdateOperationsInput | string | null
    country?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subscription?: TenantSubscriptionUncheckedUpdateManyWithoutTenantNestedInput
    billingInvoices?: BillingInvoiceUncheckedUpdateManyWithoutTenantNestedInput
    billingPayments?: BillingPaymentUncheckedUpdateManyWithoutTenantNestedInput
    planChangeRequests?: SubscriptionPlanChangeRequestUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type TenantSubscriptionCreateWithoutPlanInput = {
    status: $Enums.SubscriptionStatus
    startDate: Date | string
    endDate: Date | string
    trialStartDate?: Date | string | null
    trialEndDate?: Date | string | null
    gracePeriodEndsAt?: Date | string | null
    nextBillingDate?: Date | string | null
    autoRenew?: boolean
    cancelAtPeriodEnd?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    tenant: TenantCreateNestedOneWithoutSubscriptionInput
    invoices?: BillingInvoiceCreateNestedManyWithoutSubscriptionInput
    planChangeRequests?: SubscriptionPlanChangeRequestCreateNestedManyWithoutCurrentSubscriptionInput
  }

  export type TenantSubscriptionUncheckedCreateWithoutPlanInput = {
    id?: number
    tenantId: number
    status: $Enums.SubscriptionStatus
    startDate: Date | string
    endDate: Date | string
    trialStartDate?: Date | string | null
    trialEndDate?: Date | string | null
    gracePeriodEndsAt?: Date | string | null
    nextBillingDate?: Date | string | null
    autoRenew?: boolean
    cancelAtPeriodEnd?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    invoices?: BillingInvoiceUncheckedCreateNestedManyWithoutSubscriptionInput
    planChangeRequests?: SubscriptionPlanChangeRequestUncheckedCreateNestedManyWithoutCurrentSubscriptionInput
  }

  export type TenantSubscriptionCreateOrConnectWithoutPlanInput = {
    where: TenantSubscriptionWhereUniqueInput
    create: XOR<TenantSubscriptionCreateWithoutPlanInput, TenantSubscriptionUncheckedCreateWithoutPlanInput>
  }

  export type TenantSubscriptionCreateManyPlanInputEnvelope = {
    data: TenantSubscriptionCreateManyPlanInput | TenantSubscriptionCreateManyPlanInput[]
    skipDuplicates?: boolean
  }

  export type BillingInvoiceCreateWithoutPlanInput = {
    invoiceNumber: string
    status?: $Enums.BillingInvoiceStatus
    issuedAt?: Date | string
    dueDate: Date | string
    periodStart: Date | string
    periodEnd: Date | string
    subtotal: Decimal | DecimalJsLike | number | string
    taxAmount?: Decimal | DecimalJsLike | number | string
    totalAmount: Decimal | DecimalJsLike | number | string
    currency?: string
    lineItems: JsonNullValueInput | InputJsonValue
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    tenant: TenantCreateNestedOneWithoutBillingInvoicesInput
    subscription: TenantSubscriptionCreateNestedOneWithoutInvoicesInput
    payments?: BillingPaymentCreateNestedManyWithoutInvoiceInput
  }

  export type BillingInvoiceUncheckedCreateWithoutPlanInput = {
    id?: number
    tenantId: number
    subscriptionId: number
    invoiceNumber: string
    status?: $Enums.BillingInvoiceStatus
    issuedAt?: Date | string
    dueDate: Date | string
    periodStart: Date | string
    periodEnd: Date | string
    subtotal: Decimal | DecimalJsLike | number | string
    taxAmount?: Decimal | DecimalJsLike | number | string
    totalAmount: Decimal | DecimalJsLike | number | string
    currency?: string
    lineItems: JsonNullValueInput | InputJsonValue
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    payments?: BillingPaymentUncheckedCreateNestedManyWithoutInvoiceInput
  }

  export type BillingInvoiceCreateOrConnectWithoutPlanInput = {
    where: BillingInvoiceWhereUniqueInput
    create: XOR<BillingInvoiceCreateWithoutPlanInput, BillingInvoiceUncheckedCreateWithoutPlanInput>
  }

  export type BillingInvoiceCreateManyPlanInputEnvelope = {
    data: BillingInvoiceCreateManyPlanInput | BillingInvoiceCreateManyPlanInput[]
    skipDuplicates?: boolean
  }

  export type SubscriptionPlanChangeRequestCreateWithoutRequestedPlanInput = {
    status?: $Enums.PlanChangeRequestStatus
    message?: string | null
    reviewedNote?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    reviewedAt?: Date | string | null
    tenant: TenantCreateNestedOneWithoutPlanChangeRequestsInput
    currentSubscription?: TenantSubscriptionCreateNestedOneWithoutPlanChangeRequestsInput
  }

  export type SubscriptionPlanChangeRequestUncheckedCreateWithoutRequestedPlanInput = {
    id?: number
    tenantId: number
    currentSubscriptionId?: number | null
    status?: $Enums.PlanChangeRequestStatus
    message?: string | null
    reviewedNote?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    reviewedAt?: Date | string | null
  }

  export type SubscriptionPlanChangeRequestCreateOrConnectWithoutRequestedPlanInput = {
    where: SubscriptionPlanChangeRequestWhereUniqueInput
    create: XOR<SubscriptionPlanChangeRequestCreateWithoutRequestedPlanInput, SubscriptionPlanChangeRequestUncheckedCreateWithoutRequestedPlanInput>
  }

  export type SubscriptionPlanChangeRequestCreateManyRequestedPlanInputEnvelope = {
    data: SubscriptionPlanChangeRequestCreateManyRequestedPlanInput | SubscriptionPlanChangeRequestCreateManyRequestedPlanInput[]
    skipDuplicates?: boolean
  }

  export type TenantSubscriptionUpsertWithWhereUniqueWithoutPlanInput = {
    where: TenantSubscriptionWhereUniqueInput
    update: XOR<TenantSubscriptionUpdateWithoutPlanInput, TenantSubscriptionUncheckedUpdateWithoutPlanInput>
    create: XOR<TenantSubscriptionCreateWithoutPlanInput, TenantSubscriptionUncheckedCreateWithoutPlanInput>
  }

  export type TenantSubscriptionUpdateWithWhereUniqueWithoutPlanInput = {
    where: TenantSubscriptionWhereUniqueInput
    data: XOR<TenantSubscriptionUpdateWithoutPlanInput, TenantSubscriptionUncheckedUpdateWithoutPlanInput>
  }

  export type TenantSubscriptionUpdateManyWithWhereWithoutPlanInput = {
    where: TenantSubscriptionScalarWhereInput
    data: XOR<TenantSubscriptionUpdateManyMutationInput, TenantSubscriptionUncheckedUpdateManyWithoutPlanInput>
  }

  export type BillingInvoiceUpsertWithWhereUniqueWithoutPlanInput = {
    where: BillingInvoiceWhereUniqueInput
    update: XOR<BillingInvoiceUpdateWithoutPlanInput, BillingInvoiceUncheckedUpdateWithoutPlanInput>
    create: XOR<BillingInvoiceCreateWithoutPlanInput, BillingInvoiceUncheckedCreateWithoutPlanInput>
  }

  export type BillingInvoiceUpdateWithWhereUniqueWithoutPlanInput = {
    where: BillingInvoiceWhereUniqueInput
    data: XOR<BillingInvoiceUpdateWithoutPlanInput, BillingInvoiceUncheckedUpdateWithoutPlanInput>
  }

  export type BillingInvoiceUpdateManyWithWhereWithoutPlanInput = {
    where: BillingInvoiceScalarWhereInput
    data: XOR<BillingInvoiceUpdateManyMutationInput, BillingInvoiceUncheckedUpdateManyWithoutPlanInput>
  }

  export type SubscriptionPlanChangeRequestUpsertWithWhereUniqueWithoutRequestedPlanInput = {
    where: SubscriptionPlanChangeRequestWhereUniqueInput
    update: XOR<SubscriptionPlanChangeRequestUpdateWithoutRequestedPlanInput, SubscriptionPlanChangeRequestUncheckedUpdateWithoutRequestedPlanInput>
    create: XOR<SubscriptionPlanChangeRequestCreateWithoutRequestedPlanInput, SubscriptionPlanChangeRequestUncheckedCreateWithoutRequestedPlanInput>
  }

  export type SubscriptionPlanChangeRequestUpdateWithWhereUniqueWithoutRequestedPlanInput = {
    where: SubscriptionPlanChangeRequestWhereUniqueInput
    data: XOR<SubscriptionPlanChangeRequestUpdateWithoutRequestedPlanInput, SubscriptionPlanChangeRequestUncheckedUpdateWithoutRequestedPlanInput>
  }

  export type SubscriptionPlanChangeRequestUpdateManyWithWhereWithoutRequestedPlanInput = {
    where: SubscriptionPlanChangeRequestScalarWhereInput
    data: XOR<SubscriptionPlanChangeRequestUpdateManyMutationInput, SubscriptionPlanChangeRequestUncheckedUpdateManyWithoutRequestedPlanInput>
  }

  export type TenantCreateWithoutSubscriptionInput = {
    name: string
    subdomain: string
    databaseUrl?: string | null
    country?: string
    logoUrl?: string | null
    status?: $Enums.TenantStatus
    createdAt?: Date | string
    staffLoginLookups?: StaffLoginLookupCreateNestedManyWithoutTenantInput
    billingInvoices?: BillingInvoiceCreateNestedManyWithoutTenantInput
    billingPayments?: BillingPaymentCreateNestedManyWithoutTenantInput
    planChangeRequests?: SubscriptionPlanChangeRequestCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutSubscriptionInput = {
    id?: number
    name: string
    subdomain: string
    databaseUrl?: string | null
    country?: string
    logoUrl?: string | null
    status?: $Enums.TenantStatus
    createdAt?: Date | string
    staffLoginLookups?: StaffLoginLookupUncheckedCreateNestedManyWithoutTenantInput
    billingInvoices?: BillingInvoiceUncheckedCreateNestedManyWithoutTenantInput
    billingPayments?: BillingPaymentUncheckedCreateNestedManyWithoutTenantInput
    planChangeRequests?: SubscriptionPlanChangeRequestUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutSubscriptionInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutSubscriptionInput, TenantUncheckedCreateWithoutSubscriptionInput>
  }

  export type SubscriptionPlanCreateWithoutTenantSubscriptionsInput = {
    code?: string | null
    name: string
    description?: string | null
    billingInterval?: $Enums.BillingInterval
    monthlyPrice: Decimal | DecimalJsLike | number | string
    commissionPercent: Decimal | DecimalJsLike | number | string
    trialDays?: number
    graceDays?: number
    sortOrder?: number
    features: JsonNullValueInput | InputJsonValue
    invoices?: BillingInvoiceCreateNestedManyWithoutPlanInput
    requestedChanges?: SubscriptionPlanChangeRequestCreateNestedManyWithoutRequestedPlanInput
  }

  export type SubscriptionPlanUncheckedCreateWithoutTenantSubscriptionsInput = {
    id?: number
    code?: string | null
    name: string
    description?: string | null
    billingInterval?: $Enums.BillingInterval
    monthlyPrice: Decimal | DecimalJsLike | number | string
    commissionPercent: Decimal | DecimalJsLike | number | string
    trialDays?: number
    graceDays?: number
    sortOrder?: number
    features: JsonNullValueInput | InputJsonValue
    invoices?: BillingInvoiceUncheckedCreateNestedManyWithoutPlanInput
    requestedChanges?: SubscriptionPlanChangeRequestUncheckedCreateNestedManyWithoutRequestedPlanInput
  }

  export type SubscriptionPlanCreateOrConnectWithoutTenantSubscriptionsInput = {
    where: SubscriptionPlanWhereUniqueInput
    create: XOR<SubscriptionPlanCreateWithoutTenantSubscriptionsInput, SubscriptionPlanUncheckedCreateWithoutTenantSubscriptionsInput>
  }

  export type BillingInvoiceCreateWithoutSubscriptionInput = {
    invoiceNumber: string
    status?: $Enums.BillingInvoiceStatus
    issuedAt?: Date | string
    dueDate: Date | string
    periodStart: Date | string
    periodEnd: Date | string
    subtotal: Decimal | DecimalJsLike | number | string
    taxAmount?: Decimal | DecimalJsLike | number | string
    totalAmount: Decimal | DecimalJsLike | number | string
    currency?: string
    lineItems: JsonNullValueInput | InputJsonValue
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    tenant: TenantCreateNestedOneWithoutBillingInvoicesInput
    plan: SubscriptionPlanCreateNestedOneWithoutInvoicesInput
    payments?: BillingPaymentCreateNestedManyWithoutInvoiceInput
  }

  export type BillingInvoiceUncheckedCreateWithoutSubscriptionInput = {
    id?: number
    tenantId: number
    planId: number
    invoiceNumber: string
    status?: $Enums.BillingInvoiceStatus
    issuedAt?: Date | string
    dueDate: Date | string
    periodStart: Date | string
    periodEnd: Date | string
    subtotal: Decimal | DecimalJsLike | number | string
    taxAmount?: Decimal | DecimalJsLike | number | string
    totalAmount: Decimal | DecimalJsLike | number | string
    currency?: string
    lineItems: JsonNullValueInput | InputJsonValue
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    payments?: BillingPaymentUncheckedCreateNestedManyWithoutInvoiceInput
  }

  export type BillingInvoiceCreateOrConnectWithoutSubscriptionInput = {
    where: BillingInvoiceWhereUniqueInput
    create: XOR<BillingInvoiceCreateWithoutSubscriptionInput, BillingInvoiceUncheckedCreateWithoutSubscriptionInput>
  }

  export type BillingInvoiceCreateManySubscriptionInputEnvelope = {
    data: BillingInvoiceCreateManySubscriptionInput | BillingInvoiceCreateManySubscriptionInput[]
    skipDuplicates?: boolean
  }

  export type SubscriptionPlanChangeRequestCreateWithoutCurrentSubscriptionInput = {
    status?: $Enums.PlanChangeRequestStatus
    message?: string | null
    reviewedNote?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    reviewedAt?: Date | string | null
    tenant: TenantCreateNestedOneWithoutPlanChangeRequestsInput
    requestedPlan: SubscriptionPlanCreateNestedOneWithoutRequestedChangesInput
  }

  export type SubscriptionPlanChangeRequestUncheckedCreateWithoutCurrentSubscriptionInput = {
    id?: number
    tenantId: number
    requestedPlanId: number
    status?: $Enums.PlanChangeRequestStatus
    message?: string | null
    reviewedNote?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    reviewedAt?: Date | string | null
  }

  export type SubscriptionPlanChangeRequestCreateOrConnectWithoutCurrentSubscriptionInput = {
    where: SubscriptionPlanChangeRequestWhereUniqueInput
    create: XOR<SubscriptionPlanChangeRequestCreateWithoutCurrentSubscriptionInput, SubscriptionPlanChangeRequestUncheckedCreateWithoutCurrentSubscriptionInput>
  }

  export type SubscriptionPlanChangeRequestCreateManyCurrentSubscriptionInputEnvelope = {
    data: SubscriptionPlanChangeRequestCreateManyCurrentSubscriptionInput | SubscriptionPlanChangeRequestCreateManyCurrentSubscriptionInput[]
    skipDuplicates?: boolean
  }

  export type TenantUpsertWithoutSubscriptionInput = {
    update: XOR<TenantUpdateWithoutSubscriptionInput, TenantUncheckedUpdateWithoutSubscriptionInput>
    create: XOR<TenantCreateWithoutSubscriptionInput, TenantUncheckedCreateWithoutSubscriptionInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutSubscriptionInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutSubscriptionInput, TenantUncheckedUpdateWithoutSubscriptionInput>
  }

  export type TenantUpdateWithoutSubscriptionInput = {
    name?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    databaseUrl?: NullableStringFieldUpdateOperationsInput | string | null
    country?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    staffLoginLookups?: StaffLoginLookupUpdateManyWithoutTenantNestedInput
    billingInvoices?: BillingInvoiceUpdateManyWithoutTenantNestedInput
    billingPayments?: BillingPaymentUpdateManyWithoutTenantNestedInput
    planChangeRequests?: SubscriptionPlanChangeRequestUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutSubscriptionInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    databaseUrl?: NullableStringFieldUpdateOperationsInput | string | null
    country?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    staffLoginLookups?: StaffLoginLookupUncheckedUpdateManyWithoutTenantNestedInput
    billingInvoices?: BillingInvoiceUncheckedUpdateManyWithoutTenantNestedInput
    billingPayments?: BillingPaymentUncheckedUpdateManyWithoutTenantNestedInput
    planChangeRequests?: SubscriptionPlanChangeRequestUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type SubscriptionPlanUpsertWithoutTenantSubscriptionsInput = {
    update: XOR<SubscriptionPlanUpdateWithoutTenantSubscriptionsInput, SubscriptionPlanUncheckedUpdateWithoutTenantSubscriptionsInput>
    create: XOR<SubscriptionPlanCreateWithoutTenantSubscriptionsInput, SubscriptionPlanUncheckedCreateWithoutTenantSubscriptionsInput>
    where?: SubscriptionPlanWhereInput
  }

  export type SubscriptionPlanUpdateToOneWithWhereWithoutTenantSubscriptionsInput = {
    where?: SubscriptionPlanWhereInput
    data: XOR<SubscriptionPlanUpdateWithoutTenantSubscriptionsInput, SubscriptionPlanUncheckedUpdateWithoutTenantSubscriptionsInput>
  }

  export type SubscriptionPlanUpdateWithoutTenantSubscriptionsInput = {
    code?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    billingInterval?: EnumBillingIntervalFieldUpdateOperationsInput | $Enums.BillingInterval
    monthlyPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    commissionPercent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    trialDays?: IntFieldUpdateOperationsInput | number
    graceDays?: IntFieldUpdateOperationsInput | number
    sortOrder?: IntFieldUpdateOperationsInput | number
    features?: JsonNullValueInput | InputJsonValue
    invoices?: BillingInvoiceUpdateManyWithoutPlanNestedInput
    requestedChanges?: SubscriptionPlanChangeRequestUpdateManyWithoutRequestedPlanNestedInput
  }

  export type SubscriptionPlanUncheckedUpdateWithoutTenantSubscriptionsInput = {
    id?: IntFieldUpdateOperationsInput | number
    code?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    billingInterval?: EnumBillingIntervalFieldUpdateOperationsInput | $Enums.BillingInterval
    monthlyPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    commissionPercent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    trialDays?: IntFieldUpdateOperationsInput | number
    graceDays?: IntFieldUpdateOperationsInput | number
    sortOrder?: IntFieldUpdateOperationsInput | number
    features?: JsonNullValueInput | InputJsonValue
    invoices?: BillingInvoiceUncheckedUpdateManyWithoutPlanNestedInput
    requestedChanges?: SubscriptionPlanChangeRequestUncheckedUpdateManyWithoutRequestedPlanNestedInput
  }

  export type BillingInvoiceUpsertWithWhereUniqueWithoutSubscriptionInput = {
    where: BillingInvoiceWhereUniqueInput
    update: XOR<BillingInvoiceUpdateWithoutSubscriptionInput, BillingInvoiceUncheckedUpdateWithoutSubscriptionInput>
    create: XOR<BillingInvoiceCreateWithoutSubscriptionInput, BillingInvoiceUncheckedCreateWithoutSubscriptionInput>
  }

  export type BillingInvoiceUpdateWithWhereUniqueWithoutSubscriptionInput = {
    where: BillingInvoiceWhereUniqueInput
    data: XOR<BillingInvoiceUpdateWithoutSubscriptionInput, BillingInvoiceUncheckedUpdateWithoutSubscriptionInput>
  }

  export type BillingInvoiceUpdateManyWithWhereWithoutSubscriptionInput = {
    where: BillingInvoiceScalarWhereInput
    data: XOR<BillingInvoiceUpdateManyMutationInput, BillingInvoiceUncheckedUpdateManyWithoutSubscriptionInput>
  }

  export type SubscriptionPlanChangeRequestUpsertWithWhereUniqueWithoutCurrentSubscriptionInput = {
    where: SubscriptionPlanChangeRequestWhereUniqueInput
    update: XOR<SubscriptionPlanChangeRequestUpdateWithoutCurrentSubscriptionInput, SubscriptionPlanChangeRequestUncheckedUpdateWithoutCurrentSubscriptionInput>
    create: XOR<SubscriptionPlanChangeRequestCreateWithoutCurrentSubscriptionInput, SubscriptionPlanChangeRequestUncheckedCreateWithoutCurrentSubscriptionInput>
  }

  export type SubscriptionPlanChangeRequestUpdateWithWhereUniqueWithoutCurrentSubscriptionInput = {
    where: SubscriptionPlanChangeRequestWhereUniqueInput
    data: XOR<SubscriptionPlanChangeRequestUpdateWithoutCurrentSubscriptionInput, SubscriptionPlanChangeRequestUncheckedUpdateWithoutCurrentSubscriptionInput>
  }

  export type SubscriptionPlanChangeRequestUpdateManyWithWhereWithoutCurrentSubscriptionInput = {
    where: SubscriptionPlanChangeRequestScalarWhereInput
    data: XOR<SubscriptionPlanChangeRequestUpdateManyMutationInput, SubscriptionPlanChangeRequestUncheckedUpdateManyWithoutCurrentSubscriptionInput>
  }

  export type TenantCreateWithoutBillingInvoicesInput = {
    name: string
    subdomain: string
    databaseUrl?: string | null
    country?: string
    logoUrl?: string | null
    status?: $Enums.TenantStatus
    createdAt?: Date | string
    staffLoginLookups?: StaffLoginLookupCreateNestedManyWithoutTenantInput
    subscription?: TenantSubscriptionCreateNestedManyWithoutTenantInput
    billingPayments?: BillingPaymentCreateNestedManyWithoutTenantInput
    planChangeRequests?: SubscriptionPlanChangeRequestCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutBillingInvoicesInput = {
    id?: number
    name: string
    subdomain: string
    databaseUrl?: string | null
    country?: string
    logoUrl?: string | null
    status?: $Enums.TenantStatus
    createdAt?: Date | string
    staffLoginLookups?: StaffLoginLookupUncheckedCreateNestedManyWithoutTenantInput
    subscription?: TenantSubscriptionUncheckedCreateNestedManyWithoutTenantInput
    billingPayments?: BillingPaymentUncheckedCreateNestedManyWithoutTenantInput
    planChangeRequests?: SubscriptionPlanChangeRequestUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutBillingInvoicesInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutBillingInvoicesInput, TenantUncheckedCreateWithoutBillingInvoicesInput>
  }

  export type TenantSubscriptionCreateWithoutInvoicesInput = {
    status: $Enums.SubscriptionStatus
    startDate: Date | string
    endDate: Date | string
    trialStartDate?: Date | string | null
    trialEndDate?: Date | string | null
    gracePeriodEndsAt?: Date | string | null
    nextBillingDate?: Date | string | null
    autoRenew?: boolean
    cancelAtPeriodEnd?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    tenant: TenantCreateNestedOneWithoutSubscriptionInput
    plan: SubscriptionPlanCreateNestedOneWithoutTenantSubscriptionsInput
    planChangeRequests?: SubscriptionPlanChangeRequestCreateNestedManyWithoutCurrentSubscriptionInput
  }

  export type TenantSubscriptionUncheckedCreateWithoutInvoicesInput = {
    id?: number
    tenantId: number
    planId: number
    status: $Enums.SubscriptionStatus
    startDate: Date | string
    endDate: Date | string
    trialStartDate?: Date | string | null
    trialEndDate?: Date | string | null
    gracePeriodEndsAt?: Date | string | null
    nextBillingDate?: Date | string | null
    autoRenew?: boolean
    cancelAtPeriodEnd?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    planChangeRequests?: SubscriptionPlanChangeRequestUncheckedCreateNestedManyWithoutCurrentSubscriptionInput
  }

  export type TenantSubscriptionCreateOrConnectWithoutInvoicesInput = {
    where: TenantSubscriptionWhereUniqueInput
    create: XOR<TenantSubscriptionCreateWithoutInvoicesInput, TenantSubscriptionUncheckedCreateWithoutInvoicesInput>
  }

  export type SubscriptionPlanCreateWithoutInvoicesInput = {
    code?: string | null
    name: string
    description?: string | null
    billingInterval?: $Enums.BillingInterval
    monthlyPrice: Decimal | DecimalJsLike | number | string
    commissionPercent: Decimal | DecimalJsLike | number | string
    trialDays?: number
    graceDays?: number
    sortOrder?: number
    features: JsonNullValueInput | InputJsonValue
    tenantSubscriptions?: TenantSubscriptionCreateNestedManyWithoutPlanInput
    requestedChanges?: SubscriptionPlanChangeRequestCreateNestedManyWithoutRequestedPlanInput
  }

  export type SubscriptionPlanUncheckedCreateWithoutInvoicesInput = {
    id?: number
    code?: string | null
    name: string
    description?: string | null
    billingInterval?: $Enums.BillingInterval
    monthlyPrice: Decimal | DecimalJsLike | number | string
    commissionPercent: Decimal | DecimalJsLike | number | string
    trialDays?: number
    graceDays?: number
    sortOrder?: number
    features: JsonNullValueInput | InputJsonValue
    tenantSubscriptions?: TenantSubscriptionUncheckedCreateNestedManyWithoutPlanInput
    requestedChanges?: SubscriptionPlanChangeRequestUncheckedCreateNestedManyWithoutRequestedPlanInput
  }

  export type SubscriptionPlanCreateOrConnectWithoutInvoicesInput = {
    where: SubscriptionPlanWhereUniqueInput
    create: XOR<SubscriptionPlanCreateWithoutInvoicesInput, SubscriptionPlanUncheckedCreateWithoutInvoicesInput>
  }

  export type BillingPaymentCreateWithoutInvoiceInput = {
    amount: Decimal | DecimalJsLike | number | string
    method?: $Enums.BillingPaymentMethod
    status?: $Enums.BillingPaymentStatus
    paidAt?: Date | string
    reference?: string | null
    notes?: string | null
    createdAt?: Date | string
    tenant: TenantCreateNestedOneWithoutBillingPaymentsInput
  }

  export type BillingPaymentUncheckedCreateWithoutInvoiceInput = {
    id?: number
    tenantId: number
    amount: Decimal | DecimalJsLike | number | string
    method?: $Enums.BillingPaymentMethod
    status?: $Enums.BillingPaymentStatus
    paidAt?: Date | string
    reference?: string | null
    notes?: string | null
    createdAt?: Date | string
  }

  export type BillingPaymentCreateOrConnectWithoutInvoiceInput = {
    where: BillingPaymentWhereUniqueInput
    create: XOR<BillingPaymentCreateWithoutInvoiceInput, BillingPaymentUncheckedCreateWithoutInvoiceInput>
  }

  export type BillingPaymentCreateManyInvoiceInputEnvelope = {
    data: BillingPaymentCreateManyInvoiceInput | BillingPaymentCreateManyInvoiceInput[]
    skipDuplicates?: boolean
  }

  export type TenantUpsertWithoutBillingInvoicesInput = {
    update: XOR<TenantUpdateWithoutBillingInvoicesInput, TenantUncheckedUpdateWithoutBillingInvoicesInput>
    create: XOR<TenantCreateWithoutBillingInvoicesInput, TenantUncheckedCreateWithoutBillingInvoicesInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutBillingInvoicesInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutBillingInvoicesInput, TenantUncheckedUpdateWithoutBillingInvoicesInput>
  }

  export type TenantUpdateWithoutBillingInvoicesInput = {
    name?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    databaseUrl?: NullableStringFieldUpdateOperationsInput | string | null
    country?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    staffLoginLookups?: StaffLoginLookupUpdateManyWithoutTenantNestedInput
    subscription?: TenantSubscriptionUpdateManyWithoutTenantNestedInput
    billingPayments?: BillingPaymentUpdateManyWithoutTenantNestedInput
    planChangeRequests?: SubscriptionPlanChangeRequestUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutBillingInvoicesInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    databaseUrl?: NullableStringFieldUpdateOperationsInput | string | null
    country?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    staffLoginLookups?: StaffLoginLookupUncheckedUpdateManyWithoutTenantNestedInput
    subscription?: TenantSubscriptionUncheckedUpdateManyWithoutTenantNestedInput
    billingPayments?: BillingPaymentUncheckedUpdateManyWithoutTenantNestedInput
    planChangeRequests?: SubscriptionPlanChangeRequestUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type TenantSubscriptionUpsertWithoutInvoicesInput = {
    update: XOR<TenantSubscriptionUpdateWithoutInvoicesInput, TenantSubscriptionUncheckedUpdateWithoutInvoicesInput>
    create: XOR<TenantSubscriptionCreateWithoutInvoicesInput, TenantSubscriptionUncheckedCreateWithoutInvoicesInput>
    where?: TenantSubscriptionWhereInput
  }

  export type TenantSubscriptionUpdateToOneWithWhereWithoutInvoicesInput = {
    where?: TenantSubscriptionWhereInput
    data: XOR<TenantSubscriptionUpdateWithoutInvoicesInput, TenantSubscriptionUncheckedUpdateWithoutInvoicesInput>
  }

  export type TenantSubscriptionUpdateWithoutInvoicesInput = {
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    trialStartDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gracePeriodEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextBillingDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    autoRenew?: BoolFieldUpdateOperationsInput | boolean
    cancelAtPeriodEnd?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutSubscriptionNestedInput
    plan?: SubscriptionPlanUpdateOneRequiredWithoutTenantSubscriptionsNestedInput
    planChangeRequests?: SubscriptionPlanChangeRequestUpdateManyWithoutCurrentSubscriptionNestedInput
  }

  export type TenantSubscriptionUncheckedUpdateWithoutInvoicesInput = {
    id?: IntFieldUpdateOperationsInput | number
    tenantId?: IntFieldUpdateOperationsInput | number
    planId?: IntFieldUpdateOperationsInput | number
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    trialStartDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gracePeriodEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextBillingDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    autoRenew?: BoolFieldUpdateOperationsInput | boolean
    cancelAtPeriodEnd?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    planChangeRequests?: SubscriptionPlanChangeRequestUncheckedUpdateManyWithoutCurrentSubscriptionNestedInput
  }

  export type SubscriptionPlanUpsertWithoutInvoicesInput = {
    update: XOR<SubscriptionPlanUpdateWithoutInvoicesInput, SubscriptionPlanUncheckedUpdateWithoutInvoicesInput>
    create: XOR<SubscriptionPlanCreateWithoutInvoicesInput, SubscriptionPlanUncheckedCreateWithoutInvoicesInput>
    where?: SubscriptionPlanWhereInput
  }

  export type SubscriptionPlanUpdateToOneWithWhereWithoutInvoicesInput = {
    where?: SubscriptionPlanWhereInput
    data: XOR<SubscriptionPlanUpdateWithoutInvoicesInput, SubscriptionPlanUncheckedUpdateWithoutInvoicesInput>
  }

  export type SubscriptionPlanUpdateWithoutInvoicesInput = {
    code?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    billingInterval?: EnumBillingIntervalFieldUpdateOperationsInput | $Enums.BillingInterval
    monthlyPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    commissionPercent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    trialDays?: IntFieldUpdateOperationsInput | number
    graceDays?: IntFieldUpdateOperationsInput | number
    sortOrder?: IntFieldUpdateOperationsInput | number
    features?: JsonNullValueInput | InputJsonValue
    tenantSubscriptions?: TenantSubscriptionUpdateManyWithoutPlanNestedInput
    requestedChanges?: SubscriptionPlanChangeRequestUpdateManyWithoutRequestedPlanNestedInput
  }

  export type SubscriptionPlanUncheckedUpdateWithoutInvoicesInput = {
    id?: IntFieldUpdateOperationsInput | number
    code?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    billingInterval?: EnumBillingIntervalFieldUpdateOperationsInput | $Enums.BillingInterval
    monthlyPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    commissionPercent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    trialDays?: IntFieldUpdateOperationsInput | number
    graceDays?: IntFieldUpdateOperationsInput | number
    sortOrder?: IntFieldUpdateOperationsInput | number
    features?: JsonNullValueInput | InputJsonValue
    tenantSubscriptions?: TenantSubscriptionUncheckedUpdateManyWithoutPlanNestedInput
    requestedChanges?: SubscriptionPlanChangeRequestUncheckedUpdateManyWithoutRequestedPlanNestedInput
  }

  export type BillingPaymentUpsertWithWhereUniqueWithoutInvoiceInput = {
    where: BillingPaymentWhereUniqueInput
    update: XOR<BillingPaymentUpdateWithoutInvoiceInput, BillingPaymentUncheckedUpdateWithoutInvoiceInput>
    create: XOR<BillingPaymentCreateWithoutInvoiceInput, BillingPaymentUncheckedCreateWithoutInvoiceInput>
  }

  export type BillingPaymentUpdateWithWhereUniqueWithoutInvoiceInput = {
    where: BillingPaymentWhereUniqueInput
    data: XOR<BillingPaymentUpdateWithoutInvoiceInput, BillingPaymentUncheckedUpdateWithoutInvoiceInput>
  }

  export type BillingPaymentUpdateManyWithWhereWithoutInvoiceInput = {
    where: BillingPaymentScalarWhereInput
    data: XOR<BillingPaymentUpdateManyMutationInput, BillingPaymentUncheckedUpdateManyWithoutInvoiceInput>
  }

  export type BillingInvoiceCreateWithoutPaymentsInput = {
    invoiceNumber: string
    status?: $Enums.BillingInvoiceStatus
    issuedAt?: Date | string
    dueDate: Date | string
    periodStart: Date | string
    periodEnd: Date | string
    subtotal: Decimal | DecimalJsLike | number | string
    taxAmount?: Decimal | DecimalJsLike | number | string
    totalAmount: Decimal | DecimalJsLike | number | string
    currency?: string
    lineItems: JsonNullValueInput | InputJsonValue
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    tenant: TenantCreateNestedOneWithoutBillingInvoicesInput
    subscription: TenantSubscriptionCreateNestedOneWithoutInvoicesInput
    plan: SubscriptionPlanCreateNestedOneWithoutInvoicesInput
  }

  export type BillingInvoiceUncheckedCreateWithoutPaymentsInput = {
    id?: number
    tenantId: number
    subscriptionId: number
    planId: number
    invoiceNumber: string
    status?: $Enums.BillingInvoiceStatus
    issuedAt?: Date | string
    dueDate: Date | string
    periodStart: Date | string
    periodEnd: Date | string
    subtotal: Decimal | DecimalJsLike | number | string
    taxAmount?: Decimal | DecimalJsLike | number | string
    totalAmount: Decimal | DecimalJsLike | number | string
    currency?: string
    lineItems: JsonNullValueInput | InputJsonValue
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BillingInvoiceCreateOrConnectWithoutPaymentsInput = {
    where: BillingInvoiceWhereUniqueInput
    create: XOR<BillingInvoiceCreateWithoutPaymentsInput, BillingInvoiceUncheckedCreateWithoutPaymentsInput>
  }

  export type TenantCreateWithoutBillingPaymentsInput = {
    name: string
    subdomain: string
    databaseUrl?: string | null
    country?: string
    logoUrl?: string | null
    status?: $Enums.TenantStatus
    createdAt?: Date | string
    staffLoginLookups?: StaffLoginLookupCreateNestedManyWithoutTenantInput
    subscription?: TenantSubscriptionCreateNestedManyWithoutTenantInput
    billingInvoices?: BillingInvoiceCreateNestedManyWithoutTenantInput
    planChangeRequests?: SubscriptionPlanChangeRequestCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutBillingPaymentsInput = {
    id?: number
    name: string
    subdomain: string
    databaseUrl?: string | null
    country?: string
    logoUrl?: string | null
    status?: $Enums.TenantStatus
    createdAt?: Date | string
    staffLoginLookups?: StaffLoginLookupUncheckedCreateNestedManyWithoutTenantInput
    subscription?: TenantSubscriptionUncheckedCreateNestedManyWithoutTenantInput
    billingInvoices?: BillingInvoiceUncheckedCreateNestedManyWithoutTenantInput
    planChangeRequests?: SubscriptionPlanChangeRequestUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutBillingPaymentsInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutBillingPaymentsInput, TenantUncheckedCreateWithoutBillingPaymentsInput>
  }

  export type BillingInvoiceUpsertWithoutPaymentsInput = {
    update: XOR<BillingInvoiceUpdateWithoutPaymentsInput, BillingInvoiceUncheckedUpdateWithoutPaymentsInput>
    create: XOR<BillingInvoiceCreateWithoutPaymentsInput, BillingInvoiceUncheckedCreateWithoutPaymentsInput>
    where?: BillingInvoiceWhereInput
  }

  export type BillingInvoiceUpdateToOneWithWhereWithoutPaymentsInput = {
    where?: BillingInvoiceWhereInput
    data: XOR<BillingInvoiceUpdateWithoutPaymentsInput, BillingInvoiceUncheckedUpdateWithoutPaymentsInput>
  }

  export type BillingInvoiceUpdateWithoutPaymentsInput = {
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    status?: EnumBillingInvoiceStatusFieldUpdateOperationsInput | $Enums.BillingInvoiceStatus
    issuedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    lineItems?: JsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutBillingInvoicesNestedInput
    subscription?: TenantSubscriptionUpdateOneRequiredWithoutInvoicesNestedInput
    plan?: SubscriptionPlanUpdateOneRequiredWithoutInvoicesNestedInput
  }

  export type BillingInvoiceUncheckedUpdateWithoutPaymentsInput = {
    id?: IntFieldUpdateOperationsInput | number
    tenantId?: IntFieldUpdateOperationsInput | number
    subscriptionId?: IntFieldUpdateOperationsInput | number
    planId?: IntFieldUpdateOperationsInput | number
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    status?: EnumBillingInvoiceStatusFieldUpdateOperationsInput | $Enums.BillingInvoiceStatus
    issuedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    lineItems?: JsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantUpsertWithoutBillingPaymentsInput = {
    update: XOR<TenantUpdateWithoutBillingPaymentsInput, TenantUncheckedUpdateWithoutBillingPaymentsInput>
    create: XOR<TenantCreateWithoutBillingPaymentsInput, TenantUncheckedCreateWithoutBillingPaymentsInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutBillingPaymentsInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutBillingPaymentsInput, TenantUncheckedUpdateWithoutBillingPaymentsInput>
  }

  export type TenantUpdateWithoutBillingPaymentsInput = {
    name?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    databaseUrl?: NullableStringFieldUpdateOperationsInput | string | null
    country?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    staffLoginLookups?: StaffLoginLookupUpdateManyWithoutTenantNestedInput
    subscription?: TenantSubscriptionUpdateManyWithoutTenantNestedInput
    billingInvoices?: BillingInvoiceUpdateManyWithoutTenantNestedInput
    planChangeRequests?: SubscriptionPlanChangeRequestUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutBillingPaymentsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    databaseUrl?: NullableStringFieldUpdateOperationsInput | string | null
    country?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    staffLoginLookups?: StaffLoginLookupUncheckedUpdateManyWithoutTenantNestedInput
    subscription?: TenantSubscriptionUncheckedUpdateManyWithoutTenantNestedInput
    billingInvoices?: BillingInvoiceUncheckedUpdateManyWithoutTenantNestedInput
    planChangeRequests?: SubscriptionPlanChangeRequestUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type TenantCreateWithoutPlanChangeRequestsInput = {
    name: string
    subdomain: string
    databaseUrl?: string | null
    country?: string
    logoUrl?: string | null
    status?: $Enums.TenantStatus
    createdAt?: Date | string
    staffLoginLookups?: StaffLoginLookupCreateNestedManyWithoutTenantInput
    subscription?: TenantSubscriptionCreateNestedManyWithoutTenantInput
    billingInvoices?: BillingInvoiceCreateNestedManyWithoutTenantInput
    billingPayments?: BillingPaymentCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutPlanChangeRequestsInput = {
    id?: number
    name: string
    subdomain: string
    databaseUrl?: string | null
    country?: string
    logoUrl?: string | null
    status?: $Enums.TenantStatus
    createdAt?: Date | string
    staffLoginLookups?: StaffLoginLookupUncheckedCreateNestedManyWithoutTenantInput
    subscription?: TenantSubscriptionUncheckedCreateNestedManyWithoutTenantInput
    billingInvoices?: BillingInvoiceUncheckedCreateNestedManyWithoutTenantInput
    billingPayments?: BillingPaymentUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutPlanChangeRequestsInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutPlanChangeRequestsInput, TenantUncheckedCreateWithoutPlanChangeRequestsInput>
  }

  export type TenantSubscriptionCreateWithoutPlanChangeRequestsInput = {
    status: $Enums.SubscriptionStatus
    startDate: Date | string
    endDate: Date | string
    trialStartDate?: Date | string | null
    trialEndDate?: Date | string | null
    gracePeriodEndsAt?: Date | string | null
    nextBillingDate?: Date | string | null
    autoRenew?: boolean
    cancelAtPeriodEnd?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    tenant: TenantCreateNestedOneWithoutSubscriptionInput
    plan: SubscriptionPlanCreateNestedOneWithoutTenantSubscriptionsInput
    invoices?: BillingInvoiceCreateNestedManyWithoutSubscriptionInput
  }

  export type TenantSubscriptionUncheckedCreateWithoutPlanChangeRequestsInput = {
    id?: number
    tenantId: number
    planId: number
    status: $Enums.SubscriptionStatus
    startDate: Date | string
    endDate: Date | string
    trialStartDate?: Date | string | null
    trialEndDate?: Date | string | null
    gracePeriodEndsAt?: Date | string | null
    nextBillingDate?: Date | string | null
    autoRenew?: boolean
    cancelAtPeriodEnd?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    invoices?: BillingInvoiceUncheckedCreateNestedManyWithoutSubscriptionInput
  }

  export type TenantSubscriptionCreateOrConnectWithoutPlanChangeRequestsInput = {
    where: TenantSubscriptionWhereUniqueInput
    create: XOR<TenantSubscriptionCreateWithoutPlanChangeRequestsInput, TenantSubscriptionUncheckedCreateWithoutPlanChangeRequestsInput>
  }

  export type SubscriptionPlanCreateWithoutRequestedChangesInput = {
    code?: string | null
    name: string
    description?: string | null
    billingInterval?: $Enums.BillingInterval
    monthlyPrice: Decimal | DecimalJsLike | number | string
    commissionPercent: Decimal | DecimalJsLike | number | string
    trialDays?: number
    graceDays?: number
    sortOrder?: number
    features: JsonNullValueInput | InputJsonValue
    tenantSubscriptions?: TenantSubscriptionCreateNestedManyWithoutPlanInput
    invoices?: BillingInvoiceCreateNestedManyWithoutPlanInput
  }

  export type SubscriptionPlanUncheckedCreateWithoutRequestedChangesInput = {
    id?: number
    code?: string | null
    name: string
    description?: string | null
    billingInterval?: $Enums.BillingInterval
    monthlyPrice: Decimal | DecimalJsLike | number | string
    commissionPercent: Decimal | DecimalJsLike | number | string
    trialDays?: number
    graceDays?: number
    sortOrder?: number
    features: JsonNullValueInput | InputJsonValue
    tenantSubscriptions?: TenantSubscriptionUncheckedCreateNestedManyWithoutPlanInput
    invoices?: BillingInvoiceUncheckedCreateNestedManyWithoutPlanInput
  }

  export type SubscriptionPlanCreateOrConnectWithoutRequestedChangesInput = {
    where: SubscriptionPlanWhereUniqueInput
    create: XOR<SubscriptionPlanCreateWithoutRequestedChangesInput, SubscriptionPlanUncheckedCreateWithoutRequestedChangesInput>
  }

  export type TenantUpsertWithoutPlanChangeRequestsInput = {
    update: XOR<TenantUpdateWithoutPlanChangeRequestsInput, TenantUncheckedUpdateWithoutPlanChangeRequestsInput>
    create: XOR<TenantCreateWithoutPlanChangeRequestsInput, TenantUncheckedCreateWithoutPlanChangeRequestsInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutPlanChangeRequestsInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutPlanChangeRequestsInput, TenantUncheckedUpdateWithoutPlanChangeRequestsInput>
  }

  export type TenantUpdateWithoutPlanChangeRequestsInput = {
    name?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    databaseUrl?: NullableStringFieldUpdateOperationsInput | string | null
    country?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    staffLoginLookups?: StaffLoginLookupUpdateManyWithoutTenantNestedInput
    subscription?: TenantSubscriptionUpdateManyWithoutTenantNestedInput
    billingInvoices?: BillingInvoiceUpdateManyWithoutTenantNestedInput
    billingPayments?: BillingPaymentUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutPlanChangeRequestsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    databaseUrl?: NullableStringFieldUpdateOperationsInput | string | null
    country?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    staffLoginLookups?: StaffLoginLookupUncheckedUpdateManyWithoutTenantNestedInput
    subscription?: TenantSubscriptionUncheckedUpdateManyWithoutTenantNestedInput
    billingInvoices?: BillingInvoiceUncheckedUpdateManyWithoutTenantNestedInput
    billingPayments?: BillingPaymentUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type TenantSubscriptionUpsertWithoutPlanChangeRequestsInput = {
    update: XOR<TenantSubscriptionUpdateWithoutPlanChangeRequestsInput, TenantSubscriptionUncheckedUpdateWithoutPlanChangeRequestsInput>
    create: XOR<TenantSubscriptionCreateWithoutPlanChangeRequestsInput, TenantSubscriptionUncheckedCreateWithoutPlanChangeRequestsInput>
    where?: TenantSubscriptionWhereInput
  }

  export type TenantSubscriptionUpdateToOneWithWhereWithoutPlanChangeRequestsInput = {
    where?: TenantSubscriptionWhereInput
    data: XOR<TenantSubscriptionUpdateWithoutPlanChangeRequestsInput, TenantSubscriptionUncheckedUpdateWithoutPlanChangeRequestsInput>
  }

  export type TenantSubscriptionUpdateWithoutPlanChangeRequestsInput = {
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    trialStartDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gracePeriodEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextBillingDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    autoRenew?: BoolFieldUpdateOperationsInput | boolean
    cancelAtPeriodEnd?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutSubscriptionNestedInput
    plan?: SubscriptionPlanUpdateOneRequiredWithoutTenantSubscriptionsNestedInput
    invoices?: BillingInvoiceUpdateManyWithoutSubscriptionNestedInput
  }

  export type TenantSubscriptionUncheckedUpdateWithoutPlanChangeRequestsInput = {
    id?: IntFieldUpdateOperationsInput | number
    tenantId?: IntFieldUpdateOperationsInput | number
    planId?: IntFieldUpdateOperationsInput | number
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    trialStartDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gracePeriodEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextBillingDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    autoRenew?: BoolFieldUpdateOperationsInput | boolean
    cancelAtPeriodEnd?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoices?: BillingInvoiceUncheckedUpdateManyWithoutSubscriptionNestedInput
  }

  export type SubscriptionPlanUpsertWithoutRequestedChangesInput = {
    update: XOR<SubscriptionPlanUpdateWithoutRequestedChangesInput, SubscriptionPlanUncheckedUpdateWithoutRequestedChangesInput>
    create: XOR<SubscriptionPlanCreateWithoutRequestedChangesInput, SubscriptionPlanUncheckedCreateWithoutRequestedChangesInput>
    where?: SubscriptionPlanWhereInput
  }

  export type SubscriptionPlanUpdateToOneWithWhereWithoutRequestedChangesInput = {
    where?: SubscriptionPlanWhereInput
    data: XOR<SubscriptionPlanUpdateWithoutRequestedChangesInput, SubscriptionPlanUncheckedUpdateWithoutRequestedChangesInput>
  }

  export type SubscriptionPlanUpdateWithoutRequestedChangesInput = {
    code?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    billingInterval?: EnumBillingIntervalFieldUpdateOperationsInput | $Enums.BillingInterval
    monthlyPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    commissionPercent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    trialDays?: IntFieldUpdateOperationsInput | number
    graceDays?: IntFieldUpdateOperationsInput | number
    sortOrder?: IntFieldUpdateOperationsInput | number
    features?: JsonNullValueInput | InputJsonValue
    tenantSubscriptions?: TenantSubscriptionUpdateManyWithoutPlanNestedInput
    invoices?: BillingInvoiceUpdateManyWithoutPlanNestedInput
  }

  export type SubscriptionPlanUncheckedUpdateWithoutRequestedChangesInput = {
    id?: IntFieldUpdateOperationsInput | number
    code?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    billingInterval?: EnumBillingIntervalFieldUpdateOperationsInput | $Enums.BillingInterval
    monthlyPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    commissionPercent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    trialDays?: IntFieldUpdateOperationsInput | number
    graceDays?: IntFieldUpdateOperationsInput | number
    sortOrder?: IntFieldUpdateOperationsInput | number
    features?: JsonNullValueInput | InputJsonValue
    tenantSubscriptions?: TenantSubscriptionUncheckedUpdateManyWithoutPlanNestedInput
    invoices?: BillingInvoiceUncheckedUpdateManyWithoutPlanNestedInput
  }

  export type StaffLoginLookupCreateManyTenantInput = {
    id?: number
    email: string
    staffId: number
  }

  export type TenantSubscriptionCreateManyTenantInput = {
    id?: number
    planId: number
    status: $Enums.SubscriptionStatus
    startDate: Date | string
    endDate: Date | string
    trialStartDate?: Date | string | null
    trialEndDate?: Date | string | null
    gracePeriodEndsAt?: Date | string | null
    nextBillingDate?: Date | string | null
    autoRenew?: boolean
    cancelAtPeriodEnd?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BillingInvoiceCreateManyTenantInput = {
    id?: number
    subscriptionId: number
    planId: number
    invoiceNumber: string
    status?: $Enums.BillingInvoiceStatus
    issuedAt?: Date | string
    dueDate: Date | string
    periodStart: Date | string
    periodEnd: Date | string
    subtotal: Decimal | DecimalJsLike | number | string
    taxAmount?: Decimal | DecimalJsLike | number | string
    totalAmount: Decimal | DecimalJsLike | number | string
    currency?: string
    lineItems: JsonNullValueInput | InputJsonValue
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BillingPaymentCreateManyTenantInput = {
    id?: number
    invoiceId: number
    amount: Decimal | DecimalJsLike | number | string
    method?: $Enums.BillingPaymentMethod
    status?: $Enums.BillingPaymentStatus
    paidAt?: Date | string
    reference?: string | null
    notes?: string | null
    createdAt?: Date | string
  }

  export type SubscriptionPlanChangeRequestCreateManyTenantInput = {
    id?: number
    currentSubscriptionId?: number | null
    requestedPlanId: number
    status?: $Enums.PlanChangeRequestStatus
    message?: string | null
    reviewedNote?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    reviewedAt?: Date | string | null
  }

  export type StaffLoginLookupUpdateWithoutTenantInput = {
    email?: StringFieldUpdateOperationsInput | string
    staffId?: IntFieldUpdateOperationsInput | number
  }

  export type StaffLoginLookupUncheckedUpdateWithoutTenantInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    staffId?: IntFieldUpdateOperationsInput | number
  }

  export type StaffLoginLookupUncheckedUpdateManyWithoutTenantInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    staffId?: IntFieldUpdateOperationsInput | number
  }

  export type TenantSubscriptionUpdateWithoutTenantInput = {
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    trialStartDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gracePeriodEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextBillingDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    autoRenew?: BoolFieldUpdateOperationsInput | boolean
    cancelAtPeriodEnd?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    plan?: SubscriptionPlanUpdateOneRequiredWithoutTenantSubscriptionsNestedInput
    invoices?: BillingInvoiceUpdateManyWithoutSubscriptionNestedInput
    planChangeRequests?: SubscriptionPlanChangeRequestUpdateManyWithoutCurrentSubscriptionNestedInput
  }

  export type TenantSubscriptionUncheckedUpdateWithoutTenantInput = {
    id?: IntFieldUpdateOperationsInput | number
    planId?: IntFieldUpdateOperationsInput | number
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    trialStartDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gracePeriodEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextBillingDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    autoRenew?: BoolFieldUpdateOperationsInput | boolean
    cancelAtPeriodEnd?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoices?: BillingInvoiceUncheckedUpdateManyWithoutSubscriptionNestedInput
    planChangeRequests?: SubscriptionPlanChangeRequestUncheckedUpdateManyWithoutCurrentSubscriptionNestedInput
  }

  export type TenantSubscriptionUncheckedUpdateManyWithoutTenantInput = {
    id?: IntFieldUpdateOperationsInput | number
    planId?: IntFieldUpdateOperationsInput | number
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    trialStartDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gracePeriodEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextBillingDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    autoRenew?: BoolFieldUpdateOperationsInput | boolean
    cancelAtPeriodEnd?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BillingInvoiceUpdateWithoutTenantInput = {
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    status?: EnumBillingInvoiceStatusFieldUpdateOperationsInput | $Enums.BillingInvoiceStatus
    issuedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    lineItems?: JsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subscription?: TenantSubscriptionUpdateOneRequiredWithoutInvoicesNestedInput
    plan?: SubscriptionPlanUpdateOneRequiredWithoutInvoicesNestedInput
    payments?: BillingPaymentUpdateManyWithoutInvoiceNestedInput
  }

  export type BillingInvoiceUncheckedUpdateWithoutTenantInput = {
    id?: IntFieldUpdateOperationsInput | number
    subscriptionId?: IntFieldUpdateOperationsInput | number
    planId?: IntFieldUpdateOperationsInput | number
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    status?: EnumBillingInvoiceStatusFieldUpdateOperationsInput | $Enums.BillingInvoiceStatus
    issuedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    lineItems?: JsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    payments?: BillingPaymentUncheckedUpdateManyWithoutInvoiceNestedInput
  }

  export type BillingInvoiceUncheckedUpdateManyWithoutTenantInput = {
    id?: IntFieldUpdateOperationsInput | number
    subscriptionId?: IntFieldUpdateOperationsInput | number
    planId?: IntFieldUpdateOperationsInput | number
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    status?: EnumBillingInvoiceStatusFieldUpdateOperationsInput | $Enums.BillingInvoiceStatus
    issuedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    lineItems?: JsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BillingPaymentUpdateWithoutTenantInput = {
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    method?: EnumBillingPaymentMethodFieldUpdateOperationsInput | $Enums.BillingPaymentMethod
    status?: EnumBillingPaymentStatusFieldUpdateOperationsInput | $Enums.BillingPaymentStatus
    paidAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoice?: BillingInvoiceUpdateOneRequiredWithoutPaymentsNestedInput
  }

  export type BillingPaymentUncheckedUpdateWithoutTenantInput = {
    id?: IntFieldUpdateOperationsInput | number
    invoiceId?: IntFieldUpdateOperationsInput | number
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    method?: EnumBillingPaymentMethodFieldUpdateOperationsInput | $Enums.BillingPaymentMethod
    status?: EnumBillingPaymentStatusFieldUpdateOperationsInput | $Enums.BillingPaymentStatus
    paidAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BillingPaymentUncheckedUpdateManyWithoutTenantInput = {
    id?: IntFieldUpdateOperationsInput | number
    invoiceId?: IntFieldUpdateOperationsInput | number
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    method?: EnumBillingPaymentMethodFieldUpdateOperationsInput | $Enums.BillingPaymentMethod
    status?: EnumBillingPaymentStatusFieldUpdateOperationsInput | $Enums.BillingPaymentStatus
    paidAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionPlanChangeRequestUpdateWithoutTenantInput = {
    status?: EnumPlanChangeRequestStatusFieldUpdateOperationsInput | $Enums.PlanChangeRequestStatus
    message?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentSubscription?: TenantSubscriptionUpdateOneWithoutPlanChangeRequestsNestedInput
    requestedPlan?: SubscriptionPlanUpdateOneRequiredWithoutRequestedChangesNestedInput
  }

  export type SubscriptionPlanChangeRequestUncheckedUpdateWithoutTenantInput = {
    id?: IntFieldUpdateOperationsInput | number
    currentSubscriptionId?: NullableIntFieldUpdateOperationsInput | number | null
    requestedPlanId?: IntFieldUpdateOperationsInput | number
    status?: EnumPlanChangeRequestStatusFieldUpdateOperationsInput | $Enums.PlanChangeRequestStatus
    message?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type SubscriptionPlanChangeRequestUncheckedUpdateManyWithoutTenantInput = {
    id?: IntFieldUpdateOperationsInput | number
    currentSubscriptionId?: NullableIntFieldUpdateOperationsInput | number | null
    requestedPlanId?: IntFieldUpdateOperationsInput | number
    status?: EnumPlanChangeRequestStatusFieldUpdateOperationsInput | $Enums.PlanChangeRequestStatus
    message?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TenantSubscriptionCreateManyPlanInput = {
    id?: number
    tenantId: number
    status: $Enums.SubscriptionStatus
    startDate: Date | string
    endDate: Date | string
    trialStartDate?: Date | string | null
    trialEndDate?: Date | string | null
    gracePeriodEndsAt?: Date | string | null
    nextBillingDate?: Date | string | null
    autoRenew?: boolean
    cancelAtPeriodEnd?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BillingInvoiceCreateManyPlanInput = {
    id?: number
    tenantId: number
    subscriptionId: number
    invoiceNumber: string
    status?: $Enums.BillingInvoiceStatus
    issuedAt?: Date | string
    dueDate: Date | string
    periodStart: Date | string
    periodEnd: Date | string
    subtotal: Decimal | DecimalJsLike | number | string
    taxAmount?: Decimal | DecimalJsLike | number | string
    totalAmount: Decimal | DecimalJsLike | number | string
    currency?: string
    lineItems: JsonNullValueInput | InputJsonValue
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SubscriptionPlanChangeRequestCreateManyRequestedPlanInput = {
    id?: number
    tenantId: number
    currentSubscriptionId?: number | null
    status?: $Enums.PlanChangeRequestStatus
    message?: string | null
    reviewedNote?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    reviewedAt?: Date | string | null
  }

  export type TenantSubscriptionUpdateWithoutPlanInput = {
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    trialStartDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gracePeriodEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextBillingDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    autoRenew?: BoolFieldUpdateOperationsInput | boolean
    cancelAtPeriodEnd?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutSubscriptionNestedInput
    invoices?: BillingInvoiceUpdateManyWithoutSubscriptionNestedInput
    planChangeRequests?: SubscriptionPlanChangeRequestUpdateManyWithoutCurrentSubscriptionNestedInput
  }

  export type TenantSubscriptionUncheckedUpdateWithoutPlanInput = {
    id?: IntFieldUpdateOperationsInput | number
    tenantId?: IntFieldUpdateOperationsInput | number
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    trialStartDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gracePeriodEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextBillingDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    autoRenew?: BoolFieldUpdateOperationsInput | boolean
    cancelAtPeriodEnd?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoices?: BillingInvoiceUncheckedUpdateManyWithoutSubscriptionNestedInput
    planChangeRequests?: SubscriptionPlanChangeRequestUncheckedUpdateManyWithoutCurrentSubscriptionNestedInput
  }

  export type TenantSubscriptionUncheckedUpdateManyWithoutPlanInput = {
    id?: IntFieldUpdateOperationsInput | number
    tenantId?: IntFieldUpdateOperationsInput | number
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    trialStartDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gracePeriodEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextBillingDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    autoRenew?: BoolFieldUpdateOperationsInput | boolean
    cancelAtPeriodEnd?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BillingInvoiceUpdateWithoutPlanInput = {
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    status?: EnumBillingInvoiceStatusFieldUpdateOperationsInput | $Enums.BillingInvoiceStatus
    issuedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    lineItems?: JsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutBillingInvoicesNestedInput
    subscription?: TenantSubscriptionUpdateOneRequiredWithoutInvoicesNestedInput
    payments?: BillingPaymentUpdateManyWithoutInvoiceNestedInput
  }

  export type BillingInvoiceUncheckedUpdateWithoutPlanInput = {
    id?: IntFieldUpdateOperationsInput | number
    tenantId?: IntFieldUpdateOperationsInput | number
    subscriptionId?: IntFieldUpdateOperationsInput | number
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    status?: EnumBillingInvoiceStatusFieldUpdateOperationsInput | $Enums.BillingInvoiceStatus
    issuedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    lineItems?: JsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    payments?: BillingPaymentUncheckedUpdateManyWithoutInvoiceNestedInput
  }

  export type BillingInvoiceUncheckedUpdateManyWithoutPlanInput = {
    id?: IntFieldUpdateOperationsInput | number
    tenantId?: IntFieldUpdateOperationsInput | number
    subscriptionId?: IntFieldUpdateOperationsInput | number
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    status?: EnumBillingInvoiceStatusFieldUpdateOperationsInput | $Enums.BillingInvoiceStatus
    issuedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    lineItems?: JsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionPlanChangeRequestUpdateWithoutRequestedPlanInput = {
    status?: EnumPlanChangeRequestStatusFieldUpdateOperationsInput | $Enums.PlanChangeRequestStatus
    message?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tenant?: TenantUpdateOneRequiredWithoutPlanChangeRequestsNestedInput
    currentSubscription?: TenantSubscriptionUpdateOneWithoutPlanChangeRequestsNestedInput
  }

  export type SubscriptionPlanChangeRequestUncheckedUpdateWithoutRequestedPlanInput = {
    id?: IntFieldUpdateOperationsInput | number
    tenantId?: IntFieldUpdateOperationsInput | number
    currentSubscriptionId?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumPlanChangeRequestStatusFieldUpdateOperationsInput | $Enums.PlanChangeRequestStatus
    message?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type SubscriptionPlanChangeRequestUncheckedUpdateManyWithoutRequestedPlanInput = {
    id?: IntFieldUpdateOperationsInput | number
    tenantId?: IntFieldUpdateOperationsInput | number
    currentSubscriptionId?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumPlanChangeRequestStatusFieldUpdateOperationsInput | $Enums.PlanChangeRequestStatus
    message?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type BillingInvoiceCreateManySubscriptionInput = {
    id?: number
    tenantId: number
    planId: number
    invoiceNumber: string
    status?: $Enums.BillingInvoiceStatus
    issuedAt?: Date | string
    dueDate: Date | string
    periodStart: Date | string
    periodEnd: Date | string
    subtotal: Decimal | DecimalJsLike | number | string
    taxAmount?: Decimal | DecimalJsLike | number | string
    totalAmount: Decimal | DecimalJsLike | number | string
    currency?: string
    lineItems: JsonNullValueInput | InputJsonValue
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SubscriptionPlanChangeRequestCreateManyCurrentSubscriptionInput = {
    id?: number
    tenantId: number
    requestedPlanId: number
    status?: $Enums.PlanChangeRequestStatus
    message?: string | null
    reviewedNote?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    reviewedAt?: Date | string | null
  }

  export type BillingInvoiceUpdateWithoutSubscriptionInput = {
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    status?: EnumBillingInvoiceStatusFieldUpdateOperationsInput | $Enums.BillingInvoiceStatus
    issuedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    lineItems?: JsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutBillingInvoicesNestedInput
    plan?: SubscriptionPlanUpdateOneRequiredWithoutInvoicesNestedInput
    payments?: BillingPaymentUpdateManyWithoutInvoiceNestedInput
  }

  export type BillingInvoiceUncheckedUpdateWithoutSubscriptionInput = {
    id?: IntFieldUpdateOperationsInput | number
    tenantId?: IntFieldUpdateOperationsInput | number
    planId?: IntFieldUpdateOperationsInput | number
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    status?: EnumBillingInvoiceStatusFieldUpdateOperationsInput | $Enums.BillingInvoiceStatus
    issuedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    lineItems?: JsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    payments?: BillingPaymentUncheckedUpdateManyWithoutInvoiceNestedInput
  }

  export type BillingInvoiceUncheckedUpdateManyWithoutSubscriptionInput = {
    id?: IntFieldUpdateOperationsInput | number
    tenantId?: IntFieldUpdateOperationsInput | number
    planId?: IntFieldUpdateOperationsInput | number
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    status?: EnumBillingInvoiceStatusFieldUpdateOperationsInput | $Enums.BillingInvoiceStatus
    issuedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    lineItems?: JsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionPlanChangeRequestUpdateWithoutCurrentSubscriptionInput = {
    status?: EnumPlanChangeRequestStatusFieldUpdateOperationsInput | $Enums.PlanChangeRequestStatus
    message?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tenant?: TenantUpdateOneRequiredWithoutPlanChangeRequestsNestedInput
    requestedPlan?: SubscriptionPlanUpdateOneRequiredWithoutRequestedChangesNestedInput
  }

  export type SubscriptionPlanChangeRequestUncheckedUpdateWithoutCurrentSubscriptionInput = {
    id?: IntFieldUpdateOperationsInput | number
    tenantId?: IntFieldUpdateOperationsInput | number
    requestedPlanId?: IntFieldUpdateOperationsInput | number
    status?: EnumPlanChangeRequestStatusFieldUpdateOperationsInput | $Enums.PlanChangeRequestStatus
    message?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type SubscriptionPlanChangeRequestUncheckedUpdateManyWithoutCurrentSubscriptionInput = {
    id?: IntFieldUpdateOperationsInput | number
    tenantId?: IntFieldUpdateOperationsInput | number
    requestedPlanId?: IntFieldUpdateOperationsInput | number
    status?: EnumPlanChangeRequestStatusFieldUpdateOperationsInput | $Enums.PlanChangeRequestStatus
    message?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type BillingPaymentCreateManyInvoiceInput = {
    id?: number
    tenantId: number
    amount: Decimal | DecimalJsLike | number | string
    method?: $Enums.BillingPaymentMethod
    status?: $Enums.BillingPaymentStatus
    paidAt?: Date | string
    reference?: string | null
    notes?: string | null
    createdAt?: Date | string
  }

  export type BillingPaymentUpdateWithoutInvoiceInput = {
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    method?: EnumBillingPaymentMethodFieldUpdateOperationsInput | $Enums.BillingPaymentMethod
    status?: EnumBillingPaymentStatusFieldUpdateOperationsInput | $Enums.BillingPaymentStatus
    paidAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutBillingPaymentsNestedInput
  }

  export type BillingPaymentUncheckedUpdateWithoutInvoiceInput = {
    id?: IntFieldUpdateOperationsInput | number
    tenantId?: IntFieldUpdateOperationsInput | number
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    method?: EnumBillingPaymentMethodFieldUpdateOperationsInput | $Enums.BillingPaymentMethod
    status?: EnumBillingPaymentStatusFieldUpdateOperationsInput | $Enums.BillingPaymentStatus
    paidAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BillingPaymentUncheckedUpdateManyWithoutInvoiceInput = {
    id?: IntFieldUpdateOperationsInput | number
    tenantId?: IntFieldUpdateOperationsInput | number
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    method?: EnumBillingPaymentMethodFieldUpdateOperationsInput | $Enums.BillingPaymentMethod
    status?: EnumBillingPaymentStatusFieldUpdateOperationsInput | $Enums.BillingPaymentStatus
    paidAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}