'use strict';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';

import { IPlayAct } from 'chord/workbench/api/common/action/player';

import { addPlayItemAudios, hasPlayItemAudio } from 'chord/workbench/api/utils/playItem';

import { noticePlayItem } from 'chord/workbench/parts/notification/action/notice';


export async function handlePlay(index: number): Promise<IPlayAct> {
    let state: IStateGlobal = (<any>window).store.getState();

    let playList = state.player.playList;
    let playItem;

    if (index >= playList.length && (<any>window).playPart) {
        let nextPlayItems = await (<any>window).playPart.nextPart();
        if (nextPlayItems.length > 0) {
            for (let item of nextPlayItems) {
                // directly add item to state
                playList.push(item);
            }
        }
    }

    while (index < playList.length) {
        // directly change playItem which is in state
        playItem = playList[index];
        if (playItem) {
            await addPlayItemAudios(playItem);
            if (hasPlayItemAudio(playItem)) {
                break;
            }
            noticePlayItem(playItem);
            // TODO: Warning and logging
            index += 1;
            continue;
        }
        break;
    }

    return {
        type: 'c:player:play',
        act: 'c:player:play',
        index,
    };
}
