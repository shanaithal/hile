/**
 * RentingController for Renting module
 */
'use strict'

export default class RentingController {
    constructor() {
        var renting = this;

        $(function() {
            $('.slider').slider({
                full_width: true
            });
            $('ul.tabs').tabs();
            $(".button-collapse_1").sideNav();

        });

        $('.button-collapse').sideNav('hide');
        $("#relatedRentItems").owlCarousel();

        renting.search = "Search here";
        renting.Items = [];
        renting.HouseItems = [];
        renting.Reviews = [];

        for (var i = 0; i < 40; i++)
            renting.Items.push(i);

        for (var i = 0; i < 6; i++)
            renting.HouseItems.push(i);

        for (var i = 0; i < 10; i++)
            renting.Reviews.push(i);




    }
}
