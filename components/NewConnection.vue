<template>
  <div>
    <b-loading v-model="sendingRpc"></b-loading>
    <b-button @click="openNewConnectionFrom" type="is-primary" expanded>Add new connection</b-button>
    <b-modal v-model="newConnectionFromOpen">
      <form @submit.prevent="addNewConnection">
        <div class="modal-card" style="width: auto">
            <header class="modal-card-head">
                <p class="modal-card-title">New Connection</p>
            </header>
            <section class="modal-card-body">
                <b-field label="Connection Name">
                  <b-input v-model="formFields.name"></b-input>
                </b-field>
                <b-field label="Url">
                  <b-input v-model="formFields.url"></b-input>
                </b-field>
            </section>
            <footer class="modal-card-foot">
                <b-button
                    label="Close"
                    @click="closeNewConnectionFrom" />
                <b-button
                    label="Create"
                    native-type="submit"
                    class="is-primary" />
            </footer>
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script>
import Vue, { PropOptions } from 'vue'
import { rpcToNode } from '~/helpers/rpc'
import { addConnection } from '~/helpers/connestion_storage'

export default {
  data() {
    return {
      sendingRpc: false,
      newConnectionFromOpen: false,
      formFields: {
        name: '',
        url: '',
      }
    }
  },
  methods: {
    clearNewConnectionFrom() {
      this.formFields.name = ''
      this.formFields.url = ''
    },
    openNewConnectionFrom() {
      this.closeNewConnectionFrom()
      this.newConnectionFromOpen = true
    },
    closeNewConnectionFrom() {
      this.clearNewConnectionFrom()
      this.newConnectionFromOpen = false
    },
    async addNewConnection() {
      this.sendingRpc = true
      try {
        const genesisHash = await rpcToNode(this.formFields.url, 'chain_getBlockHash', [0]);
        const metadata = await rpcToNode(this.formFields.url, 'state_getMetadata')
        const { specVersion, transactionVersion } = await rpcToNode(this.formFields.url, 'state_getRuntimeVersion')
        const newConnection = {
          name: this.formFields.name,
          url: this.formFields.url,
          genesisHash,
          metadata,
          specVersion,
          transactionVersion,
        }
        addConnection(newConnection)
        this.$root.$emit('reconcile-connections')
        this.$buefy.toast.open({
            message: 'Added new connection successfully!',
            type: 'is-success'
        })
      } catch (e) {
        this.$buefy.toast.open({
            message: `Something went wrong adding new connection. Error: ${e.message}`,
            type: 'is-danger'
        })
      }
      this.closeNewConnectionFrom()
      this.sendingRpc = false
    }
  },
}
</script>

<style>
.connection-container {
  margin-bottom: 5px
}
</style>