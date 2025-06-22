export default function SpinBall() {
	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-40'>
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
	);
}
