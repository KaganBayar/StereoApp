import Image from "next/image"
export default function PlaylistPhoto() {
    return(
        <div>
            <Image src="/playlist.jpg" alt="Playlist" width={300} height={300} />
        </div>
    )
}
