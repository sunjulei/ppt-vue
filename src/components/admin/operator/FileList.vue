<template>
  <div>

    <!--弹窗-->

    <el-dialog width="20%" title="审核状态" :visible.sync="dialogStateVisible">
      <el-radio-group v-model="tempData.state">
        <el-radio label="通过">通过</el-radio>
        <el-radio label="待审核">待审核</el-radio>
        <el-radio label="不提审">不提审</el-radio>
        <el-radio label="拒绝">拒绝</el-radio>
      </el-radio-group>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogStateVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogStateOK">确 定</el-button>
      </div>


    </el-dialog>

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
        label="详情图">
        <template slot-scope="scope">
          <viewer :images="scope.row.detailImgUrl.split('\n')">
            <div class="block" style="text-align: center">
              <GeminiScrollbar
                :autoshow="true"
                class="my-scroll-bar">
                <img
                  v-for="src in scope.row.detailImgUrl.split('\n')"
                  style="width: 90px; height: 120px;"
                  :src="baseUrl+src">
              </GeminiScrollbar>
            </div>
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
        align="center"
        label="所属菜单">
        <template slot-scope="scope">
          <span>{{ scope.row.menu }}</span>
        </template>
      </el-table-column>免费下载

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
        show-overflow-tooltip="true"

        label="说明">
        <template slot-scope="scope">
          <span>{{ scope.row.fileDesc }}</span>
        </template>
      </el-table-column>


      <el-table-column
        align="center"
        prop="state"
        label="状态"
        width="120"
        :filters="[{ text: '通过', value: '通过' },{ text: '待审核', value:'待审核' },{ text: '不提审', value:'不提审' }, { text: '拒绝', value: '拒绝' }]"
        :filter-method="filterState"
        filter-placement="bottom-end">
        <template slot-scope="scope">

          <el-link @click="clickState(scope.row)" :underline="false">
            <el-tag title="点击修改状态" v-if="scope.row.state === '待审核'" type="primary">待审核</el-tag>
          </el-link>
          <el-link @click="clickState(scope.row)" :underline="false">
            <el-tag title="点击修改状态" v-if="scope.row.state === '通过'" type="success">通过</el-tag>
          </el-link>
          <el-link @click="clickState(scope.row)" :underline="false">
            <el-tag title="点击修改状态" v-if="scope.row.state === '拒绝'" type="danger">拒绝</el-tag>
          </el-link>
          <el-link @click="clickState(scope.row)" :underline="false">
            <el-tag title="点击修改状态" v-if="scope.row.state === '不提审'" type="info">不提审</el-tag>
          </el-link>

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
        }],
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
          query: {id: row.id},
        });
        window.open(routeData.href, '_blank');
      },
      //表格右侧编辑
      handleEdit(index, row) {
        localStorage.setItem("fileUpdate", JSON.stringify(row));
        this.$router.push({
          name: 'FileUpdate',
          query: {tableData: row}
        })
      },
      //表格右侧删除
      handleDelete(index, row) {
        let _this = this
        this.$confirm('此操作将永久删除文件：“' + row.title + '”，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          var url = this.baseUrl + "/pptFile/deleteById/" + row.id
          this.axios.delete(url).then(function (resp) {
            // console.log(resp.data)
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
        var url = this.baseUrl + "/pptFile/findAll/" + (currentPage - 1) + "/" + this.pageTotal
        this.axios.get(url).then(function (resp) {
          _this.tableData = resp.data.content
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
        this.multipleSelection = val;
      },

      //多选删除
      deleteMultiplePpt() {
        let _this = this
        this.$confirm('此操作将永久删除选中的' + this.multipleSelection.length + '个文件，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          var url = this.baseUrl + "/pptFile/deleteAll"
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

      //状态筛选
      filterState(value, row) {
        return row.state === value;
      },
      //点击修改状态
      clickState(row) {
        this.tempData = Object.assign({}, row)
        this.dialogStateVisible = true;
      },
      //点击确定修改状态
      dialogStateOK() {
        let _this = this;
        var tableUrl = this.baseUrl + '/pptFile/update';
        console.log(this.tempData)
        this.axios.put(tableUrl, this.tempData).then(function (resp) {
          if (resp.data.code === 200) {
            _this.$message({
              type: 'success',
              title: '文件状态',
              message: '修改成功！'
            });
          } else {
            _this.$message({
              type: 'error',
              title: '文件状态',
              message: '修改失败：' + resp.data.message
            });
          }
        })
        this.dialogStateVisible = false;
        window.location.reload();
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
