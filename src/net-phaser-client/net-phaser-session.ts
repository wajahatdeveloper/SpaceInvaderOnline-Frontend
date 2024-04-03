let currentSessionId: string;

function onJoinedSession(sessionId: string) {
  currentSessionId = sessionId;
}

function onPlayerLeftSession(clientId: string) {
  console.log(`player ${clientId} left the session`);
}

export { currentSessionId, onJoinedSession, onPlayerLeftSession };
