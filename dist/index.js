"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var random_string_1 = __importDefault(require("random-string"));
var opn_1 = __importDefault(require("opn"));
var request_promise_1 = __importDefault(require("request-promise"));
var zip_1 = require("./zip");
var errors_1 = require("./errors");
var path_1 = __importDefault(require("path"));
var ignore_1 = require("./ignore");
var core_1 = require("@serverless-devs/core");
var logger = new core_1.Logger('platform');
var FC_CODE_CACHE_DIR = "./";
function sleep(timer) {
    return new Promise(function (resolve) {
        setTimeout(function () { return resolve(true); }, timer);
    });
}
var Platform = /** @class */ (function () {
    function Platform() {
    }
    Platform.prototype._getToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var contentText;
            return __generator(this, function (_a) {
                try {
                    contentText = core_1.fse.readFileSync("".concat((0, core_1.getRootHome)(), "/serverless-devs-platform.dat"), 'utf-8');
                    return [2 /*return*/, contentText];
                }
                catch (e) {
                    return [2 /*return*/, null];
                }
                return [2 /*return*/];
            });
        });
    };
    Platform.prototype._getContent = function (fileList) {
        return __awaiter(this, void 0, void 0, function () {
            var i;
            return __generator(this, function (_a) {
                for (i = 0; i < fileList.length; i++) {
                    try {
                        return [2 /*return*/, core_1.fse.readFileSync(fileList[i], 'utf-8')];
                    }
                    catch (e) {
                    }
                }
                return [2 /*return*/, undefined];
            });
        });
    };
    Platform.prototype.generateCodeIngore = function (baseDir, codeUri, runtime) {
        return __awaiter(this, void 0, void 0, function () {
            var ignoreFileInCodeUri, ignoreFileInBaseDir;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ignoreFileInCodeUri = path_1.default.join(path_1.default.resolve(baseDir, codeUri), '.signore');
                        if (!(core_1.fse.pathExistsSync(ignoreFileInCodeUri) && core_1.fse.lstatSync(ignoreFileInCodeUri).isFile())) return [3 /*break*/, 2];
                        return [4 /*yield*/, (0, ignore_1.isIgnoredInCodeUri)(path_1.default.resolve(baseDir, codeUri), runtime)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        ignoreFileInBaseDir = path_1.default.join(baseDir, '.fcignore');
                        if (core_1.fse.pathExistsSync(ignoreFileInBaseDir) && core_1.fse.lstatSync(ignoreFileInBaseDir).isFile()) {
                            logger.log('.fcignore file will be placed under codeUri only in the future. Please update it with the relative path and then move it to the codeUri as soon as possible.');
                        }
                        return [4 /*yield*/, (0, ignore_1.isIgnored)(baseDir, runtime, path_1.default.resolve(baseDir, codeUri), path_1.default.resolve(baseDir, codeUri))];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Platform.prototype.zipCode = function (baseDir, codeUri, tempFileName, runtime) {
        return __awaiter(this, void 0, void 0, function () {
            var codeAbsPath, codeignore, zipPath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (codeUri) {
                            codeAbsPath = path_1.default.resolve(baseDir, codeUri);
                            if (codeUri.endsWith('.zip') || codeUri.endsWith('.jar') || codeUri.endsWith('.war')) {
                                return [2 /*return*/, codeAbsPath];
                            }
                        }
                        else {
                            codeAbsPath = path_1.default.resolve(baseDir, './');
                        }
                        return [4 /*yield*/, this.generateCodeIngore(baseDir, codeUri, runtime)];
                    case 1:
                        codeignore = _a.sent();
                        // await detectLibrary(codeAbsPath, runtime, baseDir, functionName, '\t');
                        return [4 /*yield*/, core_1.fse.mkdirp(FC_CODE_CACHE_DIR)];
                    case 2:
                        // await detectLibrary(codeAbsPath, runtime, baseDir, functionName, '\t');
                        _a.sent();
                        zipPath = path_1.default.join(FC_CODE_CACHE_DIR, tempFileName);
                        return [4 /*yield*/, (0, zip_1.pack)(codeAbsPath, codeignore, zipPath)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * demo 登陆
     * @param inputs
     * @returns
     */
    Platform.prototype.login = function (inputs) {
        return __awaiter(this, void 0, void 0, function () {
            var apts, comParse, tempToken, st, user, fd, token_1, loginUrl, e_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        apts = {
                            boolean: ['help'],
                            alias: { help: 'h' },
                        };
                        comParse = (0, core_1.commandParse)({ args: inputs.args }, apts);
                        if (comParse.data && comParse.data.help) {
                            (0, core_1.help)([{
                                    header: 'Login',
                                    content: "Log in to Serverless Registry"
                                }, {
                                    header: 'Usage',
                                    content: "$ s cli registry login <options>"
                                }, {
                                    header: 'Options',
                                    optionList: [
                                        {
                                            name: 'token',
                                            description: '[Optional] If you already have a token, you can configure it directly',
                                            type: String,
                                        }
                                    ],
                                }, {
                                    header: 'Examples without Yaml',
                                    content: [
                                        '$ s cli registry login',
                                        '$ s cli registry login --token my-serverless-registry-token',
                                    ],
                                },]);
                            return [2 /*return*/];
                        }
                        tempToken = comParse.data ? comParse.data.token : null;
                        st = 0;
                        if (!tempToken) return [3 /*break*/, 4];
                        return [4 /*yield*/, core_1.fse.openSync("".concat((0, core_1.getRootHome)(), "/serverless-devs-platform.dat"), 'w+')];
                    case 1:
                        fd = _a.sent();
                        return [4 /*yield*/, core_1.fse.writeSync(fd, tempToken)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, core_1.fse.closeSync(fd)];
                    case 3:
                        _a.sent();
                        st = 1;
                        return [3 /*break*/, 10];
                    case 4:
                        token_1 = (0, random_string_1.default)({ length: 20 });
                        loginUrl = "https://github.com/login/oauth/authorize?client_id=beae900546180c7bbdd6&redirect_uri=http://registry.devsapp.cn/user/login/github?token=".concat(token_1);
                        // 输出提醒
                        logger.warn("Serverless registry no longer provides independent registration function, but will uniformly adopt GitHub authorized login scheme.");
                        logger.info("The system will attempt to automatically open the browser for authorization......");
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, sleep(2000)];
                    case 6:
                        _a.sent();
                        (0, opn_1.default)(loginUrl);
                        return [3 /*break*/, 8];
                    case 7:
                        e_1 = _a.sent();
                        logger.info("Failed to open the default address. Please try to open the following URL manually for authorization: ");
                        logger.info(loginUrl);
                        return [3 /*break*/, 8];
                    case 8: return [4 /*yield*/, logger.task('Getting', [
                            {
                                title: 'Getting login token ...',
                                id: 'get token',
                                task: function () { return __awaiter(_this, void 0, void 0, function () {
                                    var i, tempResult, fd;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                i = 0;
                                                _a.label = 1;
                                            case 1:
                                                if (!(i < 100)) return [3 /*break*/, 8];
                                                return [4 /*yield*/, sleep(2000)];
                                            case 2:
                                                _a.sent();
                                                return [4 /*yield*/, (0, core_1.request)('http://registry.devsapp.cn/user/information/github', {
                                                        params: {
                                                            token: token_1,
                                                        },
                                                    })];
                                            case 3:
                                                tempResult = _a.sent();
                                                if (!(!tempResult.Error && tempResult.safety_code)) return [3 /*break*/, 7];
                                                return [4 /*yield*/, core_1.fse.openSync("".concat((0, core_1.getRootHome)(), "/serverless-devs-platform.dat"), 'w+')];
                                            case 4:
                                                fd = _a.sent();
                                                return [4 /*yield*/, core_1.fse.writeSync(fd, tempResult.safety_code)];
                                            case 5:
                                                _a.sent();
                                                return [4 /*yield*/, core_1.fse.closeSync(fd)];
                                            case 6:
                                                _a.sent();
                                                st = 1;
                                                user = tempResult.login;
                                                return [3 /*break*/, 8];
                                            case 7:
                                                i++;
                                                return [3 /*break*/, 1];
                                            case 8: return [2 /*return*/];
                                        }
                                    });
                                }); },
                            }
                        ])];
                    case 9:
                        _a.sent();
                        _a.label = 10;
                    case 10:
                        if (st == 1) {
                            logger.log("".concat(user ? user + ': ' : '', "Welcome to Serverless Devs Registry."), "green");
                        }
                        else {
                            logger.error("Login failed. Please log in to GitHub account on the pop-up page and authorize it, or try again later.");
                        }
                        return [2 /*return*/, null];
                }
            });
        });
    };
    /**
     * demo 删除版本
     * @param inputs
     * @returns
     */
    Platform.prototype.delete = function (inputs) {
        return __awaiter(this, void 0, void 0, function () {
            var token, apts, comParse, package_name, package_type, options, rpbody, e_2, tempResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._getToken()];
                    case 1:
                        token = _a.sent();
                        if (!token) {
                            throw new errors_1.CatchableError("Please perform serverless registry through [s cli registry login]", 'Failed to get serverless registry token');
                        }
                        apts = {
                            boolean: ['help'],
                            alias: { help: 'h' },
                        };
                        comParse = (0, core_1.commandParse)({ args: inputs.args }, apts);
                        if (comParse.data && comParse.data.help) {
                            (0, core_1.help)([{
                                    header: 'Delete',
                                    content: "Delete the package of the specified version"
                                }, {
                                    header: 'Usage',
                                    content: "$ s cli registry delete <options>"
                                }, {
                                    header: 'Options',
                                    optionList: [
                                        {
                                            name: 'name-version',
                                            description: '[Required] The name and version of the package, such as name@version',
                                            type: String,
                                        },
                                        {
                                            name: 'type',
                                            description: '[Required] Package type, value: [Component/Application/Plugin]',
                                            type: String,
                                        }
                                    ],
                                }, {
                                    header: 'Examples without Yaml',
                                    content: [
                                        '$ s cli registry delete --name-version thinphp@0.0.1 --type Component',
                                    ],
                                },]);
                            return [2 /*return*/];
                        }
                        package_name = comParse.data ? comParse.data['name-version'] : null;
                        package_type = comParse.data ? comParse.data.type : null;
                        if (!package_name || !package_name.includes("@")) {
                            throw new errors_1.CatchableError('Component name and version is required.', "Please add --name-version, like: s cli registry delete --name-version thinphp@0.0.1 --type Component");
                        }
                        if (!package_type || !['Component', 'Application', 'Plugin'].includes(package_type)) {
                            throw new errors_1.CatchableError('Component type is required. The velue of type: [Component/Application/Plugin]', "Please add --type, like: s cli registry delete --name-version thinphp@0.0.1 --type Component");
                        }
                        options = {
                            'method': 'POST',
                            'url': 'http://registry.devsapp.cn/package/delete',
                            'headers': {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            form: {
                                'safety_code': token,
                                'package_name': package_name.split("@")[0],
                                'package_type': package_type,
                                'package_version': package_name.split("@")[1],
                            }
                        };
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, (0, request_promise_1.default)(options)];
                    case 3:
                        rpbody = _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_2 = _a.sent();
                        throw new errors_1.CatchableError('Network exception. Please try again later.', 'Data request exception');
                    case 5:
                        tempResult = JSON.parse(rpbody);
                        if (tempResult.Response.Error) {
                            throw new errors_1.CatchableError("".concat(tempResult.Response.Error, ": ").concat(tempResult.Response.Message), 'Failed to obtain relevant information');
                        }
                        tempResult = tempResult.Response;
                        return [2 /*return*/, tempResult];
                }
            });
        });
    };
    Platform.prototype.detail = function (inputs) {
        return __awaiter(this, void 0, void 0, function () {
            var token, apts, comParse, package_name, options, rpbody, e_3, tempResult, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._getToken()];
                    case 1:
                        token = _a.sent();
                        if (!token) {
                            throw new errors_1.CatchableError("Please perform serverless registry through [s cli registry login]", 'Failed to get serverless registry token');
                        }
                        apts = {
                            boolean: ['help'],
                            alias: { help: 'h' },
                        };
                        comParse = (0, core_1.commandParse)({ args: inputs.args }, apts);
                        if (comParse.data && comParse.data.help) {
                            (0, core_1.help)([{
                                    header: 'Detail',
                                    content: "Query the details of a package"
                                }, {
                                    header: 'Usage',
                                    content: "$ s cli registry detail <options>"
                                }, {
                                    header: 'Options',
                                    optionList: [
                                        {
                                            name: 'name-version',
                                            description: '[Required] The name and version of the package, such as name@version',
                                            type: String,
                                        }
                                    ],
                                }, {
                                    header: 'Examples without Yaml',
                                    content: [
                                        '$ s cli registry delete --name-version thinphp@0.0.1 --type Component',
                                    ],
                                },]);
                            return [2 /*return*/];
                        }
                        package_name = comParse.data ? comParse.data['name-version'] : null;
                        if (!package_name || !package_name.includes("@")) {
                            throw new errors_1.CatchableError('Component name and version is required.', "Please add --name-version, like: s cli registry delete --name-version thinphp@0.0.1 --type Component");
                        }
                        options = {
                            'method': 'GET',
                            'url': "http://registry.devsapp.cn/simple/".concat(package_name.split("@")[0], "/releases"),
                            'headers': {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            }
                        };
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, (0, request_promise_1.default)(options)];
                    case 3:
                        rpbody = _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_3 = _a.sent();
                        throw new errors_1.CatchableError('Network exception. Please try again later.', 'Data request exception');
                    case 5:
                        tempResult = JSON.parse(rpbody);
                        if (tempResult.Response.Error) {
                            throw new errors_1.CatchableError("".concat(tempResult.Response.Error, ": ").concat(tempResult.Response.Message), 'Failed to obtain relevant information');
                        }
                        tempResult = tempResult.Response;
                        for (i = 0; i < tempResult.length; i++) {
                            if (tempResult[i].tag_name == package_name.split("@")[1]) {
                                return [2 /*return*/, {
                                        tag_name: tempResult[i].tag_name,
                                        published_at: tempResult[i].published_at,
                                        zipball_url: tempResult[i].zipball_url
                                    }];
                            }
                        }
                        logger.warn("The specified package version was not found.");
                        return [2 /*return*/, null];
                }
            });
        });
    };
    /**
     * demo 发布Package
     * @param inputs
     * @returns
     */
    Platform.prototype.publish = function (inputs) {
        return __awaiter(this, void 0, void 0, function () {
            var token, apts, comParse, publish, readme, version_body, syaml, rpbody, e_4, tempResult, uploadUrl, baseDir, codeUri, e_5, tempName, runtime, vm, _a, _b, e_6;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this._getToken()];
                    case 1:
                        token = _d.sent();
                        if (!token) {
                            throw new errors_1.CatchableError("Please perform serverless registry through [s cli registry login]", 'Failed to get serverless registry token');
                        }
                        apts = {
                            boolean: ['help'],
                            alias: { help: 'h' },
                        };
                        comParse = (0, core_1.commandParse)({ args: inputs.args }, apts);
                        if (comParse.data && comParse.data.help) {
                            (0, core_1.help)([{
                                    header: 'Publish',
                                    content: "Publish package to serverless registry"
                                }, {
                                    header: 'Usage',
                                    content: "$ s cli registry publish"
                                }, {
                                    header: 'Examples without Yaml',
                                    content: [
                                        '$ s cli registry publish',
                                    ],
                                },]);
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this._getContent(['./publish.yaml', './publish.yml'])];
                    case 2:
                        publish = _d.sent();
                        return [4 /*yield*/, this._getContent(['./readme.md', './README.md', './README.MD', './Readme.MD', './Readme.md'])];
                    case 3:
                        readme = _d.sent();
                        return [4 /*yield*/, this._getContent(['./version.md', './VERSION.md', './VERSION.MD'])];
                    case 4:
                        version_body = _d.sent();
                        return [4 /*yield*/, this._getContent(['./src/s.yaml', './src/s.yml'])];
                    case 5:
                        syaml = _d.sent();
                        _d.label = 6;
                    case 6:
                        _d.trys.push([6, 8, , 9]);
                        return [4 /*yield*/, (0, request_promise_1.default)({
                                'method': 'POST',
                                'url': "https://registry.devsapp.cn/package/publish",
                                'headers': {
                                    'Content-Type': 'application/x-www-form-urlencoded'
                                },
                                'form': {
                                    "safety_code": token,
                                    "publish": publish,
                                    "version_body": version_body,
                                    "readme": readme,
                                    "syaml": syaml
                                }
                            })];
                    case 7:
                        rpbody = _d.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        e_4 = _d.sent();
                        throw new errors_1.CatchableError('Network exception. Please try again later.', 'Data request exception');
                    case 9:
                        tempResult = JSON.parse(rpbody);
                        if (tempResult.Response.Error) {
                            throw new errors_1.CatchableError("".concat(tempResult.Response.Error, ": ").concat(tempResult.Response.Message), 'Failed to obtain relevant information');
                        }
                        uploadUrl = tempResult.Response.url;
                        baseDir = "./";
                        codeUri = "./";
                        _d.label = 10;
                    case 10:
                        _d.trys.push([10, 12, , 13]);
                        return [4 /*yield*/, core_1.fse.mkdirSync('./.s/')];
                    case 11:
                        _d.sent();
                        return [3 /*break*/, 13];
                    case 12:
                        e_5 = _d.sent();
                        return [3 /*break*/, 13];
                    case 13:
                        tempName = './.s/' + (0, random_string_1.default)({ length: 20 }) + '.zip';
                        runtime = "nodejs12";
                        return [4 /*yield*/, this.zipCode(baseDir, codeUri, tempName, runtime)];
                    case 14:
                        _d.sent();
                        vm = (0, core_1.spinner)('Publishing');
                        _d.label = 15;
                    case 15:
                        _d.trys.push([15, 18, , 19]);
                        _a = request_promise_1.default;
                        _c = {
                            'method': 'PUT',
                            'url': uploadUrl
                        };
                        _b = 'body';
                        return [4 /*yield*/, core_1.fse.readFileSync(tempName)];
                    case 16: return [4 /*yield*/, _a.apply(void 0, [(_c[_b] = _d.sent(),
                                _c)])];
                    case 17:
                        rpbody = _d.sent();
                        vm.succeed('Published successfully');
                        return [3 /*break*/, 19];
                    case 18:
                        e_6 = _d.sent();
                        vm.fail('Publishing failed');
                        throw new errors_1.CatchableError('Network exception. Please try again later.', e_6.body);
                    case 19:
                        try {
                            // 尝试删除
                            core_1.fse.unlinkSync(tempName);
                        }
                        catch (e) {
                        }
                        return [2 /*return*/, null];
                }
            });
        });
    };
    /**
     * demo 获取发布的列表
     * @param inputs
     * @returns
     */
    Platform.prototype.list = function (inputs) {
        return __awaiter(this, void 0, void 0, function () {
            var token, apts, comParse, options, rpbody, e_7, result, tempResult, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._getToken()];
                    case 1:
                        token = _a.sent();
                        if (!token) {
                            throw new errors_1.CatchableError("Please perform serverless registry through [s cli registry login]", 'Failed to get serverless registry token');
                        }
                        apts = {
                            boolean: ['help'],
                            alias: { help: 'h' },
                        };
                        comParse = (0, core_1.commandParse)({ args: inputs.args }, apts);
                        if (comParse.data && comParse.data.help) {
                            (0, core_1.help)([{
                                    header: 'List',
                                    content: "Query the published packge of the current login account"
                                }, {
                                    header: 'Usage',
                                    content: "$ s cli registry list"
                                }, {
                                    header: 'Examples without Yaml',
                                    content: [
                                        '$ s cli registry list',
                                    ],
                                },]);
                            return [2 /*return*/];
                        }
                        options = {
                            'method': 'POST',
                            'url': 'http://registry.devsapp.cn/center/package/publish',
                            'headers': {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            form: {
                                'safety_code': token
                            }
                        };
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, (0, request_promise_1.default)(options)];
                    case 3:
                        rpbody = _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_7 = _a.sent();
                        throw new errors_1.CatchableError('Network exception. Please try again later.', 'Data request exception');
                    case 5:
                        result = [];
                        tempResult = JSON.parse(rpbody);
                        if (tempResult.Response.Error) {
                            throw new errors_1.CatchableError("".concat(tempResult.Response.Error, ": ").concat(tempResult.Response.Message), 'Failed to obtain relevant information');
                        }
                        tempResult = tempResult.Response;
                        for (i = 0; i < tempResult.length; i++) {
                            result.push({
                                package: tempResult[i].package,
                                description: tempResult[i].description,
                                version: tempResult[i].version.tag_name,
                                zipball_url: tempResult[i].version.zipball_url
                            });
                        }
                        if (result) {
                            return [2 /*return*/, result];
                        }
                        logger.info('You haven\'t released Pacakge yet');
                        return [2 /*return*/, null];
                }
            });
        });
    };
    /**
     * demo 获取某个组件的版本
     * @param inputs
     * @returns
     */
    Platform.prototype.versions = function (inputs) {
        return __awaiter(this, void 0, void 0, function () {
            var apts, comParse, component, options, rpbody, e_8, result, tempResult, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        apts = {
                            boolean: ['help'],
                            alias: { help: 'h' },
                        };
                        comParse = (0, core_1.commandParse)({ args: inputs.args }, apts);
                        if (comParse.data && comParse.data.help) {
                            (0, core_1.help)([{
                                    header: 'Versions',
                                    content: "Query the version information of the specified package"
                                }, {
                                    header: 'Usage',
                                    content: "$ s cli registry versions <options>"
                                }, {
                                    header: 'Options',
                                    optionList: [
                                        {
                                            name: 'name',
                                            description: '[Required] The name of the package',
                                            type: String,
                                        }
                                    ],
                                }, {
                                    header: 'Examples without Yaml',
                                    content: [
                                        '$ s cli registry versions --name thinkphp',
                                    ],
                                },]);
                            return [2 /*return*/];
                        }
                        component = comParse.data ? comParse.data.name : null;
                        if (!component) {
                            throw new errors_1.CatchableError('Component name is required.', "Please add --name, like: s cli registry versions --name thinphp");
                        }
                        options = {
                            'method': 'GET',
                            'url': "http://registry.devsapp.cn/simple/".concat(component, "/releases"),
                            'headers': {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            }
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, (0, request_promise_1.default)(options)];
                    case 2:
                        rpbody = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_8 = _a.sent();
                        throw new errors_1.CatchableError('Network exception. Please try again later.', 'Data request exception');
                    case 4:
                        result = {
                            "PackageName": component,
                            "Versions": []
                        };
                        tempResult = JSON.parse(rpbody);
                        if (tempResult.Response.Error) {
                            throw new errors_1.CatchableError("".concat(tempResult.Response.Error, ": ").concat(tempResult.Response.Message), 'Failed to obtain relevant information');
                        }
                        tempResult = tempResult.Response;
                        for (i = 0; i < tempResult.length; i++) {
                            result.Versions.push({
                                tag_name: tempResult[i].tag_name,
                                published_at: tempResult[i].published_at,
                                zipball_url: tempResult[i].zipball_url
                            });
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * demo 更新token信息
     * @param inputs
     * @returns
     */
    Platform.prototype.retoken = function (inputs) {
        return __awaiter(this, void 0, void 0, function () {
            var token, apts, comParse, options, rpbody, e_9, tempResult, fd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._getToken()];
                    case 1:
                        token = _a.sent();
                        if (!token) {
                            throw new errors_1.CatchableError("Please perform serverless registry through [s cli registry login]", 'Failed to get serverless registry token');
                        }
                        apts = {
                            boolean: ['help'],
                            alias: { help: 'h' },
                        };
                        comParse = (0, core_1.commandParse)({ args: inputs.args }, apts);
                        if (comParse.data && comParse.data.help) {
                            (0, core_1.help)([{
                                    header: 'Retoken',
                                    content: "Reset Serverless Registry login token"
                                }, {
                                    header: 'Usage',
                                    content: "$ s cli registry retoken"
                                }, {
                                    header: 'Examples without Yaml',
                                    content: [
                                        '$ s cli registry retoken',
                                    ],
                                },]);
                            return [2 /*return*/];
                        }
                        options = {
                            'method': 'POST',
                            'url': "http://registry.devsapp.cn/user/update/safetycode",
                            'headers': {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            form: {
                                'safety_code': token
                            }
                        };
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, (0, request_promise_1.default)(options)];
                    case 3:
                        rpbody = _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_9 = _a.sent();
                        throw new errors_1.CatchableError('Network exception. Please try again later.', 'Data request exception');
                    case 5:
                        tempResult = JSON.parse(rpbody);
                        if (tempResult.Response.Error) {
                            throw new errors_1.CatchableError("".concat(tempResult.Response.Error, ": ").concat(tempResult.Response.Message), 'Failed to obtain relevant information');
                        }
                        tempResult = tempResult.Response;
                        return [4 /*yield*/, core_1.fse.openSync("".concat((0, core_1.getRootHome)(), "/serverless-devs-platform.dat"), 'w+')];
                    case 6:
                        fd = _a.sent();
                        return [4 /*yield*/, core_1.fse.writeSync(fd, tempResult.safety_code)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, core_1.fse.closeSync(fd)];
                    case 8:
                        _a.sent();
                        logger.log("Serverless Registry login token reset succeeded.", "green");
                        return [2 /*return*/, null];
                }
            });
        });
    };
    /**
     * demo 获取token信息
     * @param inputs
     * @returns
     */
    Platform.prototype.token = function (inputs) {
        return __awaiter(this, void 0, void 0, function () {
            var token, apts, comParse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._getToken()];
                    case 1:
                        token = _a.sent();
                        if (!token) {
                            throw new errors_1.CatchableError("Please perform serverless registry through [s cli registry login]", 'Failed to get serverless registry token');
                        }
                        apts = {
                            boolean: ['help'],
                            alias: { help: 'h' },
                        };
                        comParse = (0, core_1.commandParse)({ args: inputs.args }, apts);
                        if (comParse.data && comParse.data.help) {
                            (0, core_1.help)([{
                                    header: 'Token',
                                    content: "Get Serverless Registry login token"
                                }, {
                                    header: 'Usage',
                                    content: "$ s cli registry token"
                                }]);
                            return [2 /*return*/];
                        }
                        logger.warn("The `token` is a very important new credential information for you to use Serverless Registry. Please keep it properly. In case of leakage, please use the `retoken` command to regenerate it.");
                        return [2 /*return*/, { "Token": token }];
                }
            });
        });
    };
    /**
     * demo 查询package
     * @param inputs
     * @returns
     */
    Platform.prototype.search = function (inputs) {
        return __awaiter(this, void 0, void 0, function () {
            var apts, comParse, packageType, packageKeyword, options, rpbody, e_10, result, tempResult, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        apts = {
                            boolean: ['help'],
                            alias: { help: 'h' },
                        };
                        comParse = (0, core_1.commandParse)({ args: inputs.args }, apts);
                        if (comParse.data && comParse.data.help) {
                            (0, core_1.help)([{
                                    header: 'Search',
                                    content: "Search packages"
                                }, {
                                    header: 'Usage',
                                    content: "$ s cli registry search <options>"
                                }, {
                                    header: 'Options',
                                    optionList: [
                                        {
                                            name: 'type',
                                            description: '[Required] The type of package, value: component, application, plugin',
                                            type: String,
                                        },
                                        {
                                            name: 'keyword',
                                            description: '[Optional] search keyword',
                                            type: String,
                                        }
                                    ],
                                }, {
                                    header: 'Examples without Yaml',
                                    content: [
                                        '$ s cli registry search --type component',
                                    ],
                                },]);
                            return [2 /*return*/];
                        }
                        packageType = comParse.data ? comParse.data.type : null;
                        packageKeyword = comParse.data ? comParse.data.keyword : null;
                        if (!packageType) {
                            throw new errors_1.CatchableError('Package type is required, value: Component, Application, Plugin', "Please add --type, like: s cli registry versions --type component");
                        }
                        options = {
                            'method': 'POST',
                            'url': "http://registry.devsapp.cn/package/search",
                            'headers': {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            'form': {
                                "type": packageType,
                                "keyword": packageKeyword
                            }
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, (0, request_promise_1.default)(options)];
                    case 2:
                        rpbody = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_10 = _a.sent();
                        throw new errors_1.CatchableError('Network exception. Please try again later.', 'Data request exception');
                    case 4:
                        result = [];
                        tempResult = JSON.parse(rpbody);
                        if (tempResult.Response.Error) {
                            throw new errors_1.CatchableError("".concat(tempResult.Response.Error, ": ").concat(tempResult.Response.Message), 'Failed to obtain relevant information');
                        }
                        tempResult = tempResult.Response;
                        for (i = 0; i < tempResult.length; i++) {
                            result.push({
                                name: tempResult[i].package,
                                description: tempResult[i].description,
                                version: {
                                    tag_name: tempResult[i].version.tag_name,
                                    published_at: tempResult[i].version.published_at,
                                    zipball_url: tempResult[i].version.zipball_url
                                }
                            });
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    return Platform;
}());
exports.default = Platform;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxnRUFBa0M7QUFDbEMsNENBQXFCO0FBQ3JCLG9FQUFnQztBQUNoQyw2QkFBMkI7QUFDM0IsbUNBQXdDO0FBQ3hDLDhDQUF3QjtBQUN4QixtQ0FBdUQ7QUFDdkQsOENBQXFHO0FBR3JHLElBQU0sTUFBTSxHQUFHLElBQUksYUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3RDLElBQU0saUJBQWlCLEdBQUcsSUFBSSxDQUFBO0FBRTlCLFNBQVMsS0FBSyxDQUFDLEtBQWE7SUFDeEIsT0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU87UUFDdkIsVUFBVSxDQUFDLGNBQU0sT0FBQSxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQWIsQ0FBYSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzNDLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQUdEO0lBQUE7SUE0c0JBLENBQUM7SUExc0JTLDRCQUFTLEdBQWY7Ozs7Z0JBQ0ksSUFBSTtvQkFDTSxXQUFXLEdBQUcsVUFBRyxDQUFDLFlBQVksQ0FBQyxVQUFHLElBQUEsa0JBQVcsR0FBRSxrQ0FBK0IsRUFBRSxPQUFPLENBQUMsQ0FBQztvQkFDL0Ysc0JBQU8sV0FBVyxFQUFBO2lCQUNyQjtnQkFBQyxPQUFPLENBQUMsRUFBRTtvQkFDUixzQkFBTyxJQUFJLEVBQUE7aUJBQ2Q7Ozs7S0FDSjtJQUVLLDhCQUFXLEdBQWpCLFVBQWtCLFFBQVE7Ozs7Z0JBQ3RCLEtBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDdEMsSUFBSTt3QkFDQSxzQkFBTyxVQUFHLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxP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