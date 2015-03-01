describe('Coins', function(){

  it('Penny ', function(){
        validateCoin(Coin.penny(),
                     'Penny', 0.01);
    });

    it('Nickel', function(){
        validateCoin(Coin.nickel(),
                     'Nickel', 0.05);
    });

    it('Dime', function(){
        validateCoin(Coin.dime(),
                   'Dime', 0.10);
    });

    it('Quarter', function(){
        validateCoin(Coin.quarter(),
                   'Quarter', 0.25);

    });

    it('HalfDoller', function(){
        validateCoin(Coin.halfDoller(),
                   'HalfDoller', 0.5);

    });

    function validateCoin(coin, id, value){
      expect(coin.id).toEqual(id);
      expect(coin.value).toEqual(value);
    }

});
