import { clsx, type ClassValue } from "clsx";
import moment from "moment";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const parseDate = (date: string): string => {
	return moment(date).format("DD/MM/yyyy");
};

export const generateKey = (length = 5) => {
	let len = length;

	if (len < 5) {
		len += 5;
	} else if (len > 10) {
		len = 10;
	}

	const char = "abcdefghijklmnopqrstuvwxyz123456789!@#$%^&^*(";
	let result = "";
	for (let i = 0; i < len; i++) {
		result += char.charAt(Math.floor(Math.random() * char.length));
	}
	return result;
};
