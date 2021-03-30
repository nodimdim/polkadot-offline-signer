
import { EXTRINSIC_VERSION } from '@polkadot/types/extrinsic/v4/Extrinsic';
import { KeyringPair, OptionsWithMeta } from '@substrate/txwrapper'

/**
 * Signing function. Implement this on the OFFLINE signing device.
 *
 * @param pair - The signing pair.
 * @param signingPayload - Payload to sign.
 */
export function signWith(
	pair: KeyringPair,
	signingPayload: string,
	options: OptionsWithMeta
): string {
	const { registry } = options;
	// Important! The registry needs to be updated with latest metadata, so make
	// sure to run `registry.setMetadata(metadata)` before signing.
	// registry.setMetadata(createMetadata(registry, metadataRpc));

	const { signature } = registry
		.createType('ExtrinsicPayload', signingPayload, {
			version: EXTRINSIC_VERSION,
		})
		.sign(pair);

	return signature;
}