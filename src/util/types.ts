export interface TextInputProps<T> {
	name: string;
	placeholder: string;
	value: T;
	handleChange: (newVal: string) => void;
}

export interface DropDownProps<T> {
	name: string;
	value: T;
	placeholder?: string;
	items: T[];
	handleChange: (newVal: string) => void;
}

export interface CheckBoxProps {
	name: string;
	placeholder: string;
	value: boolean;
	handleChange: () => void;
}

export type ImageData = File | null;

export interface DateInfo {
	date: number;
	month: string;
	year: number;
}

export interface ClassInfo {
	classroom: string;
	subject: string;
	classTime: string;
}

interface OtherInfo {
	fullName: string;
	kName: string;
	age: number;
	image: ImageData;
	sex: string;
	phoneNo: number;
	isOwn: boolean;
	ownerName: string;
	priesthood: string;
	isNewStudent: boolean;
	paymentId: string;
}

export type FormInfo = DateInfo & ClassInfo & OtherInfo;

export type ReducerAction =
	| { type: 'reset form' }
	| { type: 'update field'; payload: Partial<FormInfo> };

export type DataType = number | string | boolean | ImageData;

export type EmptyType = 0 | '' | null;

export interface IRegistrant extends Omit<OtherInfo, 'image'> {
	imageUrl: string;
	classDetails: ClassInfo;
	registryDate: DateInfo;
	confirmStatus: 'registered' | 'verified' | 'printed';
}

export type ErrorTypes<T> = {
	[K in keyof T]: string;
};

export type ErrorMessage = string | null;
