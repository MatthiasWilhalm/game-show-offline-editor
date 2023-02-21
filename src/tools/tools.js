export function storePlayerId(userId) {
    localStorage.setItem('userId', userId);
}

export function getPlayerId() {
    return localStorage.getItem('userId');
}

export function storeUsername(username) {
    localStorage.setItem('username', username);
}

export function getUsername() {
    return localStorage.getItem('username') ?? '';
}

export function storeEventData(eventData) {
    sessionStorage.setItem('eventData', JSON.stringify(eventData));
}

export function getEventData() {
    return JSON.parse(sessionStorage.getItem('eventData'));
}

export function storePlayerState(playerState) {
    sessionStorage.setItem('playerState', playerState);
}

export function getPlayerState() {
    return sessionStorage.getItem('playerState');
}

export function storeModerationEvent(event) {
    sessionStorage.setItem('moderationEvent', JSON.stringify(event));
}

export function getModerationEvent() {
    return JSON.parse(sessionStorage.getItem('moderationEvent'));
}