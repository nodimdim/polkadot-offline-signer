<template>
  <div>
    <div class="is-divider"></div>
    <h3 class="is-size-5"> <b>Recent Broadcasts</b> </h3>
    <p v-if="broadcasts.length == 0">No recent broadcasts found.</p>
    <div v-for="broadcast in broadcasts" :key="broadcast.id">
      <div class="box wrapword">
        <p><b>Signed Tx:</b><br>{{ broadcast.signedTx }}</p>
        <b>Outcome:</b> 
        <b-tag v-if="broadcast.isError" type="is-danger">Error</b-tag>
        <b-tag v-else type="is-success">Success</b-tag>
        <p v-if="broadcast.isError"><b>Message:</b> {{ broadcast.errorMessage }}</p>
        <p v-else><b>TxHash:</b> {{ broadcast.txHash }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { getBroadcasts } from '~/helpers/broadcasts'

export default {
  data() {
    return {
      broadcasts: getBroadcasts()
    }
  },
  mounted() {
    this.$root.$on('reconcile-broadcasts', () => {
      this.broadcasts = getBroadcasts()
    });
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
.is-divider {
  border-bottom: 1px dotted grey;
  margin-top: 20px;
  margin-bottom: 20px;
}
.box {
  margin-bottom: 10px;
}
</style>