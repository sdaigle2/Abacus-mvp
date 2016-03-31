'use strict';

/*
* This factory produces PreviewImage objects
* A PreviewImage is a helper class used by Wheelchair to construct its rotatable preview image
* More complete documentation for how preview images are generated at: docs/ImageGeneration.txt
* The important function is getImages(angle) which returns an array of objects containing imageURLs sorted by their zRank
*/
angular.module('abacuApp')
  .factory('previewImage', ['Angles', 'FrameData', '_', function (Angles, FrameData, _) {

    //##########################  Constructor  #########################
    function PreviewImage( urlFolder, frameID, partData ) {

      this.baseURL = '../../../images/' + urlFolder + '/';
      this.frameID = frameID;
      this.parts = [];
      this.dirty = true; //Indicates if the parts array been changed
      this.lastAngle = -1; //What angle the image was last requested from
      this.images = [];


      for (var i = 0; i < partData.length; i++) {
        this.parts.push({
          partID: partData[i].partID,
          optionID: partData[i].optionID,
          colorID: partData[i].colorID
        });
      }
    }


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
      
      setColorForMultiPart: function (pID, oID, cID) {
        var option = _.find(this.parts, {partID: pID, optionID: oID});
        if (option) {
          option.colorID = cID;
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
        if (this.dirty === false && angle === this.lastAngle) //Check if images is unchanged
          return this.images;

        this.images = [];

        //Generate array of images with zRank's
        for (var i = 0; i < this.parts.length; i++) {
          var curPart = this.parts[i];
          var curPartData = FrameData.getFramePart(this.frameID, this.parts[i].partID);
          var numSubImages = curPartData.getNumSubImages();

          if (numSubImages === 0) {
            // special case for Miscelaneous parts
            if (curPart.partID === 10000 && curPart.optionID === 10100) {
              this.images.push({
                URL: this.getPartPreviewImageURL(curPart, 0, angle),
                zRank: curPartData.getZRank(0, angle)
              });
            }
          } else {
            for (var j = 0; j < numSubImages; j++) {
              this.images.push({
                URL: this.getPartPreviewImageURL(curPart, j, angle),
                zRank: curPartData.getZRank(j, angle)
              });
            }
          }
        }

        //Sort array by zRanks
        this.images.sort(function (a, b) {
          return (a.zRank - b.zRank);
        });

        //Reset dirtyness trackers
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
        var partURL = this.baseURL + 'frame' + frameIDString + '/';
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
        //'baseURL/frame0/part1/2_3_4_Front.png'
      }

    };



    //Don't touch this
    return (PreviewImage);
  }]);
