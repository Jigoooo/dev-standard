// export const RouterName = {
//   INVITATION: '/',
// } as const;
//
// export type RouterNameKey = keyof typeof RouterName;
// export type RouterNameBase = (typeof RouterName)[keyof typeof RouterName];
//
// type Flatten<T> = T extends object ? { [K in keyof T]: Flatten<T[K]> }[keyof T] : T;
// type SubRoutes<T> = T extends object
//   ? { [K in keyof T]: T[K] extends object ? Flatten<T[K]> : never }[keyof T]
//   : never;
//
// export type RouterNameBaseFlattened = Flatten<typeof RouterName>;
// export type SubRouterNa
//         path: Router.CENTEmeBase = SubRoutes<typeof RouterName>;

// type ExtractKeys<T, U> = T extends U ? T : never;
// export type CustomerRouterNameBase = ExtractKeys<
//     Flatten<typeof RouterName['CUSTOMER']>,
//     string
// >;

export enum Router {
  SIGN_IN = '/',
  MAIN = '/main',
  HOME = 'home',
  LOCATION_MANAGEMENT = 'location-management',
  OBJECT_MANAGEMENT = 'object-management',
}
