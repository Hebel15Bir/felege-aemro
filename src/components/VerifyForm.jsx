'use client';

import { verifyStudent } from '../server/actions';
import { useState } from 'react';

export default function VerifyOne({ student, onRegister }) {
  const [name, setName] = useState('');
  const [classroom, setClassroom] = useState('');
  const [subject, setSubject] = useState('');
  const [classTime, setClassTime] = useState('');
  const [error, setError] = useState('');
  const [cls, setCls] = useState('');

  const classDetails = student.classDetails;

  setName(student.fullName);
  setClassroom(classDetails?.classroom ?? '');
  setSubject(classDetails?.subject ?? '');
  setClassTime(classDetails.classTime ?? '');

  const handleEdit = async (studentData) => {
    studentData.append('studentId', student.id);
    studentData.append('fullName', student.fullName);
    studentData.append('photoUrl', student.photoUrl);

    try {
      const outcome = await verifyStudent(studentData);
      if (outcome === 'success') {
        onRegister();
      } else {
        setError('እባክዎ እንደገና ይሞክሩ');
      }
    } catch (err) {
      console.log(err);
      setError('እባክዎ እንደገና ይሞክሩ');
    }
  };

  return (
    <form action={handleEdit}>
      (error ? (<div className='bg-red-500 p-2 text-white rounded'>{error}</div>
      ) : (
      <>
        <div className='text-xl mb-2'>የትምህርት ዝርዝር ያረጋግጡ።</div>
        <div className='text-lg mb-2'>{name}</div>
        <div>
          <select
            name='classroom'
            id='classroom'
            className='w-full flex-auto p-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2.5'
            onChange={(e) =>
              setCls(e.target.value.startsWith('ንባብ') ? '' : e.target.value)
            }
            defaultValue={classroom}
          >
            <option key='' value=''>
              የትምህርት ክፍል
            </option>
            {['ንባብ-1', 'ንባብ-2', 'ንባብ-3', 'ዜማ', 'ቅኔ', 'ቅዳሴ', 'አቋቋም', 'ትርጓሜ'].map(
              (room) => (
                <option key={room} value={room}>
                  {room}
                </option>
              )
            )}
          </select>
          <select
            name='subject'
            id='subject'
            defaultValue={subject}
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
            defaultValue={classTime}
            className='w-full flex-auto p-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2.5'
          >
            <option key='' value=''>
              የሚማሩበት ጊዜ
            </option>
            {['የሌሊት', 'የጠዋት', 'የማታ'].map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
        <button
          type='submit'
          className='w-full p-2 bg-blue-500 text-white rounded-md mb-2.5'
        >
          ያጽድቁ
        </button>
        <hr className='mb-2.5' />
      </>
      ))
    </form>
  );
}
