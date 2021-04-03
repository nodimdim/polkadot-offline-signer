import { v4 as uuidv4 } from 'uuid';

interface BroadcastAtempt {
  id: string,
  url: string,
  signedTx: string,
  isError: Boolean,
  errorMessage: string,
  txHash: string,
}

const LS_KEY = 'broadcast-attempt'

export function getBroadcasts(): Array<BroadcastAtempt> {
  let broadcasts = localStorage.getItem(LS_KEY)
  if (broadcasts) {
    return JSON.parse(broadcasts)
  }
  return []
}

export function addBroadcastAtempt(newBroadcastAtempt: BroadcastAtempt) {
  newBroadcastAtempt.id = uuidv4()
  let broadcasts = getBroadcasts()
  while (broadcasts.length >= 10) {
    broadcasts.pop()
  }
  broadcasts.unshift(newBroadcastAtempt)
  localStorage.setItem(LS_KEY, JSON.stringify(broadcasts))
}