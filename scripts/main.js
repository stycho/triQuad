$(function () {

  var apiUrl = 'https://api.quadrigacx.com/v2/ticker?book=';

  function callData() {

    var btcCadJSON = $.ajax({
      type: 'GET',
      url: apiUrl + 'btc_cad',
      success: (data) => {
        $('#btc_cad_ask').replaceWith('<span id="btc_cad_ask">' + data.ask.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }) + '</span>');
        $('#btc_cad_bid').replaceWith('<span id="btc_cad_bid">' + data.bid.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }) + '</span>');
        $('#btc_cad_vol').replaceWith('<span id="btc_cad_vol">' + (data.volume * data.last).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }) + '</span>');
      },

      error: () => {
        console.log('error grabbing btc_cad');
      },
    });

    var ethCadJSON = $.ajax({
      type: 'GET',
      url: apiUrl + 'eth_cad',
      success: (data) => {
        $('#eth_cad_ask').replaceWith('<span id="eth_cad_ask">' + data.ask.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }) + '</span>');
        $('#eth_cad_bid').replaceWith('<span id="eth_cad_bid">' + data.bid.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }) + '</span>');
        $('#eth_cad_vol').replaceWith('<span id="btc_cad_vol">' + (data.volume * data.last).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }) + '</span>');
      },

      error: () => {
        aconsole.log('error grabbing eth_cad');
      },
    });

    var ethBtcJSON = $.ajax({
      type: 'GET',
      url: apiUrl + 'eth_btc',
      success: (data) => {
        $('#eth_btc_ask').replaceWith('<span id="eth_btc_ask">' + data.ask + ' </span>');
        $('#eth_btc_bid').replaceWith('<span id="eth_btc_bid">' + data.bid + ' </span>');
        $('#eth_btc_vol').replaceWith('<span id="eth_btc_vol">' + data.volume + '</span>');
      },

      error: () => {
        console.log('error grabbing eth_btc');
      },
    });

    $.when(btcCadJSON, ethCadJSON, ethBtcJSON).done((bc, ec, eb) => {


      var btcAmount = 1;
      var ethAmount = 1;

      var fiatRate = 0.5;
      var cryptoRate = 0.2;

      var btcToCad = applyFee(btcAmount * bc[0].bid, fiatRate);
      btcToCad = applyFee(btcToCad / ec[0].ask, fiatRate);
      btcToCad = applyFee(btcToCad * eb[0].bid, cryptoRate);

      var btcToEth = applyFee(btcAmount / eb[0].ask, cryptoRate);
      btcToEth = applyFee(btcToEth * ec[0].bid, fiatRate);
      btcToEth = applyFee(btcToEth / bc[0].ask, fiatRate);

      var ethToCad = applyFee(ethAmount * ec[0].bid, fiatRate);
      ethToCad = applyFee(ethToCad / bc[0].ask, fiatRate);
      ethToCad = applyFee(ethToCad / eb[0].ask, cryptoRate);

      var ethToBtc = applyFee(ethAmount * eb[0].bid, cryptoRate);
      ethToBtc = applyFee(ethToBtc * bc[0].bid, fiatRate);
      ethToBtc = applyFee(ethToBtc / ec[0].ask, fiatRate);

      $('#infos1').replaceWith('<span class="card-title" id="infos1">' + (btcToCad / btcAmount * 100).toFixed(2) + '%</span>');
      $('#infos2').replaceWith('<span class="card-title" id="infos2">' + (btcToEth / btcAmount * 100).toFixed(2) + '%</span>');
      $('#infos3').replaceWith('<span class="card-title" id="infos3">' + (ethToCad / ethAmount * 100).toFixed(2) + '%</span>');
      $('#infos4').replaceWith('<span class="card-title" id="infos4">' + (ethToBtc / ethAmount * 100).toFixed(2) + '%</span>');

    });
  }

  callData();

  var timeout = setInterval(callData, 7000);

  //var fee is in percent
  function applyFee(amount, fee) {
    var feeRate = (100 - fee) / 100;
    return amount * feeRate;
  }

});
