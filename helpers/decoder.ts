/**
 * @ignore
 */ /** */

import { hexToU8a } from '@polkadot/util';
 
import {
  createMetadata,
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