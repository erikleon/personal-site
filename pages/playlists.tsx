import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import styles from '../styles/Playlists.module.css'

interface Props {
  data: {
    access_token: string; 
  }
}

interface Playlist {
  id: string; 
}

const Playlists = ({ data }: Props) => {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    fetch('https://api.spotify.com/v1/users/nmoomjy/playlists',
    {
      headers: {
        'Authorization': 'Bearer ' + data.access_token
      }
    })
    .then((response) => response.json())
    .then((data) => {
      setPlaylists(data.items)
    });
  }, [])

  const renderPlaylists = () => {
    if (playlists.length > 1) {
      return playlists.map((playlist : Playlist) => {
        return (
          <div key={playlist.id}>
            <iframe style={{borderRadius:'12px'}} src={`https://open.spotify.com/embed/playlist/${playlist.id}?utm_source=generator&theme=0`} width="380" height="380" frameBorder="0" allowFullScreen allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
          </div>
        )
      })
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Erik Karwatowski&rsquo;s Personal Website</title>
        <meta name="description" content="I am currently looking for a job and think I would be a great teammate" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <h2>I love music and each month I put together a playlist with new music I am listening to. </h2>

        <div className={styles.playlistsContainer}>
          {renderPlaylists()}
        </div>
        
      </div>
    </div>
  )
}

export async function getServerSideProps() {
  var client_id = process.env.SPOTIFY_CLIENT_ID;
  var client_secret = process.env.SPOTIFY_CLIENT_SECRET;

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
    },
    body: 'grant_type=client_credentials'
  })
  const data = await res.json()

  return { props: { data } }
}

export default Playlists
