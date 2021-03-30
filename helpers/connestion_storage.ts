import { v4 as uuidv4 } from 'uuid';

interface Connection {
  id: String,
  name: String,
  url: String,
  genesisHash: String,
  metadata: String,
  specVersion: String,
  transactionVersion: String,
}

const LS_KEY = 'polkadot-connections'

export function getConnections(): Array<Connection> {
  let connections = localStorage.getItem(LS_KEY)
  if (connections) {
    return JSON.parse(connections)
  }
  return []
}

export function getConnection(connectionId: String) {
  let matchedConnections = getConnections()
  matchedConnections = matchedConnections.filter(connection => connection.id == connectionId)
  if (matchedConnections.length) {
    return matchedConnections[0]
  }
}

function saveConnections(connections: Array<Connection>) {
  localStorage.setItem(LS_KEY, JSON.stringify(connections))
}

export function addConnection(newConnection: Connection) {
  newConnection.id = uuidv4()
  let connections = getConnections()
  connections.push(newConnection)
  saveConnections(connections)
}

export function removeConnection(connectionId: String) {
  let connections = getConnections()
  connections = connections.filter(connection => connection.id != connectionId)
  saveConnections(connections)
}