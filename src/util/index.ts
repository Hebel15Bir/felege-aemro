import { months } from './consts';
import {
	ClassInfo,
	DataType,
	DateInfo,
	ErrorTypes,
	FormInfo,
	IRegistrant,
} from './types';

export const todayEthCalendar = (): DateInfo => {
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const year = today.getFullYear();
	const month = today.getMonth();
	const date = today.getDate();

	const isLeapYear = year % 4 === 0;
	const newYearDate = isLeapYear ? 11 : 10;
	const newYearYear =
		month < 8 || (month === 8 && date < newYearDate) ? year - 1 : year;

	const ethNewYear = new Date(newYearYear, 8, newYearDate);

	const daysSinceNewYear = Math.floor(
		(today.getTime() - ethNewYear.getTime()) / (1000 * 60 * 60 * 24)
	);

	const ethMonth = Math.floor(daysSinceNewYear / 30);
	const ethDay = daysSinceNewYear % 30;
	const ethYear = newYearYear - 7;

	return {
		year: ethYear,
		month: months[ethMonth],
		date: ethDay,
	};
};

export const getInitialState = (): FormInfo => {
	return {
		fullName: '',
		kName: '',
		age: 0,
		image: null,
		sex: '',
		phoneNo: 0,
		isOwn: true,
		ownerName: '',
		priesthood: 'ምእመን',
		isNewStudent: true,
		...todayEthCalendar(),
		classroom: '',
		subject: '',
		classTime: 'የጠዋት',
		paymentId: '',
	};
};

export function validateFormData<T extends Record<string, DataType>>(
	formData: T,
	errors: ErrorTypes<T>
): string | null {
	for (const key in formData) {
		const value = formData[key];

		const isEmpty = value === 0 || value === '' || value === null;

		if (isEmpty && Object.keys(errors).includes(key)) {
			if ((key === 'classroom' || key === 'subject') && formData.isNewStudent) {
				continue;
			}
			return errors[key];
		}
	}

	return null;
}

function omit<T, K extends keyof T>(obj: T, key: K): Omit<T, K> {
	const clone = { ...obj };
	delete clone[key];
	return clone;
}

export function restructure(formData: FormInfo, imageUrl: string): IRegistrant {
	const {
		date,
		month,
		year,
		classroom,
		subject,
		classTime,
		fullName,
		kName,
		ownerName,
		paymentId,
		...rest
	} = formData;

	const others = omit(rest, 'image');

	const registryDate: DateInfo = {
		date,
		month,
		year,
	};
	const classDetails: ClassInfo = {
		classroom,
		subject,
		classTime,
	};
	return {
		fullName: fullName.trim(),
		kName: kName.trim(),
		ownerName: ownerName.trim(),
		paymentId: paymentId.trim(),
		...others,
		classDetails,
		registryDate,
		imageUrl,
		confirmStatus: 'registered',
	};
}
