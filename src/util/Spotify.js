let accessToken = '';
let expiresIn =''
const client_id = "APIKEYHERE"
const redirect_uri = "http://localhost:3000/"

const Spotify = {
    getAccessToken() {
        if (accessToken){
            return accessToken;
        }
        else {
            let atMatchExp = /access_token=([^&]*)/ ;
            let expMatchExp = /expires_in=([^&]*)/ ;
            const accessTokenMatch = window.location.href.match(atMatchExp);
            const expiresInMatch = window.location.href.match(expMatchExp);

            if (accessTokenMatch && expiresInMatch) {
                accessToken = accessTokenMatch[1];
                expiresIn = Number(expiresInMatch[1]);

                window.setTimeout(() => accessToken = '', expiresIn * 1000);
                window.history.pushState('Access Token', null, '/');
                return accessToken;
            }
            else {
                const accessUrl = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirect_uri}`;
                window.location = accessUrl;
            }
        }
    },

    search (searchTerm) {
        const accessToken = Spotify.getAccessToken();
        // Fetch request with the searchTerm, which responds with an array of the tracks
        return fetch (`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`, {
            headers: {Authorization: `Bearer ${accessToken}`}
          }).then(response => {
            if(response.ok){
              return response.json()
            };
            throw new Error('Request failed!');
          }, networkError => {
            console.log(networkError.message);
            }).then(jsonResponse => {
           if (!jsonResponse) {
               return [];
           }
           else return jsonResponse.tracks.items.map(track => ({
               id: track.id,
               name: track.name,
               artist: track.artists[0].name,
               album: track.album.name,
               uri: track.uri
           }))
          });
},

    savePlaylist(playlistName, trackArr) {
        if (!playlistName || !trackArr.length){
            return;}
        const accessToken = Spotify.getAccessToken();
        const headers = {Authorization: `Bearer ${accessToken}`}
        let userID = '';
                
        return fetch("https://api.spotify.com/v1/me", {headers: headers}).then(response => {
            //Fetch the UserID ~~~~~~~~~~~~~~~~~~
            if(response.ok){
                return response.json()
                };
            throw new Error('Request failed!');
                }, networkError => {
                console.log(networkError.message);
            }).then(jsonResponse => {
                userID = jsonResponse.id
            //POST the playlistName to get the playlistID ~~~~~~~~~~~~~~~~~~~
                return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({name: playlistName})
                    }).then(response => {
                        if(response.ok){
                        return response.json();  
                        }
                        throw new Error('Request failed!');
                            }, networkError => {
                            console.log(networkError.message);
                  }).then(jsonResponse => {
                    let playlistID = jsonResponse.id;
                    // POST[2] the playlistID and trackArr to populate the playlist ~~~~~~~~~~~~~~~~~~~~~~
                    fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
                        headers: headers,    
                        method: 'POST',
                        body: JSON.stringify({uris: trackArr})
                      })
                      .then(response => {
                        if(response.ok){
                          return response.json();  
                        }
                        throw new Error('Request failed!');
                      }, networkError => {
                        console.log(networkError.message);
                      }).then(jsonResponse => {
                            window.alert("Playlist has been saved successfully! ");
                        }) 
                      
                    }
    //end of POST[2]
                  )}

            )}
}

export default Spotify;

fetch('https://api-to-call.com/endpoint', {
  method: 'POST',
  body: JSON.stringify({id: "200"})
}).then(response => {
  if(response.ok){
    return response.json();  
  }
  throw new Error('Request failed!');
}, networkError => {
  console.log(networkError.message);
}).then(jsonResponse => {
  console.log(jsonResponse);
})
