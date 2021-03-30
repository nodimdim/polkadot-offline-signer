<template>
  <div>
    <section v-if="showForm">
      <div class="has-text-centered">
        <h3 class="is-size-5"> <b>Create Signed Transaction Offline</b> </h3>
      </div>
      <br>
      <form @submit.prevent="createTransaction">
        <b-field label="Genesis Hash">
            <b-input v-model="formData.genesisHash" :lazy="true"></b-input>
        </b-field>

        <b-field label="RPC Metadata">
            <b-input type="textarea" v-model="formData.metadata" :lazy="true"></b-input>
        </b-field>

        <b-field label="Spec Version">
            <b-input v-model="formData.specVersion" :lazy="true"></b-input>
        </b-field>

        <b-field label="Transaction Version">
            <b-input v-model="formData.transactionVersion" :lazy="true"></b-input>
        </b-field>

        <b-field label="Destination Address">
            <b-input v-model="formData.destination" :lazy="true"></b-input>
        </b-field>

        <b-field label="Amount">
            <b-input v-model="formData.amount" type="number" min="1" :lazy="true"></b-input>
        </b-field>

        <b-field label="Nonce">
            <b-input v-model="formData.nonce" type="number" min="0" :lazy="true"></b-input>
        </b-field>

        <b-field label="Tip">
            <b-input v-model="formData.tip" type="number" min="0" :lazy="true"></b-input>
        </b-field>

        <br>

        <FileReader @load="loadFileDataToMnemonic($event)"></FileReader>

        <br>

        <div class="has-text-centered">
          <b-button
            label="Create Transaction"
            native-type="submit"
            class="is-primary" expanded/>
        </div>
      </form>
    </section>
    <section v-else>
      <h3 class="is-size-6"> <b>Unsigned Transaction</b> </h3>
      <pre>{{JSON.stringify(txData.unsignedTx, undefined, 2)}}</pre>
      <br>
      <h3 class="is-size-6"> <b>Signning Payload</b> </h3>
      <pre class="wrapword">{{txData.signingPayload}}</pre>
      <br>
      <h3 class="is-size-6"> <b>Signature</b> </h3>
      <pre class="wrapword">{{txData.signature}}</pre>
      <br>
      <h3 class="is-size-6"> <b>Signed Transaction</b> </h3>
      <pre class="wrapword">{{txData.signedTx}}</pre>
      <br>
      <h3 class="is-size-6"> <b>Expected Transaction Hash</b> </h3>
      <pre class="wrapword">{{txData.expectedTxHash}}</pre>
      <br>

      <b-field label="URL to broadcast">
          <b-input v-model="formData.url" :lazy="true"></b-input>
      </b-field>

      <div class="has-text-centered">
        <b-button
          @click="submitTx()"
          label="Broadcast"
          class="is-primary" expanded/>
        <b-button
          @click="resetApp()"
          label="Create New Transaction"
          class="is-primary is-light" expanded/>
      </div>
    </section>
  </div>
</template>

<script>
import FileReader from "./FileReader";
import { Keyring } from '@polkadot/api';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { getConnection } from '~/helpers/connestion_storage'
import { rpcToNode } from '~/helpers/rpc'
import { signWith } from '~/helpers/signer'
import { 
  importPrivateKey, 
  deriveAddress, 
  getRegistry, 
  methods, 
  createSigningPayload, 
  createSignedTx, 
  getTxHash, 
  POLKADOT_SS58_FORMAT,
} from '@substrate/txwrapper'

const initialData = {
    formData: {
      // Chain / Node 
      url: '',
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
      unsignedTx: {},
      signingPayload: '',
      signature: '',
      signedTx: '',
      expectedTxHash: ''
    },
    showForm: true,
}

