<template>
  <div>
    <el-form :model="tableData" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

      <el-form-item label="封面" prop="state" style="width: 100%">
        <div class="image-view">
          <div class="addbox"><input type="file" @change="getImgBase()">
            <div class="addbtn">+</div>

            <div class="item" v-for="(item, index) in imgBase64">
              <span class="cancel-btn"
                    @click="delImg(index)">x</span>
              <viewer><img :src="item.data"></viewer>
            </div>
          </div>
        </div>
      </el-form-item>

      <el-form-item label="标签" prop="title">
        <el-input v-model="tableData.title"></el-input>
      </el-form-item>

      <el-form-item label="顺序" prop="bannerOrder">
        <el-input-number v-model="tableData.bannerOrder" :min="1" :max="999">
        </el-input-number>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">保存修改</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
  export default {
    name: "ActivityUpdate",
    data() {
      return {
        imgBase64: [],//存储封面 base64的值将值传给后端处理
        tempBase64: [],//封面临时变量 存储img base64的值
        tableData: {
          id: '',
          title: '',
          imgUrl: '',
          bannerOrder: '',
        },
        rules: {
          title: [
            {required: true, message: '请输入文件标签', trigger: 'blur'},
            {min: 1, max: 40, message: '长度在 1 到 40 个字符', trigger: 'blur'}
          ],
          bannerOrder: [
            {required: true, message: '请输入横幅的顺序', trigger: 'blur'}
          ],
          state: [],
        },
        yuanName: '',
        yuanType: ''
      };
    },
    methods: {
      //横幅 获取图片base64实现预览
      getImgBase() {
        var _this = this;
        var event = event || window.event;
        var file = event.target.files[0];
        var reader = new FileReader();
        //转base64
        reader.onload = function (e) {

          //判断格式
          var type = e.currentTarget.result;
          type = type.substring(type.indexOf("/") + 1, type.indexOf(";"));
          if (type !== "jpeg" && type !== "jpg" && type !== "png") {
            _this.$message({
              type: 'warning',
              title: '封面',
              message: '封面不支持该文件类型，仅支持jpg、png!'
            });
            return;
          }

          //判断大小
          var AllowImgFileSize = 5 * 1024 * 1024;    //上传图片最大值(单位字节)（ 2 M = 2097152 B ）
          if (AllowImgFileSize !== 0 && AllowImgFileSize < reader.result.length) {
            _this.$message({
              type: 'warning',
              title: '封面',
              message: '请上传不大于5M的横幅！'
            });
            return;
          }
          if (_this.imgBase64.length >= 1) {
            _this.imgBase64.splice(0, 1);
          }
          _this.imgBase64.push({name: _this.yuanName + "." + type, data: e.target.result});
        }
        reader.readAsDataURL(file);
      },
      //横幅 删除图片
      delImg(index) {
        if (this.imgBase64[0].name !== this.tempBase64[0].name) {

          this.imgBase64.splice(index, 1);
          this.imgBase64.push(this.tempBase64[0])

          this.$message.info({
            title: '横幅',
            message: '已恢复默认横幅！'
          });
        } else {
          this.$message.info({
            title: '横幅',
            message: '务必保留一张横幅！'
          });
        }

      },
      //提交横幅
      async submitBannerImg() {
        var imgUrl = this.baseUrl + "/indexBanner/upload"
        await this.axios.post(imgUrl, this.imgBase64)
      },

      //提交表单
      submitForm(formName) {
        let _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {

            _this.submitBannerImg();

            _this.tableData.imgUrl = "/pptImg/banner/" + _this.imgBase64[0].name;
            var tableUrl = _this.baseUrl + '/indexBanner/update'
            this.axios.post(tableUrl, _this.tableData).then(function (resp) {
              if (resp.data.code === 200) {
                _this.$message({
                  type: 'success',
                  message: '修改成功!'
                });
                _this.$router.push({
                  name: 'ActivityFile'
                })
              } else {
                _this.$message({
                  type: 'error',
                  message: resp.data.message
                });
              }
            })

          } else {
            alert('error submit!!');
            return false;
          }
        });
      },
      //重置
      resetForm(formName) {
        window.location.reload();
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
      }
    },
    created() {
      let _this = this;
      //初始化所有数据
      if (this.$route.query.tableData.id === undefined) {
        this.tableData = JSON.parse(localStorage.getItem("bannerUpdate"))
      } else {
        this.tableData = this.$route.query.tableData;
      }


      //初始化封面
      this.getBase64(this.baseUrl + this.tableData.imgUrl).then(function (base64) {
        var bannerImg = _this.tableData.imgUrl;
        //只有图片名没有类型（.xxx）
       var bannerImgName = bannerImg.substring(bannerImg.indexOf("banner") + 7,bannerImg.lastIndexOf("."));
       var bannerImgType=bannerImg.substring(bannerImg.lastIndexOf("."));
        _this.yuanName = bannerImgName;
        _this.yuanType = bannerImgType;
        _this.imgBase64.push({name: bannerImgName+bannerImgType, data: base64});
        _this.tempBase64.push(_this.imgBase64[0]);//赋值临时变量
      }, function (err) {
      });
    },
    mounted() {
    },
  }
</script>

<style>
  .el-upload input {
    display: none;
  }

  * {
    padding: 0;
  }

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
    height: 100px;
    width: 100px;
    opacity: 0;
  }

  .image-view .addbox .addbtn {
    float: left;
    height: 100px;
    width: 100px;
    line-height: 100px;
    color: #fff;
    font-size: 40px;
    background: #ccc;
    border-radius: 10px;

  }

  .image-view .item {
    position: relative;
    float: left;
    width: 200px;
    height: 100px;
    margin: 0 0 10px 10px;
  }

  .itemBtn {
    text-align: center;
    float: left;
    margin: 10% 10px;
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
    width: 200px;
    height: 100px;
  }

  .image-view .view {
    clear: both;
  }
</style>
