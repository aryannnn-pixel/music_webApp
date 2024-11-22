"use client"

import useSound from "use-sound"
import { useEffect, useState } from "react"
import { BsPauseFill, BsPlayFill, BsRepeat } from "react-icons/bs"
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2"
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai"
import axios from "axios"

import { Song } from "@/types"
import usePlayer from "@/hooks/usePlayer"

import LikeButton from "./LikeButton"
import MediaItem from "./MediaItem"
import Slider from "./Slider"

interface PlayerContentProps {
  song: Song
  songUrl: string
}

const PlayerContent: React.FC<PlayerContentProps> = ({ song, songUrl }) => {
  const player = usePlayer()
  const [volume, setVolume] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [lyrics, setLyrics] = useState<string | null>(null) // State for lyrics
  const [isLooping, setIsLooping] = useState(false)

  const Icon = isPlaying ? BsPauseFill : BsPlayFill
  const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave

  const onPlayNext = () => {
    if (player.ids.length === 0) return
    const currentIndex = player.ids.findIndex(id => id === player.activeId)
    const nextSong = player.ids[currentIndex + 1]
    if (!nextSong) return player.setId(player.ids[0])
    player.setId(nextSong)
  }

  const onPlayPrevious = () => {
    if (player.ids.length === 0) return
    const currentIndex = player.ids.findIndex(id => id === player.activeId)
    const previousSong = player.ids[currentIndex - 1]
    if (!previousSong) return player.setId(player.ids[player.ids.length - 1])
    player.setId(previousSong)
  }

  const [play, { pause, sound }] = useSound(songUrl, {
    volume: volume,
    onplay: () => setIsPlaying(true),
    onend: () => {
      setIsPlaying(false)
      isLooping ? play() : onPlayNext()
    },
    onpause: () => setIsPlaying(false),
    format: ["mp3"],
  })

  useEffect(() => {
    sound?.play()
    return () => sound?.unload()
  }, [sound])

  // Fetch lyrics on song change
  useEffect(() => {
    const fetchLyrics = async () => {
      try {
        const response = await axios.get(`https://api.lyrics.ovh/v1/${song.author}/${song.title}`)
        setLyrics(response.data.lyrics || "Lyrics not found")
      } catch (error) {
        setLyrics("Lyrics unavailable")
        console.error("Error fetching lyrics:", error)
      }
    }

    fetchLyrics()
  }, [song])

  const handlePlay = () => {
    if (!isPlaying) play()
    else pause()
  }

  const toggleMute = () => {
    setVolume(volume === 0 ? 1 : 0)
  }

  const toggleLoop = () => {
    setIsLooping(prev => !prev)
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 h-full relative">
      <div className="flex w-full justify-start">
        <div className="flex items-center gap-x-4">
          <MediaItem data={song} />
          <LikeButton songId={song.id} />
        </div>
      </div>

      <div className="flex md:hidden col-auto w-full justify-end items-center">
        <div onClick={handlePlay} className="h-10 w-10 flex items-center justify-center rounded-full bg-white p-1 cursor-pointer">
          <Icon size={30} className="text-black" />
        </div>
      </div>

      <div className="hidden h-full md:flex justify-center items-center w-full max-w-[722px] gap-x-6">
        <AiFillStepBackward onClick={onPlayPrevious} size={30} className="text-neutral-400 cursor-pointer hover:text-white transition" />
        <div onClick={handlePlay} className="flex items-center justify-center h-10 w-10 rounded-full bg-white p-1 cursor-pointer">
          <Icon size={30} className="text-black" />
        </div>
        <AiFillStepForward onClick={onPlayNext} size={30} className="text-neutral-400 cursor-pointer hover:text-white transition" />
        <BsRepeat onClick={toggleLoop} size={30} className={`cursor-pointer ${isLooping ? "text-white" : "text-neutral-400"} transition`} />
      </div>

      <div className="hidden md:flex w-full justify-end pr-2">
        <div className="flex items-center gap-x-2 w-[120px]">
          <VolumeIcon onClick={toggleMute} className="cursor-pointer" size={34} />
          <Slider value={volume} onChange={value => setVolume(value)} />
        </div>
      </div>

      {/* Lyrics display */}
     {/* Lyrics display */}
<div className="absolute bottom-[4rem] left-1/2 transform -translate-x-1/2 w-full text-center text-white px-4 overflow-y-auto max-h-[120px] text-opacity-80 text-sm">
  <p className="whitespace-pre-line bg-neutral-800 bg-opacity-80 px-4 py-2 rounded-md shadow-lg">
    {lyrics}
  </p>
</div>

    </div>
  )
}

export default PlayerContent
