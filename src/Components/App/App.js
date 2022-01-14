import React from 'react';
import './App.css';
import {SearchBar} from '../SearchBar/SearchBar.js';
import {Playlist} from '../Playlist/Playlist.js';
import {SearchResults} from '../SearchResults/SearchResults.js';
import Spotify from '../../util/Spotify.js';


export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [ 
        {name: 'name1', artist: 'artist1', album: 'album1', id:1},
        {name: 'name2', artist: 'artist2', album: 'album2', id:2}
        ], 
      playlistName: "My New Playlist", 
      playlistTracks: []
    }
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    let tracks = this.state.playlistTracks;
    if (tracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }
    else {
      tracks.push(track);
      this.setState({playlistTracks: tracks})
    }
  }

  removeTrack(track){
    let tracks = this.state.playlistTracks;
    tracks = tracks.filter(currentTrack => currentTrack.id !== track.id);
    this.setState({playlistTracks: tracks});
  }

  updatePlaylistName(newName){
    this.setState({playlistName: newName});
  }

  savePlaylist() {
    const trackUris = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackUris).then(() => {
      this.setState({
        playlistName: 'New Playlist (again)',
        playlistTracks: []
      })
    })
  }

  search(searchTerm) {
      Spotify.search(searchTerm).then(searchResults => {
      this.setState({searchResults: searchResults})
    })
  }

  render() {
    return (
      <div>
  <h1>Musicbox</h1>
  <div className="App">
    <SearchBar 
      onSearch={this.search}
    />
    <div className="App-playlist">
      <SearchResults 
        searchResults={this.state.searchResults} 
        onAdd={this.addTrack}
        />
      <Playlist 
        playlistName={this.state.playlistName} 
        playlistTracks={this.state.playlistTracks} 
        onRemove={this.removeTrack} 
        onNameChange={this.updatePlaylistName} 
        onSave={this.savePlaylist}
        />
    </div>
  </div>
</div>
     )
   
  }
}


