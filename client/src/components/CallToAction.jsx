import { Button } from 'flowbite-react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

export default function CallToAction() {
  return (
    <div className='flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center'>
        <div className="flex-1 justify-center flex flex-col">
            <h2 className='text-2xl'>
                Explore lebih banyak dengan Assistant
            </h2>
            <p className='text-gray-500 my-2'>
                Silahkan Mencoba
            </p>
            <Button gradientDuoTone='purpleToPink' className='rounded-tl-xl rounded-bl-none'>
                <Link to="/assistant">Assistant</Link>
            </Button>
        </div>
        <div className="p-7 flex-1">
            <Link to="/assistant">
                <img src="/logo_ai-01.png" alt="ai" style={{ width: '200px', height: '200px' }} />
            </Link>
        </div>
    </div>
  )
}
