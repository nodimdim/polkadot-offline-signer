<template>
  <div>
    <b-tabs type="is-boxed">
      <b-tab-item label="Create Signed Transaction Offline">
        <ValidationObserver ref="observerTx" v-slot="{ passes }" tag="form">
          <section>
            <form @submit.prevent="passes(createTransaction)">
              <ValidationProvider v-slot="{ errors, valid }" rules="required">
                <b-field
                  label="Genesis Hash"
                  :type="{ 'is-danger': errors[0], 'is-success': valid }"
                  :message="errors"
                >
                  <b-input
                    v-model="formData.genesisHash"
                    :lazy="true"
                  ></b-input>
                </b-field>
              </ValidationProvider>

              <ValidationProvider v-slot="{ errors, valid }" rules="required">
                <b-field
                  label="RPC Metadata"
                  :type="{ 'is-danger': errors[0], 'is-success': valid }"
                  :message="errors"
                >
                  <b-input
                    v-model="formData.metadata"
                    type="textarea"
                    :lazy="true"
                  ></b-input>
                </b-field>
              </ValidationProvider>

              <ValidationProvider v-slot="{ errors, valid }" rules="required">
                <b-field
                  label="Spec Version"
                  :type="{ 'is-danger': errors[0], 'is-success': valid }"
                  :message="errors"
                >
                  <b-input
                    v-model="formData.specVersion"
                    type="number"
                    :lazy="true"
                  ></b-input>
                </b-field>
              </ValidationProvider>

              <ValidationProvider v-slot="{ errors, valid }" rules="required">
                <b-field
                  label="Transaction Version"
                  :type="{ 'is-danger': errors[0], 'is-success': valid }"
                  :message="errors"
                >
                  <b-input
                    v-model="formData.transactionVersion"
                    type="number"
                    :lazy="true"
                  ></b-input>
                </b-field>
              </ValidationProvider>

              <ValidationProvider
                v-slot="{ errors, valid }"
                rules="required|isValidAddress"
              >
                <b-field
                  label="Destination Address"
                  :type="{ 'is-danger': errors[0], 'is-success': valid }"
                  :message="errors"
                >
                  <b-input
                    v-model="formData.destination"
                    :lazy="true"
                  ></b-input>
                </b-field>
              </ValidationProvider>

              <ValidationProvider v-slot="{ errors, valid }" rules="required">
                <b-field
                  label="Amount"
                  :type="{ 'is-danger': errors[0], 'is-success': valid }"
                  :message="errors"
                >
                  <b-input
                    v-model="formData.amount"
                    type="number"
                    min="1"
                    :lazy="true"
                  ></b-input>
                </b-field>
              </ValidationProvider>

              <ValidationProvider v-slot="{ errors, valid }" rules="required">
                <b-field
                  label="Nonce"
                  :type="{ 'is-danger': errors[0], 'is-success': valid }"
                  :message="errors"
                >
                  <b-input
                    v-model="formData.nonce"
                    type="number"
                    min="0"
                    :lazy="true"
                  ></b-input>
                </b-field>
              </ValidationProvider>

              <ValidationProvider v-slot="{ errors, valid }" rules="required">
                <b-field
                  label="Tip"
                  :type="{ 'is-danger': errors[0], 'is-success': valid }"
                  :message="errors"
                >
                  <b-input
                    v-model="formData.tip"
                    type="number"
                    min="0"
                    :lazy="true"
                  ></b-input>
                </b-field>
              </ValidationProvider>

              <br />

              <FileReader @load="loadFileDataToMnemonic($event)"></FileReader>

              <br />

              <div class="has-text-centered">
                <b-button
                  label="Create Transaction"
                  native-type="submit"
                  class="is-primary"
                  expanded
                />
              </div>
              <div class="has-text-centered">
                <b>or</b>
              </div>
              <b-button
                    label="Clear Transaction Fields"
                    class="is-primary is-light"
                    expanded
                    @click="resetTx()"
                  />
            </form>
          </section>
          <b-modal v-model="showCreatedTx">
            <div class="modal-card" style="width: auto">
              <header class="modal-card-head">
                <p class="modal-card-title">Created Transcation</p>
              </header>
              <section class="modal-card-body">
                <h3 class="is-size-6"><b>Unsigned Transaction</b></h3>
                <pre>{{ txData.unsignedTx }}</pre>
                <br />
                <h3 class="is-size-6"><b>Decoded Unsigned Transaction</b></h3>
                <pre>{{ txData.decodedUnsignedTx }}</pre>
                <br />
                <h3 class="is-size-6"><b>Signning Payload</b></h3>
                <pre class="wrapword">{{ txData.signingPayload }}</pre>
                <br />
                <h3 class="is-size-6"><b>Signature</b></h3>
                <pre class="wrapword">{{ txData.signature }}</pre>
                <br />
                <h3 class="is-size-6"><b>Signed Transaction</b></h3>
                <pre class="wrapword">{{ txData.signedTx }}</pre>
                <br />
                <h3 class="is-size-6"><b>Expected Transaction Hash</b></h3>
                <pre class="wrapword">{{ txData.expectedTxHash }}</pre>
                <br />
              </section>
              <footer class="modal-card-foot">
                <b-button label="Close" class="is-primary" @click="showCreatedTx = false" />
              </footer>
            </div>
          </b-modal>
        </ValidationObserver>
      </b-tab-item>
      <b-tab-item label="Broadcast">
        <ValidationObserver
          ref="observerBroadcast"
          v-slot="{ passes }"
          tag="form"
        >
          <form @submit.prevent="passes(submitTx)">
            <ValidationProvider v-slot="{ errors, valid }" rules="required">
              <b-field
                label="Signed Transaction"
                :type="{ 'is-danger': errors[0], 'is-success': valid }"
                :message="errors"
              >
                <b-input
                  v-model="broadcastData.signedTx"
                  type="textarea"
                  :lazy="true"
                ></b-input>
              </b-field>
            </ValidationProvider>

            <ValidationProvider v-slot="{ errors, valid }" rules="required">
              <b-field
                label="URL to broadcast"
                :type="{ 'is-danger': errors[0], 'is-success': valid }"
                :message="errors"
              >
                <b-input v-model="broadcastData.url" :lazy="true"></b-input>
              </b-field>
            </ValidationProvider>
            <br />

            <div class="has-text-centered">
              <b-button
                native-type="submit"
                label="Broadcast"
                class="is-primary"
                expanded
              />
            </div>
          </form>
        </ValidationObserver>
        <br />
        <BroadcastAttempts></BroadcastAttempts>
      </b-tab-item>
    </b-tabs>
  </div>
