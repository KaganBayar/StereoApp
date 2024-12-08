import { FaPlus } from 'react-icons/fa'
import Box from './Box'
import SongBar from './SongBar'
import PlaylistBar from './PlaylistBar'



export default function Sidebar({ }) {
    return (
        <Box className='pl-8 mt-16 w-72 h-56 flex flex-col'>
            <div className='flex justify-between w-full'>
                <p>Your Library</p>
                <FaPlus className="relative text-gray-400 hover:text-white cursor-pointer translate translate-y-1/4" />

            </div>
            <div className='mt-24'>
                <SongBar />
            </div>
            <div>
                {/* where to show playlist*/}
                <PlaylistBar />
            </div>

        </Box>
    )
}