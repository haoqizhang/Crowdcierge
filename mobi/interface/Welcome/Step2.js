// Created by iWeb 2.0.4 local-build-20110312

setTransparentGifURL('Media/transparent.gif');function applyEffects()
{var registry=IWCreateEffectRegistry();registry.registerEffects({stroke_0:new IWPhotoFrame([IWCreateImage('Step2_files/receipt_top_01.png'),IWCreateImage('Step2_files/receipt_top_02.png'),IWCreateImage('Step2_files/receipt_top_03.png'),IWCreateImage('Step2_files/receipt_side_02.png'),IWCreateImage('Step2_files/receipt_bottom_03.png'),IWCreateImage('Step2_files/receipt_bottom_02.png'),IWCreateImage('Step2_files/receipt_bottom_01.png'),IWCreateImage('Step2_files/receipt_side_01.png')],null,2,1.000000,0.000000,2.000000,0.000000,8.000000,1.000000,9.000000,1.000000,41.000000,1.000000,275.000000,1.000000,275.000000,null,null,null,0.500000),stroke_1:new IWPhotoFrame([IWCreateImage('Step2_files/receipt_top_01.png'),IWCreateImage('Step2_files/receipt_top_02.png'),IWCreateImage('Step2_files/receipt_top_03.png'),IWCreateImage('Step2_files/receipt_side_02.png'),IWCreateImage('Step2_files/receipt_bottom_03.png'),IWCreateImage('Step2_files/receipt_bottom_02.png'),IWCreateImage('Step2_files/receipt_bottom_01.png'),IWCreateImage('Step2_files/receipt_side_01.png')],null,2,1.000000,0.000000,2.000000,0.000000,8.000000,1.000000,9.000000,1.000000,41.000000,1.000000,275.000000,1.000000,275.000000,null,null,null,0.500000)});registry.applyEffects();}
function hostedOnDM()
{return false;}
function onPageLoad()
{loadMozillaCSS('Step2_files/Step2Moz.css')
adjustLineHeightIfTooBig('id1');adjustFontSizeIfTooBig('id1');adjustLineHeightIfTooBig('id2');adjustFontSizeIfTooBig('id2');adjustLineHeightIfTooBig('id3');adjustFontSizeIfTooBig('id3');Widget.onload();fixAllIEPNGs('Media/transparent.gif');fixupIECSS3Opacity('id4');applyEffects()}
function onPageUnload()
{Widget.onunload();}
