import { TTableHeader } from '@/shared/components';

export function calculateTableFixedValues({
  headers,
  headerIndex,
  visibleCheckbox,
  visibleIndex,
  fixed,
  tableColumnDefaultWidth,
  tableCheckboxIndexWidth,
}: {
  headers: TTableHeader[];
  headerIndex: number;
  visibleCheckbox: boolean;
  visibleIndex: boolean;
  fixed: boolean;
  tableColumnDefaultWidth: number;
  tableCheckboxIndexWidth: number;
}) {
  const fixedRightValue = headers
    .slice(headerIndex + 1)
    .reduce((acc, cur) => acc + (cur?.width ?? tableColumnDefaultWidth), 0);

  const fixedLeftValue =
    headers.slice(0, 0).reduce((acc, cur) => acc + (cur?.width ?? tableColumnDefaultWidth), 0) +
    (visibleCheckbox ? tableCheckboxIndexWidth : 0) +
    (visibleIndex ? tableCheckboxIndexWidth : 0);

  const isRightFixed =
    // fixed && headers[headerIndex].fixed && headers.slice(headerIndex + 1);
    fixed && headers[headerIndex].fixed && headers.slice(headerIndex + 1).every((cur) => cur.fixed);

  const isLeftFixed = fixed && headers[headerIndex].fixed && headers.slice(0, headerIndex);
  // fixed && headers[headerIndex].fixed && headers.slice(0, headerIndex).every((cur) => cur.fixed);

  const isHeaderFixed = isRightFixed || isLeftFixed;

  const isRightEdgeOfLeftFixed =
    isLeftFixed && (headerIndex === headers.length - 1 || !headers[headerIndex + 1]?.fixed);

  const isLeftEdgeOfRightFixed =
    isRightFixed && (headerIndex === 0 || !headers[headerIndex - 1]?.fixed);

  return {
    fixedRightValue,
    fixedLeftValue,
    isRightFixed,
    isLeftFixed,
    isHeaderFixed,
    isRightEdgeOfLeftFixed,
    isLeftEdgeOfRightFixed,
  };
}
