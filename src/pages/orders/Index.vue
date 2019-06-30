<template>
  <div>
    <ex-table :tableData="mixTableData" @refetch="fetchData">
      <template slot="search-bar-item" slot-scope="{search}">
        <el-form-item :label="search.label" :key="search.key">
          <ex-options-select v-model="mixTableData.query[search.key]" :clearable="true"
                             :options="[{label: 'APP下单', value: 'kind_app'}, {label: '接口下单[固定值]', value: 'kind_custom_price'}, {label: '计划下单[多节点]', value: 'kind_plan'}, {label: '智能下单[倍数]', value: 'kind_smart'}, {label: '自动下单[智能分析]', value: 'kind_auto', disabled: true}]" placeholder="交易种类"></ex-options-select>
        </el-form-item>
      </template>
      <div slot="search-bar-operations">
        <footprint ref="footprintRef" @fetchItemFootprints="fetchItemFootprints" :footprints.sync="footprints"></footprint>
      </div>
      <template slot="id" slot-scope="{row, $index, intro}">
        <el-button type="text" @click="$refs['footprintRef'].showDialog(row)" icon="el-icon-time"></el-button>
        <el-button type="text" @click="showDetailDialog(row)">{{row.id}}</el-button>
      </template>
      <template slot="kind" slot-scope="{row}">
        <ex-status-tag type="info" v-if="row.kind == 'kind_app'">APP下单</ex-status-tag>
        <ex-status-tag v-else-if="row.kind == 'kind_custom_price'">固定值下单</ex-status-tag>
        <ex-status-tag type="success" v-else-if="row.kind == 'kind_auto'">自动下单</ex-status-tag>
        <ex-status-tag type="success" v-else-if="row.kind == 'kind_plan'">计划下单</ex-status-tag>
        <ex-status-tag type="primary" v-else-if="row.kind == 'kind_smart'">智能下单</ex-status-tag>
      </template>
      <template slot="symbol" slot-scope="{row}">
        {{row.symbol_base_currency.toUpperCase()}} / {{row.symbol_quote_currency.toUpperCase()}}
      </template>
      <template slot="category" slot-scope="{row}">
        <ex-status-tag type="success" v-if="row.category == 'category_buy'">买入</ex-status-tag>
        <ex-status-tag type="danger" v-if="row.category == 'category_sell'">卖出</ex-status-tag>
      </template>
      <template slot="status" slot-scope="{row}">
        <ex-status-tag v-if="row.status == 'status_created'">已提交</ex-status-tag>
        <ex-status-tag type="success" v-if="row.status == 'status_filled'">已成交</ex-status-tag>
        <ex-status-tag type="info" v-if="row.status == 'status_finished'">完成交易</ex-status-tag>
        <ex-status-tag type="info" v-if="row.status == 'status_untracked'">停止追踪</ex-status-tag>
        <ex-status-tag type="danger" v-if="row.status == 'status_canceled'">已取消</ex-status-tag>
      </template>
      <template slot="state" slot-scope="{row}">
        <ex-status-tag type="info" v-if="row.state == 'submitted'">已提交</ex-status-tag>
        <ex-status-tag type="info" v-else-if="row.state == 'partial-filled'">部分成交</ex-status-tag>
        <ex-status-tag type="info" v-else-if="row.state == 'partial-canceled'">部分成交撤销</ex-status-tag>
        <ex-status-tag type="info" v-else-if="row.state == 'filled'">完全成交</ex-status-tag>
        <ex-status-tag type="info" v-else-if="row.state == 'canceled'">已撤销</ex-status-tag>
      </template>
      <template slot="price" slot-scope="{row}">
        <ex-status-tag type="success" v-if="row.ctype == 'buy-limit'">{{row.price}}</ex-status-tag>
        <ex-status-tag type="danger" v-else-if="row.ctype == 'sell-limit'">{{row.price}}</ex-status-tag>
        <el-tag v-else>{{row.price}}</el-tag>
      </template>
      <template slot="finish_time" slot-scope="{row}">
        {{row.finish_time.match('1970') ? '' : row.finish_time}}
      </template>
      <template slot="table-operations" slot-scope="{row, $index, intro}">
        <el-button v-if="row.kind === 'kind_custom_price' && ['status_filled'].indexOf(row.status) !== -1 && row.category === 'category_buy'" style="margin: 5px" size="mini" @click="stopTrack(row, 'status_untracked')">停止追踪卖出</el-button>
        <!--<el-button style="margin: 5px" size="mini" @click="showEditDialog(row)">撤单</el-button>-->
      </template>
    </ex-table>
  </div>
</template>

<script>
  import mixTableData from '@/mixins/mixTableData'
  import New from './New.vue'
  import Edit from './Edit.vue'
  import Show from './Show.vue'
  export default {
    mixins: [mixTableData],
    data () {
      return {
        footprints: [],
        json: null,
        statusOptions: [{value: 'status_created'}, {value: 'status_pending'}, {value: 'status_processing'}, {value: 'status_successful'}, {value: 'status_failed'}, {value: 'status_expired'}, {value: 'status_canceled'}, {value: 'status_closed'}]
      }
    },
    methods: {
      fetchData () {
        this._fetchData(this.api.getOrders(this.mixTableParams))
      },
      fetchItemFootprints (item) {
        this.api.getOrderFootprints(item.id).then(res => {
          this.footprints = res.data.items
        })
      },
      showEditDialog (item) {
        this.$ext.mount(Edit, {onEl: this.$el, props: {item}, data: {owner: this}})
      },
      showDetailDialog (item) {
        this.$ext.mount(Show, {onEl: this.$el, props: {item}, data: {owner: this}})
      },
      stopTrack (item, status) {
        this.$confirm('停止追踪将会把设定价格交易关闭，需要手动打开，请确认？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          callback: action => {
            if (action === 'confirm') {
              this.api.updateOrderStatus(item.id, status).then(res => {
                item.status = status
              })
            }
          }
        })
      },
      updateOrderStatus (order, status) {
        this.$confirm('确定更改吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.api.updateOrderStatus(order.id, status).then(res => {
            this.fetchData()
          })
        })
      }
    },
    created () {
      this.mixTableData = Object.assign(this.mixTableData, {
        queryIntros: [{
          control: 'input',
          key: 'q_trade_symbol_base_currency_cont',
          placeholder: '币种'
        }, {
          control: 'custom',
          key: 'q_kind_eq',
          placeholder: '交易种类'
        }],
        dataIntros: [{
          label: '#',
          key: 'id',
          width: 150
        }, {
          label: '下单方式',
          key: 'kind',
          width: 100
        }, {
          label: '交易对',
          key: 'symbol',
          width: 100
        }, {
          label: '买入/卖出',
          key: 'category',
          width: 80
        }, {
          label: '交易状态',
          key: 'status',
          width: 100
        }, {
          label: '三方交易状态',
          key: 'state',
          width: 120
        }, {
          label: '数量',
          key: 'amount'
        }, {
          label: '价格',
          key: 'price'
        }, {
          label: '已成交量',
          key: 'field_amount'
        }, {
          label: '已成交金额',
          key: 'field_cash_amount'
        }, {
          label: '已成交手续费',
          key: 'field_fees',
          width: 100
        }, {
          label: '创建时间',
          key: 'create_time',
          width: 140
        }, {
          label: '交易完成时间',
          key: 'finish_time',
          width: 140
        }],
        opIntro: {
          label: '操作',
          width: 130
        }
      })
    }
  }
</script>
