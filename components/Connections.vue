<template>
  <div>
    <div class="has-text-centered">
      <h3 class="is-size-5"><b>Connections</b></h3>
    </div>
    <div v-for="connection in connections" :key="connection.id">
      <div class="card">
        <div class="card-content">
          <div class="content">
            <h5>{{ connection.name }}</h5>
            <p><b>url</b>: {{ connection.url }}</p>
          </div>
          <b-button
            type="is-primary is-light"
            @click="removeConnectionAndReconcile(connection.id)"
            >Delete</b-button
          >
          <b-button
            type="is-primary is-pulled-right"
            @click="useThisConnection(connection.id)"
            >Use</b-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getConnections, removeConnection } from '~/helpers/connestion_storage'

export default {
  data() {
    return {
      connections: getConnections(),
    }
  },
  mounted() {
    this.$root.$on('reconcile-connections', () => {
      this.connections = getConnections()
    })
  },
  methods: {
    removeConnectionAndReconcile(connectionId) {
      removeConnection(connectionId)
      this.$root.$emit('reconcile-connections')
    },
    useThisConnection(connectionId) {
      this.$root.$emit('use-connection', connectionId)
    },
  },
}
</script>

<style>
.card {
  margin-bottom: 10px;
}
.card-content {
  margin-bottom: 10px;
}
</style>
