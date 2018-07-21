var express = require('express');
var router = express.Router();
var  _ = require('lodash');
var AwsService =require('../AWS/awsUtility');
var AwsDevice = require('../AWS/awsDevice');
var service= new AwsService();
var device= new AwsDevice();

/* GET home page. */
router.get('/', function(req, res, next) {

    res.render('index',{title:'Room Control'});

});
router.get('/room', function(req, res, next) {
    var param = _.pick(req.query,['date']);
    console.log(param);
    service.getRoomFullSate(param).then((room)=>{
        console.log(room);

        res.send({room:room});
    }).catch((err)=>{
        console.log(err);
        res.status(404).send();
    });

});
router.get('/doors', function(req, res, next) {
    console.log(req.query);
    var param = _.pick(req.query,['date']);
    service.getFullDoorState(param).then((doors)=>{
        console.log(doors);

        res.send({doors:doors});
    }).catch((err)=>{
        console.log(err);
        res.status(404).send();
    });

});
router.get('/light', function(req, res, next) {
    var param = _.pick(req.query,['date']);
    service.getCustomLightState(param).then((lights)=>{
        console.log(lights);

        res.send({lights: lights});
    }).catch((err)=>{
        console.log(err);
        res.status(404).send();
    });

});
router.get('/options', function(req, res, next) {

    service.getOptions().then((data)=>{
        console.log(data);

        res.send(data);
    }).catch((err)=>{
        console.log(err);
        res.status(404).send();
    });

});
router.post('/lights/modify' , function(req,res,next){
   console.log(req.body);
   device.sendLightOption(req.body)
    res.send({result:"ok"})
});
router.post('/options/modify' , function(req,res,next){
    console.log(req.body);
    device.sendOption(req.body)
    res.send({result:"ok"})
});

module.exports = router;
