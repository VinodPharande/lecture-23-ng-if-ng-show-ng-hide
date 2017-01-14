(function(){
  'use strict';

  angular.module('ControllerApp', [])
  .controller('ShoppingListController', ShoppingListController)
  .provider('ShoppingListService', ShoppingListServiceProvider)
  .config(Config);

  Config.$inject = ['ShoppingListServiceProvider'];
  function Config(ShoppingListServiceProvider) {
    // save vinod from his=mslef
    ShoppingListServiceProvider.defaults.maxItems = 2;
  }

  // LIST #1 - controller: unlimited items
  ShoppingListController.$inject = ['ShoppingListService'];
  function ShoppingListController(ShoppingListService) {
    var list = this;
    list.items = ShoppingListService.getItems();
    list.itemName = "";
    list.quantity = "";
    // consuming call to service to add item method
    list.addItem = function () {
      try {
        ShoppingListService.addItem(list.itemName, list.itemQuantity);
      } catch (e) {
        list.errorMessage = e.message;
      }
    }
    // consuming call to service to remove item method
    list.removeItem = function (itemIndex) {
      ShoppingListService.removeItem(itemIndex);
    }
  }

  // LIST #2 - controller: (limited to 3 items)
  ShoppingListController2.$inject = ['ShoppingListFactory'];
  function ShoppingListController2(ShoppingListFactory) {
    var list2 = this;
    // Use factory to create new shopping list service
    var shoppingList = ShoppingListFactory(3);

    list2.items = shoppingList.getItems();
    list2.itemName = "";
    list2.itemQuantity = "";
    // consuming call to service to get items method
    list2.addItem = function () {
        try {
          console.log('inside ctril2');
          shoppingList.addItem(list2.itemName, list2.itemQuantity)
        } catch (error) {
          list2.errorMessage = error.message;
        }
      }
      list2.removeItem = function (itemIndex) {
        shoppingList.removeItem(itemIndex);
      }
  };

  // Service implementation
  // If not specified, maxItems assumed unlimited
  function ShoppingListService(maxItems) {
      var service = this;

      // List of shopping items
      var items = [];

      // Servie method for adding item
      service.addItem = function (itemName, quantity) {
        console.log('inside additem');
        if ((maxItems === undefined) || (maxItems !== undefined) && (items.length < maxItems)) {
          var item = {
            name: itemName,
            quantity: quantity
          };
          items.push(item);
        }else{
          throw new Error("Max Items (" + maxItems +") reached.");
        }
      };

      // Servie method to remove items from list
      service.removeItem = function (itemIndex) {
        console.log('inside removeitem: ', itemIndex);
        items.splice(itemIndex, 1);
      }

      // Servie method to get items
      service.getItems = function () {
        console.log('inside getitems: ', items);
        return items;
      };
  }

  function ShoppingListServiceProvider() {
    var provider = this;

    provider.defaults = {
      maxItems: 10
    };
    provider.$get = function () {
      var shoppingList = new ShoppingListService(provider.defaults.maxItems);
      return shoppingList;
    }
    // var factory = function (maxItems) {
    //   return new ShoppingListService(maxItems);
    // };
    // return factory;
  }
})();
