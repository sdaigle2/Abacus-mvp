'use strict';

angular.module('abacuApp')
  .factory('Wheelchair', [ 'FrameData', 'previewImage', 'Units', function (FrameData, previewImage, Units) {

    //##########################  Constructor  #########################

    function Wheelchair(frameID) {
      this.frameID = frameID;
      this.parts = [];
      this.measures = [];
      this.desc = '';
      this.basePrice = 0;
      this.baseWeight = 0;
      this.title = 'My Custom Wheelchair';

      var frame = FrameData.getFrame(frameID);
      var parts = frame.getParts();
      var meas = frame.getMeasures();

      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        this.parts.push({
          name: p.getName(),
          partID: p.getID(),
          optionID: p.getDefaultOptionID(),
          colorID: p.getDefaultOption().getDefaultColorID()
        });
      }

      for (var j = 0; j < meas.length; j++) {
        var m = meas[j];
        this.measures.push({
          name: m.getName(),
          measureID: m.getID(),
          measureOptionIndex: -1
        })
      }
      this.name = frame.name;
      this.desc = frame.desc;
      this.basePrice = frame.basePrice;
      this.baseWeight = frame.baseWeight;
      this.previewImageGenerator = new previewImage("chairPic",this.frameID, this.parts);
    };

    //#######################  Instance methods  ##########################
    Wheelchair.prototype = {

      //GETS
      getFrameID: function () { return this.frameID; },
      getName: function () { return this.name; },
      getTitle: function () { return this.title; },
      getParts: function () { return this.parts; },
      getMeasures: function () { return this.measures; },
      getNumParts: function () { return this.parts.length; },
      getNumMeasures: function () { return this.measures.length; },

      getPart: function (pID) {
        for (var i = 0; i < this.parts.length; i++)
          if (this.parts[i].partID === pID)
            return this.parts[i];
        return null;
      },

      getPartByIndex: function (index) {
        if (index >= 0 && index <= this.parts.length)
          return this.parts[index];
        return null;
      },

      getOptionIDForPart: function (pID) {
        var p = this.getPart(pID);
        if (p !== null)
          return p.optionID;
        return -1;
      },

      getColorIDForPart: function (pID) {
        var p = this.getPart(pID);
        if (p !== null)
          return p.colorID;
        return -1;
      },

      getMeasure: function (mID) {
        for (var i = 0; i < this.measures.length; i++)
          if (this.measures[i].measureID === mID)
            return this.measures[i];
        return null;
      },

      getMeasureByIndex: function (index) {
        if (index >= 0 && index < this.measures.length)
          return this.measures[index];
        return null;
      },

      getOptionIndexForMeasure: function (mID) {
        var m = getMeasure(mID);
        if (m !== null)
          return m.measureOptionIndex;
        return -1;
      },

      getPartDetails: function (pID, unitSys) {
        var curPart = this.getPart(pID);
        var oID = curPart.optionID;
        var cID = curPart.colorID;

        var part = FrameData.getFramePart(this.frameID, pID);
        var option = part.getOption(oID);
        var color = option.getColor(cID);

        var colorName = (color === null) ? '' : color.getName();

        var priceString = (option.getPrice() < 0) ? '-$' : '$';
        priceString += Math.abs(option.getPrice()).toFixed(2);

        var weightString = (option.getWeight() * Units.getWeightFactor(unitSys)) + ' ' + Units.getWeightName(unitSys);

        return {
          partName: part.getName(),
          optionName: option.getName(),
          colorName: colorName,
          priceString: priceString,
          weightString: weightString
        };
      },

      getMeasureDetails: function (mID, unitSys) {
        var curMeas = this.getMeasure(mID);
        var i = curMeas.measureOptionIndex;
        var meas = FrameData.getFrameMeasure(this.frameID, mID);

        var optionString = 'NOT SELECTED';
        var priceString = '';
        var weightString = '';

        if (i != -1) {
          optionString = meas.getOption(unitSys, i);
          optionString += " " + meas.getUnits(unitSys);
          priceString = ((meas.getPrice(i) < 0) ? "-$" : "$") + Math.abs(meas.getPrice(i).toFixed(2));
          weightString = (meas.getWeight(i) * Units.getWeightFactor(unitSys)) + ' ' + Units.getWeightName(unitSys);
        }

        return {
          name: meas.getName(),
          optionString: optionString,
          priceString: priceString,
          weightString: weightString
        }
      },

      getPreviewImages: function (angle) {
        return this.previewImageGenerator.getImages(angle);
      },


      //SETS
      setOptionForPart: function (pID, oID) {
        var p = this.getPart(pID);
        if (p !== null) {
          var o = FrameData.getFrame(this.frameID).getPartOption(pID, oID);
          p.optionID = oID;
          p.colorID = o.getDefaultColorID();
          this.previewImageGenerator.setOptionForPart(pID, oID);
        }
      },

      setColorForPart: function (pID, cID) {
        var p = this.getPart(pID);
        if (p !== null) {
          p.colorID = cID;
          this.previewImageGenerator.setColorForPart(pID, cID);
        }
      },

      setOptionAndColorForPart: function (pID, oID, cID) {
        var p = this.getPart(pID);
        if (p !== null) {
          p.optionID = oID;
          p.colorID = cID;
          this.previewImageGenerator.setOptionAndColorForPart(pID, oID, cID);
        }
      },

      setOptionIndexForMeasure: function (mID, index) {
        var m = this.getMeasure(mID);
        if (m !== null)
          m.measureOptionIndex = index;
      },

      //Calculate Total Weight
      getTotalWeight: function () {
        var frame = FrameData.getFrame(this.frameID);
        var totalWeight = frame.getBaseWeight();
        for (var i = 0; i < this.parts.length; i++) {
          var p = frame.getPart(this.parts[i].partID);
          var o = p.getOption(this.parts[i].optionID);
          totalWeight += o.getWeight();
        }
        for (var j = 0; j < this.measures.length; j++) {
          if (this.measures[j].measureOptionIndex !== -1) {
            var m = frame.getMeasure(this.measures[j].measureID);
            totalWeight += m.getWeight(this.measures[j].measureOptionIndex);
          }
        }
        return totalWeight;
      },

      //Calculate total Price
      getTotalPrice: function () {
        var frame = FrameData.getFrame(this.frameID);
        var totalPrice = frame.getBasePrice();
        for (var i = 0; i < this.parts.length; i++) {
          var p = frame.getPart(this.parts[i].partID);
          var o = p.getOption(this.parts[i].optionID);
          totalPrice += o.getPrice();
        }
        for (var j = 0; j < this.measures.length; j++) {
          if (this.measures[j].measureOptionIndex !== -1) {
            var m = frame.getMeasure(this.measures[j].measureID);
            totalPrice += m.getPrice(this.measures[j].measureOptionIndex);
          }
        }

        return totalPrice;
      },


      //Returns true if all measurements have a selected option
      allMeasuresSet: function () {
        for (var i = 0; i < this.measures.length; i++) {
          if (this.measures[i].measureOptionIndex === -1) {
            return false;
          }
        }
        return true;
      }


    };

    //Don't touch this
    return (Wheelchair);
  }]);



/*
curWheelchair = {
  frameID
  parts[] = {partID, optionID, colorID}
  measures[] = {measureID, measureOptionIndex}
}


*/

