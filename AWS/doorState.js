module.exports = class DoorState{

    constructor(time , date , state){
        this.date=date;
        this.state= state;
        this.time= time;
    }

    doorStateListConverter(toParse){
        var ds= null;
        const doorStateList =[]
        toParse.Items.forEach((p)=>{
            ds = new DoorState(p.orario.N,p.data.S,p.stato.S);

            doorStateList.push(ds);
        })
        doorStateList.sort((obj1,obj2)=>{
            return obj1.time - obj2.time;
        });

        return doorStateList;
    }
}