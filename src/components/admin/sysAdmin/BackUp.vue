<template>
  <div style="text-align: center;margin-top: 150px">
    备份路径：
    <el-input
      style="width: 300px"
      placeholder="请输入数据备份路径"
      v-model="dataForm.path"
      clearable>
    </el-input>


    <el-button
      type="primary"
      @click="startBack"
      v-loading.fullscreen.lock="fullscreenLoading">
      开始备份
    </el-button>

    <el-table
      :border="true"
      :data="tableData"
      style="margin: 50px auto;width: 50%;">
      <el-table-column
        align="center"
        header-align="center"
        width="200"
        prop="endTime"
        label="备份日期">
      </el-table-column>
      <el-table-column
        align="center"
        header-align="center"
        prop="path"
        label="备份路径">
      </el-table-column>

    </el-table>
  </div>
</template>

<script>

  export default {
    name: "BackUp",
    data() {
      return {
        dataForm: {
          path: '',
          endTime: ''
        },
        fullscreenLoading: false,
        tableData: [],
      }
    },
    methods: {
      tableRowClassName({row, rowIndex}) {
        if (rowIndex === 1) {
          return 'warning-row';
        } else if (rowIndex === 3) {
          return 'success-row';
        }
        return '';
      },
      startBack() {

        let _this = this;
        var str = this.dataForm.path;
        if (str.trim() == "") {
          _this.$message({
            type: 'warning',
            message: '路径不能为空'
          });
          return false;
        }
        this.fullscreenLoading = true;
        var url = this.baseUrl + "/backup"
        this.axios.post(url, this.dataForm).then(function (res) {


          if (res.data.code == "200") {
            _this.$message({
              type: 'success',
              message: '备份成功'
            });
            window.location.reload();
          } else {

            _this.$message({
              type: 'success',
              message: '备份成功'
            });
          }
          _this.fullscreenLoading = false;
        })
      },
    },
    created() {
      let _this = this;
      var url=this.baseUrl+"/backupList"
      this.axios.get(url).then(function (resp) {
        if (resp.data.code == 200) {
          console.log(resp)
          _this.tableData = resp.data.data.content
        }
      })
    }
  }
</script>

<style scoped>

</style>
