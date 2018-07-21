var AWS = require('aws-sdk');
var DoorState = require('./doorState');
var RoomState = require('./roomState');
var LightState = require('./lightState');
var moment =require('moment');
'use strict';

module.exports =class AwsService {

    constructor(){
        AWS.config.loadFromPath('./keys/config.json');
         this.dydb = new AWS.DynamoDB();
    }

    getFullDoorState(param){
        var d=new Date();
        if(  param.date !== null && param.date !== ''){
         try{
             d= new Date(param.date);
         }catch(err){
             console.log(err)
             d=new Date();
         }

        }
        else{

        }
        console.log(d);
        console.log(d.getTime());
        var doorState=new DoorState();
        var params = {
            ExpressionAttributeValues: {
                ":val": {
                    N: (d.getTime()/1000).toString()
                }
            },
            FilterExpression: 'orario > :val',
            TableName: "doorState"
        };
        return new Promise((resolve,reject)=>{
            this.dydb.scan(params, function(err, data) {
                if (err) {console.log(err, err.stack);
                    reject (err);
                }
                else {
                    console.log("data retrived");
                    var doorStateList=doorState.doorStateListConverter(data);
                    resolve(doorStateList);

                }

            });
        });

    }
    getRoomFullSate(param){
        var d=new Date();
        if(  param.date !== null && param.date !== ''){
            try{
                d= new Date(param.date);
            }catch(err){
                console.log(err)
                d=new Date();
            }

        }
        else{

        }
        var roomState=new RoomState();

        console.log(d);
        var params = {
            ExpressionAttributeValues: {
                    ":val": {
                         N: (d.getTime()/1000).toString()
                         }
             },
        FilterExpression: 'orario > :val',

            TableName: "roomState"
        };
        return new Promise((resolve,reject)=>{
            this.dydb.scan(params, function(err, data) {
                if (err) {console.log(err, err.stack);
                    reject (err);
                }
                else {
                    console.log("data retrived");
                    var roomStateList=roomState.roomStateListConverter(data);
                    resolve(roomStateList);

                }

            });
        });
    }
    getCustomLightState(param){
        var d=new Date();
        if(  param.date !== null && param.date !== ''){
            try{
                d= new Date(param.date);
            }catch(err){
                console.log(err)
                d=new Date();
            }

        }
        else{

        }
        var lightState = new LightState();
        var params = {
            ExpressionAttributeValues: {
                ":val": {
                    N: (d.getTime()/1000).toString()
                }
            },
            FilterExpression: 'orario > :val',

            TableName: "lightsControl"
        };
        return new Promise((resolve,reject)=>{
            this.dydb.scan(params, function(err, data) {
                if (err) {console.log(err, err.stack);
                    reject (err);
                }
                else {
                    console.log("data retrived");
                    var lightStateList=lightState.lightStateListConverter(data);
                    resolve(lightStateList);

                }

            });
        });
    }
    getOptions(){


        var params = {
            TableName: "options"
        };
        return new Promise((resolve,reject)=>{
            this.dydb.scan(params, function(err, data) {
                if (err) {console.log(err, err.stack);
                    reject (err);
                }
                else {
                    resolve(data);

                }

            });
        });
    }
}







