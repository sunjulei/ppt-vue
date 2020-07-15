<template>
  <div>
    <!--表格-->
    <el-button v-if="this.multipleSelection.length>0 " @click="deleteMultiplePpt" type="danger">删除选中</el-button>
    <el-table
      @selection-change="handleSelectionChange"
      :stripe="true"
      :highlight-current-row="true"
      :data="bannerData">
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
          <viewer :image="baseUrl+scope.row.imgUrl">
            <img
              style="width: 160px; height: 80px"
              :src="baseUrl+scope.row.imgUrl">
          </viewer>
        </template>
      </el-table-column>


      <el-table-column
        align="center"
        label="标签">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="排序">
        <template slot-scope="scope">
          <span>{{ scope.row.bannerOrder }}</span>
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
            type="primary"
            icon="el-icon-edit"
            circle
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">
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
    name: "FileList",
    data() {
      return {
        pageSize: 0,
        total: 0,
        pageTotal: 10,
        bannerData: {
          id: '',
          title: '',
          imgUrl: '',
          bannerOrder: '',
        },
        multipleSelection: [],
        srcList: [],
        dialogStateVisible: false,
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
        this.$router.push({
          name: 'BannerDetail',
          query: {id: row.id}
        })
      },
      //表格右侧编辑
      handleEdit(index, row) {
        localStorage.setItem("bannerUpdate", JSON.stringify(row));
        this.$router.push({
          name: 'ActivityUpdate',
          query: {tableData: row}
        })
      },
      //表格右侧删除
      handleDelete(index, row) {
        let _this = this
        this.$confirm('此操作将永久删除横幅：“' + row.title + '”，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          var url = this.baseUrl + "/indexBanner/deleteById/" + row.id
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

      //修改分页
      page(currentPage) {
        let _this = this;
        var url = this.baseUrl + "/indexBanner/findAll/" + (currentPage - 1) + "/" + this.pageTotal
        this.axios.get(url).then(function (resp) {
          _this.bannerData = resp.data.content
          _this.pageSize = resp.data.size
          _this.total = resp.data.totalElements
        })
      },
      handleSizeChange(val) {
        this.pageTotal = val
        this.page(1);
      },
      handleCurrentChange(val) {
        this.page(val);
      },


      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      //多选删除
      deleteMultiplePpt() {
        let _this = this
        this.$confirm('此操作将永久删除选中的' + this.multipleSelection.length + '横幅，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          var url = this.baseUrl + "/indexBanner/deleteAll"
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

      //点击弹窗的确定
      dialogStateOK() {
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
