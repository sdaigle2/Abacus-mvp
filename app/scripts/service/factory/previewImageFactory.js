'use strict';

angular.module('abacuApp')
  .factory('previewImage', ['Angles', function (Angles) {

    //##########################  Constructor  #########################
    function PreviewImage( urlFolder, frameID, partData ) {

      this.baseURL = '/images/chairPic/' + urlFolder + '/';
      this.frameID = frameID;
      this.parts = [];
      this.dirty = true; //Indicates if the parts array been changed
      this.lastAngle = -1;
      this.images = [];


      for (var i = 0; i < partData.length; i++) {
        this.parts.push({
          partID: partData[i].partID,
          optionID: partData[i].optionID,
          colorID: partData[i].colorID
        });
      }
    };


    /************instance functions**************/

    PreviewImage.prototype = {

      getPart: function (pID) {
        for (var i = 0; i < this.parts.length; i++)
          if (this.parts[i].partID === pID)
            return this.parts[i];
        return null;
      },

      setOptionForPart: function (pID, oID) {
        var p = this.getPart(pID);
        if (p !== null) {
          var o = FrameData.getFrame(this.frameID).getPartOption(pID, oID);
          p.optionID = oID;
          p.colorID = o.getDefaultColorID();
          this.dirty = true;
        }
      },

      setColorForPart: function (pID, cID) {
        var p = this.getPart(pID);
        if (p !== null) {
          p.colorID = cID;
          this.dirty = true;
        }
      },

      setOptionAndColorForPart: function (pID, oID, cID) {
        var p = this.getPart(pID);
        if (p !== null) {
          p.optionID = oID;
          p.colorID = cID;
          this.dirty = true;
        }
      },

      //Returns an array of image objects sorted by zRank
      getImages: function (angle) {
        if (this.dirty === false && angle === this.lastAngle)
          return this.images;

        this.images = [];
        //Generate array of images with zRank's
        for (var i = 0; i < this.parts.length; i++) {
          var curPart = this.parts[i];
          var curPartData = FrameData.getFramePart(this.frameID, this.parts[i].partID);
          var numSubImages = curPartData.getNumSubImages();
          for (var j = 0; j < numSubImages; j++) {
            this.images.push({
              URL: this.getPartPreviewImageURL(curPart, j, angle),
              zRank: curPartData.getZRank(j, angle)
            });
          }
        }

        //Sort array by zRanks
        this.images.sort(function (a, b) {
          return (a.zRank - b.zRank);
        });

        this.lastAngle = angle;
        this.dirty = false;

        return this.images;
      },

      //Generates a URL for the given part based on the frame, partID,
      //OptionID, ColorID, SubImageIndex, and Angle
      getPartPreviewImageURL: function (curPart, subImageIndex, angle) {
        var frameIDString = '' + this.frameID;
        var partIDString = '' + curPart.partID;

        var optionIDString =     curPart.optionID;
        var colorString    = '_' + curPart.colorID;
        var subIndString   = '_' + subImageIndex;
        var angleString    = '_' + Angles.getAngleName(angle);
        var partURL = previewBaseURL + 'frame' + frameIDString + '/';
        partURL += 'part' + partIDString + '/';
        partURL += optionIDString + colorString + subIndString + angleString + '.png';

        return partURL;

        //FrameID = 0
        //PartID = 1
        //OptionID = 2
        //ColorID = 3
        //SubImageIndex = 4
        //CurAngle = FRONT
        //    CREATES
        //'baseURL/frame1/part1/2_3_4_Front.png'
      },

    };



    //Don't touch this
    return (PreviewImage);
  }]);
