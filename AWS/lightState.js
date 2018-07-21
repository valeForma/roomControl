module.exports = class LightState {
   constructor(orario , data , livello , tipoLuce){
        this.time= orario;
        this. date= data;
        this.level = livello;
        this.lux = tipoLuce;
   }

    lightStateListConverter(toParse){
        var ds= null;
        const lightStateList =[]
        toParse.Items.forEach((p)=>{
            ds = new LightState(p.orario.N , p.data.S , (Number(p.livello.N)).toFixed(2) , p.tipoLuce.S);

           lightStateList.push(ds);
        })
        lightStateList.sort((obj1,obj2)=>{
            return obj1.time - obj2.time;
        });

        return lightStateList;
    }
}