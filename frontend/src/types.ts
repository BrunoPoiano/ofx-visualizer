export type RequestReturn = {
	data: unknown | unknown[];
	total_items: number;
	current_page: number;
	per_page: number;
	last_page: number;
};

export type PaginationType = {
	total_items: number;
	current_page: number;
	per_page: number;
	last_page: number;
};
