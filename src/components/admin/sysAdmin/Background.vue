<template>
  <div>
    <!--表格-->

    <el-table
      :stripe="true"
      :highlight-current-row="true"
      :data="bgImgData">

      <el-table-column
        align="center"
        label="类型">
        <template slot-scope="scope">
          <span>{{ scope.row.imgType }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="封面">
        <template slot-scope="scope">
          <viewer :image="baseUrl+scope.row.imgUrl">
            <img
              style="width: 160px; height: 100px"
              :src="baseUrl+scope.row.imgUrl">
          </viewer>
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


    <el-dialog :title="'编辑：'+subData.imgType" :visible.sync="dialogFormVisible">
      <el-form :model="subData" ref="subData" class="demo-ruleForm">

        <el-form-item label="背景">
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
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="editOk('subData')">确 定</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>
  </div>

</template>

<script>

  export default {
    name: "Background",
    data() {
      return {
        bgImgData: [
          {
            id: '',
            imgType: '',
            imgUrl: '',
          }
        ],
        subData: {
          id: '',
          imgType: '',
          imgUrl: '',
        },
        dialogFormVisible: false,
        imgBase64: [],//存储封面 base64的值将值传给后端处理
        tempBase64: [],//封面临时变量 存储img base64的值
      }
    },
    methods: {
      //表格右侧编辑
      async handleEdit(index, row) {
        let _this = this;
        this.subData.id = row.id;
        this.subData.imgUrl = row.imgUrl;
        this.subData.imgType = row.imgType;
        this.dialogFormVisible = true;


        //初始化背景
        await this.getBase64(this.baseUrl + row.imgUrl).then(function (base64) {
          var img = row.imgUrl;
          img = img.substring(img.indexOf("bgImg") + 6);
          _this.imgBase64=[]
          _this.imgBase64.push({name: img, data: base64});
          _this.tempBase64.push(_this.imgBase64[0]);//赋值临时变量
        }, function (err) {
        });
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
      //背景 获取图片base64实现预览
      getHeadImgBase() {
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
              title: '背景',
              message: '背景不支持该文件类型，仅支持jpg、png!'
            });
            return;
          }

          //判断大小
          var AllowImgFileSize = 2 * 1024 * 1024;    //上传图片最大值(单位字节)（ 2 M = 2097152 B ）
          if (AllowImgFileSize !== 0 && AllowImgFileSize < reader.result.length) {
            _this.$message({
              type: 'warning',
              title: '背景',
              message: '请上传不大于2M的背景！'
            });
            return;
          }
          if (_this.imgBase64.length >= 1) {
            _this.imgBase64.splice(0, 1);
          }
          var img= _this.subData.imgUrl;
          img = img.substring(img.indexOf("bgImg") + 6);
          _this.imgBase64.push({name:img, data: e.target.result});
        }
        reader.readAsDataURL(file);
      },
      //背景 删除图片
      delHeadImg(index) {
        // if (this.imgBase64[0].name !== this.tempBase64[0].name) {

        this.imgBase64.splice(index, 1);
        this.imgBase64.push(this.tempBase64[0])

        this.$message.info({
          title: '背景',
          message: '已恢复默认背景！'
        });

      },
      editOk(formName) {
        let _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.dialogFormVisible = false;

            var imgUrl = this.baseUrl + "/background/upload"
            this.axios.post(imgUrl, this.imgBase64);

            var updateUrl = this.baseUrl + "/background/update"
            this.axios.put(updateUrl, this.subData).then(function (resp) {
              if (resp.data.code === 200) {
                _this.$message({
                  offset: 80,
                  title: '修改背景',
                  message: '背景修改成功！',
                  type: 'success'
                });
                window.location.reload()
              } else {
                _this.$message({
                  offset: 80,
                  title: '修改背景',
                  message: '背景修改失败！',
                  type: 'error'
                });
              }
            })
          } else {
            _this.$message({
              offset: 80,
              title: '修改背景',
              message: '修改背景发送错误！',
              type: 'warning'
            });
            return false;
          }
        });


      },
    },
    created() {
      let _this = this;
      var url = this.baseUrl + "/background/findAll"
      this.axios.get(url).then(function (resp) {
        _this.bgImgData = resp.data
      })


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
