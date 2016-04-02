var jsonToClass=function(source){

  var data = jQuery.parseJSON(source);
  var prest=new Presentation(data.titre);
  var slides=data.slides;
  //console.log(slides);
  var idSMax=0;
  var idBMax=0;
  for (var i=0;i<slides.length;i++){
    var slide =slides[i];
    //console.log(slide);
    var sl=new Slide(slide.titre,slide.position);
    sl.background = slide.background;
    if(slide.id>idSMax)idSMax=slide.id;
    sl.id=slide.id;
    var blocks = slide.blocks;
    for(var j=0;j<blocks.length;j++){
      var block=blocks[j];
      var bl = new window["Block"+block.type];
      jQuery.extend(bl,block);
      if(block.id>idBMax)idBMax=block.id;
      sl.addBlock(bl);
    }
    prest.addSlide(sl);
  }
  slide.lastId=idSMax+1;
  Block.lastId=idBMax+1;
  return prest;
}
