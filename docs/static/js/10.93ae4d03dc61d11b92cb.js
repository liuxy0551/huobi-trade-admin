webpackJsonp([10],{oq06:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=a("aA9S"),l=a.n(s),n=a("AISp"),i={mixins:[a("gf7+").a],methods:{fetchData:function(){return this._fetchData(this.api.getOrderPlan(this.item.id))}}},r={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("el-dialog",{attrs:{title:"详情",visible:t.dialogVisible,width:"80%"},on:{"update:visible":function(e){t.dialogVisible=e}}},[a("ui-json",{attrs:{json:t.form}})],1)},staticRenderFns:[]},o=a("C7Lr")(i,r,!1,null,null,null).exports,u={mixins:[n.a],data:function(){return{footprints:[]}},methods:{fetchData:function(){this._fetchData(this.api.getOrderPlans(this.mixTableParams))},fetchItemFootprints:function(t){var e=this;this.api.getOrderPlanFootprints(t.id).then(function(t){e.footprints=t.data.items})},showDetailDialog:function(t){this.$ext.mount(o,{onEl:this.$el,props:{item:t},data:{owner:this}})}},created:function(){this.mixTableData=l()(this.mixTableData,{queryIntros:[{control:"custom",key:"q_balance_plan_id_eq"},{control:"custom",key:"q_status_in_any"}],dataIntros:[{label:"#",key:"id",width:110},{label:"交易对",key:"full_coin_name"},{label:"买入价格",key:"buy_price"},{label:"买入数量",key:"buy_count"},{label:"卖出价格",key:"sell_price"},{label:"卖出数量",key:"sell_count"},{label:"状态",key:"status"},{label:"创建时间",key:"created_time"},{label:"更新时间",key:"updated_time"}]})}},c={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("ex-table",{attrs:{tableData:t.mixTableData},on:{refetch:t.fetchData},scopedSlots:t._u([{key:"search-bar-item",fn:function(e){var s=e.search;return["q_balance_plan_id_eq"==s.key?a("el-form-item",{key:s.key,attrs:{label:s.label}},[a("ex-model-select",{attrs:{api:"/v1/balance_plans",clearable:"",labelKey:"full_coin_name",placeholder:"交易对"},model:{value:t.mixTableData.query[s.key],callback:function(e){t.$set(t.mixTableData.query,s.key,e)},expression:"mixTableData.query[search.key]"}})],1):t._e(),t._v(" "),"q_status_in_any"==s.key?a("el-form-item",{key:s.key,attrs:{label:s.label}},[a("ex-options-select",{attrs:{clearable:!1,options:[{label:"买入中",value:"status_buying"},{label:"已买入",value:"status_buyed"},{label:"已卖出",value:"status_selled"},{label:"卖出中",value:"status_selling"},{label:"已关闭",value:"status_close"}],multiple:"",placeholder:"状态"},model:{value:t.mixTableData.query[s.key],callback:function(e){t.$set(t.mixTableData.query,s.key,e)},expression:"mixTableData.query[search.key]"}})],1):t._e()]}},{key:"status",fn:function(e){var s=e.row;return["status_buying"==s.status?a("ex-status-tag",{attrs:{type:"success"}},[t._v("买入中")]):"status_buyed"==s.status?a("ex-status-tag",[t._v("已买入")]):"status_selled"==s.status?a("ex-status-tag",[t._v("已卖出")]):"status_selling"==s.status?a("ex-status-tag",{attrs:{type:"danger"}},[t._v("卖出中")]):"status_close"==s.status?a("ex-status-tag",{attrs:{type:"info"}},[t._v("已关闭")]):t._e()]}},{key:"id",fn:function(e){var s=e.row;return e.$index,e.intro,[a("el-button",{attrs:{type:"text",icon:"el-icon-time"},on:{click:function(e){return t.$refs.footprintRef.showDialog(s)}}}),t._v(" "),a("el-button",{attrs:{type:"text"},on:{click:function(e){return t.showDetailDialog(s)}}},[t._v(t._s(s.id))])]}}])},[t._v(" "),a("div",{attrs:{slot:"search-bar-operations"},slot:"search-bar-operations"},[a("footprint",{ref:"footprintRef",attrs:{footprints:t.footprints},on:{fetchItemFootprints:t.fetchItemFootprints,"update:footprints":function(e){t.footprints=e}}})],1)])],1)},staticRenderFns:[]},_=a("C7Lr")(u,c,!1,null,null,null);e.default=_.exports}});