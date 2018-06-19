'use strict';
var request = require('request-promise');
var uuidv4 = require('uuid/v4');
var WXBizDataCrypt = require('./../../utils/WXBizDataCrypt.js')
const {
    APPID,
    SECRET
} = require('../../config/config');
const bodyParser = require('koa-bodyparser')
const Controller = require('egg').Controller;
const Db = require('../models/index')
const User = require('../models/user')
console.log('Db', User);

// Db.Users.create({
//     nickname: 'janedoe',
// })
// app.use(bodyParser())
let sessionKey
class HomeController extends Controller {

    async index() {
        console.log('index');
        this.ctx.body = {
            code: 401,
            data: 'hi, egg'
        };
    }

    async login(ctx) {
        // 	let request = ctx.request
        // let req_query = request.query
        // let req_querystring = request.querystring
        // 获取code-> 请求微信接口->获取session_key 和 openId
        let code = ctx.request.query.code
        console.log(ctx.request.query)
        request(`https://api.weixin.qq.com/sns/jscode2session?appid=${APPID}&secret=${SECRET}&js_code=${code}&grant_type=authorization_code`, (error, response, body) => {
            console.log(body);
            // {"session_key":"YHvOMjp8oaCb7\/IUQEQh5g==","expires_in":7200,"openid":"odfr60KAprw2klsi01JLfz5VEy3M"}
            sessionKey = body.session_key
        })
        this.ctx.body = {
            code: 0,
            data: {
                token: '12444gdfgdfhgdfg'
            }
        };
    }

    // 获取unionId
    async postUnionId(ctx) {
        let postData = ctx.request.body
        var encryptedData = postData.encryptedData
        var iv = postData.iv
        var code = postData.code
        var body = await request(`https://api.weixin.qq.com/sns/jscode2session?appid=${APPID}&secret=${SECRET}&js_code=${code}&grant_type=authorization_code`)
        console.log(body, typeof (body));
        // {"session_key":"qopfA7UcfSkVLYVI+LqSzg==","expires_in":7200,"openid":"odfr60KAprw2klsi01JLfz5VEy3M"}
        var sessionKey = JSON.parse(body).session_key;
        console.log(sessionKey, 'login sessionKey');
        // 解密unionId
        //解密后 data:  { openId: 'odfr60KAprw2klsi01JLfz5VEy3M',
        // nickName: 'Lemon～～',
        // gender: 1,
        // language: 'zh_CN',
        // city: 'Changsha',
        // province: 'Hunan',
        // country: 'China',
        // avatarUrl: 'https://wx.qlogo.cn/mmopen/vi_32/z2z2OI0z9rbCngwkzrnP8vs3Q12FY054mX00aL7zPlial1o7q3M6Cl5dYriaDNKyxZ6Ymn5KYX8wnMsrlpnSgViaA/132',
        // unionId: 'ohNji1Oi6TGKZJOLNep_qwA_xk4I',
        // watermark: { timestamp: 1528862274, appid: 'wx54fbe9949077ff30' } }
        try {
            var pc = new WXBizDataCrypt(APPID, sessionKey)
            var data = pc.decryptData(encryptedData, iv)
            console.log('解密后 data: ', data)
            var token = uuidv4()
            console.log(token, 'token');
            Db.User.create({
                nickname: 'janedoe',
            })
            this.ctx.body = {
                code: 0,
                data: data,
                data: {
                    openId: data.openId,
                    unionId: data.unionId,
                    token: token
                }
            };

        } catch (error) {
            console.log('解密出错', error)
            this.ctx.body = {
                code: '0',
                data: {
                    msg: '解密出错'
                },
            };
        }
    }
}

module.exports = HomeController;