</template>

<script>
import { Keyring } from '@polkadot/api'
import { cryptoWaitReady } from '@polkadot/util-crypto'
import {
  deriveAddress,
  getRegistry,
  methods,
  createSigningPayload,
  createSignedTx,
  getTxHash,
  decode,
  POLKADOT_SS58_FORMAT,
} from '@substrate/txwrapper'
import FileReader from './FileReader'
import BroadcastAttempts from './BroadcastAttempts'
import { getConnection } from '~/helpers/connestion_storage'
import { rpcToNode } from '~/helpers/rpc'
import { signWith } from '~/helpers/signer'
import { addBroadcastAtempt } from '~/helpers/broadcasts'

function decodePatch(unsignedTx, txOptions) {
  const unsignedTx_ = { ...unsignedTx }
  // This is an ugly hack to decode immortal transactions. Because the decoder provided in txWrapper
  // always expects mortal era and fails to decode immortal era.
  // See https://github.com/paritytech/txwrapper/blob/master/src/decode/decodeUnsignedTx.ts#L39
  unsignedTx_.era = '0x0100'
  const decodedUnsignedTx = decode(unsignedTx_, txOptions)
  decodedUnsignedTx.eraPeriod = 0
  return decodedUnsignedTx
}

const initialData = {
  formData: {
    // Chain / Node
    genesisHash: '',
    metadata: '',
    specVersion: '',
    transactionVersion: '',
    // Tx
    destination: '',
    amount: '',
    nonce: '',
    tip: '',
    mnemonic: '',
  },
  txData: {
    unsignedTx: '',
    decodedUnsignedTx: '',
    signingPayload: '',
    signature: '',
    signedTx: '',
    expectedTxHash: '',
  },
  broadcastData: {
    signedTx: '',
    url: '',
  },
  showCreatedTx: false,
}

