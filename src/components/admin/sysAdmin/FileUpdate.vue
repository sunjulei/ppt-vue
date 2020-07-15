<template>
  <div>
    <el-form :model="tableData" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

      <el-form-item label="标题" prop="title">
        <el-input v-model="tableData.title"></el-input>
      </el-form-item>

      <el-form-item label="所属菜单" prop="menu">
        <el-checkbox-group v-model="tableData.menu">
          <el-checkbox label="模板"></el-checkbox>
          <el-checkbox label="行业"></el-checkbox>
          <el-checkbox label="节日"></el-checkbox>
          <el-checkbox label="背景"></el-checkbox>
          <el-checkbox label="素材"></el-checkbox>
          <el-checkbox label="图表"></el-checkbox>
          <el-checkbox label="课件"></el-checkbox>
          <el-checkbox label="风格"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="作者" prop="author">
        <el-input v-model="tableData.author"></el-input>
      </el-form-item>

      <el-form-item label="文件说明" prop="fileDesc">
        <el-input type="textarea" v-model="tableData.fileDesc"></el-input>
      </el-form-item>

      <el-form-item label="页数" prop="pagNum">
        <el-input-number v-model="tableData.pagNum" :min="1" :max="100">
        </el-input-number>
      </el-form-item>

      <el-form-item label="标签" prop="tag">
        <el-input placeholder="每输入一个标签请加空格或换行" type="textarea" v-model="tableData.tag"></el-input>
      </el-form-item>

      <el-form-item label="状态" prop="state">
        <el-radio-group v-model="tableData.state">
          <el-radio label="待审核">待审核</el-radio>
          <el-radio label="通过">通过</el-radio>
          <el-radio label="拒绝">拒绝</el-radio>
        </el-radio-group>
      </el-form-item>

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

      <el-form-item label="详情图" prop="state" style="width: 100%">
        <div class="image-view">
          <div class="addbox"><input type="file" @change="getImgBaseDetail()" multiple="multiple">
            <div class="addbtn">+</div>
            <div class="item" v-for="(item, index) in imgBase64Detail">
              <viewer>
              <span class="cancel-btn"
                    @click="delImgDetail(index)">x</span>
                <img :src="item.data">
              </viewer>
            </div>
            <div class="itemBtn">
              <el-button @click="resetDetailImg" type="primary" icon="el-icon-refresh-right" circle></el-button>
            </div>
          </div>
        </div>
      </el-form-item>

      <el-form-item label="文件" prop="state" style="width: 30%;">
        <a target="_blank" :href="fileList[0].url" id="fileClick" style="display:none;"></a>
        <el-upload
          ref="upload"
          :data="{fileName:yuanName}"
          :auto-upload="false"
          class="upload-demo"
          :action="baseUrl+'/pptFile/uploadFile'"
          :on-preview="handlePreview"
          :before-remove="beforeRemove"
          :on-change="handleChange"
          :limit="1"
          :on-exceed="handleExceed"
          :file-list="fileList">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传PPT文件，且不超过20M</div>
        </el-upload>
      </el-form-item>

      <el-form-item label="视频" style="width: 30%;">
        <a target="_blank" :href="videoList[0].url" id="videoClick" style="display:none;"></a>
        <el-upload
          :data="{videoName:subVideoName+subVideoType}"
          name="video"
          ref="uploadVideo"
          :auto-upload="false"
          class="upload-demo"
          :action="baseUrl+'/pptFile/uploadVideo'"
          :on-preview="handlePreviewVideo"
          :before-remove="beforeRemoveVideo"
          :on-change="handleChangeVideo"
          :limit="1"
          :on-exceed="handleExceed"
          :file-list="videoList">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传视频文件,且不超过50MB</div>
        </el-upload>
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
    name: "FileUpdate",
    data() {
      return {
        videoList: [{name: '', url: ''}],
        subVideoName: '',
        subVideoNameTemp: '',
        subVideoType: '',
        videoSize: 0,
        fileList: [{name: '', url: ''}],
        fileSize: '',
        yuanType: '',
        yuanName: '',
        imgBase64: [],//存储封面 base64的值将值传给后端处理
        tempBase64: [],//封面临时变量 存储img base64的值
        imgBase64Detail: [],//存储详情图 base64的值将值传给后端处理
        tempBase64Detail: [],//详情图临时变量 存储img base64的值
        fileBase64: [],
        tempMenu: '',
        tableData: {
          id: '',
          name: '',
          downUrl: '',
          tag: '',
          title: '',
          type: '',
          menu: '',
          size: '',
          fileDesc: '',
          collectNum: '',
          downNum: '',
          pagNum: '',
          author: '',
          roughImgUrl: '',
          detailImgUrl: [],
          upData: '',
          videoUrl: '',
        },
        rules: {
          title: [
            {required: true, message: '请输入文件标题', trigger: 'blur'},
            {min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur'}
          ],
          author: [
            {required: true, message: '请输入作者账号', trigger: 'blur'},
            {min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur'}
          ],
          pagNum: [
            {required: true, message: '请输入文件页数', trigger: 'blur'}
          ],
          menu: [
            {type: 'array', required: true, message: '请至少选择一个所属菜单', trigger: 'change'}
          ],
          fileDesc: [
            {required: true, message: '请填写文件说明', trigger: 'blur'}
          ],
          tag: [
            {required: true, message: '请填写文件标签', trigger: 'blur'}
          ],
          state: [
            {required: true}
          ]
        },
      };
    },
    methods: {
      //菜单格式化
      menuFormat() {
        this.tempMenu = this.tableData.menu;
        this.tableData.menu = this.tableData.menu.toString();
      },

      //封面 获取图片base64实现预览
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
          var AllowImgFileSize = 2 * 1024 * 1024;    //上传图片最大值(单位字节)（ 2 M = 2097152 B ）
          if (AllowImgFileSize !== 0 && AllowImgFileSize < reader.result.length) {
            _this.$message({
              type: 'warning',
              title: '封面',
              message: '请上传不大于2M的封面！'
            });
            return;
          }
          if (_this.imgBase64.length >= 1) {
            _this.imgBase64.splice(0, 1);
          }
          _this.imgBase64.push({name: _this.generateUUID() + "." + type, data: e.target.result});
        }
        reader.readAsDataURL(file);
      },
      //封面 删除图片
      delImg(index) {
        if (this.imgBase64[0].name !== this.tempBase64[0].name) {

          this.imgBase64.splice(index, 1);
          this.imgBase64.push(this.tempBase64[0])

          this.$message.info({
            title: '封面',
            message: '已恢复默认封面！'
          });
        } else {
          this.$message.info({
            title: '封面',
            message: '务必保留一张封面！'
          });
        }

      },
      //提交封面
      submitRoughImg() {
        var _this = this;
        var rImgUrl = this.baseUrl + "/pptFile/upload"
        this.axios.post(rImgUrl, this.imgBase64).then(function (resp) {
          if (resp.data.code == 200) {
          } else {
          }
        })
        _this.tableData.roughImgUrl = "/pptImg/" + _this.imgBase64[0].name;
      },

      //详情图 获取图片base64实现预览
      getImgBaseDetail() {
        var _this = this;
        var event = event || window.event;
        let len = event.target.files.length;
        for (let i = 0; i < len; i++) {
          var file = event.target.files[i];
          var reader = new FileReader();
          //转base64
          reader.onload = function (e) {

            //判断格式
            var type = e.currentTarget.result;
            type = type.substring(type.indexOf("/") + 1, type.indexOf(";"));
            if (type !== "jpeg" && type !== "jpg" && type !== "png") {
              _this.$message({
                type: 'warning',
                title: '详情图',
                message: '详情图不支持该文件类型，仅支持jpg、png!'
              });
              return;
            }

            //判断大小
            var AllowImgFileSize = 2 * 1024 * 1024;    //上传图片最大值(单位字节)（ 2 M = 2097152 B ）
            if (AllowImgFileSize !== 0 && AllowImgFileSize < reader.result.length) {
              _this.$message({
                type: 'warning',
                title: '详情图',
                message: '请上传不大于2M的详情图！'
              });
              return;
            }
            _this.imgBase64Detail.push({name: _this.generateUUID() + "." + type, data: e.target.result});
          }
          reader.readAsDataURL(file);
        }
      },
      //详情图 删除图片
      delImgDetail(index) {
        this.imgBase64Detail.splice(index, 1);
      },
      //重置详情图
      resetDetailImg() {
        //清空原有数据
        this.imgBase64Detail = [];

        for (let i = 0; i < this.tempBase64Detail.length; i++) {
          this.imgBase64Detail.push(this.tempBase64Detail[i]);
        }
      },
      //提交详情图
      submitDetailImg() {
        var _this = this;
        var rImgUrl = this.baseUrl + "/pptFile/upload"
        this.axios.post(rImgUrl, this.imgBase64Detail);

        var temp = '';
        let imgLen = this.imgBase64Detail.length
        for (let i = 0; i < imgLen; i++) {
          if (i == imgLen - 1) {
            temp += "/pptImg/" + _this.imgBase64Detail[i].name;
          } else {
            temp += "/pptImg/" + _this.imgBase64Detail[i].name + "\n";
          }
        }
        _this.tableData.detailImgUrl = temp;
      },

      //提交文件和视频
      submitFile() {
        this.$refs.upload.submit();
        this.tableData.downUrl = "/pptFile/" + this.yuanName + this.yuanType;


        if (this.subVideoName == "") {
          this.tableData.videoUrl = "";
        } else {
          this.tableData.videoUrl = "/pptVideo/" + this.subVideoName + this.subVideoType;
          this.$refs.uploadVideo.submit();
        }

      },
      //文件大小
      handleChange(file, fileList) {
        this.fileSize = (file.size / (1024 * 1024)).toFixed(2) + "MB";
        var name = file.name;
        this.yuanType = name.substring(name.lastIndexOf("."));
      },
      //文件预览
      handlePreview(file) {
        document.getElementById("fileClick").click();
      },
      //文件超出
      handleExceed(files, fileList) {
        this.$message.warning("请先删除后再继续上传");
      },
      //文件移除
      beforeRemove(file, fileList) {
        this.fileSize = this.tableData.size
        this.yuanType = this.fileList[0].name.substring(this.fileList[0].name.indexOf("."));
        return this.$confirm(`确定移除 ${file.name}？`);
      },
      //选择视频
      handleChangeVideo(file, fileList) {
        this.videoSize = (file.size / (1024 * 1024));
        var type = file.name;
        this.subVideoType = type.substring(type.lastIndexOf("."));
        if (this.subVideoNameTemp == "") {
          this.subVideoName = this.generateUUID();
        } else {
          this.subVideoName = this.subVideoNameTemp;
        }
      },
      //视频移除
      beforeRemoveVideo(file, fileList) {
        this.subVideoName = ""
        return true;
      },
      //视频预览
      handlePreviewVideo(file) {
        document.getElementById("videoClick").click();
      },

      //构建uuid
      generateUUID() {
        var d = new Date().getTime();
        if (window.performance && typeof window.performance.now === "function") {
          d += performance.now(); //use high-precision timer if available
        }
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          var r = (d + Math.random() * 16) % 16 | 0;
          d = Math.floor(d / 16);
          return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid.replace("-", "");
      },
      //提交表单
      submitForm(formName) {
        let _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (_this.yuanType !== ".ppt" && _this.yuanType !== ".pptx") {
              _this.$message.warning("上传文件格式错误！");
              return false;
            }

            if (_this.subVideoName == "") {

            } else if (_this.subVideoType !== ".mp4" && _this.subVideoType !== ".webm" && _this.subVideoType !== ".ogg") {
              _this.$message.warning("当前只支持上传mp4、webm和ogg的视频格式");
              return false;
            }

            if (_this.videoSize > 50) {
              _this.$message.warning("上传视频必须小于50MB");
              return false;
            }

            this.tableData.size = this.fileSize;
            _this.submitFile();
            _this.menuFormat();
            _this.submitRoughImg();
            _this.submitDetailImg();

            var tableUrl = _this.baseUrl + '/pptFile/update'
            this.axios.put(tableUrl, _this.tableData).then(function (resp) {
              if (resp.data.code === 200) {
                _this.$message({
                  type: 'success',
                  message: '修改成功!'
                });
                _this.$router.push({
                  name: 'FileList'
                })
              } else {
                this.tableData.menu = this.tempMenu;
                _this.$message({
                  type: 'error',
                  message: resp.data.message
                });
              }
            })

          } else {
            this.tableData.menu = this.tempMenu;
            _this.$message({
              type: 'error',
              message: "请检查参数"
            });
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
    async created() {
      let _this = this;
      //初始化所有数据
      if (this.$route.query.tableData.id === undefined) {
        this.tableData = JSON.parse(localStorage.getItem("fileUpdate"))
      } else {
        this.tableData = this.$route.query.tableData;
      }

      //初始化大小
      this.fileSize = this.tableData.size;

      //初始化菜单
      var menuStr = this.tableData.menu;
      this.tableData.menu = menuStr.split(',');

      //初始化封面
      this.getBase64(this.baseUrl + this.tableData.roughImgUrl).then(function (base64) {
        var roughImgName = _this.tableData.roughImgUrl;
        // roughImgName = roughImgName.substring(roughImgName.indexOf("."));
        // _this.imgBase64.push({name: _this.generateUUID() + roughImgName, data: base64});
        roughImgName = roughImgName.substring(roughImgName.indexOf("pptImg") + 7);
        _this.imgBase64.push({name: roughImgName, data: base64});
        _this.tempBase64.push(_this.imgBase64[0]);//赋值临时变量
      }, function (err) {
      });

      //初始化详情图
      var tempImgDetail = this.tableData.detailImgUrl.split('\n');
      for (var i = 0; i < tempImgDetail.length; i++) {

        var imgName = tempImgDetail[i];
        imgName = imgName.substring(imgName.indexOf("pptImg") + 7);
        await this.getBase64(this.baseUrl + tempImgDetail[i]).then(function (base64) {
          _this.imgBase64Detail.push({name: imgName, data: base64});
          _this.tempBase64Detail.push({name: imgName, data: base64});
        }, function (err) {
        });
      }


      //初始化文件
      var tempFileName = this.tableData.downUrl;
      var type = this.tableData.downUrl;
      tempFileName = tempFileName.substring(tempFileName.indexOf("pptFile") + 8, tempFileName.lastIndexOf("."));
      type = type.substring(type.indexOf("."));
      this.yuanName = tempFileName;
      this.yuanType = type;
      this.fileList[0].name = tempFileName + type;
      this.fileList[0].url = this.baseUrl + this.tableData.downUrl;

      //初始化视频
      var videoUrlName = this.tableData.videoUrl;
      var vName = videoUrlName.substring(videoUrlName.indexOf("pptVideo") + 9, videoUrlName.lastIndexOf("."));
      this.subVideoName = vName + "";
      this.subVideoNameTemp = vName + "";
      this.subVideoType = videoUrlName.substring(videoUrlName.lastIndexOf("."));
      this.videoList[0].name = vName;
      this.videoList[0].url = this.baseUrl + this.tableData.videoUrl;


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
    height: 100px;
    width: 100px;
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
    width: 100px;
    height: 100px;
  }

  .image-view .view {
    clear: both;
  }
</style>
