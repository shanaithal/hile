"use strict";
var app = angular.module("comingsoon",[]);

app.controller('comingSoon',comingSoon);


function comingSoon(){

  $(document).ready(function() {
    $('select').material_select();
  });

  var vm = this;

  vm.cityOptions = [{
    "name":"Bangalore",
    "id":1
  }];

  vm.city = vm.cityOptions[0];
  vm.intrested = 'YES'

  vm.openDialog = function(){
    $('#modal1').openModal();
  }

  vm.postFormData = function(){
    //var deferred = $q.defer();
    var url = "https:///docs.google.com/forms/d/1sWNUGVknppZ21VquOK1vBnY0WNYJqOP9Qh37JFWyQDQ/formResponse";
    var data = {
      "entry_825968406": vm.email,
        "entry_1784347391": vm.city.name,
        "entry_1253588380": vm.intrested
      };

    $.ajax({
      url: url,
      data: data,
      type: "POST",
      dataType: "xml",
      statusCode: {
        0: function () {
          $('#modal1').closeModal();
          Materialize.toast('Smart Move !! , we will get back to you shortly. Thank you', 5000, 'confirmation');
        },
        200: function () {
          $('#modal1').closeModal();
          Materialize.toast('Smart Move !! , we will get back to you shortly. Thank you', 5000, 'confirmation');
        }
      }
    });
  }

  vm.recordResponse = function(){
    vm.postFormData();

  }

}