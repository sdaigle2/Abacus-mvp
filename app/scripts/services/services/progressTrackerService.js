'use strict';

/**
 * @ngdoc function
 * @name abacuApp.static service:ProgressTrackerService
 * @description
 * # progressTrackerService
 */
angular.module('abacuApp')
  .service('ProgressTracker', ['_', 'cfpLoadingBar', function (_, cfpLoadingBar) {
    
    var GlobalProgressTracker = function () {

      GlobalProgressTracker.prototype.init = function() {
        this.numItems = 0;
        this.numDone = 0;
        this.started = false;
      };

      GlobalProgressTracker.prototype.addItem = function () {
        this.numItems++;

        if (!this.started) {
          this.started = true;
          cfpLoadingBar.start();
          cfpLoadingBar.set(this.currentProgress());
        }
      };

      GlobalProgressTracker.prototype.currentProgress = function() {
        return this.numDone / this.numItems;
      };

      GlobalProgressTracker.prototype.updateProgressBar = function() {
        cfpLoadingBar.set(this.currentProgress());
      };

      GlobalProgressTracker.prototype.itemLoaded = function () {
        if (this.numItems > 0 && this.numDone !== this.numItems) {
          this.numDone++;
        }

        if (this.numDone === this.numItems) {
          cfpLoadingBar.complete();
          this.init(); // reset the configuration
        } else {
          this.updateProgressBar();
        }
      };

      GlobalProgressTracker.prototype.itemFailed = function() {
        if (this.numItems > 0) {
          this.numItems--;
          this.updateProgressBar();
        }
      };

      this.init();
    };

    return new GlobalProgressTracker();
  }]);
