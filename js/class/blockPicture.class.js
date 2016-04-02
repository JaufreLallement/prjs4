/**
 * Bloc contenant une image
 */

/**
 * Constructeur de blockPicture
 * @param {double} x               : la position en X du bloc (pourcentage)
 * @param {[double} y              : la position en Y du bloc (pourcentage)
 * @param {[string]} content       : le contenu de l'image
 * @param {[text]} desc            : la légende de l'image
 * @param {[bool]} colorLegend     : la couleur de la légende (true = black ; false = white)
 */
var BlockPicture = function (x, y, content, desc, colorLegend) {
  this.type = "Picture";
	// on détermine le ratio de l'image
	var imgTemp = new Image();
	imgTemp.src = content;
	var widthTemp = imgTemp.width;
	var heightTemp = imgTemp.height;
	var ratio = heightTemp / widthTemp;
	// on converti les px en pourcentage de la taille de l'éditeur
	var width_px_editeur = parseFloat($("#current-slide").css("width"));
	var width_percent_img = (widthTemp / width_px_editeur) * 100;
	var height_px_editeur = parseFloat($("#current-slide").css("height"));
	var height_percent_img = (heightTemp / height_px_editeur) * 100;

	// on réduit si la taille est > 70%
	if (height_percent_img > 70 || width_percent_img > 70) {

	// on recalcule les tailles en px
	if (height_percent_img > width_percent_img) {
	  heightTemp = height_px_editeur / 2;
	  widthTemp = heightTemp / ratio;
	} else {
	  widthTemp = width_px_editeur / 2;
	  heightTemp = widthTemp * ratio;
	}

	// puis on repasse en %
	width_percent_img = (widthTemp / width_px_editeur) * 100;
	height_percent_img = (heightTemp / height_px_editeur) * 100;
	}

	Block.call (this, x, y, width_percent_img, height_percent_img);
	this.content = content;
	this.desc = desc;
  	this.colorLegend = colorLegend;
}

// Héritage
BlockPicture.prototype = new Block();

/**
 * Returne l'aspect HTML de ce bloc (dans l'éditeur)
 * @return {HTML}
 */
BlockPicture.prototype.toHTML = function () {
  var classCol = this.colorLegend ? "legend_black" : "legend_white";
  var res = "<div style='left: " + this.posX + "%; top: " + this.posY + "%; width: " + this.width + "%; height: " + this.height + "%;' class='bloc blockPicture ui-widget-content' id='block-" + this.id + "'>";
  res += "<div class='imageclass'><img src='" + this.content + "'></div>";
  res += "<div class='legend " + classCol + "'>" + this.desc + "</div>";
  res += "</div>";
  return res;
}

/**
 * Retourne l'aspect HTML de ce bloc (pour l'export)
 * @return {HTML}
 */
BlockPicture.prototype.exportHTML = function () {
  var classCol = this.colorLegend ? "legend_black" : "legend_white";
  var res = "<div class='block blockPicture' style='left: " + this.posX + "%; top: " + this.posY + "%; width: " + this.width + "%; height: " + this.height + "%';>";
  res += "<div class='imageclass'><img src='" + this.content + "'></div>";
  res += "<div class='legend " + classCol + "'>" + this.desc + "</div>";
  res += "</div>";
  return res;
}

/**
 * Retourne un clone de ce bloc
 * @return {Block} clone
 */
BlockPicture.prototype.clone = function () {
  var o = new BlockPicture();
  Block.call(o, this.posX, this.posY, this.width, this.height);
  o.content = this.content;
  o.desc = this.desc;
  o.colorLegend = this.colorLegend;
	o.type = this.type;
  return o;
}

