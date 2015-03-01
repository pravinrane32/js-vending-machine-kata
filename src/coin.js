var Coin = (function(){

    return {
      penny: function(){
        return createCoin('Penny', 0.01, 2.500, 19.05);
      },
      nickel : function(){
          return createCoin('Nickel', 0.05, 5.000, 21.21);
      },
      dime: function(){
          return createCoin('Dime', 0.10, 2.268, 17.91);
      },
      quarter: function(){
          return createCoin('Quarter', 0.25, 5.670, 24.26);
      },

      halfDoller: function(){
        return createCoin('HalfDoller', 0.5, 11.340, 26.49)
      }
  }

    function createCoin(id, value, weight, diameter){
      return {
           'id': id,
           'value': value,
           'weight': weight,
           'diameter': diameter
      }
    }

})();
