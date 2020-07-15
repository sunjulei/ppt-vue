import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.Properties;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * @author sunlee
 */
public class ModifyConfigScript {

  /**
   * 读取文件内容
   *
   * @param filePath
   * @return
   **/
  public static String read(String filePath, String newApi) {
    BufferedReader br = null;
    String line = null;
    StringBuffer buf = new StringBuffer();

    try {
      // 根据文件路径创建缓冲输入流
      br = new BufferedReader(new FileReader(filePath));

      // 循环读取文件的每一行, 对需要修改的行进行修改, 放入缓冲对象中
      while ((line = br.readLine()) != null) {
        buf.append(line);
      }
      String content = buf.toString();
      String pattern = "prototype.baseUrl=\"(.*?)\"";
      Pattern r = Pattern.compile(pattern);
      Matcher m = r.matcher(content);
      newApi = String.format("prototype.baseUrl=\"%s\"", newApi);
      String result = m.replaceFirst(newApi);
      write(filePath, result);
    } catch (Exception e) {
      e.printStackTrace();
    } finally {
      // 关闭流
      if (br != null) {
        try {
          br.close();
        } catch (IOException e) {
          br = null;
        }
      }
    }

    return buf.toString();
  }

  /**
   * 将内容回写到文件中
   * @param filePath
   * @param content
   */
  public static void write(String filePath, String content) {
    BufferedWriter bw = null;

    try {
      // 根据文件路径创建缓冲输出流
      bw = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(new File(filePath)), StandardCharsets.UTF_8));
      // 将内容写入文件中
      bw.write(content);
      System.out.println("新apiUrl写入成功");
    } catch (Exception e) {
      System.out.println("新apiUrl写入失败");
      e.printStackTrace();
    } finally {
      // 关闭流
      if (bw != null) {
        try {
          bw.close();
        } catch (IOException e) {
          bw = null;
        }
      }
    }
  }

  /**
   * 主方法
   */
  public static void main(String[] args) throws IOException {

    //获取配置文件中的aipUrl
    Properties properties = new Properties();
    ClassLoader classLoader = ModifyConfigScript.class.getClassLoader();
    InputStream is = classLoader.getResourceAsStream("config.properties");
    properties.load(is);
    String aipUrl = properties.getProperty("apiUrl");
    System.out.println("需要修改的apiUrl：" + aipUrl);
    //找到待替换的文件
    File jsFile = new File(System.getProperty("user.dir"));
    jsFile= new File(jsFile.getParent() + "/js/");

    File tempFile;
    File[] filelist = jsFile.listFiles();
    for (int i = 0; i < filelist.length; i++) {
      tempFile = filelist[i];
      if (tempFile.getName().startsWith("app.") && tempFile.getName().endsWith(".js")) {
        System.out.println("找到待修改的文件：" + tempFile.getAbsolutePath());
        read(tempFile.getAbsolutePath(), aipUrl);//读取该文件
        return;
      } else if (filelist.length == i + 1) {
        System.out.println("找不到待修改的文件，请确保其存在");
      }
    }


  }

}
