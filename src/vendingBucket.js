var VendingBucket = function(product, quantity){

	if(!product || !quantity || quantity < 0)
		throw 'Invalid product or quantity';

	var self = {};

	self.product = function(){ return product;};
	self.isAvailable = function(){ return quantity != 0;};
	self.stock = function(){ return quantity;};
	self.dispense = function(){
		if(quantity > 0){
			quantity--; 
			return 1;
		}
		return 0;
	};

	return self;
};