export default {
  components: {
    FileReader,
    BroadcastAttempts,
  },
  data() {
    return initialData
  },
  mounted() {
    this.$root.$on('use-connection', (connectionId) => {
      const connection = getConnection(connectionId)
      this.broadcastData.url = connection.url
      this.formData.genesisHash = connection.genesisHash
      this.formData.metadata = connection.metadata
      this.formData.specVersion = connection.specVersion
      this.formData.transactionVersion = connection.transactionVersion
    })
  },
  methods: {
    loadFileDataToMnemonic(fileData) {
      this.formData.mnemonic = fileData
    },
    async createTransaction() {
      await cryptoWaitReady()
      if (!this.formData.mnemonic) {
        this.$buefy.toast.open({
          message: `Can't create a transcation without or with invalide mnemonic. Make sure you've uploaded a valid mnemonic.`,
          type: 'is-danger',
        })
        return
      }
      try {
        const keyring = new Keyring({ type: 'sr25519' })
        const fromKeypair = keyring.addFromUri(this.formData.mnemonic)
        const txArgs = {
          dest: this.formData.destination,
          value: this.formData.amount,
        }
        const txInfo = {
          address: deriveAddress(fromKeypair.publicKey, POLKADOT_SS58_FORMAT),
          blockHash: this.formData.genesisHash,
          blockNumber: '0',
          genesisHash: this.formData.genesisHash,
          metadataRpc: this.formData.metadata,
          nonce: this.formData.nonce,
          specVersion: this.formData.specVersion,
          tip: this.formData.tip,
          eraPeriod: '0',
          transactionVersion: this.formData.transactionVersion,
        }
        const registry = getRegistry(
          'Polkadot',
          'polkadot',
          this.formData.specVersion
        )
        const txOptions = {
          metadataRpc: this.formData.metadata,
          registry,
        }
        const unsignedTx = methods.balances.transferKeepAlive(
          txArgs,
          txInfo,
          txOptions
        )
        // This is needed since the transferKeepAlive library has a bug that overrides
        // era to 64 is eraPeriod equals to zero.
        unsignedTx.era = registry.createType('ImmortalEra').toHex()
        const decodedUnsignedTx = decodePatch(unsignedTx, txOptions)
        const signingPayload = createSigningPayload(unsignedTx, txOptions)
        const signature = signWith(fromKeypair, signingPayload, txOptions)
        const signedTx = createSignedTx(unsignedTx, signature, txOptions)
        const expectedTxHash = getTxHash(signedTx)

        this.txData.unsignedTx = JSON.stringify(unsignedTx, undefined, 2)
        this.txData.decodedUnsignedTx = JSON.stringify(
          decodedUnsignedTx,
          undefined,
          2
        )
        this.txData.signingPayload = signingPayload
        this.txData.signature = signature
        this.txData.signedTx = signedTx
        this.txData.expectedTxHash = expectedTxHash

        this.showCreatedTx = true
      } catch (e) {
        this.$buefy.toast.open({
          message: `Something went wrong creating transaction. Error: ${e.message}`,
          type: 'is-danger',
        })
      }
    },
    async submitTx() {
      try {
        const actualTxHash = await rpcToNode(
          this.broadcastData.url,
          'author_submitExtrinsic',
          [this.broadcastData.signedTx]
        )
        this.$buefy.toast.open({
          message: `Broadcasting transaction was successful! TxHash: ${actualTxHash}`,
          type: 'is-success',
        })
        addBroadcastAtempt({
          url: this.broadcastData.url,
          signedTx: this.broadcastData.signedTx,
          isError: false,
          txHash: actualTxHash,
        })
      } catch (e) {
        this.$buefy.toast.open({
          message: `Something went wrong while boadcasting transaction. Error: ${e.message}`,
          type: 'is-danger',
        })
        addBroadcastAtempt({
          url: this.broadcastData.url,
          signedTx: this.broadcastData.signedTx,
          isError: true,
          errorMessage: e.message,
        })
      }
      this.$root.$emit('reconcile-broadcasts')
      this.resetBroadcast()
    },
    resetTx() {
      this.$root.$emit('reset-app')

      this.formData.genesisHash = ''
      this.formData.metadata = ''
      this.formData.specVersion = ''
      this.formData.transactionVersion = ''
      this.formData.destination = ''
      this.formData.amount = ''
      this.formData.nonce = ''
      this.formData.tip = ''
      this.formData.mnemonic = ''
      this.txData.unsignedTx = ''
      this.txData.decodedUnsignedTx = ''
      this.txData.signingPayload = ''
      this.txData.signature = ''
      this.txData.signedTx = ''
      this.txData.expectedTxHash = ''

      this.showCreatedTx = false

      this.$refs.observerTx.reset()
    },
    resetBroadcast() {
      this.broadcastData.signedTx = ''
      this.broadcastData.url = ''

      this.$refs.observerBroadcast.reset()
    },
  },
}
</script>

<style scoped>
.wrapword {
  white-space: -moz-pre-wrap !important; /* Mozilla, since 1999 */
  white-space: -pre-wrap; /* Opera 4-6 */
  white-space: -o-pre-wrap; /* Opera 7 */
  white-space: pre-wrap; /* css-3 */
  word-wrap: break-word; /* Internet Explorer 5.5+ */
  white-space: -webkit-pre-wrap; /* Newer versions of Chrome/Safari*/
  word-break: break-all;
  white-space: normal;
}
pre {
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>
