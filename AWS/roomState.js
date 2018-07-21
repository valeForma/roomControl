module.exports = class RoomState {

    constructor(time , date , temperature ,humidity ,lux ){
        this.time=time;
        this.date = date;
        this.temperature = temperature;
        this.humidity = humidity;
        this.lux = lux;
    }
   roomStateListConverter(toParse){
        var roomStateList=[];
        toParse.Items.forEach((rs)=>{
            var rsp=new RoomState(rs.orario.N,rs.data.S,rs.temperatura.N,rs.umidita.N,rs.lux.N);
            roomStateList.push(rsp);
        });
        roomStateList.sort((obj1,obj2)=>{
            return obj1.time - obj2.time;
        });
        return roomStateList;
   }
}