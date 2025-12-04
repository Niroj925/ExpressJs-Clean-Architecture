import { IPaginationData } from '../interface/response/interface/response-data.interface';

const searchInObject = (
  obj: any,
  path: string = '',
  searchLower?: string,
): boolean => {
  if (obj === null || obj === undefined) return false;

  return Object.entries(obj).some(([key, value]) => {
    const currentPath = path ? `${path}.${key}` : key;

    // Skip ID fields and null/undefined values
    if (
      key === 'id' ||
      key.endsWith('Id') ||
      value === null ||
      value === undefined
    ) {
      return false;
    }

    // Handle nested objects (but not Date objects)
    if (
      typeof value === 'object' &&
      !Array.isArray(value) &&
      !(value instanceof Date)
    ) {
      return searchInObject(value, currentPath, searchLower);
    }

    // Handle arrays
    if (Array.isArray(value)) {
      return value.some((item) => {
        if (typeof item === 'object') {
          return searchInObject(item, currentPath, searchLower);
        }
        return item?.toString().toLowerCase().includes(searchLower);
      });
    }

    // Handle primitive values (string, number, boolean, Date)
    try {
      const stringValue = value.toString().toLowerCase();
      return stringValue.includes(searchLower);
    } catch (error) {
      return false;
    }
  });
};

export const searchByCharacters = <T>(
  items: T[],
  searchString: string,
): T[] => {
  if (!searchString || !searchString.trim()) return [...items];
  const searchLower = searchString.toLowerCase().trim();

  return items.filter((item) => {
    try {
      return searchInObject(item, '', searchLower);
    } catch (error) {
      console.warn('Search error for item:', item, error);
      return false;
    }
  });
};

export const searchByCharactersAndPagingate = <T>(
  items: T[],
  searchString: string,
  page: number,
  limit: number,
): IPaginationData => {
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / limit);
  if (!searchString || !searchString.trim())
    return {
      data: items.slice((page - 1) * limit, page * limit),
      total: totalItems,
      limit,
      page,
      previous: page > 1 ? `${page - 1}` : null,
      next: page < totalPages ? `${page + 1}` : null,
    };
  const searchLower = searchString.toLowerCase().trim();

  const filteredItems = items.filter((item) => {
    try {
      return searchInObject(item, '', searchLower);
    } catch (error) {
      console.warn('Search error for item:', item, error);
      return false;
    }
  });
  return {
    data: filteredItems.slice((page - 1) * limit, page * limit),
    total: filteredItems.length,
    limit,
    page,
    previous: page > 1 ? `${page - 1}` : null,
    next: page < Math.ceil(filteredItems.length / limit) ? `${page + 1}` : null,
  };
};
