'use client';

import SpinBall from './SpinBall';
import TextInput from './TextInput';
import CheckBox from './CheckBox';
import DropDown from './DropDown';

import Image from 'next/image';
import { useState, useReducer, FormEvent } from 'react';

import { getInitialState, todayEthCalendar, validateFormData } from '@/util';
import { FormInfo, ReducerAction } from '@/util/types';
import { errorMsgs, months } from '@/util/consts';
import { registerStudent } from '@/server/actions';

function reducer(state: FormInfo, action: ReducerAction): FormInfo {
	switch (action.type) {
		case 'update field':
			return {
				...state,
				...action.payload,
			};
		case 'reset form':
			return getInitialState();
		default:
			return state;
	}
}

export default function RegisterForm() {
	const [isLoading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState('');
	const [imageUrl, setImageUrl] = useState('');
	const [state, dispatch] = useReducer(reducer, getInitialState());

	const handleSubmit = async (e: FormEvent<HTMLButtonElement>) => {
		e.preventDefault();
		const missing = validateFormData(state, errorMsgs);
		if (missing) {
			setError(missing);
			return;
		}
		setLoading(true);
		const { error } = await registerStudent(state);
		setLoading(false);
		URL.revokeObjectURL(imageUrl);
		setImageUrl('');
		if (error) {
			setError(error);
			setSuccess(false);
		} else {
			setSuccess(true);
			setError('');
		}
	};

	return (
		<form id='form' className='w-md max-w-screen mx-auto shadow-lg rounded p-6'>
			<h2 className='text-2xl text-center mb-4'>የምዝገባ ቅጽ</h2>
			<div className='flex w-full justify-center items-center gap-3 mb-3'>
				<div className='min-w-0 flex-1'>
					<div>
						<TextInput
							placeholder='ሙሉ ስም'
							name='fullName'
							value={state.fullName}
							handleChange={(newVal) => {
								dispatch({
									type: 'update field',
									payload: { fullName: newVal },
								});
								if (state.isOwn) {
									dispatch({
										type: 'update field',
										payload: { ownerName: newVal },
									});
								}
							}}
						/>
						<TextInput
							placeholder='ክርስትና ስም'
							name='kName'
							value={state.kName}
							handleChange={(newVal) => {
								dispatch({
									type: 'update field',
									payload: { kName: newVal },
								});
							}}
						/>
						<TextInput
							placeholder='ዕድሜ'
							name='age'
							value={state.age ? state.age : ''}
							handleChange={(newVal) => {
								dispatch({
									type: 'update field',
									payload: { age: parseInt(newVal) },
								});
							}}
						/>
						<div>
							<input
								type='radio'
								className='mr-1 h-4 w-4 cursor-pointer'
								name='sex'
								id='male'
								value='ወንድ'
								checked={state.sex === 'ወንድ'}
								onChange={(e) => {
									dispatch({
										type: 'update field',
										payload: { sex: e.target.value },
									});
								}}
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
								checked={state.sex === 'ሴት'}
								onChange={(e) => {
									dispatch({
										type: 'update field',
										payload: { sex: e.target.value },
									});
								}}
							/>
							<label className='mr-3 text-xl' htmlFor='female'>
								ሴት
							</label>
						</div>
					</div>
				</div>
				<div className='flex items-center overflow-hidden justify-center border border-gray-300 p-2 w-[150px] h-52'>
					{imageUrl ? (
						<Image
							id='preview'
							src={imageUrl}
							className='object-cover w-full h-full'
							alt='የተማሪ ፎቶ'
							width={150}
							height={200}
						/>
					) : (
						<label
							id='imageLabel'
							htmlFor='imageInput'
							className='flex items-center justify-center w-full h-full cursor-pointer bg-gray-200 border border-gray-300 rounded-md'
						>
							ፎቶ አስገቡ።
							<input
								type='file'
								accept='image/*'
								name='file'
								id='imageInput'
								className='hidden'
								onChange={(e) => {
									const file = e.target.files?.[0] as File;
									if (file) {
										setImageUrl(URL.createObjectURL(file));
										dispatch({
											type: 'update field',
											payload: { image: file },
										});
									} else {
										setError('ፎቶው በአግባቡ አልተጫነም። እባክዎ በድጋሚ ይጫኑ።');
									}
								}}
							/>
						</label>
					)}
				</div>
			</div>
			<div className='flex'>
				<span className='flex items-center px-2 bg-gray-200 mb-2.5'>+251</span>
				<TextInput
					name='phoneNo'
					placeholder='ስልክ ቍጥር'
					value={state.phoneNo ? state.phoneNo : ''}
					handleChange={(newVal) => {
						dispatch({
							type: 'update field',
							payload: { phoneNo: parseInt(newVal) },
						});
					}}
				/>
				<CheckBox
					name='isOwn'
					placeholder='የተማሪ ነው?'
					value={state.isOwn}
					handleChange={() => {
						dispatch({
							type: 'update field',
							payload: { ownerName: state.isOwn ? '' : state.fullName },
						});
						dispatch({
							type: 'update field',
							payload: { isOwn: !state.isOwn },
						});
					}}
				/>
			</div>
			{!state.isOwn && (
				<TextInput
					placeholder='የስልኩ ባለቤት ሙሉ ስም'
					name='ownerName'
					value={state.ownerName}
					handleChange={(newVal) => {
						dispatch({
							type: 'update field',
							payload: { ownerName: newVal },
						});
					}}
				/>
			)}
			<div className='flex items-center text-lg space-x-2 mb-2.5'>
				<label htmlFor='priesthood' className='text-nowrap'>
					ክህነት አለዎት?
				</label>
				<DropDown
					name='priesthood'
					value={state.priesthood}
					items={['ዲያቆን', 'ቀሲስ']}
					placeholder='ምእመን'
					handleChange={(newVal) => {
						if (!newVal) {
							newVal = 'ምእመን';
						}
						dispatch({
							type: 'update field',
							payload: { priesthood: newVal },
						});
					}}
				/>
			</div>
			<CheckBox
				name='isNewStudent'
				placeholder='ዐዲስ ተመዝጋቢ ነዎት?'
				value={state.isNewStudent}
				handleChange={() => {
					dispatch({
						type: 'update field',
						payload: state.isNewStudent
							? { classTime: '' }
							: { classTime: 'የጠዋት' },
					});
					dispatch({
						type: 'update field',
						payload: { isNewStudent: !state.isNewStudent },
					});
				}}
			/>
			{!state.isNewStudent && (
				<>
					<div className='text-lg mb-2'>ትምህርት የጀመሩበትን ቀን ያስገቡ።</div>
					<div className='flex items-center justify-center gap-3'>
						<DropDown
							name='date'
							value={state.date}
							items={Array.from({ length: 30 }, (_, i) => i + 1)}
							handleChange={(newVal) => {
								dispatch({
									type: 'update field',
									payload: { date: parseInt(newVal) },
								});
							}}
						/>
						<DropDown
							name='month'
							value={state.month}
							items={months}
							handleChange={(newVal) => {
								dispatch({
									type: 'update field',
									payload: { month: newVal },
								});
							}}
						/>
						<DropDown
							name='year'
							value={state.year}
							items={Array.from(
								{ length: todayEthCalendar().year - 2004 + 1 },
								(_, i) => todayEthCalendar().year - i
							)}
							handleChange={(newVal) => {
								dispatch({
									type: 'update field',
									payload: { year: parseInt(newVal) },
								});
							}}
						/>
					</div>
					<div className='text-xl mb-2'>የትምህርት ዝርዝር ያስገቡ።</div>
					<div>
						<DropDown
							name='classroom'
							value={state.classroom}
							placeholder='የሚማሩበት ክፍል'
							items={[
								'ንባብ-1',
								'ንባብ-2',
								'ንባብ-3',
								'ዜማ',
								'ቅኔ',
								'ቅዳሴ',
								'አቋቋም',
								'ትርጓሜ',
							]}
							handleChange={(newVal) => {
								dispatch({
									type: 'update field',
									payload: { classroom: newVal },
								});
								dispatch({
									type: 'update field',
									payload: { subject: '' },
								});
							}}
						/>
						<DropDown
							name='subject'
							value={state.subject}
							placeholder='የሚማሩት ትምህርት'
							items={[state.classroom, 'ንባብ', 'ዜማ'].filter((cls, index) => {
								if (cls === 'ዜማ') {
									if (index === 0) {
										return true;
									}
									return ['ንባብ-3', 'አቋቋም', 'ቅዳሴ'].includes(state.classroom);
								} else if (cls === 'ንባብ') {
									return !['ቅኔ', 'ትርጓሜ'].includes(state.classroom);
								} else {
									return !cls.includes('ንባብ-');
								}
							})}
							handleChange={(newVal) => {
								dispatch({
									type: 'update field',
									payload: { subject: newVal },
								});
							}}
						/>
						<DropDown
							name='classTime'
							placeholder='የሚማሩበት ጊዜ'
							value={state.classTime}
							items={['የሌሊት', 'የጠዋት', 'የማታ']}
							handleChange={(newVal) => {
								dispatch({
									type: 'update field',
									payload: { classTime: newVal },
								});
							}}
						/>
					</div>
				</>
			)}
			<TextInput
				name='paymentId'
				placeholder='የደረሰኝ ቍጥር'
				value={state.paymentId}
				handleChange={(newVal) => {
					dispatch({
						type: 'update field',
						payload: { paymentId: newVal },
					});
				}}
			/>
			{error && (
				<div className='bg-red-500 p-2 text-white rounded mb-2 5'>{error}</div>
			)}
			<button
				type='submit'
				onClick={handleSubmit}
				className='w-full cursor-pointer p-2 bg-blue-500 text-white rounded-md'
			>
				ይመዝገቡ
			</button>
			{isLoading && <SpinBall />}
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
							ስለተመዘገቡ እናመሰግናለን። ምዝገባዎን ለማረጋገጥ የከፈሉበትን ደረሰኝ ፎቶ አንሥተው @b8874 ላይ
							በቴሌግራም ይላኩ፤ ወይም ደረሰኙን በአካል ለትምህርት ክፍሉ ያሳዩ።
						</div>
						<button
							className='mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600'
							type='button'
							onClick={() => {
								dispatch({
									type: 'reset form',
								});
								setSuccess(false);
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
