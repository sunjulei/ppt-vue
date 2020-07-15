<template>
  <div style="text-align: center">
    <el-form style="width: 30%;margin-left: 33%" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

      <h2 style="margin-bottom: 30px">创建用户</h2>


      <el-form-item label="昵称" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>

      <el-form-item label="账号" prop="username">
        <el-input v-model="ruleForm.username"></el-input>
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
      </el-form-item>


      <el-form-item style="margin-top: 30px">
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: "UserAddOp",
    data() {
      var validatePass = (rule, value, callback) => {
        if (value.length<6){
          callback(new Error('密码不少于 6 位'));
        }
        else if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        ruleForm: {
          password: '',
          checkPass: '',
          name: '',
          username: '',
          role: 'member',
        },
        rules: {
          password: [
            { validator: validatePass, trigger: 'blur',required: true }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur',required: true, }
          ],
          name: [
            {required: true, message: '请输入昵称', trigger: 'blur'},
            {min: 3, max: 12, message: '昵称长度在 3 到 12 个字符', trigger: 'blur'}
          ],
          username: [
            {required: true, message: '请输入账号', trigger: 'blur'},
            {min: 6, max: 20, message: '账号长度在 6 到 20 个字符', trigger: 'blur'}
          ],
        }
      };
    },
    methods: {
      submitForm(formName) {
        let _this=this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var url=_this.baseUrl+"/register"
            _this.axios.post(url,_this.ruleForm).then(function (resp) {
              if (resp.data.code === 200) {
                _this.$message({
                  type: 'success',
                  message: "创建成功"
                });
                _this.$router.push({
                  name: 'UserListOp'
                });
              } else {
                _this.$message({
                  type: 'error',
                  message: "创建失败：" + resp.data.message
                });
              }
            })

          } else {
            _this.$message({
              type: 'error',
              message: "请检查参数"
            });
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },

    }
  }
</script>

<style scoped>

</style>
