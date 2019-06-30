<template>
  <div>
    <ex-table :tableData="mixTableData" @refetch="fetchData">
      <template slot="symbol" slot-scope="{row}">
        {{row.base_currency.toUpperCase()}} / {{row.quote_currency.toUpperCase()}}
      </template>
      <template slot="include_users" slot-scope="{row}">
        <ui-json :json="row.include_users"></ui-json>
      </template>
      <template slot="enabled" slot-scope="{row}">
        <ex-status-tag type="success" v-if="row.enabled">可下单</ex-status-tag>
        <ex-status-tag type="danger" v-if="!row.enabled">不可下单</ex-status-tag>
      </template>
      <template slot="table-operations" slot-scope="{row, $index, intro}">
        <el-button style="margin: 5px" size="mini" @click="updateTradeSymbols(row)" :disabled="!row.is_manager">{{row.enabled ? '停止': '启用'}}</el-button>
      </template>
    </ex-table>
  </div>
</template>

<script>
  import mixTableData from '@/mixins/mixTableData'
  export default {
    mixins: [mixTableData],
    data () {
      return {
        footprints: []
      }
    },
    methods: {
      fetchData () {
        this._fetchData(this.api.getTradeSymbols(this.mixTableParams))
      },
      updateTradeSymbols (row) {
        if (row.is_manager) {
          this.api.updateTradeSymbols(row.id, { field: 'enabled' }).then(res => {
            row.enabled = res.data.value
          })
        }
      }
    },
    created () {
      this.mixTableData = Object.assign(this.mixTableData, {
        queryIntros: [{
          control: 'input',
          key: 'q_base_currency_cont',
          placeholder: '币种'
        }],
        dataIntros: [{
          label: '#',
          key: 'id',
          width: 80
        }, {
          label: '交易对',
          key: 'symbol',
          width: 140
        }, {
          label: '当前价格',
          key: 'close'
        }, {
          label: '纳入用户',
          key: 'include_users'
        }, {
          label: '是否可用',
          key: 'enabled'
        }, {
          label: '创建时间',
          key: 'created_time',
          sortable: 'created_at',
          width: 160
        }, {
          label: '更新时间',
          key: 'updated_time',
          width: 160
        }],
        opIntro: {
          label: '操作',
          width: 100
        }
      })
    }
  }
</script>
