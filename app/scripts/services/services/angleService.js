'use strict';

/**
 * @ngdoc function
 * @name abacuApp.static factory:angleService
 * @description
 * # angleService
 * Service of the abacuApp
 */
angular.module('abacuApp')
  .service('Angles', [function () {

    return {

      //The angle type of the wheelchair image
      angleType: {
        BACK: 0,
        BACKRIGHT: 1,
        RIGHT: 2,
        FRONTRIGHT: 3,
        FRONT: 4
      },

      //The number of angles
      numAngles: 5,

      //Returns the angle as a String
      getAngleName: function (angle) {
        switch (angle) {
          case this.angleType.FRONT:
            return 'Front';
          case this.angleType.FRONTRIGHT:
            return 'FrontRight';
          case this.angleType.RIGHT:
            return 'Right';
          case this.angleType.BACK:
            return 'Back';
          case this.angleType.BACKRIGHT:
            return 'BackRight';
          default:
            return 'InvalidAngle';
        }
      }
    }

  }]);

