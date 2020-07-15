<template>
  <div>
    <el-form style="width: 30%;margin-left: 33%" label-width="100px" :model="ruleForm" ref="ruleForm" :rules="rules"
             class="demo-ruleForm">

      <el-form-item label="账号">
        {{ruleForm.username}}&emsp;&emsp;(账号不可更改)
      </el-form-item>

      <el-form-item prop="name" label="昵称">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="ruleForm.password"></el-input>
      </el-form-item>


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

      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: "UserData",
    data() {

      return {
        imgBase64: [],
        tempBase64: [],
        isHeadImg: false,
        rules: {
          name: [
            {required: true, message: '请输入昵称', trigger: 'blur'},
            {min: 3, max: 20, message: '昵称长度在 3 到 20 个字符', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur'}

          ],
        },
        ruleForm: {
          username: '',
          name: '',
          password: '',
        },

      };
    },

    methods: {
      submitForm(formName) {
        let _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.isHeadImg) {
              var headImgUrl = this.baseUrl + "/user/uploadHeadImg"
              this.axios.post(headImgUrl, this.imgBase64).then(function (resp) {
              })
              this.ruleForm.headImg = "/headImg/" + this.imgBase64[0].name;
            }
            var url = this.baseUrl + "/user/update"
            this.axios.put(url, this.ruleForm).then(function (resp) {
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
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.imgBase64.splice(0, 1);
        this.imgBase64.push(this.tempBase64[0])
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
          _this.isHeadImg = true;
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

          _this.imgBase64.push({name: _this.ruleForm.username + "." + type, data: e.target.result});
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
      //初始化数据
      initData() {
        let _this = this;
        var url = this.baseUrl + "/findByName/" + this.$cookie.get('userck');
        this.axios.get(url).then(function (resp) {
          _this.ruleForm = resp.data;
          _this.isHeadImg = resp.data.headImg !== null;
          if (_this.isHeadImg) {
            _this.getBase64(_this.baseUrl + resp.data.headImg).then(function (base64) {
              var headImg = _this.ruleForm.headImg;

              headImg = headImg.substring(headImg.indexOf("headImg") + 8);
              _this.imgBase64.push({name: headImg, data: base64});
              _this.tempBase64.push({name: headImg, data: base64});//赋值临时变量
            }, function (err) {
            });
          }
        })

      }
    },
    created() {
      this.initData()
    },
    beforeUpdate() {

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
    border-radius: 50%

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
    border-radius: 50%
  }

  .image-view .view {
    clear: both;
  }
</style>
