import React from 'react'
import IconBtn from './IconBtn'

const ConfirmationModal = ({modalData}) => {
  return (
    <div className=' fixed inset-0 z-[1000] !mt-0 grid place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm '>
        <div className='bg-richblack-900  px-8 py-6 flex flex-col gap-6 rounded-md outline outline-1 outline-white transition-all duration-200 ' >
            <p className='text-2xl font-bold'>
                {modalData.text1}
            </p>
            <p className='text-richblack-300'>
                {modalData.text2}
            </p>
            <div className='flex gap-4'>
                <IconBtn 
                    onclick={modalData?.btn1Handler}
                    text={modalData?.btn1Text}
                    />
                <button onClick={modalData?.btn2Handler} className='px-3 py-2 rounded-lg bg-richblack-300 font-semibold text-black'>
                    {modalData?.btn2Text}
                </button>    
            </div>
        </div>
      
    </div>
  )
}

export default ConfirmationModal
