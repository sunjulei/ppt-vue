<template>
  <div>
    <!--表格-->
    <el-button v-if="this.multipleSelection.length>0 " @click="deleteMultiplePpt" type="danger">删除选中</el-button>
    <el-table
      @selection-change="handleSelectionChange"
      :stripe="true"
      :highlight-current-row="true"
      :data="helpSugData">
      <el-table-column
        align="center"
        type="selection">
      </el-table-column>
      <el-table-column
        label="编号"
        align="center"
        type="index"
        :index="indexMethod">
      </el-table-column>

      <el-table-column
        align="center"
        label="主题">
        <template slot-scope="scope">
          <span>{{ scope.row.subject }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="详细说明">
        <template slot-scope="scope">
          <span>{{ scope.row.detailDesc }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="联系方式">
        <template slot-scope="scope">
          <span>{{ scope.row.connectInfo }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="提交时间">
        <template slot-scope="scope">
          <span>{{ scope.row.startTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="删除" width="240" align="center">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-delete"
            circle
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">
          </el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>

</template>

<script>

  export default {
    name: "HelpSuggest",
    data() {
      return {
        helpSugData: [
          {
            id: '',
            subject: '',
            detailDesc: '',
            connectInfo: '',
            startTime: '',
          }
        ],
        multipleSelection: [],
      }
    },
    methods: {
      //编号
      indexMethod(index) {
        return index + 1;
      },

      //表格右侧删除
      handleDelete(index, row) {
        let _this = this
        this.$confirm('此操作将永久删除该条目：“' + row.subject + '”，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          var url = this.baseUrl + "/helpSuggest/deleteById/" + row.id
          this.axios.delete(url).then(function (resp) {
            if (resp.data.code === 200) {
              _this.$message({
                offset: 80,
                type: 'success',
                message: '删除成功!'
              });
              window.location.reload();
            } else {
              _this.$message({
                offset: 80,
                type: 'error',
                message: '删除失败：' + resp.data.message
              });
            }
          });
        }).catch(() => {
          this.$message({
            offset: 80,
            type: 'info',
            message: '已取消删除'
          });
        });
      },


      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      //多选删除
      deleteMultiplePpt() {
        let _this = this
        this.$confirm('此操作将永久删除选中的' + this.multipleSelection.length + '条目，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          var url = this.baseUrl + "/helpSuggest/deleteAll"
          var bannerList = this.multipleSelection
          this.axios.post(url, bannerList).then(function (resp) {
            if (resp.data.code === 200) {
              _this.$message({
                offset: 80,
                type: 'success',
                message: '删除成功!'
              });
              window.location.reload();
            } else {
              _this.$message({
                offset: 80,
                type: 'error',
                message: '删除失败：' + resp.data.message
              });
            }
          });

        }).catch(() => {
          _this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });


      },


    },
    created() {
      let _this = this;
      var url = this.baseUrl + "/helpSuggest/findAll/"
      this.axios.get(url).then(function (resp) {
        _this.helpSugData = resp.data.data
      })
    }
  }
</script>

<style scoped>

</style>
