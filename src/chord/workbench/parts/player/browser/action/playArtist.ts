'use strict';

import { IArtist } from 'chord/music/api/artist';

import { IPlayArtistAct } from 'chord/workbench/api/common/action/player';

import { aliMusicApi } from 'chord/music/xiami/api';


export async function handlePlayArtist(artist: IArtist): Promise<IPlayArtistAct> {
    let songs = artist.songs || [];
    if (songs.length < 50) {
        songs = await aliMusicApi.artistSongs(artist.artistOriginalId, 1, 50);
    }
    return {
        type: 'c:player:playArtist',
        act: 'c:player:playArtist',
        artist: { ...artist, songs },
    }
}