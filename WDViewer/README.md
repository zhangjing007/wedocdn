# 一、导航地图

## 1.拓展地址

```json
// 即将开放
```

## 2.使用方法

```javascript
// 注意：该拓展会自动过滤掉标高名称中带s的标高！！！
// 步骤一：引入拓展模块
import "xxx/viewing.Extension.NavMap/NavMap.min";
// 或者
require("xxx/viewing.Extension.NavMap/NavMap.min");

// 步骤二：使用拓展
// 方法一：初始化viewer时，以拓展的方式加载
config = {
  extensions: ["VE.Minimap3DExtension"],
};

// 方法二：在任何需要的时机，实时加载拓展
viewer.loadExtension("VE.Minimap3DExtension", {}).then((e) => {
  console.log(e);
});
```

# 二、标高测量

## 1.拓展地址

```json
// 即将开放
```

## 2.使用方法

```javascript
// 步骤一：引入拓展模块
import "xxx/viewing.Extension.ElevationSurvey/index";
// 或者
require("xxx/viewing.Extension.ElevationSurvey/index");

// 步骤二：使用拓展
// 方法一：初始化 viewer 时，以拓展的方式加载
config = {
  extensions: ["VE.Elevation.Survey"],
};

// 方法二：在任何需要的时机，实时加载拓展
viewer.loadExtension("VE.Elevation.Survey", {}).then((e) => {
  console.log(e);
});
```

# 三、楼层管理

## 1.拓展地址

```json
// 即将开放
```

## 2.使用方法

```javascript
// 步骤一：引入拓展模块
import "xxx/viewing.Extension.FloorManager/index";
// 或者
require("xxx/viewing.Extension.FloorManager/index");

// 步骤二：使用拓展
// 方法一：初始化 viewer 时，以拓展的方式加载
config = {
  extensions: ["VE.Floor.Manager"],
};

// 方法二：在任何需要的时机，实时加载拓展
viewer.loadExtension("VE.Floor.Manager", {}).then((e) => {
  console.log(e);
});
```

# 四、系统分类

## 1.拓展地址

```json
// 即将开放
```

## 2.使用方法

```javascript
// 步骤一：引入拓展模块
import "xxx/viewing.Extension.IsolateByDiscipline/index";
// 或者
require("xxx/viewing.Extension.IsolateByDiscipline/index");

// 步骤二：使用拓展
// 方法一：初始化 viewer 时，以拓展的方式加载
config = {
  extensions: ["VE.Isolate.By.Discipline"],
};

// 方法二：在任何需要的时机，实时加载拓展
viewer.loadExtension("VE.Isolate.By.Discipline", {}).then((e) => {
  console.log(e);
});
```

# 五、快速选择

## 1.拓展地址

```json
// 即将开放
```

## 2.使用方法

```javascript
// 步骤一：引入拓展模块
import "xx/viewing.Extension.QuickSelection/index";
// 或者
require("xx/viewing.Extension.QuickSelection/index");

// 步骤二：使用拓展
// 方法一：初始化 viewer 时，以拓展的方式加载
config = {
  extensions: ["VE.Quick.Selection"],
};

// 方法二：在任何需要的时机，实时加载拓展
viewer.loadExtension("VE.Quick.Selection", {}).then((e) => {
  console.log(e);
});
```

# 六、模型变换

## 1.拓展地址

```json
// 即将开放
```

## 2.使用方法

```javascript
// 步骤一：引入拓展模块
import "xxx/viewing.Extension.Transform/index";
// 或者
require("xxx/viewing.Extension.Transform/index");

// 步骤二：使用拓展
// 方法一：初始化 viewer 时，以拓展的方式加载
config = {
  extensions: ["viewing.Extension.Transform"],
};

// 方法二：在任何需要的时机，实时加载拓展
viewer.loadExtension("viewing.Extension.Transform", {}).then((e) => {
  console.log(e);
});
```

# 七、产品列表

## 1.拓展地址

```json
// 即将开放
```

## 2.使用方法

```javascript
// 即将开放
// 步骤一：引入拓展模块
import "xxx/viewing.Extension.VisualClusters/index";
// 或者
require("xxx/viewing.Extension.VisualClusters/index");

// 步骤二：使用拓展
// 方法一：初始化 viewer 时，以拓展的方式加载
config = {
  extensions: ["VE.VisualClusters"],
};

// 方法二：在任何需要的时机，实时加载拓展
viewer.loadExtension("VE.VisualClusters", {}).then((e) => {
  console.log(e);
});

/** 获取构件分类的使用说明 **/
// 方式一 viwer 加载模型时加载此插件
// 可通过以下方式获取到每一个模型中的构件分类和数量等
viewer.loadedExtensions["VE.VisualClusters"].on(
  "productList",
  function (models) {
    models.forEach((model) => {
      console.log(model.productList);
    });
  }
);

// 方式二 使用 viewer.loadExtension 手动加载插件
// 可通过以下方式获取到每一个模型中的构件分类和数量等
viewer.loadExtension("VE.VisualClusters", {}).then((e) => {
  console.log(
    e.on("productList", function (models) {
      models.forEach((model) => {
        console.log(model.productList);
      });
    })
  );
});

/** 点击具体类型的后的事件监听 使用说明 **/
// 方式一 viwer 加载模型时加载此插件
res.oViewer.loadedExtensions["VE.VisualClusters"].gizmoController.on(
  "typeItemClick",
  function (params) {
    let { category, type, event } = params;
    console.log(category, type, event);
  }
);
// 方式二 使用 viewer.loadExtension 手动加载插件
viewer.loadExtension("VE.VisualClusters", {}).then((e) => {
  e.gizmoController.on("typeItemClick", function (params) {
    let { category, type, event } = params;
    console.log(category, type, event);
  });
});
```

# 八、审阅标注

## 1.拓展地址

```json
// 即将开放
```

## 2.使用方法

```javascript
// 步骤一：引入拓展模块
import "xxx/viewing.Extension.Marker/markerExtension";
// 或者
require("xxx/viewing.Extension.Marker/markerExtension");

// 步骤二：使用拓展
// 方法一：初始化 viewer 时，以拓展的方式加载
config = {
  extensions: ["VE.Markers"],
};

// 方法二：在任何需要的时机，实时加载拓展
viewer.loadExtension("VE.VisualClusters", {}).then((e) => {
  console.log(e);
});

// 接口
res.oViewer.loadExtension("VE.Markers", {}).then((e) => {
  // 监听显示或隐藏标注事件
  e.on("showOrHideMarkers", (isShowDatas) => {
    alert("结合业务，显示数据");
    console.log("结合业务，显示数据", isShowDatas);
  });
  // 监听保存按钮的点击事件
  e.on("saveMakers", (exportObject) => {
    console.log(exportObject);
  });
});
```