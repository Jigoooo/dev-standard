import { createContext } from 'react';

import { TTableContextLegacy } from '@/shared/components';

export const TableContextLegacy = createContext<TTableContextLegacy<unknown> | null>(null);

/*
 * todo
 *  구현목록
 * 1. 컬럼 필터링
 * 2. 멀티플 소팅 구현
 * 3. 컬럼이동
 * 4. 헤더 그룹화
 * */

// export function RootTable<T>({
//   headers,
//   dataList,
//   isSorting = false,
//   isPaging = true,
//   isMultipleSorting = false,
//   visibleCheckbox = false,
//   visibleIndex = false,
//   fixed = false,
//   fixedWidth = 0,
//   resetCheckList = () => {},
//   children,
// }: {
//   headers: THeader[];
//   dataList: T[];
//   isSorting?: boolean;
//   isPaging?: boolean;
//   isMultipleSorting?: boolean;
//   visibleCheckbox?: boolean;
//   visibleIndex?: boolean;
//   fixed?: boolean;
//   fixedWidth?: number;
//   resetCheckList?: () => void;
//   children: ReactNode;
// }) {
//   const tableRef = useRef<HTMLDivElement | null>(null);
//
//   const { pagination, totalPages, currentPageDataList, handlePageChange, handlePageSizeChange } =
//     useTablePaging({
//       dataList: dataList,
//     });
//
//   const { sortedDataList, sortedHeaders, handleSort, resetSort } = useTableSorting({
//     headers,
//     dataList: isPaging ? currentPageDataList : dataList,
//     isMultipleSorting,
//   });
//
//   const refinedDataList = isSorting ? sortedDataList : dataList;
//
//   useEffect(() => {
//     if (isSorting) {
//       resetSort();
//     }
//   }, [isSorting]);
//
//   const headerTotalWidth = headers.reduce(
//     (acc, header) => {
//       if (header.hidden) {
//         return acc;
//       }
//
//       return acc + (header?.width ?? 200);
//     },
//     (visibleCheckbox ? 60 : 0) + (visibleIndex ? 60 : 0),
//   );
//
//   const updatedHeaders = headers.map((header) => {
//     return {
//       ...header,
//       sorter: {
//         ...header.sorter,
//         sortable: false,
//         direction: null,
//       },
//     };
//   });
//
//   const tableContentsWidth = headerTotalWidth;
//
//   const [tableLayoutWidth, setTableLayoutWidth] = useState<number | string>('100%');
//
//   useEffect(() => {
//     const updateWidth = () => {
//       const newWidth = fixedWidth === 0 ? window.innerWidth - 332 : fixedWidth;
//       setTableLayoutWidth(newWidth);
//     };
//
//     updateWidth();
//     window.addEventListener('resize', updateWidth);
//     return () => window.removeEventListener('resize', updateWidth);
//   }, [fixedWidth]);
//
//   const resetState = () => {
//     if (tableRef.current) {
//       tableRef.current.scrollTop = 0;
//       tableRef.current.scrollLeft = 0;
//     }
//     resetCheckList();
//     resetSort();
//   };
//
//   useEffect(() => {
//     resetState();
//   }, [pagination.currentPage, pagination.pageSize]);
//
//   return (
//     <TableContext
//       value={{
//         headers: isSorting ? sortedHeaders : updatedHeaders,
//         dataList: refinedDataList,
//         handleSort,
//         visibleCheckbox,
//         visibleIndex,
//         fixed,
//         pagination,
//       }}
//     >
//       <FlexColumn
//         ref={tableRef}
//         style={{
//           width: tableLayoutWidth,
//           minWidth: tableContentsWidth / 2,
//           paddingBottom: 4,
//           overflowX: 'auto',
//         }}
//       >
//         <div
//           style={{
//             width:
//               typeof tableLayoutWidth === 'number' && tableLayoutWidth > tableContentsWidth
//                 ? '100%'
//                 : tableContentsWidth,
//           }}
//         >
//           {children}
//         </div>
//       </FlexColumn>
//       {isPaging && (
//         <TablePageLegacy
//           pagination={pagination}
//           totalPages={totalPages}
//           totalSize={dataList.length}
//           handlePageChange={handlePageChange}
//           handlePageSizeChange={handlePageSizeChange}
//           tableContentsWidth={tableContentsWidth}
//           tableLayoutWidth={tableLayoutWidth}
//         />
//       )}
//     </TableContext>
//   );
// }
