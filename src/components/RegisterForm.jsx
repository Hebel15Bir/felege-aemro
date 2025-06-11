'use client';

import { registerStudent } from '../server/actions';
import { useState } from 'react';

export default function RegisterForm() {
	const [isLoading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [cls, setCls] = useState('');
	const [isOwn, setIsOwn] = useState(true);
	const [isNewStudent, setIsNewStudent] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		e.target.classList.add('hidden');
		setLoading(true);
		const studentData = new FormData(document.getElementById('form'));
		try {
			const result = await registerStudent(studentData);
			if (result) {
				e.target.classList.remove('hidden');
				setLoading(false);
				if (result.error) {
					setError(result.error);
					setSuccess('');
				} else if (result.success) {
					setSuccess(result.success);
					setError('');
				}
			}
			const img = document.getElementById('preview');
			img.src = '';
			img.classList.add('hidden');
			document.getElementById('imageLabel').classList.remove('hidden');
		} catch {
			setSuccess('');
			setLoading(false);
			setError('ስሕተት ተፈጥሯል፤ እባክዎ እንደገና ይሞክሩ።');
		}
	};

	return (
		<form id='form' className='w-md max-w-screen mx-auto shadow-lg rounded p-6'>
			<h2 className='text-2xl text-center mb-4'>የምዝገባ ቅጽ</h2>
			<div className='flex w-full justify-center items-center gap-3 mb-3'>
				<div className='min-w-0 flex-1'>
					<div>
						<input
							type='text'
							placeholder='ሙሉ ስም'
							name='fullName'
							className='p-2 border w-full cursor-pointer border-gray-300 rounded focus:border-blue-500 outline-none mb-2.5'
						/>
						<input
							type='text'
							placeholder='ክርስትና ስም'
							name='kName'
							className='p-2 border w-full cursor-pointer border-gray-300 rounded focus:border-blue-500 outline-none mb-2.5'
						/>
						<input
							type='text'
							placeholder='ዕድሜ'
							name='age'
							className='p-2 border w-full cursor-pointer border-gray-300 rounded focus:border-blue-500 outline-none mb-2.5'
						/>
						<div>
							<input
								type='radio'
								className='mr-1 h-4 w-4 cursor-pointer'
								name='sex'
								id='male'
								value='ወንድ'
							/>
							<label className='mr-3 text-xl' htmlFor='male'>
								ወንድ
							</label>
							<input
								type='radio'
								className='mr-1 h-4 w-4 cursor-pointer'
								name='sex'
								id='female'
								value='ሴት'
							/>
							<label className='mr-3 text-xl' htmlFor='female'>
								ሴት
							</label>
						</div>
					</div>
				</div>
				<div className='flex items-center justify-center border border-gray-300 p-2 min-w-[150px] h-52'>
					<img
						id='preview'
						className='object-cover w-full h-full hidden'
						alt='የተማሪ ፎቶ'
					/>
					<label
						id='imageLabel'
						htmlFor='imageInput'
						className='flex items-center justify-center w-full h-full cursor-pointer bg-gray-200 border border-gray-300 rounded-md'
					>
						ፎቶ አስገቡ።
						<input
							type='file'
							accept='image/*'
							id='imageInput'
							className='hidden'
							onChange={(e) => {
								const file = e.target.files?.[0];
								if (file) {
									const img = document.getElementById('preview');
									img.src = URL.createObjectURL(file);
									img.classList.remove('hidden');
									document.getElementById('imageLabel').classList.add('hidden');
								}
							}}
							name='file'
						/>
					</label>
				</div>
			</div>
			<div className='flex'>
				<span className='flex items-center px-2 bg-gray-200 mb-2.5'>+251</span>
				<input
					type='text'
					placeholder='ስልክ ቍጥር'
					name='phoneNo'
					className='p-2 flex-1 min-w-0 cursor-pointer border border-gray-300 rounded focus:border-blue-500 outline-none mb-2.5'
				/>
				<div className='flex items-center space-x-2 ml-2 mb-2.5'>
					<input
						type='checkbox'
						id='isOwn'
						name='isOwn'
						checked={isOwn}
						className='h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
						onChange={() => setIsOwn(!isOwn)}
					/>
					<label htmlFor='isOwn' className='text-lg text-nowrap'>
						የተማሪ ነው?
					</label>
				</div>
			</div>
			{!isOwn && (
				<input
					type='text'
					placeholder='የስልኩ ባለቤት ሙሉ ስም'
					name='ownerName'
					className='p-2 border w-full cursor-pointer border-gray-300 rounded text-black focus:border-blue-500 outline-none mb-2.5'
				/>
			)}
			<div className='flex items-center text-lg space-x-2 mb-2.5'>
				<label htmlFor='priesthood' className='text-nowrap'>
					ክህነት አለዎት?
				</label>
				<select
					name='priesthood'
					id='priesthood'
					className='w-full p-2 rounded bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
				>
					<option value='ምእመን'>የለኝም</option>
					<option value='ዲያቆን'>ዲቁና</option>
					<option value='ቀሲስ'>ቅስና</option>
				</select>
			</div>
			<div className='flex items-center space-x-2 mb-2.5'>
				<input
					type='checkbox'
					id='isNewStudent'
					name='isNewStudent'
					className='h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
					onChange={() => setIsNewStudent(!isNewStudent)}
					checked={isNewStudent}
				/>
				<label htmlFor='isNewStudent' className='text-lg'>
					ዐዲስ ተመዝጋቢ ነዎት?
				</label>
			</div>
			{!isNewStudent && (
				<>
					<div className='text-lg mb-2'>የተመዘገቡበትን ቀን ያስገቡ።</div>
					<div className='flex items-center justify-center gap-3 mb-2.5'>
						<select
							name='date'
							id='date'
							className='flex-auto p-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
						>
							{[...Array(30).keys()].map((day) => (
								<option key={day} value={day + 1}>
									{day + 1}
								</option>
							))}
						</select>
						<select
							name='month'
							id='month'
							className='flex-auto p-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
						>
							{[
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
							].map((month) => (
								<option key={month} value={month}>
									{month}
								</option>
							))}
						</select>
						<select
							name='year'
							id='year'
							className='flex-auto p-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
						>
							{[...Array(14).keys()].map((year) => (
								<option key={year} value={year + 2004}>
									{year + 2005}
								</option>
							))}
						</select>
					</div>
					<div className='text-xl mb-2'>የትምህርት ዝርዝር ያስገቡ።</div>
					<div>
						<select
							name='classroom'
							id='classroom'
							className='w-full flex-auto p-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2.5'
							onChange={(e) =>
								setCls(e.target.value.startsWith('ንባብ') ? '' : e.target.value)
							}
						>
							<option key='' value=''>
								የትምህርት ክፍል
							</option>
							{[
								'ንባብ-1',
								'ንባብ-2',
								'ንባብ-3',
								'ዜማ',
								'ቅኔ',
								'ቅዳሴ',
								'አቋቋም',
								'ትርጓሜ',
							].map((room) => (
								<option key={room} value={room}>
									{room}
								</option>
							))}
						</select>
						<select
							name='subject'
							id='subject'
							className='w-full flex-auto p-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2.5'
						>
							<option key='' value=''>
								የሚማሩት ትምህርት
							</option>
							<option key='ንባብ' value='ንባብ'>
								ንባብ
							</option>
							{cls && (
								<option key={cls} value={cls}>
									{cls}
								</option>
							)}
						</select>
						<select
							name='classTime'
							id='classTime'
							className='w-full flex-auto p-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2.5'
						>
							<option key='' value=''>
								የሚማሩበት ጊዜ
							</option>
							<option key='ሌሊት' value='የሌሊት'>
								የሌሊት
							</option>
							<option key='ጠዋት' value='የጠዋት'>
								የጠዋት
							</option>
							<option key='ማታ' value='የማታ'>
								የማታ
							</option>
						</select>
					</div>
				</>
			)}
			<input
				type='text'
				placeholder='የደረሰኝ ቍጥር'
				name='paymentId'
				className='w-full p-2 border border-gray-300 rounded text-black focus:border-blue-500 outline-none mb-2.5'
			/>
			{error && (
				<div className='bg-red-500 p-2 text-white rounded mb-2.5' id='msg'>
					{error}
				</div>
			)}

			<button
				type='submit'
				className='w-full cursor-pointer p-2 bg-blue-500 text-white rounded-md'
				onClick={handleSubmit}
			>
				ይመዝገቡ
			</button>
			{isLoading && (
				<div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40'>
					<div className='flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-lg'>
						<div className='relative w-16 h-16 mb-4'>
							<div className='absolute inset-0 rounded-full border-4 border-blue-400 border-t-transparent animate-spin'></div>
							<div className='absolute inset-2 rounded-full border-4 border-blue-200 border-b-transparent animate-spin-slower'></div>
							<svg
								className='absolute inset-0 w-full h-full animate-pulse'
								viewBox='0 0 64 64'
							>
								<circle
									cx='32'
									cy='32'
									r='24'
									fill='none'
									stroke='#3b82f6'
									strokeWidth='4'
									opacity='0.2'
								/>
								<circle cx='32' cy='32' r='16' fill='#3b82f6' opacity='0.1' />
							</svg>
						</div>
						<div className='text-blue-600 text-lg font-semibold animate-bounce'>
							እባክዎ ይጠብቁ...
						</div>
					</div>
				</div>
			)}
			{success && (
				<div className='fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-40'>
					<div className='bg-white rounded-lg shadow-lg p-8 max-w-sm w-full flex flex-col items-center'>
						<div className='flex items-center justify-center mb-4'>
							<svg
								className='w-12 h-12 text-green-500'
								fill='none'
								stroke='currentColor'
								strokeWidth='2'
								viewBox='0 0 24 24'
							>
								<circle
									cx='12'
									cy='12'
									r='10'
									stroke='currentColor'
									strokeWidth='2'
									fill='none'
								/>
								<path
									stroke='currentColor'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'
									d='M8 12l3 3 5-5'
								/>
							</svg>
						</div>
						<div className='text-green-700 text-lg font-semibold mb-2'>
							{success}
						</div>
						<button
							className='mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600'
							type='button'
							onClick={() => {
								window.location.reload();
							}}
						>
							ለመመለስ ይህንን ይጫኑ
						</button>
					</div>
				</div>
			)}
		</form>
	);
}
