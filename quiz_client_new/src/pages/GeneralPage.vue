<template>
  <Tabs value="general" class="container">
    <TabPane label="总体概况" name="general" class="gen-layout">
      <div class="gen-pie-part">
        <Card style="height: 100%" dis-hover>
          <PieChart radius="60%" :category="category" :datas="genDatas" />
        </Card>
      </div>
      <div class="gen-line-part">
        <div class="gen-line-chart line-1">
          <Card style="height: 100%" dis-hover>
            <LineChart
              title="近一周的背题情况"
              :datas="weekDatas"
              :category="weekCategory"
            />
          </Card>
        </div>
        <div class="gen-line-chart line-2">
          <Card style="height: 100%" dis-hover>
            <LineChart
              title="近30天的背题情况"
              :datas="monthDatas"
              :category="monthCategory"
            />
          </Card>
        </div>
      </div>
    </TabPane>
    <TabPane label="题库概况" name="repo_general">
      <Dropdown style="margin-left: 20px">
        <Button type="primary">
          选择题库
          <Icon type="ios-arrow-down"></Icon>
        </Button>
        <template #list>
          <DropdownMenu>
            <DropdownItem>题库一</DropdownItem>
            <DropdownItem>题库二</DropdownItem>
          </DropdownMenu>
        </template>
      </Dropdown>
      <div class="charts">
        <div class="repo-pie">
          <PieChart radius="60%" :category="category" :datas="genDatas" />
        </div>
        <div class="repo-detail">
        <UnitChart :datas="unitDatas" :UnitOnClick="toNewQuiz" width="100%" height="100%" />
        </div>
      </div>
    </TabPane>
  </Tabs>
</template>

<script>
import PieChart from "../components/PieChart.vue";
import LineChart from "../components/LineChart.vue";
import UnitChart from "../components/UnitChart.vue";

