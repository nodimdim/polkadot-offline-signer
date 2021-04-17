<template>
  <div>
    <div class="is-divider"></div>
    <h3 class="is-size-5"><b>Recent Signed Transactions</b></h3>
    <p v-if="txDatas.length == 0">No recent signed transactions found.</p>
    <div v-for="txData in txDatas" :key="txData.id">
      <div class="box wrapword">
        <h3 class="is-size-6"><b>Decoded Unsigned Transaction</b></h3>
        <pre>{{ txData.decodedUnsignedTx }}</pre>
        <br />
        <h3 class="is-size-6"><b>Signed Transaction</b></h3>
        <pre class="wrapword">{{ txData.signedTx }}</pre>
        <br />
        <h3 class="is-size-6"><b>Expected Transaction Hash</b></h3>
        <pre class="wrapword">{{ txData.expectedTxHash }}</pre>
        <br />
      </div>
    </div>
  </div>
</template>

<script>
import { getTxDatas } from '~/helpers/signed-txs'

export default {
  data() {
    return {
      txDatas: getTxDatas(),
    }
  },
  mounted() {
    this.$root.$on('reconcile-tx-datas', () => {
      this.txDatas = getTxDatas()
    })
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
.is-divider {
  border-bottom: 1px dotted grey;
  margin-top: 20px;
  margin-bottom: 20px;
}
.box {
  margin-bottom: 10px;
}
</style>