export default {
  data() {
      return initialData
  },
  methods: {
    loadFileDataToMnemonic(fileData) {
      this.formData.mnemonic = fileData
    },
    async createTransaction() {
      await cryptoWaitReady();
      const keyring = new Keyring();
      const fromKeypair = keyring.addFromUri(this.formData.mnemonic)
      const txArgs = {
        dest: this.formData.destination,
        value: parseInt(this.formData.amount),
      }
      const txInfo = {
        address: deriveAddress(fromKeypair.publicKey, POLKADOT_SS58_FORMAT),
        blockHash: this.formData.genesisHash,
        blockNumber: 0,
        genesisHash: this.formData.genesisHash,
        metadataRpc: this.formData.metadata,
        nonce: parseInt(this.formData.nonce),
        specVersion: this.formData.specVersion,
        tip: parseInt(this.formData.tip),
        eraPeriod: 0,
        transactionVersion: this.formData.transactionVersion,
      }
      const registry = getRegistry('Polkadot', "polkadot", this.formData.specVersion)
      const txOptions = {
        metadataRpc: this.formData.metadata,
        registry,
      }
      console.log(txArgs, txInfo, txOptions)
      const unsignedTx = methods.balances.transferKeepAlive(txArgs, txInfo, txOptions)
      // This is needed since the transferKeepAlive library has a bug that overrides 
      // era to 64 is eraPeriod equals to zero.
      unsignedTx.era = registry.createType('ImmortalEra').toHex()
      const signingPayload = createSigningPayload(unsignedTx, txOptions);
      const signature = signWith(fromKeypair, signingPayload, txOptions);
      const signedTx = createSignedTx(unsignedTx, signature, txOptions);
      const expectedTxHash = getTxHash(signedTx);
      
      this.txData.unsignedTx = unsignedTx
      this.txData.signingPayload = signingPayload
      this.txData.signature = signature
      this.txData.signedTx = signedTx
      this.txData.expectedTxHash = expectedTxHash

      this.showForm = false
    },
    async submitTx() {
       try {
        const actualTxHash = await rpcToNode(this.formData.url,'author_submitExtrinsic', [this.txData.signedTx]);
        console.log(`Actual Tx Hash: ${actualTxHash}`);
        this.$buefy.toast.open({
            message: 'Broadcasting transaction was successful!',
            type: 'is-success'
        })
      } catch (e) {
        console.log(e)
        this.$buefy.toast.open({
            message: `Something went wrong while boadcasting transaction. Error: ${e.message}`,
            type: 'is-danger'
        })
      }
      this.resetApp()
    },
    resetApp() {
      this.$root.$emit('reset-app')

      this.formData.url = ''
      this.formData.genesisHash = ''
      this.formData.metadata = ''
      this.formData.specVersion = ''
      this.formData.transactionVersion = ''

      this.formData.destination = '',
      this.formData.amount = '',
      this.formData.nonce = '',
      this.formData.tip = '',
      this.formData.mnemonic = '',

      this.txData.unsignedTx = ''
      this.txData.signingPayload = ''
      this.txData.signature = ''
      this.txData.signedTx = ''
      this.txData.expectedTxHash = ''

      this.showForm = true
    }
  },
  mounted() {
    this.$root.$on('use-connection', (connectionId) => {
      const connection = getConnection(connectionId)
      this.formData.url = connection.url
      this.formData.genesisHash = connection.genesisHash
      this.formData.metadata = connection.metadata
      this.formData.specVersion = connection.specVersion
      this.formData.transactionVersion = connection.transactionVersion
    });
  },
  components: {
    FileReader
  }
}
</script>

<style scoped>
.wrapword {
    white-space: -moz-pre-wrap !important;  /* Mozilla, since 1999 */
    white-space: -pre-wrap;      /* Opera 4-6 */
    white-space: -o-pre-wrap;    /* Opera 7 */
    white-space: pre-wrap;       /* css-3 */
    word-wrap: break-word;       /* Internet Explorer 5.5+ */
    white-space: -webkit-pre-wrap; /* Newer versions of Chrome/Safari*/
    word-break: break-all;
    white-space: normal;
}
pre {
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>