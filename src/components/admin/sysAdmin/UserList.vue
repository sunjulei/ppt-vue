<template>
  <div>
    <!--表格-->
    <router-view></router-view>
    <el-button v-if="this.multipleSelection.length>0 " @click="deleteMultipleUser" type="danger">删除选中</el-button>
    <router-link to="/UserAdd">
      <el-button type="primary">添加用户</el-button>
    </router-link>
    <el-table
      @selection-change="handleSelectionChange"
      stripe="true"
      highlight-current-row="true"
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
        label="头像">
        <template slot-scope="scope">
          <!--        <div slot="reference" class="name-wrapper">-->
          <!--          <el-tag size="medium">{{ scope.row.name }}</el-tag>-->
          <!--        </div>-->
          <img class="img-circle" style="width: 40px;height: 40px" v-if="scope.row.headImg!=null"
               :src="baseUrl+scope.row.headImg">
          <el-avatar v-if="scope.row.headImg==null"> {{scope.row.name}}</el-avatar>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="昵称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="账号">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.registerTime }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="角色"
        :filters="[{ text: '运维', value: 'operator' },{ text: '管理员', value: 'admin' }, { text: '用户', value: 'member' }]"
        :filter-method="filterRole"
        filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag type="primary" disable-transitions v-if="scope.row.role==='admin'">管理员</el-tag>
          <el-tag type="success" disable-transitions v-if="scope.row.role==='operator'">运维</el-tag>
          <el-tag type="warning" disable-transitions v-if="scope.row.role==='member'">用户</el-tag>
        </template>

      </el-table-column>

      <el-table-column label="操作" width="240" align="center">
        <template slot-scope="scope">
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

    <!--弹窗-->
    <div>
      <el-dialog :title="'编辑用户：'+formTempData.username" :visible.sync="dialogFormVisible">
        <el-form :model="formData">

          <el-form-item label="账号" :label-width="formLabelWidth">
            <el-input v-model="formData.username" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="密码" :label-width="formLabelWidth">
            <el-input type="password" v-model="formData.password" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="角色" :label-width="formLabelWidth">

            <el-radio-group v-model="formData.role">
              <el-radio label="member">member</el-radio>
              <el-radio label="operator">operator</el-radio>
              <el-radio label="admin">admin</el-radio>
            </el-radio-group>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="editOk">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  export default {
    name: "UserList",
    data() {
      return {
        pageSize: '0',
        total: '0',
        pageTotal: '10',
        tableData: [{
          name: '',
          username: '',
          headImg: '',
          role: ''
        }],
        dialogFormVisible: false,
        formData: {
          id: '',
          username: '',
          password: '',
          role: ''
        },
        formTempData: {
          id: '',
          username: '',
          password: '',
          role: ''
        },
        formLabelWidth: '50px',
        multipleSelection: [],
      }
    },
    methods: {

      //编号
      indexMethod(index) {
        return index + 1;
      },
      //表格右侧编辑
      handleEdit(index, row) {
        this.dialogFormVisible = true;
        this.formTempData = row
        this.formData = Object.assign({}, row)
      },
      //表格右侧删除
      handleDelete(index, row) {
        let _this = this
        this.$confirm('此操作将永久删除账号：' + row.username + '，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          var url = this.baseUrl + "/user/deleteById/" + row.id
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
                type: 'info',
                message: "删除失败：" + resp.data.message
              });
            }
          });


        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      //表格右侧编辑——确定修改
      editOk() {

        let _this = this;
        this.dialogFormVisible = false;
        var url = this.baseUrl + "/user/update"
        this.axios.put(url, this.formData).then(function (resp) {

          if (resp.data.code === 200) {
            _this.$message({
              offset: 80,
              type: 'success',
              message: '修改成功!'
            });
            window.location.reload()
          } else {
            _this.$message({
              offset: 80,
              type: 'success',
              message: "修改失败：" + resp.data.message
            });
          }
        })

      },
      //修改分页
      page(currentPage) {
        let _this = this;
        var url = this.baseUrl + "/user/findAll/" + (currentPage - 1) + "/" + this.pageTotal
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
      deleteMultipleUser() {
        let _this = this
        this.$confirm('此操作将永久删除选中的' + this.multipleSelection.length + '个用户，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          var url = this.baseUrl + "/user/deleteAll"
          var userList = this.multipleSelection
          this.axios.post(url, userList).then(function (resp) {
            if (resp.data.code === 200) {
              _this.$message({
                type: 'success',
                message: '删除成功!'
              });
              window.location.reload();
            } else {
              _this.$message({
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


      }
    },
    created() {
      this.page(1);
    }
  }
</script>

<style scoped>

</style>
