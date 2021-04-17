import { v4 as uuidv4 } from 'uuid'

interface TxData {
  id: string
  decodedUnsignedTx: Object,
  signedTx: string,
  expectedTxHash: string,
}

const LS_KEY = 'signed-txs'

export function getTxDatas(): Array<TxData> {
  const txDatas = localStorage.getItem(LS_KEY)
  if (txDatas) {
    return JSON.parse(txDatas)
  }
  return []
}

export function addTxData(newTxData: TxData) {
  newTxData.id = uuidv4()
  const txDatas = getTxDatas()
  while (txDatas.length >= 10) {
    txDatas.pop()
  }
  txDatas.unshift(newTxData)
  localStorage.setItem(LS_KEY, JSON.stringify(txDatas))
}
