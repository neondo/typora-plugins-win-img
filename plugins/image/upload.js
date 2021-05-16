(function ($) {
    // 配置信息
    var setting = {
        //==============重要说明==============
        //文件上传到哪里，取值有：self/tencent/aliyun/upyun/qiniu/github/gitee
        //self指自建的服务器
        //tencent指腾讯云的COS
        //aliyun指阿里云OSS
        //upyun指又拍云（目前暂不支持，sdk弄了半天没好）
        //qiniu指七牛云
        //github 默认上传到github
        //gitee码云
        target : "github",
        //图片压缩开关，1表示原图上传 取值为：0<quality<=1，如果要压缩推荐 0.7
        quality: 1,
        //target=self 时涉及的配置参数
        self   : {
            url    : "http://tools.jiebianjia.com/typora/upload.html",
            //自定义请求头，做校验，防止其他人随意调接口
            headers: {
                token: "B40289FC92ED660F433BF0DB01577FDE"
            }
        },
        //target=tencent 时涉及的配置参数
        tencent: {
            // 关于腾讯云COS的介绍文档：https://cloud.tencent.com/document/product/436
            // 下面的 SecretId、SecretKey 强烈不建议用你腾讯云主账号的key ，创建一个子用户仅授予API的cos权限
            // 添加子用户链接：https://console.cloud.tencent.com/cam
            // 更多关于腾讯云子用户的介绍：https://cloud.tencent.com/document/product/598/13665
            // 必须参数，如果你有自己的腾讯云COS改成自己的配置
            Bucket   : "jiebianjia-1252439934",                    // 对象存储->存储桶列表(存储桶名称就是Bucket)
            SecretId : "111111111111111111111111111111111111",   // 访问控制->用户->用户列表->用户详情->API密钥 下查看
            SecretKey: "11111111111111111111111111111111",      // 访问控制->用户->用户列表->用户详情->API密钥 下查看
            Region   : "ap-guangzhou",                             // 对象存储->存储桶列表(所属地域中的英文就是Region)
            Folder   : "typora"                                   // 可以把上传的图片都放到这个指定的文件夹下
        },
        //target=aliyun 时涉及的配置参数
        aliyun : {
            // 必须参数，如果你有自己的阿里云OSS改成自己的配置
            SecretId    : "111111111111111111111111",               // 需要先创建 RAM 用户，同时访问方式选择“编程访问”，详细帮助文档：https://help.aliyun.com/document_detail/28637.html
            SecretKey   : "111111111111111111111111111111",        // 只想说阿里的这个RAM做的还真的有点难以理解和使用
            Folder      : "typora",                                   // 可以把上传的图片都放到这个指定的文件夹下
            BucketDomain: "http://jiebianjia.oss-cn-shenzhen.aliyuncs.com/" // 存储空间下有个：Bucket 域名 挑一个就好了 注意：末尾的'/'不可省略，否则将导致typora无法浏览上传成功的图片
        },
        //target=upyun 时涉及的配置参数
        upyun  : {
            // 必须参数，如果你有自己的阿里云OSS改成自己的配置
            Username: "typora",                              // 用户名
            Password: "11111111111111111111111111111111",    // 密码
            Folder  : "typora",                                // 可以把上传的图片都放到这个指定的文件夹下
            Bucket  : "jiebianjia",                           // 存储桶 或者又叫服务名称
            Domain  : "http://v0.api.upyun.com/"             // 智能选路（官方推荐，一般不用改）
        },
        //target=qiniu 时涉及的配置参数
        qiniu  : {
            UploadDomain: "https://upload-z2.qiniup.com",               // 上传地址，需要根据你存储空间所在位置选择对应“客户端上传”地址 详细说明：https://developer.qiniu.com/kodo/manual/1671/region-endpoint
            AccessDomain: "http://q1701tver.bkt.clouddn.com/",          // 上传后默认只会返回相对访问路径，需要设置好存储空间的访问地址。进入“文件管理”下面可以看到个“外链域名”就是你的地址了。注意保留前面的：http://，以及后面的：/
            AccessKey   : "1111111111111111111111111111111111111111",     // AK通过“密钥管理”页面可以获取到，地址：https://portal.qiniu.com/user/key
            SecretKey   : "1111111111111111111111111111111111111111",      // SK通过“密钥管理”页面可以获取到，地址：https://portal.qiniu.com/user/key
            Folder      : "typora",                                           // 可以把上传的图片都放到这个指定的文件夹下
            policyText  : {
                scope   : "jiebianjia",                                    // 对象存储->空间名称，访问控制记得设置成公开
                deadline: 225093916800                                 // 写死了：9102-12-12日，动态的好像偶尔会签名验不过
            }
        },
        //target=github 时涉及的配置参数
        github : {
            Token         : "efa094:55d913656:3de0d371bd4:26a589d5a17e12".replace(/:/g, ""), // 添加一个仅给typora使用的token 授予最小的权限（repo.public_repo） ，添加token：https://github.com/settings/tokens(折腾是因为github检测到token后会自动失效)
            CommitterName : "Thobian",                          // 提交人昵称，写你github的昵称
            CommitterEmail: "suixinsuoyu1hao@gmail.com",       // 提交人邮箱，写你github的邮箱
            Repository    : "Thobian/typora-image",                // github项目名，比如你的项目地址是：https://github.com/Thobian/typora-image  那就是后面的“Thobian/typora-image”
            Filepath      : "demo/",                                 // 图片在项目中的保存目录，可以不用提前创建目录，github提交时发现没有会自动创建，后面的 / 不能少
            jsDelivrCND   : false                                // 是否开启GitHub图片走镜像，国内有时候访问不太方便。【注意：开启CDN后会将原github的文件地址换成 jsDelivr 的地址，如出现镜像出现国内无法访问，或者不再继续运营你的图片也将不能访问到，请谨慎开启该功能】
        },
        //target=gitee 时涉及的配置参数
        gitee  : {
            message     : "From:https://github.com/Thobian",     // 必须参数,提交消息（默认为：add image）
            branch      : "master",                               // 要提交到的分支（默认为：master）
            token       : "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",   // 码云token申请地址 https://gitee.com/profile/personal_access_tokens
            userName    : "userName",                           // 用户名 比如你的gitee个人主页地址是：https://gitee.com/thobian ，那userName就是：thobian
            repositorie : "repositorie",                     // 仓库名 比如你的gitee图片仓库地址是：https://gitee.com/thobian/typora，那么repositorie就是 typora
            Folder      : "image",                                // 可以把上传的图片都放到这个指定的文件夹下
            BucketDomain: "https://gitee.com/api/v5/repos/"
        }
    };
    //==============回调函数==============
    var callback = {
        // 上传成功
        /**
         * @param cid 块元素属性p[data-cid]
         * @param url 图片地址
         * */
        onSuccess: function (url, cid) {
            //批量上传防止覆盖
            let element = setting.elements[cid];
            //替换图片位置
            element.removeAttr(locked).attr("src", url);
            element.
            parent("span[md-inline=\"image\"]").
            data("src", url).
            find(".md-image-src-span").
            html(url);
            //更新md source 内容
            File.editor.store(cid);
            //触发文件保存
            File.saveUseNode();
            delete setting.elements[cid];
            //提醒
            var text = "图片上传成功：" + url;
            $("#" + noticeEle).
            css({
                "background": "rgba(0,166,90,0.7)"
            }).
            html(text).
            show().
            delay(5000).
            fadeOut();
        },
        // 上传失败
        onFailure: function (text) {
            setting.element.removeAttr(locked);
            $("#" + noticeEle).
            css({
                "background": "rgba(255,0,0,0.7)"
            }).
            html(text).
            show().
            delay(10000).
            fadeOut();
        }
    };
    var helper = {
        // 将base64转文件流
        base64ToBlob: function (base64) {
            var arr = base64.split(",");
            var mime = arr[0].match(/:(.*?);/)[1] || "image/png";
            // 去掉url的头，并转化为byte
            var bytes = window.atob(arr[1]);
            // 处理异常,将ascii码小于0的转换为大于0
            var ab = new ArrayBuffer(bytes.length);
            // 生成视图（直接针对内存）：8位无符号整数，长度1个字节
            var ia = new Uint8Array(ab);
            for (var i = 0; i < bytes.length; i++) {
                ia[i] = bytes.charCodeAt(i);
            }
            return new Blob([ab], {
                type: mime
            });
        },
        // 根据base64获取文件扩展名
        extension   : function (base64) {
            var ext = base64.split(",")[0].match(/data:image\/(.*?);base64/)[1] || "png";
            console.log("the file ext is: " + ext);
            return ext;
        },
        // 根据base64获取图片内容
        content     : function (base64) {
            var content = base64.split(",")[1];
            return content;
        },
        mine        : function (base64) {
            var arr = base64.split(",");
            var mime = arr[0].match(/:(.*?);/)[1] || "image/png";
            console.log("the file mime is: " + mime);
            return mime;
        },
        // 时间格式化函数
        dateFormat  : function (date, fmt) {
            var o = {
                "M+": date.getMonth() + 1, //月份
                "d+": date.getDate(), //日
                "H+": date.getHours(), //小时
                "m+": date.getMinutes(), //分
                "s+": date.getSeconds(), //秒
                "q+": Math.floor((date.getMonth() + 3) / 3), //季度
                "S" : date.getMilliseconds() //毫秒
            };
            fmt = fmt ? fmt : "yyyyMM/dd/HHmmss-";
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        },
        // github图片走 jsDelivrCND
        jsDelivrCND : function (url) {
            // 不开启走cdn
            if (!setting.github.jsDelivrCND) {
                return url;
            }
            // 原地址：https://raw.githubusercontent.com/Thobian/typora-image/master/demo/20200229104100-861146.png
            // CDN地址：https://cdn.jsdelivr.net/gh/Thobian/typora-image@master/demo/20200229104100-861146.png
            url = url.replace("https://raw.githubusercontent.com/", "https://cdn.jsdelivr.net/gh/").replace(setting.github.Repository + "/master", setting.github.Repository + "@master");
            console.log("use jsDelivr , the new url is:".url);
            return url;
        }
    };
    var init = {
        // 系统需要加载的第三方js文件
        system : function () {
            $.getScript("./plugins/image/imgZip.js");
        },
        // 上传到自己服务时的初始化方法
        self   : function () {
        },
        // 上传到腾讯云COS时的初始化方法
        tencent: function () {
            $.getScript("./plugins/image/cos-js-sdk-v5.min.js");
        },
        // 上传到阿里云OSS时的初始化方法
        aliyun : function () {
            $.getScript("./plugins/image/crypto/crypto/crypto.js", function () {
                $.getScript("./plugins/image/crypto/hmac/hmac.js");
                $.getScript("./plugins/image/crypto/sha1/sha1.js");
                $.getScript("./plugins/image/crypto/base64.js");
            });
        },
        // 上传到又拍云时的初始化方法
        upyun  : function () {
            $.getScript("./plugins/image/crypto/crypto/crypto.js", function () {
                $.getScript("./plugins/image/crypto/hmac/hmac.js");
                $.getScript("./plugins/image/crypto/sha1/sha1.js");
                $.getScript("./plugins/image/crypto/md5/md5.js");
                $.getScript("./plugins/image/crypto/base64.js");
            });
        },
        // 上传到七牛云时的初始化方法
        qiniu  : function () {
            $.getScript("./plugins/image/crypto/crypto/crypto.js", function () {
                $.getScript("./plugins/image/crypto/hmac/hmac.js");
                $.getScript("./plugins/image/crypto/sha1/sha1.js");
                $.getScript("./plugins/image/crypto/base64.js");
            });
        },
        // 上传到github时的初始化方法
        github : function () {
        },
        // 上传到gitee时的初始化方法
        gitee  : function () {
        }
    };
    // 上传文件的方法
    var upload = {
        // 自建服务器存储时，适用的上传方法
        self   : function (fileData, successCall, failureCall,cid) {
            var xhr = new XMLHttpRequest();
            // 文件上传成功或是失败
            xhr.onreadystatechange = function (e) {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        console.log(xhr.responseText);
                        try {
                            var json = JSON.parse(xhr.responseText);
                            if (json.code) {
                                return failureCall(json.message + "(" + json.code + ")");
                            } else {
                                var url = json.data.url;
                                successCall(url,cid);
                            }
                        } catch (err) {
                            console.log(err);
                            return failureCall("服务响应解析失败，错误：" + err.message);
                        }
                    } else {
                        console.log(xhr.responseText);
                        var error = "网络错误，请重试。<br />" + xhr.responseText;
                        return failureCall(error);
                    }
                }
            };
            // 开始上传
            xhr.open("POST", setting.self.url, true);
            for (var key in setting.self.headers) {
                xhr.setRequestHeader(key, setting.self.headers[key]);
            }
            xhr.send(fileData);
        },
        // 使用腾讯云存储时，适用的上传方法
        tencent: function (fileData, successCall, failureCall,cid) {
            // 初始化COS
            var client = new COS({
                SecretId : setting.tencent.SecretId,
                SecretKey: setting.tencent.SecretKey
            });
            // 转化
            var filename = setting.tencent.Folder + "/" + helper.dateFormat((new Date())) + Math.floor(Math.random() * Math.floor(999999)) + "." + helper.extension(fileData);
            var fileData = helper.base64ToBlob(fileData);
            client.sliceUploadFile({
                Bucket     : setting.tencent.Bucket,
                Region     : setting.tencent.Region,
                Key        : filename,
                Body       : fileData,
                onTaskReady: function (taskId) {
                    TaskId = taskId;
                },
                onProgress : function (info) {
                    lastPercent = info.percent;
                }
            }, function (err, data) {
                console.log(err);
                console.log(data);
                // 出现错误，打印错误信息
                if (err) {
                    return failureCall("服务返回异常，错误：" + err.error);
                }
                try {
                    successCall("https://" + data.Location,cid);
                } catch (err) {
                    console.log(err);
                    // 出现非预期结果，打印错误
                    return failureCall("服务响应解析失败，错误：" + err.message);
                }
            });
        },
        // 使用阿里云存储时，适用的上传方法
        aliyun : function (fileData, successCall, failureCall,cid) {
            var policyText = {
                "expiration": "9021-01-01T12:00:00.000Z",       // 设置该Policy的失效时间，超过这个失效时间之后，就没有办法上传文件了
                "conditions": [
                    ["content-length-range", 0, 1048576]        // 设置上传文件的大小限制1M，可以根据自己的需要调整
                ]
            };
            var filename = helper.dateFormat((new Date())) + Math.floor(Math.random() * Math.floor(999999)) + "." + helper.extension(fileData);
            var filepath = setting.aliyun.Folder + "/" + filename;
            var policyBase64 = Base64.encode(JSON.stringify(policyText));
            var bytes = Crypto.HMAC(Crypto.SHA1, policyBase64, setting.aliyun.SecretKey, {asBytes: true});
            var signature = Crypto.util.bytesToBase64(bytes);
            var fileData = helper.base64ToBlob(fileData);
            var formData = new FormData();
            formData.append("name", filename);
            formData.append("key", filepath);
            formData.append("policy", policyBase64);
            formData.append("OSSAccessKeyId", setting.aliyun.SecretId);
            formData.append("success_action_status", 200);
            formData.append("signature", signature);
            formData.append("file", fileData);
            $.ajax({
                type       : "POST",
                url        : setting.aliyun.BucketDomain,
                processData: false,
                data       : formData,
                contentType: false,
                success    : function (result) {
                    //奇葩的阿里云，响应内容为空
                    console.log(result);
                    successCall(setting.aliyun.BucketDomain + filepath,cid);
                },
                error      : function (result) {
                    console.log(result);
                    failureCall("服务响应解析失败，请稍后再试");
                }
            });
        },
        // 使用又拍云存储时，适用的上传方法
        upyun  : function (fileData, successCall, failureCall,cid) {
            var filename = helper.dateFormat((new Date())) + Math.floor(Math.random() * Math.floor(999999)) + "." + helper.extension(fileData);
            var filepath = "/" + setting.upyun.Folder + "/" + filename;
            var fileData = helper.base64ToBlob(fileData);
            var authorization = "Basic " + window.btoa(setting.upyun.Username + ":" + setting.upyun.Password);
            var formData = new FormData();
            formData.append("bucket", setting.upyun.Bucket);
            formData.append("save-key", filepath);
            formData.append("expiration", Math.floor(new Date().getTime() / 1000) + 600);
            formData.append("file", fileData);
            $.ajax({
                type       : "POST",
                url        : setting.upyun.Domain + setting.upyun.Bucket,
                processData: false,
                data       : formData,
                contentType: false,
                beforeSend : function (request) {
                    request.setRequestHeader("Authorization", authorization);
                },
                success    : function (result) {
                    console.log(result);
                    //successCall(setting.aliyun.BucketDomain+filepath);
                },
                error      : function (result) {
                    console.log(result);
                    failureCall("服务响应解析失败，请稍后再试");
                }
            });
        },
        // 使用七牛云存储时，适用的上传方法
        qiniu  : function (fileData, successCall, failureCall,cid) {
            var filename = helper.dateFormat((new Date())) + Math.floor(Math.random() * Math.floor(999999)) + "." + helper.extension(fileData);
            var filepath = setting.qiniu.Folder + "/" + filename;
            var policyBase64 = Base64.encode(JSON.stringify(setting.qiniu.policyText));
            var bytes = Crypto.HMAC(Crypto.SHA1, policyBase64, setting.qiniu.SecretKey, {asBytes: true});
            var encodedSign = Crypto.util.bytesToBase64(bytes);
            var uploadToken = setting.qiniu.AccessKey + ":" + encodedSign + ":" + policyBase64;
            var fileData = helper.base64ToBlob(fileData);
            var formData = new FormData();
            formData.append("name", filename);
            formData.append("key", filepath);
            formData.append("token", uploadToken);
            formData.append("file", fileData);
            $.ajax({
                type       : "POST",
                url        : setting.qiniu.UploadDomain,
                processData: false,
                data       : formData,
                contentType: false,
                success    : function (result) {
                    console.log(result);
                    successCall(setting.qiniu.AccessDomain + filepath,cid);
                },
                error      : function (result) {
                    console.log(result);
                    failureCall("服务响应解析失败，请稍后再试");
                }
            });
        },
        // 使用github存储时，适用的上传方法
        github : function (fileData, successCall, failureCall,cid) {
            var filename = helper.dateFormat((new Date())) +
                Math.floor(Math.random() * Math.floor(999999)) + "." +
                helper.extension(fileData);
            var data = {
                "message"  : "From:https://github.com/Thobian",
                "committer": {
                    "name" : setting.github.CommitterName,
                    "email": setting.github.CommitterEmail
                },
                "content"  : helper.content(fileData)
            };
            $.ajax({
                type       : "PUT",
                url        : "https://api.github.com/repos/" + setting.github.Repository + "/contents/" + setting.github.Filepath + filename,
                async      : false,
                data       : JSON.stringify(data),
                contentType: "application/json; charset=utf-8",
                dataType   : "json",
                beforeSend : function (request) {
                    request.setRequestHeader("Authorization", "token " + setting.github.Token);
                },
                success    : function (data) {
                    console.log(data);
                    try {
                        var url = helper.jsDelivrCND(data.content.download_url);
                        successCall(url,cid);
                    } catch (err) {
                        console.log(err);
                        return failureCall("服务响应解析失败，请稍后再试");
                    }
                },
                error      : function (result) {
                    console.log(result);
                    failureCall("服务响应解析失败，请稍后再试");
                }
            });
        },
        // 使用gitee存储时，适用的上传方法
        gitee  : function (fileData, successCall, failureCall,cid) {
            var filename = helper.dateFormat((new Date())) +
                Math.floor(Math.random() * Math.floor(999999)) + "." +
                helper.extension(fileData);
            var filepath = setting.gitee.Folder + "/" + filename;
            //https://gitee.com/api/v5/repos/renshen_052/myNote/contents/image/1.png
            var target = setting.gitee.BucketDomain + setting.gitee.userName; //加用户名
            target += "/" + setting.gitee.repositorie; //加仓库名
            target += "/contents/" + filepath; //加文件路径
            //处理base64编码，要求文件base64编码，前面不能有 "data:image/png;base64,",这些都要去掉
            var newFileData = fileData.substring(fileData.indexOf(",") + 1); //取得逗号后面的
            var predata = {
                "access_token": setting.gitee.token,
                "message"     : setting.gitee.message,
                "content"     : newFileData,
                "branch"      : setting.gitee.branch
            };
            $.ajax({
                method  : "POST",
                dataType: "json",
                headers : {"Content-Type": "application/json;charset=utf8"},
                url     : target,
                data    : JSON.stringify(predata),
                success : function (result) {
                    console.log(result);
                    successCall(result.content.download_url,cid);
                },
                error   : function (result) {
                    console.log(result);
                    failureCall("服务响应解析失败，请稍后再试");
                }
            });
        }
    };
    //读取文件为base64，再回调上传函数将文件发到服务器
    var loadImgAndSend = function (url,cid) {
        var uploadSwitch = function (target, base64Str) {
            switch (target) {
                case "self":
                    upload.self(base64Str, callback.onSuccess, callback.onFailure,cid);
                    break;
                case "tencent":
                    upload.tencent(base64Str, callback.onSuccess, callback.onFailure,cid);
                    break;
                case "aliyun":
                    upload.aliyun(base64Str, callback.onSuccess, callback.onFailure,cid);
                    break;
                case "upyun":
                    upload.upyun(base64Str, callback.onSuccess, callback.onFailure,cid);
                    break;
                case "qiniu":
                    upload.qiniu(base64Str, callback.onSuccess, callback.onFailure,cid);
                    break;
                case "github":
                    upload.github(base64Str, callback.onSuccess, callback.onFailure,cid);
                    break;
                case "gitee":
                    upload.gitee(base64Str, callback.onSuccess, callback.onFailure,cid);
                    break;
                default:
                    callback.onFailure("配置错误，不支持的图片上传方式，可选方式：self/tencent/aliyun/qiniu/github/gitee");
            }
        };
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            var reader = new FileReader();
            reader.onloadend = function () {
                if (+setting.quality < 1 && +setting.quality > 0) {
                    imgZip.photoCompress(helper.base64ToBlob(reader.result), {quality: +setting.quality}, function (base64) {
                        uploadSwitch(setting.target, base64);
                    });
                } else {
                    uploadSwitch(setting.target, reader.result);
                }
            };
            reader.readAsDataURL(xhr.response);
        };
        xhr.open("GET", url);
        xhr.responseType = "blob";
        xhr.send();
    };
    // 核心方法
    var locked = "doing";
    var noticeEle = "image-result-notice";
    $.image = {};
    $.image.init = function (options) {
        setting = options || setting;
        // 根据不同的文件存储位置，初始化不同的环境
        init.system();
        switch (setting.target) {
            case "self":
                init.self();
                break;
            case "tencent":
                init.tencent();
                break;
            case "aliyun":
                init.aliyun();
            case "upyun":
                init.upyun();
                break;
            case "qiniu":
                init.qiniu();
                break;
            case "github":
                init.github();
                break;
            case "gitee":
                init.gitee();
                break;
        }
        // 监听鼠标事件
        let dbclickTimer = null;
        $("#write").on("mouseleave click", "img", function (e) {
            clearTimeout(dbclickTimer);
            dbclickTimer = setTimeout(function () {
                uploadBatch([e.target]);
            }, 300);
        }).on("dblclick", "img", function (e) {   //双击批量上传
            clearTimeout(dbclickTimer);
            uploadBatch(getAllUnUploadImg());
        }).on("paste", function (e) {
            setTimeout(function () {
                let target = $(e.target).find("img");
                if (target.length === 0) return;
                uploadBatch([target[0]]);
            }, 500);
        });

        function uploadBatch(arr) {
            if (!Array.isArray(arr) || arr.length === 0) return;
            arr.forEach(img => {
                try {
                    let cid = $(img).parent().parent().attr("cid");
                    if (img.src.includes("http") || setting.elements[cid]) {
                        console.log("image already uploaded or uploading...,cid:" + cid + ",alt:" + img.alt + ",src:" + img.src);
                        return true;
                    }
                    setting.elements[cid] = $(img);
                    loadImgAndSend(img.src, cid);
                } catch (e) {
                    console.error(e);
                }
            });
        }

        function getAllUnUploadImg() {
            let arr = [];
            $("#write img").each(function (i, e) {
                arr.push(e);
            });
            return arr;
        }

        // 监听鼠标事件
        /*$("#write").on("mouseleave click", "img", function (e) {
         try {
         var src = e.target.src;
         if (/^(https?:)?\/\//i.test(src)) {
         console.log("The image already upload to server, url:" + src);
         return false;
         }
         setting.element = element = $(e.target);
         var doing = element.attr(locked) == "1";
         if (doing) {
         console.log("uploading...");
         return false;
         } else {
         element.attr(locked, "1");
         }
         $("content").prepend("<div id=\"" + noticeEle + "\" style=\"position:fixed;height:40px;line-height:40px;padding:0 15px;overflow-y:auto;overflow-x:hidden;z-index:10;color:#fff;width:100%;display:none;\"></div>");
         //转换成普通的图片地址
         //src = src.substring(8, src.indexOf('?last'));
         loadImgAndSend(src);
         } catch (e) {console.log(e);}
         ;
         });*/
    };
})(jQuery);
$.image.init();
