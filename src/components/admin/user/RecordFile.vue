<template>
  <div>

    <!--表格-->
    <el-button v-if="this.multipleSelection.length>0 " @click="deleteMultiplePpt" type="danger">删除选中</el-button>
    <el-table
      @selection-change="handleSelectionChange"
      :stripe="true"
      :highlight-current-row="true"
      :data="tableData">
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
        label="封面">
        <template slot-scope="scope">
          <viewer :image="baseUrl+scope.row.roughImgUrl">
            <img
              style="width: 90px; height: 120px"
              :src="baseUrl+scope.row.roughImgUrl">
          </viewer>
        </template>
      </el-table-column>


      <el-table-column
        align="center"
        label="标题">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column
        show-overflow-tooltip="true"
        label="说明">
        <template slot-scope="scope">
          <span>{{ scope.row.fileDesc }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="标签">
        <template slot-scope="scope">
          <span>{{ scope.row.tag }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="作者">
        <template slot-scope="scope">
          <span>{{ scope.row.author}}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="最后访问时间">
        <template slot-scope="scope">
          <span>{{ scope.row.lastRecordTime}}</span>
        </template>
      </el-table-column>


      <el-table-column label="操作" width="240" align="center">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-view"
            circle
            size="mini"
            type="info"
            @click="handleDetail(scope.$index, scope.row)">
          </el-button>
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

    <!--分页-->
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
    name: "DownFile",
    data() {
      return {
        pageSize: 0,
        total: 0,
        pageTotal: 10,
        tableData: [{
          id: '',
          name: '',
          downUrl: '',
          tag: '',
          title: '',
          type: '',
          menu: '',
          size: '',
          desc: '',
          collectNum: '',
          downNum: '',
          pagNum: '',
          author: '',
          roughImgUrl: '',
          detailImgUrl: [],
          upData: '',
          videoUrl: '',
          lastRecordTime:'',
          fileId:''
        }],
        multipleSelection: [],
        srcList: [],
        tempData: []
      }
    },
    methods: {
      //编号
      indexMethod(index) {
        return index + 1;
      },
      //表格右侧查看
      handleDetail(index, row) {
        if (row.state !== '通过') {
          this.$message({
            offset: 80,
            type: 'warning',
            message: '通过审核才可查看该文件，当前审核状态为：' + row.state
          });
          return;
        }
        //打开新窗口
        let routeData = this.$router.resolve({
          name: 'FileDetailShow',
          query: {id: row.fileId},
        });
        window.open(routeData.href, '_blank');
      },
      //表格右侧删除
      handleDelete(index, row) {
        console.log(row)
        let _this = this
        var url = this.baseUrl + "/fileHistory/deleteById/" + row.id
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
      },

      //修改分页
      page(currentPage) {
        let _this = this;
        var username = this.$cookie.get('userck');
        var url = this.baseUrl + "/fileHistory/findAll/" + username + "/" + (currentPage - 1) + "/" + this.pageTotal

        this.axios.get(url).then(function (resp) {
          console.log(resp.data.data)
          _this.tableData = resp.data.data.filesData

          for (let i=0;i<resp.data.data.files.content.length;i++) {
            _this.tableData[i].lastRecordTime=resp.data.data.files.content[i].lastRecordTime
            _this.tableData[i].id=resp.data.data.files.content[i].id
            _this.tableData[i].fileId=resp.data.data.files.content[i].fileId
          }

          _this.pageSize = resp.data.data.files.size
          _this.total = resp.data.data.files.totalElements
        })
      },
      handleSizeChange(val) {
        this.pageTotal = val
        this.page(1);
      },
      handleCurrentChange(val) {
        this.page(val);
      },
      //角色添加筛选标签
      filterRole(value, row) {
        return row.role === value;
      },

      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        console.log(val)
        this.multipleSelection = val;
      },

      //多选删除
      deleteMultiplePpt() {
        let _this = this
        this.$confirm('此操作将永久删除选中的' + this.multipleSelection.length + '条历史记录，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          var url = this.baseUrl + "/fileHistory/deleteAll"
          var pptList = this.multipleSelection
          this.axios.post(url, pptList).then(function (resp) {
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
      this.page(1);
    }
  }
</script>

<style scoped>
  .my-scroll-bar {
    height: 120px;
    width: 90px;
  }
</style>
