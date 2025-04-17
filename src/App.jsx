
import React, { useState, useRef } from 'react'
import './App.css'

function App() {
  const [songs, setSongs] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState('');
  const [volume, setVolume] = useState(50);
  const [toast, setToast] = useState('');
  const fileInputRef = useRef(null);

  const filteredSongs = songs.filter(song =>
    song.name.toLowerCase().includes(search.toLowerCase())
  );

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 2000);
  };

  const toggleFavorite = (songName) => {
    if (favorites.includes(songName)) {
      setFavorites(favorites.filter(fav => fav !== songName));
      showToast("Removed from Favorites");
    } else {
      setFavorites([...favorites, songName]);
      showToast("Added to Favorites");
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const newSong = {
      name: file.name,
      duration: "Uploaded",
      url,
      rating: 0
    };

    setSongs([...songs, newSong]);
    showToast("Song Uploaded");
  };

  const setRating = (name, rating) => {
    setSongs(songs.map(song =>
      song.name === name ? { ...song, rating } : song
    ));
  };

  const removeSong = (name) => {
    setSongs(songs.filter(song => song.name !== name));
    setFavorites(favorites.filter(fav => fav !== name));
    showToast("Removed from Playlist");
  };

  return (
    <div className="app">
      <h1>🎶 Music Playlist</h1>
      {toast && <div className="toast">{toast}</div>}

      <input
        type="text"
        placeholder="🔎 Search songs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="upload-section">
        <label>🎵 Upload Song:</label>
        <input
          type="file"
          accept="audio/*"
          ref={fileInputRef}
          onChange={handleFileUpload}
        />
        <label className="upload-label" onClick={() => fileInputRef.current.click()}>
          Choose Audio File
        </label>
      </div>

      <div className="volume-slider">
        🔊 Volume: {volume}
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(e.target.value)}
        />
      </div>

      <h2>Playlist</h2>
      <ul>
        {filteredSongs.map((song, index) => (
          <li key={index}>
            <span>{song.name}</span>
            <div className="controls">
              <button onClick={() => toggleFavorite(song.name)}>
                {favorites.includes(song.name) ? '💖 Unmark' : '🤍 Favorite'}
              </button>
              {song.url && (
                <audio controls volume={volume / 100}>
                  <source src={song.url} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              )}
              <button onClick={() => removeSong(song.name)}>❌ Remove</button>
              <div className="rating">
                {[1,2,3,4,5].map(num => (
                  <span
                    key={num}
                    style={{ cursor: 'pointer', color: song.rating >= num ? '#FFD700' : '#555' }}
                    onClick={() => setRating(song.name, num)}
                  >★</span>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ul>

      <h2>Favorites</h2>
      <ul>
        {favorites.map((fav, index) => (
          <li key={index}>{fav}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
