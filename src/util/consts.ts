import { ErrorTypes, FormInfo } from './types';

export const months = [
	'መስከረም',
	'ጥቅምት',
	'ኅዳር',
	'ታኅሣሥ',
	'ጥር',
	'የካቲት',
	'መጋቢት',
	'ሚያዝያ',
	'ግንቦት',
	'ሠኔ',
	'ሐምሌ',
	'ነሐሴ',
	'ጳጉሜን',
];

export const errorMsgs: ErrorTypes<Partial<FormInfo>> = {
	fullName: 'እባክዎ ሙሉ ስምዎን ያስገቡ።',
	kName: 'እባክዎ ክርስትና ስምዎን ያስገቡ።',
	age: 'እባክዎ ዕድሜዎን ያስገቡ።',
	sex: 'እባክዎ ጾታዎን ያስገቡ',
	image: 'እባክዎ የተማሪ ፎቶ ያስገቡ።',
	phoneNo: 'እባክዎ ስልክ ቍጥር ያስገቡ',
	ownerName: 'እባክዎ የስልኩን ባለቤት ስም ያስገቡ።',
	classroom: 'እባክዎ የሚማሩበትን ክፍል ያስገቡ።',
	subject: 'እባክዎ የሚማሩትን ትምህርት ያስገቡ።',
	classTime: 'እባክዎ የሚማሩበትን ሰዓት ያስገቡ።',
	paymentId: 'እባክዎ የደረሰኝ ቍጥር ያስገቡ።',
};
