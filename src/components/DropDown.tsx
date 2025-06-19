import { DropDownProps } from '@/util/types';

export default function DropDown({
	name,
	value,
	placeholder,
	items,
	handleChange,
}: DropDownProps<number | string>) {
	return (
		<select
			name={name}
			id={name}
			value={value}
			onChange={(e) => handleChange(e.target.value)}
			className='w-full p-2 cursor-pointer rounded bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2.5'
		>
			{placeholder && <option value=''>{placeholder}</option>}
			{items.map((item) => (
				<option key={item} value={item}>
					{item}
				</option>
			))}
		</select>
	);
}
