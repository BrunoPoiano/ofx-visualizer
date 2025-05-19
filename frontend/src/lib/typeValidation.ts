import type { Pagination } from "@/types";

export const isString = (value: unknown): value is string => {
  return typeof value === "string";
};

export const isNumber = (value: unknown): value is number => {
  return typeof value === "number";
};

export const notEmptyString = (value: unknown): value is string => {
  return isString(value) && value.trim() !== "";
};

export const isStringOrDefault = (
  value: unknown,
  defaultValue = "",
): string => {
  if (notEmptyString(value)) return value.trim();
  if (isNumber(value)) return value.toString();

  return defaultValue;
};

export const isNumberOrDefault = (value: unknown, defaultValue = 0): number => {
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number(value);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }
  return defaultValue;
};

export const isBooleanOrDefault = (
  value: unknown,
  defaultValue = false,
): boolean => {
  if (typeof value === "boolean") return value;
  if (value === 1 || value === "1" || value === "true") return true;
  if (value === 0 || value === "0" || value === "false") return false;

  return defaultValue;
};

export const parsePagination = (data: unknown): Pagination => {
  if (typeof data !== "object" || data === null) {
    return {
      current_page: 1,
      per_page: 5,
      total_items: 0,
    };
  }

  const typedItem = data as Record<string, unknown>;

  return {
    current_page: isNumberOrDefault(typedItem.current_page, 1),
    per_page: isNumberOrDefault(typedItem.per_page, 5),
    total_items: isNumberOrDefault(typedItem.total_items, 0),
    last_page: isNumberOrDefault(typedItem.last_page, 0),
  };
};
