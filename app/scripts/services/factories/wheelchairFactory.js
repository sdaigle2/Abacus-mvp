'use strict';

/*
 * This factory produces Wheelchair objects
 * A Wheelchair object keeps track of a user-created wheelchair design
 * To do this, the Wheelchair object tracks {partID, optionID, colorID} for parts and {measureID, optionIndex} for measures
 * The wheelchair also has a PreviewImage that assists in generating the array of preview images
 */
angular.module('abacuApp')
  .factory('Wheelchair', ['FrameData', 'previewImage', 'Units', '_', function (FrameData, previewImage, Units, _) {

    //##########################  Constructor  #########################

    function Wheelchair(frameID) {
      this.parts = [];
      this.measures = [];
      this.inCurOrder = false;
      this.grantAmount = 0;
      if (typeof frameID === 'number') {
        this.frameID = frameID;
        this.title = 'My Custom Wheelchair';

        //Get data from FrameData
        var frame = FrameData.getFrame(frameID);
        this.name = frame.getName();
        var parts = frame.getParts();
        parts.forEach(function(pPart){
          pPart.options.forEach(function(pOption){
            pOption.setComments('');
          })
        });
        var meas = frame.getMeasures();

        //Generate parts array and set defaults
        for (var i = 0; i < parts.length; i++) {
          var p = parts[i];
          if(p.getDefaultOptionID() == -1){
            var defaultPart = {
              partID: p.getID(),
              optionID: p.getDefaultOptionID(),
              comments: '',
              colorIn: true       //indicator of if the part should follow other color choice
            }
          }else {
            var defaultPart = {
              partID: p.getID(),
              optionID: p.getDefaultOptionID(),
              colorID: p.getDefaultOption().getDefaultColorID(),
              sizeIndex: p.getDefaultOption().getDefaultSizeIndex(),
              comments: '',
              colorIn: true       //indicator of if the part should follow other color choice
            };
          }
          this.parts.push(defaultPart);
        }

        //Generate measures array and set default to -1 (NOT SELECTED)
        for (var j = 0; j < meas.length; j++) {
          var m = meas[j];
          this.measures.push({
            measureID: m.getID(),
            comments: m.getComments(),
            measureOptionIndex: -1
          })
        }
      }

      else {
        var wheelchair = frameID; //in this case frameID is a wheelchair json
        //####################### COPY CONSTRUCTOR ############################

        this.frameID = wheelchair.frameID;
        this.title = wheelchair.title;
        var frame = FrameData.getFrame(this.frameID);
        this.name = frame.getName();
        if(typeof grantAmount == 'undefined' ) {
          this.grantAmount = 0;
        }else {
          this.grantAmount = wheelchair.grantAmount;
        }
        this.inCurOrder = wheelchair.inCurOrder;
        //Copy Parts
        for (var i = 0; i < wheelchair.parts.length; i++) {
          var p = wheelchair.parts[i];
          var copyPart = {
            partID: p.partID,
            optionID: p.optionID,
            colorID: p.colorID,
            sizeIndex: p.sizeIndex,
            comments: p.comments,
            colorIn: p.colorIn
          };
          this.parts.push(copyPart);
        }

        //Copy Measures
        for (i = 0; i < wheelchair.measures.length; i++) {
          var m = wheelchair.measures[i];
          var copyMeasure = {
            measureID: m.measureID,
            measureOptionIndex: m.measureOptionIndex,
            comments: m.comments
          };
          this.measures.push(copyMeasure);
        }
      }
      //Helper PreviewImage object
      this.previewImageGenerator = new previewImage("chairPic", this.frameID, this.parts);
    };

    //#######################  Instance methods  ##########################
    Wheelchair.prototype = {



      //GETS
      getAll: function () {
        return {
          frameID: this.frameID,
          title: this.title,
          parts: this.parts,
          measures: this.measures,
          inCurOrder: this.inCurOrder,
          grantAmount: this.grantAmount
        }
      },

      getFrameID: function () {
        return this.frameID;
      },
      getTitle: function () {
        return this.title;
      },
      getName: function() {
        return this.name;
      },
      getParts: function () {
        return this.parts;
      },
      getMeasures: function () {
        return this.measures;
      },
      inCurOrder: function () {
        return this.inCurOrder;
      },
      getNumParts: function () {
        return this.parts.length;
      },
      getNumMeasures: function () {
        return this.measures.length;
      },

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

      getColorNameForPart: function(pID) {
        var p = this.getPart(pID);
        if(p != null){

        }
      },

      getSizeIndexForPart: function (pID) {
        var p = this.getPart(pID);
        if (p !== null)
          return p.sizeIndex;
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
        var m = this.getMeasure(mID);
        if (m !== null)
          return m.measureOptionIndex;
        return -1;
      },

      //Returns an object of display-formatted details about the given part
      getPartDetails: function (pID, unitSys) {
        var curPart = this.getPart(pID);
        if (curPart === null) {
          return {
            partName: '-',
            optionName: '-',
            colorName: '-',
            size: '-',
            priceString: '-',
            weightString: '-'
          };
        }
        var oID = curPart.optionID;
        var cID = curPart.colorID;
        var sizeIndex = curPart.sizeIndex;

        var part = FrameData.getFramePart(this.frameID, pID);
        var option = part.getOption(oID);
        if(oID != -1) {
          var color = option.getColor(cID);
          var size = option.getSize(sizeIndex);

          var colorName = (color === null) ? '' : color.getName();

          var priceString = (option.getPrice() < 0) ? '-$' : '$';
          priceString += Math.abs(option.getPrice()).toFixed(2);

          var weightString = (option.getWeight() * Units.getWeightFactor(unitSys)).toFixed(2) + ' ' + Units.getWeightName(unitSys);

          return {
            partName: part.getName(),
            optionName: option.getName(),
            colorName: colorName,
            size: size,
            priceString: priceString,
            weightString: weightString
          };
        }else{
          return {
            partName: part.getName(),

          }
        }



      },

      //Returns an object of display-formatted details about the given measure
      getMeasureDetails: function (mID, unitSys) {
        var curMeas = this.getMeasure(mID);
        var i = curMeas.measureOptionIndex;
        var meas = FrameData.getFrameMeasure(this.frameID, mID);

        var optionString = 'NOT SELECTED';
        var priceString = '';
        var weightString = '';
        var altOptionString = '';

        if (i != -1) {
          optionString = meas.getOption(unitSys, i);
          optionString += " " + meas.getUnits(unitSys);
          priceString = ((meas.getPrice(i) < 0) ? "-$" : "$") + Math.abs(meas.getPrice(i).toFixed(2));
          weightString = (meas.getWeight(i) * Units.getWeightFactor(unitSys)) + ' ' + Units.getWeightName(unitSys);
          altOptionString = meas.getOption(1 - unitSys, i) + ' ' + meas.getUnits(1 - unitSys);
        }

        return {
          name: meas.getName(),
          optionString: optionString,
          priceString: priceString,
          weightString: weightString,
          altOptionString: altOptionString
        }
      },

      //Returns an array of images in zRank order that create the preview image
      getPreviewImages: function (angle) {
        return this.previewImageGenerator.getImages(angle);
      },

      getWheelImages: function (angle) {
        return this.wheelImageGenerator.getImages(angle);
      },

      getFrameImages: function (angle) {
        return this.frameImageGenerator.getImages(angle);
      },

      getGrantAmount: function() {
        return this.grantAmount;
      },

      //SETS
      setOptionForPart: function (pID, oID) {
        var p = this.getPart(pID);
        if (p !== null) {
          var o = FrameData.getFrame(this.frameID).getPartOption(pID, oID);
          p.optionID = oID;
          p.colorID = o.getDefaultColorID();
          p.sizeIndex = o.getDefaultSizeIndex();
          p.comments = o.getComments();
          this.previewImageGenerator.setOptionForPart(pID, oID);
        }
      },

      setMultiOptionForPart: function (pID, oID) {
          var o = FrameData.getFrame(this.frameID).getPartOption(pID, oID);
          this.parts.push({
            partID: pID,
            optionID: oID,
            colorID: o.getDefaultColorID(),
            sizeIndex: o.getDefaultSizeIndex(),
            comments: o.getComments()
          });
      },

      setColorForPart: function (pID, cID) {
        var p = this.getPart(pID);
        if (p !== null) {
          p.colorID = cID;
          this.previewImageGenerator.setColorForPart(pID, cID);
        }
      },

      setColorIn: function(pID) {
        var part = this.getPart(pID);
        part.colorIn = false;
      },

      setColorForMultiPart: function (pID, oID, cID) {
        var option = _.find(this.parts, {'partID': pID, 'optionID': oID});

        if (option) {
          option.colorID = cID;
          this.previewImageGenerator.setColorForMultiPart(pID, oID, cID);
        }
      },

      setSizeForPart: function (pID, sizeIndex) {
        console.log(sizeIndex);
        var p = this.getPart(pID);
        if (p !== null) {
          p.sizeIndex = sizeIndex;
        }
      },

      setOptionAndColorForPart: function (pID, oID, cID) {
        var p = this.getPart(pID);
        if (p !== null) {
          var o = FrameData.getFrame(this.frameID).getPartOption(pID, oID);
          p.optionID = oID;
          p.colorID = cID;
          p.sizeIndex = o.getDefaultSizeIndex();
          this.previewImageGenerator.setOptionAndColorForPart(pID, oID, cID);
        }
      },

      setOptionAndSizeForPart: function (pID, oID, sizeIndex) {
        var p = this.getPart(pID);
        if (p !== null) {
          var o = FrameData.getFrame(this.frameID).getPartOption(pID, oID);
          p.optionID = oID;
          p.sizeIndex = sizeIndex;
          p.colorID = o.getDefaultColorID();
          this.previewImageGenerator.setOptionForPart(pID, oID);
        }
      },

      setOptionIndexForMeasure: function (mID, index) {
        var m = this.getMeasure(mID);
        if (m !== null)
          m.measureOptionIndex = index;
      },

      setGrantAmount: function(val) {
        this.grantAmount = val;
      },

      removeMultiOption: function (optionID) {
        this.parts = _.reject(this.parts, {'optionID': optionID});
      },

      toggleInOrder: function () {
        this.inCurOrder = !this.inCurOrder;
      },
      //Calculate the total weight of the Wheelchair
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

      //Calculate the subtotal price of the Wheelchair
      getTotalPrice: function () {
        var frame = FrameData.getFrame(this.frameID);
        var totalPrice = frame.getBasePrice();
        for (var i = 0; i < this.parts.length; i++) {
          var p = frame.getPart(this.parts[i].partID);
          var o = p.getOption(this.parts[i].optionID);
          if(this.parts[i].optionID != -1) {
            totalPrice += o.getPrice();
          }
        }
        for (var j = 0; j < this.measures.length; j++) {
          if (this.measures[j].measureOptionIndex !== -1) {
            var m = frame.getMeasure(this.measures[j].measureID);
            totalPrice += m.getPrice(this.measures[j].measureOptionIndex);
          }
        }
        console.log(this.grantAmount);
        var updateTotal = totalPrice - this.grantAmount;
        return (updateTotal >=0 ? updateTotal : 0);
      },

      //Calculate the subtotal price of the Wheelchair for abacus ctrl without grantAmount due to sync problem
      getTotalPriceForAbacusCtrl: function () {
        var frame = FrameData.getFrame(this.frameID);
        var totalPrice = frame.getBasePrice();
        for (var i = 0; i < this.parts.length; i++) {
          var p = frame.getPart(this.parts[i].partID);
          var o = p.getOption(this.parts[i].optionID);
          if(this.parts[i].optionID != -1) {
            totalPrice += o.getPrice();
          }
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
      //A Wheelchair should not be purchaseable if any of the measurements are unset
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
  }

  ])
;


/*
 curWheelchair = {
 frameID
 parts[] = {partID, optionID, colorID}
 measures[] = {measureID, measureOptionIndex}
 }


 */

