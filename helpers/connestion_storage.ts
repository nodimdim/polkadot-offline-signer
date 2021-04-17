import { v4 as uuidv4 } from 'uuid'
import { DAFAULT_METADATA } from './metadata'

interface Connection {
  id: String
  name: String
  url: String
  genesisHash: String
  metadata: String
  specVersion: String
  transactionVersion: String
}
 
const LS_KEY = 'polkadot-connections'
const DEFAULT_CONNECTION = {
  id: 'default',
  name: 'Polkadot Official',
  url: 'https://rpc.polkadot.io',
  genesisHash: '0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3',
  metadata: DAFAULT_METADATA,
  specVersion: '29',
  transactionVersion: '6',
}

export function getConnections(withDefault: Boolean = true): Array<Connection> {
  let result = []
  if (withDefault) {
    result.push(DEFAULT_CONNECTION)
  }
  const connections = localStorage.getItem(LS_KEY)
  if (connections) {
    result = result.concat(JSON.parse(connections))
  }
  return result
}

export function getConnection(connectionId: String) {
  let matchedConnections = getConnections()
  matchedConnections = matchedConnections.filter(
    (connection) => connection.id === connectionId
  )
  if (matchedConnections.length) {
    return matchedConnections[0]
  }
}

function saveConnections(connections: Array<Connection>) {
  localStorage.setItem(LS_KEY, JSON.stringify(connections))
}

export function addConnection(newConnection: Connection) {
  newConnection.id = uuidv4()
  const connections = getConnections(false)
  connections.push(newConnection)
  saveConnections(connections)
}

export function removeConnection(connectionId: String) {
  let connections = getConnections(false)
  connections = connections.filter(
    (connection) => connection.id !== connectionId
  )
  saveConnections(connections)
}
