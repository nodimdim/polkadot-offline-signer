/**
 * @ignore
 */ /** */

import { hexToU8a } from '@polkadot/util';

import {
  createMetadata,
  EXTRINSIC_VERSION,
  OptionsWithMeta,
  toTxMethod,
  TxInfo,
} from '@substrate/txwrapper/lib/util'
 

export type DecodedSignedTx = Omit<
	TxInfo,
	| 'blockHash'
	| 'blockNumber'
	| 'genesisHash'
	| 'specVersion'
	| 'transactionVersion'
	| 'version'
>;

/**
 * Parse the transaction information from a signed transaction offline.
 *
 * @param unsigned - The JSON representing the unsigned transaction.
 * @param options - Runtime-specific data used for decoding the transaction.
 */
export function decodeSignedTx(
	signedTx: string,
	options: OptionsWithMeta,
	toInt = false
): DecodedSignedTx {
	const { metadataRpc, registry } = options;

	registry.setMetadata(createMetadata(registry, metadataRpc));

	const tx = registry.createType('Extrinsic', hexToU8a(signedTx), {
		isSigned: true,
	});
	const methodCall = registry.createType('Call', tx.method);
	const method = toTxMethod(registry, methodCall, toInt);

	return {
    address: tx.signer.toString(),
		eraPeriod: tx.era.toNumber(),
		metadataRpc,
		method,
		nonce: tx.nonce.toNumber(),
		tip: tx.tip.toNumber(),
	};
}



export type DecodedSigningPayload = Omit<TxInfo, 'address' | 'blockNumber'>;

/**
* Parse the transaction information from a signing payload.
*
* @param signingPayload - The signing payload, in hex.
* @param options - Runtime-specific data used for decoding the transaction.
*/
export function decodeSigningPayload(
  signingPayload: string,
  options: OptionsWithMeta,
  toInt = false
): DecodedSigningPayload {
  const { metadataRpc, registry } = options;
  
  registry.setMetadata(createMetadata(registry, metadataRpc));

  const payload = registry.createType(
    'ExtrinsicPayload', signingPayload, { version: EXTRINSIC_VERSION }
  );
  const methodCall = registry.createType('Call', payload.method);
  const method = toTxMethod(registry, methodCall, toInt);

  return {
    blockHash: payload.blockHash.toHex(),
    eraPeriod: payload.era.toNumber(),
    genesisHash: payload.genesisHash.toHex(),
    metadataRpc,
    method,
    nonce: payload.nonce.toNumber(),
    specVersion: payload.specVersion.toNumber(),
    tip: payload.tip.toNumber(),
    transactionVersion: payload.transactionVersion.toNumber(),
  };
}