export default {
  name: "GeneralPage",
  components: {
    PieChart,
    LineChart,
    UnitChart,
  },
  data() {
    return {
      category: ["已熟悉", "已理解", "不理解", "未知"],
      weekCategory: ["周六", "周日", "周一", "周二", "周三", "周四", "周五"],
      monthCategory: [
        "9.28",
        "9.28",
        "9.28",
        "9.28",
        "9.29",
        "9.28",
        "9.28",
        "9.28",
        "9.28",
        "9.29",
        "9.28",
        "9.28",
        "9.28",
        "9.28",
        "9.29",
        "9.28",
        "9.28",
        "9.28",
        "9.28",
        "9.29",
      ],
      genDatas: [
        {
          name: "已熟悉",
          value: 30,
        },
        {
          name: "已理解",
          value: 220,
        },
        {
          name: "不理解",
          value: 10,
        },
        {
          name: "未知",
          value: 300,
        },
      ],
      weekDatas: [20, 50, 0, 0, 35, 0, 0],
      monthDatas: [
        10, 20, 60, 50, 80, 60, 40, 50, 20, 30, 10, 20, 60, 50, 80, 60, 40, 50,
        20, 30,
      ],
      unitDatas: [
        {
          id: 4,
          repoId: 2,
          question: "JavaScript有哪些数据类型",
          answer:
            '<p><span style="font-size: 16px">基本数据类型：Undefined、Null、Boolean、Number、String、Symbol、BigInt</span></p><p style="text-align: left"><span style="font-size: 16px">引用数据类型：Object</span></p><p style="text-align: left"></p><p style="text-align: left"><span style="font-size: 16px">拓展题：</span></p><p style="text-align: left"><span style="font-size: 16px">typeof(undefined + 1) //NaN,因为undefined在尝试转换数值类型时会变成NaN</span></p><p style="text-align: left"><span style="font-size: 16px">typef(null) //object</span></p><p style="text-align: left"><span style="font-size: 16px">typefof(NaN) //Number</span></p>',
          references: "",
          importance: "重要",
          level: "已熟悉",
          remCount: 0,
          last_time: "2022-09-26T11:17:08.000Z",
          destroy_time: null,
          tags: ["javascript"],
          repoName: "前端",
        },
        {
          id: 5,
          repoId: 2,
          question: "判断数组的方式有哪些",
          answer:
            '<p><span style="font-size: 16px">方式一：利用es6的Array.isArray方法</span></p><p><span style="font-size: 16px">方式二：通过instanceof Array判断</span></p><p><span style="font-size: 16px">方式三：使用Object.prototype.toString().call()方法来判断</span></p><p><span style="font-size: 16px">方法四：使用Array.prototype.isPrototypeOf(arr)来判断，isPrototypeOf() 方法用于测试一个对象是否存在于另一个对象的原型链上。</span></p><p><span style="font-size: 16px">方法五：使用实例身上的constructor方法来判断</span></p><p><strong><span style="font-size: 16px">注意，不要写typeof！</span></strong></p>',
          references:
            "[视频](https://www.bilibili.com/video/BV1ZY4y1L7am?p=31&vd_source=e5bdcaeea2066e6b5c93b327c2391508)",
          importance: "重要",
          level: "不理解",
          remCount: 0,
          last_time: "2022-09-26T11:19:16.000Z",
          destroy_time: null,
          tags: ["javascript"],
          repoName: "前端",
        },
        {
            "id": 6,
            "repoId": 2,
            "question": "null和undefined的区别",
            "answer": "<p>js在设计之初时，是只有null的，当时js作者是参考了java，把null设计成一个空对象，也参考了一点C语言，null会被隐式转换为0。但后来作者认为表示“无”的值不应该是一个对象而应该是一个基本数据类型，另外，null会自动转换为0的特点有点阻碍js初期的设计，因为js初期是没有错误捕获机制的，当发生数据类型不匹配时，要么是隐式转换，要么就是失败，关键这个错误还不容易被发现，所以就诞生了undefined，也就是说，undefined的出现是为了弥补null这个东西所存在的问题。</p><p style=\"text-align: left\">undefined在进行数字类型的转换时，会隐式转换为NaN，那么就可以避免掉一些不容易发现的错误。</p>",
            "references": "[视频](https://www.bilibili.com/video/BV1ZY4y1L7am?p=25&vd_source=e5bdcaeea2066e6b5c93b327c2391508)",
            "importance": "理解",
            "level": "未知",
            "remCount": 0,
            "last_time": "2022-09-26T07:29:30.000Z",
            "destroy_time": null,
            "tags": [
                "javascript"
            ],
            "repoName": "javascript常见面试题"
        },
        {
            "id": 7,
            "repoId": 2,
            "question": "如何获取安全的undefined值",
            "answer": "<p>undefined在js中不是一个保留字，所以你可以把undefined作为一个变量名，但这样就会出现如何获取安全的undefined值这个问题，所以变量名能不取undefined就不取，但如果这个问题真的出现，那么可以通过void(0)来获取到undefined的值</p>",
            "references": "",
            "importance": "了解",
            "level": "已理解",
            "remCount": 0,
            "last_time": "2022-09-26T07:38:44.000Z",
            "destroy_time": null,
            "tags": [
                "javascript"
            ],
            "repoName": "javascript常见面试题"
        },
                {
          id: 4,
          repoId: 2,
          question: "JavaScript有哪些数据类型",
          answer:
            '<p><span style="font-size: 16px">基本数据类型：Undefined、Null、Boolean、Number、String、Symbol、BigInt</span></p><p style="text-align: left"><span style="font-size: 16px">引用数据类型：Object</span></p><p style="text-align: left"></p><p style="text-align: left"><span style="font-size: 16px">拓展题：</span></p><p style="text-align: left"><span style="font-size: 16px">typeof(undefined + 1) //NaN,因为undefined在尝试转换数值类型时会变成NaN</span></p><p style="text-align: left"><span style="font-size: 16px">typef(null) //object</span></p><p style="text-align: left"><span style="font-size: 16px">typefof(NaN) //Number</span></p>',
          references: "",
          importance: "重要",
          level: "已熟悉",
          remCount: 0,
          last_time: "2022-09-26T11:17:08.000Z",
          destroy_time: null,
          tags: ["javascript"],
          repoName: "前端",
        },
        {
          id: 5,
          repoId: 2,
          question: "判断数组的方式有哪些",
          answer:
            '<p><span style="font-size: 16px">方式一：利用es6的Array.isArray方法</span></p><p><span style="font-size: 16px">方式二：通过instanceof Array判断</span></p><p><span style="font-size: 16px">方式三：使用Object.prototype.toString().call()方法来判断</span></p><p><span style="font-size: 16px">方法四：使用Array.prototype.isPrototypeOf(arr)来判断，isPrototypeOf() 方法用于测试一个对象是否存在于另一个对象的原型链上。</span></p><p><span style="font-size: 16px">方法五：使用实例身上的constructor方法来判断</span></p><p><strong><span style="font-size: 16px">注意，不要写typeof！</span></strong></p>',
          references:
            "[视频](https://www.bilibili.com/video/BV1ZY4y1L7am?p=31&vd_source=e5bdcaeea2066e6b5c93b327c2391508)",
          importance: "重要",
          level: "不理解",
          remCount: 0,
          last_time: "2022-09-26T11:19:16.000Z",
          destroy_time: null,
          tags: ["javascript"],
          repoName: "前端",
        },
        {
            "id": 6,
            "repoId": 2,
            "question": "null和undefined的区别",
            "answer": "<p>js在设计之初时，是只有null的，当时js作者是参考了java，把null设计成一个空对象，也参考了一点C语言，null会被隐式转换为0。但后来作者认为表示“无”的值不应该是一个对象而应该是一个基本数据类型，另外，null会自动转换为0的特点有点阻碍js初期的设计，因为js初期是没有错误捕获机制的，当发生数据类型不匹配时，要么是隐式转换，要么就是失败，关键这个错误还不容易被发现，所以就诞生了undefined，也就是说，undefined的出现是为了弥补null这个东西所存在的问题。</p><p style=\"text-align: left\">undefined在进行数字类型的转换时，会隐式转换为NaN，那么就可以避免掉一些不容易发现的错误。</p>",
            "references": "[视频](https://www.bilibili.com/video/BV1ZY4y1L7am?p=25&vd_source=e5bdcaeea2066e6b5c93b327c2391508)",
            "importance": "理解",
            "level": "未知",
            "remCount": 0,
            "last_time": "2022-09-26T07:29:30.000Z",
            "destroy_time": null,
            "tags": [
                "javascript"
            ],
            "repoName": "javascript常见面试题"
        },
        {
            "id": 7,
            "repoId": 2,
            "question": "如何获取安全的undefined值",
            "answer": "<p>undefined在js中不是一个保留字，所以你可以把undefined作为一个变量名，但这样就会出现如何获取安全的undefined值这个问题，所以变量名能不取undefined就不取，但如果这个问题真的出现，那么可以通过void(0)来获取到undefined的值</p>",
            "references": "",
            "importance": "了解",
            "level": "已理解",
            "remCount": 0,
            "last_time": "2022-09-26T07:38:44.000Z",
            "destroy_time": null,
            "tags": [
                "javascript"
            ],
            "repoName": "javascript常见面试题"
        },
      ],
    };
  },
  methods: {
    toNewQuiz(i){
      this.$router.push({
        name:'newquiz',
        params:{
          id:this.unitDatas[i].id,
          question:this.unitDatas[i].question,
          answer:this.unitDatas[i].answer,
          references:this.unitDatas[i].references,
          tags:this.unitDatas[i].tags,
          repoName:this.unitDatas[i].repoName,
          importance:this.unitDatas[i].importance
        }
      })
      this.$store.dispatch('setMenuItemDelay','newquiz');
    }
  },
  mounted() {},
};
</script>

<style scoped lang="less">

@card-padding: 5px;

.container {
  height: 80vh;
  margin-bottom: 20px;
  /deep/ .ivu-tabs-content {
    height: calc(100% - 37px);

    .gen-layout {
      height: 100%;
      display: flex;

      .gen-pie-part {
        flex: 3.5;
        padding: @card-padding;

        .ivu-card-body /deep/ {
          height: 100%;
        }
      }

      .gen-line-part {
        flex: 6.5;
        padding: @card-padding;
        display: flex;
        flex-direction: column;
        align-items: stretch;

        .gen-line-chart {
          flex: 1;
        }

        .line-1 {
          padding-bottom: @card-padding;
          .ivu-card-body /deep/ {
            height: 100%;
          }
        }

        .line-2 {
          padding-top: @card-padding;
          .ivu-card-body /deep/ {
            height: 100%;
          }
        }
      }
    }
  }
}

.charts {
  height: 30%;
  margin-top: 15px;
  display: flex;

  .repo-pie{
    flex: 3;
    padding: @card-padding;
  }

  .repo-detail{
    flex: 7;
    padding: @card-padding;
  }
}
</style>
