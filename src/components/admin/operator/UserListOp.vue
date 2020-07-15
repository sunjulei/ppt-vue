<template>
  <div>
    <!--表格-->
    <router-view></router-view>
    <router-link to="/UserAddOp">
      <el-button type="primary">添加用户</el-button>
    </router-link>
    <el-table
      stripe="true"
      highlight-current-row="true"
      :data="tableData">
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
        <el-form :model="formData" ref="formData" :rules="rules" class="demo-ruleForm">

          <el-form-item label="头像">
            <div class="image-view">
              <div class="addbox"><input type="file" @change="getHeadImgBase()">
                <div class="addbtn">+</div>

                <div class="item" v-for="(item, index) in imgBase64">
              <span class="cancel-btn"
                    @click="delHeadImg(index)">x</span>
                  <viewer><img :src="item.data"></viewer>
                </div>
              </div>
            </div>
          </el-form-item>

          <el-form-item prop="name" label="昵称">
            <el-input v-model="formData.name"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="editOk('formData')">确 定</el-button>
          </el-form-item>
        </el-form>

      </el-dialog>
    </div>
  </div>
</template>

<script>
  export default {
    name: "UserListOp",
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
        imgBase64: [],//存储封面 base64的值将值传给后端处理
        tempBase64: [],//封面临时变量 存储img base64的值
        isHeadImg: true,//是否点击了有头像的：true：是的，false：没有头像
        rules: {
          name: [
            {required: true, message: '请输入用户昵称', trigger: 'blur'},
            {min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur'}
          ]
        },
      }
    },
    methods: {

      //编号
      indexMethod(index) {
        return index + 1;
      },
      //表格右侧编辑
      handleEdit(index, row) {
        let _this = this;
        this.dialogFormVisible = true;
        this.formTempData = row
        this.formData = Object.assign({}, row);
        _this.imgBase64 = [];
        this.isHeadImg = row.headImg !== null;
        //初始化头像
        if (this.isHeadImg) {
          this.getBase64(this.baseUrl + this.formData.headImg).then(function (base64) {
            var headImg = _this.formData.headImg;
            headImg = headImg.substring(headImg.indexOf("headImg") + 8);
            _this.imgBase64.push({name: headImg, data: base64});
            _this.tempBase64.push({name: headImg, data: base64});//赋值临时变量
          }, function (err) {
          });
        }
      },
      //表格右侧编辑——确定修改
      editOk(formName) {
        let _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.dialogFormVisible = false;
            if (this.isHeadImg) {
              var headImgUrl = this.baseUrl + "/user/uploadHeadImg"
              this.axios.post(headImgUrl, this.imgBase64).then(function (resp) {
              })
              this.formData.headImg = "/headImg/" + this.imgBase64[0].name;
            }
            var url = this.baseUrl + "/user/update"
            this.axios.put(url, this.formData).then(function (resp) {
              if (resp.data.code === 200) {
                _this.$message({
                  offset: 80,
                  title: '修改用户',
                  message: '用户信息修改成功！',
                  type: 'success'
                });
                window.location.reload()
              } else {
                _this.$message({
                  offset: 80,
                  title: '修改用户',
                  message: '用户信息修改失败！',
                  type: 'error'
                });
              }
            })
          } else {
            _this.$message({
              offset: 80,
              title: '修改用户',
              message: '请检查输入信息！',
              type: 'warning'
            });
            return false;
          }
        });


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

      //传入图片url路径，返回base64
      getBase64(img) {
        function getBase64Image(img, width, height) {//width、height调用时传入具体像素值，控制大小 ,不传则默认图像大小
          var canvas = document.createElement("canvas");
          canvas.width = width ? width : img.width;
          canvas.height = height ? height : img.height;

          var ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          var dataURL = canvas.toDataURL();
          return dataURL;
        }

        var image = new Image();
        image.crossOrigin = '';
        image.src = img;
        var deferred = $.Deferred();
        if (img) {
          image.onload = function () {
            deferred.resolve(getBase64Image(image));//将base64传给done上传处理
          }
          return deferred.promise();//问题要让onload完成后再return sessionStorage['imgTest']
        }
      },
      //头像 获取图片base64实现预览
      getHeadImgBase() {
        var _this = this;
        var event = event || window.event;
        var file = event.target.files[0];
        var reader = new FileReader();
        //转base64
        reader.onload = function (e) {
          _this.isHeadImg=true;
          //判断格式
          var type = e.currentTarget.result;
          type = type.substring(type.indexOf("/") + 1, type.indexOf(";"));
          if (type !== "jpeg" && type !== "jpg" && type !== "png") {
            _this.$message({
              type: 'warning',
              title: '头像',
              message: '头像不支持该文件类型，仅支持jpg、png!'
            });
            return;
          }

          //判断大小
          var AllowImgFileSize = 2 * 1024 * 1024;    //上传图片最大值(单位字节)（ 2 M = 2097152 B ）
          if (AllowImgFileSize !== 0 && AllowImgFileSize < reader.result.length) {
            _this.$message({
              type: 'warning',
              title: '头像',
              message: '请上传不大于2M的头像！'
            });
            return;
          }
          if (_this.imgBase64.length >= 1) {
            _this.imgBase64.splice(0, 1);
          }

          _this.imgBase64.push({name: _this.formData.username + "." + type, data: e.target.result});
        }
        reader.readAsDataURL(file);
      },
      //头像 删除图片
      delHeadImg(index) {
        // if (this.imgBase64[0].name !== this.tempBase64[0].name) {

        this.imgBase64.splice(index, 1);
        this.imgBase64.push(this.tempBase64[0])

        this.$message.info({
          title: '头像',
          message: '已恢复默认头像！'
        });

      },
    },
    created() {
      this.page(1);
    }
  }
</script>

<style scoped>

  .clearboth::after {
    content: "";
    display: block;
    clear: both;
  }

  .image-view {
    margin: 50px auto;
  }

  .image-view .addbox {
    float: left;
    position: relative;
    margin-bottom: 20px;
    text-align: center;
  }

  .image-view .addbox input {
    position: absolute;
    left: 0;
    height: 80px;
    width: 80px;
    opacity: 0;
  }

  .image-view .addbox .addbtn {
    float: left;
    height: 80px;
    width: 80px;
    line-height: 80px;
    color: #fff;
    font-size: 40px;
    background: #ccc;
    border-radius:50%

  }

  .image-view .item {
    position: relative;
    float: left;
    height: 80px;
    width: 80px;
    margin: 0 0 10px 10px;
  }

  .image-view .item .cancel-btn {
    position: absolute;
    right: 0;
    top: 0;
    display: block;
    width: 20px;
    height: 20px;
    color: #fff;
    line-height: 20px;
    text-align: center;
    background: red;
    border-radius: 10px;
    cursor: pointer;
  }

  .image-view .item img {
    width: 80px;
    height: 80px;
    border-radius:50%
  }

  .image-view .view {
    clear: both;
  }
</style>
