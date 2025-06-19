import { CheckBoxProps } from '@/util/types';

export default function CheckBox({
	name,
	placeholder,
	value,
	handleChange,
}: CheckBoxProps) {
	return (
		<div className='flex items-center space-x-2 ml-2 mb-2.5  cursor-pointer'>
			<input
				type='checkbox'
				id={name}
				name={name}
				checked={value}
				className='h-5 w-5 text-blue-600 focus:ring-blue-500 cursor-pointer border-gray-300 rounded'
				onChange={handleChange}
			/>
			<label htmlFor={name} className='text-lg cursor-pointer text-nowrap'>
				{placeholder}
			</label>
		</div>
	);
}
