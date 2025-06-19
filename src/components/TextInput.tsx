import { TextInputProps } from '@/util/types';

export default function TextInput({
	name,
	placeholder,
	value,
	handleChange,
}: TextInputProps<number | string>) {
	return (
		<input
			type='text'
			placeholder={placeholder}
			name={name}
			value={value}
			onChange={(e) =>
				handleChange(e.target.value === ' ' ? '' : e.target.value)
			}
			className='p-2 border w-full cursor-text border-gray-300 rounded focus:border-blue-500 outline-none mb-2.5'
		/>
	);
}
