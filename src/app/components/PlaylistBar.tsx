"use client";



import Link from "next/link";

//userın olmadığı hali de düşünülmeli

export default function PlaylistBar() {


  

  //

  return (
    <div className="mb-4">
      <div>
        {playlist.map((playlist, index) => {
          return (
            <li key={index} className="flex mt-2 justify-between">
              <Link href={`/playlist/${playlist.id}`}> {playlist.name} </Link>
            </li>
          );
        })}
      </div>
    </div>
  );
}
