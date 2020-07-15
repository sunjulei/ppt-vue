<template>
  <div>

    <div class="oths">
      <h3>投诉/建议</h3> <br>
      <p>
        如果您需要帮助或为网站提供建议的，欢迎在下方留言！也可以直接联系客服！
      </p>

      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

        <el-form-item label="主题" prop="subject">
          <el-input v-model="ruleForm.subject"></el-input>
        </el-form-item>

        <el-form-item label="详细说明" prop="detailDesc">
          <el-input v-model="ruleForm.detailDesc"></el-input>
        </el-form-item>

        <el-form-item label="联系方式">
          <el-input v-model="ruleForm.connectInfo"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: "HelpCenter",
    data() {
      return {
        ruleForm: {
          subject: '',
          detailDesc: '',
          connectInfo: '',
        },
        rules: {
          subject: [
            {required: true, message: '请输入主题', trigger: 'blur'},
            {min: 2, message: '长度至少为2', trigger: 'blur'}
          ],
          detailDesc: [
            {required: true, message: '请输入详细说明', trigger: 'blur'},
            {min: 5, message: '长度至少为5', trigger: 'blur'}
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        const _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var helpUrl = _this.baseUrl + "/helpSuggest/add"
            _this.axios.post(helpUrl, _this.ruleForm).then(function (resp) {
              if (resp.data.code === 200) {
                _this.$message({
                  type: 'success ',
                  message: '已提交成功!感谢您的建议！'
                });
                _this.$refs[formName].resetFields();
              } else {
                _this.$message({
                  type: 'error ',
                  message: '提交失败，请检查网络连接状态'
                });
              }
            })

          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    },
    created() {
      var id = this.$route.query.id
      var title = this.$route.query.title
      if (id != null) {
        var content = "标题：" + title + " | 编号：" + id
        this.ruleForm.subject = content;
      }
    }
  }
</script>

<style scoped>
  body {
    background: #f8fafc;
  }

  .oths {
    font-size: 20px;
    text-align: center;
    margin-top: 50px;
    margin-bottom: 180px;
  }
</style>
