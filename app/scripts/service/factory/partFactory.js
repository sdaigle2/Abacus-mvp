angular.module('abacuApp')
  .factory('part', ['$http', 'option', function ($http, option) {

    //##########################  Constructor  #########################
    function part(_id) {
      this.id = _id;
      this.name;
      this.numSubImages;
      this.zRank = [[]];
      this.defaultOptionID;
      this.options = [];

    }


    /************instance functions**************/

    part.prototype = {
      load: function(){
        http.get('/data/partData.json')
          .success(function(data){
            var partData = data;
            for(var partIndex = 0 ; partIndex < partData.length; partIndex++){
              if(parData.partID = id){
                this.name = partData[partIndex].name;
                this.numSubImages = partData[partIndex].numSubImages;
                this.zRank = partData[partIndex].zRank;
                this.defaultOptionID = partData[partIndex].defaultOptionID;
                this.options = [];

                for (var optionIndex = 0; optionIndex < partData[partIndex]; optionIndex++){
                  var optionID = partData[partIndex].optionIndex.id;
                  this.option[optionIndex] = new option(optionID);
                }
              }
            }
          })
          .error(function(data){
            console.log(data + "option request failed")
          });
      },


      getOptionData: function(id){
        for (var j = 0; j < this.options.length; j++) {
          if (this.options[j].optionID === id) {
            return this.option[j];
          }
        }
        return null;
      },


    }

  }]);
