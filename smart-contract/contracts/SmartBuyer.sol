pragma solidity ^0.4.4;

import "./Ownable.sol";

contract SmartBuyer is Ownable {

  address public siroop;
  address public austrianPost;
  //mapping (address => bool) public affiliates;
  mapping (address => bool) public merchants;
  mapping (address => bool) public blogOwners;
  mapping (uint => address) public products;
  mapping (uint => bool) public electronicProducts;

  // Orders
  uint orderPointer;
  mapping (uint => address) orders;
  mapping (uint => address) ordersMerchant;
  mapping (uint => uint) orderAmount;
  mapping (uint => bool) orderRefunded;
  mapping (address => uint) deliveredOrders;



  // Settings
  mapping (uint => uint) public productMaxOrders;
  mapping (uint => uint) public productStock;



  // Affiliate bonus in percent
  /*
  public affiliateBonus = 3;

  function changeAffiliateFee(uint _bonus) public onlyOwner {
    require(fee <= _bonus);
    affiliateBonus = _bonus;
  }


  // Check if affiliate is on whitelist
  modifier isAffiliate(address _affiliate) {
    require(affiliates[_affiliate]);
    _;
  }
    */

  // Check if merchant is on whitelist
  modifier isMerchant(address _merchant) {
    require(merchants[_merchant]);
    _;
  }

  // Check if merchant is on whitelist
  modifier isBlogOwner(address _blogOwner) {
    require(blogOwners[_blogOwner]);
    _;
  }

  // Check if merchant is the owner of a specific product
  modifier productFitsMerchant(uint _productID, address _merchant) {
    require(products[_productID]==_merchant);
    _;
  }

  // Enforce ToS max amount per purchase
  modifier checkMaxOrders(uint _productID, uint _order) {
    require(productMaxOrders[_productID] >= _order);
    _;
  }

  // Enforce ToS check if there are enough procuts in stock
  modifier checkProductStock(uint _productID, uint _order) {
    require(productStock[_productID] >= _order);
    _;
  }

  function changeSiroop(address _siroop) public onlyOwner {
    require(_siroop != 0x0);
    siroop = _siroop;
  }


  function addMerchant(address _merchant) public onlyOwner {
    merchants[_merchant] = true;
  }

  function addBlogOwner(address _blogOwner) public onlyOwner {
    blogOwners[_blogOwner] = true;
  }

  function addProduct(uint _productID, address _merchant, bool _category) public onlyOwner {
    products[_productID] = _merchant;
    electronicProducts[_productID] = _category;
  }

  // package delivery
  function productDelivered(uint _orderID) {
    // only the buyer can call this method
    require(msg.sender == orders[_orderID]);
    deliveredOrders[msg.sender] = now;
  }


  // this method is triggered by the merchant once the return arrives
  function returnArrived(uint _orderID) {
      require(msg.sender == orders[_orderID] && now <= (deliveredOrders[msg.sender] + 14 days) && !orderRefunded[_orderID]);
      require(orderAmount[_orderID] <= this.balance);
      orderRefunded[_orderID] = true;
      orders[_orderID].transfer(orderAmount[_orderID]);
  }


  // Check if user provided parameters are on whitelist otherwise an attack could inject own parameters
  function doPurchase(uint _productID, address _merchant, address _blogOwner, bool isSiroop) payable public

  isMerchant(_merchant)
  isBlogOwner(_blogOwner)
  productFitsMerchant(_productID, _merchant)
  // TODO: implement price check of product, currently every price is accepted!!
  returns(bool result) {
    result = saveSplit(_productID, _merchant, _blogOwner, isSiroop);

    orders[orderPointer] = msg.sender;
    orderAmount[orderPointer] = msg.value;
    ordersMerchant[orderPointer] = _merchant;
    orderPointer++;

    return result;
  }


  function saveSplit(uint _productID, address _merchant, address _blogOwner, bool _isSiroop) internal returns(bool result){

    uint merchantAmount = 0;
    uint siroopAmount = 0;
    uint affiliateAmount = 0;


    // There is no third party envolved, i.e., blog owner is siroop therefore there is no affiliate
    // whole amount goes to siroop
    if(_isSiroop && _merchant == 0x0) {
      siroopAmount = msg.value * 97 / 100;
      affiliateAmount = msg.value - siroopAmount;
      assert(affiliateAmount < msg.value); // sanity check
      siroop.transfer(siroopAmount);
      _blogOwner.transfer(affiliateAmount);
      return true;
    }

    // Merchant is not equal to siroop
    if(!_isSiroop && _merchant != 0x0) {
      merchantAmount = msg.value * 97 / 100;
      affiliateAmount = msg.value - merchantAmount;
      assert(merchantAmount < msg.value);
      _blogOwner.transfer(affiliateAmount);
      _merchant.transfer(merchantAmount);
      return true;
    }

    if(_isSiroop && _merchant != 0x0) {

      if(electronicProducts[_productID]) {
        merchantAmount = msg.value * 91 / 100;
        siroopAmount = msg.value * 6 / 100;
        affiliateAmount = msg.value * 3 / 100;
      } else {
        merchantAmount = msg.value * 87 / 100;
        siroopAmount = msg.value * 10 / 100;
        affiliateAmount = msg.value * 3 / 100;
      }

      assert(merchantAmount + siroopAmount + affiliateAmount == msg.value); // sanity check
      siroop.transfer(siroopAmount);
      _blogOwner.transfer(affiliateAmount);
      _merchant.transfer(merchantAmount);
      return true;
    }

    // Something went wrong, revert the transaction
    revert();

  }

  // just some cash being sent. This is used for returns. Proper deposit method has to be implemented
  function() payable {

  }


}
