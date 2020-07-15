<template>
  <div>
    <el-table
      border="true"
      highlight-current-row="true"
      stripe="true"
      :data="tableData"
      style="text-align: center">
      <el-table-column
        type="index"
        :index="indexMethod">
      </el-table-column>
      <el-table-column
        sortable
        prop="user"
        label="账号">
      </el-table-column>
      <el-table-column
        prop="state"
        label="状态"
        :filters="[{ text: '在线', value: '在线' }, { text: '离线', value: '离线' }]"
        :filter-method="filterTag"
        filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.state === '在线' ? 'primary' : 'danger'"
            disable-transitions>{{scope.row.state}}
          </el-tag>
        </template>
        >
      </el-table-column>
      <el-table-column
        sortable
        prop="startTime"
        label="上线时间">
      </el-table-column>
      <el-table-column
        sortable
        prop="endTime"
        label="下线时间">
      </el-table-column>
      <el-table-column
        prop="ip"
        label="ip">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址">
      </el-table-column>

    </el-table>

    <div style="margin-top: 30px;text-align: center">
      <div class="block">
        <span class="demonstration"></span>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="page"
          :current-page="handleCurrentChange"
          :page-size="pageSize"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    name: "SessionList",
    data() {
      return {
        pageSize: '0',
        total: '0',
        pageTotal:'10',
        tableData: [{
          user: '',
          state: '',
          startTime: '',
          endTime: '',
          ip: '',
          address: ''
        }],
      }
    },
    methods: {
      indexMethod(index) {
        return index + 1;
      },
      filterTag(value, row) {
        return row.state === value;
      },
      page(currentPage) {
        let _this = this
        var url = this.baseUrl + "/sessionList/findAll/" + (currentPage - 1) +"/"+ this.pageTotal
        this.axios.get(url).then(function (resp) {
          _this.tableData = resp.data.content
          _this.pageSize = resp.data.size
          _this.total = resp.data.totalElements
        })
      },
      handleSizeChange(val) {
        this.pageTotal=val
        this.page(1);
      },
      handleCurrentChange(val) {
        this.page(val);
      }
    },
    created() {
      this.page(1);
    }
  }
</script>

<style scoped>

</style>
